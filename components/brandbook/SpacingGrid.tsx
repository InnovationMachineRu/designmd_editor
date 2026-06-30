"use client";

import { useEditor } from "@/lib/store";
import { resolveValue } from "@/lib/designmd/tokens";

const DENSITIES: { id: "compact" | "comfortable" | "spacious"; unit: number }[] = [
  { id: "compact", unit: 4 },
  { id: "comfortable", unit: 8 },
  { id: "spacious", unit: 12 },
];

export function SpacingGrid() {
  const density = useEditor((s) => s.brandbook.spacing?.density ?? "comfortable");
  const doc = useEditor((s) => s.docs[s.theme]);
  const setDensity = useEditor((s) => s.setDensity);

  const unit = DENSITIES.find((d) => d.id === density)?.unit ?? 8;

  const entries = Object.entries(doc.spacing).map(([k, v]) => ({
    key: k,
    value: resolveValue(doc, String(v)) ?? String(v),
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {DENSITIES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDensity(d.id)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
              density === d.id
                ? "border-app-accent bg-app-panel-2 text-app-text"
                : "border-app-border text-app-muted hover:text-app-text"
            }`}
          >
            {d.id}
            <span className="block text-[10px] text-app-muted">{d.unit}px base</span>
          </button>
        ))}
      </div>

      {/* Spacing scale bars */}
      <div className="space-y-1.5">
        {entries.map((e) => {
          const px = parseFloat(e.value) || 0;
          return (
            <div key={e.key} className="flex items-center gap-3">
              <span className="text-[11px] text-app-muted w-36 shrink-0 truncate">{e.key}</span>
              <span
                className="h-3 rounded bg-app-accent"
                style={{ width: Math.min(px * 3, 280) }}
              />
              <span className="text-[10px] font-mono text-app-muted">{e.value}</span>
            </div>
          );
        })}
      </div>

      {/* Grid preview */}
      <div>
        <div className="text-xs text-app-muted mb-1.5">12-column grid · {unit}px gutter</div>
        <div className="grid grid-cols-12 rounded-lg overflow-hidden border border-app-border" style={{ gap: unit / 2 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-10 bg-app-accent/25" />
          ))}
        </div>
      </div>
    </div>
  );
}
