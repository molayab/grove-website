# ADR-0005: Fetch release info at build time and rebuild on every release

**Status:** Accepted
**Date:** 2026-11-14
**Deciders:** Mateo Olaya Bernal

## Context

The Download section shows the latest version, size and date. Previously a
`sync-release-info` workflow ran on `release` events and **committed `download.json` back to
`main`**, creating noise commits ("chore: sync download info…") and coupling releases to repo
history. With an Actions-based deploy ([ADR-0001](0001-astro-static-site-with-preserved-urls.md))
the build can fetch the data itself.

## Decision

`deploy.yml` runs on push to `main`, on `release: [published, edited]`, and manually. Before
building it runs `scripts/sync-release-info.mjs`, which writes `public/download.json` from the
release event payload or the GitHub API. If that fails, the committed
`public/download.json` is used and the job logs a warning. The browser reads `/download.json`;
the static button always links to `releases/latest/download/Grove.dmg`.

## Options considered

- **Commit-back workflow (previous)** — works, but noise commits and a bot with write access
  to `main`.
- **Client-side GitHub API call** — rate limits for anonymous visitors (60/h per IP).
- **Build-time fetch (chosen)** — no commits, no runtime API calls.

## Consequences

- Publishing or editing a GitHub release redeploys the site.
- The committed `public/download.json` can go stale; it is only a fallback.

## Amendment (2026-11-14): how the release triggers the build

The first version gave `deploy.yml` a `release` trigger. That breaks for releases: a
release-triggered run is on the tag ref, the `github-pages` environment only allows deploys
from `main`, and the job would build the tagged commit (possibly an older site). The decision
stands; the mechanism is now:

- `redeploy-on-release.yml` listens to `release: [published, edited]` and runs
  `gh workflow run deploy.yml --ref main -f release_tag=<tag>` with the built-in token
  (`workflow_dispatch` is allowed from `GITHUB_TOKEN`).
- `deploy.yml` only runs on push to `main` and `workflow_dispatch`.
- `sync-release-info.mjs` no longer reads an event payload; given `RELEASE_TAG` it polls the
  API until that tag is the latest release and `Grove.dmg` is uploaded (the app's release step
  creates the release before uploading the assets).
