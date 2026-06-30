"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { uniqueName } from "@/lib/uniqueName";
import { resolveValue } from "@/lib/designmd/tokens";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls } from "@/components/ui/styles";
import { ColorField } from "./ColorField";
import { ContrastBadge } from "./controls/ContrastBadge";
import { AddButton, DeleteBtn, KeyInput } from "./RowControls";

export function ColorsBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const { setColor, renameColor, addColor, removeColor } = useEditor.getState();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const entries = Object.entries(doc.colors).filter(([name]) =>
    q ? name.toLowerCase().includes(q) : true
  );

  return (
    <Accordion title="Colors" subtitle={`${Object.keys(doc.colors).length} tokens`} defaultOpen>
      <input
        className={`${inputCls} mt-2 mb-3`}
        value={query}
        placeholder="Search colors…"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-2">
        {entries.map(([name, value]) => {
          // Pair `on-X` foregrounds with their base `X` surface for a WCAG check.
          const base = name.startsWith("on-") ? name.slice(3) : null;
          const baseValue = base ? doc.colors[base] : undefined;
          const fg = resolveValue(doc, value);
          const bg = baseValue ? resolveValue(doc, baseValue) : undefined;

          return (
            <div key={name} className="flex items-center gap-2">
              <div className="w-40 shrink-0">
                <KeyInput name={name} onRename={(to) => renameColor(name, to)} />
              </div>
              <div className="flex-1">
                <ColorField value={value} onChange={(v) => setColor(name, v)} />
              </div>
              {fg && bg && (
                <ContrastBadge fg={fg} bg={bg} pairLabel={base ?? undefined} />
              )}
              <DeleteBtn onClick={() => removeColor(name)} />
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="text-xs text-app-muted py-2">No colors match “{query}”.</p>
        )}
      </div>
      <AddButton
        label="Add color"
        onClick={() => addColor(uniqueName("color", doc.colors), "#888888")}
      />
    </Accordion>
  );
}
