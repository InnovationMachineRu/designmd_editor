"use client";

import type { CSSProperties } from "react";
import { resolveComponent, resolveTypography, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, darkSurface, type SectionProps } from "./common";

const FEATURES = [
  { title: "Reason through complexity", body: "Long-form analysis with structured, reviewable steps." },
  { title: "Understand your code", body: "Reads across files to explain and extend with care." },
  { title: "Built for design", body: "Tokens flow straight into faithful, on-brand UI." },
];

export function CardsSection({ doc, decor, mark }: SectionProps) {
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));
  const dark = darkSurface(doc);

  const card = (elevated: boolean): CSSProperties => ({
    ...resolveComponent(doc, doc.components[elevated ? "card-elevated" : "card"]),
    ...(elevated ? decor.surfaceElevated : decor.surface),
  });

  return (
    <Block>
      <SectionHeader index="04" kicker="Cards & containers" title="Surfaces, mockups & callouts" />

      <div className="grid grid-cols-1 @xl:grid-cols-3 gap-4 mb-4">
        {FEATURES.map((f) => (
          <div key={f.title} {...mark({ group: "components", key: "card" })} style={card(false)}>
            <div style={{ ...resolveTypography(doc, "{typography.title-md}"), marginBottom: 6 }}>
              {f.title}
            </div>
            <p style={{ ...resolveTypography(doc, "{typography.body-sm}"), color: onSurfaceVar }}>
              {f.body}
            </p>
          </div>
        ))}
      </div>

      {/* Dark code-mockup cards */}
      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4">
        {["Model A", "Model B"].map((name) => (
          <div
            key={name}
            {...mark({ group: "components", key: "card-elevated" })}
            className="rounded-xl p-4 font-mono text-[12px]"
            style={{ background: dark.bg, color: dark.fg, ...decor.surfaceElevated }}
          >
            <div className="opacity-50 mb-2">// {name.toLowerCase().replace(" ", "-")}.ts</div>
            <div><span style={{ color: color(doc, "primary") }}>const</span> system = loadTokens()</div>
            <div><span style={{ color: color(doc, "secondary", color(doc, "primary")) }}>export</span> default render(system)</div>
          </div>
        ))}
      </div>
    </Block>
  );
}
