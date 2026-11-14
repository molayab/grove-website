# ADR-0002: Show Grove blog posts by reading molayab.com's Atom feed in the browser

**Status:** Accepted
**Date:** 2026-11-14 (feature shipped in PR #26)
**Deciders:** Mateo Olaya Bernal

## Context

Release notes and engineering posts about Grove are written on the owner's personal blog,
molayab.com (Jekyll, GitHub Pages). The marketing site should surface the newest of them and
link to the blog for SEO and easy navigation, without duplicating posts or adding a CMS.
molayab.com publishes an Atom feed at `https://molayab.com/feed.xml` with
`Access-Control-Allow-Origin: *`, and tags Grove posts with the category `grove`.

## Decision

`src/scripts/blog.js` fetches the Atom feed **in the browser**, keeps entries whose
`<category term="grove">`, and renders the three newest as cards in `[data-blog-feed]`.

- DOM is built with `createElement`/`textContent` only, never `innerHTML` — the feed is
  external content. Links are only rendered if they start with `https://molayab.com/`.
- 5-second timeout via `AbortController`; summaries truncated to 160 characters.
- The grid is `hidden` until rendering succeeds. An always-visible "All Grove posts" link to
  `https://molayab.com/blog/#tag=grove` is the no-JS / failure fallback.
- Dates are formatted with the page's `<html lang>` (one script serves EN and ES).
- Every page also links to the blog from the nav ("Blog") and footer, and the author byline
  links to `https://molayab.com`, for crawlability and navigation.

## Options considered

### Option A — Client-side fetch of the feed (chosen)
| Dimension | Assessment |
|---|---|
| Complexity | Low: one script |
| Freshness | Immediate — a new post appears without rebuilding this site |
| Maintenance | Low |

**Pros:** no coupling between the two deploys. **Cons:** cards are not in the static HTML
(crawlers see the fallback link, not the post titles); depends on the feed's CORS header.

### Option B — Fetch the feed at build time
| Dimension | Assessment |
|---|---|
| Complexity | Low–Medium |
| Freshness | Only as fresh as the last build — needs a trigger from molayab.com |
| Maintenance | Medium: cross-repo dispatch or a schedule |

**Pros:** post titles in static HTML (better SEO). **Cons:** stale between builds.

### Option C — Copy posts into this repo
Rejected: duplicate content and two sources of truth.

## Trade-off analysis

Freshness without cross-repo plumbing won over having post titles in the static HTML; the
static nav/footer/byline links already give crawlers a path to the blog.

## Consequences

- Changing the feed's URL, format (Atom), category name or CORS on molayab.com breaks the
  cards silently (fallback link only). Treat those as a contract between the two sites.
- If SEO for post titles becomes important, revisit with Option B (scheduled build).

## Action items

1. [x] Ship client-side cards with fallback (PR #26).
2. [x] Link Blog from nav/footer and the byline to molayab.com.
