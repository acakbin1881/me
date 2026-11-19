// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Hosted on Vercel at the domain root. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
// at build time (the production domain, custom domain included), so absolute
// URLs (og:image, sitemap) follow whatever domain the project uses.
// Internal links still go through url() in src/lib/url.ts.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: host ? `https://${host}` : 'http://localhost:4321',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  // /draft is a working page with notes on it; keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/draft/') })],
});
