# Per-component Markdown docs

Write one `<Component>.md` next to each component.

## Sections
- **Title + one-line description** (from the catalog/spec).
- **Usage** — a fenced code block with a copy-paste snippet (framework-idiomatic).
- **Props / Attributes** — a table: name, type, default, description.
- **States** — list each state and what changes.
- **Variants** — list each named variant.
- **Accessibility** — roles, keyboard, focus, contrast notes.

Keep the usage snippet identical to the one wired into the Preview app's copy-code
button so docs and preview never drift.

## Checklist
- [ ] Every component has a `.md` doc.
- [ ] Props/attributes table complete.
- [ ] States + variants listed.
- [ ] a11y notes present.
- [ ] Usage snippet matches the Preview copy-code snippet.
