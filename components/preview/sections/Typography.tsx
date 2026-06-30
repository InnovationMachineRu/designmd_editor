"use client";

import type { CSSProperties, ReactNode } from "react";
import { resolveTypography } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

/** Size scale, largest → smallest. */
const SIZE_SCALE = [
  "display-lg",
  "headline-lg",
  "headline-md",
  "title-md",
  "body-lg",
  "body-md",
  "body-sm",
  "label-md",
  "label-sm",
];

/** Heuristic: does a font-family read as a serif? */
function isSerif(family?: string): boolean {
  if (!family) return false;
  return /serif|merriweather|playfair|georgia|noto serif|times|garamond|lora/i.test(
    family
  );
}

/** The dominant family across the scale (the most common fontFamily). */
function primaryFamily(
  typography: SectionProps["doc"]["typography"]
): string | undefined {
  const counts = new Map<string, number>();
  for (const t of Object.values(typography)) {
    if (t.fontFamily) counts.set(t.fontFamily, (counts.get(t.fontFamily) ?? 0) + 1);
  }
  let best: string | undefined;
  let max = 0;
  for (const [fam, n] of counts) {
    if (n > max) {
      max = n;
      best = fam;
    }
  }
  return best;
}

function Sub({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-3">
      {children}
    </div>
  );
}

export function TypographySection({ doc, mark }: SectionProps) {
  const family = primaryFamily(doc.typography);
  const mono = doc.brandbook?.fonts.mono;
  const headingKey =
    ["display-lg", "headline-lg", "headline-md"].find((k) => doc.typography[k]) ??
    Object.keys(doc.typography)[0];
  const bodyKey =
    ["body-md", "body-lg", "body-sm"].find((k) => doc.typography[k]) ?? headingKey;
  const labelKey =
    ["label-md", "label-sm"].find((k) => doc.typography[k]) ?? bodyKey;

  const bodyStyle = resolveTypography(doc, `{typography.${bodyKey}}`);
  const headStyle = resolveTypography(doc, `{typography.${headingKey}}`);

  // Distinct weights present across the scale.
  const weights = Array.from(
    new Set(
      Object.values(doc.typography)
        .map((t) => t.fontWeight)
        .filter(Boolean) as string[]
    )
  ).sort((a, b) => Number(a) - Number(b));

  return (
    <Block>
      <SectionHeader index="02" kicker="Typography" title="Type system & anatomy" />

      {/* Typeface */}
      <div className="mb-8">
        <Sub>Typeface</Sub>
        <div
          {...mark({ group: "typography", key: headingKey })}
          className="rounded-xl p-5"
          style={{ ...hairline() }}
        >
          <div className="text-[11px] opacity-50 mb-1 font-mono">
            {family ?? "—"} {isSerif(family) ? "· serif" : "· sans-serif"}
          </div>
          <div style={{ ...headStyle, lineHeight: 1.05 }}>Ag</div>
          <div className="mt-3 opacity-80" style={{ ...bodyStyle }}>
            The quick brown fox jumps over the lazy dog. 0123456789
          </div>
        </div>
      </div>

      {/* Mono — the Brandbook's monospace family, for code & tabular data */}
      <div className="mb-8">
        <Sub>Mono · code</Sub>
        <div className="rounded-xl p-5" style={{ ...hairline() }}>
          <div className="text-[11px] opacity-50 mb-2 font-mono">
            {mono ?? "ui-monospace"} · monospace
          </div>
          <pre
            className="text-sm overflow-x-auto scroll-thin"
            style={{ fontFamily: mono ?? "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.6 }}
          >
{`const theme = { primary: "#6750A4" };
0123456789  ()[]{}  ->  =>  !==  <=`}
          </pre>
        </div>
      </div>

      {/* Size */}
      <div className="mb-8">
        <Sub>Size</Sub>
        <div className="space-y-2">
          {SIZE_SCALE.filter((k) => doc.typography[k]).map((k) => {
            const t = doc.typography[k];
            return (
              <div
                key={k}
                {...mark({ group: "typography", key: k })}
                className="flex items-baseline justify-between gap-3 py-1.5"
                style={{
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--dmd-color-on-background) 10%, transparent)",
                }}
              >
                <span
                  className="truncate"
                  style={resolveTypography(doc, `{typography.${k}}`)}
                >
                  {k}
                </span>
                <span className="text-[10px] opacity-50 font-mono shrink-0">
                  {t.fontSize}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weight */}
      {weights.length > 0 && (
        <div className="mb-8">
          <Sub>Weight</Sub>
          <div className="flex flex-wrap gap-4">
            {weights.map((w) => (
              <div key={w} className="text-center">
                <div
                  style={{
                    fontFamily: family,
                    fontWeight: w as CSSProperties["fontWeight"],
                    fontSize: 40,
                    lineHeight: 1,
                  }}
                >
                  Aa
                </div>
                <div className="text-[10px] opacity-50 font-mono mt-1">{w}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Height */}
      <div className="mb-8">
        <Sub>Line height</Sub>
        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
          {[
            { label: "Tight · 1.2", lh: 1.2 },
            { label: "Relaxed · 1.7", lh: 1.7 },
          ].map((opt) => (
            <div key={opt.label} className="rounded-xl p-4" style={{ ...hairline() }}>
              <div className="text-[10px] opacity-50 font-mono mb-2">{opt.label}</div>
              <p style={{ ...bodyStyle, lineHeight: opt.lh }}>
                Comfortable reading depends on the leading. The same paragraph set at a
                different line-height changes how dense the column feels to the eye.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bold */}
      <div className="mb-8">
        <Sub>Regular vs Bold</Sub>
        <div className="space-y-1" style={{ ...bodyStyle }}>
          <div style={{ fontWeight: 400 }}>
            Regular — emphasis comes from weight, not color.
          </div>
          <div style={{ fontWeight: 700 }}>
            Bold — the same line carries more visual weight.
          </div>
        </div>
      </div>

      {/* Serif */}
      <div>
        <Sub>Serif vs Sans</Sub>
        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ ...hairline() }}>
            <div className="text-[10px] opacity-50 font-mono mb-2">
              {isSerif(family) ? `${family} (serif)` : "Serif (Merriweather)"}
            </div>
            <div
              style={{
                fontFamily: isSerif(family)
                  ? family
                  : "Merriweather, Georgia, serif",
                fontSize: 28,
                lineHeight: 1.2,
              }}
            >
              Editorial &amp; refined
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ ...hairline() }}>
            <div className="text-[10px] opacity-50 font-mono mb-2">
              {!isSerif(family) ? `${family} (sans)` : "Sans (Inter)"}
            </div>
            <div
              style={{
                fontFamily: !isSerif(family)
                  ? family
                  : "Inter, system-ui, sans-serif",
                fontSize: 28,
                lineHeight: 1.2,
              }}
            >
              Modern &amp; neutral
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}
