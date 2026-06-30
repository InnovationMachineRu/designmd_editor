"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { FONT_CATALOG, type FontCategory } from "@/lib/fonts/google";
import { FontLoader } from "@/components/FontLoader";

type Role = "heading" | "body" | "mono";

const CATEGORIES: { id: FontCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "display", label: "Display" },
  { id: "mono", label: "Mono" },
];

export function FontManager() {
  const brandbook = useEditor((s) => s.brandbook);
  const setBrandFont = useEditor((s) => s.setBrandFont);
  const customFontUrls = useEditor((s) => s.customFontUrls);
  const addCustomFontUrl = useEditor((s) => s.addCustomFontUrl);
  const removeCustomFontUrl = useEditor((s) => s.removeCustomFontUrl);
  const [role, setRole] = useState<Role>("heading");
  const [cat, setCat] = useState<FontCategory | "all">("all");
  const [fontInput, setFontInput] = useState("");

  const current = brandbook.fonts[role];
  const list = FONT_CATALOG.filter((f) => cat === "all" || f.category === cat);

  // Fonts currently bound to the brand roles (auto-loaded by FontLoader).
  const usedFonts = Array.from(
    new Set(
      [brandbook.fonts.heading, brandbook.fonts.body, brandbook.fonts.mono].filter(
        Boolean
      ) as string[]
    )
  );

  const onLoadFont = () => {
    const url = fontInput.trim();
    if (!url.startsWith("https://")) return;
    addCustomFontUrl(url);
    setFontInput("");
  };

  return (
    <div className="space-y-3">
      {/* Role + current selections */}
      <div className="grid grid-cols-3 gap-2">
        {(["heading", "body", "mono"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg border px-2.5 py-2 text-left transition-colors ${
              role === r
                ? "border-app-accent bg-app-panel-2"
                : "border-app-border hover:bg-app-panel-2"
            }`}
          >
            <div className="text-[10px] uppercase tracking-wide text-app-muted">{r}</div>
            <div
              className="text-sm text-app-text truncate"
              style={{ fontFamily: brandbook.fonts[r] }}
            >
              {brandbook.fonts[r] ?? "—"}
            </div>
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
              cat === c.id
                ? "bg-app-accent text-app-on-accent border-app-accent"
                : "border-app-border text-app-muted hover:text-app-text"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Font list with live specimens */}
      <div className="max-h-72 overflow-auto scroll-thin rounded-lg border border-app-border divide-y divide-app-border">
        {list.map((f) => {
          const active = current === f.family;
          return (
            <button
              key={f.family}
              type="button"
              onClick={() => setBrandFont(role, f.family)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors ${
                active ? "bg-app-accent/15" : "hover:bg-app-panel-2"
              }`}
            >
              <span
                className="text-lg text-app-text truncate"
                style={{ fontFamily: f.family }}
              >
                {f.family}
              </span>
              <span className="text-[10px] uppercase text-app-muted shrink-0">
                {active ? `✓ ${role}` : f.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Font loading — injects the Google Fonts <link> for the brand fonts and
          any custom CSS URLs (renderless effect). */}
      <FontLoader />
      <div className="rounded-xl border border-app-border bg-app-panel p-3 space-y-3">
        <div className="text-xs font-semibold text-app-text">Font loading</div>

        {usedFonts.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-app-muted mb-1">
              In use (auto-loaded)
            </div>
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
              className="px-3 py-1.5 rounded-lg bg-app-accent text-app-on-accent text-xs font-semibold hover:bg-app-accent-2 transition-colors disabled:opacity-40"
            >
              Load
            </button>
          </div>
        </div>

        {customFontUrls.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-app-muted mb-1">
              Loaded custom
            </div>
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
    </div>
  );
}
