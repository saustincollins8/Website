# Austin Collins: personal website

The personal academic website of Austin Collins, historian of early modern France. It is a static site: every page is built ahead of time into plain HTML, so there is no server or database to maintain.

## How it fits together

| Piece      | What it is                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Code       | [Astro](https://astro.build) 7, a static site generator. Node 24 (pinned in `.nvmrc`).                         |
| Content    | Markdown and YAML files in `src/content/`, checked against the schemas in `src/content.config.ts`.             |
| Editor     | [Pages CMS](https://pagescms.org), a free web editor that saves straight to this repository.                   |
| Hosting    | [GitHub Pages](https://docs.github.com/en/pages), published by the workflow in `.github/workflows/deploy.yml`. |
| Fonts      | Newsreader and Public Sans, bundled through [Fontsource](https://fontsource.org), so no Google Fonts requests. |
| Repository | `saustincollins8/Website` on GitHub, owned by Austin.                                                          |

## Editing the site

1. Sign in at [app.pagescms.org](https://app.pagescms.org) with GitHub and open the `Website` repository.
2. Edit a page, publication, talk or course and save.
3. Each save is a commit to `main`. The deploy workflow then rebuilds the site and publishes it, usually within two minutes. Progress shows under the repository's **Actions** tab.

The editing screens are defined in `.pages.yml`. Its field names must match the schemas in `src/content.config.ts`.

Removing a PDF or image from a field doesn't delete the file. Uploaded files stay in `public/files/` or `src/assets/`, and anything in `public/files/` stays downloadable at its address until the file itself is deleted.

Pages CMS works through its GitHub app, which must be installed on the account that owns the repository. Anyone with write access to the repository can then sign in with their own GitHub account and edit.

## Where things live

Content, in `src/content/`:

| File or folder  | Contents                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------- |
| `profile.yml`   | Name, tagline, bio, email, headshot, positions, interests, links, footer quote, site credit |
| `cv.yml`        | Positions, education, grants, honours, memberships, languages, and the CV PDF path          |
| `pages/`        | Free text for the home page bio, the Research page and the Teaching page                    |
| `publications/` | One file per publication; the citation is formatted automatically in Chicago style          |
| `talks/`        | One file per talk, podcast or piece of public writing                                       |
| `courses/`      | One file per course                                                                         |

Sections with no content stay hidden until something is added in the editor.

Uploads: images go in `src/assets/`, and PDFs such as the CV go in `public/files/`.

Code:

| Path                    | Contents                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `src/pages/`            | One file per page; the file name is the page's address         |
| `src/layouts/`          | The shared page frame: `<head>`, sidebar and footer            |
| `src/components/`       | Reusable pieces such as the header, citations and talk entries |
| `src/lib/`              | Helpers, including `withBase` for internal links (see below)   |
| `src/styles/global.css` | All styling                                                    |
| `astro.config.mjs`      | Site address, base path and the Markdown link plugin           |
| `.github/workflows/`    | The GitHub Pages deploy workflow                               |

## Run it locally

```sh
npm install
npm run dev      # live preview at http://localhost:4321
npm run build    # production build into dist/
npm run check    # type and content checks
npm run format   # format the code with Prettier
```

`npm run dev` starts a background server. Stop it with `npx astro dev stop`.

## Addresses and links

Nothing in the code names the site's address. It comes from two environment variables at build time:

- `SITE_URL`: the public origin, e.g. `https://saustincollins8.github.io` or `https://www.example.com`. It's used for the sitemap, canonical links, link previews and search-engine data. A build on CI fails if it's missing.
- `BASE_PATH`: the path the site is served from. GitHub Pages serves this repository at `/Website`; on a custom domain it is empty. It defaults to `/`.

The deploy workflow reads both from the repository's GitHub Pages settings. Locally they fall back to the dev server at the root.

Because the base path can change, internal links must never be written as `/cv/`. In code, use `withBase('cv/')` from `src/lib/site.ts`. In Markdown, root-relative links such as `/files/cv.pdf` are prefixed automatically by `src/lib/base-links-plugin.mjs`.

## Moving to a custom domain or another host

- **Custom domain on GitHub Pages:** add it under Settings → Pages → Custom domain. The workflow picks up the new address and the empty base path on the next deploy; no code changes.
- **Another host such as Cloudflare:** connect the repository, set the build command to `npm run build` and the output folder to `dist`, and set `SITE_URL` to the new address. Leave `BASE_PATH` unset for a site at the root of its domain. Then turn off GitHub Pages and delete `.github/workflows/deploy.yml`.

Changing the address later breaks links already shared and resets search rankings unless the old address redirects to the new one, so it's worth settling on the long-term address early.
