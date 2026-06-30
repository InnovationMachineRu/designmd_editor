"use client";

import { useEffect, useState } from "react";
import { useEditor } from "@/lib/store";
import { PRESET_LIST } from "@/lib/presets";
import { SaveStyleDialog } from "./SaveStyleDialog";

export function StylePicker() {
  const presetId = useEditor((s) => s.presetId);
  const applyPreset = useEditor((s) => s.applyPreset);
  const customPresets = useEditor((s) => s.customPresets);
  const deleteCustomPreset = useEditor((s) => s.deleteCustomPreset);

  const [open, setOpen] = useState(false);
  // Guard against SSR/client mismatch: custom styles come from localStorage.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const custom = mounted ? Object.values(customPresets) : [];

  const tab = (
    id: string,
    label: string,
    description: string,
    removable = false
  ) => (
    <span key={id} className="inline-flex items-center">
      <button
        type="button"
        onClick={() => applyPreset(id)}
        title={description}
        className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
          removable ? "rounded-l-lg border-r-0" : "rounded-lg"
        } ${
          presetId === id
            ? "border-app-accent bg-app-accent/15 text-app-text"
            : "border-app-border text-app-muted hover:text-app-text hover:border-app-accent/60"
        }`}
      >
        {label}
      </button>
      {removable && (
        <button
          type="button"
          title="Delete style"
          onClick={() => deleteCustomPreset(id)}
          className={`px-1.5 py-1.5 rounded-r-lg border text-xs transition-colors ${
            presetId === id
              ? "border-app-accent bg-app-accent/15 text-app-muted hover:text-app-danger"
              : "border-app-border text-app-muted hover:text-app-danger hover:border-app-accent/60"
          }`}
        >
          ✕
        </button>
      )}
    </span>
  );

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {PRESET_LIST.map((p) => tab(p.id, p.label, p.description))}
      {custom.map((p) => tab(p.id, p.label, p.description, true))}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Add a custom style"
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-dashed border-app-border text-app-muted hover:text-app-text hover:border-app-accent transition-colors"
      >
        ＋ Style
      </button>

      {open && <SaveStyleDialog onClose={() => setOpen(false)} />}
    </div>
  );
}
