"use client";

import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { inputCls } from "@/components/ui/styles";

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/**
 * Color editor: a swatch that opens a hex picker popover, plus a free-text
 * input that accepts any CSS color (rgba, oklch, named, …).
 */
export function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const isHex = HEX_RE.test(value.trim());

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-9 h-9 rounded-lg border border-app-border shrink-0 transition-transform hover:scale-105"
          style={{ background: value, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
          title="Pick color"
          aria-label="Pick color"
        />
        {open && (
          <div className="absolute z-30 mt-2 p-3 rounded-lg border border-app-border bg-app-panel shadow-2xl">
            <HexColorPicker
              color={isHex ? value : "#888888"}
              onChange={onChange}
            />
            {!isHex && (
              <p className="mt-2 text-[11px] text-app-muted max-w-[200px]">
                Non-hex value — edit text directly for rgba()/oklch().
              </p>
            )}
          </div>
        )}
      </div>
      <input
        className={`${inputCls} font-mono`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
