# Design system

The visual language of grove.molayab.com, and the reference the `webpage-designer` agent
keeps current. The **token API** (every variable, how to theme another project) is documented in the
[design-template-kit README](https://github.com/molayab/design-template-kit#theme-api) (see also
[`src/styles/README.md`](../../src/styles/README.md)); this document covers the concepts,
scales, components and rules built on top of it. Decisions behind it:
[ADR-0003](../adr/0003-shared-themeable-css-layer.md), [ADR-0004](../adr/0004-pico-as-optional-base.md).

## Principles

1. **Native-Mac calm.** True black (dark) / light grey (light) grounds, generous whitespace,
   one accent. It should feel like part of macOS, not a template.
2. **One accent.** Grove crimson `#CB2957` is the only hue. Neutrals are `#000000`,
   `#DDDDDD`, `#EEEEEE` and white; raised surfaces are derived. No new hues (this ruled out the
   green GIF backdrop — [ADR-0007](../adr/0007-hero-cover-as-looping-video.md)).
3. **Dark-first, light as a peer.** Every section, including the hero, follows the theme.
4. **Accessible by default.** Lighthouse accessibility 100 on every page, in both themes.
5. **Brand-neutral core.** Anything reusable lives in the `design-template-kit` package and reads tokens only.

## Color

### Brand (Grove theme, `src/styles/theme/grove.css`)

| Primitive | Value | Use | Contrast |
|---|---|---|---|
| `--brand` | `#CB2957` | Fills: primary buttons, active dot, borders, checkmarks | White on it: 5.26:1. As text on `#000`: 3.99, on `#111`: 3.59 — **not for small text** |
| `--brand-hover` | `#B01F48` | Hovered fills | White on it: 6.7:1 |
| `--brand-contrast` | `#FFFFFF` | Text/icons on brand fills | — |
| `--brand-on-dark` | `#E8527C` | Brand-colored small text on dark surfaces | 5.33–5.93:1 on `#111`/`#0A0A0A`/`#000`; 5.15 on the code tint |
| `--brand-on-light` | `#B8244E` | Brand-colored small text on light surfaces | 6.18 on `#FFF`, 5.32 on `#EEE`, 5.31 on the code tint |

### Neutrals and semantic tokens

| Semantic | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#000000` | `#EEEEEE` | Page, hero, alternating sections |
| `--bg-section` | `#0A0A0A` | `#FFFFFF` | Alternating sections |
| `--bg-raised` | `#111111` | `#FFFFFF` | Cards, banner, popovers |
| `--text` | `#EEEEEE` | `#000000` | Headings, primary text |
| `--text-2` | text @ 68% | text @ 62% | Body, captions (≥ 5.9:1) |
| `--text-3` | text @ 60% | text @ 60% | Notes, meta (≥ 5.5:1 — **don't lower**) |
| `--border` | text @ 14% | `#DDDDDD` | Card and divider lines |
| `--border-strong` | text @ 24% | text @ 24% | Outlined (ghost) buttons |
| `--accent-text` | `--brand-on-dark` | `--brand-on-light` | Eyebrows, links, `code` |
| `--accent-dim` | accent @ 14% | accent @ 10% | Code background, callouts |
| `--glow-alpha` | 22% | 11% | Hero radial glow strength |

Sections alternate `--bg` / `--bg-section` down the page so no two neighbours share a
background: hero, download, features, demo, screenshots…

## Typography

System stack (`--font: system-ui, -apple-system, …`), monospace `--mono` for eyebrows,
badges, pills and code. Root size is 16px (Pico's scaling is pinned off).

| Role | Size | Weight / tracking | Notes |
|---|---|---|---|
| `h1` | `clamp(2.5rem, 6vw, 4.5rem)` | 800, −0.03em, lh 1.02 | Hero fits in 2 lines at ≥ 1024px |
| `h2` | `clamp(2rem, 4.5vw, 3.25rem)` | 800, −0.025em, lh 1.08 | Section titles |
| `h3` | `1.0625rem` | 700 | Card titles |
| Body | `17px`, lh 1.6 | 400 | |
| Section sub | `1.125rem`, lh 1.65, max 520px | `--text-2` | |
| Card body | `0.9375rem` | `--text-2` | |
| Eyebrow | `0.75rem` mono, uppercase, +0.08em | 700, `--accent-text` | Above every section title |
| Meta / notes | `0.8125rem` | `--text-3` | |
| Price | `clamp(2.75rem, 4.2vw, 3.75rem)` | 800, tabular nums | |

Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`.

## Layout and spacing

| Token / rule | Value |
|---|---|
| Gutter | `--gutter` 2rem (≤ 600px: 1.5rem), identical in nav, hero, sections and footer (kit >= 0.2.0) |
| Section padding | `96px` vertical (≤ 600px: `72px`); the `*-inner` owns the gutter |
| Content width | `--page-max` 980px (`.section-inner`), `--page-max-wide` 1160px (nav, footer, `.section-inner--wide`: features, demo). Both exclude the gutter |
| Frame rule | Every inner: `max-width: calc(<measure> + 2 * var(--gutter))`, `padding-inline: var(--gutter)`, so content is exactly the measure; 980px sections are centered inside the 1160px frame |
| Hero text column | 820px (+ gutter); hero media 860px including gutter |
| Radii | `--radius` 14px (cards, buttons), `--radius-sm` 10px (media), `--radius-pill` |
| Breakpoints | 1100px (features 4→3 cols), 860px (2 cols, stacked pricing/gallery), 600px (single column, two-row nav) |

## Components

All live in `src/components/` (Astro) with styles in the matching partial.

| Component | Where | Variants / states | Accessibility |
|---|---|---|---|
| Button `.btn` | kit `buttons.css` | `-primary`, `-primary-dark` (nav), `-ghost` (outlined, `--border-strong`), `-large`; hover lift + glow, active scale .97 | `<a role="button">` for links, `<button>` for actions; 2px accent focus ring |
| Nav | `Nav.astro`, kit `nav.css` | `home` (in-page anchors), `page` (links home), `legal` (Pricing + Support); ≤ 600px links move to a 2nd row | Sticky, blurred `--bg` @ 78% |
| Footer | `Footer.astro`, `site/footer-theme-switch.css` | EN/ES labels; legal links marked "(EN)" in Spanish; last item is the kit's theme switch (`.theme-switch` / `.theme-switch__option`, kit >= 0.3.0): segmented System / Light / Dark, aria-pressed buttons, 28px segments (44px at <= 600px or coarse pointer), active = accent tint + text-at-50% outline + heavier stroke. Site CSS only centres it with the links and reserves its height. Never use the kit's `.theme-toggle` for the group | Native `<button>`, 2px accent focus ring, target >= 24px |
| SectionHeader | `home/SectionHeader.astro` | eyebrow + h2 + optional sub | |
| Feature card | `home/FeatureCard.astro` | default, `highlight` (spans the row, accent gradient) | Icon is decorative SVG |
| Pricing card | `home/PricingCard.astro` | default, featured (badge, accent border/glow); shared "Every license includes" list below the grid | Buy link opens Gumroad overlay |
| Hero carousel | `home/HeroCarousel.astro`, `carousel.js` | image slides, video slide (`video`, `cover`, `duration`); dots + pause | `role=region` carousel, dots 24px targets with labels, pause button 24×24, reduced motion = no autoplay |
| Lightbox | `Lightbox.astro`, kit `lightbox.css` | always dark (`--overlay-*`) | `<dialog>`, close/prev/next labelled, Esc closes |
| Cookie banner | `CookieBanner.astro` | EN/ES; one row ≥ 600px | Decline is always shown next to Accept, same size; GA loads only after Accept |
| Prose page | `.legal`, `.legal-inner`, `.legal-prose`, `.guide` modifier | callout, tables, figures | One `h1`, ordered `h2`s |
| Badge / pill / blog card / demo video | `site/*.css` | — | — |

## Motion

- Hover: cards and thumbnails lift `translateY(-2px)` (0.2s); buttons glow.
- Hero frame fades/rises in once (0.6s); carousel cross-fades 0.8s, 4.5s per slide (cover:
  one loop of the video).
- `prefers-reduced-motion: reduce` disables the entrance animation, transitions and carousel
  autoplay; the cover video doesn't play.

## Imagery and media

- Screenshots: 1800×1125 PNG (16:10), real app content, `width`/`height` set, lazy except the
  first slide. Alt text describes what the screenshot shows.
- Motion: window-only recordings as H.264 MP4 with a poster JPG; no GIFs; no autoplay with
  sound. The promo video has controls and `preload="none"`.
- Social card: `public/og-image.png`, 1200×630.

## Accessibility rules

- Small text ≥ 4.5:1, large text/UI ≥ 3:1 — compute it for every new pair, both themes.
- One `<main>`; landmarks via `Base.astro`.
- Interactive targets ≥ 24×24px; visible focus on every control.
- No information conveyed by color alone; captions mirror carousel dot labels.

## Changelog

| Date | Change | Plan / ADR |
|---|---|---|
| 2026-11-14 | Root font size pinned to 16px; `--accent-text`; `--text-3` 60%; hero 2-line h1; features 4 columns; shared pricing includes list; two-row mobile nav; `<main>` | Design audit |
| 2026-11-14 | Layers `core/` / `theme/` / `site/` / `pico-bridge.css`; primitives API; `color-mix()` tints; hero follows theme; `--border-strong`, `--glow-alpha`; cover video | ADR-0003, ADR-0004, ADR-0007 |
| 2026-11-14 | `core/` extracted to the `design-template-kit` package (v0.1.0); Grove keeps `theme/`, `site/`, `pico-bridge.css` | ADR-0003 amendment |
| 2026-11-14 | One page frame: `--gutter`, `--page-max`, `--page-max-wide` tokens and `.section-inner--wide` (kit v0.2.0, option B); nav/footer/features/demo share the 1160px frame, text sections 980px centered inside | 2026-11-14-layout-gutter-alignment |
| 2026-11-14 | Footer theme control (System/Light/Dark) planned (no new tokens; site-layer CSS) | 2026-11-14-footer-theme-toggle |
| 2026-11-14 | Footer theme control moved to the kit's `.theme-switch` (28px segments, active outline >= 3:1); fixes the `.theme-toggle` class collision; needs kit v0.3.0 pin | 2026-11-14-theme-switch-fix |
