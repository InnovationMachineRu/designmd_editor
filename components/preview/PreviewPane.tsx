"use client";

import type { CSSProperties } from "react";
import { useEditor, resolveDecor } from "@/lib/store";
import { docToCssVars } from "@/lib/designmd/tokens";
import { getDecor } from "./decor";
import { Gallery } from "./Gallery";
import { ThemeToggle } from "./ThemeToggle";
import { StylePicker } from "./StylePicker";

export function PreviewPane() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const theme = useEditor((s) => s.theme);
  const decorKind = useEditor((s) => resolveDecor(s.presetId, s.customPresets));

  const vars = docToCssVars(doc);
  const decor = getDecor(decorKind, theme);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-sm font-semibold text-app-text">Live preview</div>
        <div className="flex items-center gap-3">
          <StylePicker />
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-xl border border-app-border overflow-hidden">
        <div
          className="dmd-preview h-full overflow-auto scroll-thin"
          style={{
            ...vars,
            background: decor.paneBackground ?? "var(--dmd-color-background)",
            color: "var(--dmd-color-on-background)",
          } as CSSProperties}
        >
          <div className="p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="text-2xl font-bold" style={{ color: "var(--dmd-color-on-background)" }}>
                {doc.name}
              </div>
              {doc.description && (
                <p className="text-sm opacity-70 mt-1">{doc.description}</p>
              )}
            </div>
            <Gallery doc={doc} decor={decor} />
          </div>
        </div>
      </div>
    </div>
  );
}
