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
