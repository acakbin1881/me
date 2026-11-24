// Renders cv/cv.html to cv/Aras-Akbin-CV.pdf with Playwright's Chromium.
// Run from the repo root: node cv/build.mjs
// Uses Switzer if `npm run build` has fetched it, otherwise falls back to Inter.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// require() so a globally installed Playwright is found too (NODE_PATH).
const { chromium } = createRequire(import.meta.url)('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(join(here, 'cv.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: join(here, 'Aras-Akbin-CV.pdf'),
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log('cv: wrote cv/Aras-Akbin-CV.pdf');
