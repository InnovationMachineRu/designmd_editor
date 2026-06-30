"use client";

import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AccordionExpandCtx } from "@/lib/accordionCtx";

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  /** When provided, the accordion is controlled by the parent. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  right?: ReactNode;
  children: ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const isControlled = controlledOpen !== undefined;

  // Uncontrolled accordions respond to the expand/collapse-all signal from
  // EditorPanel (or any AccordionExpandCtx provider). Controlled accordions
  // are handled at the hook level (useAccordionOpen).
  const signal = useContext(AccordionExpandCtx);
  const prevV = useRef<number | null>(null);
  useEffect(() => {
    if (isControlled || signal === null) return;
    if (prevV.current === signal.v) return;
    prevV.current = signal.v;
    setInternalOpen(signal.open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal?.v, isControlled]);

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div
      className={`border rounded-xl bg-app-panel overflow-hidden transition-colors ${
        open ? "border-app-border" : "border-app-border/60 hover:border-app-border"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-app-muted transition-transform duration-200 group-hover:text-app-text ${
            open ? "rotate-90" : ""
          }`}
          aria-hidden
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span className="flex-1 min-w-0">
          <span className="font-display block text-[13px] font-semibold tracking-tight text-app-text">
            {title}
          </span>
          {subtitle && (
            <span className="block text-[11px] text-app-muted mt-0.5 truncate">{subtitle}</span>
          )}
        </span>
        {right}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-app-border/70">{children}</div>
      )}
    </div>
  );
}
