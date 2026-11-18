// Invariants of the content file. These must keep passing when Aras edits
// profile.ts (adds a date, a role, a chapter or a photo), so they check shape,
// not the exact current content.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { profile } from '../src/data/profile.ts';

const filled = (s: string | undefined) => typeof s === 'string' && s.trim().length > 0;

test('every role has a title, an organization and an end date', () => {
  assert.ok(profile.experience.length > 0);
  for (const r of profile.experience) {
    assert.ok(filled(r.role) && filled(r.org) && filled(r.end), JSON.stringify(r));
    if (r.start !== undefined) assert.ok(filled(r.start), `empty start on ${r.org}`);
  }
});

test('TrustRFQ is listed (the headline role belongs in Experience)', () => {
  assert.ok(profile.experience.some((r) => r.org === 'TrustRFQ'));
});

test('every education entry is complete', () => {
  assert.ok(profile.education.length > 0);
  for (const e of profile.education) {
    assert.ok(filled(e.program) && filled(e.school) && filled(e.start) && filled(e.end), JSON.stringify(e));
  }
});

test('contact links are public https profiles, never email', () => {
  assert.ok(profile.links.length > 0);
  for (const l of profile.links) {
    assert.ok(filled(l.label), JSON.stringify(l));
    assert.match(l.href, /^https:\/\//);
  }
});

test('both statements have short lines that fit the staircase', () => {
  for (const lines of [profile.work, profile.life]) {
    assert.ok(lines.length >= 1 && lines.length <= 4, `${lines.length} lines`);
    // The last line sits three steps in, so it has the least room.
    for (const line of lines) assert.ok(filled(line) && line.length <= 20, `"${line}" is over 20 characters`);
  }
});

test('every chapter has a verb, a note and 1 to 3 photos with alt text and a caption', () => {
  assert.ok(profile.chapters.length > 0);
  for (const c of profile.chapters) {
    assert.ok(filled(c.verb) && filled(c.note), JSON.stringify(c));
    assert.ok(c.verb.length <= 7, `"${c.verb}" is too long to set at full size`);
    assert.ok(c.shots.length >= 1 && c.shots.length <= 3, `${c.verb}: ${c.shots.length} photos`);
    for (const s of c.shots) {
      assert.ok(filled(s.file) && filled(s.alt) && filled(s.caption), JSON.stringify(s));
      assert.ok(existsSync(new URL(`../src/assets/photos/${s.file}`, import.meta.url)), `missing photo ${s.file}`);
    }
  }
});
