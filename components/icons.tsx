"use client";

import type { ReactNode } from "react";

/**
 * Shared inline-SVG icon set (no icon-library dependency). The `Icon` wrapper
 * accepts brand icon-style props (stroke width, size, round/sharp corners) so
 * the same glyphs can adopt the Brandbook's iconography settings everywhere.
 */
export function Icon({
  path,
  size = 18,
  strokeWidth = 1.8,
  corner = "round",
}: {
  path: ReactNode;
  size?: number;
  strokeWidth?: number;
  corner?: "round" | "sharp";
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap={corner === "round" ? "round" : "butt"}
      strokeLinejoin={corner === "round" ? "round" : "miter"}
      aria-hidden
    >
      {path}
    </svg>
  );
}

export const IconHome = <path d="M3 10.5 12 3l9 7.5M5 9v11h14V9" />;
export const IconSearch = (
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </>
);
export const IconUser = (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </>
);
export const IconMoon = <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />;
export const IconSun = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
  </>
);
export const IconTag = (
  <>
    <path d="M3 11V4h7l11 11-7 7L3 11Z" />
    <circle cx="7.5" cy="7.5" r="1.4" />
  </>
);
export const IconTrash = <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />;
export const IconPencil = <path d="M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4" />;
export const IconHeart = (
  <path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" />
);
export const IconStar = (
  <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.8 1.1-6L3.4 9.4l6-.8L12 3Z" />
);
export const IconBell = (
  <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21h4" />
);
export const IconSettings = (
  <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2" />
  </>
);
export const IconMail = (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>
);
export const IconCheck = <path d="M4 12.5 9 17.5 20 6.5" />;
export const IconPlus = <path d="M12 5v14M5 12h14" />;
export const IconArrowRight = <path d="M5 12h14M13 6l6 6-6 6" />;

/** Named gallery of the built-in glyphs for the Iconography section. */
export const BRAND_ICONS: { name: string; path: ReactNode }[] = [
  { name: "home", path: IconHome },
  { name: "search", path: IconSearch },
  { name: "user", path: IconUser },
  { name: "mail", path: IconMail },
  { name: "bell", path: IconBell },
  { name: "settings", path: IconSettings },
  { name: "heart", path: IconHeart },
  { name: "star", path: IconStar },
  { name: "tag", path: IconTag },
  { name: "moon", path: IconMoon },
  { name: "sun", path: IconSun },
  { name: "pencil", path: IconPencil },
  { name: "trash", path: IconTrash },
  { name: "check", path: IconCheck },
  { name: "plus", path: IconPlus },
  { name: "arrow", path: IconArrowRight },
];
