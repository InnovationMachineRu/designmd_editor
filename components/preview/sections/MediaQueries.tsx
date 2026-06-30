"use client";

import { DEFAULT_BREAKPOINTS } from "@/lib/designmd/types";
import { useEditor } from "@/lib/store";
import { color } from "@/lib/designmd/tokens";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

export function MediaQueriesSection({ doc }: SectionProps) {
  const setPreviewDevice = useEditor((s) => s.setPreviewDevice);
  const activeDevice = useEditor((s) => s.previewDevice);
  const accent = color(doc, "primary", "#888");
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));

  const bp = doc.breakpoints ?? DEFAULT_BREAKPOINTS;
  const entries = Object.entries(bp).sort((a, b) => a[1] - b[1]);
  const max = entries.length ? entries[entries.length - 1][1] : 1280;

  return (
    <Block>
      <SectionHeader index="19" kicker="Media queries" title="Responsive breakpoints" />
      <p className="text-[12px] mb-3" style={{ color: onSurfaceVar }}>
        Click a row to preview at that width. Edit values in the Breakpoints block.
      </p>
      <div className="rounded-lg overflow-hidden" style={hairline()}>
        {entries.map(([name, value], i) => {
          const active = activeDevice === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setPreviewDevice(name)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
              style={{
                borderTop:
                  i === 0
                    ? "none"
                    : "1px solid color-mix(in srgb, var(--dmd-color-on-background) 10%, transparent)",
                background: active ? "color-mix(in srgb, var(--dmd-color-on-background) 6%, transparent)" : "transparent",
              }}
            >
              <span className="w-16 shrink-0 text-[12px] font-semibold">{name}</span>
              <span className="text-[11px] font-mono shrink-0" style={{ color: onSurfaceVar }}>
                ≥ {value}px
              </span>
              <span className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--dmd-color-on-background) 10%, transparent)" }}>
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: accent }}
                />
              </span>
              {active && <span className="text-[10px]" style={{ color: accent }}>● active</span>}
            </button>
          );
        })}
      </div>
      <code className="block text-[11px] font-mono mt-3 opacity-70">
        @media (min-width: {entries[0]?.[1] ?? 640}px) {"{ … }"}
      </code>
    </Block>
  );
}
