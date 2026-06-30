"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { FONT_CATALOG, type FontCategory } from "@/lib/fonts/google";

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
  const [role, setRole] = useState<Role>("heading");
  const [cat, setCat] = useState<FontCategory | "all">("all");

  const current = brandbook.fonts[role];
  const list = FONT_CATALOG.filter((f) => cat === "all" || f.category === cat);

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
    </div>
  );
}
