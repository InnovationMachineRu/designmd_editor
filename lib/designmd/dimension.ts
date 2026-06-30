// Parsing/formatting of CSS dimension values (number + unit) used by the
// slider/stepper controls. Token references and multi-value shorthands return
// null so callers can fall back to a text input.

export interface Dimension {
  value: number;
  /** "" represents a unitless value (e.g. lineHeight: 1.5). */
  unit: string;
}

export const COMMON_UNITS = ["px", "rem", "em", "%", ""] as const;

const DIMENSION_RE = /^(-?\d*\.?\d+)\s*(px|rem|em|%|vh|vw|ch|pt)?$/;

/** Parse "16px" | "0.5rem" | "-0.02em" | "8" | "100%" → {value, unit}. */
export function parseDimension(input: string | number | undefined): Dimension | null {
  if (input === undefined || input === null) return null;
  const str = String(input).trim();
  if (str === "") return null;
  const m = str.match(DIMENSION_RE);
  if (!m) return null;
  const value = Number(m[1]);
  if (Number.isNaN(value)) return null;
  return { value, unit: m[2] ?? "" };
}

/** Format a Dimension back into a CSS string. Integers stay integers. */
export function formatDimension(d: Dimension): string {
  const num = Number.isInteger(d.value) ? String(d.value) : String(d.value);
  return `${num}${d.unit}`;
}

/** Slider range/step defaults per purpose, chosen for sensible drag behavior. */
export interface Range {
  min: number;
  max: number;
  step: number;
}

export const RANGES: Record<string, Partial<Record<string, Range>>> = {
  fontSize: {
    px: { min: 8, max: 128, step: 1 },
    rem: { min: 0.5, max: 8, step: 0.0625 },
    em: { min: 0.5, max: 8, step: 0.0625 },
  },
  lineHeight: {
    px: { min: 8, max: 160, step: 1 },
    rem: { min: 0.5, max: 10, step: 0.0625 },
    "": { min: 0.8, max: 3, step: 0.05 },
  },
  letterSpacing: {
    em: { min: -0.1, max: 0.4, step: 0.005 },
    px: { min: -4, max: 8, step: 0.1 },
  },
  spacing: {
    px: { min: 0, max: 128, step: 1 },
    rem: { min: 0, max: 8, step: 0.0625 },
  },
  radius: {
    px: { min: 0, max: 64, step: 1 },
    rem: { min: 0, max: 4, step: 0.0625 },
  },
  size: {
    px: { min: 0, max: 320, step: 1 },
    rem: { min: 0, max: 20, step: 0.0625 },
    "%": { min: 0, max: 100, step: 1 },
  },
};

const FALLBACK_RANGE: Range = { min: 0, max: 100, step: 1 };

/** Resolve the slider range for a given purpose + unit, with safe fallback. */
export function rangeFor(purpose: string, unit: string): Range {
  return RANGES[purpose]?.[unit] ?? RANGES[purpose]?.px ?? FALLBACK_RANGE;
}
