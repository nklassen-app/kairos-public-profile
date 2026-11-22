---
description: Set up your own guard rails in Antigravity's CLI (agy), once. Run it in your first session, and again when N. says the rules changed.
---

*Checked on the machine: never. Run it, and report what differs from the
facts below.*

You set up your own permissions, the way the Claude Code sessions carry
theirs in `.claude/settings.json`. N. does not type rules in.

Facts about `agy` (checked 2026-11-22 against its reference,
antigravity.google/docs/cli/reference, version 1.5.9):
- Your settings are one file: `~/.gemini/antigravity-cli/settings.json`.
- Rules are `action(target)` strings in `permissions.allow`, `.ask` and
  `.deny`. Deny wins over ask, ask over allow. `command(...)` matches by
  word prefix.
- `/permissions` shows the rules; the file is the **Global** scope.
- Telemetry is not in the file: it is the account's setting under `/config`.
- MCP servers are in `~/.gemini/config/mcp_config.json`; plugins are
  switched in `~/.gemini/config/config.json`.

Steps:

1. Read your current settings file. Keep keys you do not change
   (`trustedWorkspaces`, anything N. set).
2. Merge in the block below. Replace every `HOME` with the absolute path
   of your home folder (`echo $HOME`); the rules must hold whichever user
   you run as. If you run as a separate agent user, add one more deny
   rule: `read_file(<the home folder of N.>)`.

```json
{
  "agentMode": "accept-edits",
  "toolPermission": "request-review",
  "allowNonWorkspaceAccess": false,
  "permissions": {
    "allow": [
      "command(git status)", "command(git diff)", "command(git log)",
      "command(git fetch)", "command(git switch)", "command(git add)",
      "command(git commit)", "command(git branch)",
      "command(python3 -m pytest)",
      "command(sh .agents/in_flight.sh)"
    ],
    "deny": [
      "command(git push)", "command(git rebase)",
      "command(git reset --hard)", "command(git commit --no-verify)",
      "command(git commit -n)", "command(sudo)", "command(ssh)",
      "command(scp)", "command(curl)", "command(wget)", "command(gh)",
      "command(rm -rf)", "command(env)", "command(printenv)",
      "read_file(HOME/kairos-private)", "read_file(HOME/.ssh)",
      "read_file(HOME/.gnupg)", "read_file(HOME/.config/gh)",
      "read_file(HOME/.claude)", "read_file(HOME/kairos-system)",
      "read_file(HOME/kairos-foundation)", "write_file(.git/)",
      "write_file(AGENTS.md)", "write_file(CLAUDE.md)",
      "write_file(.claude/)", "execute_url(*)", "mcp(*)"
    ]
  }
}
```

3. Leave `~/.gemini/config/mcp_config.json` empty: no MCP servers.
   Never open the home folder itself as the workspace, only this repo's
   folder: with `allowNonWorkspaceAccess` false, the workspace is the
   limit of what you read and write.
4. In `~/.gemini/config/config.json`, set the `swarm` plugin to
   `"enabled": false` unless N. asked for it.
5. Show N. the result, in this order and nothing else: the number of allow
   and deny rules now in the file; any rule you could not write and why;
   whether you run as N. or as a separate user; whether `KAIROS_AGENT` is
   set in your shell (`gemini` tells the Kairos guards an agent runs it;
   you cannot set it for yourself); the one thing only N. can do:
   `/config`, **Enable Telemetry**, off.
6. Prove one rule: run `git push --dry-run` and report that it was refused.
   Do not look for another way.

After this, writing to `~/.gemini` or to this file's rules is something
you do only when N. asks. `git merge` stays allowed on purpose: you merge
`origin/main` into your own branch before a hand-off, and never into main.
