"use client";

import { useEditor } from "@/lib/store";
import { color } from "@/lib/designmd/tokens";
import { onColorFor } from "@/lib/designmd/color";
import { ContrastBadge } from "@/components/editor/controls/ContrastBadge";

const ROLE_LABELS = ["Primary", "Secondary", "Tertiary", "Accent"];

/**
 * Shows the derived harmony palette mapped to the brand roles it was applied to,
 * with a WCAG read-out of each color against the document surface.
 */
export function SchemePanel() {
  const brandbook = useEditor((s) => s.brandbook);
  const doc = useEditor((s) => s.docs[s.theme]);
  const surface = color(doc, "surface", color(doc, "background", "#ffffff"));

  return (
    <div>
      <div className="text-xs text-app-muted mb-2">
        Applied to design tokens · {brandbook.scheme}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {brandbook.schemeColors.map((hex, i) => {
          const on = onColorFor(hex);
          return (
            <div
              key={i}
              className="rounded-lg overflow-hidden border border-app-border"
            >
              <div
                className="h-16 flex items-end justify-between p-2"
                style={{ background: hex, color: on }}
              >
                <span className="text-xs font-semibold">
                  {ROLE_LABELS[i] ?? `Color ${i + 1}`}
                </span>
                <span className="text-[10px] font-mono opacity-90">
                  {hex.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 bg-app-panel-2">
                <ContrastBadge fg={hex} bg={surface} pairLabel="surface" />
                <span className="text-[10px] text-app-muted">vs surface</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
