# ADR-0004: Keep Pico as Grove's base, behind a bridge; `core/` must not depend on it

**Status:** Accepted
**Date:** 2026-11-14
**Deciders:** Mateo Olaya Bernal

## Context

Grove adopted [Pico CSS](https://picocss.com) (vendored, MIT) for sensible element defaults
(`article`, `[role=button]`, forms, `dialog`). Pico also has opinions that fought the design:
it scales the root font size to 106–125% on wide screens (everything looked oversized), pads
`body > main`, and adds a bottom margin to every `<section>` (visible strips in light mode).
The shared CSS layer ([ADR-0003](0003-shared-themeable-css-layer.md)) must work on sites that
don't use Pico.

## Decision

Keep Pico in Grove, imported first, and isolate all Pico-specific glue in
`src/styles/pico-bridge.css`: map `--pico-*` variables to our tokens, pin
`--pico-font-size: 100%`, reset `body > main` padding and `section` margins. `core/` contains
nothing that requires Pico (the lightbox positions its own `<dialog>`; prose styles its own
tables).

## Options considered

- **Remove Pico entirely** — smaller CSS (~80 KB less) and no overrides, but a visual
  regression risk across all pages and it changes an existing project convention. Viable
  later; `core/` already works without it.
- **Keep Pico and let `core/` rely on it** — rejected: breaks reuse on molayab.com.
- **Bridge (chosen)** — keeps Grove's look, keeps `core/` portable.

## Consequences

- Don't remove `--pico-font-size: 100%` or the resets from the bridge.
- Removing Pico later = delete two imports in `src/styles/index.css` and re-check pages.
