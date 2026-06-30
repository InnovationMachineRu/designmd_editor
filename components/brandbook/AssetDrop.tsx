"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { BrandLogo } from "@/lib/designmd/types";

const CHECKER =
  "repeating-conic-gradient(#0000000d 0% 25%, transparent 0% 50%) 50% / 16px 16px";

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/**
 * Reusable upload-and-gallery for brand assets (icons, moodboard images).
 * Thumbnails sit on a checkerboard with a remove control; an "Add" tile opens
 * the file picker. Shared with the logo slots' upload mechanics.
 */
export function AssetDrop({
  items,
  onAdd,
  onRemove,
  accept = "image/png,image/svg+xml,image/jpeg,image/webp",
  addLabel = "Add",
  checker = true,
  imgStyle,
  cols = 4,
}: {
  items: BrandLogo[];
  onAdd: (label: string, dataUrl: string) => void;
  onRemove: (id: string) => void;
  accept?: string;
  addLabel?: string;
  checker?: boolean;
  imgStyle?: CSSProperties;
  cols?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState<string | null>(null);

  const onFiles = async (files: FileList) => {
    setWarn(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 800 * 1024) setWarn("Some files are large (>800KB) — they bloat DESIGN.md.");
      const dataUrl = await readAsDataUrl(file);
      onAdd(file.name.replace(/\.[^.]+$/, ""), dataUrl);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((it) => (
          <div
            key={it.id}
            className="group relative rounded-lg border border-app-border overflow-hidden aspect-square flex items-center justify-center"
            style={checker ? { background: CHECKER } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.dataUrl}
              alt={it.label}
              className="max-h-full max-w-full object-contain p-2"
              style={imgStyle}
            />
            <button
              type="button"
              onClick={() => onRemove(it.id)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-dashed border-app-border aspect-square flex flex-col items-center justify-center text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors"
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-[10px] mt-1">{addLabel}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {warn && <div className="text-[10px] text-app-warn">{warn}</div>}
    </div>
  );
}
