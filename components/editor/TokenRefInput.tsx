"use client";

import { useId } from "react";
import type { DesignDoc, ReferableGroup } from "@/lib/designmd/types";
import { isRef, resolveValue } from "@/lib/designmd/tokens";
import { inputCls } from "@/components/ui/styles";

const DEFAULT_GROUPS: ReferableGroup[] = [
  "colors",
  "typography",
  "rounded",
  "spacing",
];

/**
 * Text input that suggests `{group.token}` references from the current document
 * via a datalist, while still allowing literal values. Shows a resolved color
 * swatch when the value resolves to a color.
 */
export function TokenRefInput({
  doc,
  value,
  onChange,
  groups = DEFAULT_GROUPS,
  placeholder,
}: {
  doc: DesignDoc;
  value: string;
  onChange: (v: string) => void;
  groups?: ReferableGroup[];
  placeholder?: string;
}) {
  const listId = useId();
  const options: string[] = [];
  for (const g of groups) {
    for (const token of Object.keys(doc[g] ?? {})) {
      options.push(`{${g}.${token}}`);
    }
  }

  const resolved = value ? resolveValue(doc, value) : undefined;
  const looksColor =
    resolved !== undefined &&
    /^(#|rgb|hsl|oklch|oklab|color\()|^(transparent|currentColor)$/i.test(
      resolved.trim()
    );

  return (
    <div className="flex items-center gap-2">
      {looksColor && (
        <span
          className="shrink-0 w-5 h-5 rounded border border-app-border"
          style={{ background: resolved }}
          title={resolved}
        />
      )}
      <input
        className={inputCls}
        list={listId}
        value={value}
        placeholder={placeholder ?? "value or {group.token}"}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
      {isRef(value) && resolved === undefined && (
        <span className="shrink-0 text-app-danger text-xs" title="Unresolved reference">
          ⚠
        </span>
      )}
    </div>
  );
}
