import type { CSSProperties } from "react";
import type { DecorKind, ThemeMode } from "@/lib/designmd/types";

/**
 * Preset-specific visual decoration that cannot live in spec component tokens
 * (box-shadow, backdrop blur, gradients). Applied on top of resolved tokens so
 * the preview reads as the chosen visual language.
 */
export interface Decor {
  /** Background for the whole preview surface. */
  paneBackground?: string;
  /** Extra styles merged onto card/surface elements. */
  surface: CSSProperties;
  /** Extra styles merged onto elevated cards. */
  surfaceElevated: CSSProperties;
  /** Extra styles merged onto primary buttons. */
  button: CSSProperties;
  /** Extra styles merged onto inputs. */
  input: CSSProperties;
}

export function getDecor(kind: DecorKind, theme: ThemeMode): Decor {
  switch (kind) {
    case "glass":
      return {
        paneBackground:
          theme === "dark"
            ? "radial-gradient(120% 120% at 0% 0%, #16224a 0%, #0b1326 55%, #060b1a 100%)"
            : "radial-gradient(120% 120% at 0% 0%, #dbe6ff 0%, #eef3ff 55%, #f7f9ff 100%)",
        surface: {
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)"}`,
          boxShadow:
            theme === "dark"
              ? "0 8px 32px rgba(0,0,0,0.37)"
              : "0 8px 32px rgba(31,38,135,0.12)",
        },
        surfaceElevated: {
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.7)"}`,
          boxShadow:
            theme === "dark"
              ? "0 12px 40px rgba(0,0,0,0.45)"
              : "0 12px 40px rgba(31,38,135,0.18)",
        },
        button: {},
        input: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)"}`,
        },
      };

    case "neo": {
      const light = theme === "light";
      const shadow = light
        ? "8px 8px 18px #a8b3c6, -8px -8px 18px #ffffff"
        : "7px 7px 16px #1d1f25, -7px -7px 16px #373b46";
      const shadowSm = light
        ? "5px 5px 12px #b1bccf, -5px -5px 12px #ffffff"
        : "5px 5px 12px #1f2127, -5px -5px 12px #353944";
      const inset = light
        ? "inset 4px 4px 9px #b1bccf, inset -4px -4px 9px #ffffff"
        : "inset 4px 4px 9px #1f2127, inset -4px -4px 9px #353944";
      return {
        surface: { boxShadow: shadow, border: "none" },
        surfaceElevated: { boxShadow: shadow, border: "none" },
        button: { boxShadow: shadowSm, border: "none" },
        input: { boxShadow: inset, border: "none" },
      };
    }

    case "minimal":
      return {
        surface: {
          border: `1px solid ${theme === "dark" ? "#27272A" : "#E5E7EB"}`,
        },
        surfaceElevated: {
          border: `1px solid ${theme === "dark" ? "#27272A" : "#E5E7EB"}`,
          boxShadow:
            theme === "dark"
              ? "0 1px 2px rgba(0,0,0,0.4)"
              : "0 1px 2px rgba(0,0,0,0.06)",
        },
        button: {},
        input: { border: `1px solid ${theme === "dark" ? "#3F3F46" : "#D1D5DB"}` },
      };

    case "vintage": {
      const warmBorder =
        theme === "dark" ? "rgba(140,123,98,0.55)" : "rgba(150,120,80,0.5)";
      return {
        paneBackground:
          theme === "dark"
            ? "linear-gradient(160deg, #2a2018 0%, #241c16 100%)"
            : "linear-gradient(160deg, #f7f0dd 0%, #f0e6cd 100%)",
        surface: {
          border: `1px solid ${warmBorder}`,
          boxShadow:
            theme === "dark"
              ? "inset 0 0 0 1px rgba(0,0,0,0.25)"
              : "0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(180,150,110,0.25)",
        },
        surfaceElevated: {
          border: `1px solid ${warmBorder}`,
          boxShadow:
            theme === "dark"
              ? "0 6px 18px rgba(0,0,0,0.45)"
              : "0 6px 18px rgba(120,90,50,0.18)",
        },
        button: {
          boxShadow:
            theme === "dark"
              ? "0 1px 2px rgba(0,0,0,0.5)"
              : "0 1px 2px rgba(120,90,50,0.3)",
        },
        input: { border: `1px solid ${warmBorder}` },
      };
    }

    case "asian": {
      const ink =
        theme === "dark" ? "rgba(180,170,150,0.28)" : "rgba(28,26,23,0.16)";
      return {
        paneBackground:
          theme === "dark"
            ? "radial-gradient(140% 140% at 100% 0%, #1a1813 0%, #14130f 70%)"
            : "radial-gradient(140% 140% at 100% 0%, #fbf8f1 0%, #f4f0e7 70%)",
        surface: { border: `1px solid ${ink}`, boxShadow: "none" },
        surfaceElevated: {
          border: `1px solid ${ink}`,
          boxShadow:
            theme === "dark"
              ? "0 2px 10px rgba(0,0,0,0.4)"
              : "0 2px 10px rgba(28,26,23,0.06)",
        },
        button: {},
        input: { border: `1px solid ${ink}` },
      };
    }

    case "flat":
      return {
        surface: {
          border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        },
        surfaceElevated: {
          border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
        },
        button: {},
        input: {
          border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)"}`,
        },
      };

    case "material":
    default:
      return {
        surface: {},
        surfaceElevated: {
          boxShadow:
            theme === "dark"
              ? "0 1px 3px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
        },
        button: {
          boxShadow:
            theme === "dark"
              ? "0 1px 2px rgba(0,0,0,0.5)"
              : "0 1px 2px rgba(0,0,0,0.2)",
        },
        input: {},
      };
  }
}
