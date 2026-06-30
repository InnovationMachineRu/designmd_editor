"use client";

import { useState, type ReactNode } from "react";
import type { DesignDoc, ReferableGroup } from "@/lib/designmd/types";
import { isRef, resolveValue } from "@/lib/designmd/tokens";
import { selectCls } from "@/components/ui/styles";

const CUSTOM = "__custom__";

/**
 * Dropdown picker for a `{group.token}` reference. Lists the group's tokens and
 * offers a "Custom…" option that reveals a literal editor (provided by the
 * caller via renderCustom). Shows a resolved preview and flags broken refs.
 */
export function TokenSelect({
  doc,
  group,
  value,
  onChange,
  renderCustom,
  previewKind = "color",
}: {
  doc: DesignDoc;
  group: ReferableGroup;
  value: string;
  onChange: (v: string) => void;
  /** Literal editor shown when "Custom…" is selected. */
  renderCustom: (value: string, onChange: (v: string) => void) => ReactNode;
  previewKind?: "color" | "text";
}) {
  const [forceCustom, setForceCustom] = useState(false);

  const ref = isRef(value);
  const custom = forceCustom || (!ref && value !== "");
  const tokens = Object.keys(doc[group] ?? {});
  const resolved = value ? resolveValue(doc, value) : undefined;

  // A reference is valid if its token key exists in the group. We can't rely on
  // resolveValue here because typography tokens resolve to objects (→ undefined).
  const refMatch = value.match(/^\{([\w-]+)\.([\w.-]+)\}$/);
  const refValid = refMatch
    ? (doc as unknown as Record<string, Record<string, unknown>>)[refMatch[1]]?.[
        refMatch[2]
      ] !== undefined
    : true;

  const selectValue = custom ? CUSTOM : ref ? value : "";

  const onSelect = (next: string) => {
    if (next === CUSTOM) {
      setForceCustom(true);
      // Seed the literal editor with the resolved value when coming from a ref.
      onChange(resolved ?? "");
    } else if (next === "") {
      setForceCustom(false);
      onChange("");
    } else {
      setForceCustom(false);
      onChange(next);
    }
  };

  return (
    <div className="flex-1 space-y-1.5">
      <div className="flex items-center gap-2">
        {previewKind === "color" && resolved && (
          <span
            className="shrink-0 w-5 h-5 rounded border border-app-border"
            style={{ background: resolved }}
            title={resolved}
          />
        )}
        <select
          className={`${selectCls} flex-1`}
          value={selectValue}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">— none —</option>
          {tokens.map((t) => (
            <option key={t} value={`{${group}.${t}}`}>
              {t}
            </option>
          ))}
          <option value={CUSTOM}>Custom…</option>
        </select>
        {ref && !refValid && (
          <span className="shrink-0 text-app-danger text-xs" title="Unresolved reference">
            ⚠
          </span>
        )}
        {previewKind === "text" && ref && resolved && (
          <span className="shrink-0 text-xs text-app-muted font-mono max-w-[40%] truncate">
            {resolved}
          </span>
        )}
      </div>
      {custom && <div>{renderCustom(value, onChange)}</div>}
    </div>
  );
}
