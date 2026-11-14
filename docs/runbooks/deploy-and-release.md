# Runbook: deploy and release

**Use when:** shipping a site change, a new Grove release didn't show up on the site, or the
deploy failed. Background: [ADR-0001](../adr/0001-astro-static-site-with-preserved-urls.md),
[ADR-0005](../adr/0005-release-info-at-build-time.md).

## Prerequisites

- Push access to `molayab/grove-website`; `gh` CLI authenticated for PRs.
- **One-time setting:** Settings → Pages → Source = **GitHub Actions**, custom domain
  `grove.molayab.com` (also in `public/CNAME`). With "Deploy from a branch" the site would
  publish raw sources.

## Ship a site change

1. Work on a branch; `npm run build` must pass locally.
2. Open a PR (the `webpage-publisher` agent does this after human approval).
3. Merge to `main` → `Deploy to GitHub Pages` runs: `npm ci` → `sync-release-info.mjs` →
   `npm run build` → upload `dist/` → deploy.
4. Check the Actions run is green, then load `/`, `/es/`, one guide and one legal page.
   Hard-reload once; CSS/JS are content-hashed, so no cache-busting is needed.

## Publish a Grove release

1. Publish (or edit) the release on `molayab/grove-website` with the `Grove.dmg` asset.
2. The `release` event triggers the deploy; `download.json` is regenerated from it.
3. Verify the Download section shows the new version, size and date.

## When something goes wrong

| Symptom | Check | Fix |
|---|---|---|
| Site shows a directory listing / 404 at `/` | Pages source | Set Source to GitHub Actions; re-run the workflow (Actions → Deploy → Run workflow). |
| Deploy job fails at `npm ci` | Lockfile out of sync | `npm install` locally, commit `package-lock.json`. |
| Build fails | Workflow log | Reproduce with `npm ci && npm run build`; fix on a branch. |
| Old version in Download | "Sync release info" step warning | Re-run the workflow manually; the committed `public/download.json` was used as fallback. |
| Custom domain lost | `public/CNAME` present in `dist/`? | Restore `public/CNAME`; re-save the domain in Pages settings. |
| Blog cards missing | `https://molayab.com/feed.xml` reachable, CORS `*`, posts tagged `grove` | Fix on molayab.com — see [ADR-0002](../adr/0002-blog-posts-from-molayab-atom-feed.md). The fallback link still works. |

## Rollback

Revert the offending merge commit on `main` (`git revert <sha>` via a PR) and merge; the
deploy runs again with the previous content. To redeploy without code changes, use
"Run workflow" on the Deploy workflow.

## Escalation

Single maintainer: Mateo Olaya Bernal (`hello@molayab.com`). GitHub Pages incidents:
githubstatus.com.
