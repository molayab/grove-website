# Architecture

## Context and goals

Grove is a native macOS app sold by one independent developer. This repo is its marketing
site: a handful of static pages (home in English and Spanish, three SEO guides in both
languages, two English-only legal pages). Goals, in order:

1. **Cheap to run and maintain** — static hosting, no servers, one person can keep it current.
2. **Fast and accessible** — no client framework, Lighthouse accessibility 100.
3. **Stable URLs** — search results and links to `/page.html` and `/es/` must never break.
4. **Reusable design** — the styling layer is shared with the developer's other sites.

## High-level design

```
                  build time (GitHub Actions)                         runtime (browser)
 ┌──────────────────────────────────────────────────┐     ┌───────────────────────────────────┐
 │ GitHub Releases ──► scripts/sync-release-info.mjs│     │ dist/*.html (static, no framework)│
 │                         │ writes                 │     │   ├─ download.js ─► /download.json│
 │                         ▼                        │     │   ├─ blog.js ─► molayab.com/feed  │
 │ src/ ── astro build ──► dist/ ──► GitHub Pages ──┼────►│   ├─ carousel.js, lightbox.js     │
 │  pages, layouts, components, content, data,      │     │   └─ consent.js ─► GA (opt-in)    │
 │  styles, scripts      public/ copied as-is       │     │ Cloudflare beacon (cookie-free)   │
 └──────────────────────────────────────────────────┘     └───────────────────────────────────┘
```

### Source layout

| Path | Role |
|---|---|
| `astro.config.mjs` | `site`, `build.format: 'preserve'` (keeps `/x.html` and `/es/index.html`), `compressHTML: false` (the compressor drops spaces before inline tags). |
| `src/pages/` | One file per URL. Home pages are 5 lines: they render `HomePage` for a locale. Guides/legal hold their prose inside `<Base>`. `sitemap.xml.ts` generates the sitemap. |
| `src/layouts/Base.astro` | Every page's `<head>` (title, description, canonical, hreflang, Open Graph/Twitter, JSON-LD), theme script, nav, `<main>`, cookie banner, footer. |
| `src/layouts/HomePage.astro` | Composes the home sections for a locale. |
| `src/components/` | Site-wide UI (Nav, Footer, CookieBanner, Lightbox). `components/home/` has one component per home section. |
| `src/content/home/{en,es}.ts` | All translatable home copy, typed by `types.ts`. Same shape and list order in both. |
| `src/data/` | `pages.ts` (page registry → hreflang, EN/ES switch, sitemap), `home.ts` (language-independent data: slides, prices, links), `icons.ts`. |
| `src/i18n.ts` | Nav/footer strings per locale. |
| `src/scripts/` | Vanilla ES modules, each exporting `init*()`, called from the component that needs it. |
| `src/styles/` | `core/` (reusable), `theme/grove.css` (brand values), `site/` (Grove sections), `pico-bridge.css`, vendored `pico.min.css`. See [design/design-system.md](design/design-system.md). |
| `public/` | Copied verbatim: `screenshots/` (images, cover video), favicons, `og-image.png`, `robots.txt`, `CNAME`, `download.json` (fallback copy). |
| `scripts/sync-release-info.mjs` | Writes `public/download.json` from the latest GitHub release. |
| `.github/workflows/deploy.yml` | Build + deploy to Pages. |

### Data flow

- **Page metadata.** A page passes `path` to `Base`; `Base` looks it up in
  `src/data/pages.ts` to emit canonical, hreflang alternates and `og:locale:alternate`.
  `Nav` uses the same registry for the EN/ES link and `sitemap.xml.ts` for the sitemap, so
  registering a page once wires all three.
- **Home copy.** `HomePage` picks `content/home/en.ts` or `es.ts` and passes each section its
  slice. Lists (features, slides, screenshots, pricing tiers) are matched *by position* with
  `data/home.ts`, which holds the language-independent half (icons, image paths, prices).
- **Download button.** Static markup links to `releases/latest/download/Grove.dmg`.
  `download.js` then reads `/download.json` (written at build time) to show version, size and
  date. If the fetch fails, the static link still works.
- **Blog cards.** `blog.js` fetches `https://molayab.com/feed.xml` (Atom, CORS `*`), keeps
  entries with `<category term="grove">`, and renders the newest three with
  `createElement`/`textContent`. The grid stays `hidden` until that succeeds; the "All Grove
  posts" link is the fallback. Rationale: [ADR-0002](adr/0002-blog-posts-from-molayab-atom-feed.md).
- **Analytics.** Cloudflare Web Analytics (cookie-free) loads on every page. Google Analytics
  loads only after the visitor accepts the cookie banner (`consent.js`, choice in
  `localStorage`, re-openable from "Cookie Settings" in the footer). Disclosed in the
  privacy policy — change both together.
- **Theme.** An inline script in `<head>` sets `data-theme` from a saved choice or the OS and
  follows OS changes while nothing is saved. CSS tokens switch on `data-theme`.

## Integration points

| System | Used for | Failure mode |
|---|---|---|
| GitHub Releases (`molayab/grove-website`) | DMG download, release metadata | Build keeps the committed `download.json`; button still links to `latest`. |
| GitHub Pages + Actions | Hosting and deploy | See [runbooks/deploy-and-release.md](runbooks/deploy-and-release.md). |
| molayab.com Atom feed | Blog cards | Cards hidden, fallback link shown. |
| Gumroad (`gumroad.js` overlay) | Checkout (merchant of record) | Buy links still open the product page. |
| Cloudflare Web Analytics, Google Analytics | Analytics | None visible to visitors. |

## Key decisions

See [adr/README.md](adr/README.md) for the full list with alternatives and trade-offs:
Astro static build with preserved URLs, blog from the Atom feed, a shared themeable CSS
layer, Pico kept only as an optional base, release info at build time, copy/data split for
localization, and a looping video as the hero cover.
