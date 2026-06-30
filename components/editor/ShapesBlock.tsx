"use client";

import { useEditor } from "@/lib/store";
import { uniqueName } from "@/lib/uniqueName";
import { SimpleTokenBlock } from "./SimpleTokenBlock";
import { RadiusField } from "./controls/RadiusField";

export function ShapesBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const { setRounded, renameRounded, addRounded, removeRounded } =
    useEditor.getState();

  return (
    <SimpleTokenBlock
      title="Shapes (rounded)"
      entries={Object.entries(doc.rounded)}
      onSet={setRounded}
      onRename={renameRounded}
      onRemove={removeRounded}
      onAdd={() => addRounded(uniqueName("radius", doc.rounded), "0.5rem")}
      highlightGroup="rounded"
      renderValue={(_name, value, onChange) => (
        <RadiusField value={value} onChange={onChange} />
      )}
    />
  );
}
