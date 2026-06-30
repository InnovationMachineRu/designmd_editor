"use client";

import {
  type PreviewProps,
  Row,
  Stack,
  primary,
  onPrimary,
  onSurface,
  onSurfaceVar,
  outlineVar,
  surfaceHigh,
  radius,
} from "./primitives";
import { color } from "@/lib/designmd/tokens";

export function NavbarPreview({ doc }: PreviewProps) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
        borderRadius: radius(doc, "lg"), background: color(doc, "surface-container", surfaceHigh(doc)),
        border: `1px solid ${outlineVar(doc)}`,
      }}
    >
      <span style={{ fontWeight: 700, color: onSurface(doc) }}>Acme</span>
      <Row gap={14} style={{ marginLeft: 8 }}>
        <span style={{ fontSize: 13, color: primary(doc), fontWeight: 600 }}>Home</span>
        <span style={{ fontSize: 13, color: onSurfaceVar(doc) }}>Pricing</span>
        <span style={{ fontSize: 13, color: onSurfaceVar(doc) }}>Docs</span>
      </Row>
      <span style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 9999, background: primary(doc) }} />
    </div>
  );
}

export function SidebarPreview({ doc }: PreviewProps) {
  const items = [{ l: "Dashboard", on: true }, { l: "Projects", on: false }, { l: "Settings", on: false }];
  return (
    <Stack gap={4} style={{ width: 180, padding: 8, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      {items.map((it) => (
        <div
          key={it.l}
          style={{
            padding: "8px 10px", borderRadius: 8, fontSize: 13, fontWeight: it.on ? 600 : 500,
            background: it.on ? primary(doc) : "transparent",
            color: it.on ? onPrimary(doc) : onSurfaceVar(doc),
          }}
        >
          {it.l}
        </div>
      ))}
    </Stack>
  );
}

export function TabsPreview({ doc }: PreviewProps) {
  const tabs = ["Overview", "Activity", "Settings"];
  const active = 0;
  return (
    <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${outlineVar(doc)}` }}>
      {tabs.map((t, i) => (
        <div
          key={t}
          style={{
            padding: "8px 2px", fontSize: 13, fontWeight: i === active ? 600 : 500,
            color: i === active ? primary(doc) : onSurfaceVar(doc),
            borderBottom: `2px solid ${i === active ? primary(doc) : "transparent"}`,
            marginBottom: -1,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

export function BreadcrumbsPreview({ doc }: PreviewProps) {
  return (
    <Row gap={6} style={{ fontSize: 13 }}>
      <span style={{ color: primary(doc) }}>Home</span>
      <span style={{ color: onSurfaceVar(doc) }}>/</span>
      <span style={{ color: primary(doc) }}>Library</span>
      <span style={{ color: onSurfaceVar(doc) }}>/</span>
      <span style={{ color: onSurface(doc), fontWeight: 600 }}>Data</span>
    </Row>
  );
}

export function PaginationPreview({ doc }: PreviewProps) {
  const pages = ["‹", "1", "2", "3", "›"];
  const active = "2";
  return (
    <Row gap={6}>
      {pages.map((p, i) => (
        <span
          key={i}
          style={{
            minWidth: 30, height: 30, display: "inline-flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "0 6px",
            background: p === active ? primary(doc) : "transparent",
            color: p === active ? onPrimary(doc) : onSurfaceVar(doc),
            border: `1px solid ${p === active ? primary(doc) : outlineVar(doc)}`,
          }}
        >
          {p}
        </span>
      ))}
    </Row>
  );
}

export function MenuPreview({ doc }: PreviewProps) {
  const items = [{ l: "Edit", on: false }, { l: "Duplicate", on: true }, { l: "Delete", on: false }];
  return (
    <Stack gap={2} style={{ width: 160, padding: 6, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 8px 24px rgba(0,0,0,0.14)" }}>
      {items.map((it) => (
        <div
          key={it.l}
          style={{
            padding: "7px 10px", borderRadius: 6, fontSize: 13,
            background: it.on ? primary(doc) : "transparent",
            color: it.on ? onPrimary(doc) : onSurface(doc),
          }}
        >
          {it.l}
        </div>
      ))}
    </Stack>
  );
}

export function StepperPreview({ doc }: PreviewProps) {
  const steps = [{ l: "Cart", done: true }, { l: "Shipping", on: true }, { l: "Pay", on: false }];
  return (
    <Row gap={0} wrap={false}>
      {steps.map((s, i) => (
        <Row key={s.l} gap={0} wrap={false}>
          <Row gap={6} wrap={false}>
            <span style={{ width: 24, height: 24, borderRadius: 9999, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: s.done || s.on ? primary(doc) : "transparent", color: s.done || s.on ? onPrimary(doc) : onSurfaceVar(doc), border: `1.5px solid ${s.done || s.on ? primary(doc) : outlineVar(doc)}` }}>{s.done ? "✓" : i + 1}</span>
            <span style={{ fontSize: 12, fontWeight: s.on ? 600 : 500, color: s.on ? onSurface(doc) : onSurfaceVar(doc) }}>{s.l}</span>
          </Row>
          {i < steps.length - 1 && <span style={{ width: 22, height: 2, margin: "0 8px", background: s.done ? primary(doc) : outlineVar(doc) }} />}
        </Row>
      ))}
    </Row>
  );
}

export function CommandPalettePreview({ doc }: PreviewProps) {
  return (
    <Stack gap={0} style={{ width: 230, borderRadius: radius(doc, "lg"), overflow: "hidden", background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderBottom: `1px solid ${outlineVar(doc)}` }}>
        <span style={{ color: onSurfaceVar(doc) }}>⌕</span>
        <span style={{ fontSize: 13, color: onSurface(doc) }}>Create…</span>
      </div>
      {[{ l: "New project", on: true }, { l: "New file", on: false }].map((it) => (
        <div key={it.l} style={{ padding: "8px 12px", fontSize: 13, color: it.on ? onSurface(doc) : onSurfaceVar(doc), background: it.on ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent" }}>{it.l}</div>
      ))}
    </Stack>
  );
}

export function BottomNavPreview({ doc }: PreviewProps) {
  const items = [{ l: "Home", on: true }, { l: "Search", on: false }, { l: "Profile", on: false }];
  return (
    <Row gap={0} wrap={false} style={{ borderRadius: radius(doc, "lg"), padding: "8px 4px", background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      {items.map((it) => (
        <Stack key={it.l} gap={4} style={{ alignItems: "center", width: 64 }}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background: it.on ? primary(doc) : outlineVar(doc) }} />
          <span style={{ fontSize: 11, fontWeight: it.on ? 600 : 500, color: it.on ? primary(doc) : onSurfaceVar(doc) }}>{it.l}</span>
        </Stack>
      ))}
    </Row>
  );
}

export function NavRailPreview({ doc }: PreviewProps) {
  const items = [{ on: true }, { on: false }, { on: false }];
  return (
    <Stack gap={8} style={{ width: 64, alignItems: "center", padding: "10px 0", borderRadius: radius(doc, "lg"), background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      {items.map((it, i) => (
        <span key={i} style={{ width: 40, height: 32, borderRadius: 9999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: it.on ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent" }}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: it.on ? primary(doc) : outlineVar(doc) }} />
        </span>
      ))}
    </Stack>
  );
}

export function TreeViewPreview({ doc }: PreviewProps) {
  const row = (label: string, indent: number, sel: boolean, caret?: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px", paddingLeft: 8 + indent * 16, borderRadius: 6, fontSize: 13, background: sel ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent", color: sel ? color(doc, "on-secondary-container", onSurface(doc)) : onSurface(doc) }}>
      <span style={{ width: 10, color: onSurfaceVar(doc) }}>{caret ?? ""}</span>{label}
    </div>
  );
  return (
    <Stack gap={1} style={{ width: 180 }}>
      {row("src", 0, false, "▾")}
      {row("components", 1, true, "▾")}
      {row("Button.tsx", 2, false)}
      {row("lib", 0, false, "▸")}
    </Stack>
  );
}

export function BackToTopPreview({ doc }: PreviewProps) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      style={{ width: 44, height: 44, borderRadius: 9999, display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1px solid ${outlineVar(doc)}`, background: color(doc, "surface-container-high", surfaceHigh(doc)), cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,0.16)" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={onSurface(doc)} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
