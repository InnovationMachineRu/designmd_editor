import type { TemplateContext, TemplateFile } from "./types";
import { agentFiles } from "./agents";
import { skillFiles } from "./skills";
import { bestPracticesFiles } from "./best-practices";
import { uikitStarterFiles } from "./uikit-starter";
import { AI_AGENTS_GUIDE } from "./docs";
import { zipToBlob } from "./zip";

const BUNDLE_README = `# AI Agents bundle

Drop this into a project to run the DESIGN.md → UIKit agents there.

Contents:
- \`.claude/agents/\` — uikit-studio, design-importer (Sonnet).
- \`.claude/skills/\` — uikit-orchestrator, build-uikit, design-importer.
- \`.claude/best-practices/\` — editable per-framework + shared guidance.
- \`docs/AI-AGENTS.md\` — the full usage guide.
- \`uikit-starter/\` — a framework-specific UIKit starter for your current selections.

See \`docs/AI-AGENTS.md\` to get started.
`;

/**
 * Build every template file for the download bundle, parameterized by the
 * current design doc + selections. Paths are relative to the zip root.
 */
export function buildTemplateBundle(ctx: TemplateContext): TemplateFile[] {
  return [
    { path: "README.md", contents: BUNDLE_README },
    { path: "docs/AI-AGENTS.md", contents: AI_AGENTS_GUIDE },
    ...agentFiles(),
    ...skillFiles(),
    ...bestPracticesFiles(),
    ...uikitStarterFiles(ctx, "uikit-starter"),
  ];
}

/** Build the downloadable ZIP Blob for the template bundle. */
export function bundleToZip(files: TemplateFile[]): Blob {
  return zipToBlob(files);
}
