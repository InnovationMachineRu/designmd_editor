import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { DesignDoc, LintFinding, LintResult } from "./types";
import { resolveValue } from "./tokens";

/**
 * Locate the @google/design.md CLI entrypoint. The package only declares an
 * "import" export condition, so require.resolve can't see it from a CJS context;
 * we resolve the dist path directly from node_modules instead.
 */
function cliPath(): string | null {
  const candidates = [
    join(process.cwd(), "node_modules", "@google", "design.md", "dist", "index.js"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

interface RunResult {
  stdout: string;
  stderr: string;
  code: number | null;
}

/** Run a node script, capturing stdout even on a non-zero exit code. */
function run(script: string, args: string[]): Promise<RunResult> {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [script, ...args],
      { timeout: 20_000, maxBuffer: 8 * 1024 * 1024 },
      (err, stdout, stderr) => {
        const code =
          err && typeof (err as { code?: unknown }).code === "number"
            ? ((err as { code: number }).code)
            : 0;
        resolve({ stdout: stdout ?? "", stderr: stderr ?? "", code });
      }
    );
  });
}

/**
 * Lint a DESIGN.md file with the real @google/design.md CLI. Falls back to a
 * lightweight in-process linter when the CLI is unavailable or unparseable.
 */
export async function lintFile(filePath: string, doc?: DesignDoc): Promise<LintResult> {
  const cli = cliPath();
  if (cli) {
    const { stdout } = await run(cli, ["lint", filePath, "--format", "json"]);
    const parsed = tryParse(stdout);
    if (parsed) return { ...parsed, source: "cli" };
  }
  // Fallback: validate the in-memory doc if provided.
  return { ...fallbackLint(doc), source: "fallback" };
}

/** Export tokens via the CLI (css-tailwind | json-tailwind | dtcg). */
export async function exportTokens(
  filePath: string,
  format: "css-tailwind" | "json-tailwind" | "dtcg"
): Promise<string | null> {
  const cli = cliPath();
  if (!cli) return null;
  const { stdout, code } = await run(cli, ["export", filePath, "--format", format]);
  return code === 0 ? stdout : null;
}

function tryParse(stdout: string): Omit<LintResult, "source"> | null {
  const start = stdout.indexOf("{");
  if (start === -1) return null;
  try {
    const obj = JSON.parse(stdout.slice(start));
    if (Array.isArray(obj.findings) && obj.summary) {
      return { findings: obj.findings as LintFinding[], summary: obj.summary };
    }
  } catch {
    /* fall through */
  }
  return null;
}

/** Minimal JS linter used only when the CLI cannot run. */
function fallbackLint(doc?: DesignDoc): Omit<LintResult, "source"> {
  const findings: LintFinding[] = [];
  if (!doc) {
    findings.push({ severity: "warning", message: "No document to validate." });
    return { findings, summary: { errors: 0, warnings: 1, infos: 0 } };
  }

  // Unresolved component references.
  for (const [name, comp] of Object.entries(doc.components)) {
    for (const [prop, value] of Object.entries(comp)) {
      if (typeof value === "string" && /^\{.+\}$/.test(value.trim())) {
        if (resolveValue(doc, value) === undefined) {
          findings.push({
            severity: "error",
            path: `components.${name}.${prop}`,
            message: `Reference ${value} does not resolve to any defined token.`,
          });
        }
      }
    }
  }

  if (!doc.colors.primary) {
    findings.push({ severity: "warning", message: "No `primary` color token defined." });
  }
  if (Object.keys(doc.typography).length === 0) {
    findings.push({ severity: "warning", message: "No typography scales defined." });
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;
  return { findings, summary: { errors, warnings, infos: 0 } };
}
