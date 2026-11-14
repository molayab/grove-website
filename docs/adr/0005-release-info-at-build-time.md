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
