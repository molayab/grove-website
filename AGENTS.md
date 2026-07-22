# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Copilot, etc.) working in this repository.

## What this repo is

`grove-website` is the static marketing site for **Grove**, a native macOS git
workspace app sold as a one-time-purchase license by an independent developer
(Mateo Olaya Bernal). It is plain HTML/CSS — no build step, no bundler, no
package manager. It's served via GitHub Pages at `grove.molayab.com` (see `CNAME`).
The one framework dependency is [Pico CSS](https://picocss.com), vendored as a
static file (see below) rather than pulled from a CDN or npm.

## Structure

```
index.html            Single-page marketing site (hero, features, screenshots, pricing, footer)
refund-policy.html     Legal page: refund policy (English only — see Localization below)
es/index.html          Spanish translation of the marketing page
style.css              All styles for every page — design tokens + per-section rules, loaded after Pico
vendor/pico.min.css     Vendored Pico CSS (MIT) — classless-free build, used as the base stylesheet
favicon.svg, favicon-*.png, apple-touch-icon.png   Site favicon (SVG + PNG fallbacks)
screenshots/            PNGs referenced by index.html and es/index.html
CNAME                   GitHub Pages custom domain
```

There is no `/dist`, no bundler, no JS framework. Pages are deployed as-is on push to `main`.
`vendor/pico.min.css` is checked in as a plain file — update it by re-downloading the release
from picocss.com or the `@picocss/pico` npm tarball, there's no package.json tracking the version.

`style.css` is linked with a cache-busting query string (`style.css?v=YYYYMMDD`) in every page.
There's no hashed-filename build step, so without this a CSS-only change can deploy successfully
while visitors keep getting the old stylesheet from browser/CDN cache indefinitely — bump the
date in **every** `<link>` that references `style.css` whenever you touch it (grep for
`style.css?v=` to find them all).

## Design system

Every page loads `vendor/pico.min.css` first, then `style.css`. `style.css` defines the brand's
own CSS custom properties at the top (`:root`) for colors, radii, and fonts, and also re-points
Pico's own `--pico-*` variables (primary color, card background, border radius, etc.) at those
same tokens — so native Pico elements (`article`, `[role="button"]`, form controls) stay in sync
with the brand palette automatically. Prefer real Pico elements over bespoke divs where they fit:
cards are `<article>`, button-styled links carry `role="button"` alongside their `.btn*` class.

The site is **dark-first** with a light-mode override via `prefers-color-scheme` and a
`data-theme` attribute (toggled by the inline script at the bottom of each page — currently
theme is inferred from the OS, there's no visible toggle control yet; Pico also reads
`data-theme`, so the same attribute drives both). Grove crimson (`--accent`, `#CB2957`) is the
only accent color; the rest of the palette is `#000000` / `#DDDDDD` / `#EEEEEE` plus white —
don't introduce other hues.

When adding a new page:
- Copy the `<head>` (including both stylesheet links), `<nav>`, `<footer>`, and
  theme-detection `<script>` from an existing page (`index.html` or `refund-policy.html`)
  verbatim so nav/footer/theme stay consistent.
- Reuse existing classes (`.section`, `.section-inner`, `.eyebrow`, `.btn*`) before adding
  new CSS. Legal/prose pages should reuse the `.legal`, `.legal-inner`, `.legal-prose`
  classes added for the refund policy page.
- Keep every page self-contained HTML — no shared includes/templating exists, so structural
  changes to nav/footer must be applied by hand to every `.html` file.

## Localization

The marketing page has an English original (`index.html`, `lang="en"`) and a Spanish
translation (`es/index.html`, `lang="es"`) — plain duplicated static HTML, no i18n
library or build step, consistent with the rest of this repo. `es/index.html` uses
`../`-prefixed paths for every shared asset (`style.css`, `vendor/pico.min.css`,
favicons, `screenshots/`, `download.json`) since it lives one directory down.

- Both pages carry `<link rel="alternate" hreflang="...">` tags pointing at each other
  plus `x-default`, and a small always-visible `.lang-link` (EN/ES) in the nav — update
  both ends whenever you add or rename a page that should be reachable in both languages.
- Only the marketing page is translated today. `refund-policy.html` is English-only;
  `es/index.html`'s footer links to it labeled "(EN)" rather than silently switching
  languages. Don't translate legal content without going through the same review this
  repo's AGENTS.md already asks for on English legal copy (see "Legal/policy content —
  special care" below) — consumer-protection wording is jurisdiction-sensitive and a
  literal translation can accidentally change a legal commitment.
- When editing marketing copy in `index.html`, check whether `es/index.html` needs the
  same change. They're independent files, not generated from a shared source.

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

There's no test suite or build. To verify a change, open the HTML file directly in a
browser (or run a static file server, e.g. `python3 -m http.server`) and check both light
and dark mode, plus mobile widths (the CSS has breakpoints at 860px and 600px).
