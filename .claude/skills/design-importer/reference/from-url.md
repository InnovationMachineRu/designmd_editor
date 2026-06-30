# Mode: url

Build a DESIGN.md from a live website.

## Steps
1. Fetch the page. For static HTML, use WebFetch. For JS-rendered sites, use the
   Chrome DevTools MCP (`navigate_page`, then `evaluate_script` to read
   `getComputedStyle` of representative elements).
2. Sample computed styles for: `body`, `h1`–`h3`, `a`, `button`, primary CTA,
   `input`, a card/surface container.
3. Derive tokens:
   - **colors** — page background → `surface`; body text → `on-surface`; primary
     button / link / accent → `primary` (+ `on-primary`); borders → `border`.
   - **typography** — font-family/size/weight/line-height of body and headings.
   - **rounded** — border-radius values seen (dedupe into sm/md/lg).
   - **spacing** — common padding/gap values (dedupe into a small scale).
4. Ensure every background has an accessible on-color (≥ 4.5:1).

## Checklist
- [ ] Page read (WebFetch or Chrome DevTools MCP).
- [ ] Computed styles sampled for the elements above.
- [ ] Colors mapped to roles with on-colors.
- [ ] Fonts → typography, radius → rounded, padding → spacing.
- [ ] Valid front-matter + canonical sections authored.
- [ ] Written to `output/DESIGN.md`; lint clean.
- [ ] Imported (see import-into-app.md).
- [ ] Low-confidence guesses reported.
