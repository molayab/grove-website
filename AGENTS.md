# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Copilot, etc.) working in this repository.

## What this repo is

`grove-website` is the static marketing site for **Grove**, a native macOS git
workspace app sold as a one-time-purchase license by an independent developer
(Mateo Olaya Bernal). It is plain HTML/CSS — no build step, no framework, no
package manager. It's served via GitHub Pages at `grove.molayab.com` (see `CNAME`).

## Structure

```
index.html          Single-page marketing site (hero, features, screenshots, pricing, footer)
refund-policy.html   Legal page: refund policy
style.css            All styles for every page — shared design tokens + per-section rules
screenshots/          PNGs referenced by index.html
CNAME                 GitHub Pages custom domain
```

There is no `/dist`, no bundler, no JS framework. Pages are deployed as-is on push to `main`.

## Design system

`style.css` defines CSS custom properties at the top (`:root`) for colors, radii, and fonts.
The site is **dark-first** with a light-mode override via `prefers-color-scheme` and a
`data-theme` attribute (toggled by the inline script at the bottom of each page — currently
theme is inferred from the OS, there's no visible toggle control yet). Grove green
(`--accent`) is the only accent color; don't introduce other hues.

When adding a new page:
- Copy the `<head>`, `<nav>`, `<footer>`, and theme-detection `<script>` from an existing
  page (`index.html` or `refund-policy.html`) verbatim so nav/footer/theme stay consistent.
- Reuse existing classes (`.section`, `.section-inner`, `.eyebrow`, `.btn*`) before adding
  new CSS. Legal/prose pages should reuse the `.legal`, `.legal-inner`, `.legal-prose`
  classes added for the refund policy page.
- Keep every page self-contained HTML — no shared includes/templating exists, so structural
  changes to nav/footer must be applied by hand to every `.html` file.

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
