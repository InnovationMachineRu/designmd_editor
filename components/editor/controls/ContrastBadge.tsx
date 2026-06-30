"use client";

import { contrastRatio, wcagLevel } from "@/lib/designmd/contrast";

const LEVEL_STYLE: Record<string, string> = {
  AAA: "text-app-ok border-app-ok/40 bg-app-ok/10",
  AA: "text-app-ok border-app-ok/40 bg-app-ok/10",
  "AA Large": "text-app-warn border-app-warn/40 bg-app-warn/10",
  fail: "text-app-danger border-app-danger/40 bg-app-danger/10",
};

/**
 * WCAG contrast badge for a foreground/background color pair. Renders nothing
 * when either color can't be parsed (e.g. oklch).
 */
export function ContrastBadge({
  fg,
  bg,
  pairLabel,
}: {
  fg: string;
  bg: string;
  pairLabel?: string;
}) {
  const ratio = contrastRatio(fg, bg);
  if (ratio === null) return null;
  const level = wcagLevel(ratio);
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-medium whitespace-nowrap ${LEVEL_STYLE[level]}`}
      title={`Contrast ${ratio.toFixed(2)}:1 vs ${pairLabel ?? "pair"} — WCAG ${level}`}
    >
      {ratio.toFixed(1)}:1 · {level}
    </span>
  );
}
