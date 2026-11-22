---
name: boundary-check
description: Read your own change against AGENTS.md before you hand it to N. A fresh subagent reviews the diff and gives a one-line verdict. Use every time before you tell N. a branch is ready.
---

# The boundary check

N. pushes what you hand off, to a public repository. Reading every diff
against the rules is checking output, which is not N.'s work. So a fresh
subagent that did not write the change reads it first, and its verdict goes
first in what you tell N. It is a second opinion, not a lock: the tests and
N.'s push are the locks.

## How

1. `git fetch origin`, then the diff of your branch against `origin/main`
   and the list of files.
2. Hand the diff to a fresh subagent with the brief below. Give it the
   diff, not your account of it.
3. Fix what it finds if it is right. If you think it is wrong, keep it in
   the verdict and say why. Never drop a finding silently.
4. First line of your hand-off: `boundary check: clear` and what was
   looked at, or `boundary check: 2 open` and each finding in one line. A
   finding about privacy, a real person or a rule file stays open until N.
   answers.

## The brief (give it whole)

> You are reviewing a change to a public repository before it is handed to
> N., the owner. You did not write it. Read the diff, and read `AGENTS.md`
> at the repo root for yourself. Do not edit anything.
>
> Look for: **anything a stranger should not read** (a real person's name,
> the possessive form too; an address, an account, an amount; anything
> personal or strategic about N.); **a way out** (a call to a third party,
> a web font, a CDN, analytics, an embed, a new dependency; anything the
> page's Content-Security-Policy would have to be loosened for);
> **weakening** (a test loosened or skipped, the CSP widened, a deny rule
> or a rule file changed); **the other lane** (a file or a concern that
> `.agents/HANDOFF.md` gives to the other agent); **work put on N.** that a
> session could do; **code with no test** that would have failed without
> it; anything speculative.
>
> Report only what you would stake the review on: the file and line, the
> rule and where it is written, what is wrong in one sentence, and whether
> it is the session's to fix or N.'s to decide. No style notes, no praise.
> Last line: `boundary check: clear` or `boundary check: N open`.
