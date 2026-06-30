"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { HighlightTarget } from "@/lib/designmd/types";

/**
 * Props applied to a preview element to make it Alt/Option‑selectable for token
 * inspection. Without the modifier these handlers do nothing, so the element
 * behaves like a normal interactive component.
 */
export interface MarkProps {
  onClickCapture: (e: React.MouseEvent) => void;
  onMouseDownCapture: (e: React.MouseEvent) => void;
  "data-selectable": "";
  title: string;
  style: CSSProperties;
}

export type Marker = (target: HighlightTarget) => MarkProps;

const RING: CSSProperties = {
  outline: "2px solid var(--color-app-accent, #4f8cff)",
  outlineOffset: 2,
};

/**
 * Build a `mark(target)` factory. Selection only fires on Alt+click; in the
 * capture phase we preventDefault + stopPropagation so the element's real action
 * (button press, caret placement) doesn't also happen.
 */
export function makeMark(
  highlight: HighlightTarget | null,
  setHighlight: (t: HighlightTarget | null) => void
): Marker {
  return (target) => {
    const active =
      highlight?.group === target.group && highlight?.key === target.key;
    return {
      onClickCapture: (e) => {
        if (!e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        setHighlight(active ? null : target);
      },
      onMouseDownCapture: (e) => {
        if (e.altKey) e.preventDefault();
      },
      "data-selectable": "",
      title: `⌥ + click → ${target.group}.${target.key}`,
      style: active ? RING : {},
    };
  };
}

/** Track whether the Alt/Option key is currently held (preview inspect mode). */
export function useInspect(): boolean {
  const [altHeld, setAltHeld] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => setAltHeld(e.altKey);
    const onBlur = () => setAltHeld(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return altHeld;
}
