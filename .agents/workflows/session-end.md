---
description: End a session in this repo (Antigravity). Run it before you stop.
---

1. Fit onto main: `git fetch origin`, then `git merge origin/main` into your branch (never rebase). A conflict you cannot resolve with certainty: stop and show N. both sides.
2. Run the repo's tests (`python3 -m pytest -q`); they must pass. A change that honestly needs no test says why in a `No-test: <reason>` line in the commit message.
3. Before anything is committed, read `git diff --staged` for real people's names (the possessive form too), keys, tokens or personal data: this repo is public. If you find any, stop and tell N.
4. Commit on your `gemini/…` branch. End the message with your model's trailer: `Co-Authored-By: <your model name> <noreply@google.com>`.
5. Run the boundary check (`.agents/skills/boundary-check/SKILL.md`) on the whole branch against `origin/main`.
6. Never push, and never merge into main: N. reviews the branch and pushes it.
7. Tell N., boundary check first: what you did, what was tested, the branch and the files it touches (so N. can push it as your claim), and what waits on them. Anything you ask of N. has been through `.agents/skills/step-check/SKILL.md`. Then give one piece of feedback on how N. worked with you this session: specific, one or two sentences, never praise.
