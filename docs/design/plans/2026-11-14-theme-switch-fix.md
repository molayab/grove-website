---
id: 2026-11-14-theme-switch-fix
status: implemented
kit_pr: https://github.com/molayab/design-template-kit/pull/2
approved_by: human
approved_on: 2026-11-14
owner: webpage-designer
---
# Fix the footer theme control (class collision) and move it to a kit `.theme-switch`

## Goal
The footer System / Light / Dark control renders broken. Make it look as approved in plan
2026-11-14-footer-theme-toggle (three-segment pill, 44px targets on mobile, accent-tint active
state) and make sure it cannot be broken again by the kit's own `.theme-toggle`. Works if: in a
real browser, in both themes at 1440 and mobile, the pill shows three fully visible icons, one
active, aligned with the footer links.

## Root cause (confirmed, with evidence)
The orchestrator's hypothesis is correct, with one extra detail.
- The kit (v0.2.0, `src/theme-toggle.css`, included in the built CSS) defines `.theme-toggle` as
  a single 34px square button: `width/height: var(--theme-toggle-size, 34px)`, `display:flex`,
  radius 8px, plus `:hover`/`:focus-visible` rules. The site reuses the same class name for the
  pill container (`Footer.astro`, `src/styles/site/theme-toggle.css`). The site rule sets only
  `display:inline-flex`, border, radius and overflow, so the kit's width/height still apply and
  the cascade is not an override. The built CSS confirms both rule sets are emitted for the same
  selector, kit first.
- Extra detail: the three buttons are flex children of a 34px box with default `flex-shrink: 1`,
  so they shrink from 32px to 18px wide, with the pill `overflow:hidden` clipping them.
- Measured in headless Chrome against `dist/` (privacy page, JS enabled): container 34x34 at
  both 1440 and 390 widths; buttons 18x32 (desktop) and 18x44 (mobile) instead of 32x32 / 44x44;
  footer link height 21px. Display is `flex` (kit) not `inline-flex`.
- The control was never opened in a browser before (plan 2026-11-14-footer-theme-toggle,
  acceptance item "Browser check" left unchecked).

Screenshots (footer only, main hidden for a short page; dark and light forced via
`data-theme`):
- scratchpad/foot-dark-1440.png
- scratchpad/foot-light-1440.png
- scratchpad/foot-dark-390.png
- scratchpad/foot-light-390.png

Caveat: headless Chrome has a minimum window width (about 500px), so the "390" captures show
a 500px layout cropped to 390px (links look cut at the right edge); the control defect is
visible and the 34x34 size was measured, but the mobile wrapping must be re-checked at a real
390px viewport after the fix. Also seen at 1440: the pill sits at the far right of the link row,
about 13px taller than the links (34px vs 21px), so the footer row grows slightly.

## Scope
- In: the footer control's class, CSS, sizing and visual states; a new kit component; the
  design-system doc.
- Out: behaviour, JS, storage, labels, i18n, privacy wording (all approved and unchanged);
  the nav; the kit's `.theme-toggle` and `.theme-toggle--floating` (left untouched, they are for
  molayab.com's single button).

## Design concepts used
Semantic tokens only (`--text`, `--text-2`, `--border`, `--border-strong`, `--accent`,
`--accent-dim`), 2px accent focus ring, existing footer link row. No new brand tokens.

## Decision: own class, and where the CSS lives
1. **Never reuse `.theme-toggle` for the group.** The class name belongs to the kit's single
   button; any reuse inherits its size, hover and focus rules. The group becomes
   **`.theme-switch`**, its buttons **`.theme-switch__option`** (BEM, so Pico's `button` rules and
   any future kit class cannot collide, and the selectors no longer depend on element names).
2. **Put the component in the kit** as `src/theme-switch.css` (new "Kit change" below). It is
   reusable and brand-neutral, uses semantic tokens only, and molayab.com will use it. Its
   behaviour (storage key, `data-theme`) stays in each site, as the kit has no JS.
3. **Sequencing.** The kit release needs a tag and a lockfile bump, so to fix the live site
   without waiting, the coder first renames the site to `.theme-switch` /
   `.theme-switch__option` and keeps the same CSS in `src/styles/site/theme-switch.css`
   (renamed from `theme-toggle.css`). When kit v0.3.0 is tagged, the site bumps it and deletes
   that file; no markup change is needed because the names are identical. If the human prefers a
   single step, skip the interim and do the kit release first.

## Changes
- **Where**: `Footer.astro` markup (class names only), `src/styles/site/` (interim file),
  `src/scripts/theme-toggle.js` (selectors: it must keep using `data-theme-toggle` /
  `data-theme-choice` data attributes; if it selects by class `.theme-toggle`, change to the
  data attribute).
- **What (component spec, identical in site interim and kit):**
  - `.theme-switch`: `display:inline-flex`, `flex-shrink:0`, 1px `--border` border, radius full,
    `overflow:hidden`, no explicit width/height (size comes from the options). `[hidden]` keeps
    it hidden.
  - `.theme-switch__option`: `flex: 0 0 auto` (must not shrink), square, size from
    `--theme-switch-size`, default **28px on desktop** (WCAG 2.5.8 needs 24px; 28 keeps the
    pill, 30px incl. border, close to the 21px link row; 32px made the footer row 13px taller).
    44px at `max-width: 600px` or `pointer: coarse` (unchanged from the approved plan). Margin
    and padding 0, transparent border, radius full, `currentColor` icons, `--text-2` colour,
    hover `--text`. Resets that defeat Pico's `button` styles (background, box-shadow, margin,
    width:auto) are included, with `.theme-switch .theme-switch__option` specificity.
  - Active (`aria-pressed="true"`): `--accent-dim` fill, `--text` icon, stroke-width 2.25, 1px
    outline. The outline is raised from `--border-strong` (about 2:1 against the page) to
    `color-mix(in srgb, var(--text) 50%, transparent)` so the shape cue meets 3:1 (state is also
    colour and stroke, and exposed by aria). Exposed as `--theme-switch-active-border`.
  - Focus-visible: 2px `--accent`, offset -2px (inside the pill). Reduced motion: no transition.
  - Icons 16px (keep), centred; the three options are visually equal width.
- **Footer fit**: the group stays the last item of `.footer-links`, vertically centred
  (`align-items:center`, already set). At desktop the row height is set by the 30px pill, not
  the 21px links; accepted. At <= 600px the links wrap and the group takes its own line, left
  aligned with the links (kit `responsive.css` already wraps `.footer-links`), 3 x 44px =
  132px + 2px border. Left edge of the pill must align with the first link's text edge.
- **Copy**: unchanged (EN/ES labels exist). **Assets**: unchanged (inline SVGs).

## Kit change (design-template-kit, new tag v0.3.0, minor)
- Repo: github.com/molayab/design-template-kit. Add `src/theme-switch.css`, import it from
  `src/index.css`, README section (markup contract: `role="group"` + labelled, native buttons
  with `aria-pressed`, hidden until JS), CHANGELOG 0.3.0 entry ("new opt-in component,
  backward compatible; `.theme-toggle` unchanged and still a single 34px button"). Custom
  properties: `--theme-switch-size` (28px), `--theme-switch-size-touch` (44px),
  `--theme-switch-active-border`. Document that `.theme-toggle` must not be used for groups.
- Consumers to bump: `grove-website` (this site; `package.json` tag and lockfile), and
  molayab.com when it adopts the control. No visual change for sites that do not use the class.
- Order: kit repo first, tag, then the site bump.

## Design-system changes
- DONE: `docs/design/design-system.md` Footer row (class names, 28px, active outline) and changelog line.
- DONE: kit changes above (on kit branch `theme-switch`, uncommitted).
- Contrast (computed from tokens, approximate): active icon `--text` on the `--accent-dim`
  tint is about 16:1 dark (#EEE on ~#1C060C) and about 16:1 light (#000 on ~#EAE2E3);
  inactive `--text-2` about 8:1 dark and about 5.8:1 light, both above 4.5:1; focus ring
  `--accent` against surfaces >= 3:1 as before (the ring is also outside the pill border in
  desktop view only where not clipped; it is drawn inside). Re-verify numerically in browser.

## Accessibility & performance budget
Targets 28px desktop, 44px at <= 600px or coarse pointer; group label and fixed button names
kept; active state not by colour alone; focus ring visible in both themes; no layout shift
(the group is `hidden` until JS, so it adds one footer row-height change on load; avoid it by
reserving the height with `min-height` on the footer link row or by not hiding via `display`
if the human accepts a no-JS inert control. Preferred: keep `hidden`, reserve height).

## Acceptance criteria
- [ ] No element in the footer uses the class `.theme-toggle`; the group is `.theme-switch`
      with `.theme-switch__option` buttons; built CSS has no rule shared with the kit's
      `.theme-toggle`.
- [ ] Measured in Chrome: dark and light, 1440 and real 390px: the pill is
      about 3 x 28 (+2) px wide and 30px tall on desktop (3 x 44 +2 by 46 at 390); each button
      is not shrunk; all three icons fully visible; no clipping.
- [ ] Exactly one active segment with accent tint, stronger outline and heavier stroke;
      active outline contrast >= 3:1 against the page in both themes; icon text contrast >= 4.5:1.
- [ ] Pill is vertically centred with the links; at <= 600px it wraps onto its own line, left
      aligned with the link text, tap targets 44px.
- [ ] Keyboard: Tab reaches the three buttons, Enter/Space toggles, focus ring visible in both
      themes; reduced motion has no transition.
- [ ] Behaviour unchanged (persistence, System removes the key, no flash, no JS = hidden).
- [ ] Kit v0.3.0 tagged with CHANGELOG/README; site bumped; interim site CSS deleted; build
      clean, 10 pages, URLs unchanged.
- [ ] Screenshots of the footer in both themes at 1440 and 390 attached to the PR.

## Open questions for the human
1. Kit now or later: do the interim site rename first (fast) and the kit release after, or
   go straight to the kit (recommended order above is interim first)?
2. Desktop size: 28px segments (my proposal, smaller footprint) vs the 32px approved earlier?
3. Active outline stronger than before (about 50% text mix instead of `--border-strong`) to
   reach 3:1; OK, or prefer a solid fill for the active segment?
4. Should the control also exist in the nav on mobile later? (Not in this plan.)

## Human decisions (gate 1, 2026-11-14)

1. **Order: straight to the kit.** No provisional site CSS. design-template-kit v0.3.0 ships
   `.theme-switch` first (PR, merge, tag), then grove-website bumps its pin and switches its
   markup. The footer stays as it is until then.
2. **Size:** 28px segments on desktop; 44px at <=600px or on coarse pointers.
3. **Active state:** keep the accent tint, raise the active outline to text at 50% (>=3:1),
   thicker icon stroke. No solid fill.
4. Question 4 (control in the mobile nav) is out of scope for this plan.

## Implementation notes

Implemented per the human decisions (straight to the kit, no provisional site CSS).

**Kit** (../design-template-kit, branch `theme-switch`, not committed): added
`src/theme-switch.css` (imported from `src/index.css`), version 0.3.0 in `package.json`, README
"Theme switch" section (markup contract, custom properties), CHANGELOG 0.3.0, regenerated `dist/`.
`.theme-toggle` / `.theme-toggle--floating` untouched.

**Site** (not committed): `Footer.astro` markup now `.theme-switch` + `.theme-switch__option`;
`src/scripts/theme-toggle.js` needed no change (already uses `data-theme-toggle` / `data-theme-choice`);
`src/styles/site/theme-toggle.css` replaced by `src/styles/site/footer-theme-switch.css` (only
`.footer-links { align-items:center; min-height:30px }`: centring and height reservation) and its
import updated; `docs/design/design-system.md` updated.

**Deviation / finding:** Pico styles `[role="group"]` (`width:100%`, inline-flex), which stretched the
group to 978px (452px mobile) once the `.theme-toggle` collision was gone. The kit component now
sets `width:auto; margin:0; box-shadow:none` on `.theme-switch` (kit loads after Pico in the site cascade).

**Pending:** the site's `package.json` / `package-lock.json` still pin kit v0.2.0 (tag v0.3.0 does not
exist yet; untouched on request). After the kit PR is merged and v0.3.0 tagged, bump the pin and lockfile.
Until then a clean `npm ci` build of the site shows the old broken control. Verified locally with
`npm install --no-save ../design-template-kit`; node_modules restored with `npm ci` afterwards.

**Verification** (Chrome headless, dist served locally, data-theme forced, each state clicked):
- Desktop 1440: group 84x30, three buttons 28x28, no horizontal scroll, all states, both themes.
- Mobile layout at 500px (Chrome headless cannot go below about 500px, so a real 390px was NOT
  checked): group 132x46, buttons 44x44, left edge x=24 equals the first link's left edge, wraps on its own line.
- Exactly one `aria-pressed="true"` per state; build clean, 10 pages, URLs unchanged; built site CSS
  has no `.theme-toggle` rule applying to the group (kit's `.theme-toggle*` rules remain, for its own use).
- Screenshots: scratchpad/fix-{dark,light}-{1440,500}-{system,light,dark}.png
- Not verified: keyboard focus ring and hover in a browser (CSS only), numeric contrast of the active outline
  (computed from tokens in the plan, not measured), reduced motion, behaviour without JS.

Acceptance: items 1-3 and 4 (at 500px) met; keyboard, behaviour-unchanged (code untouched), kit tag/site bump
(pending) and PR screenshots left for the publisher.

### Mobile height reservation

Added after the SEO audit observation and the human decision to reserve the height on mobile too.
`src/styles/site/footer-theme-switch.css` now has, for `(max-width: 600px), (pointer: coarse)`,
`.footer-links .theme-switch[hidden] { display: inline-flex !important; visibility: hidden; }`.
The hidden group keeps its real size (the kit's `--theme-switch-size-touch`, 44px + 2px border, so
no magic number) and wrap position, but is invisible and out of the tab and accessibility trees,
so JS un-hiding it does not change the footer height. `!important` is needed because Pico ships
`[hidden]{display:none!important}`. Without JS the footer keeps one empty ~46px line on mobile
(accepted). Desktop keeps `min-height:30px`. Kit and package files untouched.

Measured in Chrome headless (footer height with the group `hidden` vs shown, built with the local kit):
- 1440, dark and light: 139.8px / 139.8px (delta 0).
- 500, dark and light: 264.6px / 264.6px (delta 0). Before the fix: 202.6px / 264.6px (delta 62px:
  the 46px group plus its row gap). A real 390px was not checked (headless minimum is about 500px).
- No horizontal scroll in any case. Screenshots `fix2-{dark,light}-{1440,500}.png` attached to the PR.

### Kit pin bumped to v0.3.0

The "Pending" item above is done. Kit PR #2 was squash-merged as 24e4980 (same tree as the reviewed
branch commit 5192f04) and tagged `v0.3.0` (annotated tag on 24e4980). The site's `package.json` and
`package-lock.json` now pin `https://github.com/molayab/design-template-kit/archive/refs/tags/v0.3.0.tar.gz`
(new `integrity`); `npm install` and `npm run build` pass. Approved by the human at gate 2.

## Security review

Verdict: PASS (re-review 2026-11-14 after the mobile height reservation and the kit pin bump)

No secrets, no PII beyond the profile's intentional contacts, no exploitable code, no advisories.
The only non-registry dependency is the expected kit tag tarball, now at v0.3.0 and verified
against the tagged commit. No open warnings.

| Severity | Where | What | Why it matters | Suggested fix |
|---|---|---|---|---|
| closed (was medium) | grove-website `package.json:13`, `package-lock.json` (root deps and `node_modules/design-template-kit`) | Kit pin bumped v0.2.0 to v0.3.0. Lockfile diff touches only design-template-kit: version, `resolved` (same host `github.com/molayab/design-template-kit`, tag v0.3.0) and `integrity`. The cached tarball matching that `integrity` extracts to a tree identical to `git archive 24e4980` (offline diff, no differences). 24e4980 has the same tree (bff6b52) as reviewed commit 5192f04, and its src/dist/themes/package.json are identical to the tree reviewed in the first pass. Tag `v0.3.0` (object 05e8f1b) points to 24e4980. Installed kit is 0.3.0. | Ships exactly the reviewed kit code. | None. |
| closed (was low) | this plan | Absolute local paths removed (0 matches for local home, temp or scratchpad paths). | | None. |
| info | grove-website `package-lock.json` (`node_modules/fsevents`) | The npm install-scripts notice comes from `fsevents` (registry, optional, macOS-only, already in the lockfile before this change): it is the only `hasInstallScript: true` entry. The kit has no install scripts. | Pre-existing, not introduced by this plan. | None. |
| info | grove-website `src/styles/site/footer-theme-switch.css:10-12` | Mobile/coarse-pointer rule keeps the `hidden` group in layout with `visibility: hidden`. Nothing in Pico, the kit or the site sets `visibility: visible` on descendants, so the buttons inherit hidden: not focusable, not in the accessibility tree, not clickable. The rule stops matching once JS removes `hidden`. Pure CSS: no new hosts, scripts or storage. | No hidden-but-operable control. | None. Without JS the group stays invisible (accepted by the human). |
| info | design-template-kit `dist/` | Rebuilt from `src/` in a temporary copy with the repo's own `scripts/build.mjs`: `core.css`, `foundation.css`, `tokens.css` byte-identical to the working tree. | Confirms `dist/` matches `src/` (CI `npm run check` should also pass). | None. |
| info | design-template-kit `package.json` | Version 0.3.0; `files` = dist, src, themes, LICENSE (`npm pack --dry-run` lists only those plus README/package.json, including the new `src/theme-switch.css`); `exports` unchanged; only `build`/`check` scripts, no `preinstall`/`install`/`postinstall`/`prepare`. | Safe to consume as a tarball dependency. | None. |

Checked:
- grove-website: `git status`, `git diff HEAD` (Footer.astro, site/index.css, theme-toggle.css to
  footer-theme-switch.css rename, design-system.md), untracked files (this plan only); no commits
  ahead of `origin/main`. Footer.astro and the new CSS read in full; `src/scripts/theme-toggle.js`
  unchanged (data-attribute selectors, localStorage in try/catch, key `grove-theme`, no PII).
  No `innerHTML`/`eval`, no new external hosts, scripts, fonts or embeds; no `target="_blank"`;
  no privacy-policy impact (storage and hosts unchanged).
- design-template-kit (branch `theme-switch` at `origin/main` 5b9ecf2, uncommitted): CHANGELOG,
  README, package.json, `src/index.css`, new `src/theme-switch.css` (CSS only, tokens only),
  `dist/` regenerated and compared; `.gitignore` covers `.env*`, `node_modules/`; CI workflow
  unchanged (`contents: read`).
- Secrets grep (token prefixes, private keys, credentials in URLs, passwords) on all changed and
  untracked files in both repos: none found.
- `npm ls --all` clean; `npm audit --omit=dev` and `npm audit`: 0 vulnerabilities; `npm outdated`:
  nothing reported (first pass and re-review). After the bump the installed kit is 0.3.0, matching the lockfile.
- Re-review: site diff again in full (new mobile rule, `package.json`, `package-lock.json`), secrets
  and local-path grep on the plan and changed files (none), cached tarball against `git archive`,
  tag/commit/tree identities in the local kit clone, plus a read-only `git ls-remote` that confirmed
  the remote tag `v0.3.0` resolves to 24e4980.

Not checked: gitleaks/trufflehog (not run); the site build (reported passing by the coordinator,
not re-run here); a live download of the tarball (compared the npm cache copy, whose sha512 matches
the lockfile `integrity`).

Fingerprints (change once anything is committed or edited; the publisher must recompute):
- Reviewed (grove-website): a5d93ecae214c9ace539efac9396e9506c9d331b on 2026-11-14 (re-review; supersedes 39bc9670e88b89b8f1a59d316bb007da7ac5bd32)
- Reviewed (design-template-kit): 3fccacac6e1f83e4c9f17b0d65d4854bd57d7bcb on 2026-11-14
  (same command plus `git log origin/main..HEAD --format=%H` inside the parentheses; no commits
  ahead at review time). The kit has since been merged and tagged; what the site ships is pinned
  by the v0.3.0 tarball `integrity` in the lockfile, verified above against tag v0.3.0 / 24e4980.

## SEO review

Gate: not needed

No changes proposed. No SEO impact on changed pages (footer control only; no copy, URL, meta or schema change).

Built with `npm install --no-save ../design-template-kit && npm run build` (kit v0.3.0 local), inspected `dist/`, then restored node_modules with `npm ci`.

Checked, all OK:
- 10 pages built; every URL in the profile exists in `dist/` (incl. `es/` copies, `sitemap.xml`, `robots.txt` allows all and points to the sitemap). URLs unchanged.
- Sitemap: 10 entries, absolute canonical-host URLs, hreflang pairs with x-default unchanged. `lastmod` needs no bump: the footer is shared chrome, not page content (home/es already 2026-11-14, guides and legal 2026-11-04 as before).
- Sampled en and es pages (home, privacy, refund, guide, es guide): exactly one `<h1>`, one `<main>`, one `<nav>`, one `<footer>`, one canonical; no element still uses `class="theme-toggle"`.
- Accessible names: group `aria-label` "Theme" / "Tema"; buttons "System/Light/Dark" and "Sistema/Claro/Oscuro" via `aria-label`, `aria-pressed` set (system pressed by default). The group stays `hidden` until JS, so crawlers and no-JS users do not see an inert control.
- Built CSS: `.theme-switch` rules emitted; none shared with the kit's `.theme-toggle`.
- Freshness: nothing on the pages in scope changed; versions, prices, download data, copyright year untouched. Translations: i18n theme strings are the same 4 items in the same order in en and es.

Observation (not proposed, low): on mobile (<= 600px) the group wraps onto its own 46px line, and it is `hidden` until JS runs, so the footer grows by about 46px on load. The footer is far below the fold, so it does not affect LCP/CLS in the viewport on normal loads; the `min-height:30px` reservation only covers the desktop single-row case. Fix only if the human wants it (reserve a ~46px line at <= 600px).

Not checked: Lighthouse and a real 390px viewport (browser tools not run; the plan itself notes headless Chrome cannot go below ~500px); Core Web Vitals field data. Pending outside this review: the site's pin is still kit v0.2.0, so a clean `npm ci` build shows the old broken control until v0.3.0 is tagged and the pin bumped.
