"use client";

import { useEditor } from "@/lib/store";
import { color } from "@/lib/designmd/tokens";
import { contrastRatio, wcagLevel } from "@/lib/designmd/contrast";

const FG_ROLES = [
  "on-surface",
  "on-surface-variant",
  "primary",
  "secondary",
  "tertiary",
  "accent",
  "error",
];
const BG_ROLES = ["surface", "surface-container", "background", "primary"];

const LEVEL_COLOR: Record<string, string> = {
  AAA: "var(--color-app-ok)",
  AA: "var(--color-app-ok)",
  "AA Large": "var(--color-app-warn)",
  fail: "var(--color-app-danger)",
};

/** Colorblind simulation matrices (feColorMatrix values). */
const CB_FILTERS: { id: string; label: string; values: string }[] = [
  {
    id: "cb-protanopia",
    label: "Protanopia",
    values: "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0",
  },
  {
    id: "cb-deuteranopia",
    label: "Deuteranopia",
    values: "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0",
  },
  {
    id: "cb-tritanopia",
    label: "Tritanopia",
    values: "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0",
  },
];

export function AccessibilityMatrix() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const scheme = useEditor((s) => s.brandbook.schemeColors);

  const fgRoles = FG_ROLES.filter((r) => doc.colors[r]);
  const bgRoles = BG_ROLES.filter((r) => doc.colors[r]);

  return (
    <div className="space-y-5">
      {/* Contrast grid */}
      <div className="overflow-x-auto scroll-thin">
        <table className="text-[11px] border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-left text-app-muted font-normal">fg \ bg</th>
              {bgRoles.map((bg) => (
                <th key={bg} className="p-1.5 text-app-muted font-normal whitespace-nowrap">
                  {bg}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fgRoles.map((fg) => (
              <tr key={fg}>
                <td className="p-1.5 text-app-muted whitespace-nowrap">{fg}</td>
                {bgRoles.map((bg) => {
                  const fgC = color(doc, fg);
                  const bgC = color(doc, bg);
                  const ratio = contrastRatio(fgC, bgC);
                  const level = ratio !== null ? wcagLevel(ratio) : null;
                  return (
                    <td key={bg} className="p-1">
                      <div
                        className="rounded px-1.5 py-1 text-center"
                        style={{ background: bgC, color: fgC, border: "1px solid var(--color-app-border)" }}
                        title={level ? `WCAG ${level}` : "n/a"}
                      >
                        <div className="font-semibold">Aa</div>
                        <div
                          className="text-[9px] font-mono"
                          style={{ color: level ? LEVEL_COLOR[level] : "inherit" }}
                        >
                          {ratio !== null ? `${ratio.toFixed(1)}` : "—"}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Colorblind simulation */}
      <div>
        <div className="text-xs text-app-muted mb-2">Colorblind simulation</div>
        <svg width={0} height={0} className="absolute" aria-hidden>
          <defs>
            {CB_FILTERS.map((f) => (
              <filter key={f.id} id={f.id}>
                <feColorMatrix type="matrix" values={f.values} />
              </filter>
            ))}
          </defs>
        </svg>
        <div className="space-y-1.5">
          {[{ id: "", label: "Normal" }, ...CB_FILTERS].map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <span className="text-[10px] text-app-muted w-24 shrink-0">{f.label}</span>
              <div className="flex flex-1 h-6 rounded overflow-hidden" style={f.id ? { filter: `url(#${f.id})` } : undefined}>
                {scheme.map((c, i) => (
                  <span key={i} className="flex-1" style={{ background: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
