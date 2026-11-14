# Styles

Plain CSS, no preprocessor. The reusable, brand-neutral layer lives in its own repo,
[`design-template-kit`](https://github.com/molayab/design-template-kit) (pinned in `package.json`); this folder holds only what is specific to Grove.

```
styles/
  index.css          Grove's entry (imported by layouts/Base.astro). Cascade order:
                     Pico → design-template-kit → theme/grove.css → pico-bridge.css → site/
  theme/grove.css    Grove's values for the kit's theme primitives (the only brand file)
  site/              Grove-only sections: hero, features, pricing, demo, … (+ responsive.css)
  pico.min.css       Vendored Pico (Grove's third-party base)
  pico-bridge.css    Grove only: maps Pico's variables to the kit's tokens and undoes a few
                     Pico defaults. Not needed without Pico.
```

## Theming Grove

Edit `theme/grove.css` — it overrides the kit's primitives (`--brand*`, `--font`, `--mono`,
radii, dark/light palettes). The full token API, theme template and component conventions are
documented in the kit's README (`node_modules/design-template-kit/README.md`, or on GitHub).
Components in `site/` read only semantic tokens (`--bg`, `--text-2`, `--accent-text`,
`--border-strong`, …) or `color-mix()` of them — no hard-coded brand colors.

## Changing the kit

The kit's CSS is not editable here (it's in `node_modules`). To change shared styles:

1. Edit and release the kit ([`design-template-kit`](https://github.com/molayab/design-template-kit)): change `src/`, `npm run build`, commit `dist/`, bump
   the version, tag `vX.Y.Z`.
2. In this repo, point `package.json` at the new tag (the tarball URL) and `npm install`.
3. Re-check every page in dark and light; update `docs/design/design-system.md`.

If a rule is only for Grove, it belongs in `site/` here, not in the kit.

## Conventions

- New Grove-only section → new partial in `site/`, imported by `site/index.css`.
- Never hard-code a brand color; use tokens. Use `--accent-text`, not `--accent`, for text;
  keep `--text-3` ≥ 4.5:1.
