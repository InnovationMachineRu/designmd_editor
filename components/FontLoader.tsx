"use client";

import { useEffect } from "react";
import { useEditor } from "@/lib/store";
import { buildGoogleFontsUrl } from "@/lib/fonts/google";

const LINK_ID = "dmd-dynamic-fonts";

/**
 * Injects a single Google Fonts stylesheet for every font-family referenced by
 * the live documents and the Brandbook, so chosen fonts render in the preview
 * without a hardcoded list. Mounted once in the root layout.
 */
export function FontLoader() {
  const docs = useEditor((s) => s.docs);
  const brandbook = useEditor((s) => s.brandbook);

  // Stable signature of all families in play.
  const families = new Set<string>();
  for (const doc of [docs.light, docs.dark]) {
    for (const t of Object.values(doc.typography)) {
      if (t.fontFamily) families.add(t.fontFamily);
    }
  }
  if (brandbook?.fonts) {
    if (brandbook.fonts.heading) families.add(brandbook.fonts.heading);
    if (brandbook.fonts.body) families.add(brandbook.fonts.body);
    if (brandbook.fonts.mono) families.add(brandbook.fonts.mono);
  }
  const key = Array.from(families).sort().join("|");

  useEffect(() => {
    const url = buildGoogleFontsUrl(families);
    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = document.createElement("link");
      link.id = LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== url) link.href = url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
