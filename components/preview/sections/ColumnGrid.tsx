"use client";

import { color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

/** Resolve the base spacing unit (px number) for the gutter readout. */
function baseUnit(doc: SectionProps["doc"]): number {
  const raw = doc.spacing?.unit ?? doc.spacing?.["card-gap"];
  const n = parseInt(String(raw ?? "8"), 10);
  return Number.isFinite(n) && n > 0 ? n : 8;
}

export function ColumnGridSection({ doc }: SectionProps) {
  const primary = color(doc, "primary", "#4f46e5");
  const onPrimary = color(doc, "on-primary", "#fff");
  const surfaceHigh = color(doc, "surface-container-high", color(doc, "surface-container", "#eee"));
  const onSurface = color(doc, "on-surface", "#111");
  const gutter = baseUnit(doc);

  const cell = (span: number, label: string, filled = false) => (
    <div
      className="flex items-center justify-center text-[11px] font-medium rounded-md py-3"
      style={{
        gridColumn: `span ${span} / span ${span}`,
        background: filled ? primary : surfaceHigh,
        color: filled ? onPrimary : onSurface,
      }}
    >
      {label}
    </div>
  );

  return (
    <Block>
      <SectionHeader index="10" kicker="Layout" title="12-column grid" />
      <p className="text-xs opacity-60 mb-4">
        Every component lays out against the same 12-column grid · {gutter}px gutter.
      </p>

      {/* Column ruler overlay */}
      <div className="grid grid-cols-12 mb-5" style={{ gap: gutter }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-md flex items-center justify-center text-[10px] font-mono opacity-60"
            style={{ background: `color-mix(in srgb, ${primary} 10%, transparent)`, ...hairline() }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Example layouts snapping to columns */}
      <div className="space-y-3">
        <div className="grid grid-cols-12" style={{ gap: gutter }}>
          {cell(8, "Main · span 8", true)}
          {cell(4, "Aside · span 4")}
        </div>
        <div className="grid grid-cols-12" style={{ gap: gutter }}>
          {cell(4, "1 / 3")}
          {cell(4, "1 / 3")}
          {cell(4, "1 / 3")}
        </div>
        <div className="grid grid-cols-12" style={{ gap: gutter }}>
          {cell(3, "Nav")}
          {cell(6, "Content", true)}
          {cell(3, "Meta")}
        </div>
      </div>
    </Block>
  );
}
