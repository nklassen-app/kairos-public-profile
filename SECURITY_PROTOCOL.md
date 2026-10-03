# Security protocol

This repository holds static websites: text and images, no secrets, no
accounts, nothing that collects anything from visitors. The protocol below is
sized to that — small on purpose. It lists the rules only; which of them are
in place is tracked privately.

## Changing the rules

The protocol comes first. A change that would break one of the rules below —
adding JavaScript, a web font, a form, an analytics script, a GitHub Action, a
dependency — is made only after the protocol is amended to allow it, with the
reason and what now protects against the risk the rule covered. The amendment
lands before or with the change, never after; a change that breaks a rule
without one is not pushed.

## Reporting a problem

If you find a security problem with this repository or a site it serves,
please use **Report a vulnerability** on the repository's Security tab, so it
reaches me privately. For anything else, open an issue.

## How each rule is enforced

Every rule carries one of four marks:

- **[set once]** — a setting at GitHub or the domain registrar; once on, the
  platform refuses anything that breaks the rule.
- **[code]** — enforced by code: the page itself (every visitor's browser
  obeys it) or a check that runs before each push.
- **[every push]** — only a person can judge it; done on every push.
- **[quarterly]** — a setting can be changed later; a five-minute pass catches
  drift.

## The rules

### 1. Accounts

The accounts are the real attack surface; the sites themselves are static.

- **Two-factor sign-in on the email account, GitHub and the registrar** —
  with a passkey or an authenticator app, never SMS. The email account is the
  master key: the other passwords reset through it. SMS loses to SIM swaps.
  **[set once] [quarterly]**
- **Recovery codes are kept off the working device** — on paper or in a
  password manager, so losing the device does not lose the accounts.
  **[set once]**
- **The domain has a transfer lock, auto-renew and WHOIS privacy.** A lock
  stops the domain being moved away; an expired domain is bought and used to
  impersonate; WHOIS privacy keeps a home address out of the public record.
  **[set once] [quarterly]**

### 2. Repository

- **No secrets, ever.** The sites need none, so there is nothing here to
  protect. **[code]** (the pre-push audit refuses keys, `.env` files and the
  like)
- **Every push from the working device passes the pre-push audit**, which
  lists every file the push sends. **[code]**
- **`main` cannot be force-pushed or deleted**, so even a stolen sign-in
  cannot quietly rewrite history. **[set once] [quarterly]**
- **One owner writes.** No other collaborators; every app with access is
  known. The AI assistant used to build the sites reaches `main` only through
  a pull request the owner reads and merges. **[set once] [quarterly]**
- **No GitHub Actions, no dependencies.** Pages publishes straight from the
  branch; there is no build pipeline or package for a third party to
  compromise. **[every push]**

### 3. The pages

- **Static HTML, no JavaScript.** No script, no script to inject into. A page
  that truly needs one amends this protocol first. **[every push]**
- **A Content-Security-Policy in every page** that lets it load only its own
  styles and images — nothing from another host. GitHub Pages cannot set
  headers, so it sits in the page as a `<meta>` tag. **[code]**
- **No forms, analytics, embeds, web fonts or CDN.** Each one would send
  visitors' data to a third party. **[code]** (a check before each push
  refuses a page that loads anything from outside)
- **Outbound links do not leak** — `rel="noopener"` and a strict referrer
  policy. **[code]**

### 4. Domain

- **The domain is verified on GitHub**, so no one else's Pages site can claim
  it. **[set once]**
- **HTTPS is enforced.** **[set once]**
- **No wildcard DNS records; the records are removed the day a site leaves
  Pages.** A record left pointing at nothing is the classic way a domain is
  taken over. **[set once]**

### 5. Content

Everything pushed here is published, and git history is permanent: a mistake
pushed is published for good, even if deleted afterwards. So the reading
happens before the push.

- **Every push is read before it goes out** — the audit's file list on the
  working device, or the pull request's diff on GitHub. **[every push]**
- **Nothing about family, other people, health, employer or home** unless it
  was chosen deliberately for publication. **[every push]**
- **Photos are stripped of location data** before they are added — phone
  photos carry GPS coordinates. **[every push]**

## The rhythm

| When | What |
|---|---|
| Every push | Section 5 — read what is going out |
| Every quarter | The whole list, about five minutes |
| Every year | The payment card on the registrar account is still valid — auto-renew fails silently on an expired card |
| New device | Reinstall the pre-push audit hook |
| A recovery code used | Generate a new set |
| A site leaves Pages | Delete its DNS records the same day |

## If something goes wrong

1. **Take the site down:** switch GitHub Pages off — it is gone in a minute.
2. **Lock the account:** change the GitHub password and sign out every
   session; check two-factor and the apps with access.
3. **Protect the domain:** if the domain is involved, contact the registrar.
