"use client";

import { useState } from "react";
import { AccordionExpandCtx } from "@/lib/accordionCtx";
import type { AccordionExpandSignal } from "@/lib/accordionCtx";
import { MetaBlock } from "./MetaBlock";
import { ColorsBlock } from "./ColorsBlock";
import { TypographyBlock } from "./TypographyBlock";
import { SpacingBlock } from "./SpacingBlock";
import { ShapesBlock } from "./ShapesBlock";
import { BreakpointsBlock } from "./BreakpointsBlock";
import { ComponentsBlock } from "./ComponentsBlock";
import { RationaleBlock } from "./RationaleBlock";

const ctrlBtn =
  "inline-flex items-center px-2 py-0.5 rounded text-[11px] border border-app-border text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors";

export function EditorPanel() {
  const [signal, setSignal] = useState<AccordionExpandSignal | null>(null);

  const fire = (open: boolean) =>
    setSignal((prev) => ({ v: (prev?.v ?? 0) + 1, open }));

  return (
    <AccordionExpandCtx.Provider value={signal}>
      <div className="space-y-3">
        <div className="flex justify-end gap-1">
          <button type="button" className={ctrlBtn} onClick={() => fire(true)}>
            Expand all
          </button>
          <button type="button" className={ctrlBtn} onClick={() => fire(false)}>
            Collapse all
          </button>
        </div>
        <MetaBlock />
        <ColorsBlock />
        <TypographyBlock />
        <SpacingBlock />
        <ShapesBlock />
        <BreakpointsBlock />
        <ComponentsBlock />
        <RationaleBlock />
      </div>
    </AccordionExpandCtx.Provider>
  );
}
