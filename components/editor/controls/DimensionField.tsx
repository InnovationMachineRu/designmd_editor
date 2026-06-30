"use client";

import {
  COMMON_UNITS,
  formatDimension,
  parseDimension,
  rangeFor,
} from "@/lib/designmd/dimension";
import { inputCls, selectCls } from "@/components/ui/styles";

/**
 * Numeric dimension editor: range slider + number stepper + unit select.
 * Falls back to a plain text input when the value can't be parsed as a single
 * number+unit (e.g. a token reference or a multi-value shorthand).
 */
export function DimensionField({
  value,
  onChange,
  purpose,
  units,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  purpose: "fontSize" | "lineHeight" | "letterSpacing" | "spacing" | "radius" | "size";
  units?: readonly string[];
  /** Hide the slider (for tight layouts like the box-padding editor). */
  compact?: boolean;
}) {
  const dim = parseDimension(value);
  const unitList = units ?? COMMON_UNITS;

  if (!dim) {
    // Unparseable (reference / shorthand) — let the user edit raw text.
    return (
      <input
        className={`${inputCls} font-mono`}
        value={value}
        placeholder="value"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const range = rangeFor(purpose, dim.unit);
  const commit = (value: number, unit: string) =>
    onChange(formatDimension({ value, unit }));

  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <input
          type="range"
          className="flex-1 accent-app-accent cursor-pointer"
          min={range.min}
          max={range.max}
          step={range.step}
          value={Math.min(Math.max(dim.value, range.min), range.max)}
          onChange={(e) => commit(Number(e.target.value), dim.unit)}
        />
      )}
      <input
        type="number"
        className={`${inputCls} ${compact ? "w-full min-w-0 px-1.5" : "w-16"} font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        step={range.step}
        value={dim.value}
        onChange={(e) => {
          if (e.target.value === "") return;
          commit(Number(e.target.value), dim.unit);
        }}
      />
      <select
        className={`${selectCls} ${compact ? "px-1" : ""}`}
        value={dim.unit}
        onChange={(e) => commit(dim.value, e.target.value)}
      >
        {unitList.map((u) => (
          <option key={u || "unitless"} value={u}>
            {u || "—"}
          </option>
        ))}
      </select>
    </div>
  );
}
