"use client";

import { useEditor } from "@/lib/store";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls, labelCls } from "@/components/ui/styles";

export function MetaBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const setMeta = useEditor((s) => s.setMeta);

  return (
    <Accordion title="Meta" subtitle="name · description · version" defaultOpen>
      <div className="grid grid-cols-1 gap-3 mt-2">
        <div>
          <label className={labelCls}>name</label>
          <input
            className={inputCls}
            value={doc.name}
            onChange={(e) => setMeta({ name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>description</label>
          <input
            className={inputCls}
            value={doc.description ?? ""}
            placeholder="Optional"
            onChange={(e) => setMeta({ description: e.target.value || undefined })}
          />
        </div>
        <div>
          <label className={labelCls}>version</label>
          <input
            className={inputCls}
            value={doc.version ?? ""}
            placeholder="alpha"
            onChange={(e) => setMeta({ version: e.target.value || undefined })}
          />
        </div>
      </div>
    </Accordion>
  );
}
