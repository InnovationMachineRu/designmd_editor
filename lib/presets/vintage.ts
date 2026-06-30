import type { DesignDoc, StylePreset } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const FONT = "Merriweather";

const rounded: DesignDoc["rounded"] = {
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
};

const components = standardComponents({
  buttonRadius: "DEFAULT",
  surfaceRadius: "md",
});

// Warm sepia, aged-paper palette with oxblood and olive accents.
const lightColors: DesignDoc["colors"] = {
  primary: "#8C3B2F",
  "on-primary": "#FAF3E0",
  "primary-hover": "#6F2D24",
  "primary-container": "#E7C9A0",
  "on-primary-container": "#4A2A16",
  secondary: "#5C6B4F",
  "on-secondary": "#FAF3E0",
  "secondary-container": "#D8D2B0",
  "on-secondary-container": "#2F3A24",
  tertiary: "#9C6B3F",
  "on-tertiary": "#FAF3E0",
  error: "#9B2C2C",
  "on-error": "#FAF3E0",
  "error-container": "#E8C9B8",
  "on-error-container": "#4A1410",
  background: "#F4ECD8",
  "on-background": "#3B2F2A",
  surface: "#FAF3E0",
  "on-surface": "#3B2F2A",
  "on-surface-variant": "#6F5B4E",
  "surface-container-low": "#F2E8D2",
  "surface-container": "#EDE2CB",
  "surface-container-high": "#E6D9BE",
  "surface-container-highest": "#DFD0B2",
  outline: "#B6A07E",
  "outline-variant": "#D8C6A8",
};

const darkColors: DesignDoc["colors"] = {
  primary: "#D89A6A",
  "on-primary": "#3A1E12",
  "primary-hover": "#E6B488",
  "primary-container": "#5C3522",
  "on-primary-container": "#F4D8BE",
  secondary: "#AEB78F",
  "on-secondary": "#2A301C",
  "secondary-container": "#404A30",
  "on-secondary-container": "#D8DCB8",
  tertiary: "#D6A878",
  "on-tertiary": "#3A2412",
  error: "#E69B8E",
  "on-error": "#451612",
  "error-container": "#5E2820",
  "on-error-container": "#F4D2C8",
  background: "#241C16",
  "on-background": "#ECE0C8",
  surface: "#2A2018",
  "on-surface": "#ECE0C8",
  "on-surface-variant": "#C2B299",
  "surface-container-low": "#251D15",
  "surface-container": "#2F251B",
  "surface-container-high": "#3A2E22",
  "surface-container-highest": "#453828",
  outline: "#8C7B62",
  "outline-variant": "#4A3D2E",
};

function doc(colors: DesignDoc["colors"]): DesignDoc {
  return {
    version: "alpha",
    name: "Vintage",
    description: "Warm aged-paper palette, serif type and restrained radii.",
    colors,
    typography: typographyScale(FONT),
    rounded,
    spacing: baseSpacing,
    components,
    sections: rationale(
      "Vintage",
      "a warm, nostalgic system on aged paper — sepia surfaces, serif type, oxblood and olive accents."
    ),
  };
}

export const vintagePreset: StylePreset = {
  id: "vintage",
  label: "Vintage",
  description: "Aged paper, sepia tones, serif type.",
  decor: "vintage",
  builtin: true,
  docs: { light: doc(lightColors), dark: doc(darkColors) },
};
