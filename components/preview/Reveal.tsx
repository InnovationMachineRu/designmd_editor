"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Wraps a preview section and reveals it (fade + rise) the first time it
 * scrolls into view. Duration/easing come from the Brandbook motion tokens so
 * the styleguide animates in the brand's own motion language. Honors
 * `prefers-reduced-motion` by showing immediately. The visual transition lives
 * in `.dmd-reveal` / `.dmd-reveal.is-in` (app/globals.css).
 */
export function Reveal({
  children,
  ms = 240,
  easing = "ease",
  index = 0,
}: {
  children: ReactNode;
  ms?: number;
  easing?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style = {
    "--dmd-motion-duration": `${ms}ms`,
    "--dmd-motion-easing": easing,
    transitionDelay: shown ? `${Math.min(index, 6) * 40}ms` : "0ms",
  } as CSSProperties;

  return (
    <div ref={ref} className={`dmd-reveal${shown ? " is-in" : ""}`} style={style}>
      {children}
    </div>
  );
}
