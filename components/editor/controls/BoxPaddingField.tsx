"use client";

import { useState } from "react";
import { parseDimension } from "@/lib/designmd/dimension";
import { inputCls, iconBtnCls } from "@/components/ui/styles";
import { DimensionField } from "./DimensionField";

type Sides = [string, string, string, string]; // top, right, bottom, left

/** Split a padding shorthand into [t,r,b,l], or null if not simple dimensions. */
function parseSides(value: string): Sides | null {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  if (tokens.length < 1 || tokens.length > 4) return null;
  if (!tokens.every((t) => parseDimension(t) !== null)) return null;
  const [a, b = a, c = a, d = b] = tokens;
  // CSS order: 1→all, 2→(v h), 3→(t h b), 4→(t r b l)
  if (tokens.length === 1) return [a, a, a, a];
  if (tokens.length === 2) return [a, b, a, b];
  if (tokens.length === 3) return [a, b, c, b];
  return [a, b, c, d];
}

/** Collapse [t,r,b,l] back into the shortest valid shorthand. */
function formatSides([t, r, b, l]: Sides): string {
  if (t === r && r === b && b === l) return t;
  if (t === b && l === r) return `${t} ${r}`;
  if (l === r) return `${t} ${r} ${b}`;
  return `${t} ${r} ${b} ${l}`;
}

/**
 * Padding editor with a 1–4 side box model and a link toggle. Falls back to a
 * text input when the value isn't a plain dimension shorthand (e.g. a token ref).
 */
export function BoxPaddingField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const sides = parseSides(value);
  const allEqual = sides ? sides.every((s) => s === sides[0]) : true;
  const [linked, setLinked] = useState(allEqual);

  if (!sides) {
    return (
      <input
        className={`${inputCls} font-mono`}
        value={value}
        placeholder="e.g. 0 24px"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const setSide = (i: number, v: string) => {
    const next = [...sides] as Sides;
    next[i] = v;
    onChange(formatSides(next));
  };
  const setAll = (v: string) => onChange(formatSides([v, v, v, v]));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={iconBtnCls}
          title={linked ? "Sides linked — click to edit individually" : "Edit each side"}
          onClick={() => setLinked((l) => !l)}
        >
          {linked ? "🔗" : "⛓️‍💥"}
        </button>
        {linked ? (
          <div className="flex-1">
            <DimensionField
              value={sides[0]}
              onChange={setAll}
              purpose="spacing"
              units={["px", "rem", "%"]}
              compact
            />
          </div>
        ) : (
          <span className="text-xs text-app-muted">Top · Right · Bottom · Left</span>
        )}
      </div>

      {!linked && (
        <div className="grid grid-cols-2 gap-2">
          {(["T", "R", "B", "L"] as const).map((lbl, i) => (
            <div key={lbl} className="flex items-center gap-1.5">
              <span className="text-[10px] text-app-muted w-3 shrink-0">{lbl}</span>
              <div className="flex-1 min-w-0">
                <DimensionField
                  value={sides[i]}
                  onChange={(v) => setSide(i, v)}
                  purpose="spacing"
                  units={["px", "rem", "%"]}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
