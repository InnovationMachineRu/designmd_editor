"use client";

import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls } from "@/components/ui/styles";
import { AddButton, DeleteBtn, KeyInput } from "./RowControls";

/** Generic editor for flat `name → string` token groups (rounded, spacing). */
export function SimpleTokenBlock({
  title,
  entries,
  defaultOpen,
  onSet,
  onRename,
  onAdd,
  onRemove,
  placeholder,
  renderValue,
}: {
  title: string;
  entries: [string, string][];
  defaultOpen?: boolean;
  onSet: (name: string, value: string) => void;
  onRename: (from: string, to: string) => void;
  onAdd: () => void;
  onRemove: (name: string) => void;
  placeholder?: string;
  /** Custom value editor; defaults to a plain text input. */
  renderValue?: (name: string, value: string, onChange: (v: string) => void) => ReactNode;
}) {
  return (
    <Accordion title={title} subtitle={`${entries.length} tokens`} defaultOpen={defaultOpen}>
      <div className="space-y-2 mt-2">
        {entries.map(([name, value]) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-40 shrink-0">
              <KeyInput name={name} onRename={(to) => onRename(name, to)} />
            </div>
            <div className="flex-1">
              {renderValue ? (
                renderValue(name, value, (v) => onSet(name, v))
              ) : (
                <input
                  className={`${inputCls} font-mono`}
                  value={value}
                  placeholder={placeholder}
                  onChange={(e) => onSet(name, e.target.value)}
                />
              )}
            </div>
            <DeleteBtn onClick={() => onRemove(name)} />
          </div>
        ))}
      </div>
      <AddButton label={`Add ${title.toLowerCase()} token`} onClick={onAdd} />
    </Accordion>
  );
}
