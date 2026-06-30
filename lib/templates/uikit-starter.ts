import type { TemplateContext, TemplateFile } from "./types";
import { docToCssVarsBlock } from "@/lib/designmd/export";
import { serializeDesignDoc } from "@/lib/designmd/serialize";
import { TECH_LABEL, frameworkBestPractices, sharedBestPractices } from "./best-practices";
import { interfaceBuilderAgent } from "./agents";
import { embeddedSkills } from "./skills";

// Deterministic boilerplate for a generated UIKit repo. The agent fills in the
// actual component/layout/page source on top of this skeleton.

function slug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "uikit"
  );
}

function packageJson(ctx: TemplateContext): string {
  const name = `${slug(ctx.doc.name)}-uikit`;
  const common = {
    name,
    version: "0.1.0",
    private: true,
    type: "module",
  };
  const byTech: Record<string, { scripts: Record<string, string>; deps: Record<string, string> }> = {
    react: {
      scripts: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "vitest" },
      deps: { react: "^19.0.0", "react-dom": "^19.0.0" },
    },
    vue: {
      scripts: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "vitest" },
      deps: { vue: "^3.5.0" },
    },
    svelte: {
      scripts: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "vitest" },
      deps: { svelte: "^5.0.0" },
    },
    angular: {
      scripts: { dev: "ng serve", build: "ng build", storybook: "storybook dev -p 6006", test: "ng test" },
      deps: { "@angular/core": "^18.0.0" },
    },
    "web-components": {
      scripts: { dev: "vite", build: "vite build", storybook: "storybook dev -p 6006", test: "web-test-runner" },
      deps: {},
    },
  };
  const t = byTech[ctx.tech] ?? byTech.react;
  return JSON.stringify(
    {
      ...common,
      scripts: { ...t.scripts, preview: "vite preview" },
      dependencies: t.deps,
    },
    null,
    2
  );
}

function readme(ctx: TemplateContext): string {
  const label = TECH_LABEL[ctx.tech] ?? ctx.tech;
  return `# ${ctx.doc.name} — UIKit (${label})

Generated from DESIGN.md + UIKIT-SPEC.md.

## Structure
- \`src/components/<category>/<component>/\` — source + story + doc per component
- \`src/layouts/\`, \`src/pages/\` — layouts and base pages
- \`preview/\` — categorized Preview app with copy-code per component
- \`design-tokens.css\` — CSS custom properties from the design system
- \`.storybook/\` — Storybook config
- \`tests/e2e/\` — end-to-end tests
- \`.claude/\` — embedded agents + skills (interface-builder, e2e, a11y, perf)

## Run
\`\`\`
npm install
npm run dev          # preview
npm run storybook    # component explorer
npm test             # tests
\`\`\`

## Build complex interfaces
Use the embedded \`interface-builder\` agent: it clarifies the interface's purpose,
proposes a component set, then implements it with this UIKit and verifies
accessibility and performance.
`;
}

const GITIGNORE = `node_modules
dist
storybook-static
.DS_Store
*.log
`;

/** Generate the deterministic UIKit starter files under `prefix`. */
export function uikitStarterFiles(ctx: TemplateContext, prefix: string): TemplateFile[] {
  const p = (rel: string) => `${prefix}/${rel}`;
  const files: TemplateFile[] = [
    { path: p("package.json"), contents: packageJson(ctx) },
    { path: p("README.md"), contents: readme(ctx) },
    { path: p(".gitignore"), contents: GITIGNORE },
    { path: p("DESIGN.md"), contents: serializeDesignDoc(ctx.doc) },
    {
      path: p("design-tokens.css"),
      contents: `/* Generated from ${ctx.doc.name} design tokens. */\n${docToCssVarsBlock(ctx.doc)}\n`,
    },
    {
      path: p("BUILD-NOTES.md"),
      contents: buildNotes(ctx),
    },
  ];

  // Embedded .claude/ toolkit
  files.push({
    path: p(".claude/agents/interface-builder.md"),
    contents: interfaceBuilderAgent(ctx),
  });
  for (const f of embeddedSkills(ctx)) {
    files.push({ path: p(f.path), contents: f.contents });
  }
  files.push(
    { path: p(".claude/best-practices/framework.md"), contents: frameworkBestPractices(ctx.tech) },
    { path: p(".claude/best-practices/shared/accessibility.md"), contents: sharedBestPractices("accessibility") },
    { path: p(".claude/best-practices/shared/performance.md"), contents: sharedBestPractices("performance") },
    { path: p(".claude/best-practices/shared/testing.md"), contents: sharedBestPractices("testing") },
    { path: p(".claude/best-practices/shared/design-tokens.md"), contents: sharedBestPractices("design-tokens") }
  );
  return files;
}

function buildNotes(ctx: TemplateContext): string {
  const comps = ctx.components.length ? ctx.components.join(", ") : "(none selected)";
  const lays = ctx.layouts.length ? ctx.layouts.join(", ") : "(none selected)";
  return `# Build notes

Target technology: **${TECH_LABEL[ctx.tech] ?? ctx.tech}**

## Components to implement (${ctx.components.length})
${comps}

## Layouts & pages to implement (${ctx.layouts.length})
${lays}

## Authoring checklist
- [ ] Every component above has source + story + markdown doc.
- [ ] All states and variants covered.
- [ ] Tokens-only — no hard-coded color, radius, or font.
- [ ] Every layout + page-kind base page implemented.
- [ ] Mobile-first responsive per DESIGN breakpoints.
- [ ] Preview app groups by category with working copy-code.
- [ ] e2e tests, a11y check, and perf check pass.
`;
}
