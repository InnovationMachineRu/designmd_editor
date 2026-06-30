# AGENTS.md

Guide for AI coding agents (and humans) working **on** this repository. For the
end-user guide to the project's *runtime* agents, see
[docs/AI-AGENTS.md](docs/AI-AGENTS.md). For brand/design intent see
[PRODUCT.md](PRODUCT.md); for the human overview see [README.md](README.md).

## Overview

`designmd-editor` is a Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4
app that edits [design.md](https://github.com/google-labs-code/design.md) design
systems and generates a UIKit spec. State lives in a single Zustand store
(`lib/store.ts`); all domain logic is under `lib/`; the UI is under `components/`;
routes and API are under `app/`. A Claude Code agent layer lives under `.claude/`.
ESM throughout, TypeScript 6, **Node ≥ 26.4.0**.

## Setup & commands

```bash
npm install
npm run dev      # next dev — http://localhost:3000 (one dev server per project; Next 16 enforces it)
npm run build    # next build (production; also typechecks)
npm run start    # serve the production build
npm run lint     # eslint .
```

**Gotchas**
- `eslint` is **not currently installed** in `node_modules` — `npm run lint` fails
  with "eslint: command not found" until you `npm install` it. Until then, validate
  with `npx tsc --noEmit` and `npm run build`.
- Next 16 allows only one `next dev` per project directory; a second `start` exits
  with "Another next dev server is already running."
- Skill scripts are `.mjs` (standalone Node); syntax-check with `node --check <file>`.

## Architecture map

| Area | Path | Notes |
| --- | --- | --- |
| Routes / pages | `app/{brandbook,uikit,layouts,export}/`, `app/page.tsx` | `/` is the token editor (step 2). |
| API routes | `app/api/design/{save,lint,load,from-tokens}/`, `app/api/uikit/spec/` | `runtime = "nodejs"`; write to `output/`. |
| Editor state | `lib/store.ts` | Zustand, persisted to localStorage; `docs` rebuilt on rehydrate. |
| Token model | `lib/designmd/types.ts` | `DesignDoc`, `ComponentToken`, canonical sections. |
| Parse / serialize | `lib/designmd/{parse,serialize}.ts` | Round-trip `DESIGN.md`. |
| Tokens → CSS / export | `lib/designmd/{tokens,export}.ts` | CSS vars, Tailwind `@theme`, DTCG JSON. |
| Lint / CLI | `lib/designmd/cli.ts` | `@google/design.md` CLI with in-process fallback. |
| Paths / signal | `lib/designmd/paths.ts` | `outputDir`, `uikitSpecPath`, `uikitReadyPath`, `uikitDir`. |
| UIKit | `lib/uikit/{catalog,spec}.ts`, `components/uikit/*` | 8 categories; `generateSpec` + `TECH_GUIDANCE`. |
| Layouts | `lib/layouts/catalog.ts`, `components/layouts/*` | page + component kinds. |
| Templates | `lib/templates/*` | code-generated agent/skill/best-practice/UIKit-starter + dependency-free zip. |
| AI agents / skills | `.claude/agents/*`, `.claude/skills/*`, `.claude/best-practices/*` | runtime agents (Sonnet). |

## Conventions

- **TypeScript + `@/` path alias** (`@/lib/...`, `@/components/...`).
- **Client/server boundary**: files using the browser (store, downloads, the
  editor) start with `"use client"`. API routes set `export const runtime = "nodejs"`.
- **Tokens are the only source of truth** for color/type/radius/spacing. Never
  hard-code hex/px-radius/font names in components or generated output; reference
  tokens (`{group.token}`). See `.claude/best-practices/shared/design-tokens.md`.
- **Deterministic generators** use line-array string builders (see `lib/uikit/spec.ts`
  and `lib/templates/*`). Keep them pure (no `Date.now()`/randomness) where output
  must be reproducible.
- **Keep generators and committed assets in sync**: `lib/templates/best-practices.ts`
  is the source of truth that mirrors `.claude/best-practices/*`; `lib/templates/docs.ts`
  mirrors `docs/AI-AGENTS.md`. Edit both together.
- New runtime agents use frontmatter `name`, `description`, `model: sonnet`, `tools:`.
  Skills use `name`, `description`, `version`, `user-invocable`, `argument-hint`,
  `allowed-tools`, with `reference/` (checklists) and `scripts/` (`.mjs`).

## graphify (required)

A knowledge graph exists at `graphify-out/`. Per `CLAUDE.md` and the PreToolUse hooks:

- Run `graphify query "<question>"` (or `explain` / `path`) **before** grepping or
  reading source files — it returns a scoped subgraph.
- Use `graphify-out/wiki/index.md` for broad navigation; `GRAPH_REPORT.md` for
  architecture review.
- After modifying code, run **`graphify update .`** to keep the graph current
  (AST-only, no API cost).

## Adding things

- **Component**: add it to its category in `lib/uikit/catalog.ts`, add a live
  preview in `components/uikit/previews/<category>.tsx` and register it in
  `components/uikit/previews/index.tsx`.
- **Layout**: add it to `lib/layouts/catalog.ts` (set `kind: "page" | "component"`)
  and a preview under `components/layouts/previews/`.
- **API route**: create `app/api/.../route.ts` with `export const runtime = "nodejs"`;
  reuse `lib/designmd/{serialize,parse,paths}.ts`.
- **Template / best practice**: edit `lib/templates/*` (and mirror the committed
  `.claude/best-practices/*` file). The Export download picks it up automatically.

## Testing & verification

No formal test runner is configured. Validate changes with:

- `npx tsc --noEmit` — type safety.
- `npm run build` — full compile of routes + client bundle.
- `node --check .claude/skills/**/scripts/*.mjs` — skill-script syntax.
- Manual E2E for the agent pipeline: start the dev server, POST to
  `/api/uikit/spec`, confirm `output/.uikit-ready.json` is written with a fresh
  `runId`, and that the Export `.zip` download produces a valid archive. Back up
  and restore any `output/` files you touch.
- Run `graphify update .` after code changes.
