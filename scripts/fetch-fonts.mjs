// Downloads Switzer from Fontshare before each build.
//
// Why not commit the font: the ITF Free Font License allows self-hosting the
// font on your own website, but forbids redistributing the font files through
// a repository. The `me` repo is public, so the woff2 stays out of git
// (see .gitignore) and is fetched here instead. The built site still serves it
// from our own origin, so visitors never hit Fontshare.
import { existsSync, readFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://api.fontshare.com/v2/fonts/download/switzer';
const IN_ZIP = 'Switzer_Complete/Fonts/WEB/fonts/Switzer-Variable.woff2';
const MIN_BYTES = 20_000; // the real file is ~43 KB
const ATTEMPTS = 3;

/** True for a plausible woff2 file: right magic bytes and not truncated. */
export function looksLikeWoff2(buf) {
  return buf.length >= MIN_BYTES && buf.subarray(0, 4).toString('latin1') === 'wOF2';
}

async function download(work) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(SOURCE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const zip = join(work, 'switzer.zip');
      writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
      execFileSync('unzip', ['-q', '-o', zip, IN_ZIP, '-d', work]);
      const font = readFileSync(join(work, IN_ZIP));
      if (!looksLikeWoff2(font)) throw new Error('downloaded file is not a valid woff2');
      return font;
    } catch (err) {
      lastError = err;
      console.warn(`fonts: attempt ${attempt}/${ATTEMPTS} failed: ${err.message}`);
      if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error(`fonts: could not fetch Switzer from ${SOURCE}: ${lastError?.message}`);
}

async function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const target = join(root, 'src/styles/fonts/Switzer-Variable.woff2');

  if (existsSync(target) && looksLikeWoff2(readFileSync(target))) {
    console.log('fonts: Switzer already present');
    return;
  }

  const work = mkdtempSync(join(tmpdir(), 'switzer-'));
  try {
    const font = await download(work);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, font);
    console.log('fonts: Switzer downloaded');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
