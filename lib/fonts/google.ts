// Curated catalog of popular Google Fonts for the Brandbook font manager.
// Families here are loaded on demand by components/FontLoader.tsx (it builds a
// fonts.googleapis.com/css2 URL), so any family in this list renders live —
// no API key required.

export type FontCategory = "sans" | "serif" | "mono" | "display";

export interface FontEntry {
  family: string;
  category: FontCategory;
}

export const FONT_CATALOG: FontEntry[] = [
  // Sans-serif
  { family: "Inter", category: "sans" },
  { family: "Roboto", category: "sans" },
  { family: "Open Sans", category: "sans" },
  { family: "Montserrat", category: "sans" },
  { family: "Poppins", category: "sans" },
  { family: "Lato", category: "sans" },
  { family: "Work Sans", category: "sans" },
  { family: "Nunito", category: "sans" },
  { family: "Nunito Sans", category: "sans" },
  { family: "Manrope", category: "sans" },
  { family: "DM Sans", category: "sans" },
  { family: "Plus Jakarta Sans", category: "sans" },
  { family: "Rubik", category: "sans" },
  { family: "Mulish", category: "sans" },
  { family: "Sora", category: "sans" },
  { family: "Outfit", category: "sans" },
  { family: "Figtree", category: "sans" },
  { family: "Noto Sans", category: "sans" },
  { family: "IBM Plex Sans", category: "sans" },
  { family: "Albert Sans", category: "sans" },

  // Serif
  { family: "Merriweather", category: "serif" },
  { family: "Playfair Display", category: "serif" },
  { family: "Lora", category: "serif" },
  { family: "Source Serif 4", category: "serif" },
  { family: "Noto Serif", category: "serif" },
  { family: "PT Serif", category: "serif" },
  { family: "Libre Baskerville", category: "serif" },
  { family: "Cormorant", category: "serif" },
  { family: "EB Garamond", category: "serif" },
  { family: "Bitter", category: "serif" },
  { family: "Spectral", category: "serif" },
  { family: "Crimson Pro", category: "serif" },
  { family: "Frank Ruhl Libre", category: "serif" },

  // Display
  { family: "Oswald", category: "display" },
  { family: "Bebas Neue", category: "display" },
  { family: "Archivo", category: "display" },
  { family: "Anton", category: "display" },
  { family: "Righteous", category: "display" },
  { family: "Fraunces", category: "display" },
  { family: "Abril Fatface", category: "display" },
  { family: "Comfortaa", category: "display" },
  { family: "Lobster", category: "display" },

  // Monospace
  { family: "JetBrains Mono", category: "mono" },
  { family: "Fira Code", category: "mono" },
  { family: "IBM Plex Mono", category: "mono" },
  { family: "Source Code Pro", category: "mono" },
  { family: "Space Mono", category: "mono" },
  { family: "Roboto Mono", category: "mono" },
  { family: "Inconsolata", category: "mono" },
  { family: "DM Mono", category: "mono" },
  { family: "Ubuntu Mono", category: "mono" },
];

const FAMILY_SET = new Set(FONT_CATALOG.map((f) => f.family));

/** True when a family is a known Google Font we can load dynamically. */
export function isGoogleFont(family: string): boolean {
  return FAMILY_SET.has(family.trim());
}

/** Group the catalog by category, preserving order. */
export function fontsByCategory(): Record<FontCategory, FontEntry[]> {
  const out: Record<FontCategory, FontEntry[]> = {
    sans: [],
    serif: [],
    mono: [],
    display: [],
  };
  for (const f of FONT_CATALOG) out[f.category].push(f);
  return out;
}

/**
 * Build a single `fonts.googleapis.com/css2` URL requesting the given families
 * (a standard 400;500;600;700 axis each). Returns null when nothing loadable.
 * Only families present in the catalog are requested (avoids 400s on free text).
 */
export function buildGoogleFontsUrl(families: Iterable<string>): string | null {
  const unique = Array.from(
    new Set(Array.from(families, (f) => f?.trim()).filter(Boolean))
  ).filter((f) => isGoogleFont(f));
  if (!unique.length) return null;
  const params = unique
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
