import type { DesignDoc, StylePreset } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const FONT = "Inter";

const rounded: DesignDoc["rounded"] = {
  sm: "0.25rem",
  DEFAULT: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
};

const components = standardComponents({
  buttonRadius: "DEFAULT",
  surfaceRadius: "md",
});

const lightColors: DesignDoc["colors"] = {
  primary: "#111111",
  "on-primary": "#FFFFFF",
  "primary-hover": "#333333",
  "primary-container": "#ECECEC",
  "on-primary-container": "#111111",
  secondary: "#555555",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#F2F2F2",
  "on-secondary-container": "#111111",
  tertiary: "#6B7280",
  "on-tertiary": "#FFFFFF",
  error: "#C0392B",
  "on-error": "#FFFFFF",
  "error-container": "#FBE9E7",
  "on-error-container": "#5A1A12",
  background: "#FFFFFF",
  "on-background": "#111111",
  surface: "#FFFFFF",
  "on-surface": "#111111",
  "on-surface-variant": "#6B7280",
  "surface-container-low": "#FAFAFA",
  "surface-container": "#F5F5F5",
  "surface-container-high": "#EFEFEF",
  "surface-container-highest": "#E8E8E8",
  outline: "#D1D5DB",
  "outline-variant": "#E5E7EB",
};

const darkColors: DesignDoc["colors"] = {
  primary: "#FFFFFF",
  "on-primary": "#111111",
  "primary-hover": "#E0E0E0",
  "primary-container": "#2A2A2A",
  "on-primary-container": "#FFFFFF",
  secondary: "#A1A1AA",
  "on-secondary": "#111111",
  "secondary-container": "#27272A",
  "on-secondary-container": "#FFFFFF",
  tertiary: "#9CA3AF",
  "on-tertiary": "#111111",
  error: "#F87171",
  "on-error": "#3F0D0D",
  "error-container": "#4C1D1D",
  "on-error-container": "#FECACA",
  background: "#0A0A0A",
  "on-background": "#EDEDED",
  surface: "#0A0A0A",
  "on-surface": "#EDEDED",
  "on-surface-variant": "#A1A1AA",
  "surface-container-low": "#121212",
  "surface-container": "#171717",
  "surface-container-high": "#1F1F1F",
  "surface-container-highest": "#262626",
  outline: "#3F3F46",
  "outline-variant": "#27272A",
};

function doc(colors: DesignDoc["colors"]): DesignDoc {
  return {
    version: "alpha",
    name: "Minimal",
    description: "Neutral monochrome palette, tight radii, restrained typography.",
    colors,
    typography: typographyScale(FONT),
    rounded,
    spacing: baseSpacing,
    components,
    sections: rationale(
      "Minimal",
      "a restrained, neutral system: monochrome surfaces, small radii and generous whitespace."
    ),
  };
}

export const minimalPreset: StylePreset = {
  id: "minimal",
  label: "Минимализм",
  description: "Neutral monochrome, tight radii, clean type.",
  decor: "minimal",
  builtin: true,
  docs: { light: doc(lightColors), dark: doc(darkColors) },
};
