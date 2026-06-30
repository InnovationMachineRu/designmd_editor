"use client";

import { resolveTypography } from "@/lib/designmd/tokens";
import { Block, SectionHeader, type SectionProps } from "./common";

// Neutral sample lines paired with scales, largest → smallest.
const SAMPLES: { key: string; text: string }[] = [
  { key: "display-lg", text: "Design once, ship everywhere" },
  { key: "headline-lg", text: "A type scale for every surface" },
  { key: "headline-md", text: "Built from a single family" },
  { key: "title-md", text: "Section titles and dialog headers" },
  { key: "body-lg", text: "Comfortable reading for long passages of body copy." },
  { key: "body-md", text: "The standard paragraph size used across the system." },
  { key: "label-sm", text: "LABEL · SMALL CAPS" },
];

export function TypographySection({ doc, mark }: SectionProps) {
  const scales = Object.keys(doc.typography);
  return (
    <Block>
      <SectionHeader index="02" kicker="Typography" title="One family, full scale" />
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-8">
        {/* Specs */}
        <div className="space-y-2">
          {scales.map((k) => {
            const t = doc.typography[k];
            return (
              <div
                key={k}
                {...mark({ group: "typography", key: k })}
                className="flex items-baseline justify-between gap-3 py-1.5 rounded"
                style={{
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--dmd-color-on-background) 10%, transparent)",
                }}
              >
                <span className="text-[12px] font-medium">{k}</span>
                <span className="text-[10px] opacity-50 font-mono text-right">
                  {[t.fontFamily, t.fontSize, t.fontWeight].filter(Boolean).join(" · ")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rendered samples */}
        <div className="space-y-3">
          {SAMPLES.filter((s) => doc.typography[s.key]).map((s) => (
            <div
              key={s.key}
              {...mark({ group: "typography", key: s.key })}
              style={resolveTypography(doc, `{typography.${s.key}}`)}
            >
              {s.text}
            </div>
          ))}
          {doc.typography["body-md"] && (
            <div
              className="pt-2 space-y-1 opacity-90"
              style={resolveTypography(doc, "{typography.body-md}")}
            >
              <div dir="rtl">العربية — مرحبا بالعالم ١٢٣</div>
              <div lang="ja">日本語 — 速い茶色のキツネ</div>
            </div>
          )}
        </div>
      </div>
    </Block>
  );
}
