"use client";

import { useEditor } from "@/lib/store";
import { uniqueName } from "@/lib/uniqueName";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls, labelCls } from "@/components/ui/styles";
import { AddButton, DeleteBtn, KeyInput } from "./RowControls";
import { DimensionField } from "./controls/DimensionField";
import { FontWeightSelect } from "./controls/FontWeightSelect";
import { FontFamilyField } from "./controls/FontFamilyField";

export function TypographyBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const { setTypography, renameTypography, addTypography, removeTypography } =
    useEditor.getState();

  const entries = Object.entries(doc.typography);

  return (
    <Accordion title="Typography" subtitle={`${entries.length} scales`}>
      <div className="space-y-3 mt-2">
        {entries.map(([name, token]) => (
          <div key={name} className="rounded-md border border-app-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <KeyInput name={name} onRename={(to) => renameTypography(name, to)} />
              </div>
              <span
                className="text-app-text px-2 truncate max-w-[35%]"
                style={{
                  fontFamily: token.fontFamily,
                  fontWeight: token.fontWeight as never,
                  fontSize: 14,
                }}
                title="Preview"
              >
                Ag
              </span>
              <DeleteBtn onClick={() => removeTypography(name)} />
            </div>

            <div className="space-y-2.5">
              <div>
                <label className={labelCls}>family</label>
                <FontFamilyField
                  value={token.fontFamily ?? ""}
                  onChange={(v) => setTypography(name, { fontFamily: v || undefined })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>size</label>
                  <DimensionField
                    value={token.fontSize ?? "16px"}
                    onChange={(v) => setTypography(name, { fontSize: v })}
                    purpose="fontSize"
                    units={["px", "rem", "em"]}
                  />
                </div>
                <div>
                  <label className={labelCls}>weight</label>
                  <FontWeightSelect
                    value={token.fontWeight ?? "400"}
                    onChange={(v) => setTypography(name, { fontWeight: v })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>line height</label>
                  <DimensionField
                    value={token.lineHeight ?? "24px"}
                    onChange={(v) => setTypography(name, { lineHeight: v })}
                    purpose="lineHeight"
                    units={["px", "rem", ""]}
                  />
                </div>
                <div>
                  <label className={labelCls}>tracking</label>
                  <DimensionField
                    value={token.letterSpacing ?? "0em"}
                    onChange={(v) => setTypography(name, { letterSpacing: v })}
                    purpose="letterSpacing"
                    units={["em", "px"]}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>font feature (optional)</label>
                <input
                  className={`${inputCls} font-mono`}
                  value={token.fontFeature ?? ""}
                  placeholder='e.g. "tnum" 1'
                  onChange={(e) =>
                    setTypography(name, { fontFeature: e.target.value || undefined })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddButton
        label="Add scale"
        onClick={() => addTypography(uniqueName("text", doc.typography))}
      />
    </Accordion>
  );
}
