import type { DesignDoc, StylePreset } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const FONT = "Inter";

const rounded: DesignDoc["rounded"] = {
  sm: "0.5rem",
  DEFAULT: "0.75rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem",
  full: "9999px",
};

// Translucent surfaces define the glass identity (literal rgba, not tokens).
const darkGlass = {
  card: "rgba(255, 255, 255, 0.10)",
  cardElevated: "rgba(255, 255, 255, 0.20)",
  input: "rgba(255, 255, 255, 0.10)",
  ghost: "rgba(255, 255, 255, 0.05)",
};
const lightGlass = {
  card: "rgba(255, 255, 255, 0.60)",
  cardElevated: "rgba(255, 255, 255, 0.85)",
  input: "rgba(255, 255, 255, 0.55)",
  ghost: "rgba(15, 23, 42, 0.04)",
};

const components = standardComponents({
  buttonRadius: "xl",
  surfaceRadius: "lg",
  glass: darkGlass,
});
const lightComponents = standardComponents({
  buttonRadius: "xl",
  surfaceRadius: "lg",
  glass: lightGlass,
});

// Derived from the design.md "atmospheric-glass" example.
const darkColors: DesignDoc["colors"] = {
  primary: "#FFFFFF",
  "on-primary": "#2F3131",
  "primary-hover": "#E2E2E2",
  "primary-container": "#E2E2E2",
  "on-primary-container": "#636565",
  secondary: "#ADC9EB",
  "on-secondary": "#14324E",
  "secondary-container": "#304B68",
  "on-secondary-container": "#9FBBDD",
  tertiary: "#FFAFD3",
  "on-tertiary": "#620040",
  error: "#FFB4AB",
  "on-error": "#690005",
  "error-container": "#93000A",
  "on-error-container": "#FFDAD6",
  background: "#0B1326",
  "on-background": "#DAE2FD",
  surface: "#171F33",
  "on-surface": "#DAE2FD",
  "on-surface-variant": "#C4C7C8",
  "surface-container-low": "#131B2E",
  "surface-container": "#171F33",
  "surface-container-high": "#222A3D",
  "surface-container-highest": "#2D3449",
  outline: "#8E9192",
  "outline-variant": "#444748",
};

const lightColors: DesignDoc["colors"] = {
  primary: "#2F3A66",
  "on-primary": "#FFFFFF",
  "primary-hover": "#3A4880",
  "primary-container": "#DDE3F7",
  "on-primary-container": "#1A2147",
  secondary: "#4A6FA5",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#D3E0F5",
  "on-secondary-container": "#1A2B47",
  tertiary: "#8E4A6E",
  "on-tertiary": "#FFFFFF",
  error: "#B3261E",
  "on-error": "#FFFFFF",
  "error-container": "#F9DEDC",
  "on-error-container": "#410E0B",
  background: "#E8EEFC",
  "on-background": "#0B1326",
  surface: "#F3F6FF",
  "on-surface": "#0B1326",
  "on-surface-variant": "#3A4254",
  "surface-container-low": "#EEF2FD",
  "surface-container": "#F3F6FF",
  "surface-container-high": "#FFFFFF",
  "surface-container-highest": "#FFFFFF",
  outline: "#8A93A8",
  "outline-variant": "#C7CEDD",
};

function doc(
  colors: DesignDoc["colors"],
  comps: DesignDoc["components"]
): DesignDoc {
  return {
    version: "alpha",
    name: "Atmospheric Glass",
    description: "Translucent layered surfaces with soft blur and luminous accents.",
    colors,
    typography: typographyScale(FONT),
    rounded,
    spacing: baseSpacing,
    components: comps,
    sections: rationale(
      "Atmospheric Glass",
      "frosted translucent panels over a deep gradient, with high-radius pills and luminous text."
    ),
  };
}

export const glassPreset: StylePreset = {
  id: "glass",
  label: "Glassmorphism",
  description: "Frosted translucent panels, blur, luminous accents.",
  decor: "glass",
  builtin: true,
  docs: { light: doc(lightColors, lightComponents), dark: doc(darkColors, components) },
};
