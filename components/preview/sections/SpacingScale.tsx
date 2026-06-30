"use client";

import { resolveValue, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, type SectionProps } from "./common";

export function SpacingScaleSection({ doc, mark }: SectionProps) {
  const accent = color(doc, "primary", "#888");
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));

  // Resolve each spacing token to a px-ish width for the ruler bars.
  const entries = Object.entries(doc.spacing)
    .map(([k, v]) => {
      const resolved = resolveValue(doc, String(v)) ?? String(v);
      const px = parseFloat(resolved);
      const unit = resolved.replace(/[\d.\-]/g, "").trim();
      const width = unit === "rem" || unit === "em" ? px * 16 : px;
      return { key: k, value: resolved, width: Number.isFinite(width) ? width : 0 };
    })
    .sort((a, b) => a.width - b.width);

  return (
    <Block>
      <SectionHeader index="16" kicker="Spacing scale" title="Rhythm & density" />
      <div className="space-y-2">
        {entries.map((e) => (
          <div
            key={e.key}
            {...mark({ group: "spacing", key: e.key })}
            className="flex items-center gap-3 py-1"
          >
            <span className="w-32 shrink-0 text-[12px] font-medium truncate">{e.key}</span>
            <span
              className="shrink-0 rounded"
              style={{ width: Math.max(2, e.width), height: 16, background: accent }}
              title={`${e.value}`}
            />
            <span className="text-[11px] font-mono" style={{ color: onSurfaceVar }}>
              {e.value}
            </span>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-[12px]" style={{ color: onSurfaceVar }}>
            No spacing tokens defined.
          </p>
        )}
      </div>
    </Block>
  );
}
