"""Tests for kairos-public-profile (Stage 0 security gate + Stage 1 concept lab shell)."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
AI_ERA_DIR = REPO_ROOT / "ai-era"
INDEX_HTML = AI_ERA_DIR / "index.html"
LAB_JS = AI_ERA_DIR / "lab.js"
SECURITY_PROTOCOL = REPO_ROOT / "SECURITY_PROTOCOL.md"

EXTERNAL_URL_RE = re.compile(r"^\s*(?:https?:|//)", re.IGNORECASE)
CSS_IMPORT_RE = re.compile(r"@import\b", re.IGNORECASE)
CSS_URL_RE = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", re.IGNORECASE)


class PageSecurityParser(HTMLParser):
    """Parses HTML to verify CSP, referrer policy, scripts, links, and external URLs."""

    def __init__(self) -> None:
        super().__init__()
        self.csp_values: list[str] = []
        self.referrer_values: list[str] = []
        self.violations: list[str] = []
        self._in_script = False
        self._current_script_src: str | None = None
        self._script_body_chunks: list[str] = []
        self._in_style = False
        self._style_chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {k.lower(): (v or "") for k, v in attrs}

        # Forbid inline event handlers (onclick, onload, etc.)
        for attr_name in attr_map:
            if attr_name.startswith("on"):
                self.violations.append(f"Inline event handler '{attr_name}' on <{tag}>")

        if tag == "meta":
            http_equiv = attr_map.get("http-equiv", "").lower()
            name = attr_map.get("name", "").lower()
            content = attr_map.get("content", "")
            if http_equiv == "content-security-policy":
                self.csp_values.append(content)
            if name == "referrer":
                self.referrer_values.append(content)

        if tag == "script":
            self._in_script = True
            self._current_script_src = attr_map.get("src")
            self._script_body_chunks = []
            if not self._current_script_src:
                self.violations.append("Inline <script> without src attribute is forbidden")
            elif EXTERNAL_URL_RE.match(self._current_script_src):
                self.violations.append(f"External script src: {self._current_script_src}")

        if tag == "style":
            self._in_style = True
            self._style_chunks = []

        # Check resource-loading attributes for external URLs
        resource_attrs = ("src", "action", "poster", "data", "srcset")
        for r_attr in resource_attrs:
            if r_attr in attr_map and EXTERNAL_URL_RE.match(attr_map[r_attr]):
                self.violations.append(f"External {r_attr} on <{tag}>: {attr_map[r_attr]}")

        if tag == "link":
            href = attr_map.get("href", "")
            if EXTERNAL_URL_RE.match(href):
                self.violations.append(f"External <link> href: {href}")

        if tag == "a":
            href = attr_map.get("href", "")
            if EXTERNAL_URL_RE.match(href):
                rel_tokens = set(attr_map.get("rel", "").lower().split())
                if "noopener" not in rel_tokens:
                    self.violations.append(f"Outbound <a> missing rel='noopener': {href}")

    def handle_data(self, data: str) -> None:
        if self._in_script:
            self._script_body_chunks.append(data)
        if self._in_style:
            self._style_chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._in_script:
            body = "".join(self._script_body_chunks).strip()
            if body:
                self.violations.append("Non-empty inline <script> body is forbidden")
            self._in_script = False
            self._current_script_src = None
        if tag == "style" and self._in_style:
            css_text = "".join(self._style_chunks)
            self.violations.extend(check_css_security(css_text))
            self._in_style = False


def check_css_security(css_text: str) -> list[str]:
    """Return violations for any @import or external url(...) in CSS."""
    violations: list[str] = []
    if CSS_IMPORT_RE.search(css_text):
        violations.append("CSS @import is forbidden")
    for match in CSS_URL_RE.finditer(css_text):
        target = match.group(1).strip()
        if EXTERNAL_URL_RE.match(target):
            violations.append(f"External CSS url(): {target}")
    return violations


def validate_html_security(html_text: str) -> list[str]:
    """Validate an HTML document against SECURITY_PROTOCOL.md Section 3."""
    parser = PageSecurityParser()
    parser.feed(html_text)
    violations = list(parser.violations)

    if len(parser.csp_values) != 1:
        violations.append(f"Expected exactly 1 Content-Security-Policy meta tag, found {len(parser.csp_values)}")
    else:
        csp = parser.csp_values[0]
        required_directives = [
            "default-src 'none'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "base-uri 'none'",
            "form-action 'none'",
            "connect-src 'none'",
        ]
        for directive in required_directives:
            if directive not in csp:
                violations.append(f"CSP missing required directive: {directive}")
        if "http:" in csp or "https:" in csp or "unsafe-eval" in csp:
            violations.append(f"CSP contains forbidden host or unsafe-eval: {csp}")

    if parser.referrer_values != ["no-referrer"]:
        violations.append(f"Expected <meta name='referrer' content='no-referrer'>, found {parser.referrer_values}")

    return violations


# ── Stage 0: Security Protocol & Page Gate Tests ─────────────────────────────


def test_security_protocol_amended_for_local_js() -> None:
    text = SECURITY_PROTOCOL.read_text(encoding="utf-8")
    assert "script-src 'self'" in text
    assert "connect-src 'none'" in text


def test_all_repo_pages_and_stylesheets_pass_security_gate() -> None:
    html_files = sorted(REPO_ROOT.rglob("*.html"))
    assert html_files, "Expected at least one HTML file in repository"
    for html_path in html_files:
        violations = validate_html_security(html_path.read_text(encoding="utf-8"))
        assert not violations, f"{html_path.relative_to(REPO_ROOT)} failed security check: {violations}"

    for css_path in sorted(REPO_ROOT.rglob("*.css")):
        css_violations = check_css_security(css_path.read_text(encoding="utf-8"))
        assert not css_violations, f"{css_path.relative_to(REPO_ROOT)} failed CSS check: {css_violations}"


@pytest.mark.parametrize(
    "planted_snippet,expected_match",
    [
        ('<script src="https://cdn.example.com/app.js"></script>', "External script src"),
        ("<script>console.log(1)</script>", "Inline <script>"),
        ('<link rel="stylesheet" href="https://fonts.googleapis.com/css">', "External <link> href"),
        ('<img src="https://tracker.example.com/pixel.gif">', "External src on <img>"),
        ('<style>@import url("https://example.com/a.css");</style>', "CSS @import"),
        ('<style>body { background: url("https://example.com/bg.png"); }</style>', "External CSS url()"),
        ('<a href="https://substack.com">Read</a>', "missing rel='noopener'"),
        ('<button onclick="run()">Go</button>', "Inline event handler"),
    ],
)
def test_security_gate_rejects_planted_outside_links_and_inline_scripts(
    planted_snippet: str, expected_match: str
) -> None:
    base_html = INDEX_HTML.read_text(encoding="utf-8")
    planted_html = base_html.replace("</body>", f"{planted_snippet}</body>")
    violations = validate_html_security(planted_html)
    assert any(expected_match in v for v in violations), (
        f"Expected violation matching '{expected_match}' for snippet {planted_snippet!r}, got {violations}"
    )


# ── Stage 1: Digital Concept Lab Shell, Mode Toggle & Role Router ────────────


def test_stage1_shell_structure_and_chambers_present() -> None:
    html = INDEX_HTML.read_text(encoding="utf-8")
    assert LAB_JS.exists(), "Expected ai-era/lab.js to exist"

    # Top Telemetry Bar
    assert "ONLINE // V1.0" in html
    assert "Playable Lab Mode" in html
    assert "Manifesto / Lore Mode" in html

    # Central Workbench Hero
    assert "Don’t just read the AI Era. Stress-test it." in html or "Don't just read the AI Era. Stress-test it." in html
    for role in ("Builder", "Strategist", "Philosopher", "Overwhelmed Leader"):
        assert role in html, f"Missing Role Router button for {role}"

    # 4 Core Lab Chambers (2x2 Bento Grid)
    expected_chambers = [
        ("EXP-01", "The Red Queen", "The Next Gateway"),
        ("EXP-02", "The Alignment Crucible", "AI Ethics as a Design Language"),
        ("EXP-03", "The Citadel Diagnostic", "Garden in the Citadel"),
        ("EXP-04", "The Architect", "Workflow"),
    ]
    for exp_id, proto_name, pillar in expected_chambers:
        assert exp_id in html, f"Missing chamber ID {exp_id}"
        assert proto_name in html, f"Missing prototype title {proto_name}"
        assert pillar in html, f"Missing pillar {pillar}"


def test_stage1_interactive_mode_toggle_and_role_router_in_node() -> None:
    """Execute lab.js against a minimal DOM harness in Node to verify Stage 1 interactions."""
    node_script = """
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const labJs = fs.readFileSync(process.argv[1], 'utf8');

// Load lab.js and exercise its pure state + DOM controller functions
const sandbox = { console, module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
vm.runInContext(labJs, sandbox);

const api = sandbox.module.exports;
if (!api || typeof api.createLabController !== 'function') {
  throw new Error('lab.js must export createLabController for deterministic testing');
}

const ctrl = api.createLabController();

// 1. Default state: Playable Lab Mode, 4 active experiments, no role selected yet
if (ctrl.getState().mode !== 'lab') {
  throw new Error('Expected initial mode to be lab, got ' + ctrl.getState().mode);
}
if (ctrl.getState().experimentCount !== 4) {
  throw new Error('Expected 4 active experiments');
}

// 2. Toggle mode between Playable Lab Mode ('lab') and Manifesto / Lore Mode ('lore')
ctrl.setMode('lore');
if (ctrl.getState().mode !== 'lore') {
  throw new Error('Expected mode to switch to lore');
}
ctrl.setMode('lab');
if (ctrl.getState().mode !== 'lab') {
  throw new Error('Expected mode to switch back to lab');
}

// 3. Role router maps each visitor state/role to its target chamber
const expectedRoutes = {
  builder: 'EXP-02',
  strategist: 'EXP-01',
  philosopher: 'EXP-03',
  leader: 'EXP-04',
};

for (const [role, expectedChamber] of Object.entries(expectedRoutes)) {
  const routed = ctrl.selectRole(role);
  if (routed.activeRole !== role || routed.highlightedChamber !== expectedChamber) {
    throw new Error(`Role ${role} routed to ${JSON.stringify(routed)}, expected ${expectedChamber}`);
  }
}

console.log('STAGE1_OK');
"""
    res = subprocess.run(
        ["node", "-e", node_script, str(LAB_JS)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert res.returncode == 0 and "STAGE1_OK" in res.stdout, (
        f"Node interaction test failed:\nSTDOUT: {res.stdout}\nSTDERR: {res.stderr}"
    )
