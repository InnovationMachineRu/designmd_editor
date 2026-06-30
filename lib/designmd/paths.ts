import { join } from "node:path";

/** Directory where generated artifacts are written (configurable via env). */
export function outputDir(): string {
  return process.env.DMD_OUTPUT_DIR
    ? process.env.DMD_OUTPUT_DIR
    : join(process.cwd(), "output");
}

export function designFilePath(): string {
  return join(outputDir(), "DESIGN.md");
}

export function uikitSpecPath(): string {
  return join(outputDir(), "UIKIT-SPEC.md");
}
