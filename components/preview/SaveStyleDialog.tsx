"use client";

import { useEffect, useRef, useState } from "react";
import type { DecorKind } from "@/lib/designmd/types";
import { useEditor } from "@/lib/store";
import {
  btnGhostCls,
  btnPrimaryCls,
  inputCls,
  labelCls,
  selectCls,
} from "@/components/ui/styles";

const DECOR_OPTIONS: { value: DecorKind; label: string }[] = [
  { value: "flat", label: "Flat (neutral)" },
  { value: "material", label: "Material elevation" },
  { value: "glass", label: "Glass (blur)" },
  { value: "minimal", label: "Minimal (borders)" },
  { value: "neo", label: "Neumorphic shadows" },
  { value: "vintage", label: "Vintage (paper)" },
  { value: "asian", label: "Asian (ink)" },
];

/**
 * Popover to create a custom style: either snapshot the current tokens or start
 * from a neutral blank document. The user picks a name and a base decor.
 */
export function SaveStyleDialog({ onClose }: { onClose: () => void }) {
  const saveCurrentAsStyle = useEditor((s) => s.saveCurrentAsStyle);
  const addBlankStyle = useEditor((s) => s.addBlankStyle);
  const [name, setName] = useState("My Style");
  const [decor, setDecor] = useState<DecorKind>("flat");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-40 w-72 p-4 rounded-xl border border-app-border bg-app-panel shadow-2xl space-y-3"
    >
      <div className="text-sm font-semibold text-app-text">New custom style</div>
      <div>
        <label className={labelCls}>name</label>
        <input
          className={inputCls}
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>base look (decor)</label>
        <select
          className={`${selectCls} w-full`}
          value={decor}
          onChange={(e) => setDecor(e.target.value as DecorKind)}
        >
          {DECOR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 pt-1">
        <button
          className={btnPrimaryCls}
          onClick={() => {
            saveCurrentAsStyle(name, decor);
            onClose();
          }}
        >
          Save current tokens
        </button>
        <button
          className={btnGhostCls}
          onClick={() => {
            addBlankStyle(name, decor);
            onClose();
          }}
        >
          Create blank
        </button>
      </div>
    </div>
  );
}
