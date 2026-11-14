# Grove — Marketing Website

> Your dev workspace, one window.

The marketing site for **[Grove](https://grove.molayab.com)**, a native macOS git workspace app
for developers who use AI coding agents (Claude Code, opencode, Codex, Gemini CLI, Aider) — one
window instead of switching between a terminal, an editor, and a diff tool. Sold as a one-time-
purchase license via Gumroad, with a free trial before you buy.

**Live at [grove.molayab.com](https://grove.molayab.com)**

---

## What's here

An [Astro](https://astro.build) project that builds to plain static HTML/CSS and is deployed to
**GitHub Pages** by a GitHub Actions workflow on every push to `main`. The one CSS dependency is a
vendored copy of [Pico CSS](https://picocss.com).

| Path | What it is |
|---|---|
| `src/pages/` | One `.astro` file per URL: marketing page, `es/` translation, legal pages, SEO guides |
| `src/layouts/`, `src/components/` | Shared `<head>`, nav, footer, cookie banner, lightbox |
| `src/data/pages.ts` | Page registry — drives hreflang, the language switcher and `sitemap.xml` |
| `src/styles/` | `style.css` (design tokens + per-section rules) and vendored `pico.min.css` |
| `src/scripts/` | Small vanilla scripts (consent, download button, blog feed, carousel, lightbox) |
| `public/` | Static files copied as-is: screenshots/videos, favicons, `og-image.png`, `robots.txt`, `CNAME`, `download.json` |
| `.github/workflows/deploy.yml` | Syncs release info from GitHub Releases, builds, deploys to Pages |

Grove itself — the macOS app's source — lives in a separate, private repository.

---

## Preview locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview  # serve the production build
```

Check both light and dark mode, and the 860px/600px responsive breakpoints, before shipping a
change.

---

## Bug reports

This repo also doubles as the public intake queue for the app's in-app "Report a Bug" flow.
Reports are triaged with a status label (`status: logged` → `status: on-backlog` or
`status: invalid/duplicate`) before anything becomes real roadmap work.

---

## Contact

`hello@molayab.com` · Built by [Mateo Olaya Bernal](https://github.com/molayab)

---

## License

Proprietary. All rights reserved. © 2026 Mateo Olaya Bernal.
