"use client";

import { useRef, useState } from "react";
import { useEditor } from "@/lib/store";

const SLOTS = ["Primary", "Mark", "Inverse", "Wordmark"];

const CHECKER =
  "repeating-conic-gradient(#0000000d 0% 25%, transparent 0% 50%) 50% / 16px 16px";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function LogoSlot({ label }: { label: string }) {
  const logos = useEditor((s) => s.brandbook.logos);
  const addLogo = useEditor((s) => s.addLogo);
  const removeLogo = useEditor((s) => s.removeLogo);
  const inputRef = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState<string | null>(null);

  const existing = logos.find((l) => l.label === label);

  const onFile = async (file: File) => {
    setWarn(null);
    if (!file.type.startsWith("image/")) {
      setWarn("Not an image file.");
      return;
    }
    if (file.size > 800 * 1024) {
      setWarn("Large file (>800KB) — it bloats the DESIGN.md.");
    }
    const dataUrl = await readAsDataUrl(file);
    if (existing) removeLogo(existing.id);
    addLogo(label, dataUrl);
  };

  return (
    <div className="rounded-lg border border-app-border overflow-hidden">
      <div
        className="h-28 flex items-center justify-center p-3"
        style={{ background: CHECKER }}
      >
        {existing ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={existing.dataUrl}
            alt={label}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-app-muted">No {label.toLowerCase()} logo</span>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-app-panel-2">
        <span className="text-xs font-medium text-app-text flex-1">{label}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="text-xs text-app-accent hover:underline"
          onClick={() => inputRef.current?.click()}
        >
          {existing ? "Replace" : "Upload"}
        </button>
        {existing && (
          <button
            type="button"
            className="text-xs text-app-danger hover:underline"
            onClick={() => removeLogo(existing.id)}
          >
            Remove
          </button>
        )}
      </div>
      {warn && <div className="px-3 pb-2 text-[10px] text-app-warn">{warn}</div>}
    </div>
  );
}

export function LogoUploader() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SLOTS.map((s) => (
        <LogoSlot key={s} label={s} />
      ))}
    </div>
  );
}
