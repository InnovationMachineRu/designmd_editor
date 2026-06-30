import type { DesignDoc, TypographyToken } from "../designmd/types";

/**
 * Shared building blocks for presets. Each preset overrides the font family,
 * color palette, rounding and component look while reusing this scale so the
 * gallery can rely on a stable set of token names.
 */

export function typographyScale(fontFamily: string): Record<string, TypographyToken> {
  return {
    "display-lg": {
      fontFamily,
      fontSize: "57px",
      fontWeight: "700",
      lineHeight: "64px",
      letterSpacing: "-0.02em",
    },
    "headline-lg": {
      fontFamily,
      fontSize: "32px",
      fontWeight: "600",
      lineHeight: "40px",
      letterSpacing: "-0.01em",
    },
    "headline-md": {
      fontFamily,
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "32px",
    },
    "title-md": {
      fontFamily,
      fontSize: "18px",
      fontWeight: "600",
      lineHeight: "24px",
    },
    "body-lg": {
      fontFamily,
      fontSize: "18px",
      fontWeight: "400",
      lineHeight: "28px",
    },
    "body-md": {
      fontFamily,
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "24px",
    },
    "body-sm": {
      fontFamily,
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "20px",
    },
    "label-md": {
      fontFamily,
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "20px",
      letterSpacing: "0.01em",
    },
    "label-sm": {
      fontFamily,
      fontSize: "12px",
      fontWeight: "600",
      lineHeight: "16px",
      letterSpacing: "0.05em",
    },
  };
}

export const baseSpacing: DesignDoc["spacing"] = {
  unit: "8px",
  "container-padding": "24px",
  "card-gap": "16px",
  "section-margin": "40px",
  "control-padding": "12px",
};

export interface ComponentStyleOpts {
  /** rounded scale name used by buttons (e.g. "full" or "md"). */
  buttonRadius: string;
  /** rounded scale name used by cards/inputs. */
  surfaceRadius: string;
  /** When set, cards/inputs use these literal translucent backgrounds (glass). */
  glass?: { card: string; cardElevated: string; input: string; ghost: string };
}

/**
 * Standard component token set. Every preset defines the same component names
 * (bound to tokens via `{group.token}` references) so the preview gallery can
 * render a stable catalog. Visual identity comes from the resolved tokens.
 */
export function standardComponents(
  opts: ComponentStyleOpts
): DesignDoc["components"] {
  const { buttonRadius, surfaceRadius, glass } = opts;
  return {
    "button-primary": {
      backgroundColor: "{colors.primary}",
      textColor: "{colors.on-primary}",
      typography: "{typography.label-md}",
      rounded: `{rounded.${buttonRadius}}`,
      height: "44px",
      padding: "0 24px",
    },
    "button-primary-hover": {
      backgroundColor: "{colors.primary-hover}",
    },
    "button-secondary": {
      backgroundColor: "{colors.secondary-container}",
      textColor: "{colors.on-secondary-container}",
      typography: "{typography.label-md}",
      rounded: `{rounded.${buttonRadius}}`,
      height: "44px",
      padding: "0 24px",
    },
    "button-ghost": {
      backgroundColor: glass ? glass.ghost : "transparent",
      textColor: "{colors.primary}",
      typography: "{typography.label-md}",
      rounded: `{rounded.${buttonRadius}}`,
      height: "44px",
      padding: "0 20px",
    },
    "input-field": {
      backgroundColor: glass ? glass.input : "{colors.surface-container-high}",
      textColor: "{colors.on-surface}",
      typography: "{typography.body-md}",
      rounded: `{rounded.${surfaceRadius}}`,
      padding: "12px 16px",
      height: "48px",
    },
    card: {
      backgroundColor: glass ? glass.card : "{colors.surface-container}",
      textColor: "{colors.on-surface}",
      rounded: `{rounded.${surfaceRadius}}`,
      padding: "20px",
    },
    "card-elevated": {
      backgroundColor: glass
        ? glass.cardElevated
        : "{colors.surface-container-high}",
      textColor: "{colors.on-surface}",
      rounded: `{rounded.${surfaceRadius}}`,
      padding: "20px",
    },
    badge: {
      backgroundColor: "{colors.primary}",
      textColor: "{colors.on-primary}",
      typography: "{typography.label-sm}",
      rounded: "{rounded.full}",
      padding: "4px 10px",
    },
    "list-item": {
      backgroundColor: "transparent",
      textColor: "{colors.on-surface}",
      rounded: `{rounded.${surfaceRadius}}`,
      padding: "12px",
    },
    "list-item-hover": {
      backgroundColor: glass ? glass.card : "{colors.surface-container-high}",
    },
  };
}

/** Canonical-section rationale text shared as a starting point. */
export function rationale(name: string, vibe: string): DesignDoc["sections"] {
  return {
    Overview: `**${name}** — ${vibe}`,
    Colors:
      "Roles follow a surface/primary/secondary model. Use `on-*` tokens for foreground on the matching container.",
    Typography:
      "A single type family across a modular scale from `label-sm` to `display-lg`.",
    Layout:
      "Spacing derives from an 8px base unit. Containers use `container-padding`; cards use `card-gap`.",
    "Elevation & Depth":
      "Depth communicates hierarchy. Prefer the documented elevation treatment over ad-hoc shadows.",
    Shapes:
      "Rounding scales from `sm` to `full`. Apply consistent radii to related controls.",
    Components:
      "Buttons, inputs, cards, lists and badges bind their look to tokens via `{group.token}` references.",
    "Do's and Don'ts":
      "Do reference tokens instead of hard-coding values. Don't introduce off-scale colors or radii.",
  };
}
