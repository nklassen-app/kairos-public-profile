---
description: Start a session in this repo, for an agent whose row stops at Public data (Antigravity). Run it first, every session.
---

1. Read `AGENTS.md` in this repo, all of it. Your row is in §0: this repo only, Public and synthetic data only, commit but never push.
2. Never open a file outside this repo's folder, and never run `kairos-foundation/scripts/session_start.sh` (it shows content above your row).
3. Run `git fetch` and then `git status -sb`.
   - Behind and nothing of yours to keep: `git merge --ff-only @{u}`.
   - Diverged, or anything that doesn't fast-forward: stop and tell N.
4. If there are uncommitted changes or unpushed commits you didn't make in this session, stop and ask N. whose they are. Never commit, stash, revert or build on them.
5. Read `.agents/HANDOFF.md`: the lanes (which files are yours, which are Claude Code's) and how work is done here. In your first session, run `.agents/workflows/setup.md` before anything else.
6. See what is taken. Each line is a branch someone is working on and the files it touches:
   `sh .agents/in_flight.sh`
   If one touches a file your task needs, stop and tell N. the branch and the file.
7. Start or switch to a branch named for you: `git switch -c gemini/<short-topic>` (or `git switch gemini/<short-topic>`).
8. Tell N., in two or three lines, what the last commits did (`git log --oneline -5`), what is taken (step 6), and what you will do this session and in which files.
