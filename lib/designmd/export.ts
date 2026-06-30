import { resolveValue } from "./tokens";
import type { DesignDoc, TypographyToken } from "./types";

function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TYPO_PROPS: Array<[keyof TypographyToken, string]> = [
  ["fontFamily", "font-family"],
  ["fontSize", "font-size"],
  ["fontWeight", "font-weight"],
  ["lineHeight", "line-height"],
  ["letterSpacing", "letter-spacing"],
  ["fontFeature", "font-feature-settings"],
  ["fontVariation", "font-variation-settings"],
];

interface DtcgTypographyValue {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

/** Build a CSS `:root { }` block with all resolved design tokens. */
export function docToCssVarsBlock(doc: DesignDoc): string {
  const body: string[] = [];

  function appendGroup(comment: string, vars: string[]): void {
    if (vars.length === 0) return;
    if (body.length > 0) body.push("");
    body.push(`  /* ${comment} */`);
    body.push(...vars);
  }

  const colorVars: string[] = [];
  for (const [name, value] of Object.entries(doc.colors)) {
    const resolved = resolveValue(doc, value);
    if (resolved) colorVars.push(`  --ds-color-${sanitizeName(name)}: ${resolved};`);
  }
  appendGroup("Colors", colorVars);

  const spacingVars: string[] = [];
  for (const [name, value] of Object.entries(doc.spacing)) {
    const resolved = resolveValue(doc, String(value));
    if (resolved) spacingVars.push(`  --ds-spacing-${sanitizeName(name)}: ${resolved};`);
  }
  appendGroup("Spacing", spacingVars);

  const roundedVars: string[] = [];
  for (const [name, value] of Object.entries(doc.rounded)) {
    const resolved = resolveValue(doc, value);
    if (resolved) roundedVars.push(`  --ds-rounded-${sanitizeName(name)}: ${resolved};`);
  }
  appendGroup("Rounded", roundedVars);

  const typoVars: string[] = [];
  for (const [scale, token] of Object.entries(doc.typography)) {
    const prefix = `--ds-typography-${sanitizeName(scale)}`;
    for (const [key, suffix] of TYPO_PROPS) {
      const raw = token[key];
      if (raw !== undefined && raw !== "")
        typoVars.push(`  ${prefix}-${suffix}: ${raw};`);
    }
  }
  appendGroup("Typography", typoVars);

  return `:root {\n${body.join("\n")}\n}`;
}

/** Build a Tailwind v4 `@theme { }` block. */
export function docToTailwindTheme(doc: DesignDoc): string {
  const body: string[] = [];

  function appendGroup(comment: string, vars: string[]): void {
    if (vars.length === 0) return;
    if (body.length > 0) body.push("");
    body.push(`  /* ${comment} */`);
    body.push(...vars);
  }

  const colorVars: string[] = [];
  for (const [name, value] of Object.entries(doc.colors)) {
    const resolved = resolveValue(doc, value);
    if (resolved) colorVars.push(`  --color-${sanitizeName(name)}: ${resolved};`);
  }
  appendGroup("Colors", colorVars);

  const spacingVars: string[] = [];
  for (const [name, value] of Object.entries(doc.spacing)) {
    const resolved = resolveValue(doc, String(value));
    if (resolved) spacingVars.push(`  --spacing-${sanitizeName(name)}: ${resolved};`);
  }
  appendGroup("Spacing", spacingVars);

  const roundedVars: string[] = [];
  for (const [name, value] of Object.entries(doc.rounded)) {
    const resolved = resolveValue(doc, value);
    if (resolved) roundedVars.push(`  --radius-${sanitizeName(name)}: ${resolved};`);
  }
  appendGroup("Border radius", roundedVars);

  const typoVars: string[] = [];
  for (const [scale, token] of Object.entries(doc.typography)) {
    const n = sanitizeName(scale);
    if (token.fontFamily) typoVars.push(`  --font-${n}: ${token.fontFamily};`);
    if (token.fontSize) typoVars.push(`  --text-${n}: ${token.fontSize};`);
    if (token.fontWeight) typoVars.push(`  --font-weight-${n}: ${token.fontWeight};`);
  }
  appendGroup("Typography", typoVars);

  return `@theme {\n${body.join("\n")}\n}`;
}

/** Build a W3C DTCG-compliant design tokens JSON string. */
export function docToDesignTokensJson(doc: DesignDoc): string {
  const root: Record<string, unknown> = {
    $schema: "https://tr.designtokens.org/format/",
  };

  const colorTokens: Record<string, unknown> = { $type: "color" };
  let hasColors = false;
  for (const [name, value] of Object.entries(doc.colors)) {
    const resolved = resolveValue(doc, value);
    if (resolved) {
      colorTokens[name] = { $value: resolved, $type: "color" };
      hasColors = true;
    }
  }
  if (hasColors) root.color = colorTokens;

  const spacingTokens: Record<string, unknown> = { $type: "dimension" };
  let hasSpacing = false;
  for (const [name, value] of Object.entries(doc.spacing)) {
    const resolved = resolveValue(doc, String(value));
    if (resolved) {
      spacingTokens[name] = { $value: resolved, $type: "dimension" };
      hasSpacing = true;
    }
  }
  if (hasSpacing) root.spacing = spacingTokens;

  const radiusTokens: Record<string, unknown> = { $type: "dimension" };
  let hasRadius = false;
  for (const [name, value] of Object.entries(doc.rounded)) {
    const resolved = resolveValue(doc, value);
    if (resolved) {
      radiusTokens[name] = { $value: resolved, $type: "dimension" };
      hasRadius = true;
    }
  }
  if (hasRadius) root["border-radius"] = radiusTokens;

  const typographyTokens: Record<string, unknown> = { $type: "typography" };
  let hasTypography = false;
  for (const [scale, token] of Object.entries(doc.typography)) {
    const composite: DtcgTypographyValue = {};
    if (token.fontFamily) composite.fontFamily = token.fontFamily;
    if (token.fontSize) composite.fontSize = token.fontSize;
    if (token.fontWeight) composite.fontWeight = String(token.fontWeight);
    if (token.lineHeight) composite.lineHeight = token.lineHeight;
    if (token.letterSpacing) composite.letterSpacing = token.letterSpacing;
    if (Object.keys(composite).length > 0) {
      typographyTokens[scale] = { $value: composite, $type: "typography" };
      hasTypography = true;
    }
  }
  if (hasTypography) root.typography = typographyTokens;

  return JSON.stringify(root, null, 2);
}
