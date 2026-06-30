"use client";

import { useEditor } from "@/lib/store";

function Segment<T extends string>({
  value,
  options,
  onChange,
  title,
}: {
  value: T;
  options: { v: T; label: string }[];
  onChange: (v: T) => void;
  title: string;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-app-border p-0.5 bg-app-panel"
      title={title}
    >
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            value === o.v ? "bg-app-accent text-app-on-accent" : "text-app-muted hover:text-app-text"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Toggles for writing direction (LTR/RTL) and flow (horizontal/vertical). */
export function DirectionControls() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const setDirection = useEditor((s) => s.setDirection);
  const setWritingMode = useEditor((s) => s.setWritingMode);

  const dir = doc.direction ?? "ltr";
  const flow = doc.writingMode ?? "horizontal";

  return (
    <div className="flex items-center gap-2">
      <Segment
        title="Text direction"
        value={dir}
        onChange={setDirection}
        options={[
          { v: "ltr", label: "LTR" },
          { v: "rtl", label: "RTL" },
        ]}
      />
      <Segment
        title="Writing flow"
        value={flow}
        onChange={setWritingMode}
        options={[
          { v: "horizontal", label: "↔" },
          { v: "vertical", label: "↕" },
        ]}
      />
    </div>
  );
}
