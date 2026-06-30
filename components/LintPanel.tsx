"use client";

import type { LintResult } from "@/lib/designmd/types";

const SEVERITY_STYLE: Record<string, string> = {
  error: "text-app-danger border-app-danger/40 bg-app-danger/10",
  warning: "text-app-warn border-app-warn/40 bg-app-warn/10",
  info: "text-app-muted border-app-border bg-app-panel-2",
};

const SEVERITY_ICON: Record<string, string> = {
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export function LintPanel({ lint }: { lint: LintResult }) {
  const { findings, summary, source } = lint;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-app-text">Validation</span>
        <span className="text-app-danger">{summary.errors} errors</span>
        <span className="text-app-warn">{summary.warnings} warnings</span>
        <span className="text-app-muted">{summary.infos} info</span>
        <span
          className="ml-auto px-2 py-0.5 rounded-full border border-app-border text-app-muted"
          title={
            source === "cli"
              ? "Validated with @google/design.md CLI"
              : "CLI unavailable — validated with built-in fallback linter"
          }
        >
          {source === "cli" ? "design.md CLI" : "fallback linter"}
        </span>
      </div>

      {findings.length === 0 ? (
        <div className="text-xs text-app-ok border border-app-ok/40 bg-app-ok/10 rounded-md px-3 py-2">
          ✓ No issues found.
        </div>
      ) : (
        <ul className="space-y-1.5 max-h-48 overflow-auto scroll-thin">
          {findings.map((f, i) => (
            <li
              key={i}
              className={`text-xs border rounded-md px-3 py-2 flex gap-2 ${SEVERITY_STYLE[f.severity]}`}
            >
              <span aria-hidden>{SEVERITY_ICON[f.severity]}</span>
              <span className="flex-1">
                {f.path && <code className="font-mono opacity-80">{f.path}</code>}
                {f.path && " — "}
                {f.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
