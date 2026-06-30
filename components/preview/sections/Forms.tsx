"use client";

import { useState, type CSSProperties } from "react";
import { resolveComponent, color } from "@/lib/designmd/tokens";
import type { Decor } from "../decor";
import type { DesignDoc } from "@/lib/designmd/types";
import { Block, SectionHeader, type SectionProps } from "./common";

function fieldStyle(doc: DesignDoc, decor: Decor): CSSProperties {
  return {
    width: "100%",
    outline: "none",
    ...resolveComponent(doc, doc.components["input-field"]),
    ...decor.input,
  };
}

export function FormsSection({ doc, decor, mark }: SectionProps) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [topic, setTopic] = useState("general");
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));
  const m = () => mark({ group: "components", key: "input-field" });

  return (
    <Block>
      <SectionHeader index="08" kicker="Form elements" title="Editable inputs" />
      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4 max-w-2xl">
        <div>
          <label className="block text-xs mb-1" style={{ color: onSurfaceVar }}>Email</label>
          <input
            {...m()}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...fieldStyle(doc, decor), ...m().style }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: onSurfaceVar }}>Topic</label>
          <select
            {...m()}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ ...fieldStyle(doc, decor), ...m().style }}
          >
            <option value="general">General</option>
            <option value="billing">Billing</option>
            <option value="support">Support</option>
          </select>
        </div>
        <div className="@xl:col-span-2">
          <label className="block text-xs mb-1" style={{ color: onSurfaceVar }}>Message</label>
          <textarea
            {...m()}
            rows={3}
            placeholder="Type something — these fields are live."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{ ...fieldStyle(doc, decor), height: "auto", resize: "vertical", ...m().style }}
          />
        </div>
      </div>
    </Block>
  );
}
