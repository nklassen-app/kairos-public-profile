# Hand-over: how work is done in this repo, for every agent

*Written 2026-11-22 by a Claude Code session on N.'s ask, for the agent
working in Antigravity (`agy`). It is the one page that carries the process
the Claude Code sessions use, so you can work the same way, and the rule
that keeps two agents out of each other's work. `AGENTS.md` at the repo
root is the rulebook and wins every conflict with this page. This repo is
public: so is this page.*

## 1. Two agents, one repo: who does what

| | Antigravity (Gemini) | Claude Code |
|---|---|---|
| **Lane** | How the site looks and behaves: layout, styles, the map, interactions, the lab modules of `ai-era/SPEC.md` | The words (the text of the rooms and the About page), the domain, security, counting visits, the tests of the security gate |
| **Files that are yours** | `index.html`, `lab.js`, `ai-era/`, `assets/`, `favicon.svg` | `SECURITY_PROTOCOL.md`, `CNAME`, `.well-known/`, `.claude/`, `README.md`, the security tests in `tests/test_site.py` |
| **Shared files** | The room pages and `about/`: structure and style | The room pages and `about/`: the text |
| **Reaches GitHub** | Never pushes. Commits on `gemini/<topic>`; N. pushes the branch | Pushes `claude/<topic>` and opens a pull request; N. merges |

*(The lanes are a default set on 2026-11-22; N. changes them by saying so,
and the change is written here.)*

Three rules follow from the table:

1. **Stay in your lane.** A task that needs a file of the other lane: stop
   and tell N. Do not do the other agent's part "while you are there".
2. **In a shared file, change only your half.** A style change does not
   reword text; a text change does not touch structure or style. Keep such
   commits small, one concern each: small commits merge, large ones collide.
3. **Never edit the other agent's configuration** (`.claude/` is Claude
   Code's, `.agents/` and `~/.gemini` are yours) or the rule files
   (`AGENTS.md`, `CLAUDE.md`: copies of a master N. owns).

## 2. Before you start: see what is taken

A branch on GitHub whose content is not on main is a claim: someone is working there.
`session-start.md` lists them with the files each touches:

```bash
sh .agents/in_flight.sh
```

If a listed branch touches a file you are about to change, stop and tell
N. which branch and which file. N. decides who goes first.

Your own work is invisible to Claude Code until N. pushes your branch. So:
name the branch for the task (`gemini/strategist-room-layout`), and when
you end a session with work unfinished, say so to N. in one line with the
files you touched, so N. can push the branch as the claim.

## 3. Before you hand off: fit onto main

Main moves while you work. `session-end.md` has the steps; the rule is:
fetch, **merge** `origin/main` into your branch (never rebase: history is
never rewritten), run the tests, and only then tell N. it is ready. A
conflict you cannot resolve with certainty: stop and show N. both sides.

## 4. The process, in the order of a piece of work

1. **A story leads with its definition of done**: what N. can do or see on
   the live site when it is finished, in one or two plain sentences. No
   such sentence, no story yet: ask N. for it.
2. **Small enough to try in one session.** If it is wider, say so before
   building and split it.
3. **Test first.** Write the failing test from the definition of done
   (`tests/`, run with `python3 -m pytest -q`), see it fail, then build. A
   change that honestly needs none says why in a `No-test: <reason>` line
   of the commit message. Never loosen or skip a test to pass; the security
   tests (the CSP, no third-party calls, no inline handlers) are a gate.
4. **The smallest thing that works.** No framework, build step, web font,
   CDN, analytics or embed; no new dependency without N.'s yes.
5. **The agent does the work, N. decides.** Before you ask N. to run, read,
   check or paste anything, run the step check
   (`.agents/skills/step-check/SKILL.md`). A decision goes to N. with your
   recommendation.
6. **Before the hand-off, the boundary check**
   (`.agents/skills/boundary-check/SKILL.md`): a fresh subagent reads your
   diff against `AGENTS.md`; its one-line verdict goes first in what you
   tell N.
7. **Commit** on your branch with your model's trailer. Tell N. what was
   done, what was tested and what waits on N.; then one piece of feedback
   on how N. worked with you, specific, never praise.

## 5. Your own guard rails

You set these up yourself, once: `.agents/workflows/setup.md`. N. only
looks at the result.

## 6. What you do not have, on purpose

The backlog, the Charter and the registry live in a private repo above
your row. You do not need them: N. names your task in the session, and
everything you must follow is in `AGENTS.md` and on this page. If a task
seems to need something from there, stop and say so.
