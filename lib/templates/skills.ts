import type { TemplateContext, TemplateFile } from "./types";
import { TECH_LABEL } from "./best-practices";

// Portable SKILL.md copies for the download bundle. Live working copies (with
// full reference/ + scripts/ trees) live under `.claude/skills/`.

const ORCHESTRATOR = `---
name: uikit-orchestrator
description: Launch the design-system dev server, guide the user through the wizard phases deterministically, detect the UIKit export signal, and stop the server.
version: 1.0.0
user-invocable: true
argument-hint: "[start|wait|stop|run]"
allowed-tools:
  - Bash(node .claude/skills/uikit-orchestrator/scripts/*)
  - Bash(npm run dev)
  - Read
---

Deterministic dev-server lifecycle + phase guidance + export detection.

## Setup
Read \`reference/signal.md\` (the \`.uikit-ready.json\` contract) and
\`reference/phases.md\` (per-phase checklists) before acting.

## Steps
1. **start** — \`node .claude/skills/uikit-orchestrator/scripts/dev-server.mjs start\`.
   Print the URL. Record the baseline runId from \`output/.uikit-ready.json\` (or "absent").
2. **guide** — Walk the user through Brandbook → Design system → UIKit → Layouts →
   Export, one phase at a time, using the checklists in \`reference/phases.md\`.
3. **wait** — \`node .claude/skills/uikit-orchestrator/scripts/wait-ready.mjs\`.
   It blocks until the runId changes, then prints the payload JSON.
4. **stop** — \`node .claude/skills/uikit-orchestrator/scripts/dev-server.mjs stop\`.
   Confirm the process is gone and the port is free.

## Failure handling
- Port in use → report the PID; offer to stop the stale server.
- Stale PID file → \`status\` reconciles it.
- wait timeout → tell the user the export was not detected; do not proceed to build.
`;

const BUILD_UIKIT = `---
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
1. Ask the user for the target output path (suggest \`output/uikit/\` or \`DMD_UIKIT_DIR\`).
2. Read \`output/UIKIT-SPEC.md\` and \`output/DESIGN.md\` (the source of truth).
3. Read the matching \`reference/per-framework/<tech>.md\` and the relevant
   \`.claude/best-practices/*\` files.
4. Read \`reference/repo-tree.md\`, \`reference/storybook.md\`, \`reference/preview-app.md\`,
   \`reference/docs.md\`, \`reference/embedded-claude.md\`, and \`reference/checklists.md\`.

## Steps
1. **Boilerplate (deterministic)** — \`node .claude/skills/build-uikit/scripts/scaffold.mjs <target>\`
   creates the tree, copies DESIGN.md/UIKIT-SPEC.md, writes package.json, token CSS,
   Storybook config, and the embedded \`.claude/\`.
2. **Components (authored)** — for each selected component, write source + story + doc,
   covering every state and variant, tokens-only.
3. **Layouts & pages (authored)** — write every selected layout and every page-kind base page.
4. **Preview app** — components grouped by category, each with copy-code-per-component.
5. **Verify** — \`npm install\` && build && Storybook build; fix until green.

See \`reference/checklists.md\` for the exhaustive checklist.
`;

const DESIGN_IMPORTER_SKILL = `---
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

Two modes: \`url <url>\` and \`catalog [path=./input]\`.

## Setup
Read \`reference/designmd-format.md\` (the exact schema) first. Then read
\`reference/from-url.md\` or \`reference/from-catalog.md\` for the chosen mode, and
\`reference/import-into-app.md\` for landing the result.

## Steps
1. Extract palette, fonts, radius, spacing from the source (computed styles for URL;
   images + \`.css\` via \`scripts/extract-css.mjs\` for catalog).
2. Map colors to roles with accessible on-colors; map fonts → typography,
   radius → rounded, padding → spacing.
3. Author valid front-matter + canonical sections.
4. Write \`output/DESIGN.md\`; lint and fix until clean.
5. Import/merge into the app (ImportDialog or the load route).

Follow the per-mode checklists in the reference files.
`;

/** SKILL.md strings for the embedded UIKit toolkit. */
function embeddedSkills(ctx: TemplateContext): TemplateFile[] {
  const tech = ctx.tech;
  const label = TECH_LABEL[tech] ?? tech;
  const base = ".claude/skills";
  return [
    {
      path: `${base}/interface-builder/SKILL.md`,
      contents: `---
name: interface-builder
description: Assemble a complex interface from this UIKit — clarify purpose, propose a component set, implement, and verify a11y + performance.
version: 1.0.0
user-invocable: true
argument-hint: "[purpose]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Skill
---

Compose interfaces from this UIKit (${label}).

## Steps (do not skip the questions)
1. Clarify the purpose (marketing, landing, LMS, CRM, Project Management,
   Product Management, educational org, corporate, dashboard, e-commerce).
2. Propose a concrete component + layout + page set; get confirmation.
3. Implement screens from UIKit parts only (tokens-only, no hard-coded values).
4. Run \`generate-e2e-tests\`, then \`a11y-check\` and \`perf-check\`; fix findings.
`,
    },
    {
      path: `${base}/generate-e2e-tests/SKILL.md`,
      contents: `---
name: generate-e2e-tests
description: Generate end-to-end tests (Playwright by default) for the interfaces built with this UIKit, derived from user journeys.
version: 1.0.0
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash(npx playwright *)
  - Bash(npm test*)
---

## Steps
1. List the user journeys for the interface (who → does what → expects what).
2. Write one spec per journey under \`tests/e2e/\`; assert on roles/labels.
3. Cover happy path + at least one error/edge path per journey.
4. Run the suite; iterate until green.
`,
    },
    {
      path: `${base}/a11y-check/SKILL.md`,
      contents: `---
name: a11y-check
description: Audit the UIKit preview / built interfaces for accessibility (WCAG 2.2 AA) using the Chrome DevTools MCP.
version: 1.0.0
user-invocable: true
allowed-tools:
  - Read
---

Uses Chrome DevTools MCP tools: \`mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page\`,
\`__take_snapshot\`, \`__emulate\`, \`__take_screenshot\`, \`__list_console_messages\`,
\`__lighthouse_audit\`.

## Steps
1. Navigate to the preview URL; take an accessibility snapshot.
2. Check roles/labels/focus order/contrast/hit targets/reduced-motion.
3. Run a lighthouse accessibility audit; record findings with screenshots.
4. Report failures with fixes; re-run after fixes.

Follow \`.claude/best-practices/shared/accessibility.md\`.
`,
    },
    {
      path: `${base}/perf-check/SKILL.md`,
      contents: `---
name: perf-check
description: Measure and improve Core Web Vitals for the UIKit preview / built interfaces using the Chrome DevTools MCP.
version: 1.0.0
user-invocable: true
allowed-tools:
  - Read
---

Uses Chrome DevTools MCP tools: \`mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_start_trace\`,
\`__performance_stop_trace\`, \`__performance_analyze_insight\`, \`__lighthouse_audit\`.

## Steps
1. Start a trace, exercise the page, stop the trace.
2. Analyze the top insights; run a lighthouse performance audit.
3. Fix the largest opportunities; record before/after LCP/CLS/INP.

Follow \`.claude/best-practices/shared/performance.md\`.
`,
    },
    {
      path: `${base}/${tech}-component/SKILL.md`,
      contents: `---
name: ${tech}-component
description: Author a new ${label} component for this UIKit following the framework best practices and design tokens.
version: 1.0.0
user-invocable: true
argument-hint: "<component-name>"
allowed-tools:
  - Read
  - Write
  - Edit
---

Author idiomatic ${label} components for this UIKit.

## Steps
1. Read \`.claude/best-practices/framework.md\` and \`.claude/best-practices/shared/design-tokens.md\`.
2. Create source + story + markdown doc; cover all states & variants.
3. Tokens-only (no hard-coded color/radius/font); honor reduced-motion.
4. Add it to the Preview app under its category with copy-code.
`,
    },
  ];
}

/** Top-level skill SKILL.md files for the download bundle. */
export function skillFiles(prefix = ".claude/skills"): TemplateFile[] {
  return [
    { path: `${prefix}/uikit-orchestrator/SKILL.md`, contents: ORCHESTRATOR },
    { path: `${prefix}/build-uikit/SKILL.md`, contents: BUILD_UIKIT },
    { path: `${prefix}/design-importer/SKILL.md`, contents: DESIGN_IMPORTER_SKILL },
  ];
}

export { embeddedSkills, ORCHESTRATOR, BUILD_UIKIT, DESIGN_IMPORTER_SKILL };
