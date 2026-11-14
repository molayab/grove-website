# Runbook: common tasks

Each recipe ends with: `npm run build` passes, and you checked the result in a browser in
dark and light mode at desktop and ~390px wide. For visual changes, prefer running the
`/webpage-pipeline` skill (designer plan → your approval → coder → your approval → PR).

## Edit home-page copy

1. Edit `src/content/home/en.ts` **and** `src/content/home/es.ts` — same field, same list
   position. Fields may contain trusted HTML (`&amp;`, `<br>`, `<code>`); `alt`, `label` and
   carousel `caption` are plain text.
2. Product claims must match the shipped app (check the app repo). Prices live in
   `src/data/home.ts`, not in the copy files.

## Add a feature card

1. Add an icon to `src/data/icons.ts` (36×36 viewBox, stroke `currentColor`).
2. Insert its key into `featureOrder` in `src/data/home.ts`.
3. Insert `{ title, body }` at the **same index** in both content files. The last item is the
   full-width highlight card. 12 regular cards fill the 4/3/2-column grids evenly.

## Replace screenshots or the hero cover

- Screenshots: 1800×1125 PNG in `public/screenshots/`; update `width`/`height` and alt text
  in `src/data/home.ts` / content files if they change.
- Cover video (window-only recording, close to 16:10):
  ```sh
  ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -an \
         -movflags +faststart public/screenshots/grove-cover.mp4
  ffmpeg -ss 0.4 -i public/screenshots/grove-cover.mp4 -frames:v 1 -vf scale=1800:-2 \
         -q:v 3 public/screenshots/grove-cover-poster.jpg
  ```
  Then set `width`, `height` and `duration` (ms, one loop) on the first `heroSlides` entry.

## Add a page or an SEO guide

1. `src/pages/<name>.astro` (and `src/pages/es/<name>.astro` if translated), content inside
   `<Base lang title description path navVariant>`; guides add `ogType="article"` and a
   `TechArticle` `jsonLd` object.
2. Register it in `src/data/pages.ts` (`en`, optional `es`, `lastmod`) → hreflang, EN/ES link
   and sitemap are automatic.
3. Footer link (if site-wide): `src/components/Footer.astro` + `src/i18n.ts`.
4. Use root-absolute paths. Write a literal `{` as `&#123;` in `.astro` markup.
5. Legal pages: see AGENTS.md "Legal/policy content — special care" first.

## Change colors or fonts

Edit only `src/styles/theme/grove.css` (primitives). Recompute contrast for `--brand-on-dark`
and `--brand-on-light` (≥ 4.5:1) and update [design/design-system.md](../design/design-system.md).
New semantic tokens belong in the kit (see "Change shared styles").

## Change shared styles (the kit)

Shared CSS comes from [`design-template-kit`](https://github.com/molayab/design-template-kit),
pinned in `package.json`. To change it: edit the kit's `src/`, `npm run build`, commit `dist/`,
bump `version`, tag `vX.Y.Z`; then here set the tarball URL in `package.json` to the new tag,
`npm install`, and re-check every page in dark and light. Grove-only styles stay in
`src/styles/site/`. See [ADR-0003](../adr/0003-shared-themeable-css-layer.md).

## Use the kit in another project

Follow the kit's README: install the tarball (or load `dist/core.css` from a tag via a CDN),
write a theme file from `themes/example.css`, load it after the kit. Pico and
`pico-bridge.css` are Grove-only and not needed.

## Update Pico

Download the release from picocss.com or the `@picocss/pico` npm tarball, replace
`src/styles/pico.min.css`, then re-check every page in both themes —
`src/styles/pico-bridge.css` may need adjusting ([ADR-0004](../adr/0004-pico-as-optional-base.md)).
