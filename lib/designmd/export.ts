import { resolveValue } from "./tokens";
import { brandGradients } from "./color";
import type { DesignDoc, TypographyToken } from "./types";

function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** camelCase → kebab-case for component prop names. */
function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Resolved scalar component-token props as [name, prop, value]. */
function componentEntries(doc: DesignDoc): Array<[string, string, string]> {
  const out: Array<[string, string, string]> = [];
  for (const [name, token] of Object.entries(doc.components)) {
    for (const [prop, raw] of Object.entries(token)) {
      if (prop === "typography") continue; // typography refs are objects, skip
      const resolved = resolveValue(doc, raw as string);
      if (resolved) out.push([name, prop, resolved]);
    }
  }
  return out;
}

/** Brand gradients as [label, css] from the brandbook scheme (empty if none). */
function gradientEntries(doc: DesignDoc): Array<[string, string]> {
  const bb = doc.brandbook;
  if (!bb?.schemeColors?.length) return [];
  return brandGradients(bb.schemeColors, bb.gradients?.angle ?? 135).map(
    (g) => [g.label, g.css] as [string, string]
  );
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

  const componentVars = componentEntries(doc).map(
    ([name, prop, val]) =>
      `  --ds-component-${sanitizeName(name)}-${kebab(prop)}: ${val};`
  );
  appendGroup("Components", componentVars);

  const gradientVars = gradientEntries(doc).map(
    ([label, css]) => `  --ds-gradient-${sanitizeName(label)}: ${css};`
  );
  appendGroup("Gradients", gradientVars);

  const fontVars: string[] = [];
  if (doc.brandbook?.fonts.mono)
    fontVars.push(`  --ds-font-mono: ${doc.brandbook.fonts.mono};`);
  appendGroup("Fonts", fontVars);

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
  if (doc.brandbook?.fonts.mono)
    typoVars.push(`  --font-mono: ${doc.brandbook.fonts.mono};`);
  appendGroup("Typography", typoVars);

  const gradientVars = gradientEntries(doc).map(
    ([label, css]) => `  --gradient-${sanitizeName(label)}: ${css};`
  );
  appendGroup("Gradients", gradientVars);

  const themeBlock = `@theme {\n${body.join("\n")}\n}`;

  // Component tokens aren't @theme scale tokens → emit as a plain :root block.
  const componentVars = componentEntries(doc).map(
    ([name, prop, val]) => `  --component-${sanitizeName(name)}-${kebab(prop)}: ${val};`
  );
  if (!componentVars.length) return themeBlock;
  return `${themeBlock}\n\n/* Component tokens */\n:root {\n${componentVars.join("\n")}\n}`;
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

  const componentTokens: Record<string, unknown> = {};
  let hasComponents = false;
  for (const [name, token] of Object.entries(doc.components)) {
    const props: Record<string, string> = {};
    for (const [prop, raw] of Object.entries(token)) {
      if (prop === "typography") continue;
      const resolved = resolveValue(doc, raw as string);
      if (resolved) props[prop] = resolved;
    }
    if (Object.keys(props).length) {
      componentTokens[name] = props;
      hasComponents = true;
    }
  }
  if (hasComponents) root.component = componentTokens;

  const grads = gradientEntries(doc);
  if (grads.length) {
    const gradientTokens: Record<string, unknown> = { $type: "gradient" };
    for (const [label, css] of grads) gradientTokens[label] = { $value: css };
    root.gradient = gradientTokens;
  }

  if (doc.brandbook?.fonts.mono) {
    root.font = {
      $type: "fontFamily",
      mono: { $value: doc.brandbook.fonts.mono, $type: "fontFamily" },
    };
  }

  return JSON.stringify(root, null, 2);
}
