---
name: step-check
description: Check a step before it goes to N. Use every time before you ask N. to run, read, check, count, paste or look over anything. Not for a decision that is plainly N.'s (privacy, the boundary, money, taste), which goes to N. with a recommendation.
---

# The step check

*An abridged copy, written 2026-11-22 for an agent that cannot read the
master (it lives in a private repo, with the Claude Code sessions). Where
the two differ, the master wins; N. says when this copy is brought up to
date.*

The rule is `AGENTS.md` section 4: the agent does the work, and N. decides.
A session that wants N. to do something is the worst judge of whether N.
must: it has already concluded that it can't. So a fresh subagent that has
not reached that conclusion tries to take every line of the ask off N.

## How

1. **Write the ask as a list**, one line per thing N. would do, each with
   the fact that puts it on N. Facts only, not your conclusion.
2. **Hand the list to a fresh subagent** with the brief below. Where there
   is no subagent, answer the brief yourself in writing before the ask, and
   say you did it that way.
3. **Act on what comes back**: do what it says you can do, drop what needs
   nothing.
4. **Send N. only what is left**, each line as a task (verb first, what
   and where, about how long). **A command for N. is whole: no blank to
   fill in.** Begin with one line: `step check: 6 asked, 1 left`.
5. **Never use N.'s terminal to find out what you could have found out.**
   If a step fails for N., stop: do not send a second guess. Say what you
   did not know and how you will find it out without N.

## The brief (give it whole)

> You are checking steps that a session wants to hand to N., the owner.
> N. decides; N. does not do the system's work. For each line, try to take
> it off N. A step stays on N. only for one of these reasons, and you name
> which: an account's own UI; a device (also a wall N. built on purpose,
> such as `sudo`, a push, or the yes to a public push); money; a
> real-world act; a decision (privacy, the boundary, money, taste,
> anything done in N.'s name).
>
> These are not reasons: "look over the result"; typing a command the
> session could run; reading a log or a screen to say what it shows;
> counting by hand; "to be safe".
>
> For each line give one verdict: the session does it (and how); drop it
> (why nothing needs doing); stays on N. (the reason from the list). Then:
> can what is left be merged into one command or one decision? A table,
> one row per line, then the merged remainder. No preamble.
