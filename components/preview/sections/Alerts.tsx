"use client";

import { useState } from "react";
import { resolveTypography, rounding, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, motionOf, type SectionProps } from "./common";

function semantic(
  doc: SectionProps["doc"],
  roles: string[],
  fallback: string
): string {
  for (const r of roles) if (doc.colors[r]) return color(doc, r);
  return fallback;
}

export function AlertsSection({ doc }: SectionProps) {
  const surface = color(doc, "surface", color(doc, "background", "#ffffff"));
  const onSurface = color(doc, "on-surface", "#111");
  const radius = rounding(doc, "lg", "12px");
  const titleType = resolveTypography(doc, "{typography.label-md}");
  const { ms, easing } = motionOf(doc);

  const ALERTS = [
    { id: "info", glyph: "i", title: "Heads up", body: "A new version of the spec is available.", hex: semantic(doc, ["secondary", "primary"], "#2563eb") },
    { id: "success", glyph: "✓", title: "Saved", body: "Your tokens validated against the design.md schema.", hex: semantic(doc, ["success", "ok"], "#16a34a") },
    { id: "warning", glyph: "!", title: "Check contrast", body: "Muted text falls below 4.5:1 on this surface.", hex: semantic(doc, ["warning"], "#d97706") },
    { id: "danger", glyph: "✕", title: "Validation failed", body: "Two component tokens reference a missing color role.", hex: semantic(doc, ["error"], "#dc2626") },
  ];

  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  return (
    <Block>
      <SectionHeader index="14" kicker="Alerts" title="Inline feedback & banners" />

      <div className="space-y-3 max-w-2xl">
        {ALERTS.map((a) => (
          <div
            key={a.id}
            role="status"
            className="flex items-start gap-3 p-4"
            style={{
              background: `color-mix(in srgb, ${a.hex} 12%, ${surface})`,
              border: `1px solid color-mix(in srgb, ${a.hex} 28%, transparent)`,
              borderRadius: radius,
              color: onSurface,
              opacity: dismissed[a.id] ? 0.35 : 1,
              transition: `opacity ${ms}ms ${easing}`,
            }}
          >
            <span
              className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
              style={{ background: a.hex, color: "#fff" }}
              aria-hidden
            >
              {a.glyph}
            </span>
            <div className="flex-1 min-w-0">
              <div style={{ ...titleType, color: a.hex }}>{a.title}</div>
              <p className="text-sm opacity-80 mt-0.5">{a.body}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissed((d) => ({ ...d, [a.id]: !d[a.id] }))}
              className="shrink-0 text-sm opacity-50 hover:opacity-100 cursor-pointer"
              style={{ transition: `opacity ${ms}ms ${easing}` }}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Block>
  );
}
