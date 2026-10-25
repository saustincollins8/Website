# AGENTS.md

Personal academic website for Austin Collins: a static Astro 7 site, edited by Austin (non-technical) through Pages CMS and published to GitHub Pages. See `README.md` for the full layout.

## Commands

- `npm run dev`: dev server at http://localhost:4321. In Astro 7 it runs in the background; stop it with `npx astro dev stop`.
- `npm run check`: type and content-schema checks. Must report 0 errors.
- `npm run build`: production build into `dist/`.
- `npm run format`: Prettier. `src/content/` is deliberately excluded.
- Test under a base path before pushing anything that touches links: `SITE_URL=https://example.github.io BASE_PATH=/Website npm run build`, then confirm `grep -rhoE '(href|src)="/[^"]*"' dist --include='*.html' | grep -v '"/Website/'` prints nothing.

## Links and addresses

- Never hard-code the site's address or write internal links as root-relative paths (`/cv/`, `/files/x.pdf`). The site is served under a base path (`/Website/` on GitHub Pages) that will change if it moves to a custom domain.
- In code, wrap every internal path in `withBase()` from `src/lib/site.ts`, and use `isCurrentPath()` for active-link checks.
- The address and base path come from `SITE_URL` and `BASE_PATH` (see `astro.config.mjs`). The deploy workflow sets them from the repository's Pages settings.
- Markdown bodies are covered by `src/lib/base-links-plugin.mjs`, which prefixes root-relative `href`/`src`.

## Content and the CMS

- `.pages.yml` defines the editor's forms and must stay in sync with `src/content.config.ts`. When you add, rename or remove a schema field, update both.
- The editor saves cleared fields as `""` or `null`. Use the schema helpers `optional()`, `withDefault()` and `list()` rather than bare `.optional()`, and `url()` rather than `z.url()`, so an editor mistake never fails the deploy.
- Inline images in rich-text fields use the `content-images` media entry (`../../assets`), because content files sit one level below `profile.yml`.
- Don't change the wording, spelling or facts in `src/content/` unless asked. It is Austin's text.

## Astro 7 specifics

- Markdown is rendered by Sätteri, not remark/rehype. Add Markdown plugins through `satteri({ hastPlugins: [...] })` in `astro.config.mjs`. `markdown.rehypePlugins` fails the build unless `@astrojs/markdown-remark` is installed.
- Import Zod from `astro/zod`. String formats are top-level (`z.url()`, `z.email()`).

## Style

- All styling is in `src/styles/global.css`. Colours are CSS custom properties on `:root`, redefined in a `prefers-color-scheme: dark` block, so add new colours to both.
- Match the existing code: short components, a brief comment where the reason isn't obvious, no new dependencies without a reason.

## Deploying

- Every push to `main` publishes the live site through `.github/workflows/deploy.yml`, and every save in Pages CMS is a push to `main`. Run `npm run check` and the base-path build before pushing.
