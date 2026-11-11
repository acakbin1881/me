// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Deployed from the `me` repo, so GitHub Pages serves it under a sub-path:
// https://acakbin1881.github.io/me. Every internal link and asset must go
// through `import.meta.env.BASE_URL` (see src/lib/url.ts).
// With a custom domain later: set `site` to that domain, drop `base`,
// and add public/CNAME.
export default defineConfig({
  site: 'https://acakbin1881.github.io',
  base: '/me',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
