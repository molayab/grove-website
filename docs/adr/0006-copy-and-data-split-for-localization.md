# ADR-0006: Translatable copy in per-locale content files, shared data separate

**Status:** Accepted
**Date:** 2026-11-14
**Deciders:** Mateo Olaya Bernal

## Context

The home page exists in English and Spanish. As two hand-maintained HTML files, prices,
image paths and structure had to be changed twice and drifted. An i18n library or Astro's
i18n routing would add concepts the site doesn't need (two locales, no runtime switching).

## Decision

- `src/content/home/en.ts` and `es.ts` hold **all translatable copy** for the home page, typed
  by `src/content/home/types.ts` (same shape, same list order).
- `src/data/home.ts` holds **language-independent data** (slides, screenshots, prices,
  links, icon keys). Lists are matched to copy **by position**.
- Section components render both; `src/pages/index.astro` and `src/pages/es/index.astro`
  only choose the locale. Nav/footer strings live in `src/i18n.ts`.
- Guides and legal pages keep their prose in the page file (long-form, per locale).
- Legal pages stay English-only (see AGENTS.md "Legal/policy content").

## Consequences

- A copy change usually needs the same edit in both content files; TypeScript catches missing
  fields, not wrong order — keep list order identical.
- Copy fields may contain trusted HTML (`&amp;`, `<br>`, `<code>`) and are rendered with
  `set:html`; plain-text fields (alt, aria labels, carousel captions) are not.
- Adding a third locale = one content file + one page file + `src/i18n.ts` entries +
  `src/data/pages.ts` paths.
