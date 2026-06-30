"use client";

import type { CSSProperties, ReactNode } from "react";
import type { DesignDoc } from "@/lib/designmd/types";
import { resolveComponent, color, rounding } from "@/lib/designmd/tokens";

/** Every preview renderer receives the live design document. */
export interface PreviewProps {
  doc: DesignDoc;
}

// --- token-resolving color helpers (with sensible fallbacks) ---
export const onSurface = (doc: DesignDoc) => color(doc, "on-surface", "#16181d");
export const onSurfaceVar = (doc: DesignDoc) =>
  color(doc, "on-surface-variant", onSurface(doc));
export const outlineCol = (doc: DesignDoc) =>
  color(doc, "outline", "rgba(0,0,0,0.22)");
export const outlineVar = (doc: DesignDoc) =>
  color(doc, "outline-variant", outlineCol(doc));
export const primary = (doc: DesignDoc) => color(doc, "primary", "#2563eb");
export const onPrimary = (doc: DesignDoc) => color(doc, "on-primary", "#ffffff");
export const surfaceHigh = (doc: DesignDoc) =>
  color(doc, "surface-container-high", color(doc, "surface-container", "#eef0f3"));
export const radius = (doc: DesignDoc, scale = "lg", fallback = "12px") =>
  rounding(doc, scale, fallback);

/** Resolve a component token into a style object (or {} when absent). */
export const comp = (doc: DesignDoc, key: string): CSSProperties =>
  resolveComponent(doc, doc.components[key]);

/** A small, token-styled button in primary / secondary / plain variants. */
export function TButton({
  doc,
  variant = "primary",
  size = "md",
  children,
  style,
}: {
  doc: DesignDoc;
  variant?: "primary" | "secondary" | "plain";
  size?: "sm" | "md";
  children: ReactNode;
  style?: CSSProperties;
}) {
  const key =
    variant === "secondary"
      ? "button-secondary"
      : variant === "plain"
        ? "button-plain"
        : "button-primary";
  const sizing =
    size === "sm"
      ? { height: 30, padding: "0 12px", fontSize: 12 }
      : { height: 38, padding: "0 16px", fontSize: 13 };
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        fontWeight: 600,
        whiteSpace: "nowrap",
        border: variant === "plain" ? `1px solid ${outlineVar(doc)}` : "none",
        ...comp(doc, key),
        ...sizing,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** A read-only, token-styled input field. */
export function TInput({
  doc,
  placeholder,
  value,
  type = "text",
  style,
}: {
  doc: DesignDoc;
  placeholder?: string;
  value?: string;
  type?: string;
  style?: CSSProperties;
}) {
  return (
    <input
      readOnly
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      style={{
        width: "100%",
        outline: "none",
        border: `1px solid ${outlineCol(doc)}`,
        ...comp(doc, "input-field"),
        height: 38,
        padding: "0 12px",
        fontSize: 13,
        ...style,
      }}
    />
  );
}

/** A token-styled surface (card). */
export function TSurface({
  doc,
  elevated = false,
  children,
  style,
}: {
  doc: DesignDoc;
  elevated?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        border: `1px solid ${outlineVar(doc)}`,
        ...comp(doc, elevated ? "card-elevated" : "card"),
        padding: 14,
        boxShadow: elevated ? "0 6px 20px rgba(0,0,0,0.12)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A pill chip / tag, optionally selected. */
export function TChip({
  doc,
  children,
  selected = false,
  style,
}: {
  doc: DesignDoc;
  children: ReactNode;
  selected?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        background: selected ? primary(doc) : surfaceHigh(doc),
        color: selected ? onPrimary(doc) : onSurface(doc),
        border: `1px solid ${selected ? primary(doc) : outlineVar(doc)}`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** A muted caption line. */
export function Caption({ doc, children }: { doc: DesignDoc; children: ReactNode }) {
  return <div style={{ fontSize: 11, color: onSurfaceVar(doc) }}>{children}</div>;
}

/** Horizontal flex row helper. */
export function Row({
  children,
  gap = 8,
  wrap = true,
  style,
}: {
  children: ReactNode;
  gap?: number;
  wrap?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Vertical stack helper. */
export function Stack({
  children,
  gap = 8,
  style,
}: {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}) {
  return <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>{children}</div>;
}
