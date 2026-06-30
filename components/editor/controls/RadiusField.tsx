"use client";

import { DimensionField } from "./DimensionField";

const PRESETS: { label: string; value: string }[] = [
  { label: "none", value: "0" },
  { label: "sm", value: "0.25rem" },
  { label: "md", value: "0.5rem" },
  { label: "lg", value: "1rem" },
  { label: "full", value: "9999px" },
];

/** Rounding editor: slider/stepper plus quick radius presets. */
export function RadiusField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <DimensionField
        value={value}
        onChange={onChange}
        purpose="radius"
        units={["px", "rem", "%"]}
      />
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.value)}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
              value.trim() === p.value
                ? "border-app-accent bg-app-accent/15 text-app-text"
                : "border-app-border text-app-muted hover:text-app-text hover:border-app-accent/60"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
