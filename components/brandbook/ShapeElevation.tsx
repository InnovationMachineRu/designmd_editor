"use client";

import { useEditor } from "@/lib/store";
import { resolveValue } from "@/lib/designmd/tokens";

/** Shadow presets keyed by elevation level 0–4. */
const SHADOWS = [
  "none",
  "0 1px 2px rgba(0,0,0,0.12)",
  "0 2px 6px rgba(0,0,0,0.16)",
  "0 6px 16px rgba(0,0,0,0.20)",
  "0 12px 32px rgba(0,0,0,0.26)",
];

export function ShapeElevation() {
  const shape = useEditor((s) => s.brandbook.shape ?? { roundness: 1, elevation: 2 });
  const doc = useEditor((s) => s.docs[s.theme]);
  const setRoundness = useEditor((s) => s.setRoundness);
  const setElevation = useEditor((s) => s.setElevation);

  const radii = Object.entries(doc.rounded).map(([k, v]) => ({
    key: k,
    value: resolveValue(doc, v) ?? String(v),
  }));

  return (
    <div className="space-y-5">
      {/* Roundness → rounded tokens */}
      <div>
        <label className="block mb-2">
          <span className="text-xs text-app-muted">
            Roundness · ×{shape.roundness.toFixed(2)}
          </span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={shape.roundness}
            onChange={(e) => setRoundness(Number(e.target.value))}
            className="w-full accent-app-accent"
          />
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {radii.map((r) => (
            <div key={r.key} className="text-center">
              <div
                className="w-full aspect-square border-2 border-app-accent bg-app-panel-2"
                style={{ borderRadius: r.value }}
              />
              <div className="text-[10px] text-app-muted mt-1 truncate">{r.key}</div>
              <div className="text-[9px] font-mono text-app-muted">{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Elevation depth */}
      <div>
        <label className="block mb-2">
          <span className="text-xs text-app-muted">Elevation depth · {shape.elevation}</span>
          <input
            type="range"
            min={0}
            max={4}
            value={shape.elevation}
            onChange={(e) => setElevation(Number(e.target.value))}
            className="w-full accent-app-accent"
          />
        </label>
        <div className="grid grid-cols-5 gap-3 p-1">
          {SHADOWS.map((sh, i) => (
            <div key={i} className="text-center">
              <div
                className="w-full aspect-square rounded-xl bg-app-panel-2 border border-app-border transition-shadow"
                style={{
                  boxShadow: sh,
                  outline: i === shape.elevation ? "2px solid var(--color-app-accent)" : "none",
                  outlineOffset: 2,
                }}
              />
              <div className="text-[10px] text-app-muted mt-1">{i}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-app-muted mt-1">
          Roundness drives the `rounded` tokens live; elevation is stored with the brand.
        </p>
      </div>
    </div>
  );
}
