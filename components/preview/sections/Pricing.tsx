"use client";

import type { CSSProperties } from "react";
import { resolveComponent, resolveTypography, color } from "@/lib/designmd/tokens";
import { LiveButton } from "./Buttons";
import { Block, SectionHeader, darkSurface, type SectionProps } from "./common";

const TIERS = [
  { name: "Free", price: "$0", note: "per month", feature: "Core editing", cta: "button-plain" },
  { name: "Pro", price: "$20", note: "per month", feature: "Everything in Free, plus more", cta: "button-secondary" },
  { name: "Team", price: "$30", note: "per user", feature: "Shared workspaces", cta: "button-primary", highlight: true },
  { name: "Enterprise", price: "Custom", note: "contact us", feature: "SSO & support", cta: "button-secondary" },
];

export function PricingSection({ doc, decor, mark }: SectionProps) {
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));
  const dark = darkSurface(doc);

  return (
    <Block>
      <SectionHeader index="07" kicker="Pricing tiles" title="Plans for every team" />
      <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-4 gap-3">
        {TIERS.map((t) => {
          const base: CSSProperties = {
            ...resolveComponent(doc, doc.components["card"]),
            ...decor.surface,
          };
          const hi = t.highlight
            ? { background: dark.bg, color: dark.fg, ...decor.surfaceElevated }
            : {};
          return (
            <div
              key={t.name}
              {...mark({ group: "components", key: "card" })}
              className="flex flex-col gap-3"
              style={{ ...base, ...hi }}
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="flex items-baseline gap-1">
                <span style={{ ...resolveTypography(doc, "{typography.headline-lg}") }}>{t.price}</span>
                <span className="text-[11px] opacity-60">{t.note}</span>
              </div>
              <p
                className="text-[12px] flex-1"
                style={{ color: t.highlight ? dark.fg : onSurfaceVar, opacity: t.highlight ? 0.8 : 1 }}
              >
                {t.feature}
              </p>
              <LiveButton doc={doc} base={t.cta} hover={t.cta === "button-primary" ? "button-primary-hover" : undefined} label="Choose" decorExtra={decor.button} mark={mark} />
            </div>
          );
        })}
      </div>
      <p className="text-[11px] mt-2 opacity-50">
        Highlighted tier uses the dark surface treatment.
      </p>
    </Block>
  );
}
