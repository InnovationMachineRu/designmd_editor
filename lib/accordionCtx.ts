"use client";

import { createContext } from "react";

export interface AccordionExpandSignal {
  v: number;
  open: boolean;
}

/**
 * Context that carries a version-stamped expand/collapse signal for all
 * Accordion instances inside an EditorPanel. When `v` increments, every
 * accordion (controlled or uncontrolled) adopts the `open` value.
 */
export const AccordionExpandCtx = createContext<AccordionExpandSignal | null>(null);
