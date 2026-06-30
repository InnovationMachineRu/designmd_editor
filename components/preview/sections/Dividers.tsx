"use client";

import { color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, type SectionProps } from "./common";

const LINE = "color-mix(in srgb, var(--dmd-color-on-background) 14%, transparent)";

export function DividersSection({ doc }: SectionProps) {
  const muted = color(doc, "on-surface-variant", color(doc, "on-surface", "#666"));

  return (
    <Block>
      <SectionHeader index="13" kicker="Dividers" title="Separators & rules" />

      <div className="space-y-8 max-w-2xl">
        {/* Plain horizontal */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
            Horizontal
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${LINE}` }} />
        </div>

        {/* Labeled */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
            With label
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-1" style={{ borderTop: `1px solid ${LINE}` }} />
            <span className="text-[11px] font-medium" style={{ color: muted }}>
              OR
            </span>
            <span className="flex-1" style={{ borderTop: `1px solid ${LINE}` }} />
          </div>
        </div>

        {/* Vertical, between inline items */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
            Vertical
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: muted }}>
            <span>Overview</span>
            <span className="self-stretch" style={{ borderLeft: `1px solid ${LINE}` }} />
            <span>Pricing</span>
            <span className="self-stretch" style={{ borderLeft: `1px solid ${LINE}` }} />
            <span>Docs</span>
          </div>
        </div>

        {/* List separated by dividers */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
            List rows
          </div>
          <ul className="rounded-lg overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
            {["Account", "Notifications", "Billing"].map((row, i) => (
              <li
                key={row}
                className="px-4 py-3 text-sm flex items-center justify-between"
                style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}
              >
                <span>{row}</span>
                <span className="text-xs" style={{ color: muted }}>
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Block>
  );
}
