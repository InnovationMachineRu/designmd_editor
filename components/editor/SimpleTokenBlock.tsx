"use client";

import type { ReactNode } from "react";
import type { HighlightTarget } from "@/lib/designmd/types";
import { useHighlight, ringIf } from "@/lib/useHighlight";
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
  highlightGroup,
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
  /** Enables preview→editor highlight linking for this group. */
  highlightGroup?: HighlightTarget["group"];
}) {
  // Hook always called; when no group is given, nothing in the preview targets it.
  const { open, setOpen, activeKey, containerRef } = useHighlight(
    highlightGroup ?? "components",
    defaultOpen
  );
  const controlled = highlightGroup !== undefined;

  return (
    <Accordion
      title={title}
      subtitle={`${entries.length} tokens`}
      defaultOpen={defaultOpen}
      open={controlled ? open : undefined}
      onOpenChange={controlled ? setOpen : undefined}
    >
      <div className="space-y-2 mt-2" ref={controlled ? containerRef : undefined}>
        {entries.map(([name, value]) => (
          <div
            key={name}
            data-tkey={controlled ? name : undefined}
            className={`flex items-center gap-2 ${controlled ? `p-1 -m-1 ${ringIf(activeKey === name)}` : ""}`}
          >
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
