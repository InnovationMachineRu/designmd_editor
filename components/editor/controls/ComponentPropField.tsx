"use client";

import type { ComponentProp, DesignDoc } from "@/lib/designmd/types";
import { inputCls } from "@/components/ui/styles";
import { ColorField } from "../ColorField";
import { TokenSelect } from "./TokenSelect";
import { RadiusField } from "./RadiusField";
import { BoxPaddingField } from "./BoxPaddingField";
import { DimensionField } from "./DimensionField";

/**
 * Picks the right editor for a component token property: a token-reference
 * dropdown bound to the relevant group, whose "Custom…" branch opens the most
 * appropriate literal editor (color picker, radius, box-padding, dimension).
 */
export function ComponentPropField({
  doc,
  prop,
  value,
  onChange,
}: {
  doc: DesignDoc;
  prop: ComponentProp;
  value: string;
  onChange: (v: string) => void;
}) {
  switch (prop) {
    case "backgroundColor":
    case "textColor":
      return (
        <TokenSelect
          doc={doc}
          group="colors"
          value={value}
          onChange={onChange}
          previewKind="color"
          renderCustom={(v, on) => <ColorField value={v} onChange={on} />}
        />
      );

    case "typography":
      return (
        <TokenSelect
          doc={doc}
          group="typography"
          value={value}
          onChange={onChange}
          previewKind="text"
          renderCustom={(v, on) => (
            <input
              className={`${inputCls} font-mono`}
              value={v}
              placeholder="{typography.body-md}"
              onChange={(e) => on(e.target.value)}
            />
          )}
        />
      );

    case "rounded":
      return (
        <TokenSelect
          doc={doc}
          group="rounded"
          value={value}
          onChange={onChange}
          previewKind="text"
          renderCustom={(v, on) => <RadiusField value={v} onChange={on} />}
        />
      );

    case "padding":
      return (
        <TokenSelect
          doc={doc}
          group="spacing"
          value={value}
          onChange={onChange}
          previewKind="text"
          renderCustom={(v, on) => <BoxPaddingField value={v} onChange={on} />}
        />
      );

    case "height":
    case "width":
    case "size":
      return (
        <TokenSelect
          doc={doc}
          group="spacing"
          value={value}
          onChange={onChange}
          previewKind="text"
          renderCustom={(v, on) => (
            <DimensionField value={v} onChange={on} purpose="size" units={["px", "rem", "%"]} />
          )}
        />
      );

    default:
      return (
        <input
          className={`${inputCls} font-mono`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
