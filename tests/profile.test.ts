// Invariants of the content file. These must keep passing when Aras edits
// profile.ts (adds a date, a role, a school or a link), so they check shape,
// not the exact current content.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { profile } from '../src/data/profile.ts';
import { formatRange } from '../src/lib/format.ts';

const filled = (s: string | undefined) => typeof s === 'string' && s.trim().length > 0;

test('every role has a title, an organization and an end date', () => {
  assert.ok(profile.experience.length > 0);
  for (const r of profile.experience) {
    assert.ok(filled(r.role) && filled(r.org) && filled(r.end), JSON.stringify(r));
    if (r.start !== undefined) assert.ok(filled(r.start), `empty start on ${r.org}`);
  }
});

test('TrustRFQ is listed (spec decision: headline role belongs in Experience)', () => {
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

test('formatRange joins with an em dash and drops a missing start', () => {
  assert.equal(formatRange('Jul 2026', 'Present'), 'Jul 2026 — Present');
  assert.equal(formatRange('2025', '2026'), '2025 — 2026');
  assert.equal(formatRange(undefined, 'Present'), 'Present');
});
