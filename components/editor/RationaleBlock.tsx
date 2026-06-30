"use client";

import { useEditor } from "@/lib/store";
import { CANONICAL_SECTIONS } from "@/lib/designmd/types";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls } from "@/components/ui/styles";

export function RationaleBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const setSection = useEditor((s) => s.setSection);

  const filled = CANONICAL_SECTIONS.filter((s) => doc.sections[s]?.trim()).length;

  return (
    <Accordion
      title="Rationale (markdown)"
      subtitle={`${filled}/${CANONICAL_SECTIONS.length} canonical sections`}
    >
      <div className="space-y-3 mt-2">
        {CANONICAL_SECTIONS.map((section) => (
          <div key={section}>
            <label className="block text-xs font-semibold text-app-text mb-1">
              ## {section}
            </label>
            <textarea
              className={`${inputCls} min-h-[64px] resize-y leading-relaxed`}
              value={doc.sections[section] ?? ""}
              placeholder={`Rationale for ${section}…`}
              onChange={(e) => setSection(section, e.target.value)}
            />
          </div>
        ))}
      </div>
    </Accordion>
  );
}
