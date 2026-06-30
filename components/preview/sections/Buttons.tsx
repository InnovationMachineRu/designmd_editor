"use client";

import { useState, type CSSProperties } from "react";
import type { DesignDoc } from "@/lib/designmd/types";
import { resolveComponent } from "@/lib/designmd/tokens";
import type { Decor } from "../decor";
import type { Marker } from "../inspect";
import { Block, SectionHeader, darkSurface, type SectionProps } from "./common";

/**
 * A real, clickable preview button: hover + active (pressed) + focus states.
 * Alt+click selects its token (via mark) without triggering the press.
 */
export function LiveButton({
  doc,
  base,
  hover,
  label,
  decorExtra,
  disabled,
  mark,
}: {
  doc: DesignDoc;
  base: string;
  hover?: string;
  label: string;
  decorExtra?: CSSProperties;
  disabled?: boolean;
  mark: Marker;
}) {
  const [over, setOver] = useState(false);
  const [down, setDown] = useState(false);
  const style = resolveComponent(doc, doc.components[base]);
  const hoverStyle = hover ? resolveComponent(doc, doc.components[hover]) : {};
  const m = mark({ group: "components", key: base });

  return (
    <button
      type="button"
      disabled={disabled}
      {...m}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => {
        setOver(false);
        setDown(false);
      }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background 0.15s ease, box-shadow 0.12s ease, transform 0.06s ease",
        ...style,
        ...decorExtra,
        ...(over && !disabled ? hoverStyle : {}),
        ...(down && !disabled ? { transform: "translateY(1px)", filter: "brightness(0.96)" } : {}),
        ...m.style,
      }}
    >
      {label}
    </button>
  );
}

export function ButtonsSection({ doc, decor, mark }: SectionProps) {
  const dark = darkSurface(doc);
  return (
    <Block>
      <SectionHeader index="03" kicker="Button variants" title="Primary, secondary, ghost" />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <LiveButton doc={doc} base="button-primary" hover="button-primary-hover" label="Primary" decorExtra={decor.button} mark={mark} />
          <LiveButton doc={doc} base="button-secondary" label="Secondary" decorExtra={decor.button} mark={mark} />
          <LiveButton doc={doc} base="button-ghost" label="Ghost" mark={mark} />
          <LiveButton doc={doc} base="button-primary" label="Disabled" disabled mark={mark} />
        </div>

        {/* On a dark surface */}
        <div
          className="rounded-xl p-5 flex flex-wrap items-center gap-3"
          style={{ background: dark.bg, color: dark.fg }}
        >
          <span className="text-xs opacity-60 w-full">On dark surface</span>
          <LiveButton doc={doc} base="button-primary" hover="button-primary-hover" label="Primary" decorExtra={decor.button} mark={mark} />
          <LiveButton doc={doc} base="button-ghost" label="Ghost" mark={mark} />
        </div>
      </div>
    </Block>
  );
}
