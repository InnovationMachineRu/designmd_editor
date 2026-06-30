#!/usr/bin/env node
// Deterministic UIKit boilerplate. The agent authors components/layouts/pages
// on top of this skeleton.
// Usage: node scaffold.mjs <target-path>
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";

const target = process.argv[2];
if (!target) {
  console.error("Usage: scaffold.mjs <target-path>");
  process.exit(1);
}

const repoRoot = process.cwd();
const outputDir = process.env.DMD_OUTPUT_DIR || join(repoRoot, "output");
const designSrc = join(outputDir, "DESIGN.md");
const specSrc = join(outputDir, "UIKIT-SPEC.md");
const readyFile = join(outputDir, ".uikit-ready.json");

let ready = { tech: "react", components: [], layouts: [] };
if (existsSync(readyFile)) {
  try {
    ready = { ...ready, ...JSON.parse(readFileSync(readyFile, "utf8")) };
  } catch {
    /* keep defaults */
  }
}
const tech = ready.tech || "react";

const TECH_LABEL = {
  react: "React + TypeScript",
  "web-components": "Web Components",
  vue: "Vue 3",
  angular: "Angular",
  svelte: "Svelte 5",
};

function write(rel, contents) {
  const p = join(target, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, contents);
}
function ensureDir(rel) {
  mkdirSync(join(target, rel), { recursive: true });
}
function copyIfExists(src, rel) {
  if (existsSync(src)) {
    const p = join(target, rel);
    mkdirSync(dirname(p), { recursive: true });
    copyFileSync(src, p);
  }
}

// --- directory skeleton ---
for (const d of [
  "src/tokens",
  "src/components",
  "src/layouts",
  "src/pages",
  "preview",
  "tests/e2e",
  ".storybook",
  ".claude/agents",
  ".claude/best-practices/shared",
]) {
  ensureDir(d);
}

// --- copied source-of-truth ---
copyIfExists(designSrc, "DESIGN.md");
copyIfExists(specSrc, "UIKIT-SPEC.md");

// --- package.json (tech-aware) ---
const scriptsByTech = {
  react: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "vitest" },
  vue: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "vitest" },
  svelte: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "vitest" },
  angular: { dev: "ng serve", build: "ng build", storybook: "storybook dev -p 6006", test: "ng test" },
  "web-components": { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "web-test-runner" },
};
const depsByTech = {
  react: { react: "^19.0.0", "react-dom": "^19.0.0" },
  vue: { vue: "^3.5.0" },
  svelte: { svelte: "^5.0.0" },
  angular: { "@angular/core": "^18.0.0" },
  "web-components": {},
};
write(
  "package.json",
  JSON.stringify(
    {
      name: `${(ready.designName || "designmd").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-uikit`,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: { ...(scriptsByTech[tech] || scriptsByTech.react), preview: "vite preview" },
      dependencies: depsByTech[tech] || depsByTech.react,
    },
    null,
    2
  )
);

write(".gitignore", "node_modules\ndist\nstorybook-static\n.DS_Store\n*.log\n");

write(
  "README.md",
  `# UIKit (${TECH_LABEL[tech] || tech})\n\nGenerated from DESIGN.md + UIKIT-SPEC.md.\n\n` +
    "Run:\n```\nnpm install\nnpm run dev\nnpm run storybook\nnpm test\n```\n\n" +
    "Use the embedded `interface-builder` agent in `.claude/agents/` to assemble interfaces.\n"
);

write(
  "BUILD-NOTES.md",
  `# Build notes\n\nTarget technology: **${TECH_LABEL[tech] || tech}**\n\n` +
    `## Components to implement (${ready.components.length})\n${ready.components.join(", ") || "(none)"}\n\n` +
    `## Layouts & pages to implement (${ready.layouts.length})\n${ready.layouts.join(", ") || "(none)"}\n\n` +
    "Author source + story + doc per component (all states/variants, tokens-only),\n" +
    "every layout + page-kind base page, the Preview app, and e2e/a11y/perf coverage.\n"
);

write(
  "design-tokens.css",
  `/* TODO: the build-uikit skill fills this from DESIGN.md front-matter (light + dark). */\n:root {\n}\n`
);

// --- embedded .claude/ best practices (copied from this repo) ---
const bpRoot = join(repoRoot, ".claude", "best-practices");
copyIfExists(join(bpRoot, "frameworks", `${tech}.md`), ".claude/best-practices/framework.md");
for (const s of ["accessibility", "performance", "testing", "design-tokens"]) {
  copyIfExists(join(bpRoot, "shared", `${s}.md`), `.claude/best-practices/shared/${s}.md`);
}

// --- embedded interface-builder agent ---
write(
  ".claude/agents/interface-builder.md",
  `---
name: interface-builder
description: Assemble a complex interface from this UIKit — clarify purpose, propose a component set, implement, verify a11y + perf.
model: sonnet
tools: Bash, Read, Write, Edit, Glob, Grep, Skill
---

Build interfaces from this UIKit (${TECH_LABEL[tech] || tech}). Compose from
src/components, src/layouts, src/pages — never reinvent primitives.

## Phase 1 — Clarify (ask first)
Purpose? marketing, landing, LMS, CRM, Project Management, Product Management,
educational organization, corporate, dashboard, e-commerce.

## Phase 2 — Propose a set
Propose components + layouts + pages; get confirmation before writing code.

## Phase 3 — Implement & verify
Implement from UIKit parts (tokens-only). Run generate-e2e-tests, a11y-check, perf-check.

## Checklist
- [ ] Purpose clarified  - [ ] Set confirmed  - [ ] Implemented from UIKit only
- [ ] e2e passing  - [ ] a11y clean  - [ ] perf within budgets
`
);

// --- embedded skills ---
const skill = (name, fm, body) =>
  write(`.claude/skills/${name}/SKILL.md`, `---\n${fm}\n---\n\n${body}\n`);

skill(
  "interface-builder",
  `name: interface-builder\ndescription: Assemble a complex interface from this UIKit.\nversion: 1.0.0\nuser-invocable: true\nallowed-tools:\n  - Read\n  - Write\n  - Edit\n  - Glob\n  - Grep\n  - Skill`,
  "1. Clarify purpose. 2. Propose a component/layout/page set; confirm. 3. Implement from UIKit parts (tokens-only). 4. Run generate-e2e-tests, a11y-check, perf-check."
);
skill(
  "generate-e2e-tests",
  `name: generate-e2e-tests\ndescription: Generate Playwright e2e tests from user journeys.\nversion: 1.0.0\nuser-invocable: true\nallowed-tools:\n  - Read\n  - Write\n  - Bash(npx playwright *)\n  - Bash(npm test*)`,
  "List journeys (who → does what → expects what). One spec per journey under tests/e2e/, asserting on roles/labels. Cover happy + one error path. Run until green."
);
skill(
  "a11y-check",
  `name: a11y-check\ndescription: Accessibility audit (WCAG 2.2 AA) via Chrome DevTools MCP.\nversion: 1.0.0\nuser-invocable: true\nallowed-tools:\n  - Read`,
  "Use mcp__plugin_chrome-devtools-mcp_chrome-devtools__ navigate_page/take_snapshot/emulate/lighthouse_audit. Check roles, labels, focus, contrast, hit targets, reduced-motion. Follow .claude/best-practices/shared/accessibility.md."
);
skill(
  "perf-check",
  `name: perf-check\ndescription: Core Web Vitals via Chrome DevTools MCP.\nversion: 1.0.0\nuser-invocable: true\nallowed-tools:\n  - Read`,
  "Use performance_start_trace/stop_trace/performance_analyze_insight/lighthouse_audit. Target LCP<2.5s, CLS<0.1, INP<200ms. Follow .claude/best-practices/shared/performance.md."
);
skill(
  `${tech}-component`,
  `name: ${tech}-component\ndescription: Author a new ${TECH_LABEL[tech] || tech} component for this UIKit.\nversion: 1.0.0\nuser-invocable: true\nargument-hint: "<component-name>"\nallowed-tools:\n  - Read\n  - Write\n  - Edit`,
  "Read .claude/best-practices/framework.md + shared/design-tokens.md. Create source + story + doc; all states/variants; tokens-only. Add to the Preview app under its category with copy-code."
);

console.log(
  JSON.stringify({ status: "scaffolded", target, tech, components: ready.components.length, layouts: ready.layouts.length }, null, 2)
);
