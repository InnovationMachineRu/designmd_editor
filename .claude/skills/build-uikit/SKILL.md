---
name: build-uikit
description: Scaffold a separate UIKit repository from UIKIT-SPEC.md + DESIGN.md in the selected framework — components, layouts, base pages, Storybook, docs, a categorized copy-code Preview app, and an embedded .claude/ toolkit.
version: 1.0.0
user-invocable: true
argument-hint: "[target-path]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash(node .claude/skills/build-uikit/scripts/*)
  - Bash(npm *)
  - Bash(npx *)
---

Hybrid scaffold: deterministic boilerplate via the scaffold script, then
agent-authored components/layouts/pages guided by the best-practices references.

## Setup
1. Ask the user for the target output path. Suggest `output/uikit/` (or `DMD_UIKIT_DIR`).
2. Read `output/UIKIT-SPEC.md` and `output/DESIGN.md` — the source of truth.
3. Read the matching `reference/per-framework/<tech>.md`, plus the relevant
   `.claude/best-practices/*` files.
4. Read `reference/repo-tree.md`, `reference/storybook.md`, `reference/preview-app.md`,
   `reference/docs.md`, `reference/embedded-claude.md`, and `reference/checklists.md`.

## Steps
1. **Boilerplate (deterministic)**
   `node .claude/skills/build-uikit/scripts/scaffold.mjs <target>`
   creates the tree, copies DESIGN.md/UIKIT-SPEC.md, writes package.json,
   `.gitignore`, BUILD-NOTES.md, and the embedded `.claude/` toolkit (agent +
   skills + best practices for the chosen tech).
2. **Tokens** — write `design-tokens.css` (and the framework token bindings)
   from the DESIGN.md front-matter; light + dark layers.
3. **Components (authored)** — for each selected component: source + Storybook
   story + Markdown doc, covering every state and variant, tokens-only.
4. **Layouts & pages (authored)** — every selected layout and every page-kind base page.
5. **Preview app** — components grouped by category, each with copy-code-per-component.
6. **Storybook** — config + stories build cleanly.
7. **Verify** — `npm install` && build && Storybook build; iterate until green.

See `reference/checklists.md` for the exhaustive checklist. Emit only the selected
framework — never multiple.
