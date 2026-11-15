# AI-Era.co — Content, DOM Cleanup & Interior Pages Specification

**Target Objective:** Update the root `index.html` landing page (`https://ai-era.co/`) to unify the `Harbor Stoa · /about` card with the four core profiles, remove deprecated DOM elements, add `"Enter →"` navigation buttons to all five building cards (in both the Interactive Polis drawer and the Classic Bento Grid), and scaffold the five interior subpages (`/strategist/`, `/builder/`, `/philosopher/`, `/practitioner/`, and `/about/`).

---

## Part 1: Root `index.html` Changes

### 1.1 Remove Deprecated DOM Elements
1. **Remove the hidden Manifesto view:** Delete the leftover `<div hidden>` block containing `Manifesto & Field Notes` (`aria-label="AI Era Manifesto"`) inside `<main>`. The Manifesto tab was already removed from the top-right navigation menu, so this hidden block is dead weight in the DOM.
2. **Remove the separate hidden `About Me` drawer panel:** Inside the Polis `<aside aria-live="polite">`, delete the special `<div hidden>` that holds the old 3-part third-person `Harbor Stoa · /about` bio. Instead, `about` must be rendered dynamically using the exact same `<aside>` title, body, tag, and action link structure as `strategist`, `builder`, `philosopher`, and `practitioner`.

### 1.2 Fix Copy Mechanics & Unify All 5 Building Profiles
Update the JavaScript data object / state dictionary that powers both the **Interactive Polis `<aside>` drawer** and the **Classic Bento Card Grid** so that all five buildings use the exact text and `href` routes below. 

*Note: This also fixes the missing hyphen in `one-way gateway` (`/strategist`), capitalizes `Stoic philosophy` (`/philosopher`), and replaces both the 3-part draft bio in the Polis drawer and the 19-word stub in the Bento grid with the unified 106-word first-person `About Me` profile.*

```javascript
const BUILDINGS = {
  strategist: {
    tag: "Acropolis - /strategist",
    shortLabel: "The Next Gateway",
    title: "The Strategist: The Next Gateway",
    body: "Some thresholds only open one way. Humanity did not go back on agriculture, or the mechanical engine. I'm a historian by training, and I think we are standing in front of another one-way gateway. For decades innovation has felt like a Red Queen's Race: ever more effort to stay roughly where we are. Is AI the exit? I don't know yet. The Next Gateway is where I work on that question.",
    href: "/strategist/"
  },
  builder: {
    tag: "Artisan Forge - /builder",
    shortLabel: "Applied AI Ethics",
    title: "The Builder: Applied AI Ethics",
    body: "Most AI ethics tells you what not to build. I keep getting stuck on the question it leaves open: what is an ethical AI product good for? My working answer is that it should leave people with more agency, mastery, and judgment than they had before. In an era where AI can build anything, should we start focusing on products that foster internal goods? I test that answer with my students at CU Boulder and in my own product work. Here is where it stands, and where it still breaks.",
    href: "/builder/"
  },
  philosopher: {
    tag: "Garden in the Citadel - /philosopher",
    shortLabel: "Garden in the Citadel",
    title: "The Philosopher: Garden in the Citadel",
    body: "Stoicism has always been the philosophy of turbulent times. It was born as Alexander’s empire came apart, and Marcus Aurelius wrote his Meditations between plague and frontier wars. It is finding its readers again in the AI era. But the Stoicism most people meet is the inner citadel: the mind as a fortress nothing external can breach. I think that is only half the picture. A fortress protects; it doesn’t flourish. Flourishing comes from tending a garden inside the walls. What belongs in that garden is the question I keep bringing to the timeless works of Stoic philosophy.",
    href: "/philosopher/"
  },
  practitioner: {
    tag: "Horologion - /practitioner",
    shortLabel: "Kairos OS",
    title: "The Practitioner: Kairos OS",
    body: "The Greeks had two words for time. Chronos is the clock: schedules, backlogs, throughput. Kairos is the right moment, and the nerve to act on it. Machines are about to own Chronos. So what is left for us? My bet is two things. Commitment, because nothing is at stake for a machine. And curiosity, because if AI really is a gateway, nobody has a map of the far side, and exploring is the best thing we bring to it. Kairos OS is the system I’m building to test that bet on my own working days. Some of it works, some doesn’t yet. I write up both.",
    href: "/practitioner/"
  },
  about: {
    tag: "Harbor Stoa - /about",
    shortLabel: "About Me",
    title: "Harbor Stoa: About Me",
    body: "I’m Nikolaus Klassen. My path to the AI era started in the humanities, with a PhD in Classics and Cultural History studying how societies adapt old patterns of thought when their world shifts. Today, I’m a Technical Program Manager at Google, where I help build and deploy agentic AI systems. Between those two worlds, I teach Applied AI Ethics at CU Boulder. Across ancient texts, modern data pipelines, and autonomous agents, I’m drawn to the same underlying question: how do we turn raw information into knowledge we trust and act upon? This island is my workshop for thinking in public across all three roles.",
    href: "/about/"
  }
};
```

### 1.3 Add the `"Enter"` Button to the Polis Drawer & Bento Cards
At the bottom of both the Polis `<aside>` card and each `<article>` card in the Bento Grid, add an action container with an `"Enter"` button that navigates to the building's `href`.

#### HTML Structure for the Polis `<aside>` Drawer:
```html
<aside aria-live="polite">
  <div>
    <span id="drawer-tag">Acropolis - /strategist</span>
  </div>
  <div>
    <h2 id="drawer-title">The Strategist: The Next Gateway</h2>
    <p id="drawer-body">
      Some thresholds only open one way. Humanity did not go back on agriculture, or the mechanical engine. I'm a historian by training, and I think we are standing in front of another one-way gateway. For decades innovation has felt like a Red Queen's Race: ever more effort to stay roughly where we are. Is AI the exit? I don't know yet. The Next Gateway is where I work on that question.
    </p>
    <div class="card-actions">
      <a id="drawer-link" href="/strategist/" class="enter-btn">Enter &rarr;</a>
    </div>
  </div>
</aside>
```

*Ensure the JavaScript click/selection handler updates `document.getElementById('drawer-link').href = building.href;` whenever a building is selected on the map.*

#### HTML Structure for Each Classic Bento Card (`<article>`):
Ensure all 5 Bento cards (including `Harbor Stoa: About Me`) include the full paragraph text and the `.card-actions` footer:
```html
<article class="bento-card">
  <div class="bento-meta">
    <span>Harbor Stoa</span>
    <span>/about</span>
  </div>
  <h3>Harbor Stoa: About Me</h3>
  <p>
    I’m Nikolaus Klassen. My path to the AI era started in the humanities, with a PhD in Classics and Cultural History studying how societies adapt old patterns of thought when their world shifts. Today, I’m a Technical Program Manager at Google, where I help build and deploy agentic AI systems. Between those two worlds, I teach Applied AI Ethics at CU Boulder. Across ancient texts, modern data pipelines, and autonomous agents, I’m drawn to the same underlying question: how do we turn raw information into knowledge we trust and act upon? This island is my workshop for thinking in public across all three roles.
  </p>
  <div class="card-actions">
    <a href="/about/" class="enter-btn">Enter &rarr;</a>
  </div>
</article>
```

#### CSS Styling for `.card-actions` and `.enter-btn`:
Add these rules to the main stylesheet in `index.html`:
```css
.card-actions {
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
}

.enter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  color: inherit;
  border: 1px solid currentColor;
  border-radius: 999px;
  opacity: 0.85;
  transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.enter-btn:hover {
  opacity: 1;
  transform: translateX(2px);
  background-color: rgba(0, 0, 0, 0.06);
}
```

---

## Part 2: Directory Structure for Clean GitHub Pages Routing

Create five subdirectories at the repository root so GitHub Pages serves clean URLs (`/strategist/`, `/builder/`, `/philosopher/`, `/practitioner/`, `/about/`):

```text
/ (repo root)
├── index.html
├── assets/
│   └── profile.jpg          # Portrait image for /about/
├── strategist/
│   └── index.html
├── builder/
│   └── index.html
├── philosopher/
│   └── index.html
├── practitioner/
│   └── index.html
└── about/
    └── index.html
```

---

## Part 3: Interior Page Implementations

### 3.1 `/strategist/index.html`
Create `strategist/index.html` with the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Strategist: The Next Gateway · AI Era</title>
  <style>
    :root {
      --bg: #f6f3ec;
      --surface: #efeae0;
      --text: #1f1e1b;
      --muted: #656158;
      --accent: #8c5a32;
      --border: rgba(31, 30, 27, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      line-height: 1.65;
      padding: 2.5rem 1.5rem 5rem;
    }
    .container { max-width: 720px; margin: 0 auto; }
    .back-link {
      display: inline-block;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
      margin-bottom: 2.5rem;
    }
    .back-link:hover { color: var(--text); }
    .eyebrow {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: clamp(1.85rem, 4vw, 2.5rem);
      line-height: 1.2;
      margin: 0 0 1.25rem;
    }
    .lead {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .coming-soon-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: var(--muted);
    }
    .coming-soon-box strong {
      display: block;
      color: var(--text);
      font-size: 1.05rem;
      margin-bottom: 0.35rem;
    }
  </style>
</head>
<body>
  <main class="container">
    <a href="/" class="back-link">&larr; Return to the Polis</a>
    <div class="eyebrow">Acropolis · /strategist</div>
    <h1>The Strategist: The Next Gateway</h1>
    <p class="lead">
      Some thresholds only open one way. Humanity did not go back on agriculture, or the mechanical engine. I'm a historian by training, and I think we are standing in front of another one-way gateway. For decades innovation has felt like a Red Queen's Race: ever more effort to stay roughly where we are. Is AI the exit? I don't know yet. The Next Gateway is where I work on that question.
    </p>
    <section class="coming-soon-box" aria-label="Status">
      <strong>Content coming soon</strong>
      Essays, chapters, and working notes for <em>The Next Gateway?</em> are currently being prepared.
    </section>
  </main>
</body>
</html>
```

---

### 3.2 `/builder/index.html`
Create `builder/index.html` with the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Builder: Applied AI Ethics · AI Era</title>
  <style>
    :root {
      --bg: #f6f3ec;
      --surface: #efeae0;
      --text: #1f1e1b;
      --muted: #656158;
      --accent: #8c5a32;
      --border: rgba(31, 30, 27, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      line-height: 1.65;
      padding: 2.5rem 1.5rem 5rem;
    }
    .container { max-width: 720px; margin: 0 auto; }
    .back-link {
      display: inline-block;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
      margin-bottom: 2.5rem;
    }
    .back-link:hover { color: var(--text); }
    .eyebrow {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: clamp(1.85rem, 4vw, 2.5rem);
      line-height: 1.2;
      margin: 0 0 1.25rem;
    }
    .lead {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .coming-soon-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: var(--muted);
    }
    .coming-soon-box strong {
      display: block;
      color: var(--text);
      font-size: 1.05rem;
      margin-bottom: 0.35rem;
    }
  </style>
</head>
<body>
  <main class="container">
    <a href="/" class="back-link">&larr; Return to the Polis</a>
    <div class="eyebrow">Artisan Forge · /builder</div>
    <h1>The Builder: Applied AI Ethics</h1>
    <p class="lead">
      Most AI ethics tells you what not to build. I keep getting stuck on the question it leaves open: what is an ethical AI product good for? My working answer is that it should leave people with more agency, mastery, and judgment than they had before. In an era where AI can build anything, should we start focusing on products that foster internal goods? I test that answer with my students at CU Boulder and in my own product work. Here is where it stands, and where it still breaks.
    </p>
    <section class="coming-soon-box" aria-label="Status">
      <strong>Content coming soon</strong>
      Frameworks, syllabus notes, and design patterns for <em>AI Ethics as a Design Language</em> are currently being prepared.
    </section>
  </main>
</body>
</html>
```

---

### 3.3 `/philosopher/index.html`
Create `philosopher/index.html` with the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Philosopher: Garden in the Citadel · AI Era</title>
  <style>
    :root {
      --bg: #f6f3ec;
      --surface: #efeae0;
      --text: #1f1e1b;
      --muted: #656158;
      --accent: #8c5a32;
      --border: rgba(31, 30, 27, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      line-height: 1.65;
      padding: 2.5rem 1.5rem 5rem;
    }
    .container { max-width: 720px; margin: 0 auto; }
    .back-link {
      display: inline-block;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
      margin-bottom: 2.5rem;
    }
    .back-link:hover { color: var(--text); }
    .eyebrow {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: clamp(1.85rem, 4vw, 2.5rem);
      line-height: 1.2;
      margin: 0 0 1.25rem;
    }
    .lead {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .coming-soon-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: var(--muted);
    }
    .coming-soon-box strong {
      display: block;
      color: var(--text);
      font-size: 1.05rem;
      margin-bottom: 0.35rem;
    }
  </style>
</head>
<body>
  <main class="container">
    <a href="/" class="back-link">&larr; Return to the Polis</a>
    <div class="eyebrow">Garden in the Citadel · /philosopher</div>
    <h1>The Philosopher: Garden in the Citadel</h1>
    <p class="lead">
      Stoicism has always been the philosophy of turbulent times. It was born as Alexander’s empire came apart, and Marcus Aurelius wrote his Meditations between plague and frontier wars. It is finding its readers again in the AI era. But the Stoicism most people meet is the inner citadel: the mind as a fortress nothing external can breach. I think that is only half the picture. A fortress protects; it doesn’t flourish. Flourishing comes from tending a garden inside the walls. What belongs in that garden is the question I keep bringing to the timeless works of Stoic philosophy.
    </p>
    <section class="coming-soon-box" aria-label="Status">
      <strong>Content coming soon</strong>
      Essays and reflections from <em>Reading Marcus</em> and the Garden in the Citadel are currently being prepared.
    </section>
  </main>
</body>
</html>
```

---

### 3.4 `/practitioner/index.html`
Create `practitioner/index.html` with the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Practitioner: Kairos OS · AI Era</title>
  <style>
    :root {
      --bg: #f6f3ec;
      --surface: #efeae0;
      --text: #1f1e1b;
      --muted: #656158;
      --accent: #8c5a32;
      --border: rgba(31, 30, 27, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      line-height: 1.65;
      padding: 2.5rem 1.5rem 5rem;
    }
    .container { max-width: 720px; margin: 0 auto; }
    .back-link {
      display: inline-block;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
      margin-bottom: 2.5rem;
    }
    .back-link:hover { color: var(--text); }
    .eyebrow {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: clamp(1.85rem, 4vw, 2.5rem);
      line-height: 1.2;
      margin: 0 0 1.25rem;
    }
    .lead {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .coming-soon-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: var(--muted);
    }
    .coming-soon-box strong {
      display: block;
      color: var(--text);
      font-size: 1.05rem;
      margin-bottom: 0.35rem;
    }
  </style>
</head>
<body>
  <main class="container">
    <a href="/" class="back-link">&larr; Return to the Polis</a>
    <div class="eyebrow">Horologion · /practitioner</div>
    <h1>The Practitioner: Kairos OS</h1>
    <p class="lead">
      The Greeks had two words for time. Chronos is the clock: schedules, backlogs, throughput. Kairos is the right moment, and the nerve to act on it. Machines are about to own Chronos. So what is left for us? My bet is two things. Commitment, because nothing is at stake for a machine. And curiosity, because if AI really is a gateway, nobody has a map of the far side, and exploring is the best thing we bring to it. Kairos OS is the system I’m building to test that bet on my own working days. Some of it works, some doesn’t yet. I write up both.
    </p>
    <section class="coming-soon-box" aria-label="Status">
      <strong>Content coming soon</strong>
      System architecture notes, agent workflows, and field reports from <em>Kairos OS</em> are currently being prepared.
    </section>
  </main>
</body>
</html>
```

---

### 3.5 `/about/index.html` (Portrait + Full CV)
Create `about/index.html` with the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About Nikolaus Klassen · AI Era</title>
  <style>
    :root {
      --bg: #f6f3ec;
      --surface: #efeae0;
      --text: #1f1e1b;
      --muted: #656158;
      --accent: #8c5a32;
      --border: rgba(31, 30, 27, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      line-height: 1.65;
      padding: 2.5rem 1.5rem 5rem;
    }
    .container {
      max-width: 780px;
      margin: 0 auto;
    }
    .back-link {
      display: inline-block;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 2.5rem;
    }
    .back-link:hover { color: var(--text); }
    .eyebrow {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .hero {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 2rem;
      align-items: start;
      margin-bottom: 3rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid var(--border);
    }
    @media (max-width: 620px) {
      .hero { grid-template-columns: 1fr; }
    }
    .portrait {
      width: 180px;
      height: 220px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--surface);
    }
    h1 {
      font-size: clamp(1.85rem, 4vw, 2.4rem);
      line-height: 1.2;
      margin: 0 0 0.5rem;
    }
    .subtitle {
      font-size: 1.05rem;
      color: var(--muted);
      margin: 0 0 1.25rem;
    }
    h2 {
      font-size: 1.15rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin: 2.5rem 0 1.25rem;
    }
    .cv-item {
      margin-bottom: 1.75rem;
    }
    .cv-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .cv-role {
      font-weight: 700;
      font-size: 1.05rem;
    }
    .cv-org {
      color: var(--muted);
      font-weight: 500;
    }
    .cv-date {
      font-size: 0.85rem;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }
    .cv-desc {
      margin: 0.35rem 0 0;
      color: var(--text);
      font-size: 0.96rem;
    }
  </style>
</head>
<body>
  <main class="container">
    <a href="/" class="back-link">&larr; Return to the Polis</a>

    <div class="eyebrow">Harbor Stoa · /about</div>

    <section class="hero">
      <!-- Place portrait photo at /assets/profile.jpg -->
      <img src="/assets/profile.jpg" alt="Nikolaus Klassen" class="portrait" />
      <div>
        <h1>Nikolaus Klassen, PhD</h1>
        <p class="subtitle">
          Technical Program Manager in Agentic AI · University Lecturer in Applied AI Ethics · Historian of Ideas
        </p>
        <p>
          My work sits at the intersection of classical humanities and frontier technology. Trained as a historian of Late Antiquity and cultural history, I spent my early career investigating how human societies adapt inherited frameworks of thought when their world changes underneath them.
        </p>
        <p>
          Today, I help build and deploy agentic AI systems at Google and teach Applied AI Ethics at the University of Colorado Boulder. Whether I am coordinating complex AI product lifecycles, designing ethical choice architectures with my students, or reading Marcus Aurelius, I am guided by a single question: how can we shape machine intelligence so that it expands—rather than replaces—human agency, mastery, and judgment?
        </p>
      </div>
    </section>

    <section aria-label="Curriculum Vitae">
      <h2>Industry Experience</h2>

      <div class="cv-item">
        <div class="cv-header">
          <div>
            <span class="cv-role">Technical Program Manager, Agentic AI</span> ·
            <span class="cv-org">Google</span>
          </div>
          <span class="cv-date">2026 – Present</span>
        </div>
        <p class="cv-desc">
          Leading technical program management for building, evaluating, and deploying agentic AI capabilities across core product lifecycles, translating frontier model behavior into reliable, human-centered product architectures.
        </p>
      </div>

      <div class="cv-item">
        <div class="cv-header">
          <div>
            <span class="cv-role">Senior Data &amp; Business Analyst</span> ·
            <span class="cv-org">Google</span>
          </div>
          <span class="cv-date">2020 – 2026</span>
        </div>
        <p class="cv-desc">
          Architected data observability pipelines, large-scale ETL systems, and proportional measurement frameworks for high-stakes policy, trust, and election security initiatives.
        </p>
      </div>

      <h2>Academic Appointments &amp; Writing</h2>

      <div class="cv-item">
        <div class="cv-header">
          <div>
            <span class="cv-role">Lecturer, Applied AI Ethics</span> ·
            <span class="cv-org">University of Colorado Boulder (ATLAS Institute)</span>
          </div>
          <span class="cv-date">2025 – Present</span>
        </div>
        <p class="cv-desc">
          Designed and taught the curriculum for Applied AI Ethics, approaching ethics not as a compliance checklist, but as a constructive design language for building human agency, mastery, and epistemic integrity into AI systems.
        </p>
      </div>

      <div class="cv-item">
        <div class="cv-header">
          <div>
            <span class="cv-role">Author &amp; Researcher</span> ·
            <span class="cv-org">Independent Scholarship</span>
          </div>
          <span class="cv-date">Ongoing</span>
        </div>
        <p class="cv-desc">
          Author of the essay series <em>Reading Marcus</em> (on Stoic flourishing in the AI era) and the book project <em>The Next Gateway?</em> examining technological plateaus, civilizational thresholds, and the bifurcation of scientific and social complexity. Co-author of peer-reviewed research on organizational pacing and academic practice.
        </p>
      </div>

      <h2>Education</h2>

      <div class="cv-item">
        <div class="cv-header">
          <div>
            <span class="cv-role">Ph.D. in Classics &amp; Cultural History</span>
          </div>
        </div>
        <p class="cv-desc">
          Doctoral research on Late Antique poetry and the transformation of classical intellectual traditions, with interdisciplinary academic training in Germany, including Bielefeld University and Goethe University Frankfurt.
        </p>
      </div>
    </section>
  </main>
</body>
</html>
```

---

## Part 4: Verification Checklist for Antigravity
- [ ] In `index.html`, clicking all 5 buildings in the Interactive Polis updates the `<aside>` drawer with the unified text and sets the `"Enter →"` button `href` to `/strategist/`, `/builder/`, `/philosopher/`, `/practitioner/`, or `/about/`.
- [ ] In `index.html`, switching to the Classic Bento Grid displays the exact same 100-word copy and `"Enter →"` button on all 5 cards (including `Harbor Stoa: About Me`).
- [ ] No hidden Manifesto `<div hidden>` or legacy 3-part `About Me` block remains in `index.html`.
- [ ] All 5 subdirectory `index.html` files exist and render cleanly with working `← Return to the Polis` links back to `/`.