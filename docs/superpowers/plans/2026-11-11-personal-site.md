# Personal Site v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the deployed Astro skeleton into the single-page Swiss/typographic personal
site described in the spec, filled with Aras's LinkedIn content.

**Architecture:** Content lives in one typed data file (`src/data/profile.ts`). Small Astro
components render it into one static page. Design tokens and self-hosted fonts live in
`src/styles/global.css`. Tests are Node's built-in test runner. Some import the data and
helpers directly (Node 24 strips TypeScript types). Others read the built HTML in `dist/`.

**Tech Stack:** Astro 7, Tailwind v4 (`@theme` tokens), Node 24 `node:test`,
`@fontsource/ibm-plex-mono`, Switzer variable woff2 from Fontshare, GitHub Pages under `/me`.

**Spec:** `docs/superpowers/specs/2026-11-11-personal-site-design.md`

## Global Constraints

- English only. `<html lang="en">`.
- Base path `/me`. Every root-relative `href`/`src` in built HTML starts with `/me/`, and internal links go through `url()` from `src/lib/url.ts`.
- Colors: `bg #f2f1ee`, `fg #0d0d0d`, `muted #6e6d69`, `line #0d0d0d`, `accent #e30613`. No other colors.
- Red appears only in the square after the name, the link hover underline and the focus outline.
- Fonts are Switzer (400–700) and IBM Plex Mono (400, 500). Both are self-hosted with `font-display: swap`. No runtime request to fontshare.com or googleapis.com.
- Name display: `clamp(64px, 19vw, 232px)`, line-height .84, letter-spacing -.055em, uppercase, Switzer 700.
- Grid: 4 columns with a 16px gap. Side padding is 40px from 768px up and 16px below. Below 640px the grid is 2 columns.
- Light theme only. No client-side JS islands. Only the name animates (fade and rise 8px, about 400ms, CSS only, disabled by `prefers-reduced-motion`).
- No About section, no email, no photo.

## Review Focus

1. **320px-wide phone:** the longest strings ("Global Strategy & Partnerships Advisor", "Middle East Technical University (ODTÜ)") wrap and the page never scrolls sideways. Pinned in Task 4, Step 5.
2. **Missing TrustRFQ start date:** the row must read `Present`, never `undefined — Present` or a dangling dash. Pinned in Task 1 (`formatRange` test).
3. **Base path:** a single bare `/favicon.svg` or `/#contact` breaks on GitHub Pages. Pinned in Task 2 (every root-relative URL starts with `/me/`).
4. **Non-ASCII glyphs (Ü in ODTÜ, — dashes):** these must render in Switzer and Plex Mono, not in a fallback font. Pinned in Task 3, Step 5 (`document.fonts.check`).
5. **Keyboard-only visitor:** the skip link and the four nav anchors must be reachable with Tab, and each must show a red outline. Pinned in Task 4, Step 5.

---

### Task 1: Profile data, date formatting and test harness

**Files:**
- Create: `src/data/profile.ts`, `src/lib/format.ts`, `tests/profile.test.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces:
  ```ts
  // src/data/profile.ts
  export interface Role  { role: string; org: string; line?: string; start?: string; end: string }
  export interface Study { program: string; school: string; start: string; end: string }
  export interface Link  { label: string; href: string }
  export interface Profile {
    name: string; headline: string; location: string; description: string;
    experience: Role[]; education: Study[]; links: Link[];
  }
  export const profile: Profile;

  // src/lib/format.ts
  export function formatRange(start: string | undefined, end: string): string;
  ```
  Date strings are stored exactly as displayed ("Jul 2026", "2025", "Present").

- [ ] **Step 1: Add scripts to `package.json`**

  `"test": "node --test \"tests/**/*.test.ts\""` and `"check": "astro build && npm test"`.

- [ ] **Step 2: Write `tests/profile.test.ts`**

  ```ts
  import { test } from 'node:test';
  import assert from 'node:assert/strict';
  import { profile } from '../src/data/profile.ts';
  import { formatRange } from '../src/lib/format.ts';

  test('experience is newest first and starts with TrustRFQ', () => {
    assert.deepEqual(profile.experience.map(r => r.org),
      ['TrustRFQ', 'Upvera', 'Stellar Development Foundation', 'ODTÜ Blockchain']);
    assert.equal(profile.experience[0].start, undefined);
    assert.equal(profile.experience[0].end, 'Present');
  });
  test('education matches LinkedIn', () => {
    assert.deepEqual(profile.education.map(e => e.school),
      ['De Anza College', 'Middle East Technical University (ODTÜ)']);
  });
  test('contact links are LinkedIn and GitHub only', () => {
    assert.deepEqual(profile.links.map(l => l.href), [
      'https://www.linkedin.com/in/aras-akbin-36b9842a7/',
      'https://github.com/acakbin1881',
    ]);
  });
  test('formatRange', () => {
    assert.equal(formatRange('Jul 2026', 'Present'), 'Jul 2026 — Present');
    assert.equal(formatRange('2025', '2026'), '2025 — 2026');
    assert.equal(formatRange(undefined, 'Present'), 'Present');
  });
  ```

- [ ] **Step 3: Run `npm test`.** Expected: FAIL, because the modules are not found.

- [ ] **Step 4: Create `src/data/profile.ts` and `src/lib/format.ts`**

  Copy the values verbatim from spec section 5:
  - `name: 'Aras Akbin'`
  - `headline: 'Stellar Ambassador · Founder, TrustRFQ'`
  - `location: 'San Francisco Bay Area'`
  - `description: 'Aras Akbin, Stellar Ambassador and founder of TrustRFQ, based in the San Francisco Bay Area.'`
  - The ODTÜ role is `role: 'Blockchain Developer (Freelance)'` with `line: 'Blockchain and Web3'`.
  - Link labels are `'LinkedIn'` and `'GitHub'`.

  `formatRange` joins start and end with `' — '` (an em dash with spaces). When there is no start, it returns end alone.

- [ ] **Step 5: Run `npm test`.** Expected: 4 passing.

- [ ] **Step 6: Commit** with the message `feat: add profile data and date formatting`.

---

### Task 2: Page structure and components

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Hero.astro`, `src/components/RowSection.astro`, `src/components/Footer.astro`, `tests/site.test.ts`
- Modify: `src/pages/index.astro`, `src/layouts/Layout.astro`

**Interfaces:**
- Consumes: `profile`, `formatRange` (Task 1), `url()` (`src/lib/url.ts`).
- Produces:
  ```ts
  // RowSection.astro props
  interface Row { primary: string; secondary?: string; line?: string; date?: string; href?: string }
  interface Props { id: string; number: string; title: string; rows: Row[] }
  ```
  - Section ids are `experience`, `education` and `contact`. Nav anchors point to `url('/') + '#experience'` and so on.
  - `Layout` props change: `title` defaults to `profile.name`, `description` defaults to `profile.description`, and `lang` defaults to `'en'`.

- [ ] **Step 1: Write `tests/site.test.ts`**

  It reads `dist/index.html` once and asserts the following:
  - Exactly one `<h1`, and its text contains `Aras` and `Akbin`.
  - The `<h2>` texts include `Experience`, `Education` and `Contact`.
  - `id="experience"`, `id="education"` and `id="contact"` are present.
  - The nav contains `href="/me/#experience"`, `href="/me/#education"` and `href="/me/#contact"`.
  - Every org and school string from `profile` appears.
  - `Present` appears, and `undefined` does not.
  - Both profile link hrefs appear, each with `rel="me"`.
  - None of these appear: `mailto:`, `TODO`, `About`.
  - Every `href="/…"` and `src="/…"` value starts with `/me/`. Use the regex `/(?:href|src)="(\/[^"]*)"/g`.
  - `<html lang="en">` is present.

- [ ] **Step 2: Run `npm run check`.** Expected: FAIL, because the page still shows the placeholder.

- [ ] **Step 3: Build the components and the page**

  - **Nav:** a mono row with `01 Index` (→ `url('/')`), `02 Experience`, `03 Education` and `04 Contact`, followed by a hairline rule.
  - **Hero:** an `<h1>` containing `Aras<br>Akbin`, then `<span aria-hidden="true" class="square">`, then a meta row with the headline, the location and the current build year.
  - **RowSection:** a `<section id>` holding an `<h2>` (visible in column 1 of the first row) and a `<ul>` of 4-column rows. Dates are mono and right-aligned. Rows with `href` render as an external `<a rel="me">`.
  - **Footer:** a mono line with `Aras Akbin © {year}` and a `Back to top` link to `#main`.
  - **Mapping:**
    - Experience row: `{ primary: org, secondary: role, line, date: formatRange(start, end) }`.
    - Education row: `{ primary: school, secondary: program, date: formatRange(start, end) }`.
    - Contact row: `{ primary: label, secondary: href without protocol, href }`.
  - Delete the placeholder copy in `index.astro` and the `TODO` defaults in `Layout.astro`.

- [ ] **Step 4: Run `npm run check`.** Expected: all tests pass.

- [ ] **Step 5: Commit** with the message `feat: render profile as single-page sections`.

---

### Task 3: Design tokens and self-hosted fonts

**Files:**
- Create: `src/styles/fonts/Switzer-Variable.woff2`, `src/styles/fonts/LICENSE-Switzer.txt`
- Modify: `src/styles/global.css`, `package.json` (dependency)
- Test: `tests/site.test.ts`

**Interfaces:**
- Produces Tailwind tokens: `bg-bg`, `text-fg`, `text-muted`, `border-line`, `text-accent`/`bg-accent`, `font-sans` (Switzer), `font-mono` (Plex Mono). Tasks 2 and 4 use these classes.

- [ ] **Step 1: Extend `tests/site.test.ts`**

  The built CSS is found via the `<link rel="stylesheet" href="/me/_astro/….css">` in `dist/index.html`. Assert:
  - The CSS contains `font-family:Switzer` (whitespace-insensitive) and `font-display:swap`.
  - The CSS contains `#e30613` and `#f2f1ee`.
  - Neither the CSS nor the HTML contains `fontshare.com` or `googleapis.com`.
  - A `.woff2` file exists under `dist/_astro/`.

- [ ] **Step 2: Run `npm run check`.** Expected: FAIL.

- [ ] **Step 3: Add the fonts**

  - Download `https://api.fontshare.com/v2/fonts/download/switzer` and unzip it into a fresh temp directory. Copy `Switzer-Variable.woff2` and the license file into `src/styles/fonts/`.
  - Run `npm i @fontsource/ibm-plex-mono` and import its `latin-400.css` and `latin-500.css` at the top of `global.css`.
  - Add an `@font-face` for Switzer with `font-weight: 100 900`, `src: url('./fonts/Switzer-Variable.woff2') format('woff2')` and `font-display: swap`.
  - Add a `"Switzer Fallback"` `@font-face` on `local('Arial')` with `size-adjust`, `ascent-override` and `descent-override` tuned so the swap barely shifts the name. Put it in the stack right after `"Switzer"`.

- [ ] **Step 4: Set the `@theme` tokens in `global.css`**

  Use the exact Global Constraints values. Font stacks are `"Switzer", ui-sans-serif, system-ui, sans-serif` and `"IBM Plex Mono", ui-monospace, monospace`. Remove `--font-display`, since Switzer is the only display face.

- [ ] **Step 5: Run `npm run check`.** Expected: pass. Then confirm `document.fonts.check('700 64px Switzer', 'ODTÜ —')` and `document.fonts.check('500 12px "IBM Plex Mono"', 'ODTÜ —')` both return `true` in a browser on `npm run preview` (Review Focus 4).

- [ ] **Step 6: Commit** with the message `feat: self-host Switzer and IBM Plex Mono, set Swiss tokens`.

---

### Task 4: Visual layout, motion and focus

**Files:**
- Modify: `src/components/*.astro`, `src/styles/global.css`
- Test: `tests/site.test.ts`, plus screenshots

**Interfaces:**
- Consumes: the tokens from Task 3 and the components from Task 2.

- [ ] **Step 1: Extend `tests/site.test.ts`**

  The built CSS contains `@media (prefers-reduced-motion: reduce)`, and an `@keyframes` rule that is used by the `h1`.

- [ ] **Step 2: Style to the spec values**

  Use `design-preview/fonts.html` option A as the visual reference.
  - The name uses the constraint values. The red square is `.16em` on each side, `bg-accent`, and sits at the baseline after the last letter.
  - Rows have a 1px `border-line` top border, and the last row also has a bottom border.
  - Labels are mono, 12px, uppercase, with `.06em` tracking.
  - Dates are mono, 13px, `text-muted`.
  - Links get a 2px red underline with a 4px offset on hover and focus, and their text color stays the same.
  - The focus outline is 2px accent with a 3px offset (already in `global.css`).

- [ ] **Step 3: Add the intro animation**

  Apply `opacity 0→1` and `translateY(8px)→0` over 400ms ease-out to the `h1` only.

- [ ] **Step 4: Run `npm run check`.** Expected: pass.

- [ ] **Step 5: Verify in the browser** on `npm run preview`

  - Take screenshots at 320×700, 375×812, 768×1024 and 1440×900. At each width, `document.documentElement.scrollWidth === innerWidth` (Review Focus 1).
  - Press Tab from page load. The focus order must be skip link, then `01`–`04` nav anchors, then the contact links, then `Back to top`, and each one shows a red outline (Review Focus 5).
  - `muted` text at 13px must meet a WCAG AA contrast of at least 4.5:1 against `bg`. If it fails, darken `muted` and update the spec table.

- [ ] **Step 6: Commit** with the message `feat: Swiss layout, intro motion and focus styles`.

---

### Task 5: Link preview image

**Files:**
- Create: `scripts/og.html`, `public/og.png`
- Test: `tests/site.test.ts`

- [ ] **Step 1: Extend `tests/site.test.ts`**

  - `dist/og.png` exists.
  - Its PNG IHDR width and height read 1200 and 630 (bytes 16–23, big-endian).
  - The HTML contains `property="og:image" content="https://acakbin1881.github.io/me/og.png"`.

- [ ] **Step 2: Run `npm run check`.** Expected: FAIL.

- [ ] **Step 3: Create `scripts/og.html`**

  It is a 1200×630 page in the site's style: `bg` background, `ARAS / AKBIN` in Switzer 700 with the red square, and the headline in Plex Mono. Load the fonts from `../src/styles/fonts/` and `node_modules/@fontsource/ibm-plex-mono`.

- [ ] **Step 4: Screenshot it to `public/og.png`**

  Use a 1200×630 viewport at device scale 1, then look at the image.

- [ ] **Step 5: Run `npm run check`.** Expected: pass.

- [ ] **Step 6: Commit** with the message `feat: add link preview image`.

---

### Task 6: Quality gate and deploy

- [ ] **Step 1: Run Lighthouse in mobile mode**

  Run it against `npm run preview` with `npx lighthouse http://localhost:4321/me/ --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo`. Expected: every score is ≥ 95. Fix anything below that.

- [ ] **Step 2: Clean up the README**

  Remove the finished items from its "Yapılacaklar" list. Leave only the TrustRFQ start date.

- [ ] **Step 3: Push and deploy**

  Push to `origin main` and watch the Actions run until it succeeds.

- [ ] **Step 4: Check the live site**

  - `https://acakbin1881.github.io/me/` returns 200.
  - A screenshot at 375 and 1440 matches the local result.
  - `https://acakbin1881.github.io/me/og.png` returns 200.
