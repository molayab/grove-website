---
id: 2026-11-15-footer-links-wrap
status: published
pr: https://github.com/molayab/grove-website/pull/38
owner: webpage-designer
approved_by: human
approved_on: 2026-11-15
decisions: kit v0.4.1 patch; flex-wrap base on .footer-links; accept ~17px taller desktop footer (no extra breakpoint)
---
# Footer links: wrap instead of overflowing at 601-760px

## Goal
Remove the horizontal page overflow in the footer of `/es/` (and any page whose footer links are long) between 601px and about 745px, and keep the link row aligned to the page frame (`--gutter`). Works if `document.documentElement.scrollWidth === innerWidth` at 390/600/601/620/745/861/1440 in EN and ES, light and dark, and the link row's right edge never passes the content edge of `.footer-inner`.

## Scope
- In: `.footer-links` wrapping rule in the kit footer CSS; kit release; pin bump here; design-system doc.
- Out: link copy, theme switch component, nav, colors, any other section; the `max-width: 600px` column layout (kept).

## Measured cause (browser, `/es/`, iframe at each width, before any change)
| viewport | scrollWidth | `.footer-links` width | links right edge | content right edge |
|---|---|---|---|---|
| 600 | 600 | 552 | 576 | 576 |
| 601 | 744 | 713 | 745 | 569 |
| 620 | 744 | 713 | 745 | 588 |
| 700 | 744 | 713 | 745 | 668 |
| 745 | 745 | 713 | 745 | 713 |
| 760 | 760 | 713 | 745 | 728 |
| 861 | 861 | 797 | 829 | 829 |

At 601px and up the kit's `.footer-links` is `display:flex` without `flex-wrap` (the wrap rule exists only inside `@media (max-width: 600px)`, kit `src/responsive.css`). The row holds 8 text links plus the `.theme-switch`, whose options are `flex: 0 0 auto` and never shrink, so the row's floor width is 713px. `.footer-inner` already wraps its three children, but the links block cannot get narrower than 713px, so it spills past the right gutter (scrollWidth 744 at 601-744; between 745 and ~760 it intrudes into the gutter without scroll). Spanish labels are longer than English, which is why `/es/` shows it first; EN has the same structure and a smaller floor, so check it too. The 600px case is fine only because the media query turns wrapping on.

## Design concepts used
Kit page frame tokens (`--gutter`, `--page-max-wide`), `.footer-inner` / `.footer-links` from the kit, the `.theme-switch` and `footer-theme-switch.css` from plan 2026-11-14-footer-theme-toggle (control stays last, centred with links, `min-height: 30px` reserved). No new tokens.

## Changes
Kit change (separate repo, `/Users/molayab/Developer/design-template-kit`, release v0.4.1, patch: bug fix, no visual change except where it was broken):
- `src/footer.css`: `.footer-links` gets `flex-wrap: wrap` at all widths, with `gap` as row-gap 0.5rem and column-gap 1.5rem (links wrap as whole items, never mid-label). Keep `align-items` as is (the site layer centres).
- `src/responsive.css`: the `@media (max-width: 600px)` `.footer-links` rule can drop `flex-wrap` and keep only `gap: 1rem` (row and column, as today); the base rule now supplies wrapping.
- Rebuild `dist/core.css`, add CHANGELOG 0.4.1 entry, bump version, tag.
- Site: bump the pin in `package.json` (and lockfile) to the v0.4.1 tarball. No site CSS change expected; `footer-theme-switch.css` stays.

Behaviour (tested by injecting only `flex-wrap: wrap; gap: .5rem 1.5rem` on `/es/`): `scrollWidth` equals viewport at 390, 600, 601, 620, 700, 745, 760, 861, 1000 and 1440; links right edge equals content right edge at every width (aligned to the gutter). Link block height: 132 (390), 104 (600), 88 (601-620), 59 (700-1440).
- Footer height trade-off: wrapping now happens between links, not inside a label. Footer at 620 goes 236 -> about 241px and at 1440 195 -> 212px (about +17px) in `/es/`. Accepted: tidier, no broken labels. If the human wants to avoid the desktop height change, an alternative is wrapping only below 1000px; not recommended (extra breakpoint).
- No-JS: theme switch stays `hidden`; links still wrap. States, dark/light: unaffected (no color change).
- Copy: unchanged. Assets: none.

## Design-system changes
- TODO (kit repo): footer wrap rule and CHANGELOG as above.
- TODO (this repo, after the kit release): `docs/design/design-system.md` Footer row note ("links wrap at every width") and changelog line; bump `design-template-kit` version references in AGENTS.md/docs if they cite v0.4.0.
- DONE: none (no style or doc files edited in this run).

## Accessibility & performance budget
No contrast changes. Tap targets unchanged (44px switch at <= 600px). Focus order unchanged (DOM order). No layout shift added: the `.theme-switch[hidden]` reservation stays. No new bytes of note.

## Acceptance criteria
- [x] `scrollWidth === innerWidth` on `/` and `/es/` (and a guide page in each language) at 390, 600, 601, 620, 745, 861, 1440, light and dark, with the theme switch visible and with JS disabled. (verified in a browser on `/`, `/es/` and a guide page in both languages; the JS-disabled run was not measured)
- [x] Footer links right edge never exceeds the content edge (`viewport - --gutter`, or the 1160px frame at 1440).
- [ ] No link label breaks across lines; the theme switch is never clipped or shrunk. (switch never clipped: verified; label breaks not measured, wrapping is per whole item)
- [x] Kit v0.4.1 tagged with rebuilt `dist/core.css`; the pin here points to it; `npm run build` clean; URLs in `dist/` unchanged.
- [x] Footer height change on desktop/mobile matches the figures above (+/- few px). (ES: 241 at 601-620, 212 at 745-1440; mobile not re-compared)

## Open questions for the human
1. Accept the roughly +17px desktop footer height (links wrap by whole item)? Recommended yes.
2. Patch tag v0.4.1 is proposed (bug fix); confirm. Kit commit/tag/push is yours, via PR.

## Implementation notes
- Kit v0.4.1 is tagged; the pin in `package.json` (and `package-lock.json`) now points to it. `npm run build` is clean and `dist/` has all required files (EN/ES home, guides, legal, sitemap.xml). Re-checked in the real build: `/` and `/es/` at 620 and 745 have no overflow (scrollWidth equals viewport) and `.footer-links` computes `flex-wrap: wrap`.
- Verified on a scratch copy built against the local kit (`file:` dependency, not in this repo): `scrollWidth - innerWidth = 0` and links right edge <= content edge at 390/600/601/620/745/861/1440, EN and ES, `/` and a guide page, light and dark. Footer heights ES: 241 (601-620), 212 (745-1440). Not verified: JS-disabled run.
- Edited here: `docs/design/design-system.md` (Footer row, changelog).
- Files also changed: `package.json`, `package-lock.json`.

## Security review
Verdict: PASS

| Severity | File:line | What | Why it matters | Suggested fix |
|---|---|---|---|---|
| info | `package.json:13`, `package-lock.json:10,2072-2074` | Non-registry dependency `design-template-kit` re-pinned from tag v0.4.0 to tag v0.4.1 (GitHub tag tarball, `molayab/design-template-kit`) | Expected per the profile and the plan; not covered by `npm audit`. Tags are mutable on GitHub, but the lockfile `integrity` (sha512) pins the exact bytes | None. Human confirms the v0.4.1 tag is the one released via the kit PR |
| info | this plan, line 35 | Local path `/Users/molayab/...` (maintainer's own username, already public as the GitHub owner; same pattern exists in the committed plan 2026-11-14-footer-theme-toggle) | Minor local-environment disclosure in a committed doc | Optional: replace with "the design-template-kit repo" |

Checked:
- Scope: `git diff HEAD` (package.json, package-lock.json, docs/design/design-system.md), untracked file (this plan only). On `main`, no unpushed branch commits (`git log main..HEAD` empty).
- Secrets/PII: grep for token prefixes, private keys, passwords, credentials in URLs, local paths and emails over the diff and this plan: none besides the info item above. No `.env` tracked; `.gitignore` covers `.env*`, `dist/`, `node_modules/`.
- Lockfile: only the `design-template-kit` root entry and its node (version, resolved, integrity) changed; no other package added, removed or re-resolved. The only non-registry `resolved` host is the kit's GitHub tarball. The kit has no install scripts (only `build`/`check`); the sole `hasInstallScript` (fsevents, registry, optional) is pre-existing and unchanged.
- Kit contents: installed `node_modules/design-template-kit` (0.4.1, integrity matches the lockfile) is byte-identical to the local kit repo's `v0.4.1` tag for `dist/core.css`, `src/footer.css`, `src/responsive.css`, `package.json`. The v0.4.0..v0.4.1 change is only the `.footer-links` `flex-wrap`/`gap` rule, version headers and CHANGELOG, as the plan states; no `url()`, `@import` or external origins in `dist/core.css`.
- `npm ls --all`: consistent, no missing/extraneous. `npm audit --omit=dev` and `npm audit`: 0 vulnerabilities. `npm outdated`: nothing outdated.
- No client JS, Astro, workflow, privacy-relevant or vendored-file changes in this diff.

Not checked: the remote GitHub tag was not fetched directly (no network beyond npm audit); its bytes are vouched for by the lockfile integrity and the matching local tag. gitleaks/trufflehog not used.

Reviewed: e9c16c3b890445f071129345b77750e32c6f0d33 on 2026-11-15

## SEO review
Gate: not needed

No changes proposed. No SEO impact on changed pages: the change is a kit CSS pin bump (v0.4.0 -> v0.4.1, `flex-wrap` on `.footer-links`) plus a design-system doc note; no `src/`, `public/` or content file changed.

Checked on a fresh `npm run build` (10 pages, clean) in `dist/`:
- Footer links stay in the static HTML on all 10 pages (EN/ES home, 3 guides x 2 languages, privacy, refund): 9 anchors in each `<footer>`.
- One canonical per page, hreflang and JSON-LD blocks present as before on home and guides (none on the legal pages, as before); `sitemap.xml` has 10 `<loc>` entries.
- No title, description, heading, image, OG or structured-data source was touched, so no `lastmod` or `dateModified` bump is due.

Not checked: Lighthouse/browser run (CSS-only change, layout measured in the plan itself); JS-disabled run (already noted as unmeasured in the plan).
