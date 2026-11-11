// Downloads Switzer from Fontshare before each build.
//
// Why not commit the font: the ITF Free Font License allows self-hosting the
// font on your own website, but forbids redistributing the font files through
// a repository. The `me` repo is public, so the woff2 stays out of git
// (see .gitignore) and is fetched here instead. The built site still serves it
// from our own origin, so visitors never hit Fontshare.
import { existsSync, mkdirSync, mkdtempSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'src/styles/fonts/Switzer-Variable.woff2');
const source = 'https://api.fontshare.com/v2/fonts/download/switzer';
const inZip = 'Switzer_Complete/Fonts/WEB/fonts/Switzer-Variable.woff2';

if (existsSync(target)) {
  console.log('fonts: Switzer already present');
  process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), 'switzer-'));
try {
  const res = await fetch(source);
  if (!res.ok) throw new Error(`fonts: download failed with HTTP ${res.status}`);
  const zip = join(work, 'switzer.zip');
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  execFileSync('unzip', ['-q', '-o', zip, inZip, '-d', work]);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(work, inZip), target);
  console.log('fonts: Switzer downloaded');
} finally {
  rmSync(work, { recursive: true, force: true });
}
