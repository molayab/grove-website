---
id: 2026-11-15-mobile-nav-hamburger
status: published
pr: https://github.com/molayab/grove-website/pull/37
owner: webpage-designer
approved_by: human
approved_on: 2026-11-15
decisions: Download moves into the panel; collapse at 860px; icon-only button; legal variant stays inline (default); molayab.com kit bump is a separate step
---
# Collapsible (hamburger) navigation on small screens

## Goal
The mobile nav (two rows: logo + EN/ES + Download, then four links) looks lopsided and crowds
the first screen. Replace it with one compact bar and a collapsible menu, keeping the EN/ES
switch always visible. Success: at 390px the bar is one symmetric row, the menu opens and
closes by touch and keyboard, nothing is lost without JS, and no horizontal scroll or layout
shift is introduced.

## Method
Inspected the running dev server with chrome-devtools: home at 500px (the smallest the tool
would emulate; below 600 the same rules apply, 390 is computed from CSS) and `/es/` at 620px,
dark theme. Light theme uses the same geometry (colors are tokens), so it was not re-measured; the
coder must check both. Kit sources read: `node_modules/design-template-kit/src/nav.css` and
`responsive.css` (v0.3.0).

## Diagnosis (why it is not symmetric, <= 600px)
Measured at 500px wide (gutter 24 each side):
1. Row 1 is asymmetric by construction: a 111px logo on the left against a ~210px group
   (EN pill + Download button) on the right. Visual weight sits right; the row is not balanced
   and the CTA pushes the logo to the far edge.
2. Row 2 text is inset from row 1. `.nav-link` gets `padding: .5rem .25rem` and the row is
   `space-between`, so "Features" starts at x=28 while the logo starts at x=24, and "Blog" ends
   at 472 while the Download button ends at 476. Edges are 4px off on both sides.
3. Two different dividers: row 2 has its own `border-top` limited to the content box (24..476)
   under row 1, then the nav's full-width `border-bottom` right below it, so two hairlines of
   different length sit 43px apart.
4. Space-between on four words of different length gives equal box gaps but unequal visual
   rhythm (Features/Screenshots/Pricing/Blog), which reads as off-center in the row.
5. Nav height grows from 56px to 95px (about 12% of a 800px viewport, more on small phones)
   and differs per variant: the `legal` variant has no actions, so its second row holds two links
   pushed to opposite edges.
6. 601-860px: the single row still fits, but in Spanish at 620px the gap between logo and
   links is only 6px (logo ends 143, links start 149; links end 419, actions start 429).
   Anything longer (a new link, a longer translation) will collide.
   (Unrelated, noted for the coder: `scrollWidth` was 744 at a 620px viewport on `/es/`, i.e. some
   element overflows horizontally. Not the nav; check and report separately.)

## Scope
- In: nav bar and menu behaviour at <= 860px for `home` and `page` variants; hamburger
  button; EN/ES placement; `Download` placement; nav strings (menu label) in `src/i18n.ts`;
  kit `nav.css` / `responsive.css`.
- Out: desktop nav (> 860px) is unchanged; section order and copy; footer; cookie banner; the
  `legal` variant stays inline (see below); colors and tokens (none added).

## Design concepts used
- Tokens only: `--bg`, `--border`, `--border-strong`, `--text`, `--text-2`, `--accent`,
  `--gutter`, `--radius`, `--radius-pill` (design-system "Color", "Layout and spacing").
- Existing `.btn .btn-primary-dark` for Download, `.lang-link` pill for EN/ES, 2px accent focus
  ring, sticky blurred nav (design-system "Components > Nav").
- Existing frame: nav content uses the same `--gutter` (2rem, 1.5rem at <= 600px) as sections.
- New concept, justified: a disclosure "menu button" (no existing pattern). Reusable and
  brand-neutral, so it belongs in the kit.

## Changes

### Nav (`home` and `page` variants), <= 860px
- **Where**: `src/components/Nav.astro`, kit `nav.css` / `responsive.css`.
- **Breakpoint**: collapse at <= 860px (an existing breakpoint, no new one). Reason: the 601-860
  range already has the 6px collision in Spanish, and a tablet-portrait hamburger is a normal
  pattern. Above 860 nothing changes.
- **Bar (one row, 56px, same as desktop)**: logo at the left edge; at the right edge a group
  of `EN/ES pill` + `menu button`. Both share the 36px height; the menu button is a 44x44px
  touch target (visual 36px icon box, 44px hit area). Gap inside the group 0.5rem. Left and
  right edges are the gutter, exactly like the content below. Result: logo left, controls
  right, one hairline (the nav's own `border-bottom`), nothing else.
- **Menu button**: icon-only three-line glyph that morphs to an X when open; a real `<button
  type="button">` with `aria-expanded`, `aria-controls` pointing at the menu panel and an
  accessible name from i18n ("Menu" / "Cerrar menu" style, final copy below; the name
  changes with state, or a constant "Menu" with `aria-expanded`; coder picks one, not both).
  Outline: 1px `--border`, `--radius-pill`-free rounded square using `--radius-sm`; hover
  border `--border-strong`; icon color `--text`; focus ring 2px `--accent` with offset.
- **Menu panel**: drops directly under the bar, full width, same blurred `--bg` as the nav
  (opaque enough for legibility: `--bg` at >= 94% when open, since text sits over page
  content), 1px bottom `--border`. Content in the frame gutter:
  1. The links (Features, Screenshots [home only], Pricing, Blog) as a vertical list, each a
     full-width row with 48px min height, 1rem text (larger than the 0.875rem desktop link),
     `--text-2`, hover/active `--text`, 1px `--border` separator between rows.
  2. Below the list, the `Download` button, full width, 48px, `.btn-primary-dark`.
  Text left-aligned to the gutter, so it lines up with the logo (fixes diagnosis items 2-4).
- **EN/ES stays in the bar**, always reachable, never inside the panel (it is the first thing a
  Spanish visitor on an English page needs).
- **Download** moves into the panel (open question 1): the bar cannot hold logo + EN/ES +
  Download + button at 390px, especially in Spanish ("Descargar"), without crowding. The hero
  already has "Start free trial" in the first viewport.
- **Behaviour**: tap button toggles; Esc closes and returns focus to the button; tapping a
  link closes the panel (in-page anchors on `home`; navigation on others); tapping outside the
  panel or resizing above 860px closes it and resets state. Opening does not scroll the page
  and the panel scrolls internally if taller than the viewport minus the bar (no body
  scroll lock needed because panel is short: max about 5 x 48 + 72 = 312px).
- **Focus order**: logo, EN/ES, menu button, then (when open) the links, Download. When closed
  the panel is not focusable (`hidden` / `inert`), so keyboard users never tab into invisible
  links. Hamburger is after the EN/ES pill in DOM order so visual and tab order match.
- **Without JS (progressive enhancement)**: the menu button is hidden by default and only shown
  when a script marks the nav as enhanced (e.g. a class on `html`/`nav` set by `initNav`,
  analogous to the inline theme script). Without that class the nav keeps working as today at
  every width, i.e. the current two-row layout at <= 600px, with the asymmetry fixes below.
  Disclosure state is never required to reach a link. Rejected: pure-CSS checkbox/`:target`
  hack (breaks `aria-expanded` semantics, poor SR announcement); `<details>` (no outside-click or
  Esc, awkward styling for a full-width panel).
- **No-JS fallback polish** (also applies to the 601-860 range if enhancement is absent):
  row 2 links get no horizontal padding on the first/last item so text aligns with the logo and
  button edges; drop the row's own `border-top`, keep only the nav's `border-bottom`; links
  `justify-content: space-between` stays, with the first link left-aligned and last
  right-aligned to the frame edges.
- **States**: hover/focus/active as above; open panel animates height/opacity 160ms ease-out
  (reduced motion: no animation, instant); icon morph 160ms (reduced motion: swap instantly).
  No loading/empty/error states. Light and dark both come from tokens: border and text colors
  need no overrides.
- **Responsive**: 860 -> 601: gutter 2rem, bar as above, panel links 1rem. <= 600: gutter
  1.5rem, same markup. At 390 the bar holds 111 (logo) + 39 (EN pill) + 8 + 44 (button) =
  202px of 342 available, leaving air in both languages.

### `legal` variant (`privacy-policy`, `refund-policy`)
- Stays one inline row at every width: logo left, "Pricing" and "Support" right. No hamburger,
  no EN/ES (English only today). At 390px that is about 111 + 2 links (about 150) which fits.
  This also removes the odd second row for two links.

## Copy
Add to `nav` in `src/i18n.ts` (both locales, same shape):
- en: `menu: 'Menu'`, `menuClose: 'Close menu'`
- es: `menu: 'Menú'`, `menuClose: 'Cerrar menú'`
Existing link strings unchanged. The visible control is icon-only; the strings are the
accessible name. The panel gets the accessible name from the nav landmark (the existing
`<nav>`; add `aria-label` "Main" / "Principal" if the page ever has a second nav).

## Assets
None. Icon is an inline decorative SVG or CSS lines (`aria-hidden`), 20x14px, 2px stroke,
`currentColor`.

## Kit change (design-template-kit, separate repo)
Done first in `molayab/design-template-kit`, new tag (suggested v0.4.0), then bump the pin in
this repo's `package.json`:
- `nav.css`: styles for `.nav-toggle` (button), `.nav-menu` panel, enhanced-state hooks; the
  `<= 860px` collapse; the no-JS fallback polish (alignment and single hairline).
- `responsive.css`: replace the 600px "two-row nav" block (`.nav-inner` wrap, `.nav-links`
  `order: 3`, `border-top`) with the new rules.
- A tiny reusable `initNav` can live in the kit or in `src/scripts/nav.js`; since it is
  framework-agnostic and about 30 lines, recommend `src/scripts/nav.js` here (the kit stays
  CSS-only) and document the required attribute contract in the kit README.
- Consumers: only grove-website (and molayab.com if it pins the kit: confirm before tagging, and
  bump it deliberately).

## Design-system changes
- No new color/typography/spacing tokens. (TODO) Optional kit token `--nav-height` (56px)
  if the panel offset needs it; coder may use a local calc instead.
- DONE: changelog line added to `docs/design/design-system.md` marking this plan as proposed.
- TODO (after approval, with the coder): update the "Nav" row in Components (hamburger <= 860px,
  legal inline, no-JS fallback) and the Breakpoints row (the 600px "two-row nav" note is
  replaced).

## Accessibility & performance budget
- Contrast: all pairs reuse existing tokens already audited (`--text`/`--text-2` on `--bg` >=
  4.5:1 in both themes; border/focus ring >= 3:1). The only new surface is the open panel at
  `--bg` >= 94% over page content: text contrast is computed against `--bg`, which is what
  the opaque-enough rule guarantees.
- Button: `<button>`, `aria-expanded`, `aria-controls`, visible name; hit area >= 44px, never
  below 24px. Panel links and Download >= 48px tall.
- Keyboard: Enter/Space toggle, Esc closes and restores focus to the button, Tab order as above,
  closed panel not focusable. Screen reader: state announced via `aria-expanded`; icon is
  `aria-hidden`.
- Landmarks: remains one `<nav>` in `<body>`; one `<main>`.
- No layout shift: bar height is 56px at every width (also removes today's 56 -> 95px jump on
  mobile); the panel overlays content (absolute under the sticky bar), never pushes it.
  Script is < 1KB, deferred, no new requests, no media.
- Reduced motion: no transitions.

## Acceptance criteria
- [x] 390px and 600px, EN and ES, dark and light: bar is one row, height 56px; logo left edge
      equals the section content left edge; the right edge of the button equals the section
      right edge; no horizontal scroll caused by the nav.
- [x] Same at 700px and 860px; at 861px the desktop nav is identical to today.
- [x] EN/ES pill visible and tappable (>= 36px high) with the menu closed and open.
- [x] Button has `aria-expanded` that matches the panel state and `aria-controls` that
      resolves to an existing id; Enter/Space toggle; Esc closes and returns focus.
- [x] Closed panel: links not reachable by Tab, not read by screen readers.
- [x] Choosing a link closes the menu; on `home`, anchors scroll to the section without the
      sticky bar covering the heading.
- [x] Resizing from <= 860 to > 860 with the menu open closes it and shows the desktop nav.
- [x] JS disabled: no hamburger rendered, all links and Download reachable at every width,
      row aligned with the logo/button edges, one hairline.
- [x] `legal` variant: single row at 390px, no hamburger.
- [x] `prefers-reduced-motion: reduce`: no animations.
- [x] Download link inside the panel still jumps to `#download` (and `base#download` on other
      pages); hreflang pill links to the twin page.
- [x] Kit tag released, `package.json` pin bumped, `npm run build` clean, `dist/` outputs
      unchanged (URLs same).
- [x] No hard-coded colors; both `en.ts`/`es.ts` (via `i18n.ts`) have the same keys.

## Open questions for the human
1. Download CTA: move it into the menu panel (recommended, bar stays clean) or keep it in the
   bar and drop the EN/ES pill into the panel (not recommended: language is harder to find)?
2. Breakpoint: collapse at <= 860px (recommended, existing breakpoint, fixes the tight 601-860
   Spanish case) or only at <= 600px (keeps the inline nav on tablets)?
3. `legal` pages: OK to keep an inline two-link row without a hamburger?
4. Menu icon: plain three lines (recommended) or the labelled "Menu" text next to it?
5. Does molayab.com consume the same kit version? If yes, bumping it should be a separate,
   deliberate step.

## Implementation notes

**Kit:** released as `design-template-kit` v0.4.0 (PR #3 merged, tag pushed). `package.json` now pins `.../tags/v0.4.0.tar.gz` (`package-lock.json` updated by `npm install`). Final check on the real build (installed v0.4.0, `npm run build` with no warnings, all required `dist/` files present including the `es/` guides and `sitemap.xml`): nav at 390 dark (56px bar, logo x=24, toggle right edge 366, panel opens/closes, Esc works, no horizontal scroll) and at 861 light (desktop nav unchanged, toggle hidden).

See also `package.json` and `package-lock.json` in the files changed.

Files changed here: `src/components/Nav.astro` (new markup: `.nav-actions` = EN/ES + `.nav-toggle`; `.nav-menu#nav-menu` = links + Download; legal variant is `.nav-inner--inline` with only the links), `src/scripts/nav.js` (new `initNav`), `src/layouts/Base.astro` (inline theme script also adds `nav-enhanced` to `<html>` before first paint), `src/i18n.ts` (`menu`), `docs/design/design-system.md` (Nav and Breakpoints rows).
Kit files (merged in v0.4.0): `src/nav.css`, `src/responsive.css`, `dist/core.css`, `dist/foundation.css`, `dist/tokens.css` (header version only), `CHANGELOG.md`, `package.json`.

Deviations:
- `menuClose` not added: the accessible name is a constant "Menu" / "Menú" plus `aria-expanded` (plan allowed picking one approach).
- Panel background is `--bg` at 98% (plan: >= 94%) because 96% let page text show through.
- EN/ES pill gets `min-height: 36px` at <= 860px (enhanced) to meet the plan's 36px; it was 31px.
- Download is a single element inside `.nav-menu`; above 860px `.nav-menu` is `display: contents` and `order` keeps the visual order logo, links, EN/ES, Download. DOM/tab order on desktop is therefore logo, EN/ES, links, Download (EN/ES earlier than before). Accepted to get the plan's mobile focus order without duplicating Download.
- Scrolling to anchors: sections already start with 72-96px padding, so the 56px bar does not cover headings; not changed.

Verified (preview build against the local kit, Chrome emulation): /es/ at 390, 600 (light) and 861 (dark); guide page /es/git-worktree-app-mac.html at 860 dark; privacy-policy at 390 light. Bar 56px + 1px border, logo left edge 24 = content edge, toggle right edge 366 = 390-24, no nav-caused horizontal scroll; closed panel links `visibility:hidden`; open: aria-expanded true, aria-controls resolves, Esc closes and returns focus, outside click and link click close; links 48px and Download 48px; Download href `/es/#download` on guides; legal 390: single row, no toggle; no-JS simulation (class removed) at 390: two rows aligned 24..366, no border-top; 861 desktop nav matches the previous layout. Console: only the Cloudflare beacon CORS error from the localhost origin.
Unverified: 700px and EN pages by measurement (same CSS, not separately measured), light theme at 861/860, real-touch behaviour, reduced-motion (rule present, not emulated).

Unrelated overflow (`/es/` scrollWidth 744 at 620px): not the nav. Cause is `.footer-links` (with the theme switch) that stays on one line between 601px and its natural width (~745px in Spanish) because the kit only allows `flex-wrap` at <= 600px. Suggested fix in the kit `footer.css`/`responsive.css`: `flex-wrap: wrap` on `.footer-links` at all widths. Not fixed here (footer is out of this plan's scope).

Requests for webpage-designer: none (no new tokens).

## SEO review

Gate: not needed

No changes proposed. The change has no SEO impact on the changed pages.

Checked on the built output (`npm run build`, 10 pages, all profile URLs present):
- Crawlability: every nav link (Features, Screenshots, Pricing, Blog, Download, EN/ES) is still in the static HTML. The closed panel is hidden with `visibility:hidden` and `opacity:0`, not removed or `display:none`-injected by JS. Collapsed menu links are normal practice for mobile-first indexing. Without JS the `nav-enhanced` class is not set and the nav stays inline.
- Language switcher and hreflang: the EN/ES pill keeps `hreflang`/`lang` and now sits in `.nav-actions`. `<head>` alternates (en, es, x-default) are unchanged and reciprocal on home and the guides. Legal pages have none.
- Headings and landmarks: one `<h1>` on each page checked, one `<nav>` and one `<main>`. The toggle is a `<button>` with `aria-label` "Menu"/"Menú", `aria-expanded` and `aria-controls="nav-menu"`, which resolves.
- Structured data, canonical, OG and sitemap: untouched. `sitemap.xml` lists every page once with hreflang alternates. `lastmod` was deliberately not bumped, because the nav is chrome and not page content.
- Freshness: no copy changed. `nav.menu` exists in en and es.

Not checked: Lighthouse and performance (not run). Pre-existing, out of scope and low: the Spanish nav and footer label "Blog (EN)" is deliberate. The footer overflow at 601-745px (see Implementation notes) is a layout issue, not an SEO one.

## Security review

Verdict: PASS

No blocking findings. 0 critical, 0 high, 0 medium, 1 low, 2 info.

| Severity | Location | What | Why it matters | Suggested fix |
|---|---|---|---|---|
| low | `package.json:13`, `package-lock.json:2071-2075` | `design-template-kit` non-registry dependency bumped v0.3.0 -> v0.4.0 (GitHub tag tarball). The URL points at the expected owner/repo (`molayab/design-template-kit`), at a tag rather than a branch, and the lockfile has a `sha512` integrity. `npm audit` does not cover it. | A git tag can be moved. The lockfile integrity would make `npm ci` fail if that happened, so the risk is a broken build, not silent substitution. I could not re-hash the tarball offline. | Human: confirm that tag v0.4.0 on GitHub is the intended release (kit PR #3) before publishing. No code change needed. |
| info | `src/scripts/nav.js:13-26` | When the menu opens, `onOutside` is added to `document` during the same click that opened it. The check on `toggle.contains(e.target)` stops it from closing right away. | This is not a security issue. It is a correctness note so the guard is not removed later. | None. |
| info | `node_modules/design-template-kit` (installed 0.4.0) | Kit is CSS-only: no `@import` or `url()` to external hosts, no install scripts (`scripts` are only `build` and `check`), MIT LICENSE and version header intact (`dist/core.css` v0.4.0). | Confirms that the bump adds no runtime JS, third-party requests or install-time code. | None. |

Checked:
- Scope: `git diff HEAD` (6 files), the untracked `src/scripts/nav.js` and this plan. The branch is `main` at `aee82f0`, with no unpushed commits (`main..HEAD` is empty).
- Secrets: grepped the changes and new files for token prefixes, private keys, credentials in URLs and password/secret strings. None found. `.gitignore` covers `.env`/`.env.*`, `dist/` and `node_modules/`. No `.env` file is tracked.
- PII: the only contact in the changes is `hello@molayab.com`, which is an intentional public contact and was already in the markup. No images, local paths or new identifiers were added.
- Privacy: no new external hosts, scripts, fonts, cookies or storage keys. `nav-enhanced` is a class, not stored data. The privacy policy does not need changes.
- Client JS (`nav.js`): it only uses `setAttribute`/`classList`/`focus` and reads no external or user data. There is no `innerHTML`/`eval`/HTML injection and no URLs are built. The listeners are scoped. Astro bundles the script as a module, not `is:inline`. The `Base.astro` inline addition is a static `classList.add`. The `set:html` in Base.astro is pre-existing JSON-LD from repo data and was not changed. The existing `localStorage` read is still inside try/catch.
- Links: the new links are all same-site anchors plus the existing `mailto:`. There is no `target="_blank"`, `javascript:` or `http:`.
- Workflows: not changed.
- Dependencies: `npm ls --all` is clean (no missing, extraneous or invalid packages). `npm audit --omit=dev` and `npm audit` found 0 vulnerabilities. `npm outdated` reports nothing. The lockfile diff is 8 lines, and all of them are the kit entry (root spec, version, resolved, integrity). No other package changed, and astro stays `^7.4.12`. The vendored `src/styles/pico.min.css` was not changed.

Not checked: I did not download the v0.4.0 tarball again to re-verify the lockfile integrity hash (no network beyond npm audit). gitleaks and trufflehog were not run because they are not used here, and grep was used instead.

Reviewed: 9af855e640a02d8015a679caab58f93957e53c41 on 2026-11-15
