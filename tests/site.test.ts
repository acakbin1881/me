// Checks the built page in dist/. Run via `npm run check` (builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { profile } from '../src/data/profile.ts';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const text = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

test('page is English', () => {
  assert.match(html, /<html lang="en"/);
});

test('exactly one h1 holding the name', () => {
  const h1s = html.match(/<h1[\s\S]*?<\/h1>/g) ?? [];
  assert.equal(h1s.length, 1);
  assert.match(text(h1s[0]), /Aras/);
  assert.match(text(h1s[0]), /Akbin/);
});

test('sections have h2 headings and ids', () => {
  const h2s = (html.match(/<h2[\s\S]*?<\/h2>/g) ?? []).map(text);
  for (const t of ['Experience', 'Education', 'Contact']) assert.ok(h2s.includes(t), `h2 ${t}`);
  for (const id of ['experience', 'education', 'contact']) assert.match(html, new RegExp(`id="${id}"`));
});

test('nav links to sections under the base path', () => {
  for (const id of ['experience', 'education', 'contact']) {
    assert.ok(html.includes(`href="/me/#${id}"`), `nav #${id}`);
  }
});

test('every organization and school is shown', () => {
  const body = text(html);
  for (const r of profile.experience) assert.ok(body.includes(r.org), r.org);
  for (const e of profile.education) assert.ok(body.includes(e.school), e.school);
});

test('missing start date renders as Present only', () => {
  assert.ok(text(html).includes('Present'));
  assert.ok(!html.includes('undefined'));
});

test('profile links are present with rel="me"', () => {
  for (const l of profile.links) {
    const a = html.match(new RegExp(`<a[^>]*href="${l.href.replace(/[.?]/g, '\\$&')}"[^>]*>`));
    assert.ok(a, `link ${l.href}`);
    assert.match(a[0], /rel="me"/);
  }
});

test('no email, placeholders or About section', () => {
  for (const s of ['mailto:', 'TODO', 'About']) assert.ok(!html.includes(s), s);
});

test('every root-relative URL stays under /me/', () => {
  const urls = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const u of urls) assert.ok(u.startsWith('/me/'), u);
});

// --- Design tokens and fonts (Task 3) ---
import { readdirSync } from 'node:fs';

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

test('Swiss red and paper background tokens are in the CSS', () => {
  assert.ok(flat.toLowerCase().includes('#e30613'));
  assert.ok(flat.toLowerCase().includes('#f2f1ee'));
});

test('fonts are self-hosted, no third-party font requests', () => {
  for (const host of ['fontshare.com', 'googleapis.com']) {
    assert.ok(!css.includes(host) && !html.includes(host), host);
  }
  const files = readdirSync(new URL('../dist/_astro/', import.meta.url));
  assert.ok(files.some((f) => f.endsWith('.woff2')), 'no woff2 in dist/_astro');
});

// --- Layout and motion (Task 4) ---
test('reduced-motion guard is in the CSS', () => {
  assert.match(flat, /@media\(prefers-reduced-motion:reduce\)/);
});

test('the name has an intro animation defined by @keyframes', () => {
  const kf = flat.match(/@keyframes([\w-]+)\{/);
  assert.ok(kf, 'no @keyframes');
  const nameRule = flat.match(/\.name\{[^}]*\}/)?.[0] ?? '';
  assert.ok(nameRule.includes(kf[1]), `.name does not use ${kf[1]}`);
});

// --- Link preview image (Task 5) ---
import { existsSync } from 'node:fs';

test('og.png is a 1200x630 PNG and is referenced absolutely', () => {
  const file = new URL('../dist/og.png', import.meta.url);
  assert.ok(existsSync(file), 'dist/og.png missing');
  const png = readFileSync(file);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(html.includes('property="og:image" content="https://acakbin1881.github.io/me/og.png"'));
});
