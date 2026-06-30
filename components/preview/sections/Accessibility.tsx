"use client";

import { color } from "@/lib/designmd/tokens";
import { contrastRatio, wcagLevel } from "@/lib/designmd/contrast";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

const PAIRS: { fg: string; bg: string; label: string }[] = [
  { fg: "on-primary", bg: "primary", label: "Text on primary" },
  { fg: "on-secondary", bg: "secondary", label: "Text on secondary" },
  { fg: "on-surface", bg: "surface", label: "Body on surface" },
  { fg: "on-surface-variant", bg: "surface", label: "Muted on surface" },
  { fg: "on-error", bg: "error", label: "Text on error" },
];

const LEVEL_COLOR: Record<string, string> = {
  AAA: "#3fb950",
  AA: "#3fb950",
  "AA Large": "#ffb454",
  fail: "#ff6b6b",
};

export function AccessibilitySection({ doc }: SectionProps) {
  const rows = PAIRS.filter((p) => doc.colors[p.fg] && doc.colors[p.bg]).map((p) => {
    const fg = color(doc, p.fg);
    const bg = color(doc, p.bg);
    const ratio = contrastRatio(fg, bg);
    return { ...p, fg, bg, ratio };
  });

  return (
    <Block>
      <SectionHeader index="21" kicker="Accessibility" title="Color contrast" />
      <div className="rounded-lg overflow-hidden" style={hairline()}>
        {rows.map((r, i) => {
          const level = r.ratio !== null ? wcagLevel(r.ratio) : null;
          return (
            <div
              key={r.label}
              className="flex items-center gap-3 px-3 py-2"
              style={{
                borderTop:
                  i === 0
                    ? "none"
                    : "1px solid color-mix(in srgb, var(--dmd-color-on-background) 10%, transparent)",
              }}
            >
              <span
                className="inline-flex items-center justify-center text-xs font-medium shrink-0"
                style={{ background: r.bg, color: r.fg, width: 64, height: 28, borderRadius: 6 }}
              >
                Aa
              </span>
              <span className="text-[12px] flex-1">{r.label}</span>
              {r.ratio !== null && level ? (
                <span className="text-[11px] font-mono" style={{ color: LEVEL_COLOR[level] }}>
                  {r.ratio.toFixed(2)}:1 · {level}
                </span>
              ) : (
                <span className="text-[11px] opacity-40">—</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[12px] mt-3 opacity-60">
        Body text targets WCAG AA (4.5:1); large text and UI, AA Large (3:1).
      </p>
    </Block>
  );
}
