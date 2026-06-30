import type { DesignDoc, StylePreset } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const FONT = "Noto Serif";

const rounded: DesignDoc["rounded"] = {
  sm: "0.125rem",
  DEFAULT: "0.125rem",
  md: "0.25rem",
  lg: "0.375rem",
  xl: "0.625rem",
  full: "9999px",
};

const components = standardComponents({
  buttonRadius: "md",
  surfaceRadius: "md",
});

// Sumi ink on rice paper with vermilion (cinnabar) and pine-green accents.
const lightColors: DesignDoc["colors"] = {
  primary: "#B3402F",
  "on-primary": "#FBF9F4",
  "primary-hover": "#95301F",
  "primary-container": "#F0D9C8",
  "on-primary-container": "#5A1A10",
  secondary: "#2F4538",
  "on-secondary": "#FBF9F4",
  "secondary-container": "#D7E0D4",
  "on-secondary-container": "#1D2A20",
  tertiary: "#8A6D2F",
  "on-tertiary": "#FBF9F4",
  error: "#8C2F2F",
  "on-error": "#FBF9F4",
  "error-container": "#EAD2CC",
  "on-error-container": "#451210",
  background: "#F7F4EE",
  "on-background": "#1C1A17",
  surface: "#FBF9F4",
  "on-surface": "#1C1A17",
  "on-surface-variant": "#5A554C",
  "surface-container-low": "#F4F0E8",
  "surface-container": "#EFEBE1",
  "surface-container-high": "#E8E3D6",
  "surface-container-highest": "#E0DACB",
  outline: "#C8BFAE",
  "outline-variant": "#E4DCCB",
};

const darkColors: DesignDoc["colors"] = {
  primary: "#E2674F",
  "on-primary": "#3A0F08",
  "primary-hover": "#EC836E",
  "primary-container": "#5A2418",
  "on-primary-container": "#F8D6CC",
  secondary: "#9FB89A",
  "on-secondary": "#1C2A1E",
  "secondary-container": "#334636",
  "on-secondary-container": "#D2E0CE",
  tertiary: "#D4B872",
  "on-tertiary": "#352713",
  error: "#E68A7E",
  "on-error": "#451210",
  "error-container": "#5E241C",
  "on-error-container": "#F6D2CC",
  background: "#14130F",
  "on-background": "#E8E2D4",
  surface: "#1A1813",
  "on-surface": "#E8E2D4",
  "on-surface-variant": "#B5AE9C",
  "surface-container-low": "#161410",
  "surface-container": "#1F1C16",
  "surface-container-high": "#28241C",
  "surface-container-highest": "#322D23",
  outline: "#7C7461",
  "outline-variant": "#3C3729",
};

function doc(colors: DesignDoc["colors"]): DesignDoc {
  return {
    version: "alpha",
    name: "Asian",
    description: "Sumi ink on rice paper with vermilion accents and airy spacing.",
    colors,
    typography: typographyScale(FONT),
    rounded,
    spacing: baseSpacing,
    components,
    sections: rationale(
      "Asian",
      "an ink-and-paper system inspired by East-Asian aesthetics — sumi ink text, rice-paper surfaces, vermilion accents and generous negative space."
    ),
  };
}

export const asianPreset: StylePreset = {
  id: "asian",
  label: "Asian",
  description: "Ink on rice paper, vermilion accents.",
  decor: "asian",
  builtin: true,
  docs: { light: doc(lightColors), dark: doc(darkColors) },
};
