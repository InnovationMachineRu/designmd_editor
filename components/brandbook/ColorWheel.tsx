"use client";

import { useRef, type PointerEvent } from "react";
import { useEditor } from "@/lib/store";
import { hexToHsl, hslToHex } from "@/lib/designmd/color";
import type { SchemeName } from "@/lib/designmd/types";

const SIZE = 220;
const R = SIZE / 2;

const SCHEMES: { id: SchemeName; label: string; count: string }[] = [
  { id: "monochromatic", label: "Mono", count: "1" },
  { id: "complementary", label: "Complementary", count: "2" },
  { id: "analogous", label: "Analogous", count: "3" },
  { id: "triadic", label: "Triadic", count: "3" },
  { id: "tetradic", label: "Tetradic", count: "4" },
];

/** Position (px from top-left) of a hue/sat point on the wheel. */
function dotPos(h: number, s: number): { left: number; top: number } {
  const rad = (h * Math.PI) / 180;
  const dist = (s / 100) * R;
  return { left: R + dist * Math.cos(rad), top: R + dist * Math.sin(rad) };
}

export function ColorWheel() {
  const brandbook = useEditor((s) => s.brandbook);
  const setBase = useEditor((s) => s.setBrandbookBase);
  const setScheme = useEditor((s) => s.setScheme);
  const wheelRef = useRef<HTMLDivElement>(null);

  const baseHsl = hexToHsl(brandbook.baseColor) ?? { h: 0, s: 0, l: 50 };

  const pick = (e: PointerEvent<HTMLDivElement>) => {
    const el = wheelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - rect.left - R;
    const dy = e.clientY - rect.top - R;
    const dist = Math.min(Math.hypot(dx, dy), R);
    const s = (dist / R) * 100;
    const h = (Math.atan2(dy, dx) * (180 / Math.PI) + 360) % 360;
    setBase(hslToHex({ h, s, l: baseHsl.l }));
  };

  const baseDot = dotPos(baseHsl.h, baseHsl.s);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-5">
        <div
          ref={wheelRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            pick(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons) pick(e);
          }}
          className="relative rounded-full cursor-crosshair shrink-0 touch-none"
          style={{
            width: SIZE,
            height: SIZE,
            background:
              "radial-gradient(circle at center, #fff 0%, transparent 70%), conic-gradient(from 90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
          }}
        >
          {/* Derived scheme handles (read-only) */}
          {brandbook.schemeColors.slice(1).map((hex, i) => {
            const hsl = hexToHsl(hex);
            if (!hsl) return null;
            const p = dotPos(hsl.h, hsl.s);
            return (
              <span
                key={i}
                className="absolute w-3.5 h-3.5 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: p.left, top: p.top, background: hex, boxShadow: "0 0 0 1px rgba(0,0,0,0.3)" }}
              />
            );
          })}
          {/* Base handle */}
          <span
            className="absolute w-5 h-5 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: baseDot.left,
              top: baseDot.top,
              background: brandbook.baseColor,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <div className="text-xs text-app-muted mb-1">Base color</div>
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-md border border-app-border shrink-0"
                style={{ background: brandbook.baseColor }}
              />
              <code className="text-sm font-mono text-app-text">
                {brandbook.baseColor.toUpperCase()}
              </code>
            </div>
          </div>

          <div>
            <div className="text-xs text-app-muted mb-1">
              Lightness · {Math.round(baseHsl.l)}%
            </div>
            <input
              type="range"
              min={4}
              max={96}
              value={Math.round(baseHsl.l)}
              onChange={(e) =>
                setBase(hslToHex({ h: baseHsl.h, s: baseHsl.s, l: Number(e.target.value) }))
              }
              className="w-full accent-app-accent"
            />
          </div>

          <div>
            <div className="text-xs text-app-muted mb-1">Saturation · {Math.round(baseHsl.s)}%</div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(baseHsl.s)}
              onChange={(e) =>
                setBase(hslToHex({ h: baseHsl.h, s: Number(e.target.value), l: baseHsl.l }))
              }
              className="w-full accent-app-accent"
            />
          </div>
        </div>
      </div>

      {/* Scheme selector */}
      <div>
        <div className="text-xs text-app-muted mb-1.5">Harmony</div>
        <div className="flex flex-wrap gap-1.5">
          {SCHEMES.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setScheme(sc.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                brandbook.scheme === sc.id
                  ? "bg-app-accent text-app-on-accent border-app-accent"
                  : "border-app-border text-app-muted hover:text-app-text hover:bg-app-panel-2"
              }`}
              title={`${sc.count}-color scheme`}
            >
              {sc.label}
              <span className="opacity-60 ml-1">{sc.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
