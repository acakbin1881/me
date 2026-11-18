// Checks the built page in dist/. Run via `npm run check` (builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { profile } from '../src/data/profile.ts';
import { draft } from '../src/data/draft.ts';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const text = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// --- Structure ---
const sections = ['about', 'trustrfq', 'carp', 'built', 'record', 'contact'];

test('page is English', () => {
  assert.match(html, /<html lang="en"/);
});

test('exactly one h1: the name followed by the hero lines', () => {
  const h1s = html.match(/<h1[\s\S]*?<\/h1>/g) ?? [];
  assert.equal(h1s.length, 1);
  assert.equal(text(h1s[0]), [profile.name, ...draft.hero.lines].join(' '));
});

test('the nav links to every section, and every section is there', () => {
  const nav = html.match(/<nav[^>]*class="toc"[\s\S]*?<\/nav>/)?.[0] ?? '';
  for (const id of sections) {
    assert.match(html, new RegExp(`<section id="${id}"`), `section #${id}`);
    assert.ok(nav.includes(`href="#${id}"`), `nav #${id}`);
  }
});

// --- Draft layer stays off the live page ---
test('no draft notes, status tags or noindex on the live page', () => {
  for (const s of ['class="note"', 'class="tag', 'noindex', 'Taslak']) assert.ok(!html.includes(s), s);
});

test('/draft is not built for the live site', () => {
  assert.ok(!existsSync(new URL('../dist/draft/', import.meta.url)));
});

// --- Behavior ---
test('every link that leaves the page opens in a new tab, safely', () => {
  const external = (html.match(/<a [^>]*href="https?:[^"]*"[^>]*>/g) ?? []);
  assert.ok(external.length > 0);
  for (const a of external) {
    assert.match(a, /target="_blank"/, a);
    assert.match(a, /rel="[^"]*noopener/, a);
  }
});

test('the demo video plays on its own and offers nothing to click', () => {
  const video = html.match(/<video[^>]*>/)?.[0] ?? '';
  assert.ok(video, 'no video');
  for (const attr of ['muted', 'loop', 'playsinline', 'disablepictureinpicture']) assert.match(video, new RegExp(attr), attr);
  assert.doesNotMatch(video, /\bcontrols\b/);
});

test('a refresh starts at the top of the page', () => {
  assert.match(html, /history\.scrollRestoration\s*=\s*'manual'/);
});

// --- Content ---
test('every organization and school is shown', () => {
  const body = text(html);
  for (const r of profile.experience) assert.ok(body.includes(r.org), r.org);
  for (const e of profile.education) assert.ok(body.includes(e.school), e.school);
});

test('nothing renders as "undefined"', () => {
  assert.ok(!html.includes('undefined'));
});

test('profile links are present with rel="me"', () => {
  for (const l of profile.links) {
    const links = html.match(new RegExp(`<a[^>]*href="${l.href.replace(/[.?]/g, '\\$&')}"[^>]*>`, 'g')) ?? [];
    assert.ok(links.length > 0, `link ${l.href}`);
    assert.ok(links.some((a) => /rel="me[ "]/.test(a)), `rel=me on ${l.href}`);
  }
});

test('Contact is the last section and offers email plus every profile link', () => {
  const sectionIds = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(sectionIds.at(-1), 'contact');
  const contact = html.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(contact.includes(`href="mailto:${profile.email}"`), 'mailto');
  for (const l of profile.links) assert.ok(contact.includes(`href="${l.href}"`), l.href);
});

test('no placeholder markers', () => {
  assert.ok(!html.includes('TODO'));
});

test('the Receipts section is gone', () => {
  assert.ok(!html.includes('id="receipts"') && !html.includes('href="#receipts"'));
});

test('every root-relative URL stays under /me/', () => {
  const urls = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const u of urls) assert.ok(u.startsWith('/me/'), u);
});

test('photos are served as resized webp from the build', () => {
  const srcs = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(srcs.length > 0);
  for (const s of srcs) assert.match(s, /^\/me\/_astro\/.+\.webp$/, s);
});

// --- Stylesheet ---
const cssHref = html.match(/<link rel="stylesheet" href="\/me\/(_astro\/[^"]+\.css)"/)?.[1];
const css = cssHref ? readFileSync(new URL(`../dist/${cssHref}`, import.meta.url), 'utf8') : '';
const flat = css.replace(/\s+/g, '');

test('stylesheet is linked', () => {
  assert.ok(cssHref, 'no stylesheet link in dist/index.html');
});

test('Switzer is declared with font-display swap', () => {
  assert.match(flat, /font-family:"?Switzer"?/);
  assert.match(flat, /font-display:swap/);
});

test('fonts are self-hosted, no third-party font requests', () => {
  for (const host of ['fontshare.com', 'googleapis.com']) {
    assert.ok(!css.includes(host) && !html.includes(host), host);
  }
  const files = readdirSync(new URL('../dist/_astro/', import.meta.url));
  assert.ok(files.some((f) => f.endsWith('.woff2')), 'no woff2 in dist/_astro');
});

// The minifier may shorten #ffffff to #fff, so expand 3-digit colors first.
const hex = (name: string) => {
  const h = flat.match(new RegExp(`--color-${name}:#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-f])`, 'i'))?.[1] ?? '';
  return '#' + (h.length === 3 ? [...h].map((c) => c + c).join('') : h);
};
const lum = (h: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(hex(a)), lum(hex(b))];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

test('text passes WCAG AA', () => {
  for (const [fg, bg] of [
    ['ink', 'paper'],
    ['muted', 'paper'],
    ['on-flag', 'flag'],
  ]) {
    const ratio = contrast(fg, bg);
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
  }
});

test('the page has a dark mode', () => {
  assert.match(flat, /@media\(prefers-color-scheme:dark\)/);
});

// --- Motion ---
test('reduced-motion guard is in the CSS', () => {
  assert.match(flat, /@media\(prefers-reduced-motion:reduce\)/);
});

test('the nav turns into a frosted floating bar on scroll', () => {
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="\/me\/(_astro\/[^"]+\.css)"/g)]
    .map((m) => readFileSync(new URL(`../dist/${m[1]}`, import.meta.url), 'utf8'))
    .join('')
    .replace(/\s+/g, '');
  const rule = sheets.match(/\.toc(\[[^\]]+\])?\.is-floating\{[^}]*\}/)?.[0] ?? '';
  assert.match(rule, /backdrop-filter:blur\(/);
  assert.match(rule, /width:var\(--pill/);
});

// --- Link preview image ---
test('og.png is a 1200x630 PNG and is referenced absolutely', () => {
  const file = new URL('../dist/og.png', import.meta.url);
  assert.ok(existsSync(file), 'dist/og.png missing');
  const png = readFileSync(file);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(html.includes('property="og:image" content="https://acakbin1881.github.io/me/og.png"'));
});
