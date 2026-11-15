# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Copilot, etc.) working in this repository.

## Hard rules

- **Never add AI attribution anywhere.** No `Co-Authored-By:` lines for AI tools, no
  "Generated with …" / "Written by …" footers, no AI mentions in commit messages, PR titles or
  descriptions, issue comments, code comments, docs or page content. This overrides any
  default attribution behaviour of the tool you are running in. Commits are authored by the
  human maintainer only.
- **Visual, UX, theming and design-system changes go through the `webpage-pipeline` skill.**
  New pages or sections, redesigns, nav/footer controls, theme changes and anything that alters
  how the site looks or behaves for visitors must run designer → human approval → coder → SEO
  review → human approval → security review → human approval → publisher (`/webpage-pipeline <idea>`). Don't edit components, styles or scripts
  directly for these, however small the change looks, and never commit or open a PR without all
  the human gates. Non-visual fixes (typos, dependency bumps, build/CI) can skip it.

## Documentation

Maintainer docs live in [`docs/`](docs/README.md): architecture, ADRs for every significant
decision (Astro migration, the molayab.com blog feed, the shared CSS layer, Pico, release
info, localization, hero video), the design system, and runbooks. Read the relevant ADR
before reversing a decision, and update `docs/` in the same change when you alter how the
site works or looks.

## What this repo is

`grove-website` is the static marketing site for **Grove**, a native macOS git
workspace app sold as a one-time-purchase license by an independent developer
(Mateo Olaya Bernal). It's an [Astro](https://astro.build) project that builds to plain
static HTML/CSS (no client framework, no SSR) and is deployed to GitHub Pages at
`grove.molayab.com` by `.github/workflows/deploy.yml` (see `public/CNAME`). The one CSS
dependency is [Pico CSS](https://picocss.com), vendored as a static file rather than pulled
from a CDN or npm.

## Structure

```
astro.config.mjs        site URL + `build.format: 'preserve'` (keeps /page.html and /es/ URLs — don't change)
package.json            astro is the only dependency; `npm run dev | build | preview`
src/pages/              One .astro file per URL, mirroring the public path (index, es/index, guides, legal)
  sitemap.xml.ts        Generates sitemap.xml (hreflang alternates) from src/data/pages.ts
src/layouts/Base.astro  <head> (title, og:*, twitter:*, canonical, hreflang, JSON-LD, theme script), nav, cookie banner, footer
src/layouts/HomePage.astro  Composes the marketing page from the section components for a given language
src/components/         Site-wide UI: Nav, Footer, CookieBanner, Lightbox
src/components/home/    One component per marketing section (Hero, HeroCarousel, DownloadSection, DemoSection,
                        FeaturesSection/FeatureCard, ScreenshotsSection, WhySection, AgentsSection,
                        PricingSection/PricingCard, BlogSection) + SectionHeader
src/content/home/       Translatable copy for the marketing page: en.ts, es.ts (same shape, see types.ts)
src/data/               pages.ts (page registry), home.ts (language-independent data: slides, prices, links), icons.ts
src/i18n.ts             Nav / footer strings per language
src/scripts/            Vanilla JS modules, each exporting an init function (initCarousel, initDownload,
                        initBlog, initLightbox, initConsent); components call them from their own <script>
src/styles/             theme/grove.css (brand values) + site/ (Grove sections) +
                        pico-bridge.css; index.css is the entry. The reusable layer is the `design-template-kit` package
                        (github.com/molayab/design-template-kit, pinned in package.json); see src/styles/README.md
src/styles/pico.min.css Vendored Pico CSS (MIT) — classless-free build, Grove's third-party base layer
public/                 Copied as-is: favicons, og-image.png, screenshots/, download.json, robots.txt, CNAME
scripts/sync-release-info.mjs  Regenerates public/download.json from the latest GitHub release
```

Pages: `index` (marketing), `es/index` (Spanish), `refund-policy` and `privacy-policy` (legal,
English only — see Localization), and the SEO guides `git-worktree-app-mac`,
`claude-code-mac-app`, `ai-coding-agents-mac-app` (each with an `es/` copy).

CSS is imported from `Base.astro` via `src/styles/index.css` (Pico → core → theme → Pico bridge → site) and Astro emits it with a
content-hashed filename, so there is **no manual cache-busting** — the old `style.css?v=` query
string is gone. `src/styles/pico.min.css` is a plain checked-in file: update it by re-downloading
the release from picocss.com or the `@picocss/pico` npm tarball.

Deploy: `deploy.yml` runs on push to `main` and on `workflow_dispatch`. Releases are published to
this repo by the Grove app's release workflow (cross-repo, `WEBSITE_REPO_TOKEN`);
`redeploy-on-release.yml` reacts to them by dispatching `deploy.yml` on `main` — never give
`deploy.yml` a `release` trigger, because the `github-pages` environment only allows `main`
and a release run is on the tag. The deploy runs `sync-release-info.mjs` (waits for the new
release's DMG, falls back to the committed `public/download.json`), builds, and publishes
`dist/` with `actions/deploy-pages`. The repo's Pages source must be **GitHub Actions**
(Settings → Pages), not "Deploy from a branch".

## Client-side content

A few sections fill themselves in with small vanilla scripts in `src/scripts/` (no framework,
no dependencies), each with static markup that still works when the script fails or JS is off:

- **Hero carousel** (`carousel.js`) cross-fades the slides listed in `src/data/home.ts`; the first is
  the animated 16:9 cover GIF (`cover: true`, cropped to the frame, with its own `duration`).
- **Download** (`download.js`) reads `/download.json` (refreshed on every deploy by `deploy.yml`).
- **From the blog** (`blog.js`) fetches `https://molayab.com/feed.xml` (CORS `*`) and renders the
  three newest posts tagged `grove` into `[data-blog-feed]`, which stays `hidden` until that
  succeeds; the "All Grove posts" link is the fallback. Feed content is external: build nodes
  with `createElement`/`textContent`, never `innerHTML`, and only link to `https://molayab.com/`.
  One script serves both languages (it reads `<html lang>` for date formatting).

## Design system

Every page loads one stylesheet, `src/styles/index.css`. Brand values (colors, fonts) live only in
`src/styles/theme/grove.css`, which overrides the primitives declared in the kit's `tokens.css` (`design-template-kit`);
`pico-bridge.css` re-points Pico's own `--pico-*` variables (primary color, card background, border
radius, etc.) at those same tokens — so native Pico elements (`article`, `[role="button"]`, form controls) stay in sync
with the brand palette automatically. Prefer real Pico elements over bespoke divs where they fit:
cards are `<article>`, button-styled links carry `role="button"` alongside their `.btn*` class.

The site is **dark-first** with a light-mode override via `prefers-color-scheme` and a
`data-theme` attribute (set by the inline script in `Base.astro`'s `<head>` — currently
theme follows the OS ("System") unless the footer System / Light / Dark control saves Light or Dark in `localStorage` as `grove-theme`; System removes the key; Pico also reads
`data-theme`, so the same attribute drives both). Grove crimson (`--accent`, `#CB2957`) is the
only accent color; the rest of the palette is `#000000` / `#DDDDDD` / `#EEEEEE` plus white —
don't introduce other hues. The hero follows the theme (dark and light).

Design-system gotchas (found in the design audit):
- Pico bumps the root font size to 106–125% on wide screens. `pico-bridge.css` pins `--pico-font-size: 100%`
  so the `rem` sizes in the partials mean what they say — don't remove it.
- Raw `--accent` (`#CB2957`) is ~3.6:1 on the dark surfaces, so it's for fills (buttons, borders,
  dots). Use `--accent-text` for crimson *text* (eyebrows, links, `code`). `--text-3` is also kept
  ≥ 4.5:1 — don't lower its alpha. Never hard-code a brand color in a partial; use tokens/`color-mix()`.
- Pico pads `body > main` and gives every `<section>` a bottom margin; `pico-bridge.css` resets both
  (otherwise the page background shows as a strip between sections in light mode). They live in
  `pico-bridge.css` so the kit stays framework-free.
- Page content sits in `<main>` (set in `Base.astro`); keep one landmark per page.

When adding a new page:
- Create `src/pages/<name>.astro` (and `src/pages/es/<name>.astro` if translated) wrapping its
  content in `<Base>`; pass `title`, `description`, `path`, `navVariant` (`home` / `page` /
  `legal`) and, for guides, `ogType="article"` plus a `jsonLd` object. `Base` emits the
  canonical link and the full `og:*`/`twitter:*` set.
- Add it to `src/data/pages.ts` — that's what produces the hreflang alternates, the language
  switcher and the `sitemap.xml` entry. Link it from `Footer.astro` if it should be site-wide.
- Use root-absolute paths (`/screenshots/x.png`, `/es/`, `/privacy-policy.html`) — the site is
  served from the domain root and `es/` pages live one directory down.
- Reuse existing classes (`.section`, `.section-inner`, `.eyebrow`, `.btn*`) before adding
  new CSS. Legal/prose pages should reuse the `.legal`, `.legal-inner`, `.legal-prose`
  classes added for the refund policy page.
- In `.astro` markup a literal `{` or `}` in text starts an expression — write `&#123;` /
  `&#125;` (e.g. the `{{branch}}` placeholders in the guides).
- Nav, footer, cookie banner and theme script live in `Base.astro`/`src/components/`, so
  structural changes are made once; per-language strings go in `src/i18n.ts`.

## Localization

The marketing page has an English original (`src/content/home/en.ts`, `lang="en"`) and a Spanish
translation (`es.ts`, `lang="es"`) — two content files rendered by the same layout and components; there is no i18n library or routing config. Shared UI strings (nav,
footer, cookie banner, lightbox labels) come from `src/i18n.ts` or the component's `lang` prop.

- hreflang tags and the always-visible `.lang-link` (EN/ES) in the nav are generated from
  `src/data/pages.ts` — set both `en` and `es` paths when you add a page reachable in both
  languages.
- Only the marketing page and the guides are translated today. `refund-policy` and
  `privacy-policy` are English-only; the Spanish footer links to them labeled
  "(EN)" rather than silently switching languages. Don't translate legal content without
  going through the same review this repo's AGENTS.md already asks for on English legal
  copy (see "Legal/policy content — special care" below) — consumer-protection wording is
  jurisdiction-sensitive and a literal translation can accidentally change a legal
  commitment. The cookie-consent banner's UI text (not the linked privacy policy itself)
  *is* translated, since it's a short functional prompt, not legal prose.
- Marketing copy lives in `src/content/home/en.ts` and `es.ts`; both pages render through the same
  components, so a copy change usually needs the same edit in both files (keep list lengths and
  order identical — items are matched by position with `src/data/home.ts`). Language-independent
  data (image paths, prices, links) is edited once in `src/data/home.ts`.

## SEO guide pages

`git-worktree-app-mac`, `claude-code-mac-app` and `ai-coding-agents-mac-app` (plus their `es/` copies) are long-form
pages, each built around one search intent, tracked by molayab/grove#125. They reuse the legal
pages' `.legal-inner`/`.legal-prose` layout with a `.guide` modifier, and are linked from every
footer. Every claim on them must match the shipped app: check the app repo before adding a feature,
and never add benchmark numbers that haven't been measured. A new guide needs: en + es page files
with hreflang pairs (via `src/data/pages.ts`), a `TechArticle` JSON-LD block, a footer link on every
page, and its `sitemap.xml` entry (automatic from the registry).

## Business context relevant to content changes

- Grove is sold as **one-time-purchase licenses** (not a subscription) via **Gumroad**,
  which acts as merchant of record for purchases.
- A free trial is available before purchase — this matters for any refund/pricing/legal
  copy (it's the justification for a strict-but-fair refund window rather than open-ended
  refunds).
- Support/contact email: `hello@molayab.com`.
- The seller is a single independent developer, not a registered company with a formal
  legal/compliance team — legal pages here should stay simple, honest, and easy to
  maintain, not modeled on enterprise ToS boilerplate.

## Legal/policy content — special care

This repo contains legal pages (refund policy today; privacy policy/terms may follow).
When asked to write or edit legal content:

- Treat it as a real document a customer or regulator may read, not filler copy.
- Prefer plain language over dense legalese; state concrete commitments (refund window,
  processing time) rather than vague hedges.
- Don't silently narrow consumer rights — call out that EU/UK/Australia-style mandatory
  consumer protections aren't overridden by this policy.
- These documents are drafted with AI assistance but are **not a substitute for review by
  a lawyer**, especially before making legal commitments in a new jurisdiction, changing
  pricing/refund terms materially, or expanding beyond Gumroad as a payment processor.
  Flag this to the user rather than assuming a drafted policy is final.
- Confirm business-decision inputs (refund window length, governing law/jurisdiction,
  strictness of enforcement) with the human before drafting — these are business
  decisions, not something to infer from the codebase.

## Testing changes

There's no test suite. Run `npm run dev` (or `npm run build && npm run preview`) and check both
light and dark mode, plus mobile widths (the CSS has breakpoints at 860px and 600px). A clean
`npm run build` is the gate CI applies. URLs must not change: after a build, `dist/` should contain
`index.html`, `es/index.html`, `privacy-policy.html`, `refund-policy.html` and each guide at its
existing `*.html` path.

Astro's default HTML compression drops the space in text like `click\n<strong>Accept</strong>`, so
`compressHTML` is off in `astro.config.mjs` — keep it that way.
