"use client";

import {
  type PreviewProps,
  TSurface,
  TChip,
  TButton,
  Row,
  Stack,
  Caption,
  primary,
  onPrimary,
  onSurface,
  onSurfaceVar,
  outlineVar,
  surfaceHigh,
} from "./primitives";
import { color } from "@/lib/designmd/tokens";

export function CardPreview({ doc }: PreviewProps) {
  return (
    <TSurface doc={doc} style={{ maxWidth: 260 }}>
      <Stack gap={8}>
        <div style={{ fontWeight: 700, fontSize: 14, color: onSurface(doc) }}>Project Atlas</div>
        <Caption doc={doc}>A container that groups related content with a clear hierarchy.</Caption>
        <Row gap={8}><TButton doc={doc} size="sm" variant="primary">Open</TButton><TButton doc={doc} size="sm" variant="plain">Share</TButton></Row>
      </Stack>
    </TSurface>
  );
}

export function TablePreview({ doc }: PreviewProps) {
  const rows = [["Inter", "Sans", "12"], ["Lora", "Serif", "8"], ["Mono", "Code", "4"]];
  const cell: React.CSSProperties = { padding: "8px 10px", fontSize: 12, textAlign: "left", color: onSurface(doc) };
  return (
    <div style={{ border: `1px solid ${outlineVar(doc)}`, borderRadius: 10, overflow: "hidden", maxWidth: 300 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: surfaceHigh(doc) }}>
            {["Family", "Type", "Uses"].map((h) => (
              <th key={h} style={{ ...cell, fontWeight: 700, color: onSurfaceVar(doc) }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${outlineVar(doc)}` }}>
              {r.map((c, j) => <td key={j} style={cell}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListPreview({ doc }: PreviewProps) {
  const items = ["Activity feed", "Notifications", "Saved items"];
  return (
    <Stack gap={0} style={{ border: `1px solid ${outlineVar(doc)}`, borderRadius: 10, overflow: "hidden", maxWidth: 260 }}>
      {items.map((it, i) => (
        <Row
          key={it}
          wrap={false}
          style={{ padding: "10px 12px", justifyContent: "space-between", borderTop: i ? `1px solid ${outlineVar(doc)}` : "none" }}
        >
          <span style={{ fontSize: 13, color: onSurface(doc) }}>{it}</span>
          <span style={{ color: onSurfaceVar(doc) }}>›</span>
        </Row>
      ))}
    </Stack>
  );
}

export function AvatarPreview({ doc }: PreviewProps) {
  const base = { width: 40, height: 40, borderRadius: 9999, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 } as const;
  return (
    <Row gap={10}>
      <span style={{ ...base, background: primary(doc), color: onPrimary(doc) }}>AK</span>
      <span style={{ ...base, background: color(doc, "secondary-container", surfaceHigh(doc)), color: color(doc, "on-secondary-container", onSurface(doc)) }}>Br</span>
      <span style={{ ...base, background: surfaceHigh(doc), color: onSurfaceVar(doc), border: `1px solid ${outlineVar(doc)}` }}>+5</span>
    </Row>
  );
}

export function BadgePreview({ doc }: PreviewProps) {
  const pill = (bg: string, fg: string, label: string) => (
    <span style={{ padding: "3px 9px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: bg, color: fg }}>{label}</span>
  );
  return (
    <Row gap={8}>
      {pill(primary(doc), onPrimary(doc), "Featured")}
      {pill(color(doc, "secondary", primary(doc)), color(doc, "on-secondary", onPrimary(doc)), "New")}
      {pill(color(doc, "error", "#dc2626"), color(doc, "on-error", "#fff"), "Beta")}
      <span style={{ minWidth: 22, height: 22, padding: "0 6px", borderRadius: 9999, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", background: primary(doc), color: onPrimary(doc) }}>9+</span>
    </Row>
  );
}

export function ChipPreview({ doc }: PreviewProps) {
  return (
    <Row gap={8}>
      <TChip doc={doc} selected>Design ✕</TChip>
      <TChip doc={doc}>Engineering</TChip>
      <TChip doc={doc}>Marketing</TChip>
    </Row>
  );
}

export function TooltipPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={6} style={{ alignItems: "center" }}>
      <span
        style={{
          padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
          background: color(doc, "inverse-surface", onSurface(doc)),
          color: color(doc, "inverse-on-surface", color(doc, "surface", "#fff")),
        }}
      >
        Copy to clipboard
      </span>
      <span style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${color(doc, "inverse-surface", onSurface(doc))}` }} />
    </Stack>
  );
}

export function StatPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={2}>
      <Caption doc={doc}>Monthly revenue</Caption>
      <Row gap={8} wrap={false}>
        <span style={{ fontSize: 26, fontWeight: 800, color: onSurface(doc) }}>$48.2k</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: color(doc, "primary", "#16a34a") }}>▲ 12%</span>
      </Row>
    </Stack>
  );
}
