"use client";

import { Icon, BRAND_ICONS } from "@/components/icons";
import { color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

/** Icon library specimen — adopts the Brandbook icon style (stroke/size/corner). */
export function IconsSection({ doc }: SectionProps) {
  const style = doc.brandbook?.icons;
  const stroke = style?.strokeWidth ?? 1.8;
  const corner = style?.corner ?? "round";
  const accent = color(doc, "primary", "currentColor");
  const custom = style?.custom ?? [];

  return (
    <Block>
      <SectionHeader index="11" kicker="Iconography" title="Icon set & sizes" />

      {/* The set at a single comfortable size, on a column grid */}
      <div className="grid grid-cols-4 @md:grid-cols-6 @2xl:grid-cols-8 gap-3">
        {BRAND_ICONS.map((ic) => (
          <div
            key={ic.name}
            className="flex flex-col items-center gap-2 rounded-lg py-3"
            style={{ ...hairline() }}
          >
            <Icon path={ic.path} size={24} strokeWidth={stroke} corner={corner} />
            <span className="text-[10px] opacity-50 font-mono truncate max-w-full px-1">
              {ic.name}
            </span>
          </div>
        ))}
      </div>

      {/* Size ramp */}
      <div className="mt-8">
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-3">
          Sizes
        </div>
        <div className="flex flex-wrap items-end gap-6">
          {[16, 20, 24, 32, 40].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5" style={{ color: accent }}>
              <Icon path={BRAND_ICONS[4].path} size={s} strokeWidth={stroke} corner={corner} />
              <span className="text-[10px] opacity-50 font-mono">{s}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom uploaded icons, if any */}
      {custom.length > 0 && (
        <div className="mt-8">
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-3">
            Custom
          </div>
          <div className="grid grid-cols-4 @md:grid-cols-6 @2xl:grid-cols-8 gap-3">
            {custom.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-center rounded-lg p-3 h-14"
                style={{ ...hairline() }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.dataUrl} alt={c.label} className="max-h-8 max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Block>
  );
}
