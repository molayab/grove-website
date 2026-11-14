# ADR-0003: One shared, themeable CSS layer for all of the owner's sites

**Status:** Accepted
**Date:** 2026-11-14
**Deciders:** Mateo Olaya Bernal

## Context

The owner runs several sites (Grove's site in Astro, molayab.com in Jekyll, more to come) and
wants them to share one visual language while keeping each brand's colors and fonts. The
original stylesheet mixed brand values, Pico overrides and page sections in one file, with
brand colors hard-coded (`rgba(203, 41, 87, …)`) in a dozen rules.

## Decision

Split `src/styles/` into layers with a documented token API (see
[`src/styles/README.md`](../../src/styles/README.md)):

- **`core/`** — brand-neutral, framework-free CSS: tokens, reset, base, typography, buttons,
  layout, nav, footer, prose pages, cookie banner, lightbox, responsive rules. Works with or
  without Pico (verified by removing Pico: only tables needed styles, now in `core/prose.css`).
- **`core/tokens.css`** — the API. *Primitives* a project overrides (`--brand`,
  `--brand-hover`, `--brand-contrast`, `--brand-on-dark`, `--brand-on-light`, `--font`,
  `--mono`, radii, dark/light neutral palettes) and *semantic* tokens components use
  (`--bg`, `--text-2`, `--accent-text`, `--border-strong`, `--shadow-frame`…). Accent tints are
  `color-mix()` of `--accent`, so a new brand color needs no other edits.
- **`theme/<project>.css`** — the only file with brand values. Grove's is `theme/grove.css`.
- **`site/`** — project-only sections (Grove's hero, pricing, features…).
- Plain CSS only — no preprocessor, no Tailwind — so Jekyll and Astro can both consume it.

## Options considered

### Option A — Keep one stylesheet per site
Low effort now; designs drift and every fix is done N times.

### Option B — Shared layer + per-project theme (chosen)
| Dimension | Assessment |
|---|---|
| Complexity | Medium: layering discipline, token naming |
| Reuse | High: any static site, any generator |
| Maintenance | Low: brand change = edit one theme file |

### Option C — Tailwind/utility framework shared via a preset
Rejected: adds a build dependency to molayab.com (Jekyll) and rewrites all markup.

## Trade-off analysis

Plain CSS custom properties give theming across generators with zero build requirements.
The cost is discipline: no literals in partials and docs kept current.

## Consequences

- Rules: no hard-coded brand colors in partials; `--accent-text` (not `--accent`) for text;
  keep `--text-3` ≥ 4.5:1; new brand-neutral components go in `core/`, Grove-only in `site/`.
- Demonstrated: overriding only primitives (teal brand, serif font, 4px radii, navy neutrals)
  re-themed the whole site.
- Today `core/` lives inside this repo. Sharing it across repos (git submodule, npm package
  from GitHub, or a separate repo) is a follow-up; until then, copy `core/` + write a theme.

## Action items

1. [x] Split layers, document the token API, remove literals.
2. [ ] Extract `core/` to its own repo/package once a second site adopts it (molayab.com).
3. [ ] Add a theme file for molayab.com.
