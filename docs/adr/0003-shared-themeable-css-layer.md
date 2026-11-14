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

- **`core/`** (now the `design-template-kit` package, see the amendment below) — brand-neutral, framework-free CSS: tokens, reset, base, typography, buttons,
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
- Sharing `core/` across repos was left as a follow-up; it was extracted the same day (see the
  amendment).

## Action items

1. [x] Split layers, document the token API, remove literals.
2. [x] Extract `core/` to its own repo/package — done as `design-template-kit` v0.1.0.
3. [ ] Add a theme file for molayab.com.

## Amendment (2026-11-14): extracted to `design-template-kit`

`core/` now lives in its own public repo, [`molayab/design-template-kit`](https://github.com/molayab/design-template-kit),
and Grove consumes it as a pinned dependency. The Grove-only layers stay here
(`theme/grove.css`, `site/`, `pico-bridge.css`).

- **Distribution.** The kit commits a generated `dist/` (single-file `core.css`, `foundation.css`,
  `tokens.css`) so it installs straight from GitHub with no build step. Grove depends on the
  release **tarball URL** (`https://github.com/molayab/design-template-kit/archive/refs/tags/vX.Y.Z.tar.gz`),
  not `github:owner/repo`: npm resolves the shortcut to `git+ssh`, which fails in GitHub Actions
  (no SSH key), while the tarball is a plain HTTPS download with an integrity hash in the lockfile.
- **Versioning.** Semver; a renamed token or class is a major bump. Upgrading = change the tag in
  `package.json`, `npm install`, re-check pages in both themes.
- **License.** The kit is MIT-licensed (from v0.1.1) so it can be reused freely; Grove's own
  content, copy and assets stay proprietary — the kit contains no brand values or Grove assets.
- **Rule of thumb.** A style that any site could use belongs in the kit; a style tied to Grove's
  sections belongs in `src/styles/site/`.
- **molayab.com** is not migrated yet (Jekyll today; the owner plans to move it to Astro or another
  generator). The kit's README documents the static-HTML/CDN route for a future adopter.
- **Moved verbatim.** The build output is rule-for-rule identical to before the extraction; the only
  difference is that the mobile `.section` padding rule sits in its own `@media` block.
