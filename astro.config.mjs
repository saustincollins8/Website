// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import baseLinksPlugin from './src/lib/base-links-plugin.mjs';

// The public address and the path the site is served from come from the build
// environment, so the same code works on GitHub Pages (which serves a project
// site under /<repository name>/), on a custom domain or on any other host.
// The deploy workflow reads both from the repository's GitHub Pages settings.
// Locally they fall back to the dev server at the root.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

if (process.env.CI && !site) {
  throw new Error(
    'SITE_URL is not set. Set it to the public address the site is built for.',
  );
}

export default defineConfig({
  site: site ?? 'http://localhost:4321',
  base,
  integrations: [sitemap()],
  markdown: {
    // Links and images written in the editor as /files/… are rooted at the site, not the domain.
    processor: satteri({ hastPlugins: [baseLinksPlugin(base)] }),
  },
  devToolbar: { enabled: false },
});
