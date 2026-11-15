---
id: 2026-11-14-footer-theme-toggle
status: implemented
approved_by: human
approved_on: 2026-11-14
owner: webpage-designer
---
# Footer theme control (System / Light / Dark)

## Goal
Let visitors choose System, Light or Dark from the footer. Today the theme only follows the
OS. Works if: the control is on every page, the choice persists across pages and visits, there
is no flash of the wrong theme, and it is usable by keyboard, touch and screen reader. This
plan revises an existing uncommitted two-state implementation into a three-state control.

## Scope
- In: footer control (markup, style, behaviour), EN/ES labels, interaction with the head theme
  script, privacy-policy wording, design-system doc.
- Out: nav control, palette/token changes, any layout change other than the footer control.

## Design concepts used
Semantic tokens only (`--text`, `--text-2`, `--text-3`, `--border`, `--border-strong`,
`--accent`, `--accent-dim`), the 2px accent focus ring, the footer link row, `data-theme` as
the single switch (also drives Pico). No new tokens.

## Changes
Where: `Footer.astro` (inside `.footer-links`, last item), `src/styles/site/theme-toggle.css`,
`src/scripts/theme-toggle.js`, theme script in `Base.astro`, `src/i18n.ts`, privacy policy.

### The control (replaces the single round button)
- **Pattern:** a segmented control of three icon buttons in one pill (1px `--border`, radius
  full): System (monitor icon), Light (sun), Dark (moon). Always in that order. The group is a
  `role="group"` labelled "Theme" / "Tema". Not a cycling button: a cycle hides the System state
  and needs a click-through to reach it; three visible choices are clearer.
- **Semantics:** each segment is a native `<button type="button">` with `aria-pressed="true|false"`
  (exactly one true) and a fixed accessible name that names the option, not the action:
  EN "System", "Light", "Dark"; ES "Sistema", "Claro", "Oscuro". `title` equals the name. Fixed
  names + `aria-pressed` is the correct pairing (the name never changes, state is in
  `aria-pressed`). Do not use `role="radio"`/arrow-key roving: plain buttons keep Tab/Enter/Space
  behaviour simple. Group label: EN "Theme", ES "Tema". Icons are `aria-hidden`, `currentColor`.
- **Visual states:** pressed segment: `--accent-dim` background and `--text` icon (>= 5.9:1 on
  both themes' surfaces; the tint is only a state hint, the pressed state is also exposed by
  aria and by a filled vs. outline look, so it is not conveyed by colour alone: pressed icon
  gets stroke-width 2.25 and the segment a 1px `--border-strong` outline). Unpressed: `--text-2`
  icon; hover `--text`. Focus-visible: 2px `--accent` ring, offset 2px (offset -2px inside the
  pill so it is not clipped). No-JS: whole group `hidden`, JS unhides it.
- **Size:** each segment 32x32 on desktop (>= 24 per WCAG 2.5.8), 44x44 on mobile (below).
- **Icon vs. state:** icons show the option itself (not the action), since all three are visible;
  the pressed segment shows the current state. This replaces the old "icon shows target mode".

### Persistence and interaction with the head script
- Storage key `grove-theme` holds `light` or `dark` only. **System = key absent.** Choosing
  System removes the key (in try/catch) and applies the OS theme immediately.
- Head script: read the key in try/catch; accept only `light`/`dark` (anything else = System);
  apply `data-theme`. Always register the OS `change` listener (not only when nothing is saved);
  the handler re-reads storage at event time and applies the OS value only when the key is
  absent. This fixes the "listener overrides a manual choice in the same session" bug and makes
  switching back to System live without reload.
- `theme-toggle.js`: on init, set `aria-pressed` from storage (absent/invalid = System). On click,
  update storage, `data-theme` (for System, resolve via `matchMedia`), and `aria-pressed` on all
  three. Optional: `storage` event so other tabs follow.
- No-saved-value initial state: System pressed.

### Mobile and footer height
- <= 600px: the footer row already wraps (gap 1rem). The group goes on its own wrapped line
  if it does not fit; at 390px three 44px segments = 132px plus padding fit beside nothing
  else, so expect it to wrap to its own line.
- **Tap target 44px applies only at <= 600px (and `pointer: coarse`)**; desktop stays 32px, so
  the desktop footer height is unchanged (text links 13px, row centred with
  `align-items: center`). Impact on mobile: the control row is 44px tall instead of 32px
  (+12px) on that line; roughly +12px total footer height on mobile, none on desktop. At
  861px+ the group sits at the end of the link row.
- Desktop/mobile gap between segments: 0 (they share the pill, separated by the pill border).
- Reduced motion: no transition on state change.

Copy (i18n shape: `footer.theme = { label, system, light, dark }` per language):
- en: label "Theme"; "System", "Light", "Dark"
- es: label "Tema"; "Sistema", "Claro", "Oscuro"

Assets: three inline SVGs (monitor, sun, moon), decorative.

### Privacy policy (approved wording, English only)
Add to section 5 ("Your cookie choice"): "Your light/dark mode choice, if you use the footer
toggle, is also saved in your browser's local storage; it is not sent anywhere." Also check
section 3: the Cloudflare sentence ("doesn't ... use local storage") is about Cloudflare and
stays true; only add the same sentence there if the coder finds a site-wide "no local storage"
claim. Accuracy note: with the System state the key is deleted, so the sentence is true but
slightly broad (a stored value exists only for Light or Dark; "toggle" is now a three-way
control). I did not change the human-approved wording; it remains accurate. Legal copy still
needs the human's own review.

## Design-system changes
- DONE: `docs/design/design-system.md` Footer row (three-state theme control) and changelog.
- TODO: none for tokens. Optional later: promote the segmented control to the kit.

## Accessibility & performance budget
- Targets 32px desktop, 44px at <= 600px / coarse pointer; pressed state not by colour alone;
  group label; focus ring visible in both themes; native buttons; no layout shift (icons fixed
  size); no requests; JS < 1.5 KB.

## Acceptance criteria
- [x] Control is the last item in the footer row on every page, EN and ES, centred with links.
- [x] Three buttons with fixed names and exactly one `aria-pressed="true"`; group labelled.
- [x] No saved value: System pressed and the page follows the OS, including live OS changes.
- [x] Light/Dark: applies instantly, persists across reloads/pages, no flash; OS change in the
      same session does not alter it.
- [x] Choosing System removes `grove-theme` and applies the OS theme immediately.
- [x] Invalid stored value is treated as System; blocked storage does not throw anywhere.
- [x] Targets 32px desktop, 44px at 390px; footer wraps cleanly at 860/600/390; mobile footer
      is about 12px taller, desktop unchanged.
- [x] Hidden without JS; focus ring visible in both themes; reduced motion respected.
- [x] Privacy policy sentence added; build clean; URLs unchanged; AGENTS.md and
      docs/architecture.md updated to say three states.
- [ ] Browser check light/dark at 1440 and 390: NOT DONE (see notes).

## Open questions for the human
1. Pressed-state look (accent tint + stronger outline) is a proposal; fine, or prefer a solid fill?
2. Privacy sentence: keep as approved even though System stores nothing? (Recommended: yes.)

## Revision
Gate 1: replaced the two-state button with System/Light/Dark segmented control; 44px targets on
mobile only; privacy sentence added; kept the listener fix, try/catch, i18n and CSS-location
decisions (CSS stays in `src/styles/site/`). Supersedes the earlier labels "Switch to
light/dark mode".

## Implementation notes
Files changed: `src/layouts/Base.astro` (head script: try/catch, only light/dark accepted, OS listener always registered and re-reads storage), `src/i18n.ts` (`footer.theme = {label, system, light, dark}` en/es), `src/components/Footer.astro` (hidden `role="group"` with three `aria-pressed` buttons + SVGs), `src/scripts/theme-toggle.js` (rewritten for three states, storage event), `src/styles/site/theme-toggle.css` (pill, 32px / 44px at <=600px or coarse pointer, tokens only, -2px focus offset, `align-items:center` on `.footer-links`, no transition under reduced motion), `src/styles/site/index.css` (import), `src/pages/privacy-policy.astro` (sentence added in section 5 verbatim; section 3 left unchanged, it only concerns Cloudflare and there is no site-wide "no local storage" claim), `AGENTS.md`, `docs/architecture.md`.

Pico: the button rule in the CSS explicitly resets margin, padding, background, box-shadow, border and radius, with higher specificity (`.theme-toggle button`) than Pico's `button`; verified by reading CSS only.

Deviations: none. Buttons carry fixed `aria-label` plus `title`. Pill uses `overflow:hidden` so the pressed segment's rounded outline stays inside the pill.

Unverified: browser check (light/dark at 1440 and 390, focus ring, footer heights, Pico override in practice). chrome-devtools reported "browser already running" and claude-in-chrome timed out. Build is clean (10 pages, URLs unchanged; control present in en and es HTML, privacy sentence present in the build). JS size well under 1.5 KB. Legal sentence needs the human's own review.

## Security review

Verdict: PASS (0 critical, 0 high, 0 medium, 0 low, 2 info)

| Severity | Location | Finding | Suggested action |
|---|---|---|---|
| info | `src/pages/privacy-policy.astro` line 55 (section 3) | Says the Cloudflare analytics "doesn't ... use local storage"; scoped to that analytics, so not contradicted by the new `grove-theme` sentence (line 95-96, section 5). The sentence does not name the key; the consent key is not named either. | Human's call at the gate; no change needed. |
| info | Fingerprint | The plan is untracked, so editing it changes the standard fingerprint command's output. The hash below excludes the plan file. | Publisher: recompute with `(git diff HEAD; git ls-files -o --exclude-standard \| grep -vx docs/design/plans/2026-11-14-footer-theme-toggle.md \| xargs shasum 2>/dev/null) \| shasum`. |

Checked (verified):
- Secrets: grep for token prefixes, private keys, credentials in URLs and `/Users/` across the tree; only hits are the reviewer agent's own documentation of the patterns. Branch has no commits ahead of `main`, so there is no branch history to leak. `.gitignore` covers `node_modules/`, `dist/`, `.astro/`; it does not list `.env*` (no `.env` file is tracked or present). Nothing new on the public-by-design list.
- PII: none added; no images, no new third-party requests, fonts or trackers.
- Code: `theme-toggle.js` and the inline head script use no HTML sinks; the only `is:inline` is static. Every `localStorage` access in both is inside try/catch (get in `stored()`/`saved()`, set/remove in the click handler). Values are whitelisted to `light`/`dark` before use. The `storage` listener is safe. SVGs are static; the `t.theme.*` labels are escaped Astro expressions from `i18n.ts`. No new links or external scripts.
- Privacy: `localStorage['grove-theme']` is declared by the new section 5 sentence (stored locally, not sent anywhere). It is stated conditionally "if you use the footer toggle", which matches behaviour (System removes the key; nothing is written otherwise).
- Workflows, `package.json` and `package-lock.json`: unchanged in the diff. `npm ls --all` is consistent (only unmet optional peers of vite). `npm audit --omit=dev` and `npm audit`: 0 vulnerabilities. `npm outdated`: nothing reported. `design-template-kit` is still pinned to the `molayab/design-template-kit` tag tarball v0.1.1 with integrity; it is the only non-registry `resolved` host and is not covered by `npm audit`. Its contents were not inspected because it is unchanged.
- `.claude/` files and AGENTS.md/docs changes are prose only; no secrets, and no attribution text in them.

Not checked: runtime behaviour in a browser (the coder reports it as unverified too), gitleaks/trufflehog (not run), typosquatting (no new packages).

Reviewed: a7c4e53f96695ad1aff3996f914b556a5debc057 on 2026-11-14 (command excludes docs/design/plans/; includes .gitignore .env* addition and the two .claude/agents edits, all re-reviewed)
