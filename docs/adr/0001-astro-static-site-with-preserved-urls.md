# ADR-0001: Astro static site, deployed by GitHub Actions, with preserved URLs

**Status:** Accepted
**Date:** 2026-11-14
**Deciders:** Mateo Olaya Bernal

## Context

The site started as hand-written HTML: ten pages that each duplicated `<head>`, nav, footer,
cookie banner and five inline scripts, plus a manual `style.css?v=YYYYMMDD` cache-buster on
every page. Adding a page or a footer link meant editing every file by hand, and EN/ES copies
drifted. Pages were served from the `main` branch with no build step. Search engines already
index URLs like `/git-worktree-app-mac.html` and `/es/`.

## Decision

Build the site with **Astro in static mode** and deploy `dist/` to **GitHub Pages through a
GitHub Actions workflow** (`.github/workflows/deploy.yml`). Use `build.format: 'preserve'`
so `src/pages/x.astro` → `/x.html` and `src/pages/es/index.astro` → `/es/index.html`, keeping
every existing URL. Turn `compressHTML` off.

## Options considered

### Option A — Keep hand-written HTML
| Dimension | Assessment |
|---|---|
| Complexity | Low |
| Cost | Free |
| Maintenance | High: every structural change × 10 files, manual cache-busting |

**Pros:** no toolchain. **Cons:** duplication and drift, already causing bugs.

### Option B — Astro (static)
| Dimension | Assessment |
|---|---|
| Complexity | Medium: Node toolchain, a build in CI |
| Cost | Free (Pages + Actions) |
| Maintenance | Low: components, layouts, hashed CSS, typed content |

**Pros:** HTML-first, zero client JS by default, components and layouts, hashed assets,
can keep exact URLs. **Cons:** a build step; Pages source must be switched to Actions.

### Option C — Jekyll (what molayab.com uses)
| Dimension | Assessment |
|---|---|
| Complexity | Medium (Ruby) |
| Cost | Free, native to Pages |
| Maintenance | Medium: Liquid includes, weaker component model and typing |

**Pros:** no workflow needed. **Cons:** no typed props/content, no script bundling.

## Trade-off analysis

Astro removes the duplication that caused real drift, without shipping a client framework.
The cost is a build in CI and a one-time Pages setting change. URL preservation removes the
SEO risk.

## Consequences

- Nav, footer, cookie banner and `<head>` are edited once (`Base.astro`, `src/components/`).
- The Pages source must be **GitHub Actions**; the old "deploy from branch" would publish raw
  sources.
- `format: 'preserve'` and `compressHTML: false` are load-bearing — changing either can break
  URLs or glue words together (`click<strong>Accept`).
- The migration was verified by comparing every page's DOM, `<head>` and visible text against
  the pre-migration HTML.

## Action items

1. [x] Migrate pages, add `deploy.yml`, remove the branch-commit sync workflow.
2. [ ] Switch Settings → Pages → Source to GitHub Actions before merging the migration.
