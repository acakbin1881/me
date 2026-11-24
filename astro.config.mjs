// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Published in two places from the same push to main:
// - Vercel, at the domain root. Vercel sets VERCEL_PROJECT_PRODUCTION_URL at
//   build time (custom domain included), so og:image and the sitemap follow it.
// - GitHub Pages, under https://acakbin1881.github.io/me/. The Pages workflow
//   sets DEPLOY_TARGET=github-pages, which turns on the /me base path.
// Every internal link and asset goes through url() in src/lib/url.ts, so both work.
const pages = process.env.DEPLOY_TARGET === 'github-pages';
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: pages
    ? 'https://acakbin1881.github.io'
    : vercelHost
      ? `https://${vercelHost}`
      : 'http://localhost:4321',
  base: pages ? '/me' : undefined,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  // /draft is a working page with notes on it; keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/draft/') })],
});
