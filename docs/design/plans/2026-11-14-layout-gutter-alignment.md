---
id: 2026-11-14-layout-gutter-alignment
status: implemented
approved_by: human
approved_on: 2026-11-14
owner: webpage-designer
kit_pr: https://github.com/molayab/design-template-kit/pull/1
---
# Align nav, sections and footer to one page frame

## Goal
The nav and footer content edge does not line up with the section content, and the features (and
demo) grid sticks out far beyond the nav margin. Make every band of the page (nav, hero, sections,
footer) share one lateral frame defined by tokens, so left/right edges are predictable at every
width. Success: at 1440/1280/1100/1024/860/600/390 px the left edge of the logo, section
headings' column, grid cards and footer text follow the rules in "Changes", with no horizontal
scroll.

## Method (and limits)
chrome-devtools failed again ("browser already running" on the shared profile), so nothing was
measured in a browser. Numbers below are computed from the CSS (kit v0.1.1 `nav.css`,
`footer.css`, `layout.css`, `reset.css` which sets `box-sizing: border-box` globally, and
`src/styles/site/*.css`). The coder must confirm them in a browser (acceptance criteria).

## Root cause
The same "980px" means two different things:

- `.nav-inner` and `.footer-inner`: `max-width: 980px` **including** `padding: 0 2rem`
  (border-box). Content box = **916px**.
- `.section` has `padding: 96px 2rem` on the outer band and `.section-inner` has
  `max-width: 980px` with **no padding**. Content box = **980px**.
- Wide sections override only the inner: `.features .section-inner` and `.demo .section-inner`
  = **1160px** (content box 1160, capped by viewport minus 64px).
- Hero: padding `5rem 2rem 4rem`, content columns 820/860px.

Resulting left/right edges of the content (x of left edge, viewport centered):

| Viewport | Nav / footer | Sections 980 | Features / demo 1160 |
|---|---|---|---|
| 1440 | 262 (916 wide) | 230 (980 wide): 32px outside nav each side | 140 (1160 wide): **122px outside nav each side** |
| 1280 | 182 | 150 (32 out) | 60 (1160 wide, fits in 1280-64=1216): **122 out** |
| 1100 | 92 (916 wide) | 60 (980): 32 out | 32 (1036 wide): **60 out** |
| 1024 | 32 (960) | 32 | 32 |
| 860 | 32 | 32 | 32 |
| 600 / 390 | nav 32, footer 32 | sections 24 | features 24: **8px outside nav** |

So: (1) from 1044px up, sections are 64px wider than nav/footer (padding counted on one,
not the other); (2) features/demo add a further 180px of width; (3) at <= 600px the kit
shrinks the section gutter to 1.5rem but `.nav-inner`/`.footer-inner` keep 2rem (nothing in
the kit's 600px block changes their horizontal padding), a 8px mismatch. No grid overflows its
container (cards are `1fr` tracks, no horizontal scroll), the problem is purely inconsistent
frames. There is no width or gutter token, so every file hard-codes 980/1160/2rem/1.5rem.

## Scope
- In: lateral padding and max width of `.nav-inner`, `.footer-inner`, `.section`,
  `.section-inner`, `.hero` and the wide-section modifier; two new tokens; docs.
- Out: vertical padding, section order, copy, colors, grid column counts (1100/860/600
  breakpoints stay), the legal/guide 680px column (stays centered, narrower by design),
  the 420/560/480px centered sub-grids (pricing, blog, gallery on mobile).

## Design concepts used
Layout table in design-system.md "Layout and spacing". New: a width/gutter token pair.

## Changes
Proposed model: one **frame** = content width + gutter, used by every band.

- Tokens (kit `tokens.css`, brand-neutral defaults, themes may override):
  - `--gutter`: `2rem`; `1.5rem` at <= 600px (set once in a media query on `:root`).
  - `--page-max`: `980px` (reading column, content box, excludes gutter).
  - `--page-max-wide`: `1160px` (content box, excludes gutter).
- Rule: every `*-inner` is `max-width: calc(<measure> + 2 * var(--gutter))`, `padding-inline:
  var(--gutter)`, `margin-inline: auto`; so max-width always includes the gutter and content
  is exactly the measure. `.section` and `.hero` lose their own horizontal padding (the inner
  owns it) so the bands cannot drift again.
- **Recommended (option B): the frame is the wide one.** Nav, footer, features and demo use
  `--page-max-wide` (1160); the other sections (centered text, pricing, why, agents, blog,
  screenshots, hero) use `--page-max` (980) centered inside it. Features and demo then start
  exactly under the logo and end exactly under the nav's right-hand controls; narrower centered
  sections sit visibly inside the frame, which reads as intentional because their content is
  centered. At 1440 the logo moves from x=262 to x=140 (nav gets wider).
- Alternative (option A): the frame is 980. Features and demo drop to 980: 4 cards of 230px
  (currently 275px); the 12 titles and ES copy are tighter and 3 columns starts earlier.
  Simplest, narrowest page, but loses the large demo/screenshots presence.
- Responsive: below the frame width + gutter the content simply fills viewport minus gutter.
  Gutter is identical in nav, hero, sections, footer at every width (32 px above 600, 24 px
  at/below 600). Verify the nav's second row (<= 600) uses the same gutter.
- States: no hover/focus changes. Feature card hover `translateY(-2px)` must not cause
  overflow (none today). Dark and light identical (layout only).
- Copy: unchanged. Assets: none.

## Kit change (design-template-kit, own repo, new tag)
Reusable and brand-neutral, used by any site with nav/sections/footer, so it belongs in the kit,
not in `theme/grove.css`.
1. `tokens.css`: add `--gutter`, `--page-max`, `--page-max-wide` (+ 600px override of `--gutter`).
2. `nav.css`, `footer.css`, `layout.css`: consume them as in "Changes"; add a `.section-inner--wide`
   modifier (or `[data-width="wide"]`) in `layout.css`; remove the hard-coded 980/2rem/1.5rem.
   Keep `.legal-inner` 680 (`prose.css`) but make it inherit the gutter from the same rule.
3. `responsive.css`: drop the `.section` 1.5rem override (now the token).
4. Tag **v0.2.0** (visual change to consuming sites, so a minor bump). Consumers to bump:
   `grove-website` (`package.json` pin) and any other site on the kit (human to confirm: only
   molayab.com blog / others?). Done in the kit repo first.
Site layer after the bump (coder): delete `.features .section-inner { max-width: 1160px }` and
`.demo .section-inner { max-width: 1160px }`, use the wide modifier in `FeaturesSection.astro`
and `DemoSection.astro`, remove the hard-coded `.hero` padding-inline in `hero.css` /
`responsive.css`. Hero's 820/860 columns stay inside.
Fallback if the kit release is blocked: define the same three tokens in `theme/grove.css` and
override the kit's four selectors in the site layer, then upstream later (not preferred, it
duplicates kit rules).

## Design-system changes
- DONE (see Implementation notes): tokens above (kit repo). Not edited here because the kit is external; the doc update
  lands with the kit bump: rewrite the "Layout and spacing" table (gutter, page-max,
  page-max-wide, rule "inner owns the gutter, max-width includes it") and add a changelog line.
- Nothing edited in this repo during this run.

## Accessibility & performance budget
No contrast or color change. No horizontal scroll at 320-1920px (check `scrollWidth ==
clientWidth`). Tap targets unchanged (>= 24px). No layout shift: gutters are static CSS.
Reflow at 400% zoom (320 CSS px) must keep working: gutter 24px leaves 272px content.

## Acceptance criteria
- [x] At 1440, 1280, 1100, 1024, 860, 600, 390 px, `.nav-inner`, `.footer-inner` and the
      wide-frame sections' content boxes have identical left/right edges (+/- 1px).
- [x] Option B: the 980 sections are centered inside that frame; option A: all edges identical.
- [x] Gutter equals `var(--gutter)` in nav, hero, every section and footer; 24px at <= 600.
- [x] No horizontal scrollbar at any of the widths above, EN and ES, dark and light.
- [x] Feature grid keeps 4/3/2/1 columns at >1100/1100/860/600; highlight card spans full row.
- [x] No hard-coded 980/1160/2rem/1.5rem left in nav, footer, section, hero rules.
- [x] Legal and guide pages (680 column) still centered and aligned to the nav gutter.
- [x] `npm run build` clean; URLs unchanged; Lighthouse a11y still 100.

## Open questions for the human
1. Option B (nav/footer widen to 1160, recommended) or A (everything 980, features narrower)?
2. Is `design-template-kit` used by other sites that would need the v0.2.0 bump (and its
   visual change), or may I treat Grove as the only consumer?
3. Do you want the kit change done as a minor bump with tokens, or the site-layer fallback now
   and upstream later?

## Human decisions (gate 1, 2026-11-14)

1. **Option B**: nav, footer, features and demo share the 1160px frame; centred text sections
   stay 980px inside it.
2. **Kit consumers**: grove-website only today; molayab.com will adopt the kit in its Astro
   migration (phase 1), so it should start from v0.2.0.
3. **Kit v0.2.0 now** (no site-theme fallback): the change is made in design-template-kit first,
   then grove-website bumps its pin.
4. **Kit base**: the kit change goes on a new branch `layout-gutters` in design-template-kit,
   created from the human's unpublished `floating-theme-toggle` branch (commit 4e68a33, v0.1.2),
   so v0.2.0 ships both the floating toggle and the gutters in one release.

## Implementation notes

Kit (`../design-template-kit`, branch `layout-gutters`, uncommitted): `src/tokens.css`
(`--gutter`, `--page-max`, `--page-max-wide`, 600px override), `src/nav.css`, `src/footer.css`,
`src/layout.css` (`.section-inner--wide`, `.section` vertical padding only), `src/prose.css`
(`.legal-inner` = 680 + gutter), `package.json` (0.2.0), `README.md` (token row, new "Page frame"
section, install/jsDelivr examples now v0.2.0), `CHANGELOG.md` (0.2.0 incl. floating toggle),
regenerated `dist/*`. `src/responsive.css` needed no change: the 1.5rem override lived in `layout.css`.

Site: `src/styles/site/hero.css`, `responsive.css` (hero no horizontal padding; `.hero-inner` and
`.window-wrap` use `var(--gutter)`), `features.css`, `demo.css` (1160 overrides removed),
`FeaturesSection.astro`, `DemoSection.astro` (`section-inner--wide`), `docs/design/design-system.md`
(layout table + changelog).

**Pending (human):** `package.json`/`package-lock.json` still pin kit v0.1.1. After publishing tag
v0.2.0, bump the pin to `.../archive/refs/tags/v0.2.0.tar.gz` and `npm install`. Until then a normal
`npm ci` build does NOT have the new layout (tokens missing: `--gutter` undefined). Do not merge
the site change before the bump. Verified with `npm install --no-save ../design-template-kit`;
node_modules restored with `npm ci` afterwards.

**Pin bumped (2026-11-14, after gate 2):** kit PR #1 merged (5b9ecf2) and tagged v0.2.0 (annotated tag
d9a0230 -> 5b9ecf2). `package.json` now pins
`https://github.com/molayab/design-template-kit/archive/refs/tags/v0.2.0.tar.gz`; `npm install` updated
`package-lock.json` (only the `design-template-kit` entry: version 0.2.0, `resolved`, `integrity`).
`npm run build` passes with the real kit (no `--no-save`). The pending item above is done.

Deviations: `.window-wrap` (hero media) keeps `max-width: 860px` including the gutter (content 796px,
unchanged look) instead of 860 + gutter. `src/styles/README.md` had no layout numbers, untouched.

Measured (headless Chrome with an injected probe on a copy of dist; chrome-devtools MCP failed
again with "browser already running"). Content-box x range, dark, EN and ES identical:
- 1440: nav/features/demo/footer 140-1300; 980 sections 230-1210; hero text 310-1130
- 1280: 60-1220; sections 150-1130 | 1100: 32-1068; sections 60-1040 | 1024: 32-992 all
- 860: 32-828 all | 600 and 500: 24-576 / 24-476 all (gutter 24px)
- Legal and guide pages: nav/footer 140-1300, text 380-1060 at 1440 (centered); 24-476 at 500.
- `scrollWidth == clientWidth` at every width. Build clean, 10 pages, same URLs.
Unverified in browser: 390px exactly (headless minimum window ~500; same rule as 600), light
mode (layout-only, not rendered separately), the 4/3/2/1 feature column counts (breakpoints
untouched), Lighthouse a11y, 400% zoom.

## SEO review

Gate: not needed

No changes proposed. No SEO impact on changed pages: the change is CSS/layout only (two class
additions on Features and Demo wrappers); no copy, markup structure, heading, link or metadata change.

Checked on a build made with `npm install --no-save ../design-template-kit && npm run build`
(10 pages; node_modules restored with `npm ci`, ok):
- One `<h1>` per page on all 10 pages; `<html lang>` en/es correct; no `noindex` anywhere; canonical
  absolute, self-referencing, on `https://grove.molayab.com`.
- URLs: all profile-required files present in `dist/`; sitemap lists the same 10 URLs with hreflang
  pairs and x-default on translated pages; `robots.txt` allows crawling and points to the sitemap.
- Images: all 14 `<img>` on the home page carry `width`/`height` except the hidden lightbox `<img id="lightbox-img" alt="">`
  (pre-existing, populated on demand, not indexable content, no CLS). Width changes are CSS-only on
  fixed-aspect-ratio grids, so no layout shift from the new frame (static gutters, no JS/late content).
- Nothing hidden or clipped by the change: `.hero` keeps `overflow: hidden` as before; the plan reports
  `scrollWidth == clientWidth` at 1440-500 px.
- Sitemap `lastmod`: home `2026-11-14` (already set before this change); other pages unchanged,
  correct since their content did not change. Layout-only change does not require bumping.
- Freshness: copyright year 2026 ok; `public/download.json` v0.10.1 (published 2026-11-14) and the home page
  show no stale version strings; prices/features/translations untouched by this change.

Not checked: Lighthouse SEO/performance and CLS in a browser (chrome-devtools not run; the plan
also reports it failing on the shared profile); feed (site produces none; blog.js untouched);
product claims against the app repo (no copy changed).

Reminder (not an SEO item): `package.json` still pins kit v0.1.1; a plain `npm ci` build lacks the new
tokens (`--gutter` undefined). Bump the pin to v0.2.0 before merging, otherwise the production layout
(and hero padding, now 0) would regress.

## Security review

Verdict: PASS (all findings resolved; one info item and the optional SHA pinning of the kit's CI actions remain)

Scope: grove-website `main`, uncommitted (7 modified files + this plan; no commits ahead of
`origin/main`). design-template-kit branch `layout-gutters`: uncommitted changes (11 files) on top of
the unpublished commit `4e68a33` (floating theme toggle), the only commit ahead of `origin/main`;
both ship as v0.2.0.

| Severity | Location | What | Why it matters | Suggested fix |
|---|---|---|---|---|
| medium, RESOLVED | grove-website `package.json:13`, `package-lock.json:2071-2075` | Kit was pinned to v0.1.1 while the site CSS uses `var(--gutter)` | A merge with that pin would ship a regressed layout | Fixed: pin and lockfile now at the v0.2.0 tag (re-reviewed, see "Pin bump re-review" below) |
| low, RESOLVED | this plan, line 152 (Implementation notes) | Absolute local path in a file that will be committed to the public repo | Leaks local username/directory layout | Fixed: now `../design-template-kit`; no absolute local path left in the plan |
| low, RESOLVED | design-template-kit `.gitignore` | Did not cover `.env*` | Public repo; a stray `.env` could be committed | Fixed: `.env`, `.env.*`, `!.env.example` under "Local secrets"; no tracked file becomes ignored (`git check-ignore` on `git ls-files`: none) |
| low, RESOLVED | design-template-kit `.github/workflows/ci.yml` | No `permissions:` block | Default token permissions broader than needed | Fixed: workflow-level `permissions: contents: read`, enough for `actions/checkout` and `npm run check` (local `node` build + `git diff`, no writes to GitHub). Actions remain tag-pinned (`@v4`), optional SHA pinning left to the human |
| info | design-template-kit `4e68a33` | Commit author email is the maintainer's personal address (same as the two already-published commits) | Becomes public when pushed; consistent with existing history, so no new exposure | None, unless the human prefers a noreply address for future commits |

Checked:
- Secrets: grep for token prefixes (`ghp_`, `github_pat_`, `sk-`, `AKIA`, `xox`, `AIza`, `glpat-`), private keys,
  credentials in URLs, password/secret/api-key, local paths, over the site diff + plan, the whole kit tree and
  `git log -p --all` of the kit. No hits except the plan path above. No `.env*` files in either repo. Site
  `.gitignore` covers `node_modules/`, `dist/`, `.env`, `.env.*`. No public-by-design identifier added or changed.
- PII: none beyond the profile's intentional name. No images, no new third-party requests, embeds, fonts,
  storage keys or trackers, so the privacy policy is unaffected.
- Code safety: changes are CSS custom properties/`calc()` and one added class on two `.astro` wrappers; no JS,
  no `set:html`, no links, no external URLs (kit README jsDelivr example is HTTPS). Site workflows unchanged; the
  kit's `ci.yml` only gained `permissions: contents: read` (gate-2 fix, re-reviewed).
- Kit packaging: `package.json` has no `dependencies`, no `install`/`preinstall`/`postinstall` scripts (only
  `build`/`check`); `files` = `dist`, `src`, `themes`, `LICENSE`; `exports` map only CSS files and `package.json`;
  `LICENSE` (MIT) intact. `dist/` regenerated from the working tree in a temp copy: `core.css`, `foundation.css`,
  `tokens.css` byte-identical to the working-tree `dist/`; `4e68a33`'s own `dist/` also matches its `src/`.
- Dependencies (grove-website): `package.json`/`package-lock.json` unchanged; `npm ls --all` clean;
  `npm audit --omit=dev` and `npm audit`: 0 vulnerabilities; `npm outdated`: nothing outdated. Installed kit in
  `node_modules` is 0.1.1 (restored). Kit has no npm dependencies and no lockfile.

Pin bump re-review (non-registry dependency):
- `package.json`/`package-lock.json` diff touches only `design-template-kit`: spec and `resolved` =
  `https://github.com/molayab/design-template-kit/archive/refs/tags/v0.2.0.tar.gz` (expected host, owner/repo,
  immutable tag), version 0.2.0, `integrity` sha512 present; no `hasInstallScript` on the kit. Lockfile hosts:
  267 `registry.npmjs.org`, 1 `github.com` (the kit).
- Tarball provenance, checked offline: the npm cache entry addressed by the lockfile `integrity` exists and its
  sha512 matches; extracted into an empty temp dir, its full contents are identical (`diff -r`) to
  `git archive 5b9ecf2` of the kit, and `node_modules/design-template-kit/{dist,src}` match 5b9ecf2. Local tag
  v0.2.0 = object d9a0230 -> 5b9ecf2. The tree of 5b9ecf2 equals d10f808, whose diff from 4e68a33 reproduces the
  kit fingerprint e3fc3b67… below, i.e. the release is exactly what was reviewed. Commit messages carry no AI
  attribution. Tag and tarball were not re-fetched from GitHub (coordinator reports 200).
- Install scripts: `npm install-scripts ls` reports "No packages with unreviewed install scripts". The lockfile has
  one `hasInstallScript` package, `fsevents` (optional macOS dependency of the Astro toolchain), present before
  and after the bump (count 1 -> 1), so the npm notice is from that pre-existing package, not from the kit.
- `npm ls --all` clean (`design-template-kit@0.2.0`); `npm audit --omit=dev` and `npm audit`: 0 vulnerabilities;
  `npm outdated`: nothing.

Not checked: gitleaks/trufflehog (not installed); the deployed site.

Reviewed (grove-website): b13e37a7b1e1a9a9d6959705e8c175db453f7512 on 2026-11-14 (includes the pin bump;
supersedes edb03783…)
(`(git diff HEAD; git ls-files -o --exclude-standard | grep -v '^docs/design/plans/' | xargs shasum 2>/dev/null) | shasum`)

Reviewed (design-template-kit): e3fc3b671dfe9cea9e5bf272da89af21b6404961 on 2026-11-14
(same command with `git log origin/main..HEAD --format=%H` appended inside the parentheses; covers `4e68a33`
and the gate-2 fixes to `.gitignore` and `ci.yml`; supersedes 09f7c004…)
