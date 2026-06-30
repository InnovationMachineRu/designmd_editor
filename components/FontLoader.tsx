"use client";

import { useEffect } from "react";
import { useEditor } from "@/lib/store";
import { buildGoogleFontsUrl } from "@/lib/fonts/google";

const CATALOG_LINK_ID = "dmd-dynamic-fonts";
const CUSTOM_LINK_PREFIX = "dmd-custom-font-";

export function FontLoader() {
  const brandbook = useEditor((s) => s.brandbook);
  const customFontUrls = useEditor((s) => s.customFontUrls);

  const families = new Set<string>();
  if (brandbook?.fonts) {
    if (brandbook.fonts.heading) families.add(brandbook.fonts.heading);
    if (brandbook.fonts.body) families.add(brandbook.fonts.body);
    if (brandbook.fonts.mono) families.add(brandbook.fonts.mono);
  }
  const catalogKey = Array.from(families).sort().join("|");

  useEffect(() => {
    const url = buildGoogleFontsUrl(families);
    let link = document.getElementById(CATALOG_LINK_ID) as HTMLLinkElement | null;
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = document.createElement("link");
      link.id = CATALOG_LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== url) link.href = url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogKey]);

  // --- custom font URLs ---
  const customKey = customFontUrls.join("|");
  useEffect(() => {
    // Remove all previously injected custom links
    document.querySelectorAll(`link[id^="${CUSTOM_LINK_PREFIX}"]`).forEach((el) => el.remove());

    // Re-inject current list
    customFontUrls.forEach((url, i) => {
      if (!url.startsWith("https://")) return;
      const link = document.createElement("link");
      link.id = `${CUSTOM_LINK_PREFIX}${i}`;
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customKey]);

  return null;
}
