"use client";

import { resolveValue, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, type SectionProps } from "./common";

export function RadiiSection({ doc, mark }: SectionProps) {
  const fill = color(doc, "surface-container-high", color(doc, "surface-container", "#e5e5e5"));
  const accent = color(doc, "primary", "#888");
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));

  const entries = Object.entries(doc.rounded).map(([k, v]) => ({
    key: k,
    value: resolveValue(doc, v) ?? String(v),
  }));

  return (
    <Block>
      <SectionHeader index="11" kicker="Corner radii" title="Roundness scale" />
      <div className="grid grid-cols-3 sm:grid-cols-4 @2xl:grid-cols-6 gap-3">
        {entries.map((e) => (
          <div key={e.key} {...mark({ group: "rounded", key: e.key })} className="text-center">
            <div
              className="w-full"
              style={{
                aspectRatio: "1 / 1",
                background: fill,
                borderRadius: e.value,
                border: `2px solid ${accent}`,
              }}
            />
            <div className="text-[11px] font-medium mt-1 truncate">{e.key}</div>
            <div className="text-[10px] font-mono" style={{ color: onSurfaceVar }}>
              {e.value}
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-[12px]" style={{ color: onSurfaceVar }}>
            No radius tokens defined.
          </p>
        )}
      </div>
    </Block>
  );
}
