"use client";

import { useEditor } from "@/lib/store";
import { uniqueName } from "@/lib/uniqueName";
import { SimpleTokenBlock } from "./SimpleTokenBlock";
import { DimensionField } from "./controls/DimensionField";

export function SpacingBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const { setSpacing, renameSpacing, addSpacing, removeSpacing } =
    useEditor.getState();

  // spacing values may be number | string in the model; coerce to string for editing.
  const entries: [string, string][] = Object.entries(doc.spacing).map(
    ([k, v]) => [k, String(v)]
  );

  return (
    <SimpleTokenBlock
      title="Spacing"
      entries={entries}
      onSet={setSpacing}
      onRename={renameSpacing}
      onRemove={removeSpacing}
      onAdd={() => addSpacing(uniqueName("space", doc.spacing), "8px")}
      renderValue={(_name, value, onChange) => (
        <DimensionField
          value={value}
          onChange={onChange}
          purpose="spacing"
          units={["px", "rem", "em", "%"]}
        />
      )}
    />
  );
}
