"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";

const EASINGS: { label: string; value: string }[] = [
  { label: "Standard", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { label: "Decelerate", value: "cubic-bezier(0, 0, 0.2, 1)" },
  { label: "Accelerate", value: "cubic-bezier(0.4, 0, 1, 1)" },
  { label: "Ease in-out", value: "ease-in-out" },
  { label: "Linear", value: "linear" },
  { label: "Spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

/** Sample a cubic-bezier into an SVG path for the curve preview. */
function curvePath(easing: string): string {
  const m = easing.match(/cubic-bezier\(([^)]+)\)/);
  let p = [0.4, 0, 0.2, 1];
  if (m) p = m[1].split(",").map(Number);
  else if (easing === "linear") p = [0, 0, 1, 1];
  else if (easing === "ease-in-out") p = [0.42, 0, 0.58, 1];
  const [x1, y1, x2, y2] = p;
  // 0,0 → 1,1 in a 100×100 box, y inverted.
  return `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`;
}

export function Motion() {
  const motion = useEditor(
    (s) => s.brandbook.motion ?? { duration: 200, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
  );
  const setMotion = useEditor((s) => s.setMotion);
  const [play, setPlay] = useState(false);

  const transition = `transform ${motion.duration}ms ${motion.easing}`;

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-xs text-app-muted">Duration · {motion.duration}ms</span>
        <input
          type="range"
          min={80}
          max={800}
          step={10}
          value={motion.duration}
          onChange={(e) => setMotion({ duration: Number(e.target.value) })}
          className="w-full accent-app-accent"
        />
      </label>

      <div className="flex flex-wrap gap-1.5">
        {EASINGS.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => setMotion({ easing: e.value })}
            className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
              motion.easing === e.value
                ? "bg-app-accent text-app-on-accent border-app-accent"
                : "border-app-border text-app-muted hover:text-app-text"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-5">
        {/* Curve */}
        <svg width={100} height={100} className="border border-app-border rounded-lg bg-app-panel-2 shrink-0">
          <path d={curvePath(motion.easing)} fill="none" stroke="var(--color-app-accent)" strokeWidth={2} />
        </svg>

        {/* Demo */}
        <div
          className="flex-1 h-16 rounded-lg bg-app-panel-2 border border-app-border relative overflow-hidden cursor-pointer"
          onMouseEnter={() => setPlay(true)}
          onMouseLeave={() => setPlay(false)}
          onClick={() => setPlay((p) => !p)}
          title="Hover to animate"
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-app-accent"
            style={{
              left: 8,
              transform: `translateY(-50%) translateX(${play ? 220 : 0}px) scale(${play ? 1.15 : 1})`,
              transition,
            }}
          />
          <span className="absolute bottom-1 right-2 text-[10px] text-app-muted">hover →</span>
        </div>
      </div>
    </div>
  );
}
