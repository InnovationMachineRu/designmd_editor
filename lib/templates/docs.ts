// The English usage guide for both AI agents. This is the canonical content;
// the committed `docs/AI-AGENTS.md` mirrors it and the download bundle embeds it.

export const AI_AGENTS_GUIDE = `# AI Agents — Usage Guide

This project ships two Claude Code agents (both run on **Sonnet**) that automate
the DESIGN.md → UIKit pipeline. This guide explains how to use them.

> All agents and skills carry detailed checklists. Run them with Claude Code in
> this repository (or in a project where you dropped the downloaded bundle).

---

## Prerequisites
- Node ≥ 26 and the app's dependencies installed (\`npm install\`).
- Claude Code with this repo open. The agents live in \`.claude/agents/\`, the
  skills in \`.claude/skills/\`, and editable best practices in \`.claude/best-practices/\`.
- For accessibility/performance checks: the **Chrome DevTools MCP** enabled.

---

## Agent 1 — UIKit Studio (\`uikit-studio\`)

Runs the whole pipeline: starts the dev server, walks you through every wizard
phase, detects when you export the UIKit requirements, stops the server, then
scaffolds a separate UIKit repository in your chosen framework.

### How it works (deterministic flow)
1. **Start** — the agent runs the dev server via the \`uikit-orchestrator\` skill
   and prints the local URL. It records the current export signal
   (\`output/.uikit-ready.json\` \`runId\`, or notes its absence) as a baseline.
2. **Guide** — it walks you through, one phase at a time, confirming each:
   - **Brandbook** (\`/brandbook\`) — identity: colors, fonts, shape, motion, voice.
   - **Design system** (\`/\`) — edit/preview tokens.
   - **UIKit** (\`/uikit\`) — pick components.
   - **Layouts** (\`/layouts\`) — pick layouts/pages.
   - **Export** (\`/export\`) — choose the target framework and click
     **"Validate & generate UIKit spec (ТЗ)"**.
3. **Signal** — clicking generate writes \`output/UIKIT-SPEC.md\` **and** the
   sentinel \`output/.uikit-ready.json\` with a new \`runId\`. The agent is waiting
   for exactly this; a changed \`runId\` is the only valid "requirements received" event.
4. **Stop** — the agent stops the dev server and confirms the port is free.
5. **Build** — it asks you where to create the UIKit (default \`output/uikit/\` or
   \`DMD_UIKIT_DIR\`), then runs the \`build-uikit\` skill.

### What \`build-uikit\` produces (selected framework only)
A standalone repo with:
- \`src/components/<category>/<component>/\` — source + Storybook story + Markdown doc
  for every selected component (all states & variants, tokens-only).
- \`src/layouts/\` and \`src/pages/\` — every selected layout and base page.
- \`preview/\` — a **UIKit Preview** app where components are grouped by category,
  each with **copy-code per component**.
- \`.storybook/\`, \`design-tokens.css\`, \`tests/e2e/\`.
- An embedded \`.claude/\` toolkit (see below).

### Run it
> "Use the uikit-studio agent to build my UIKit."

---

## The embedded UIKit toolkit (inside the generated repo)

Every generated UIKit ships with its own \`.claude/\`:
- **\`interface-builder\` agent** — builds complex interfaces from the UIKit. It
  first **asks what the interface is for** (marketing, landing, LMS, CRM, Project
  Management, Product Management, educational organization, corporate site,
  dashboard, e-commerce), then **proposes a component set to confirm**, then
  **implements** the screens using the UIKit.
- **\`generate-e2e-tests\` skill** — derives Playwright e2e tests from user journeys.
- **\`a11y-check\` skill** — WCAG 2.2 AA audit via the Chrome DevTools MCP.
- **\`perf-check\` skill** — Core Web Vitals via the Chrome DevTools MCP.
- **\`<framework>-component\` skill** — author new framework-idiomatic components.

Run inside the generated repo:
> "Use the interface-builder agent to assemble a CRM dashboard."

---

## Agent 2 — Design Importer (\`design-importer\`)

Builds a \`DESIGN.md\` from an external reference and imports it into the workflow.

### Modes
- **URL** — \`design-importer url https://example.com\`
  Extracts computed styles (palette, fonts, radius, spacing). Uses WebFetch first
  and the Chrome DevTools MCP for JS-rendered sites.
- **Catalog** — \`design-importer catalog ./input\` (default path \`./input\`)
  Reads images, screenshots, and \`.css\` files from the folder and derives tokens.

### Flow
1. Extract palette/fonts/radius/spacing from the source.
2. Map colors to roles (primary/surface/on-surface/…) with accessible on-colors.
3. Author valid front-matter + canonical sections.
4. Write \`output/DESIGN.md\` and lint until clean.
5. Import/merge into the running app (the Import dialog can load
   \`output/DESIGN.md\`), so you can continue with **uikit-studio**.

### Run it
> "Use the design-importer agent to build a DESIGN.md from https://stripe.com."
> "Use the design-importer agent on ./input."

---

## Templates download (Export step)

On the **Export** step there is a **"Download AI agents + UIKit starter (.zip)"**
button. It generates — deterministically, from your current selections — a zip
containing the \`.claude/\` agents + skills, the editable best practices, this guide,
and a UIKit starter for your chosen framework. Drop the bundle into any project to
run the same agents there.

---

## Environment variables
- \`DMD_OUTPUT_DIR\` — where \`DESIGN.md\`, \`UIKIT-SPEC.md\`, and the signal are written
  (default \`<cwd>/output\`).
- \`DMD_UIKIT_DIR\` — default suggested target for the generated UIKit (the agent still asks).
- \`PORT\` — dev server port (default 3000).

## Troubleshooting
- **Build agent never starts** — the signal wasn't detected. Confirm you clicked
  "Validate & generate UIKit spec" and that \`output/.uikit-ready.json\` exists with
  a fresh \`runId\`.
- **Port in use** — let the orchestrator's \`status\`/\`stop\` reconcile a stale server.
- **Import didn't change the preview** — the importer merges only token groups it
  found; check the lint output for low-confidence guesses.
`;
