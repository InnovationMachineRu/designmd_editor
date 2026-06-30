# Mode: catalog

Build a DESIGN.md from a local folder of assets (default `./input`).

## What to read
- **Images / screenshots** (`.png`, `.jpg`, `.webp`, `.svg`) — read them to derive
  the palette and overall visual language (use the Read tool on images).
- **CSS** (`.css`) — run `node .claude/skills/design-importer/scripts/extract-css.mjs <path>`
  to pull custom properties, colors, font-families, border-radius, and spacing.
- **Brand notes** (`.md`, `.txt`) — fonts, voice, do's & don'ts.

## Steps
1. Enumerate the input folder; classify files (images / css / notes).
2. Extract palette from images; extract token candidates from `.css`.
3. Map colors to roles with accessible on-colors; map fonts/radius/spacing.
4. Author valid front-matter + canonical sections.
5. Write `output/DESIGN.md`; lint and fix.
6. Import (see import-into-app.md).

## Checklist
- [ ] `./input` (or given path) enumerated.
- [ ] Images read for palette; `.css` parsed via extract-css.mjs.
- [ ] Colors mapped to roles with on-colors.
- [ ] Fonts → typography, radius → rounded, padding → spacing.
- [ ] Valid front-matter + canonical sections authored.
- [ ] Written to `output/DESIGN.md`; lint clean.
- [ ] Imported.
- [ ] Low-confidence guesses reported.
