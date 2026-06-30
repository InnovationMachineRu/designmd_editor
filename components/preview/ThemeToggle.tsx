"use client";

import { useEditor } from "@/lib/store";
import type { ThemeMode } from "@/lib/designmd/types";

export function ThemeToggle() {
  const theme = useEditor((s) => s.theme);
  const setTheme = useEditor((s) => s.setTheme);

  const modes: ThemeMode[] = ["light", "dark"];
  return (
    <div className="inline-flex rounded-lg border border-app-border p-0.5 bg-app-panel">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setTheme(m)}
          className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
            theme === m ? "bg-app-accent text-app-on-accent" : "text-app-muted hover:text-app-text"
          }`}
        >
          {m === "light" ? "☀ Light" : "🌙 Dark"}
        </button>
      ))}
    </div>
  );
}
