"use client";

import type { CSSProperties } from "react";
import { resolveComponent, color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, type SectionProps } from "./common";

const TILES = [
  { name: "Storage", sub: "Files & assets" },
  { name: "Chat", sub: "Team messaging" },
  { name: "Docs", sub: "Knowledge base" },
  { name: "Repo", sub: "Source control" },
  { name: "Issues", sub: "Project tracking" },
  { name: "Design", sub: "Mockups & specs" },
];

export function TileGridSection({ doc, decor, mark }: SectionProps) {
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));
  const tile: CSSProperties = {
    ...resolveComponent(doc, doc.components["card"]),
    ...decor.surface,
  };

  return (
    <Block>
      <SectionHeader index="06" kicker="Tile grid" title="Connect everything" />
      <div className="grid grid-cols-2 @xl:grid-cols-3 gap-3">
        {TILES.map((t) => (
          <div
            key={t.name}
            {...mark({ group: "components", key: "card" })}
            className="flex items-center gap-3"
            style={tile}
          >
            <span
              className="shrink-0 inline-flex items-center justify-center font-semibold"
              style={{
                width: 36,
                height: 36,
                borderRadius: 9999,
                background: color(doc, "secondary-container", color(doc, "surface-container-high")),
                color: color(doc, "on-secondary-container", color(doc, "on-surface")),
                fontSize: 14,
              }}
            >
              {t.name[0]}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium truncate">{t.name}</span>
              <span className="block text-[11px] truncate" style={{ color: onSurfaceVar }}>
                {t.sub}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Block>
  );
}
