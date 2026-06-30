"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { uniqueName } from "@/lib/uniqueName";
import { COMPONENT_PROPS, type ComponentProp } from "@/lib/designmd/types";
import { Accordion } from "@/components/ui/Accordion";
import { inputCls, labelCls } from "@/components/ui/styles";
import { AddButton, DeleteBtn, KeyInput } from "./RowControls";
import { ComponentPropField } from "./controls/ComponentPropField";

// Starting value when a property is first added to a component.
const PROP_DEFAULTS: Record<ComponentProp, string> = {
  backgroundColor: "{colors.surface-container}",
  textColor: "{colors.on-surface}",
  typography: "{typography.body-md}",
  rounded: "{rounded.DEFAULT}",
  padding: "12px",
  size: "40px",
  height: "44px",
  width: "100%",
};

export function ComponentsBlock() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const { setComponentProp, renameComponent, addComponent, removeComponent } =
    useEditor.getState();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const entries = Object.entries(doc.components).filter(([name]) =>
    q ? name.toLowerCase().includes(q) : true
  );

  return (
    <Accordion
      title="Components"
      subtitle={`${Object.keys(doc.components).length} components`}
    >
      <input
        className={`${inputCls} mt-2 mb-3`}
        value={query}
        placeholder="Search components…"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-3">
        {entries.map(([name, token]) => {
          const used = Object.keys(token) as ComponentProp[];
          const unused = COMPONENT_PROPS.filter((p) => !used.includes(p));
          return (
            <div key={name} className="rounded-md border border-app-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <KeyInput name={name} onRename={(to) => renameComponent(name, to)} />
                </div>
                <DeleteBtn onClick={() => removeComponent(name)} />
              </div>

              <div className="space-y-2.5">
                {used.map((prop) => (
                  <div key={prop} className="flex items-start gap-2">
                    <label className={`${labelCls} mb-0 w-[110px] shrink-0 pt-2`}>
                      {prop}
                    </label>
                    <ComponentPropField
                      doc={doc}
                      prop={prop}
                      value={token[prop] ?? ""}
                      onChange={(v) => setComponentProp(name, prop, v)}
                    />
                    <DeleteBtn
                      title="Remove property"
                      onClick={() => setComponentProp(name, prop, "")}
                    />
                  </div>
                ))}
              </div>

              {unused.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {unused.map((prop) => (
                    <button
                      key={prop}
                      type="button"
                      onClick={() => setComponentProp(name, prop, PROP_DEFAULTS[prop])}
                      className="text-[11px] px-2 py-0.5 rounded-full border border-app-border text-app-muted hover:text-app-text hover:border-app-accent transition-colors"
                    >
                      + {prop}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="text-xs text-app-muted py-2">No components match “{query}”.</p>
        )}
      </div>
      <AddButton
        label="Add component"
        onClick={() => addComponent(uniqueName("component", doc.components))}
      />
    </Accordion>
  );
}
