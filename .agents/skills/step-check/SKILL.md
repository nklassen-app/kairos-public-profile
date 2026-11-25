---
name: step-check
description: Check a step before it goes to N. — a fresh look at whether the session could do it itself, build a check where the data is, or drop it. Use every time, before you ask N. to run, read, check, count, paste, carry or look over anything, and before a step on N. is written into the backlog. Not for a decision that is plainly N.'s (privacy, the boundary, money, taste), which goes to N. with a recommendation as always.
---

# The step check

The rule is `AGENTS.md` section 4: the agent does the work, and N. decides.
A session that wants N. to do something is the worst judge of whether N.
must: it has already concluded that it can't. So before the ask goes out,
a fresh subagent that has not reached that conclusion reads the ask and
tries to take every line of it off N. This file's master is
`kairos-foundation/skills/step-check/SKILL.md` (Second agent 2); the copy in
`kairos-public-profile/.agents/skills/` is generated from it by
`sync_claude_md.sh`, for the agent there, which cannot read the master;
that repo is public, so the copy leaves out the brief's paragraph on what
the places can do (N., 2026-11-22).

## When

Before any of these reaches N., in chat or in the backlog:

- a command to run, a file or a log to read, a result to look over;
- a count or a paste to bring back, a message to carry to another session;
- a new `☐ **N.:**` line.

One ask of a single line still gets the check. A decision with a
recommendation does not.

## How

1. **Write the ask as a list.** One line per thing N. would do, in the
   order N. would do it, and after each line the fact that puts it on N.
   ("the results file is in N.'s folder", "needs `sudo`"). Facts only, not
   your conclusion. No real data in the list: paths as placeholders,
   counts, fixed words.
2. **Hand the list to a fresh subagent** (the Agent tool, general purpose)
   with the brief below and the place you run in (cloud, Chromebook,
   laptop). Where there is no subagent tool, answer the brief yourself in
   writing before the ask; that is weaker, so say you did it that way.
3. **Act on what comes back.** Do what it says you can do. Build what it
   says can be built where the data is, if that is inside the story in
   focus; otherwise write it as a story and tell N. Drop what needs
   nothing. A line it leaves on N. that you still think is wrong: say so,
   don't overrule it silently.
4. **Send N. only what is left**, each line as a task (verb first, what
   and where, about how long) with its reason named, merged into as few
   commands as will do. **A command for N. is whole: no blank to fill
   in.** N. does not live in the codebase and does not carry paths or
   folder names in mind (N., 2026-11-21: "a simple blank for me to fill in
   is significant manual work"). A command that needs a file finds it
   itself, or shows what it found and asks by number; a `<your file>` in
   a command is a step you have not finished. Begin with one line: `step check: 10 asked, 1
   left` and what took the others away.
5. **A step on N.'s device is one paste, and a failure stops.** A command
   with `sudo` is not merged with others to save a step: it stays its own
   paste, short enough to read. The copy that brings its code to the laptop
   is not another step: it is chained before it with `&&`, so a failed copy
   stops before the install (N., 2026-11-24). If a paste fails or shows the device is not
   what you assumed, do not send a second guess: say what you did not know
   and hand the finding-out to an agent on that device. Never explore N.'s
   machine through N.'s pastes (postmortem, 2026-11-22: about nine `sudo`
   pastes, each a new guess).

## The brief (give it whole)

> You are checking steps that a Kairos session wants to hand to N., the
> owner. N. decides; N. does not do the system's work. For each line
> below, try to take it off N. You have not seen the session's reasoning
> and should not trust "it can't be done" without a fact that says why.
>
> A step stays on N. only for one of these reasons, and you name which:
> **an account's own UI** (a provider's settings page, a token made in a
> browser); **a device** (a key pressed at the machine, a passphrase at
> boot, the phone; also a wall N. built on purpose, such as `sudo` on the
> host, a push from the host, or the yes to a public repo's push);
> **money**; **a real-world act**; **a decision** (privacy, the boundary,
> money, taste, anything done in N.'s name).
>
> A command that asks N. to fill in a path, a file name or a folder is
> not finished: say what the script should find by itself, or list and
> ask by number.
>
> These are not reasons: "the agent may not see the data"; "look over the
> result"; typing a command the session could run; reading a log or a
> screen to say what it shows; counting or labelling by hand; carrying a
> message between sessions when the fact could be written into the repo;
> "to be safe".
>
> For each line give one verdict:
> - **the session does it** — and how, in a sentence;
> - **build it where the data is** — what the job would compute and
>   report, in a sentence;
> - **drop it** — why nothing needs doing (for instance: what the model
>   was unsure of is simply left as it was);
> - **stays on N.** — the reason from the list, and nothing else.
>
> A step on N.'s device is one paste. Finding out what a device holds
> or how it is set up is work for an agent on that device, not for N.'s
> pastes. A `sudo` command is not merged with others to save a step: a
> bigger root paste is a bigger risk, not less work. The copy that brings
> an install's code, chained before it with `&&`, is part of that one
> paste (N., 2026-11-24).
>
> Then: can the lines left on N. be merged into one command or one
> decision (never a `sudo` line with others), and is any of them there
> only because an earlier line was?
> Answer as a table, one row per line, then the merged remainder. No
> preamble.

## What it is not

A second opinion, not a lock: the same kind of model reads both sides. It
catches the ask made out of habit. What N. keeps pushing back on after it
has run is the signal to change this brief.
