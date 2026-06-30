# UIKit Preview app

A standalone page (under `preview/`) that showcases the kit.

## Requirements
- Components grouped by **category** (actions, inputs, navigation, data, feedback,
  overlays, layout, commerce) with a section header per category.
- Each component card shows a live, token-styled preview.
- Each card has a **Copy code** button that copies a ready-to-paste usage snippet
  for that component (the same snippet shown in its `<Component>.md` doc).
- A light/dark toggle.
- A category nav / table of contents.

## Copy-code implementation
- Keep the snippet next to each component (e.g. a `snippet` field or the doc's
  fenced block). The button calls `navigator.clipboard.writeText(snippet)` and
  shows a transient "Copied" state.

## Checklist
- [ ] All emitted components appear, grouped by category.
- [ ] Each has a working Copy-code button.
- [ ] Light/dark toggle works.
- [ ] `npm run preview` (or `dev`) serves it.
