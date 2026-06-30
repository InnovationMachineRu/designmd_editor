# DESIGN.md Editor

An interactive editor for [**design.md**](https://github.com/google-labs-code/design.md)
design systems, built with **Next.js 16 (App Router)** + **React 19** +
**Tailwind v4**. It turns brand decisions into spec-compliant design tokens and
a code-ready UIKit spec — and ships a Claude Code **AI-agent layer** that can run
the whole pipeline and scaffold a real UIKit repository.

---

## What it does

A five-step wizard (top `Stepper`), each step a route:

| Step | Route | Purpose |
| --- | --- | --- |
| 1. **Brandbook** | `/brandbook` | Visual identity: color scheme/harmony, fonts, logos, shape/roundness, gradients, imagery, motion, voice, spacing density. |
| 2. **Design system** | `/` | Edit the `DESIGN.md` token blocks (`colors`, `typography`, `rounded`, `spacing`, `components`) and canonical rationale sections, with a **live preview**, light/dark themes, and style presets (Material · Glassmorphism · Minimalism · Neomorphism). |
| 3. **UIKit** | `/uikit` | Pick components from a catalog of 8 categories, each with a live token-driven preview. |
| 4. **Layouts** | `/layouts` | Pick page layouts and component compositions (dashboard, landing, settings, kanban, …). |
| 5. **Export** | `/export` | Choose a target framework, **validate & generate** the UIKit spec (ТЗ), download tokens in four formats, and download the AI-agent toolkit. |

**Outputs** (written to `output/`, or `DMD_OUTPUT_DIR`):

- `DESIGN.md` — spec-compliant YAML front-matter + markdown rationale.
- `UIKIT-SPEC.md` — the technical spec (ТЗ) binding each selected component and
  layout to the saved tokens, per target framework. (Itself a valid `DESIGN.md`.)
- Token exports from the Export step: Markdown, CSS variables, Tailwind v4
  `@theme`, and W3C DTCG JSON.

Validation runs the bundled `@google/design.md` CLI server-side; if unavailable,
a lightweight in-process linter is used as a fallback (the UI labels the source).

---

## AI agents

The repo ships two Claude Code agents (both run on **Sonnet**) plus skills and
editable best practices. Full usage is in **[docs/AI-AGENTS.md](docs/AI-AGENTS.md)**.

- **`uikit-studio`** — runs the pipeline end to end: starts the dev server, guides
  you through every wizard phase, detects the export completion signal
  (`output/.uikit-ready.json`), stops the server, then scaffolds a **separate UIKit
  repository** in your chosen framework — components, layouts, base pages,
  Storybook, per-component docs, and a categorized **Preview app with copy-code**.
  The generated UIKit embeds its own toolkit (an `interface-builder` agent plus
  e2e / accessibility / performance skills via the Chrome DevTools MCP).
- **`design-importer`** — builds a `DESIGN.md` from a **website URL** or a local
  **catalog** (default `./input`), then imports it into the workflow.

On the Export step, **"Download AI agents + UIKit starter (.zip)"** produces a
portable copy of the agents, skills, best practices, and a framework-specific UIKit
starter — generated deterministically from your current selections.

---

## Getting started

Requires **Node ≥ 26.4.0**.

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

> Next 16 enforces a single dev server per project directory.

---

## Project structure

```
app/                     Next.js routes + API
  api/design/{save,lint,load,from-tokens}/   DESIGN.md persistence, validation, import bridges
  api/uikit/spec/                            UIKIT-SPEC.md generation + .uikit-ready.json signal
  {brandbook,uikit,layouts,export}/          wizard step pages ( / is the token editor)
components/              UI: brandbook, editor, preview, uikit, layouts, export, wizard, ui
lib/
  designmd/              token types, parse/serialize, tokens→CSS, CLI lint/export, paths
  uikit/                 component catalog + spec (ТЗ) generator
  layouts/               page/component layout catalog
  templates/             code-generated agent/skill/best-practice/UIKit-starter + zip writer
  store.ts               Zustand editor state (persisted)
  download.ts, api.ts    client helpers
.claude/
  agents/                uikit-studio, design-importer (Sonnet)
  skills/                uikit-orchestrator, build-uikit, design-importer
  best-practices/        editable per-framework + shared guidance
docs/AI-AGENTS.md        end-user guide to the agents
output/                  generated artifacts (DESIGN.md, UIKIT-SPEC.md, signal)
```

---

## How it works

| Concern | Location |
| --- | --- |
| Token types | `lib/designmd/types.ts` |
| Serialize / parse `DESIGN.md` | `lib/designmd/serialize.ts`, `parse.ts` |
| Token resolution → CSS vars | `lib/designmd/tokens.ts` |
| Token export formats | `lib/designmd/export.ts` |
| CLI lint / export (server) | `lib/designmd/cli.ts` |
| Output paths / signal | `lib/designmd/paths.ts` |
| Style presets | `lib/presets/*` |
| Editor state | `lib/store.ts` (Zustand) |
| Editor + preview | `components/editor/*`, `components/preview/*` |
| UIKit catalog + ТЗ generator | `lib/uikit/catalog.ts`, `lib/uikit/spec.ts` |
| Layouts catalog | `lib/layouts/catalog.ts` |
| Template generators + zip | `lib/templates/*` |
| API routes | `app/api/design/{save,lint,load,from-tokens}`, `app/api/uikit/spec` |
| AI agents / skills | `.claude/agents/*`, `.claude/skills/*` |

The Export step writes `UIKIT-SPEC.md` **and** an atomic sentinel
`output/.uikit-ready.json` (with a fresh `runId`, the chosen tech, components,
layouts, and paths). The `uikit-studio` agent polls that sentinel to know when the
requirements are ready, then builds the UIKit — a deterministic, hands-off handoff.

---

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `DMD_OUTPUT_DIR` | `<cwd>/output` | Where `DESIGN.md`, `UIKIT-SPEC.md`, and the signal are written. |
| `DMD_UIKIT_DIR` | `<output>/uikit` | Suggested target for the generated UIKit (the agent still asks). |
| `PORT` | `3000` | Dev server port. |

---

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · Zustand 5 ·
`yaml` · `@google/design.md` 0.3 · TypeScript 6 · ESM.

Contributing? See **[AGENTS.md](AGENTS.md)** for setup, architecture, and
conventions, and **[PRODUCT.md](PRODUCT.md)** for brand and design intent.

## Credits

Built around the [design.md](https://github.com/google-labs-code/design.md)
specification by Google Labs.
