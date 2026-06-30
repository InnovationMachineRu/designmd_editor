import type { DesignDoc, StylePreset } from "../designmd/types";
import {
  baseSpacing,
  rationale,
  standardComponents,
  typographyScale,
} from "./shared";

const FONT = "Poppins";

const rounded: DesignDoc["rounded"] = {
  sm: "0.75rem",
  DEFAULT: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem",
  full: "9999px",
};

// Neumorphic depth is rendered as soft dual shadows in the gallery (box-shadow
// is not a spec component property), so surfaces share the background hue.
const components = standardComponents({
  buttonRadius: "md",
  surfaceRadius: "lg",
});

const lightColors: DesignDoc["colors"] = {
  primary: "#5B6CFF",
  "on-primary": "#FFFFFF",
  "primary-hover": "#4A5BE0",
  "primary-container": "#D6DBF5",
  "on-primary-container": "#1E2A78",
  secondary: "#8A94A6",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#D9DEE7",
  "on-secondary-container": "#2A3340",
  tertiary: "#B06AB3",
  "on-tertiary": "#FFFFFF",
  error: "#E05260",
  "on-error": "#FFFFFF",
  "error-container": "#F6DADE",
  "on-error-container": "#5A1620",
  background: "#E0E5EC",
  "on-background": "#4B5563",
  surface: "#E0E5EC",
  "on-surface": "#4B5563",
  "on-surface-variant": "#6B7280",
  "surface-container-low": "#E0E5EC",
  "surface-container": "#E0E5EC",
  "surface-container-high": "#E6EBF2",
  "surface-container-highest": "#ECF0F6",
  outline: "#C2C8D0",
  "outline-variant": "#D5DAE2",
};

const darkColors: DesignDoc["colors"] = {
  primary: "#7C8CFF",
  "on-primary": "#10173A",
  "primary-hover": "#93A0FF",
  "primary-container": "#353B66",
  "on-primary-container": "#DDE2FF",
  secondary: "#8A94A6",
  "on-secondary": "#161A20",
  "secondary-container": "#363B45",
  "on-secondary-container": "#D5DAE2",
  tertiary: "#C58AE0",
  "on-tertiary": "#2A0E3A",
  error: "#F08591",
  "on-error": "#3A0E14",
  "error-container": "#4C2026",
  "on-error-container": "#FBD5DA",
  background: "#2A2D35",
  "on-background": "#C7CBD4",
  surface: "#2A2D35",
  "on-surface": "#C7CBD4",
  "on-surface-variant": "#9AA0AE",
  "surface-container-low": "#2A2D35",
  "surface-container": "#2A2D35",
  "surface-container-high": "#30343D",
  "surface-container-highest": "#363B45",
  outline: "#444A55",
  "outline-variant": "#383D47",
};

function doc(colors: DesignDoc["colors"]): DesignDoc {
  return {
    version: "alpha",
    name: "Neo",
    description: "Soft monochrome neumorphism — extruded surfaces and gentle dual shadows.",
    colors,
    typography: typographyScale(FONT),
    rounded,
    spacing: baseSpacing,
    components,
    sections: rationale(
      "Neo",
      "soft neumorphic surfaces that share the background hue, shaped by paired light/dark shadows."
    ),
  };
}

export const neoPreset: StylePreset = {
  id: "neo",
  label: "Неоморфизм",
  description: "Soft extruded surfaces, gentle dual shadows.",
  decor: "neo",
  builtin: true,
  docs: { light: doc(lightColors), dark: doc(darkColors) },
};
