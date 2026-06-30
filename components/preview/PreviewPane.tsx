"use client";

import { useState, type CSSProperties } from "react";
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

/**
 * Live design-system preview. Renders the token-driven Gallery with device,
 * direction, theme and style controls. Font loading is a Brandbook concern, so
 * the font-management panel only appears when `enableFonts` is set (Brandbook);
 * the Design System workspace renders the preview without it. Code/token
 * exports live in the dedicated Export step, not here.
 */
export function PreviewPane({ enableFonts = false }: { enableFonts?: boolean }) {
  const doc = useEditor((s) => s.docs[s.theme]);
  const theme = useEditor((s) => s.theme);
  const decorKind = useEditor((s) => resolveDecor(s.presetId, s.customPresets));
  const altHeld = useInspect();

  const settingsCollapsed = useEditor((s) => s.settingsCollapsed);
  const setSettingsCollapsed = useEditor((s) => s.setSettingsCollapsed);
  const fullscreen = useEditor((s) => s.previewFullscreen);
  const setFullscreen = useEditor((s) => s.setPreviewFullscreen);
  const device = useEditor((s) => s.previewDevice);

  const customFontUrls = useEditor((s) => s.customFontUrls);
  const addCustomFontUrl = useEditor((s) => s.addCustomFontUrl);
  const removeCustomFontUrl = useEditor((s) => s.removeCustomFontUrl);

  const [showFonts, setShowFonts] = useState(false);
  const [fontInput, setFontInput] = useState("");

  const vars = docToCssVars(doc);
  const decor = getDecor(decorKind, theme);
  const dir = doc.direction ?? "ltr";
  const writingMode = doc.writingMode === "vertical" ? "vertical-rl" : "horizontal-tb";

  const width = deviceWidth(doc, device);
  const isDevice = width !== null;

  const usedFonts = Array.from(
    new Set(Object.values(doc.typography).map((t) => t.fontFamily).filter(Boolean))
  ) as string[];

  const onLoadFont = () => {
    const url = fontInput.trim();
    if (!url.startsWith("https://")) return;
    addCustomFontUrl(url);
    setFontInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="mb-3 space-y-2">
        {/* Row 1: controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-app-muted uppercase tracking-wide">
            Live preview
          </span>

          <div className="flex-1" />

          {/* Fonts button (Brandbook only) */}
          {enableFonts && (
            <button
              type="button"
              className={`${iconBtn} text-[11px] w-auto px-2 gap-1 ${showFonts ? "bg-app-panel-2 text-app-text" : ""}`}
              title="Manage fonts"
              onClick={() => setShowFonts((v) => !v)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
              </svg>
              Fonts
            </button>
          )}

          <span className="text-[11px] text-app-muted hidden sm:inline">⌥ click — inspect</span>
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

        {/* Row 2: device/direction/theme/style */}
        <div className="flex flex-wrap items-center gap-2">
          <DeviceSelector />
          <DirectionControls />
          <ThemeToggle />
          <StylePicker />
        </div>

        {/* Font panel (Brandbook only) */}
        {enableFonts && showFonts && (
          <div className="rounded-xl border border-app-border bg-app-panel p-3 space-y-3">
            <div className="text-xs font-semibold text-app-text">Font loading</div>

            {usedFonts.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-app-muted mb-1">In use (auto-loaded)</div>
                <div className="flex flex-wrap gap-1">
                  {usedFonts.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-full text-xs bg-app-panel-2 text-app-text border border-app-border"
                      style={{ fontFamily: f }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] uppercase tracking-wide text-app-muted mb-1">
                Custom CSS URL (Google Fonts, Bunny Fonts…)
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={fontInput}
                  onChange={(e) => setFontInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onLoadFont()}
                  placeholder="https://fonts.googleapis.com/css2?family=…"
                  className="flex-1 bg-app-panel-2/60 border border-app-border rounded-lg px-3 py-1.5 text-xs text-app-text outline-none focus:border-app-accent transition-colors placeholder:text-app-muted/70"
                />
                <button
                  type="button"
                  onClick={onLoadFont}
                  disabled={!fontInput.trim().startsWith("https://")}
                  className="px-3 py-1.5 rounded-lg bg-app-accent text-app-bg text-xs font-semibold hover:bg-app-accent-2 transition-colors disabled:opacity-40"
                >
                  Load
                </button>
              </div>
            </div>

            {customFontUrls.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-app-muted mb-1">Loaded custom</div>
                <div className="space-y-1">
                  {customFontUrls.map((url) => (
                    <div key={url} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 truncate text-app-muted font-mono">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomFontUrl(url)}
                        className="text-app-danger hover:text-app-danger/80 transition-colors shrink-0"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live content */}
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
