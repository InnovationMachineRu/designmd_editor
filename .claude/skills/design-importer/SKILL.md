---
name: design-importer
description: Build a valid DESIGN.md from a website URL or a local catalog (default ./input) and import it into the design-system workflow.
version: 1.0.0
user-invocable: true
argument-hint: "url <url> | catalog [path]"
allowed-tools:
  - Read
  - Write
  - WebFetch
  - Bash(node .claude/skills/design-importer/scripts/*)
---

Two modes: `url <url>` and `catalog [path=./input]`.

## Setup
Read `reference/designmd-format.md` (the exact schema) first. Then read
`reference/from-url.md` or `reference/from-catalog.md` for the chosen mode, and
`reference/import-into-app.md` for landing the result.

## Steps
1. Extract palette, fonts, radius, spacing from the source:
   - URL → computed styles (WebFetch for static; Chrome DevTools MCP for JS-rendered).
   - Catalog → images for palette + `.css` via `scripts/extract-css.mjs` for tokens.
2. Map colors to roles (primary/surface/on-surface/…) with accessible on-colors;
   map fonts → typography, radius → rounded, padding → spacing.
3. Author valid front-matter + canonical sections.
4. Write `output/DESIGN.md`; lint and fix until clean.
5. Import/merge into the app (ImportDialog or the load route — see import-into-app.md).

Follow the per-mode checklists in the reference files. Report low-confidence
guesses so the user can review them.
