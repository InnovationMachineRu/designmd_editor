"use client";

import Link from "next/link";

const STEPS = [
  { n: 1, label: "Brandbook", href: "/brandbook" },
  { n: 2, label: "Design system", href: "/" },
  { n: 3, label: "UIKit components", href: "/uikit" },
];

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav className="flex items-center gap-3">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-3">
          <Link
            href={s.href}
            className={`flex items-center gap-2 text-sm transition-colors ${
              s.n === current ? "text-app-text" : "text-app-muted hover:text-app-text"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                s.n === current
                  ? "bg-app-accent text-white"
                  : "border border-app-border text-app-muted"
              }`}
            >
              {s.n}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </Link>
          {i < STEPS.length - 1 && <span className="text-app-border">→</span>}
        </div>
      ))}
    </nav>
  );
}
