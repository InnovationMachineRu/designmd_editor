"use client";

import { useEditor } from "@/lib/store";
import { CANONICAL_SECTIONS } from "@/lib/designmd/types";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls } from "@/components/ui/styles";

export function RationaleBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const setSection = useEditor((s) => s.setSection);
  const setSectionAuto = useEditor((s) => s.setSectionAuto);

  const autoCount = CANONICAL_SECTIONS.filter(
    (s) => (doc.sectionsAuto?.[s] ?? true)
  ).length;

  return (
    <Accordion
      title="Rationale (markdown)"
      subtitle={`${autoCount}/${CANONICAL_SECTIONS.length} auto-generated`}
    >
      <div className="space-y-3 mt-2">
        {CANONICAL_SECTIONS.map((section) => {
          const auto = doc.sectionsAuto?.[section] ?? true;
          return (
            <div key={section}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-app-text">
                  ## {section}
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-app-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={auto}
                    onChange={(e) => setSectionAuto(section, e.target.checked)}
                    className="accent-app-accent"
                  />
                  Auto
                </label>
              </div>
              <textarea
                className={`${inputCls} min-h-[64px] resize-y leading-relaxed ${
                  auto ? "opacity-60" : ""
                }`}
                value={doc.sections[section] ?? ""}
                readOnly={auto}
                placeholder={
                  auto ? `Auto-generated from tokens…` : `Rationale for ${section}…`
                }
                onChange={(e) => !auto && setSection(section, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </Accordion>
  );
}
