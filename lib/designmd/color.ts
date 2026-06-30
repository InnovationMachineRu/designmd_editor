// Color-space math for color-theory previews and the Brandbook harmony picker.
// All public helpers take and return hex strings (or HSL objects) so results
// round-trip into `contrastRatio` (contrast.ts) and into `doc.colors`.

import { contrastRatio } from "./contrast";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  /** Hue 0–360. */
  h: number;
  /** Saturation 0–100. */
  s: number;
  /** Lightness 0–100. */
  l: number;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** Parse `#rgb` / `#rrggbb` into RGB, or null for other forms. */
export function hexToRgb(hex: string): RGB | null {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** RGB (0–255 channels) → `#rrggbb`. */
export function rgbToHex({ r, g, b }: RGB): string {
  const to = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** RGB → HSL. */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

/** HSL → RGB. */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const hn = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hn < 60) [r, g, b] = [c, x, 0];
  else if (hn < 120) [r, g, b] = [x, c, 0];
  else if (hn < 180) [r, g, b] = [0, c, x];
  else if (hn < 240) [r, g, b] = [0, x, c];
  else if (hn < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/** Hex → HSL (returns null for non-hex). */
export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb) : null;
}

/** HSL → hex. */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

/** Rotate a color's hue by `deg` degrees (keeps S/L). Falls back to input if unparseable. */
export function rotateHue(hex: string, deg: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  return hslToHex({ ...hsl, h: hsl.h + deg });
}

export type SchemeName =
  | "monochromatic"
  | "complementary"
  | "analogous"
  | "triadic"
  | "tetradic";

/** Hue offsets (relative to the base) that define each harmony, base included. */
export const SCHEME_OFFSETS: Record<SchemeName, number[]> = {
  monochromatic: [0],
  complementary: [0, 180],
  analogous: [0, -30, 30],
  triadic: [0, 120, 240],
  tetradic: [0, 90, 180, 270],
};

/**
 * Derive a harmony palette from a base color. For "monochromatic" the single
 * hue is varied in lightness instead of rotated.
 */
export function harmony(hex: string, scheme: SchemeName): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];
  if (scheme === "monochromatic") {
    const steps = [0, -18, 18, -32];
    return steps.map((dl) => hslToHex({ ...hsl, l: clamp(hsl.l + dl, 8, 92) }));
  }
  return SCHEME_OFFSETS[scheme].map((deg) => rotateHue(hex, deg));
}

/** Mix two hex colors by ratio t (0 → a, 1 → b). */
export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  const k = clamp(t, 0, 1);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * k,
    g: ca.g + (cb.g - ca.g) * k,
    b: ca.b + (cb.b - ca.b) * k,
  });
}

/** Lighter color: mix toward white. */
export function tint(hex: string, t: number): string {
  return mix(hex, "#ffffff", t);
}

/** Darker color: mix toward black. */
export function shade(hex: string, t: number): string {
  return mix(hex, "#000000", t);
}

/** Muted color: mix toward mid-gray (reduces saturation/contrast). */
export function tone(hex: string, t: number): string {
  return mix(hex, "#808080", t);
}

/**
 * A symmetric tint→shade ramp of `steps` hex values centered on the color:
 * leftmost is the lightest tint, rightmost the darkest shade.
 */
export function rampHex(hex: string, steps = 11): string[] {
  const out: string[] = [];
  const last = steps - 1;
  for (let i = 0; i < steps; i++) {
    const t = i / last; // 0..1 light → dark
    if (t < 0.5) out.push(tint(hex, (0.5 - t) * 2 * 0.85));
    else out.push(shade(hex, (t - 0.5) * 2 * 0.8));
  }
  return out;
}

/** A {tint|shade|tone} ramp of hex values (light/dark/muted variations). */
export function variationRamp(
  hex: string,
  kind: "tint" | "shade" | "tone",
  steps = 6
): string[] {
  const fn = kind === "tint" ? tint : kind === "shade" ? shade : tone;
  return Array.from({ length: steps }, (_, i) => fn(hex, (i / (steps - 1)) * 0.85));
}

/** Derive brand gradients (CSS strings) from a scheme palette at an angle. */
export function brandGradients(
  schemeColors: string[],
  angle: number
): { label: string; css: string }[] {
  const [c0, c1, c2] = schemeColors;
  const a = c0 ?? "#888888";
  const b = c1 ?? rotateHue(a, 30);
  const c = c2 ?? tint(a, 0.4);
  return [
    { label: "Primary → Secondary", css: `linear-gradient(${angle}deg, ${a}, ${b})` },
    { label: "Primary → Tertiary", css: `linear-gradient(${angle}deg, ${a}, ${c})` },
    { label: "Tri-blend", css: `linear-gradient(${angle}deg, ${a}, ${b}, ${c})` },
    { label: "Radial glow", css: `radial-gradient(circle at 30% 30%, ${tint(a, 0.2)}, ${shade(a, 0.25)})` },
    { label: "Soft tint", css: `linear-gradient(${angle}deg, ${tint(a, 0.65)}, ${tint(b, 0.55)})` },
    { label: "Deep shade", css: `linear-gradient(${angle}deg, ${shade(a, 0.3)}, ${shade(b, 0.45)})` },
  ];
}

/** Choose the legible foreground (#fff or #111) for a given background hex. */
export function onColorFor(hex: string): string {
  const onWhite = contrastRatio("#111111", hex) ?? 0;
  const onLight = contrastRatio("#ffffff", hex) ?? 0;
  return onLight >= onWhite ? "#ffffff" : "#111111";
}
