# ai-era

A website where I capture the topics I want to publish on around AI:

- **AI ethics**
- **AI's potential to transform the world**

One static page, `index.html`, with a self-contained vanilla script, `lab.js`:
no build step, no dependencies, and no call to a third party (no web fonts,
CDN, analytics or embeds, enforced by a strict `Content-Security-Policy` with
`connect-src 'none'`). Served by GitHub Pages at <https://ai-era.co/> (and
<https://nklassen-app.github.io/kairos-public-profile/ai-era/>).

What the homepage is to become, the Digital Concept Lab v1, is specified in
[`SPEC.md`](SPEC.md).
