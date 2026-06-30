import { DEFAULT_BREAKPOINTS, type DesignDoc } from "@/lib/designmd/types";

export interface Device {
  /** Stable id stored in previewDevice ("fit" | "mobile" | breakpoint name). */
  id: string;
  label: string;
  /** Frame width in px, or null for "fit" (100%). */
  width: number | null;
}

/**
 * Build the device list for the simulator: a "Fit" (full width), a small mobile
 * default, then one device per defined breakpoint (its min-width = frame width).
 */
export function devicesFor(doc: DesignDoc): Device[] {
  const bp = doc.breakpoints ?? DEFAULT_BREAKPOINTS;
  const sorted = Object.entries(bp).sort((a, b) => a[1] - b[1]);
  const smallest = sorted.length ? sorted[0][1] : 640;

  const list: Device[] = [{ id: "fit", label: "Fit", width: null }];
  // A phone width below the smallest breakpoint, if there's room.
  if (smallest > 400) list.push({ id: "mobile", label: "Mobile", width: 375 });
  for (const [name, width] of sorted) {
    list.push({ id: name, label: `${name} · ${width}`, width });
  }
  return list;
}

/** Resolve the active device's frame width (null = fit). */
export function deviceWidth(doc: DesignDoc, id: string): number | null {
  return devicesFor(doc).find((d) => d.id === id)?.width ?? null;
}
