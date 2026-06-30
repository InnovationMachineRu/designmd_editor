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

/**
 * Sentinel file written when a UIKit spec export completes. The orchestrator
 * agent polls this file's `runId` to detect a fresh export deterministically.
 */
export function uikitReadyPath(): string {
  return join(outputDir(), ".uikit-ready.json");
}

/**
 * Default target directory for the generated UIKit repo (configurable via env).
 * The build-uikit skill suggests this path but asks the user to confirm per run.
 */
export function uikitDir(): string {
  return process.env.DMD_UIKIT_DIR
    ? process.env.DMD_UIKIT_DIR
    : join(outputDir(), "uikit");
}
