"use client";

import type { CSSProperties } from "react";
import { resolveComponent, color, rounding } from "@/lib/designmd/tokens";
import { Block, SectionHeader, darkSurface, hairline, type SectionProps } from "./common";

export function ElevationSection({ doc, decor, mark }: SectionProps) {
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));
  const dark = darkSurface(doc);
  const base: CSSProperties = {
    borderRadius: rounding(doc, "lg", "1rem"),
    padding: 16,
    minHeight: 84,
  };

  const samples: { label: string; style: CSSProperties }[] = [
    { label: "Flat", style: { ...base, background: color(doc, "surface-container", color(doc, "surface")), ...hairline() } },
    { label: "Card", style: { ...base, ...resolveComponent(doc, doc.components["card"]), ...decor.surface } },
    { label: "Raised", style: { ...base, ...resolveComponent(doc, doc.components["card-elevated"]), ...decor.surfaceElevated } },
    { label: "Callout", style: { ...base, background: color(doc, "primary"), color: color(doc, "on-primary", "#fff") } },
    { label: "Dark", style: { ...base, background: dark.bg, color: dark.fg, ...decor.surfaceElevated } },
  ];

  return (
    <Block>
      <SectionHeader index="12" kicker="Elevation & shadow" title="Depth treatments" />
      <div className="grid grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-5 gap-3">
        {samples.map((s) => (
          <div
            key={s.label}
            {...mark({ group: "components", key: "card-elevated" })}
            style={{ ...s.style, ...mark({ group: "components", key: "card-elevated" }).style }}
          >
            <div className="text-sm font-medium">{s.label}</div>
            <div className="text-[11px] mt-1" style={{ color: s.label === "Callout" || s.label === "Dark" ? "inherit" : onSurfaceVar, opacity: 0.8 }}>
              surface sample
            </div>
          </div>
        ))}
      </div>
    </Block>
  );
}
