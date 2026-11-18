# Index and Life: design spec (v2)

Date: 2026-11-16
Status: direction chosen in chat ("Endeks + kırmızı alan")
Extends: `2026-11-11-personal-site-design.md`. Everything there still holds unless this
file says otherwise.

## 1. Purpose

v1 showed only the LinkedIn facts. v2 shows that Aras is more than a list of roles: he
does many different things, and he has a life outside work. Two additions carry this:

1. **Index:** a large typographic list of everything Aras does. Picking a word shows a
   photo of it.
2. **Life:** one full-bleed Swiss red section holding photos from his life.

The idea that ties them together: paper and black type are work, red is the person.
The red square after the name is the seed of the red section.

## 2. What changes from v1

| v1 rule | v2 rule |
| --- | --- |
| Red in at most three places | Red also marks the active Index word and fills the Life section. Nowhere else. |
| No photos | Photos in Index and Life only, always through the treatment in section 5. |
| Nothing animates on scroll | One scroll-driven animation: the Life section opens out of a red square. |
| No client JavaScript | Still none. Index selection is CSS only (radio inputs + `:has()`). |
| Nav: Index, Experience, Education, Contact | Nav: Index, Experience, Education, Life, Contact. |

## 3. Page order

1. Nav
2. Name and meta row (unchanged)
3. **Index** (new, no visible heading: the words are the section)
4. 02 Experience
5. 03 Education
6. **04 Life** (new, red)
7. 05 Contact
8. Footer

## 4. Index

- Words in Switzer 700, uppercase, `clamp(40px, 8vw, 112px)`, line-height .92,
  tracking -.045em. Each word has a short mono note after it (for example `TrustRFQ`).
- Desktop: words fill columns 1 to 3. Column 4 holds the photo of the active word,
  4:5, pinned to the top of the list.
- Phone: words full width, the photo sits under the list, full width, 4:3.
- The active word is red. Hovering a word (desktop) previews its photo and turns that
  word red. Clicking or tapping a word selects it, so it works on touch screens.
  The first word with a photo is selected on load.
- Words without a photo are plain text and cannot be selected.
- Keyboard: the words are a radio group, so Tab enters it and the arrow keys move.
  The focused word gets the usual red focus outline.

## 5. Life

- Full-bleed red (`accent`) section. It breaks out of the page padding.
- Heading `Life` in the same style as the name, at a smaller size, in `on-accent`
  (off-white). The mono section number sits above it, as in other sections.
- Photos sit on the 4-column grid (2 on phones). Each photo has a size:
  `wide` (2 columns, 3:2), `tall` (1 column, 4:5) or `full` (all columns, 21:9 on
  desktop and 3:2 on phones).
- **Treatment:** every photo is shown in grayscale, multiplied with red, so a set of
  phone photos with different light reads as one series. On hover (desktop) the photo
  fades to its real colors. Touch screens keep the red version.
- Each photo has a mono caption under it with a place and a year, written by Aras.
- **Motion:** when the section scrolls into view it opens out of a red square in its
  top-left corner (`clip-path` on a `view()` timeline). Browsers without scroll-driven
  animations, and visitors with reduced motion, see it fully open.
- Text on red uses `on-accent`, which must pass WCAG AA (4.5:1) at 13px.

## 6. Content model

`src/data/profile.ts` gains two lists. Photos are referenced by file name and live in
`src/assets/photos/`, so Astro resizes them and strips their metadata (including GPS)
at build time.

```ts
facets: { word: string; note?: string; photo?: string; alt?: string }[]
life:   { photo: string; alt: string; caption: string; size: 'wide' | 'tall' | 'full' }[]
```

A missing photo file fails the build. Every photo needs alt text.

## 7. Page length (added 2026-11-16, later the same day)

Aras asked for the page to be about as long as merth.xyz/human: **about 2,100px at
1440px wide** (2.4 screens). The first v2 build was 4,165px. The page was rebuilt to
fit, and these rules replace the matching parts of sections 3 to 5:

- **Hero:** the name is smaller, `clamp(56px, 12.5vw, 176px)`.
- **Index:** words are `clamp(36px, 6vw, 88px)`. The photo stays in column 4.
- **Info:** on desktop, Experience fills columns 1 and 2. Education and Contact are
  stacked in columns 3 and 4. Each row shows the name on the left and the date on the
  right. On phones the three lists stack.
- **Life:** one row of photos that scrolls sideways (scroll snap), so adding photos
  never makes the page longer. All photos share one height,
  `clamp(240px, 22vw, 320px)`; their width follows their shape (`tall` 4:5,
  `wide` 3:2, `full` 21:9). On desktop the heading sits in column 1 and the row runs
  from column 2 to the right edge of the screen. The row can be focused and scrolled
  with the arrow keys.
- Mobile length is not a target. It ends up shorter than the reference because nothing
  is padded out.

## 8. Open items

- Real photos replace the placeholders in `src/assets/photos/`.
- The life words for the Index (hobbies, sports, interests) come from Aras.
