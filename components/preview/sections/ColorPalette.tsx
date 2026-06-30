"use client";

import { color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

const GROUPS: { label: string; roles: string[] }[] = [
  {
    label: "Brand",
    roles: ["primary", "primary-hover", "secondary", "tertiary", "error"],
  },
  {
    label: "Surfaces",
    roles: [
      "background",
      "surface",
      "surface-container",
      "surface-container-high",
      "surface-container-highest",
    ],
  },
  {
    label: "Text & lines",
    roles: ["on-surface", "on-surface-variant", "outline", "outline-variant"],
  },
];

export function ColorPaletteSection({ doc, mark }: SectionProps) {
  return (
    <Block>
      <SectionHeader index="01" kicker="Color palette" title="Brand, surfaces & text" />
      <div className="space-y-6">
        {GROUPS.map((g) => {
          const roles = g.roles.filter((r) => doc.colors[r]);
          if (!roles.length) return null;
          return (
            <div key={g.label}>
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
                {g.label}
              </div>
              <div className="grid grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-5 gap-3">
                {roles.map((role) => {
                  const value = color(doc, role);
                  return (
                    <div
                      key={role}
                      {...mark({ group: "colors", key: role })}
                      className="rounded-lg overflow-hidden"
                      style={{ ...hairline() }}
                    >
                      <div style={{ background: value, height: 56 }} />
                      <div className="px-2 py-1.5">
                        <div className="text-[11px] font-medium truncate">{role}</div>
                        <div className="text-[10px] opacity-50 font-mono uppercase">
                          {value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Block>
  );
}
