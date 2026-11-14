# ADR-0007: Hero cover is a looping muted video, not a GIF

**Status:** Accepted
**Date:** 2026-11-14
**Deciders:** Mateo Olaya Bernal

## Context

The hero carousel opened with a 16:9 animated GIF (1280×720, 1.3 MB). In review it looked
blurry on retina displays, the app window filled only ~60% of the frame, and its green
backdrop introduced a hue outside the brand palette.

## Decision

The first carousel slide is `public/screenshots/grove-cover.mp4` — the window-only screen
recording (1920×1264, ~1.2 MB) — with `grove-cover-poster.jpg` as poster. It is `muted loop
playsinline` without `autoplay`; `carousel.js` plays it only while it is the visible slide,
restarts it on entry, and never plays it under reduced motion, a user pause, or a hidden tab.
`object-fit: cover; object-position: top` fills the 16:10 frame. Slide dwell comes from
`data-duration` (16.7 s, one loop).

## Consequences

- Sharp at any DPR, smaller than the GIF, no off-palette backdrop, works in both themes.
- No-JS visitors see the poster image.
- New cover footage should be a window-only recording close to 16:10, re-encoded to H.264 MP4,
  with a regenerated poster (see runbooks/common-tasks.md).
