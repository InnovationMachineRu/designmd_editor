"use client";

import { useEditor } from "@/lib/store";
import { uniqueName } from "@/lib/uniqueName";
import { DEFAULT_BREAKPOINTS } from "@/lib/designmd/types";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls } from "@/components/ui/styles";
import { AddButton, DeleteBtn, KeyInput } from "./RowControls";

export function BreakpointsBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const { setBreakpoint, renameBreakpoint, addBreakpoint, removeBreakpoint } =
    useEditor.getState();

  const bp = doc.breakpoints ?? DEFAULT_BREAKPOINTS;
  const entries = Object.entries(bp).sort((a, b) => a[1] - b[1]);
  const usingDefault = !doc.breakpoints;

  return (
    <Accordion
      title="Breakpoints"
      subtitle={`${entries.length} · responsive widths${usingDefault ? " (default)" : ""}`}
    >
      <div className="space-y-2 mt-2">
        {entries.map(([name, value]) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-40 shrink-0">
              <KeyInput name={name} onRename={(to) => renameBreakpoint(name, to)} />
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                className={`${inputCls} font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
                value={value}
                onChange={(e) => {
                  if (e.target.value === "") return;
                  setBreakpoint(name, Number(e.target.value));
                }}
              />
              <span className="text-xs text-app-muted">px</span>
            </div>
            <DeleteBtn onClick={() => removeBreakpoint(name)} />
          </div>
        ))}
      </div>
      <AddButton
        label="Add breakpoint"
        onClick={() => addBreakpoint(uniqueName("bp", bp), 1440)}
      />
    </Accordion>
  );
}
