"use client";

import type { ReactNode } from "react";
import { resolveTypography, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

function Principle({ name, hint, children }: { name: string; hint: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ ...hairline() }}>
      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50">{name}</div>
      <p className="text-xs opacity-60 mt-0.5 mb-3">{hint}</p>
      {children}
    </div>
  );
}

export function VisualHierarchySection({ doc }: SectionProps) {
  const primary = color(doc, "primary", "#4f46e5");
  const onPrimary = color(doc, "on-primary", "#fff");
  const surfaceHigh = color(doc, "surface-container-high", color(doc, "surface-container", "#f0f0f0"));
  const onSurface = color(doc, "on-surface", "#111");
  const muted = color(doc, "on-surface-variant", "#777");
  const title = resolveTypography(doc, "{typography.title-md}");
  const body = resolveTypography(doc, "{typography.body-sm}");
  const chip = (bg: string, fg: string) => ({ background: bg, color: fg, padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 });

  return (
    <Block>
      <SectionHeader index="09" kicker="Visual hierarchy" title="Consistency · spacing · proximity · alignment" />

      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
        {/* Consistency */}
        <Principle name="Consistency" hint="Same role → same treatment, so meaning is predictable.">
          <div className="flex flex-wrap gap-2">
            <span style={chip(primary, onPrimary)}>Save</span>
            <span style={chip(primary, onPrimary)}>Publish</span>
            <span style={chip(primary, onPrimary)}>Share</span>
          </div>
        </Principle>

        {/* Spacing */}
        <Principle name="Spacing" hint="A consistent rhythm sized from the base unit.">
          <div className="flex items-end gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <span style={{ width: 10, height: n * 8, background: primary, borderRadius: 2 }} />
                <span className="text-[9px] font-mono" style={{ color: muted }}>{n * 8}</span>
              </div>
            ))}
          </div>
        </Principle>

        {/* Proximity */}
        <Principle name="Proximity" hint="Related items grouped; unrelated ones kept apart.">
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <span style={{ ...body, color: onSurface }}>Name</span>
              <span style={{ ...body, color: muted }}>Jane Doe</span>
            </div>
            <div className="flex flex-col gap-1">
              <span style={{ ...body, color: onSurface }}>Role</span>
              <span style={{ ...body, color: muted }}>Maker</span>
            </div>
          </div>
        </Principle>

        {/* Alignment */}
        <Principle name="Alignment" hint="A shared edge guides the eye down the column.">
          <div className="rounded-lg p-3 space-y-1.5" style={{ background: surfaceHigh, borderLeft: "none" }}>
            <div style={{ ...title, color: onSurface }}>Heading</div>
            <div style={{ ...body, color: muted }}>Subtext aligns to the same left edge.</div>
            <div style={{ ...body, color: muted }}>So does the next line, forming a clean spine.</div>
          </div>
        </Principle>
      </div>
    </Block>
  );
}
