"use client";

import { useState, type CSSProperties } from "react";
import { useEditor, resolveDecor } from "@/lib/store";
import { docToCssVars } from "@/lib/designmd/tokens";
import { serializeDesignDoc } from "@/lib/designmd/serialize";
import { docToCssVarsBlock, docToTailwindTheme, docToDesignTokensJson } from "@/lib/designmd/export";
import type { DesignDoc } from "@/lib/designmd/types";
import { getDecor } from "./decor";
import { Gallery } from "./Gallery";
import { ThemeToggle } from "./ThemeToggle";
import { StylePicker } from "./StylePicker";
import { DirectionControls } from "./DirectionControls";
import { DeviceSelector } from "./DeviceSelector";
import { CodePanel } from "./CodePanel";
import { useInspect } from "./inspect";
import { deviceWidth } from "./devices";

type PreviewMode = "live" | "markdown" | "css" | "tailwind" | "tokens";

const MODES: { id: PreviewMode; label: string; filename: string }[] = [
  { id: "live",     label: "Live",     filename: "" },
  { id: "markdown", label: "Markdown", filename: "design.md" },
  { id: "css",      label: "CSS Vars", filename: "design-tokens.css" },
  { id: "tailwind", label: "Tailwind", filename: "tailwind-tokens.css" },
  { id: "tokens",   label: "Tokens",   filename: "design-tokens.json" },
];

function getCodeContent(mode: PreviewMode, doc: DesignDoc): string {
  if (mode === "markdown") return serializeDesignDoc(doc);
  if (mode === "css") return docToCssVarsBlock(doc);
  if (mode === "tailwind") return docToTailwindTheme(doc);
  if (mode === "tokens") return docToDesignTokensJson(doc);
  return "";
}

const iconBtn =
  "inline-flex items-center justify-center w-8 h-8 rounded-md border border-app-border text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors";

const tabBtn = (active: boolean) =>
  `inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
    active
      ? "bg-app-panel-2 text-app-text border border-app-border"
      : "text-app-muted hover:text-app-text"
  }`;

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

  const customFontUrls = useEditor((s) => s.customFontUrls);
  const addCustomFontUrl = useEditor((s) => s.addCustomFontUrl);
  const removeCustomFontUrl = useEditor((s) => s.removeCustomFontUrl);

  const [mode, setMode] = useState<PreviewMode>("live");
  const [showFonts, setShowFonts] = useState(false);
  const [fontInput, setFontInput] = useState("");

  const vars = docToCssVars(doc);
  const decor = getDecor(decorKind, theme);
  const dir = doc.direction ?? "ltr";
  const writingMode = doc.writingMode === "vertical" ? "vertical-rl" : "horizontal-tb";

  const width = deviceWidth(doc, device);
  const isDevice = width !== null;

  const activeModeObj = MODES.find((m) => m.id === mode)!;
  const codeContent = mode !== "live" ? getCodeContent(mode, doc) : "";

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
        {/* Row 1: mode tabs + controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode tabs */}
          <div className="flex items-center gap-0.5 bg-app-panel rounded-lg border border-app-border p-0.5">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={tabBtn(mode === m.id)}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Fonts button */}
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

          {/* Settings / fullscreen (only in live mode) */}
          {mode === "live" && (
            <>
              <span className="text-[11px] text-app-muted hidden sm:inline">⌥ click — inspect</span>
              <button
                type="button"
                className={iconBtn}
                title={settingsCollapsed ? "Show settings" : "Hide settings"}
                onClick={() => setSettingsCollapsed(!settingsCollapsed)}
              >
                {settingsCollapsed ? "›" : "‹"}
              </button>
            </>
          )}
          <button
            type="button"
            className={iconBtn}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? "⤡" : "⤢"}
          </button>
        </div>

        {/* Row 2: device/direction/theme/style (only in live mode) */}
        {mode === "live" && (
          <div className="flex flex-wrap items-center gap-2">
            <DeviceSelector />
            <DirectionControls />
            <ThemeToggle />
            <StylePicker />
          </div>
        )}

        {/* Font panel */}
        {showFonts && (
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

      {/* Content area */}
      {mode === "live" ? (
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
      ) : (
        <div className="flex-1 min-h-0">
          <CodePanel content={codeContent} filename={activeModeObj.filename} />
        </div>
      )}
    </div>
  );
}
