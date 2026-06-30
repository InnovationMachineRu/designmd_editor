import type {
  ComponentToken,
  DesignDoc,
  TypographyToken,
} from "./types";

import type { CSSProperties } from "react";

const REF_RE = /^\{([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_.-]+)\}$/;

/** True when a string is a single `{group.token}` reference. */
export function isRef(value: string): boolean {
  return REF_RE.test(value.trim());
}

/**
 * Resolve a value that may be a `{group.token}` reference into a concrete
 * value, following chains (a color referencing another color). Typography
 * references resolve to the object form via resolveTypographyRef instead.
 */
export function resolveValue(
  doc: DesignDoc,
  value: string | number | undefined,
  depth = 0
): string | undefined {
  if (value === undefined) return undefined;
  const str = String(value).trim();
  if (depth > 8) return str;

  const m = str.match(REF_RE);
  if (!m) return str;

  const [, group, token] = m;
  const bag = (doc as unknown as Record<string, Record<string, unknown>>)[group];
  const next = bag?.[token];
  if (next === undefined || next === null) return undefined;
  if (typeof next === "object") return undefined; // e.g. a typography object
  return resolveValue(doc, next as string, depth + 1);
}

/** Resolve a typography reference (or inline token) to font CSS properties. */
export function resolveTypography(
  doc: DesignDoc,
  ref: string | undefined
): CSSProperties {
  if (!ref) return {};
  const m = ref.trim().match(REF_RE);
  let token: TypographyToken | undefined;
  if (m && m[1] === "typography") {
    token = doc.typography[m[2]];
  }
  if (!token) return {};
  const css: CSSProperties = {};
  if (token.fontFamily) css.fontFamily = token.fontFamily;
  if (token.fontSize) css.fontSize = token.fontSize;
  if (token.fontWeight) css.fontWeight = token.fontWeight as CSSProperties["fontWeight"];
  if (token.lineHeight) css.lineHeight = token.lineHeight;
  if (token.letterSpacing) css.letterSpacing = token.letterSpacing;
  if (token.fontFeature) css.fontFeatureSettings = token.fontFeature;
  if (token.fontVariation)
    css.fontVariationSettings = token.fontVariation as string;
  return css;
}

/**
 * Resolve a component token into a concrete React style object, expanding any
 * `{group.token}` references and inlining typography.
 */
export function resolveComponent(
  doc: DesignDoc,
  comp: ComponentToken | undefined
): CSSProperties {
  if (!comp) return {};
  const css: CSSProperties = {};
  const bg = resolveValue(doc, comp.backgroundColor);
  const fg = resolveValue(doc, comp.textColor);
  const rounded = resolveValue(doc, comp.rounded);
  const padding = resolveValue(doc, comp.padding);
  const height = resolveValue(doc, comp.height);
  const width = resolveValue(doc, comp.width);
  const size = resolveValue(doc, comp.size);

  if (bg) css.background = bg;
  if (fg) css.color = fg;
  if (rounded) css.borderRadius = rounded;
  if (padding) css.padding = padding;
  if (height) css.height = height;
  if (width) css.width = width;
  if (size) {
    css.width = css.width ?? size;
    css.height = css.height ?? size;
  }
  Object.assign(css, resolveTypography(doc, comp.typography));
  return css;
}

/** A color role used as the preview surface, with sensible fallbacks. */
function pickColor(doc: DesignDoc, roles: string[]): string | undefined {
  for (const r of roles) {
    if (doc.colors[r]) return doc.colors[r];
  }
  return undefined;
}

/**
 * Project a design document into CSS custom properties that the preview pane
 * (and its gallery) consume. Colors become `--dmd-color-*`, rounding becomes
 * `--dmd-rounded-*`, spacing becomes `--dmd-spacing-*`. References are resolved.
 */
export function docToCssVars(doc: DesignDoc): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, value] of Object.entries(doc.colors)) {
    const resolved = resolveValue(doc, value);
    if (resolved) vars[`--dmd-color-${name}`] = resolved;
  }
  for (const [name, value] of Object.entries(doc.rounded)) {
    const resolved = resolveValue(doc, value);
    if (resolved) vars[`--dmd-rounded-${name}`] = resolved;
  }
  for (const [name, value] of Object.entries(doc.spacing)) {
    const resolved = resolveValue(doc, String(value));
    if (resolved) vars[`--dmd-spacing-${name}`] = resolved;
  }

  // Surface roles drive the .dmd-preview background/text.
  const bg =
    pickColor(doc, ["background", "surface", "surface-container"]) ?? "#ffffff";
  const onBg =
    pickColor(doc, ["on-background", "on-surface"]) ?? "#111111";
  vars["--dmd-color-background"] = bg;
  vars["--dmd-color-on-background"] = onBg;

  return vars;
}

/** Get a resolved color by role name (for gallery components). */
export function color(
  doc: DesignDoc,
  role: string,
  fallback = "transparent"
): string {
  return resolveValue(doc, doc.colors[role]) ?? fallback;
}

/** Get a resolved rounding value by scale name. */
export function rounding(doc: DesignDoc, scale: string, fallback = "0"): string {
  return resolveValue(doc, doc.rounded[scale]) ?? fallback;
}
