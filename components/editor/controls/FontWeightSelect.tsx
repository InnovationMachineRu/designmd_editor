"use client";

import { selectCls } from "@/components/ui/styles";

const WEIGHTS: { value: string; label: string }[] = [
  { value: "100", label: "100 · Thin" },
  { value: "200", label: "200 · Extra Light" },
  { value: "300", label: "300 · Light" },
  { value: "400", label: "400 · Regular" },
  { value: "500", label: "500 · Medium" },
  { value: "600", label: "600 · Semibold" },
  { value: "700", label: "700 · Bold" },
  { value: "800", label: "800 · Extra Bold" },
  { value: "900", label: "900 · Black" },
];

/** Dropdown for font-weight, stored as a string (e.g. "400") per the spec. */
export function FontWeightSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const known = WEIGHTS.some((w) => w.value === value);
  return (
    <select
      className={`${selectCls} w-full`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {!known && value && (
        <option value={value}>{value} · custom</option>
      )}
      {WEIGHTS.map((w) => (
        <option key={w.value} value={w.value}>
          {w.label}
        </option>
      ))}
    </select>
  );
}
