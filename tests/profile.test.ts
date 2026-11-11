import { test } from 'node:test';
import assert from 'node:assert/strict';
import { profile } from '../src/data/profile.ts';
import { formatRange } from '../src/lib/format.ts';

test('experience is newest first and starts with TrustRFQ', () => {
  assert.deepEqual(profile.experience.map((r) => r.org), [
    'TrustRFQ',
    'Upvera',
    'Stellar Development Foundation',
    'ODTÜ Blockchain',
  ]);
  assert.equal(profile.experience[0].start, undefined);
  assert.equal(profile.experience[0].end, 'Present');
});

test('education matches LinkedIn', () => {
  assert.deepEqual(profile.education.map((e) => e.school), [
    'De Anza College',
    'Middle East Technical University (ODTÜ)',
  ]);
});

test('contact links are LinkedIn and GitHub only', () => {
  assert.deepEqual(profile.links.map((l) => l.href), [
    'https://www.linkedin.com/in/aras-akbin-36b9842a7/',
    'https://github.com/acakbin1881',
  ]);
});

test('formatRange joins with an em dash and drops a missing start', () => {
  assert.equal(formatRange('Jul 2026', 'Present'), 'Jul 2026 — Present');
  assert.equal(formatRange('2025', '2026'), '2025 — 2026');
  assert.equal(formatRange(undefined, 'Present'), 'Present');
});
