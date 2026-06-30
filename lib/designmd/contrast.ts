// WCAG contrast computation for the color-pair badges. Supports hex and
// rgb()/rgba(); returns null for color forms we can't reliably parse (oklch,
// named colors), so the UI simply omits the badge.

interface RGB {
  r: number;
  g: number;
  b: number;
}

function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();

  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  const rgb = s.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const parts = rgb[1].split(/[,/\s]+/).filter(Boolean);
    if (parts.length >= 3) {
      const toByte = (p: string) =>
        p.endsWith("%") ? Math.round((parseFloat(p) / 100) * 255) : parseFloat(p);
      const r = toByte(parts[0]);
      const g = toByte(parts[1]);
      const b = toByte(parts[2]);
      if ([r, g, b].every((n) => Number.isFinite(n))) return { r, g, b };
    }
  }

  return null;
}

function channelLuminance(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }: RGB): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** Contrast ratio (1–21) between two colors, or null if unparseable. */
export function contrastRatio(a: string, b: string): number | null {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return null;
  const la = relativeLuminance(ca);
  const lb = relativeLuminance(cb);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = "AAA" | "AA" | "AA Large" | "fail";

/** WCAG level for normal-size body text at the given ratio. */
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "fail";
}
