import { test } from 'node:test';
import assert from 'node:assert/strict';
import { looksLikeWoff2 } from '../scripts/fetch-fonts.mjs';

test('looksLikeWoff2 accepts a real-sized woff2 header', () => {
  const buf = Buffer.alloc(30_000);
  buf.write('wOF2', 0, 'latin1');
  assert.equal(looksLikeWoff2(buf), true);
});

test('looksLikeWoff2 rejects an HTML error page', () => {
  assert.equal(looksLikeWoff2(Buffer.from('<!doctype html><title>403</title>'.padEnd(30_000))), false);
});

test('looksLikeWoff2 rejects a truncated download', () => {
  const buf = Buffer.alloc(500);
  buf.write('wOF2', 0, 'latin1');
  assert.equal(looksLikeWoff2(buf), false);
});
