import type { DesignDoc, ThemeMode } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const rounded: DesignDoc["rounded"] = {
  sm: "0.25rem",
  DEFAULT: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

const components = standardComponents({
  buttonRadius: "DEFAULT",
  surfaceRadius: "lg",
});

// Neutral grayscale starting point — every standard role is defined so the
// gallery renders, but the palette is intentionally plain for customization.
const lightColors: DesignDoc["colors"] = {
  primary: "#3B82F6",
  "on-primary": "#FFFFFF",
  "primary-hover": "#2563EB",
  "primary-container": "#DBEAFE",
  "on-primary-container": "#1E3A8A",
  secondary: "#64748B",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#E2E8F0",
  "on-secondary-container": "#1E293B",
  tertiary: "#8B5CF6",
  "on-tertiary": "#FFFFFF",
  error: "#DC2626",
  "on-error": "#FFFFFF",
  "error-container": "#FEE2E2",
  "on-error-container": "#7F1D1D",
  background: "#FFFFFF",
  "on-background": "#0F172A",
  surface: "#FFFFFF",
  "on-surface": "#0F172A",
  "on-surface-variant": "#64748B",
  "surface-container-low": "#F8FAFC",
  "surface-container": "#F1F5F9",
  "surface-container-high": "#E2E8F0",
  "surface-container-highest": "#CBD5E1",
  outline: "#94A3B8",
  "outline-variant": "#E2E8F0",
};

const darkColors: DesignDoc["colors"] = {
  primary: "#60A5FA",
  "on-primary": "#0B1B33",
  "primary-hover": "#93C5FD",
  "primary-container": "#1E3A8A",
  "on-primary-container": "#DBEAFE",
  secondary: "#94A3B8",
  "on-secondary": "#0F172A",
  "secondary-container": "#334155",
  "on-secondary-container": "#E2E8F0",
  tertiary: "#A78BFA",
  "on-tertiary": "#1E1B4B",
  error: "#F87171",
  "on-error": "#450A0A",
  "error-container": "#7F1D1D",
  "on-error-container": "#FEE2E2",
  background: "#0B1220",
  "on-background": "#E2E8F0",
  surface: "#0F172A",
  "on-surface": "#E2E8F0",
  "on-surface-variant": "#94A3B8",
  "surface-container-low": "#0F172A",
  "surface-container": "#1E293B",
  "surface-container-high": "#293548",
  "surface-container-highest": "#334155",
  outline: "#475569",
  "outline-variant": "#1E293B",
};

function doc(name: string, colors: DesignDoc["colors"]): DesignDoc {
  return {
    version: "alpha",
    name,
    description: "A custom design system.",
    colors,
    typography: typographyScale("Inter"),
    rounded,
    spacing: baseSpacing,
    components,
    sections: rationale(name, "a custom design system — edit the tokens to make it your own."),
  };
}

/** Neutral starter documents for a new blank custom style. */
export function blankDocs(name = "Custom"): Record<ThemeMode, DesignDoc> {
  return { light: doc(name, lightColors), dark: doc(name, darkColors) };
}
