"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { brandGradients } from "@/lib/designmd/color";

export function Gradients() {
  const schemeColors = useEditor((s) => s.brandbook.schemeColors);
  const angle = useEditor((s) => s.brandbook.gradients?.angle ?? 135);
  const setGradientAngle = useEditor((s) => s.setGradientAngle);
  const [copied, setCopied] = useState<string | null>(null);

  const gradients = brandGradients(schemeColors, angle);

  const copy = (css: string) => {
    navigator.clipboard?.writeText(css);
    setCopied(css);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-xs text-app-muted">Angle · {angle}°</span>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => setGradientAngle(Number(e.target.value))}
          className="w-full accent-app-accent"
        />
      </label>

      <div className="grid grid-cols-2 @2xl:grid-cols-3 gap-3">
        {gradients.map((g) => (
          <button
            key={g.label}
            type="button"
            onClick={() => copy(g.css)}
            className="text-left rounded-lg overflow-hidden border border-app-border group"
            title="Click to copy CSS"
          >
            <div className="h-20" style={{ background: g.css }} />
            <div className="px-2 py-1.5 bg-app-panel-2">
              <div className="text-[11px] text-app-text truncate">{g.label}</div>
              <div className="text-[9px] font-mono text-app-muted truncate">
                {copied === g.css ? "copied ✓" : g.css}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
