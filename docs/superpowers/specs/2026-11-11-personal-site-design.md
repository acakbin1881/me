# Personal site: design spec

Date: 2026-11-11
Status: approved in chat, awaiting written-spec review
Live URL: https://acakbin1881.github.io/me/
Stack (already in place): Astro 7, Tailwind v4, GitHub Pages via GitHub Actions, base path `/me`

## 1. Purpose

A personal space, not a conversion page. There is no hiring or sales goal. The site
presents who Aras is, and stays small and calm. The first version shows the information from
Aras's LinkedIn profile. Later it may grow, but nothing in v1 is built for content that
does not exist yet.

**Success looks like:** a single page that loads fast, reads clearly on phone and
desktop, and does not look like a template or an AI-generated portfolio.

## 2. Design direction: Swiss / typographic

The identity comes from typography and the grid alone. That means a huge name, a strict
four-column grid, hairline rules between rows, small monospace labels, and one red accent.
There are no cards, shadows, gradients, rounded corners, icons or illustrations.

Reference for the look: `design-preview/fonts.html`, option A. That file is a local,
uncommitted preview.

## 3. Design tokens

All values live in `src/styles/global.css` under `@theme`. Components use the token
names only and never hard-code hex values or font names.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#f2f1ee` | Page background (warm off-white, not pure white) |
| `fg` | `#0d0d0d` | Text, rules |
| `muted` | `#6e6d69` | Secondary text, dates, inactive nav |
| `line` | `#0d0d0d` | Hairline rules (1px) |
| `accent` | `#e30613` | Swiss red, see the usage rules below |

**Rules for the red:** it appears in at most three places. These are the square after
the name, the link hover underline, and the focus outline. It is never used for body
text and never used as a background area larger than the square.

Contrast: `fg` on `bg` and `muted` on `bg` must meet WCAG AA for their sizes. Check
`muted` at 13px when implementing, and darken it if it fails.

**Light theme only.** There is no dark mode in v1. Swiss style comes from print.

### Typography

| Role | Font | Settings |
| --- | --- | --- |
| Display (name) | Switzer 700 | `clamp(64px, 19vw, 232px)`, line-height .84, tracking -.055em, uppercase |
| Body | Switzer 400/500/600 | 15px rows, line-height 1.35 |
| Section titles | Switzer 600 | 15px, sentence case ("Experience"), with the section number above in Plex Mono 12px muted |
| Dates, nav, footer | IBM Plex Mono 400/500 | 12–13px, sentence case ("02 Experience"), as in the approved preview (option A) |

- Switzer comes from Fontshare under the ITF Free Font License, which allows commercial
  use. IBM Plex Mono is under the SIL Open Font License.
- Both are **self-hosted** and loaded with `@font-face` and `font-display: swap`. There are
  no requests to Fontshare or Google at runtime. Plex Mono comes from `@fontsource`. Switzer's
  license forbids redistributing it through a repository, so the woff2 is not committed.
  `scripts/fetch-fonts.mjs` downloads it before each build.
- Switzer is a single variable file covering 400–700. The license forbids subsetting it.
  Plex Mono loads 400 and 500 in the Latin subset only.
- Swap the system fallback metrics as close as possible (`size-adjust`) to limit layout
  shift.

### Spacing and grid

- Desktop: a 4-column grid with a 16px gap, and 40px side padding from 768px up.
- Mobile (<640px): a 2-column grid with a 16px side gutter. Columns that only carry
  secondary text are hidden. In each row, the organization/role block spans the full
  width and the date sits on one line under it.
- Vertical rhythm is in multiples of 8px. Gaps between sections are 56px.
- Maximum content width is the viewport minus padding. The name is meant to span the page.

## 4. Page structure (single page)

One page at `/me/`. The numbered nav scrolls to sections on the same page.

1. **Nav row:** `01 Index · 02 Experience · 03 Education · 04 Contact` in mono. A
   rule sits under it.
2. **Name:** `ARAS / AKBIN` on two lines with the red square after the last letter.
3. **Meta row:** headline, location and the year, separated by a rule.
4. **Experience:** one row per role. Column 1 holds the section label (first row only),
   column 2 the company and role, column 3 one short line where LinkedIn has one (left
   empty otherwise), and column 4 the date range in mono, right-aligned.
5. **Education:** the same row pattern.
6. **Contact:** the same row pattern, holding the LinkedIn and GitHub links.
7. **Footer:** a single mono line with the name, the year and a "Back to top" link.

There is no About section. It was dropped by decision, so the page carries only facts.
The nav therefore reads `01 Index · 02 Experience · 03 Education · 04 Contact`.

Each section is an Astro component in `src/components/`, so each one can be read and
changed on its own.

## 5. Content model

Content comes from LinkedIn and is written in English. It is kept apart from markup in
`src/data/profile.ts`, a typed object holding name, headline, location, experience[],
education[] and links[]. Components only render this object, so updating the site later
means editing one file.

### v1 content (read from LinkedIn on 2026-11-11)

- **Name:** Aras Akbin
- **Headline:** Stellar Ambassador · Founder, TrustRFQ
- **Location:** San Francisco Bay Area

**Experience** (newest first)

| Role | Organization | Line | Dates |
| --- | --- | --- | --- |
| Founder | TrustRFQ | (none) | **start date pending** — Present |
| Global Strategy & Partnerships Advisor | Upvera | (none) | Jul 2026 — Present |
| Ambassador | Stellar Development Foundation | (none) | Jun 2026 — Present |
| Blockchain Developer (Freelance) | ODTÜ Blockchain | Blockchain and Web3 | 2025 — 2026 |

TrustRFQ appears in the LinkedIn headline but not in its Experience list. It is added
here by decision.

**Education**

| Program | School | Dates |
| --- | --- | --- |
| Physics | De Anza College | 2026 — Present |
| English Preparation | Middle East Technical University (ODTÜ) | 2025 — 2026 |

**Contact:** LinkedIn (`linkedin.com/in/aras-akbin-36b9842a7`) and GitHub
(`github.com/acakbin1881`). No email on the page.

Not used in v1: LinkedIn skills, posts and hackathon projects (Carp, Armo). Projects
are out of scope (section 8).

## 6. Interaction and motion

- Links are underlined on hover in red (2px, offset 4px). There is no color change on
  the text.
- On first load the name fades in and rises 8px over about 400ms. Nothing else animates.
- Nothing appears on scroll, there is no parallax, and there is no custom cursor.
- `prefers-reduced-motion` disables all of the above. The global CSS rule for this
  already exists.
- The focus outline is 2px red with a 3px offset, always visible on keyboard focus.

## 7. Technical quality bar

- HTML is semantic: a single `h1` (the name), `h2` per section, and `<ol>` or `<ul>` for rows
  where it fits. The "Skip to content" link already exists.
- Lighthouse on mobile scores 95 or more in all four categories.
- No client-side JavaScript is shipped. There are no islands, the intro animation is pure
  CSS, and in-page nav uses plain anchor links.
- Title and description are filled from `profile.ts`. An `og.png` (1200×630) is created
  in the same Swiss style, with the name and the red square.
- There is no horizontal scroll at 375px. This is verified with screenshots at 375, 768
  and 1440.
- All internal links and assets go through `url()` (`src/lib/url.ts`) because of the
  `/me` base path.

## 8. Out of scope for v1

These are excluded: blog or writing, a projects section, a photo, dark mode, a Turkish
version, analytics, a contact form and a custom domain. Each can be added later without
changing the design system.
