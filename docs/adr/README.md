# Architecture decision records

One file per decision, numbered, never renumbered. An accepted ADR's *Decision* is not
edited later — write a new ADR and mark the old one `Superseded by ADR-NNNN`.

| ADR | Decision | Status |
|---|---|---|
| [0001](0001-astro-static-site-with-preserved-urls.md) | Build with Astro (static), deploy to GitHub Pages via Actions, keep legacy URLs | Accepted |
| [0002](0002-blog-posts-from-molayab-atom-feed.md) | Show Grove blog posts by reading molayab.com's Atom feed in the browser | Accepted |
| [0003](0003-shared-themeable-css-layer.md) | One shared, themeable CSS layer (`core/` + theme file) for all of the owner's sites | Accepted |
| [0004](0004-pico-as-optional-base.md) | Keep Pico as Grove's base, behind a bridge; `core/` must not depend on it | Accepted |
| [0005](0005-release-info-at-build-time.md) | Fetch release info at build time, rebuild on every release | Accepted |
| [0006](0006-copy-and-data-split-for-localization.md) | Translatable copy in per-locale content files, shared data separate | Accepted |
| [0007](0007-hero-cover-as-looping-video.md) | Hero cover is a looping muted video, not a GIF | Accepted |

## Template

```markdown
# ADR-NNNN: Title

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
**Date:** YYYY-MM-DD
**Deciders:** Mateo Olaya Bernal

## Context
## Decision
## Options considered
### Option A — …
| Dimension | Assessment |
|---|---|
| Complexity | |
| Cost | |
| Maintenance | |
**Pros:** … **Cons:** …
## Trade-off analysis
## Consequences
## Action items
```
