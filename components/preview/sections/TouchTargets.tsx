"use client";

import { resolveComponent, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

const TARGETS = [
  { size: 32, label: "32px", ok: false, note: "Too small" },
  { size: 44, label: "44px", ok: true, note: "iOS minimum" },
  { size: 48, label: "48px", ok: true, note: "Material minimum" },
];

export function TouchTargetsSection({ doc, mark }: SectionProps) {
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));
  const ok = color(doc, "secondary", "#3fb950");
  const bad = color(doc, "error", "#ff6b6b");
  const iconStyle = resolveComponent(doc, doc.components["button-primary"]);

  return (
    <Block>
      <SectionHeader index="20" kicker="Touch targets" title="Hit areas & spacing" />
      <div className="flex flex-wrap items-end gap-6">
        {TARGETS.map((t) => (
          <div key={t.size} className="text-center">
            <div
              className="relative inline-flex items-center justify-center"
              {...mark({ group: "components", key: "button-primary" })}
              style={{
                width: t.size,
                height: t.size,
                borderRadius: 10,
                border: `2px dashed ${t.ok ? ok : bad}`,
                ...mark({ group: "components", key: "button-primary" }).style,
              }}
            >
              {/* The actual icon button (24px) centered in the target. */}
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: iconStyle.background ?? color(doc, "primary"),
                  color: iconStyle.color ?? color(doc, "on-primary", "#fff"),
                  fontSize: 12,
                }}
              >
                ★
              </span>
            </div>
            <div className="text-[11px] font-medium mt-1.5">{t.label}</div>
            <div className="text-[10px]" style={{ color: t.ok ? ok : bad }}>
              {t.note}
            </div>
          </div>
        ))}
      </div>

      {/* Spacing between adjacent targets */}
      <div className="mt-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
          Adjacent spacing (≥ 8px gap)
        </div>
        <div className="inline-flex gap-2 p-2 rounded-lg" style={hairline()}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-flex items-center justify-center text-[11px]"
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: color(doc, "surface-container-high", color(doc, "surface-container")),
                color: onSurfaceVar,
              }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[12px] mt-4 opacity-60">
        Minimum interactive target: <strong>44×44px</strong> (iOS) / <strong>48×48px</strong> (Material),
        with at least 8px between adjacent targets.
      </p>
    </Block>
  );
}
