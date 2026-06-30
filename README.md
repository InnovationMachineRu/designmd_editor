# DESIGN.md Editor

An interactive editor for [**design.md**](https://github.com/google-labs-code/design.md)
design systems, built with **Next.js (App Router)** + **Tailwind v4**.

Two-step workflow:

1. **Design system** — edit the design.md token blocks (`colors`, `typography`,
   `rounded`, `spacing`, `components`) plus the canonical markdown rationale
   sections, with a **live preview** of popular UI elements. Toggle **light/dark**
   themes and switch the dominant **style preset** (Material UI · Glassmorphism ·
   Minimalism · Neomorphism). **Save** serializes a spec-compliant `DESIGN.md`
   (YAML front-matter + markdown body) and validates it with the real
   `@google/design.md` CLI, surfacing findings inline.
2. **UIKit components** — pick from a broad component catalog, choose a target
   technology (React · Web Components · Vue · Angular · Svelte) and **generate a
   technical spec (ТЗ)** that binds each component to the saved design tokens.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

Generated artifacts are written to `output/` (override with `DMD_OUTPUT_DIR`):
`output/DESIGN.md` and `output/UIKIT-SPEC.md`.

## How it works

| Concern | Location |
| --- | --- |
| Token types | `lib/designmd/types.ts` |
| Serialize / parse `DESIGN.md` | `lib/designmd/serialize.ts`, `parse.ts` |
| Token resolution → CSS vars | `lib/designmd/tokens.ts` |
| CLI lint / export (server) | `lib/designmd/cli.ts` |
| Style presets | `lib/presets/*` |
| Editor state | `lib/store.ts` (Zustand) |
| Editor blocks | `components/editor/*` |
| Live preview + gallery | `components/preview/*` |
| UIKit catalog + ТЗ generator | `lib/uikit/*`, `components/uikit/*` |
| API routes | `app/api/design/{save,lint}`, `app/api/uikit/spec` |

Validation runs the bundled `@google/design.md` CLI server-side; if it is
unavailable, a lightweight in-process linter is used as a fallback (the UI
labels which source produced the findings).
