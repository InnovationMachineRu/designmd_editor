"use client";

import { useId } from "react";
import { inputCls } from "@/components/ui/styles";

const FAMILIES = [
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Open Sans",
  "Lato",
  "Source Sans 3",
  "Nunito",
  "Work Sans",
  "Public Sans",
  "IBM Plex Sans",
  "system-ui",
  "Georgia",
  "Merriweather",
  "Playfair Display",
  "JetBrains Mono",
  "Fira Code",
  "monospace",
];

/** Combobox for font-family: suggestions via datalist, free text allowed. */
export function FontFamilyField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const listId = useId();
  return (
    <div className="flex items-center gap-2">
      <span
        className="shrink-0 w-8 h-8 rounded border border-app-border flex items-center justify-center text-app-text"
        style={{ fontFamily: value || "inherit" }}
        title={value}
        aria-hidden
      >
        Ag
      </span>
      <input
        className={inputCls}
        list={listId}
        value={value}
        placeholder="Inter"
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={listId}>
        {FAMILIES.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>
    </div>
  );
}
