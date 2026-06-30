"use client";

import { useRef, useState } from "react";
import { useEditor } from "@/lib/store";
import { parseDesignDoc } from "@/lib/designmd/parse";
import { btnGhostCls, btnPrimaryCls, inputCls } from "@/components/ui/styles";

/**
 * Import a DESIGN.md file (upload or paste) and merge it into the current
 * document — only the groups/values present in the file are overwritten.
 */
export function ImportDialog({ onClose }: { onClose: () => void }) {
  const importDoc = useEditor((s) => s.importDoc);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    setText(await file.text());
    setError(null);
  };

  const onImport = () => {
    if (!text.trim()) {
      setError("Paste DESIGN.md content or choose a file first.");
      return;
    }
    try {
      const doc = parseDesignDoc(text);
      if (!doc.name && Object.keys(doc.colors).length === 0) {
        setError("This doesn't look like a DESIGN.md file (no name or tokens found).");
        return;
      }
      importDoc(doc);
      onClose();
    } catch (e) {
      setError(`Failed to parse: ${(e as Error).message}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-app-panel border border-app-border rounded-xl w-full max-w-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-app-border">
          <span className="text-sm font-semibold text-app-text flex-1">
            Import DESIGN.md
          </span>
          <button onClick={onClose} className="text-app-muted hover:text-app-text">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-app-muted">
            Upload or paste a DESIGN.md file. Matching tokens/groups overwrite the
            current document; everything else is kept.
          </p>

          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
            <button className={btnGhostCls} onClick={() => fileRef.current?.click()}>
              Choose file…
            </button>
            <span className="text-xs text-app-muted">or paste below</span>
          </div>

          <textarea
            className={`${inputCls} font-mono min-h-[220px] resize-y`}
            value={text}
            placeholder={"---\nname: My System\ncolors:\n  primary: \"#1A1C1E\"\n---\n\n## Overview\n…"}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
          />

          {error && <div className="text-xs text-app-danger">{error}</div>}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-app-border">
          <button className={btnGhostCls} onClick={onClose}>
            Cancel
          </button>
          <button className={btnPrimaryCls} onClick={onImport}>
            Import &amp; merge
          </button>
        </div>
      </div>
    </div>
  );
}
