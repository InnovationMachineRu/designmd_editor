"use client";

import { MetaBlock } from "./MetaBlock";
import { ColorsBlock } from "./ColorsBlock";
import { TypographyBlock } from "./TypographyBlock";
import { SpacingBlock } from "./SpacingBlock";
import { ShapesBlock } from "./ShapesBlock";
import { BreakpointsBlock } from "./BreakpointsBlock";
import { ComponentsBlock } from "./ComponentsBlock";
import { RationaleBlock } from "./RationaleBlock";

export function EditorPanel() {
  return (
    <div className="space-y-3">
      <MetaBlock />
      <ColorsBlock />
      <TypographyBlock />
      <SpacingBlock />
      <ShapesBlock />
      <BreakpointsBlock />
      <ComponentsBlock />
      <RationaleBlock />
    </div>
  );
}
