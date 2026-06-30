"use client";

import { inputCls } from "@/components/ui/styles";

const NAMES: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

/** Nearest named weight label for an arbitrary numeric value. */
function nameFor(value: number): string {
  const step = Math.round(value / 100) * 100;
  return NAMES[step] ?? "";
}

/**
 * Slider for font-weight across the 100–900 scale. Stores the value as a
 * string per the spec; falls back to a text input for non-numeric values.
 */
export function FontWeightSlider({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const num = Number(value);
  const valid = Number.isFinite(num) && num > 0;

  if (!valid) {
    return (
      <input
        className={`${inputCls} font-mono`}
        value={value}
        placeholder="400"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        className="flex-1 accent-app-accent cursor-pointer"
        min={100}
        max={900}
        step={100}
        value={Math.min(Math.max(num, 100), 900)}
        onChange={(e) => onChange(e.target.value)}
      />
      <span
        className="shrink-0 w-28 text-xs text-app-muted tabular-nums"
        style={{ fontWeight: num as never }}
      >
        {num} · {nameFor(num)}
      </span>
    </div>
  );
}
