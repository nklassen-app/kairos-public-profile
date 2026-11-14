---
description: End a session in this repo (Antigravity). Run it before you stop.
---

1. Run the repo's tests (`python3 -m pytest -q`); they must pass. A change that honestly needs no test says why in a `No-test: <reason>` line in the commit message.
2. Before anything is committed, read `git diff --staged` for real people's names (the possessive form too), keys, tokens or personal data: this repo is public. If you find any, stop and tell N.
3. Commit on your `gemini/…` branch. End the message with your model's trailer: `Co-Authored-By: <your model name> <noreply@google.com>`.
4. Never push and never merge: N. reviews the branch and pushes it.
5. Tell N. what you did, what was tested, and what waits on them. Then give one piece of feedback on how N. worked with you this session: specific, one or two sentences, never praise.
