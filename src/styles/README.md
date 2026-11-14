# Styles

Plain CSS, no preprocessor. Three layers, so the reusable part can move to
other projects (e.g. molayab.com) without dragging Grove along.

```
styles/
  index.css          Grove's entry (imported by layouts/Base.astro)
  core/              Reusable, brand-neutral. Works with or without Pico.
    index.css          imports the partials below, in cascade order
    tokens.css         THE THEMING API (primitives + semantic tokens)
    reset.css  base.css  typography.css  layout.css
    buttons.css  nav.css  footer.css  prose.css
    cookie-banner.css  lightbox.css  theme-toggle.css  responsive.css
  theme/
    grove.css          Grove's values for the primitives (the only brand file)
  site/              Grove-only sections: hero, features, pricing, demo, …
  pico.min.css       Vendored Pico (Grove's third-party base)
  pico-bridge.css    Grove only: maps Pico's variables to our tokens and undoes
                     a few Pico defaults. Not needed without Pico.
```

## Reusing `core/` in another project

1. Copy `core/` (or import it) and write your own `theme/<project>.css`
   (start from `theme/grove.css`), imported **after** `core/index.css`.
2. Link or `@import` them in that order: `core/index.css` → your theme.
3. Use the class names from the partials (`.btn`, `.btn-primary`, `.btn-ghost`,
   `.section`, `.section-inner`, `.eyebrow`, `.legal*` prose layout, nav/footer
   markup as in `src/components/Nav.astro` / `Footer.astro`).

Nothing in `core/` is Astro-specific — it works from a Jekyll `_includes`/CSS
file or any static page. Responsive rules live next to what they affect
(`core/responsive.css` for core, `site/responsive.css` for Grove sections).

## Theme API (`core/tokens.css`)

Override any of these primitives on `:root` in your theme file:

| Group | Variables |
|---|---|
| Fonts | `--font`, `--mono` (load web fonts yourself, then name them here) |
| Shape | `--radius`, `--radius-sm`, `--radius-pill` |
| Brand | `--brand` (fills), `--brand-hover`, `--brand-contrast` (text on a fill), `--brand-on-dark` / `--brand-on-light` (brand as small **text**, keep ≥ 4.5:1 on that surface) |
| Dark palette | `--dark-bg`, `--dark-section`, `--dark-raised`, `--dark-text` |
| Light palette | `--light-bg`, `--light-section`, `--light-raised`, `--light-text`, `--light-border` |

Components only read the **semantic** tokens (`--bg`, `--bg-section`,
`--bg-raised`, `--text`, `--text-2`, `--text-3`, `--border`, `--border-strong`,
`--accent`, `--accent-hover`, `--accent-text`, `--accent-dim`, `--accent-glow`,
`--shadow-*`, `--media-bg`, `--overlay-*`), which tokens.css derives from the
primitives for both themes. Accent tints are `color-mix()` of `--accent`, so a
new brand color flows everywhere with no other edits.

Theme switching: `data-theme="dark|light"` on `<html>` wins (Grove's inline
script sets it from the OS and follows OS changes); without it the OS
preference decides, dark by default.

## Conventions

- No hard-coded brand colors in partials — use tokens or `color-mix()` on them.
  The only literals left are black drop-shadows.
- New component → new partial (in `core/` if it's brand-neutral, else `site/`),
  then add it to the matching `index.css`.
- Keep `--text-3` ≥ 4.5:1 and use `--accent-text`, not `--accent`, for text.
