"use client";

import { useState, type ReactNode } from "react";

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  right?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-app-border rounded-lg bg-app-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-app-panel-2 transition-colors"
      >
        <span
          className={`text-app-muted transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          ▶
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-app-text">{title}</span>
          {subtitle && (
            <span className="block text-xs text-app-muted mt-0.5">{subtitle}</span>
          )}
        </span>
        {right}
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t border-app-border">{children}</div>}
    </div>
  );
}
