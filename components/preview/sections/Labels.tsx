"use client";

import { resolveTypography, rounding, color } from "@/lib/designmd/tokens";
import { onColorFor } from "@/lib/designmd/color";
import { Block, SectionHeader, type SectionProps } from "./common";

/** Resolve a semantic accent, preferring a matching token, else a sane default. */
function semantic(
  doc: SectionProps["doc"],
  roles: string[],
  fallback: string
): string {
  for (const r of roles) if (doc.colors[r]) return color(doc, r);
  return fallback;
}

export function LabelsSection({ doc }: SectionProps) {
  const radius = rounding(doc, "full", "9999px");
  const labelType = resolveTypography(doc, "{typography.label-sm}");
  const surface = color(doc, "surface", color(doc, "background", "#ffffff"));

  const TONES = [
    { name: "Default", hex: semantic(doc, ["primary"], "#4f46e5") },
    { name: "Info", hex: semantic(doc, ["secondary", "primary"], "#2563eb") },
    { name: "Success", hex: semantic(doc, ["success", "ok"], "#16a34a") },
    { name: "Warning", hex: semantic(doc, ["warning"], "#d97706") },
    { name: "Danger", hex: semantic(doc, ["error"], "#dc2626") },
    { name: "Neutral", hex: semantic(doc, ["on-surface-variant", "outline"], "#6b7280") },
  ];

  return (
    <Block>
      <SectionHeader index="12" kicker="Labels & tags" title="Status & metadata" />

      {/* Solid */}
      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
        Solid
      </div>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => (
          <span
            key={t.name}
            style={{
              ...labelType,
              background: t.hex,
              color: onColorFor(t.hex),
              borderRadius: radius,
              padding: "3px 10px",
            }}
          >
            {t.name}
          </span>
        ))}
      </div>

      {/* Soft */}
      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mt-6 mb-2">
        Soft
      </div>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => (
          <span
            key={t.name}
            style={{
              ...labelType,
              background: `color-mix(in srgb, ${t.hex} 16%, ${surface})`,
              color: t.hex,
              border: `1px solid color-mix(in srgb, ${t.hex} 32%, transparent)`,
              borderRadius: radius,
              padding: "3px 10px",
            }}
          >
            {t.name}
          </span>
        ))}
      </div>

      {/* With a leading dot */}
      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mt-6 mb-2">
        With status dot
      </div>
      <div className="flex flex-wrap gap-2">
        {TONES.slice(0, 4).map((t) => (
          <span
            key={t.name}
            className="inline-flex items-center gap-1.5"
            style={{
              ...labelType,
              background: `color-mix(in srgb, ${t.hex} 12%, ${surface})`,
              color: color(doc, "on-surface", "#111"),
              borderRadius: radius,
              padding: "3px 10px",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.hex }} />
            {t.name}
          </span>
        ))}
      </div>
    </Block>
  );
}
