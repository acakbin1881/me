// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// The same build is published in two places:
// - Vercel, at the domain root. Vercel sets VERCEL_PROJECT_PRODUCTION_URL at
//   build time (custom domain included).
// - GitHub Pages, via .github/workflows/deploy.yml. The workflow sets SITE and
//   BASE_PATH from the Pages config: "/me" while the repo is called `me`,
//   "/" if it is renamed to acakbin1881.github.io.
// Internal links go through url() in src/lib/url.ts, so they follow `base`.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE || (host ? `https://${host}` : 'http://localhost:4321');
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  // /draft is a working page with notes on it; keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/draft/') })],
});
