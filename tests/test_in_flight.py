"""`.agents/in_flight.sh`: an agent sees which branches are taken, and their files."""
import subprocess
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / ".agents" / "in_flight.sh"


def git(cwd, *args):
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.com", *args],
                   cwd=cwd, check=True, capture_output=True)


def clone_with(tmp_path, branches):
    origin, work = tmp_path / "origin.git", tmp_path / "work"
    subprocess.run(["git", "init", "-q", "--bare", "-b", "main", str(origin)], check=True)
    subprocess.run(["git", "clone", "-q", str(origin), str(work)], check=True, capture_output=True)
    (work / "index.html").write_text("a")
    git(work, "add", "."); git(work, "commit", "-qm", "first"); git(work, "push", "-q", "origin", "HEAD:main")
    for name, path in branches:
        git(work, "switch", "-qc", name, "origin/main")
        (work / path).parent.mkdir(parents=True, exist_ok=True)
        (work / path).write_text("b")
        git(work, "add", "."); git(work, "commit", "-qm", name); git(work, "push", "-q", "origin", name)
    git(work, "switch", "-qC", "gemini/mine", "origin/main")
    return work


def run(work):
    return subprocess.run(["sh", str(SCRIPT)], cwd=work, capture_output=True, text=True).stdout


def test_an_unmerged_agent_branch_is_listed_with_its_files(tmp_path):
    out = run(clone_with(tmp_path, [("claude/words", "about/index.html"), ("feature/other", "x.txt")]))
    assert "origin/claude/words: about/index.html" in out
    assert "feature/other" not in out          # only agents' branches are claims


def test_nothing_taken_says_so(tmp_path):
    assert "nothing in flight" in run(clone_with(tmp_path, []))
