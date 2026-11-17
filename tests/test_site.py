"""Tests for kairos-public-profile (Stage 0 security gate + Graphic Town & Lab prototype)."""

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


def test_custom_domain_and_root_hosting_setup() -> None:
    """Verify CNAME, .nojekyll, and root symlinks so https://ai-era.co/ serves the Polis directly."""
    cname_path = REPO_ROOT / "CNAME"
    nojekyll_path = REPO_ROOT / ".nojekyll"
    root_index = REPO_ROOT / "index.html"
    root_lab_js = REPO_ROOT / "lab.js"

    assert cname_path.exists(), "Expected root CNAME file for GitHub Pages custom domain"
    assert cname_path.read_text(encoding="utf-8").strip() == "ai-era.co"
    assert nojekyll_path.exists(), "Expected .nojekyll at repo root for static GitHub Pages serving"
    assert root_index.is_symlink() and root_index.resolve() == INDEX_HTML.resolve()
    assert root_lab_js.is_symlink() and root_lab_js.resolve() == LAB_JS.resolve()


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


# ── Graphic Town Prototype & Interactive Lab Tests ───────────────────────────


def test_graphic_town_and_lab_structure_present() -> None:
    html = INDEX_HTML.read_text(encoding="utf-8")
    assert LAB_JS.exists(), "Expected ai-era/lab.js to exist"

    # Top-left architectural masthead ('AI Era') + question & inquiries present; old tracking bar removed
    assert 'class="top-header-bar site-header"' in html
    assert 'class="polis-canvas island-stage map-container"' in html
    assert "@media (max-width: 768px)" in html
    assert "@media (max-width: 900px)" in html
    assert "scale(1.38) translateY(2%)" in html
    assert "@media (max-width: 480px)" in html
    assert "scale(1.48) translateY(3%)" in html
    assert 'aside[aria-live="polite"][data-open="false"]' in html
    assert 'aside[aria-live="polite"][data-open="true"]' in html
    assert 'class="building-pill-inner"' in html
    assert 'class="brand-title">AI Era<' in html
    assert 'class="brand-lockup brand-masthead"' in html
    assert 'class="brand-question">How do we live well, build, and flourish in an AI-native world?<' in html
    assert (
        'class="brand-inquiries">Four inquiries into civilizational history, '
        'ethical design, Stoic philosophy, and the craft of work.<'
    ) in html
    assert "ONLINE // V1.0" not in html
    assert "waterfall-grad" not in html

    # Consolidated top-right menu & Mode Toggle (Manifesto removed from top-right pill and DOM)
    nav_match = re.search(r'<nav class="consolidated-menu[^"]*"[^>]*>(.*?)</nav>', html, re.DOTALL)
    assert nav_match, "Expected consolidated top-right navigation menu"
    nav_html = nav_match.group(1)
    assert "Manifesto" not in nav_html
    for item in ("Polis Map", "Card Grid", "About Me", "Day"):
        assert item in nav_html, f"Expected '{item}' in top-right navigation pill"
    assert 'data-view="lab"' in html
    assert 'data-view="lore"' not in html
    assert 'aria-label="AI Era Manifesto"' not in html
    assert 'data-chamber-panel="HARBOR"' not in html

    # Interactive Graphic Town Map SVG & Buildings (including HARBOR -> About Me and isometric routes)
    assert 'id="citadel-town-map"' in html
    assert 'id="town-explorer"' in html
    assert 'id="world-camera"' in html
    for building_id in ("EXP-01", "EXP-02", "EXP-03", "EXP-04", "HARBOR"):
        assert f'data-building-id="{building_id}"' in html, f"Missing town building {building_id}"
    for route_path in ("/about", "/builder", "/strategist", "/philosopher", "/practitioner"):
        assert f'data-route="{route_path}"' in html, f"Missing isometric landmark route {route_path}"
        assert f'href="{route_path}/"' in html, f"Missing Enter button href='{route_path}/'"
    assert 'id="drawer-link"' in html
    assert "About Me" in html
    assert 'class="floating-bottom-dock"' not in html

    # Simplified five building cards (4 topic cards + Harbor Stoa: About Me card)
    expected_topic_cards = [
        (
            "The Strategist: The Next Gateway",
            "I'm a historian by training, and I think we are standing in front of another one-way gateway.",
        ),
        (
            "The Builder: Applied AI Ethics",
            "Most AI ethics tells you what not to build. I keep getting stuck on the question it leaves open: what is an ethical AI product good for?",
        ),
        (
            "The Philosopher: Garden in the Citadel",
            "What belongs in that garden is the question I keep bringing to the timeless works of Stoic philosophy.",
        ),
        (
            "The Practitioner: Kairos OS",
            "The Greeks had two words for time. Chronos is the clock: schedules, backlogs, throughput.",
        ),
        (
            "Harbor Stoa: About Me",
            "I’m Nikolaus Klassen. My path to the AI era started in the humanities, with a PhD in Classics and Cultural History",
        ),
    ]
    lab_js_text = LAB_JS.read_text(encoding="utf-8")
    for card_title, card_snippet in expected_topic_cards:
        assert card_title in html and card_title in lab_js_text, f"Missing topic card title: {card_title}"
        assert card_snippet in html and card_snippet in lab_js_text, f"Missing topic card copy: {card_snippet}"

    # Verify all 5 interior subpages and sanitized portrait photo exist
    for slug in ("strategist", "builder", "philosopher", "practitioner", "about"):
        subpage = REPO_ROOT / slug / "index.html"
        assert subpage.exists(), f"Missing interior page {slug}/index.html"
        sub_html = subpage.read_text(encoding="utf-8")
        assert 'href="/"' in sub_html and "Return to the Polis" in sub_html

    profile_img = REPO_ROOT / "assets" / "profile.jpg"
    assert profile_img.exists(), "Expected /assets/profile.jpg for /about/ page"
    img_header = profile_img.read_bytes()[:1024]
    for forbidden_exif in (b"SM-G970U", b"2021:08:05", b"L12XLLD00SM", b"\x25\x88"):
        assert forbidden_exif not in img_header, f"Private EXIF/GPS tag {forbidden_exif!r} still present in profile.jpg"

    # Landmark roles represented across the Polis
    for role in ("Builder", "Strategist", "Philosopher", "Practitioner"):
        assert role in html, f"Missing landmark role {role}"

    # Visual polish & pill refinement: centered island viewBox, 5 tightly fitted plinth-anchored pill badges
    # in '[Building Name] - /[lowercase-persona]' format, no 1px leader lines, SE footpath, layered horizon,
    # terracotta roof ribbing, and Horologion sundial
    assert 'viewBox="0 -30 1600 980"' in html
    expected_pills = [
        ("Acropolis", "/strategist"),
        ("Horologion", "/practitioner"),
        ("Artisan Forge", "/builder"),
        ("Garden in the Citadel", "/philosopher"),
        ("Harbor Stoa", "/about"),
    ]
    for bld_name, persona_slug in expected_pills:
        expected_aria = f'aria-label="{bld_name} - {persona_slug}"'
        expected_tspan = (
            f'<tspan class="pill-name">{bld_name}</tspan>'
            f'<tspan class="pill-sep"> - </tspan>'
            f'<tspan class="building-pill-route"'
        )
        assert expected_aria in html, f"Missing landmark aria-label: {expected_aria}"
        assert expected_tspan in html and f">{persona_slug}</tspan>" in html, (
            f"Missing pill text '{bld_name} - {persona_slug}'"
        )
    assert "building-leader-line" not in html
    assert 'id="se-slope-footpath"' in html
    assert 'id="horizon-islands"' in html
    assert 'class="terracotta-ribbing"' in html
    assert 'id="horologion-sundial"' in html


def test_graphic_town_navigation_in_node() -> None:
    """Verify town building navigation, avatar coordinates and camera, and that the retired simulators are gone."""
    node_script = """
const fs = require('fs');
const vm = require('vm');

const labJs = fs.readFileSync(process.argv[1], 'utf8');
const sandbox = { console, module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
vm.runInContext(labJs, sandbox);

const api = sandbox.module.exports;
if (!api || typeof api.createLabController !== 'function') {
  throw new Error('lab.js must export createLabController');
}

const ctrl = api.createLabController();

// 1. Default state: lab mode, town view active, explorer at Agora or initial building
if (ctrl.getState().mode !== 'lab') {
  throw new Error('Expected initial mode to be lab');
}

// 2. Visiting each building (including HARBOR -> About Me) moves the explorer, zooms camera, and opens that chamber
for (const expId of ['EXP-01', 'EXP-02', 'EXP-03', 'EXP-04', 'HARBOR']) {
  const st = ctrl.visitBuilding(expId);
  if (st.activeChamber !== expId) {
    throw new Error(`Expected activeChamber=${expId}, got ${st.activeChamber}`);
  }
  if (!st.explorerPos || typeof st.explorerPos.x !== 'number' || typeof st.explorerPos.y !== 'number') {
    throw new Error(`Expected numeric explorerPos for ${expId}`);
  }
  if (!st.camera || st.camera.zoom <= 1) {
    throw new Error(`Expected camera to zoom in when visiting ${expId}`);
  }
}

const overviewState = ctrl.resetCamera();
if (overviewState.camera.zoom !== 1 || overviewState.drawerOpen !== false) {
  throw new Error('Expected resetCamera() to return zoom=1 and close drawer');
}

// 2b. Hovering a landmark reveals the floating detail card (cardVisible=true) with route, roleSubtitle, and thesis
const hoverState = ctrl.hoverBuilding('/practitioner');
if (!hoverState.cardVisible || hoverState.previewInfo.route !== '/practitioner' || !hoverState.previewInfo.thesis) {
  throw new Error('Expected hoverBuilding(/practitioner) to reveal floating detail card with thesis');
}

// 3. The retired Stage 1 simulators and role router are gone from the API
for (const removed of ['selectRole', 'chooseRedQueenOption', 'toggleFrictionCard', 'selectCitadelTrap', 'selectForgeLens']) {
  if (removed in ctrl) {
    throw new Error(`Expected retired API ${removed} to be removed from lab.js`);
  }
}
if ('ROLE_ROUTES' in api) {
  throw new Error('Expected ROLE_ROUTES to be removed from lab.js exports');
}

console.log('TOWN_PROTOTYPE_OK');
"""
    res = subprocess.run(
        ["node", "-e", node_script, str(LAB_JS)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert res.returncode == 0 and "TOWN_PROTOTYPE_OK" in res.stdout, (
        f"Node town prototype test failed:\nSTDOUT: {res.stdout}\nSTDERR: {res.stderr}"
    )


# ── Polish: photo weight, dead code, reduced motion, sharing metadata ─────────

SITE = "https://ai-era.co"
PAGES = {
    # page file -> its canonical path on the site
    INDEX_HTML: "/",
    REPO_ROOT / "about" / "index.html": "/about/",
    REPO_ROOT / "strategist" / "index.html": "/strategist/",
    REPO_ROOT / "builder" / "index.html": "/builder/",
    REPO_ROOT / "philosopher" / "index.html": "/philosopher/",
    REPO_ROOT / "practitioner" / "index.html": "/practitioner/",
}
CLASS_SELECTOR_RE = re.compile(r"\.(-?[a-zA-Z_][\w-]*)")


def _jpeg_segments(data: bytes) -> list[tuple[int, int, int]]:
    """(marker, offset, length) of every JPEG header segment before the scan."""
    segments, i = [], 2
    while i + 4 <= len(data) and data[i] == 0xFF and data[i + 1] != 0xDA:
        length = int.from_bytes(data[i + 2 : i + 4], "big")
        segments.append((data[i + 1], i, length))
        i += 2 + length
    return segments


def test_profile_photo_is_sized_for_its_slot_and_carries_no_metadata() -> None:
    """The portrait shows at 180x220 css px; 480x640 covers a 2x screen. No EXIF at all."""
    data = (REPO_ROOT / "assets" / "profile.jpg").read_bytes()
    assert len(data) < 120_000, f"profile.jpg is {len(data)} bytes; resize it"
    segments = _jpeg_segments(data)
    assert not [s for s in segments if s[0] == 0xE1], "profile.jpg still has an APP1 (EXIF/XMP) segment"
    sof = next(s for s in segments if s[0] in (0xC0, 0xC2))
    height = int.from_bytes(data[sof[1] + 5 : sof[1] + 7], "big")
    width = int.from_bytes(data[sof[1] + 7 : sof[1] + 9], "big")
    assert max(width, height) <= 800, f"profile.jpg is {width}x{height}; 480x640 is enough"


@pytest.mark.parametrize("page", list(PAGES), ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_every_css_class_a_page_styles_is_used(page: Path) -> None:
    html = page.read_text(encoding="utf-8")
    css = "".join(re.findall(r"<style>(.*?)</style>", html, re.DOTALL))
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
    markup = html.split("</style>")[-1]
    if page == INDEX_HTML:
        markup += LAB_JS.read_text(encoding="utf-8")
    unused = sorted(
        c for c in set(CLASS_SELECTOR_RE.findall(css))
        if not re.search(r"(?<![\w-])" + re.escape(c) + r"(?![\w-])", markup)
    )
    assert not unused, f"{page.relative_to(REPO_ROOT)} styles classes nothing uses: {unused}"


def test_lab_js_reads_no_element_the_page_lacks() -> None:
    """Every id lab.js looks up exists in the page, so no dead render branch survives."""
    html = INDEX_HTML.read_text(encoding="utf-8")
    js = LAB_JS.read_text(encoding="utf-8")
    missing = sorted(
        i for i in set(re.findall(r'getElementById\("([^"]+)"\)', js)) if f'id="{i}"' not in html
    )
    assert not missing, f"lab.js looks up ids the page does not have: {missing}"
    for attr in set(re.findall(r'querySelectorAll\("\[(data-[\w-]+)\]"\)', js)):
        assert f"{attr}=" in html, f"lab.js binds [{attr}] but the page has none"


@pytest.mark.parametrize("page", list(PAGES), ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_motion_stops_for_visitors_who_ask_for_less(page: Path) -> None:
    html = page.read_text(encoding="utf-8")
    if re.search(r"\b(transition|animation)\s*:", html):
        block = re.search(r"@media \(prefers-reduced-motion: reduce\)\s*\{(.*?)\n\s*\}", html, re.DOTALL)
        assert block, f"{page.relative_to(REPO_ROOT)} animates but has no prefers-reduced-motion rule"
        assert "animation" in block.group(1) and "transition" in block.group(1)
    if page == INDEX_HTML:
        js = LAB_JS.read_text(encoding="utf-8")
        assert "prefers-reduced-motion: reduce" in js, "lab.js must skip the parallax for reduced motion"


@pytest.mark.parametrize("page,path", list(PAGES.items()), ids=list(PAGES.values()))
def test_every_page_has_a_canonical_url_share_card_and_icon(page: Path, path: str) -> None:
    html = page.read_text(encoding="utf-8")
    head = html.split("</head>")[0]

    def meta(attr: str, key: str) -> str:
        m = re.search(rf'<meta {attr}="{re.escape(key)}" content="([^"]*)"', head)
        assert m, f"{page.relative_to(REPO_ROOT)} lacks <meta {attr}={key!r}>"
        return m.group(1)

    assert f'<link rel="canonical" href="{path}">' in head
    assert meta("property", "og:url") == SITE + path
    assert meta("property", "og:type") in ("website", "profile", "article")
    assert meta("property", "og:title")
    assert meta("property", "og:description") == meta("name", "description")
    assert meta("property", "og:image") == SITE + "/assets/og-card.png"
    assert meta("name", "twitter:card") == "summary_large_image"
    assert '<link rel="icon" href="/favicon.svg" type="image/svg+xml">' in head
    assert (REPO_ROOT / "favicon.svg").exists()


def test_share_card_is_a_1200x630_png() -> None:
    data = (REPO_ROOT / "assets" / "og-card.png").read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    width, height = int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")
    assert (width, height) == (1200, 630)
    assert len(data) < 300_000


# ── Mobile polish (2026-11-16): view switch, quick-select row, Enter first, pills, divider ──

BUILDING_IDS = ("EXP-01", "EXP-02", "EXP-03", "EXP-04", "HARBOR")


def _phone_css(html: str) -> str:
    """Every rule inside a max-width: 768px block."""
    out = []
    for m in re.finditer(r"@media \(max-width: 768px\)\s*\{", html):
        depth, i = 1, m.end()
        while depth:
            depth += {"{": 1, "}": -1}.get(html[i], 0)
            i += 1
        out.append(html[m.end() : i - 1])
    return "\n".join(out)


def test_hidden_view_stays_hidden_on_phones() -> None:
    """A phone rule forcing display:flex must not re-show the hidden map (Card Grid bug)."""
    phone = _phone_css(INDEX_HTML.read_text(encoding="utf-8"))
    for rule in re.finditer(r"([^{}]+)\{([^{}]*)\}", phone):
        selectors, body = rule.group(1), rule.group(2)
        if re.search(r"display:\s*(?!none)[\w-]+\s*!important", body):
            for sel in selectors.split(","):
                if "polis-viewport" in sel or "polis-layout" in sel or "section" in sel:
                    assert ":not([hidden])" in sel, f"phone rule re-shows hidden views: {sel.strip()}"


def test_menu_divider_is_not_padded_like_a_button() -> None:
    phone = _phone_css(INDEX_HTML.read_text(encoding="utf-8"))
    assert ".site-nav > *" not in phone, "the padding rule must target the buttons, not the divider"


def test_phone_quick_select_row_offers_all_five_buildings() -> None:
    html = INDEX_HTML.read_text(encoding="utf-8")
    m = re.search(r'<nav class="polis-quick-select"[^>]*>(.*?)</nav>', html, re.DOTALL)
    assert m, "Expected the quick-select row under the map"
    row = m.group(1)
    for bid in BUILDING_IDS:
        assert f'data-visit-building="{bid}"' in row, f"quick-select row lacks {bid}"
    phone = _phone_css(html)
    assert re.search(r"(?<![\w-])\.polis-quick-select\s*\{[^}]*display:\s*none", html.split("@media")[0]), (
        "the row is phone-only: hidden by default"
    )
    assert re.search(r"\.polis-quick-select\s*\{[^}]*display:\s*(flex|block|grid)", phone)
    assert 'aside[aria-live="polite"][data-open="true"] ~ .polis-quick-select' in phone, (
        "the row steps aside while a building's card is open"
    )


def test_enter_button_comes_before_the_summary_on_phones() -> None:
    phone = _phone_css(INDEX_HTML.read_text(encoding="utf-8"))
    actions = re.search(r"\.floating-card-summary \.card-actions\s*\{[^}]*order:\s*(\d+)", phone)
    thesis = re.search(r"\.floating-card-summary \.floating-card-thesis\s*\{[^}]*order:\s*(\d+)", phone)
    assert actions and thesis and int(actions.group(1)) < int(thesis.group(1))


def test_phone_pills_show_names_only_and_the_explorer_steps_aside() -> None:
    html = INDEX_HTML.read_text(encoding="utf-8")
    pills = re.findall(r'<g class="building-pill-inner">(.*?)</g>', html, re.DOTALL)
    assert len(pills) == 5
    for pill in pills:
        assert "pill-bg-full" in pill and "pill-bg-short" in pill, "each pill needs a full and a name-only background"
    phone = _phone_css(html)
    for hidden in (".pill-sep", ".building-pill-route", ".pill-bg-full", "#town-explorer"):
        assert re.search(rf"{re.escape(hidden)}[^{{]*\{{[^}}]*display:\s*none", phone), f"{hidden} must hide on phones"
