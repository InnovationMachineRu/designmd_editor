import type { DesignDoc, StylePreset } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const FONT = "Roboto";

const rounded: DesignDoc["rounded"] = {
  sm: "0.5rem",
  DEFAULT: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "1.75rem",
  full: "9999px",
};

const components = standardComponents({
  buttonRadius: "full",
  surfaceRadius: "lg",
});

const lightColors: DesignDoc["colors"] = {
  primary: "#6750A4",
  "on-primary": "#FFFFFF",
  "primary-hover": "#5B4690",
  "primary-container": "#EADDFF",
  "on-primary-container": "#21005D",
  secondary: "#625B71",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#E8DEF8",
  "on-secondary-container": "#1D192B",
  tertiary: "#7D5260",
  "on-tertiary": "#FFFFFF",
  error: "#B3261E",
  "on-error": "#FFFFFF",
  "error-container": "#F9DEDC",
  "on-error-container": "#410E0B",
  background: "#FFFBFE",
  "on-background": "#1C1B1F",
  surface: "#FFFBFE",
  "on-surface": "#1C1B1F",
  "on-surface-variant": "#49454F",
  "surface-container-low": "#F7F2FA",
  "surface-container": "#F3EDF7",
  "surface-container-high": "#ECE6F0",
  "surface-container-highest": "#E6E0E9",
  outline: "#79747E",
  "outline-variant": "#CAC4D0",
};

const darkColors: DesignDoc["colors"] = {
  primary: "#D0BCFF",
  "on-primary": "#381E72",
  "primary-hover": "#B9A3F0",
  "primary-container": "#4F378B",
  "on-primary-container": "#EADDFF",
  secondary: "#CCC2DC",
  "on-secondary": "#332D41",
  "secondary-container": "#4A4458",
  "on-secondary-container": "#E8DEF8",
  tertiary: "#EFB8C8",
  "on-tertiary": "#492532",
  error: "#F2B8B5",
  "on-error": "#601410",
  "error-container": "#8C1D18",
  "on-error-container": "#F9DEDC",
  background: "#1C1B1F",
  "on-background": "#E6E1E5",
  surface: "#1C1B1F",
  "on-surface": "#E6E1E5",
  "on-surface-variant": "#CAC4D0",
  "surface-container-low": "#1D1B20",
  "surface-container": "#211F26",
  "surface-container-high": "#2B2930",
  "surface-container-highest": "#36343B",
  outline: "#938F99",
  "outline-variant": "#49454F",
};

function doc(colors: DesignDoc["colors"]): DesignDoc {
  return {
    version: "alpha",
    name: "Material",
    description: "Material 3 baseline — expressive color roles and rounded controls.",
    colors,
    typography: typographyScale(FONT),
    rounded,
    spacing: baseSpacing,
    components,
    sections: rationale(
      "Material",
      "a Material 3 system with tonal surfaces, full-radius buttons and a clear on-color contract."
    ),
  };
}

export const materialPreset: StylePreset = {
  id: "material",
  label: "Material UI",
  description: "Material 3 tonal palette, pill buttons, rounded cards.",
  decor: "material",
  builtin: true,
  docs: { light: doc(lightColors), dark: doc(darkColors) },
};
