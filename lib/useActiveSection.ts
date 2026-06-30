"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Scroll-spy. Observes the elements whose ids are given (without the leading
 * `#`) inside an optional scroll container and returns the id of the section
 * currently nearest the top of the viewport/container. Used to highlight the
 * matching in-page nav link as the user scrolls.
 */
export function useActiveSection(
  ids: string[],
  rootRef?: RefObject<HTMLElement | null>
): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join("|");

  useEffect(() => {
    const root = rootRef?.current ?? null;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const visible = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // The active section is the first (in document order) still in view.
        const next = ids.find((id) => visible.has(id));
        if (next) setActive(next);
      },
      { root, rootMargin: "0px 0px -65% 0px", threshold: [0, 0.1, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // `key` captures the id list; `ids` itself is a fresh array each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rootRef]);

  return active;
}
