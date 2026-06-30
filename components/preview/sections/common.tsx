"use client";

import type { CSSProperties, ReactNode } from "react";
import type { DesignDoc } from "@/lib/designmd/types";
import { color } from "@/lib/designmd/tokens";
import type { Decor } from "../decor";
import type { Marker } from "../inspect";

/** Shared props every documentation section receives. */
export interface SectionProps {
  doc: DesignDoc;
  decor: Decor;
  mark: Marker;
}

/** Numbered section header — small kicker caps + large title, as in the spec. */
export function SectionHeader({
  index,
  kicker,
  title,
}: {
  index: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-50 mb-2"
        style={{ color: "var(--dmd-color-on-background)" }}
      >
        {index} — {kicker}
      </div>
      <h2
        className="text-2xl @2xl:text-3xl font-bold"
        style={{ color: "var(--dmd-color-on-background)" }}
      >
        {title}
      </h2>
    </div>
  );
}

/** A section block with a top divider, matching the long-doc rhythm. */
export function Block({ children }: { children: ReactNode }) {
  return (
    <section
      className="py-8"
      style={{
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor:
          "color-mix(in srgb, var(--dmd-color-on-background) 12%, transparent)",
      }}
    >
      {children}
    </section>
  );
}

/**
 * Resolve a "dark mockup" surface (navy panels / highlighted pricing tile).
 * Uses inverse-surface when defined, else the darkest surface container, else a
 * computed deep tone derived from on-surface. Returns bg + matching foreground.
 */
export function darkSurface(doc: DesignDoc): { bg: string; fg: string } {
  const inverse = doc.colors["inverse-surface"];
  if (inverse) {
    return {
      bg: color(doc, "inverse-surface", "#1e2430"),
      fg: color(doc, "inverse-on-surface", "#ffffff"),
    };
  }
  const onSurface = color(doc, "on-surface", "#16181d");
  const surface = color(doc, "surface", "#ffffff");
  // If the system is already dark, the darkest container reads as the dark panel.
  const darkest = doc.colors["surface-container-highest"];
  if (darkest && isDark(color(doc, "surface-container-highest"))) {
    return { bg: color(doc, "surface-container-highest"), fg: onSurface };
  }
  // Otherwise use the on-surface ink as a deep panel with the surface as text.
  return { bg: onSurface, fg: surface };
}

/** Rough perceived-darkness test for a hex/rgb color. */
export function isDark(c: string): boolean {
  const m = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) {
    const rgb = c.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (rgb) {
      const [r, g, b] = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
      return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    }
    return false;
  }
  let h = m[1];
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/** Faint hairline border tuned to the current surface. */
export function hairline(): CSSProperties {
  return {
    border: "1px solid color-mix(in srgb, var(--dmd-color-on-background) 14%, transparent)",
  };
}

/** Resolve a component token style merged with optional decor extras. */
export { color };
