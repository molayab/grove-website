# Grove — Marketing Website

> Your dev workspace, one window.

The marketing site for **[Grove](https://grove.molayab.com)**, a native macOS git workspace app
for developers who use AI coding agents (Claude Code, opencode, Codex, Gemini CLI, Aider) — one
window instead of switching between a terminal, an editor, and a diff tool. Sold as a one-time-
purchase license via Gumroad, with a free trial before you buy.

**Live at [grove.molayab.com](https://grove.molayab.com)**

---

## What's here

Plain HTML/CSS, no build step, no bundler, no package manager. Published via **GitHub Pages**
straight from this repo's `main` branch. The one framework dependency is a vendored copy of
[Pico CSS](https://picocss.com).

| File | What it is |
|---|---|
| `index.html` | The marketing page (English) |
| `es/index.html` | Spanish translation |
| `privacy-policy.html`, `refund-policy.html` | Legal pages |
| `style.css` | All styling — design tokens + per-section rules, loaded after Pico |
| `vendor/pico.min.css` | Vendored [Pico CSS](https://picocss.com) |
| `screenshots/` | App screenshots used on the site |
| `download.json` | Release metadata (auto-synced from GitHub Releases) that drives the download button |
| `CNAME` | GitHub Pages custom domain |

Grove itself — the macOS app's source — lives in a separate, private repository.

---

## Preview locally

No build step required — open a file directly, or serve the directory:

```sh
python3 -m http.server
```

Check both light and dark mode, and the 860px/600px responsive breakpoints, before shipping a
change.

---

## Bug reports

This repo also doubles as the public intake queue for the app's in-app "Report a Bug" flow.
Reports are triaged with a status label (`status: logged` → `status: on-backlog` or
`status: invalid/duplicate`) before anything becomes real roadmap work.

---

## Contact

`hello@molayab.com` · Built by [Mateo Olaya Bernal](https://github.com/molayab)

---

## License

Proprietary. All rights reserved. © 2026 Mateo Olaya Bernal.
