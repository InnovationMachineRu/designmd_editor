"use client";

import type { CSSProperties } from "react";
import { useEditor, resolveDecor } from "@/lib/store";
import { docToCssVars } from "@/lib/designmd/tokens";
import { getDecor } from "./decor";
import { Gallery } from "./Gallery";
import { ThemeToggle } from "./ThemeToggle";
import { StylePicker } from "./StylePicker";
import { DirectionControls } from "./DirectionControls";
import { DeviceSelector } from "./DeviceSelector";
import { useInspect } from "./inspect";
import { deviceWidth } from "./devices";

const iconBtn =
  "inline-flex items-center justify-center w-8 h-8 rounded-md border border-app-border text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors";

export function PreviewPane() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const theme = useEditor((s) => s.theme);
  const decorKind = useEditor((s) => resolveDecor(s.presetId, s.customPresets));
  const altHeld = useInspect();

  const settingsCollapsed = useEditor((s) => s.settingsCollapsed);
  const setSettingsCollapsed = useEditor((s) => s.setSettingsCollapsed);
  const fullscreen = useEditor((s) => s.previewFullscreen);
  const setFullscreen = useEditor((s) => s.setPreviewFullscreen);
  const device = useEditor((s) => s.previewDevice);

  const vars = docToCssVars(doc);
  const decor = getDecor(decorKind, theme);
  const dir = doc.direction ?? "ltr";
  const writingMode = doc.writingMode === "vertical" ? "vertical-rl" : "horizontal-tb";

  const width = deviceWidth(doc, device); // null = fit
  const isDevice = width !== null;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-app-text">Live preview</span>
          <span className="text-[11px] text-app-muted hidden sm:inline">
            ⌥ + click — inspect token
          </span>
          <div className="flex-1" />
          <button
            type="button"
            className={iconBtn}
            title={settingsCollapsed ? "Show settings" : "Hide settings"}
            onClick={() => setSettingsCollapsed(!settingsCollapsed)}
          >
            {settingsCollapsed ? "›" : "‹"}
          </button>
          <button
            type="button"
            className={iconBtn}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? "⤡" : "⤢"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DeviceSelector />
          <DirectionControls />
          <ThemeToggle />
          <StylePicker />
        </div>
      </div>

      {/* Preview surface */}
      <div className="flex-1 min-h-0 rounded-xl border border-app-border overflow-hidden">
        <div
          dir={dir}
          className={`dmd-preview h-full overflow-auto scroll-thin ${altHeld ? "dmd-inspect" : ""}`}
          style={{
            ...vars,
            background: decor.paneBackground ?? "var(--dmd-color-background)",
            color: "var(--dmd-color-on-background)",
            writingMode,
          } as CSSProperties}
        >
          <div className={isDevice ? "py-6 px-4 flex justify-center" : ""}>
            <div
              className="@container w-full"
              style={{
                containerType: "inline-size",
                width: width ?? undefined,
                maxWidth: isDevice ? "none" : undefined,
                flex: isDevice ? "0 0 auto" : undefined,
                borderRadius: isDevice ? 12 : undefined,
                boxShadow: isDevice ? "0 8px 40px rgba(0,0,0,0.25)" : undefined,
                outline: isDevice
                  ? "1px solid color-mix(in srgb, var(--dmd-color-on-background) 14%, transparent)"
                  : undefined,
                overflow: isDevice ? "hidden" : undefined,
                background: isDevice ? "var(--dmd-color-background)" : undefined,
              }}
            >
              <div className="p-6 @xl:p-8">
                <Gallery doc={doc} decor={decor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
