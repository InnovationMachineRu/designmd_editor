"use client";

import type { CSSProperties } from "react";
import { resolveComponent, color } from "@/lib/designmd/tokens";
import type { HighlightTarget } from "@/lib/designmd/types";
import { Block, SectionHeader, type SectionProps } from "./common";

export function BadgesSection({ doc, mark }: SectionProps) {
  const badge = resolveComponent(doc, doc.components["badge"]);

  const pill = (extra: CSSProperties, label: string, target: HighlightTarget) => (
    <span
      key={label}
      {...mark(target)}
      style={{ display: "inline-flex", alignItems: "center", ...badge, ...extra, ...mark(target).style }}
    >
      {label}
    </span>
  );

  const sizes = [
    { d: 18, f: 10, n: "3" },
    { d: 24, f: 11, n: "12" },
    { d: 30, f: 13, n: "99+" },
  ];

  return (
    <Block>
      <SectionHeader index="09" kicker="Badges" title="Status & counts" />
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {pill({}, "Featured", { group: "components", key: "badge" })}
        {pill(
          { background: color(doc, "secondary"), color: color(doc, "on-secondary") },
          "New",
          { group: "colors", key: "secondary" }
        )}
        {pill(
          { background: color(doc, "error"), color: color(doc, "on-error") },
          "Beta",
          { group: "colors", key: "error" }
        )}
        {pill(
          {
            background: "transparent",
            color: color(doc, "on-surface"),
            border: `1px solid ${color(doc, "outline")}`,
          },
          "Outline",
          { group: "colors", key: "outline" }
        )}
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
        Number badges
      </div>
      <div className="flex items-center gap-4">
        {sizes.map((s) => (
          <span
            key={s.d}
            {...mark({ group: "components", key: "badge" })}
            className="inline-flex items-center justify-center font-semibold"
            style={{
              width: s.d,
              height: s.d,
              borderRadius: 9999,
              fontSize: s.f,
              background: color(doc, "primary"),
              color: color(doc, "on-primary", "#fff"),
              ...mark({ group: "components", key: "badge" }).style,
            }}
          >
            {s.n}
          </span>
        ))}
      </div>
    </Block>
  );
}
