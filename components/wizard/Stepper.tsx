"use client";

import Link from "next/link";

const STEPS = [
  { n: 1, label: "Brandbook", href: "/brandbook" },
  { n: 2, label: "Design system", href: "/" },
  { n: 3, label: "UIKit", href: "/uikit" },
  { n: 4, label: "Layouts", href: "/layouts" },
  { n: 5, label: "Export", href: "/export" },
];

/**
 * Top-level navigation as a segmented control. The active segment lifts onto a
 * raised panel with a brass underline — the one lit indicator in the chrome.
 */
export function Stepper({ current }: { current: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl border border-app-border bg-app-panel-2/40">
      {STEPS.map((s) => {
        const active = s.n === current;
        return (
          <Link
            key={s.n}
            href={s.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-app-panel text-app-text shadow-sm"
                : "text-app-muted hover:text-app-text"
            }`}
          >
            <span
              className={`font-display text-xs tabular-nums ${
                active ? "text-app-accent" : "text-app-muted/70"
              }`}
            >
              {String(s.n).padStart(2, "0")}
            </span>
            <span className="hidden sm:inline font-display tracking-tight">{s.label}</span>
            {active && (
              <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-app-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
