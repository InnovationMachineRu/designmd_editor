"use client";

import { resolveTypography, rounding, color } from "@/lib/designmd/tokens";
import { LiveButton } from "./Buttons";
import { Block, SectionHeader, type SectionProps } from "./common";

export function CalloutSection({ doc, decor, mark }: SectionProps) {
  const primary = color(doc, "primary");
  const onPrimary = color(doc, "on-primary", "#fff");
  return (
    <Block>
      <SectionHeader index="05" kicker="CTA callout" title="High-emphasis banner" />
      <div
        {...mark({ group: "colors", key: "primary" })}
        className="p-6 @xl:p-8 flex flex-col @xl:flex-row @xl:items-center gap-4 @xl:justify-between"
        style={{ background: primary, color: onPrimary, borderRadius: rounding(doc, "xl", "1rem") }}
      >
        <div>
          <div style={{ ...resolveTypography(doc, "{typography.headline-md}") }}>
            Start building today
          </div>
          <p className="opacity-80 text-sm mt-1 max-w-md">
            Drop your tokens in and the whole system updates — buttons, cards, type and color.
          </p>
        </div>
        <div className="shrink-0">
          <LiveButton doc={doc} base="button-secondary" label="Get started" decorExtra={decor.button} mark={mark} />
        </div>
      </div>
    </Block>
  );
}
