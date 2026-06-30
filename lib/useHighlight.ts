"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor } from "./store";
import type { HighlightTarget } from "./designmd/types";

/**
 * Wiring for an editor block to react to a preview selection. When the current
 * highlight targets this block's group it force-opens the accordion, scrolls to
 * the matching row (`data-tkey`), and exposes the active key for ring styling.
 */
export function useHighlight(
  group: HighlightTarget["group"],
  defaultOpen = false
) {
  const highlight = useEditor((s) => s.highlight);
  const targeted = highlight?.group === group ? highlight : null;
  const activeKey = targeted?.key ?? null;

  const [open, setOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  // Force-open and scroll when a matching token is selected in the preview.
  useEffect(() => {
    if (!activeKey) return;
    setOpen(true);
    const id = requestAnimationFrame(() => {
      const el = containerRef.current?.querySelector<HTMLElement>(
        `[data-tkey="${CSS.escape(activeKey)}"]`
      );
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [activeKey]);

  return { open, setOpen, activeKey, containerRef };
}

/** Ring style for the row matching the active highlight key. */
export function ringIf(active: boolean): string {
  return active ? "ring-2 ring-app-accent rounded-md" : "";
}
