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

export function LabelPreview({ doc }: PreviewProps) {
  const tag = (cb: string, cf: string, label: string) => (
    <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, background: color(doc, cb, surfaceHigh(doc)), color: color(doc, cf, onSurface(doc)) }}>{label}</span>
  );
  return (
    <Row gap={6}>
      {tag("surface-container-high", "on-surface-variant", "Draft")}
      {tag("primary-container", "on-primary-container", "Active")}
      {tag("error-container", "on-error-container", "Overdue")}
    </Row>
  );
}

export function DescriptionListPreview({ doc }: PreviewProps) {
  const rows = [["Plan", "Pro"], ["Seats", "12"], ["Renews", "Jul 1"]];
  return (
    <Stack gap={0} style={{ maxWidth: 220 }}>
      {rows.map(([k, v], i) => (
        <Row key={k} wrap={false} style={{ justifyContent: "space-between", padding: "7px 0", borderTop: i ? `1px solid ${outlineVar(doc)}` : "none" }}>
          <span style={{ fontSize: 12, color: onSurfaceVar(doc) }}>{k}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: onSurface(doc) }}>{v}</span>
        </Row>
      ))}
    </Stack>
  );
}

export function TimelinePreview({ doc }: PreviewProps) {
  const events = [{ l: "Created", on: true }, { l: "In review", on: true }, { l: "Shipped", on: false }];
  return (
    <Stack gap={0}>
      {events.map((e, i) => (
        <Row key={e.l} gap={10} wrap={false} style={{ alignItems: "stretch" }}>
          <Stack gap={0} style={{ alignItems: "center", width: 14 }}>
            <span style={{ width: 11, height: 11, borderRadius: 9999, marginTop: 3, background: e.on ? primary(doc) : "transparent", border: `2px solid ${e.on ? primary(doc) : outlineVar(doc)}` }} />
            {i < events.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 16, background: outlineVar(doc) }} />}
          </Stack>
          <span style={{ fontSize: 13, paddingBottom: 12, color: e.on ? onSurface(doc) : onSurfaceVar(doc) }}>{e.l}</span>
        </Row>
      ))}
    </Stack>
  );
}

export function KbdPreview({ doc }: PreviewProps) {
  const key = (k: string) => (
    <kbd style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 6px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: "ui-monospace, monospace", color: onSurface(doc), background: surfaceHigh(doc), border: `1px solid ${outlineVar(doc)}`, boxShadow: `0 1.5px 0 ${outlineVar(doc)}` }}>{k}</kbd>
  );
  return (
    <Row gap={5} style={{ alignItems: "center" }}>
      {key("⌘")}<span style={{ color: onSurfaceVar(doc) }}>+</span>{key("K")}
    </Row>
  );
}

export function CodeBlockPreview({ doc }: PreviewProps) {
  return (
    <div style={{ width: 250, borderRadius: 10, overflow: "hidden", border: `1px solid ${outlineVar(doc)}`, background: color(doc, "surface-container-highest", surfaceHigh(doc)), fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: `1px solid ${outlineVar(doc)}`, color: onSurfaceVar(doc) }}>
        <span>app.ts</span><span>⧉</span>
      </div>
      <div style={{ padding: "10px 12px", color: onSurface(doc), lineHeight: 1.6 }}>
        <div><span style={{ color: primary(doc) }}>const</span> kit = load()</div>
        <div><span style={{ color: primary(doc) }}>export</span> default kit</div>
      </div>
    </div>
  );
}

export function CarouselPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ alignItems: "center" }}>
      <div style={{ width: 220, height: 74, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, color: onSurfaceVar(doc), fontSize: 12 }}>Slide 1</div>
      <Row gap={6}>
        {[true, false, false].map((on, i) => (
          <span key={i} style={{ width: on ? 18 : 7, height: 7, borderRadius: 9999, background: on ? primary(doc) : outlineVar(doc) }} />
        ))}
      </Row>
    </Stack>
  );
}

export function CalendarPreview({ doc }: PreviewProps) {
  const days = Array.from({ length: 21 }, (_, i) => i + 1);
  const sel = 14;
  return (
    <div style={{ width: 200, padding: 10, borderRadius: 10, background: color(doc, "surface", "#fff"), border: `1px solid ${outlineVar(doc)}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: onSurface(doc), marginBottom: 6, textAlign: "center" }}>June 2026</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {days.map((d) => (
          <span key={d} style={{ aspectRatio: "1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, borderRadius: 6, background: d === sel ? primary(doc) : "transparent", color: d === sel ? onPrimary(doc) : onSurfaceVar(doc) }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

export function DataGridPreview({ doc }: PreviewProps) {
  const rows = [["#1024", "Paid", "$120"], ["#1025", "Open", "$80"], ["#1026", "Paid", "$60"]];
  const cell: React.CSSProperties = { padding: "7px 10px", fontSize: 12, textAlign: "left", color: onSurface(doc) };
  return (
    <div style={{ border: `1px solid ${outlineVar(doc)}`, borderRadius: 10, overflow: "hidden", maxWidth: 300 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: surfaceHigh(doc) }}>
            {["Order ↕", "Status", "Total"].map((h) => <th key={h} style={{ ...cell, fontWeight: 700, color: onSurfaceVar(doc) }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${outlineVar(doc)}`, background: i === 1 ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent" }}>
              {r.map((c, j) => <td key={j} style={cell}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
