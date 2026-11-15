# grove-website docs

Maintainer documentation for the Grove marketing site (`grove.molayab.com`). Start with the
section that matches what you need to do.

| I want to… | Read |
|---|---|
| Understand how the site is built and deployed | [architecture.md](architecture.md) |
| Know *why* something is the way it is | [adr/](adr/README.md) — architecture decision records |
| Change colors, fonts, components or layout | [design/design-system.md](design/design-system.md) and [`src/styles/README.md`](../src/styles/README.md) (token API) |
| Ship a release, fix a broken deploy | [runbooks/deploy-and-release.md](runbooks/deploy-and-release.md) |
| Add a page, edit copy, swap screenshots, reuse the CSS elsewhere | [runbooks/common-tasks.md](runbooks/common-tasks.md) |
| Run a change through design → approval → code → security review → PR | [design/plans/](design/plans/) and the `/webpage-pipeline` skill (`.claude/`) |

Rules for contributors and AI agents (attribution, legal copy, localization, URLs) live in
[`AGENTS.md`](../AGENTS.md). They take precedence over anything here.

## Quick start

```sh
npm install
npm run dev        # http://localhost:4321 (next free port if taken)
npm run build      # static output in dist/
npm run preview    # serve dist/
```

Requires Node 22 (what CI uses). There is no test suite; a clean `npm run build` plus a
browser check in dark and light mode at 1440px, 860px and 390px is the bar.

## Keeping these docs current

- A change that alters *how* the site works → update [architecture.md](architecture.md).
- A choice between real alternatives → add an ADR (copy the format in
  [adr/README.md](adr/README.md)); never edit an accepted ADR's decision, supersede it.
- A token, component or visual rule → update [design/design-system.md](design/design-system.md)
  and its changelog.
