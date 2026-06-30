// Type model mirroring the design.md (Google Labs) specification.
// Format: YAML front-matter (machine-readable tokens) + markdown body
// (human-readable rationale across canonical sections).

/** A CSS color string: hex, rgb()/rgba(), oklch(), or named. */
export type ColorValue = string;

/** A dimension (number + unit) or a token reference like "{rounded.lg}". */
export type DimensionValue = string;

/** Typography token — a group of font properties. */
export interface TypographyToken {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  fontFeature?: string;
  fontVariation?: string;
}

/**
 * Component token. Each value is either a literal (e.g. "48px", "rgba(...)")
 * or a token reference in curly braces (e.g. "{colors.primary}").
 */
export interface ComponentToken {
  backgroundColor?: string;
  textColor?: string;
  typography?: string;
  rounded?: string;
  padding?: string;
  size?: string;
  height?: string;
  width?: string;
}

/** Valid component token property keys (per spec). */
export const COMPONENT_PROPS = [
  "backgroundColor",
  "textColor",
  "typography",
  "rounded",
  "padding",
  "size",
  "height",
  "width",
] as const;

export type ComponentProp = (typeof COMPONENT_PROPS)[number];

/** Canonical markdown sections, in required order. */
export const CANONICAL_SECTIONS = [
  "Overview",
  "Colors",
  "Typography",
  "Layout",
  "Elevation & Depth",
  "Shapes",
  "Components",
  "Do's and Don'ts",
] as const;

export type CanonicalSection = (typeof CANONICAL_SECTIONS)[number];

/** Rationale prose keyed by canonical section heading. */
export type Sections = Partial<Record<CanonicalSection, string>>;

/** Text reading direction. */
export type Direction = "ltr" | "rtl";

/** Text flow axis. "vertical" maps to CSS vertical-rl in the preview. */
export type WritingMode = "horizontal" | "vertical";

/**
 * The full design document. The YAML front-matter maps to the token groups;
 * `sections` holds the markdown-body rationale.
 */
export interface DesignDoc {
  version?: string;
  name: string;
  description?: string;
  colors: Record<string, ColorValue>;
  typography: Record<string, TypographyToken>;
  rounded: Record<string, DimensionValue>;
  spacing: Record<string, DimensionValue | number>;
  components: Record<string, ComponentToken>;
  sections: Sections;
  /** Writing direction; defaults to "ltr" when omitted. Stored in x-design-md. */
  direction?: Direction;
  /** Writing flow; defaults to "horizontal" when omitted. Stored in x-design-md. */
  writingMode?: WritingMode;
}

/** The token groups that participate in `{group.token}` references. */
export type ReferableGroup = "colors" | "typography" | "rounded" | "spacing";

/** A token the user selected in the live preview, to highlight in the editor. */
export interface HighlightTarget {
  group: "colors" | "typography" | "components";
  key: string;
}

/** Theme variant selectable in the preview pane. */
export type ThemeMode = "light" | "dark";

/** Built-in visual style preset identifiers. */
export type PresetId =
  | "material"
  | "glass"
  | "minimal"
  | "neo"
  | "vintage"
  | "asian";

/**
 * Visual decoration family applied on top of resolved tokens in the preview
 * (blur, shadows, borders, backgrounds). Built-in presets use their own id;
 * custom presets pick one of these. "flat" is a neutral token-only look.
 */
export type DecorKind =
  | "material"
  | "glass"
  | "minimal"
  | "neo"
  | "vintage"
  | "asian"
  | "flat";

/**
 * A style preset bundles two full design documents (light + dark) so the
 * preview's theme toggle has a faithful palette for each mode.
 */
export interface StylePreset {
  /** Built-in ids match PresetId; custom presets use generated string ids. */
  id: string;
  label: string;
  description: string;
  /** Visual decoration family used to render the preview. */
  decor: DecorKind;
  /** False for user-created styles (persisted in the browser, deletable). */
  builtin: boolean;
  /** Document for each theme mode. The active one is what gets edited/saved. */
  docs: Record<ThemeMode, DesignDoc>;
}

/** Lint finding returned by the design.md CLI (or the JS fallback linter). */
export interface LintFinding {
  severity: "error" | "warning" | "info";
  path?: string;
  message: string;
}

export interface LintResult {
  findings: LintFinding[];
  summary: { errors: number; warnings: number; infos: number };
  /** "cli" when produced by @google/design.md, "fallback" for the JS linter. */
  source: "cli" | "fallback";
}
