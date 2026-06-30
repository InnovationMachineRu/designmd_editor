"use client";

import { useEditor } from "@/lib/store";
import { devicesFor } from "./devices";

/** Segmented control to switch the preview frame width (responsive simulator). */
export function DeviceSelector() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const device = useEditor((s) => s.previewDevice);
  const setDevice = useEditor((s) => s.setPreviewDevice);

  const devices = devicesFor(doc);

  return (
    <div className="inline-flex rounded-lg border border-app-border p-0.5 bg-app-panel">
      {devices.map((d) => (
        <button
          key={d.id}
          type="button"
          title={d.width ? `${d.width}px` : "Full width"}
          onClick={() => setDevice(d.id)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            device === d.id ? "bg-app-accent text-app-on-accent" : "text-app-muted hover:text-app-text"
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
