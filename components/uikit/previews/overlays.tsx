"use client";

import {
  type PreviewProps,
  TButton,
  Row,
  Stack,
  Caption,
  primary,
  onSurface,
  onSurfaceVar,
  outlineVar,
  surfaceHigh,
  radius,
} from "./primitives";
import { color } from "@/lib/designmd/tokens";

/** A static "screenshot" of an overlay sitting over a dimmed scrim. */
function Scrim({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "rgba(0,0,0,0.28)", padding: 16, display: "flex", justifyContent: "center" }}>
      {children}
    </div>
  );
}

export function ModalPreview({ doc }: PreviewProps) {
  return (
    <Scrim>
      <Stack gap={10} style={{ width: 220, padding: 16, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: onSurface(doc) }}>Delete file?</div>
        <Caption doc={doc}>This action cannot be undone.</Caption>
        <Row gap={8} style={{ justifyContent: "flex-end" }}>
          <TButton doc={doc} size="sm" variant="plain">Cancel</TButton>
          <TButton doc={doc} size="sm" variant="primary">Delete</TButton>
        </Row>
      </Stack>
    </Scrim>
  );
}

export function DrawerPreview({ doc }: PreviewProps) {
  return (
    <Scrim>
      <div style={{ display: "flex", width: "100%", height: 110, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ flex: 1 }} />
        <Stack gap={8} style={{ width: 140, padding: 12, background: color(doc, "surface-container", surfaceHigh(doc)), borderLeft: `1px solid ${outlineVar(doc)}` }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: onSurface(doc) }}>Filters</div>
          <span style={{ height: 8, width: "80%", borderRadius: 6, background: surfaceHigh(doc) }} />
          <span style={{ height: 8, width: "60%", borderRadius: 6, background: surfaceHigh(doc) }} />
        </Stack>
      </div>
    </Scrim>
  );
}

export function PopoverPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={0} style={{ alignItems: "flex-start" }}>
      <TButton doc={doc} size="sm" variant="secondary">Anchor</TButton>
      <span style={{ width: 0, height: 0, marginLeft: 16, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: `6px solid ${color(doc, "surface-container-high", surfaceHigh(doc))}` }} />
      <Stack gap={6} style={{ width: 180, padding: 12, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: onSurface(doc) }}>Quick settings</div>
        <Caption doc={doc}>Anchored floating content.</Caption>
      </Stack>
    </Stack>
  );
}

export function AccordionPreview({ doc }: PreviewProps) {
  const rows = [{ q: "What is included?", open: true }, { q: "Can I cancel anytime?", open: false }];
  return (
    <Stack gap={0} style={{ border: `1px solid ${outlineVar(doc)}`, borderRadius: 10, overflow: "hidden", maxWidth: 260 }}>
      {rows.map((r, i) => (
        <div key={r.q} style={{ borderTop: i ? `1px solid ${outlineVar(doc)}` : "none" }}>
          <Row wrap={false} style={{ padding: "10px 12px", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: onSurface(doc) }}>{r.q}</span>
            <span style={{ color: onSurfaceVar(doc) }}>{r.open ? "−" : "+"}</span>
          </Row>
          {r.open && <div style={{ padding: "0 12px 12px", fontSize: 12, color: onSurfaceVar(doc) }}>Everything in the plan, billed monthly.</div>}
        </div>
      ))}
    </Stack>
  );
}

export function RichTooltipPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ width: 200, padding: 12, borderRadius: radius(doc, "lg"), background: color(doc, "inverse-surface", onSurface(doc)), color: color(doc, "inverse-on-surface", color(doc, "surface", "#fff")) }}>
      <div style={{ fontWeight: 700, fontSize: 13 }}>Keyboard shortcuts</div>
      <div style={{ fontSize: 12, opacity: 0.85 }}>Press ⌘K to open the command palette.</div>
      <span style={{ fontSize: 12, fontWeight: 700, color: primary(doc) }}>Learn more →</span>
    </Stack>
  );
}

export function ConfirmDialogPreview({ doc }: PreviewProps) {
  return (
    <Scrim>
      <Stack gap={8} style={{ width: 220, padding: 16, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}>
        <Row gap={8} wrap={false}>
          <span style={{ width: 22, height: 22, borderRadius: 9999, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, background: color(doc, "error-container", surfaceHigh(doc)), color: color(doc, "on-error-container", onSurface(doc)) }}>!</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: onSurface(doc) }}>Remove member?</div>
        </Row>
        <Caption doc={doc}>They will lose access immediately.</Caption>
        <Row gap={8} style={{ justifyContent: "flex-end" }}>
          <TButton doc={doc} size="sm" variant="plain">Cancel</TButton>
          <TButton doc={doc} size="sm" variant="primary" style={{ background: color(doc, "error", "#dc2626"), color: color(doc, "on-error", "#fff") }}>Remove</TButton>
        </Row>
      </Stack>
    </Scrim>
  );
}

export function SheetPreview({ doc }: PreviewProps) {
  return (
    <Scrim>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%", height: 110, borderRadius: 10, overflow: "hidden" }}>
        <Stack gap={8} style={{ padding: 14, background: color(doc, "surface-container-high", surfaceHigh(doc)), borderTopLeftRadius: 16, borderTopRightRadius: 16, borderTop: `1px solid ${outlineVar(doc)}` }}>
          <span style={{ width: 36, height: 4, borderRadius: 9999, background: outlineVar(doc), alignSelf: "center" }} />
          <div style={{ fontWeight: 700, fontSize: 13, color: onSurface(doc) }}>Share sheet</div>
          <Row gap={8}><span style={{ width: 36, height: 36, borderRadius: 9999, background: surfaceHigh(doc) }} /><span style={{ width: 36, height: 36, borderRadius: 9999, background: surfaceHigh(doc) }} /></Row>
        </Stack>
      </div>
    </Scrim>
  );
}

export function ContextMenuPreview({ doc }: PreviewProps) {
  const items = [{ l: "Cut", on: false }, { l: "Copy", on: true }, { l: "Paste", on: false }];
  return (
    <Stack gap={2} style={{ width: 150, padding: 6, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 10px 26px rgba(0,0,0,0.18)" }}>
      {items.map((it) => (
        <div key={it.l} style={{ padding: "7px 10px", borderRadius: 6, fontSize: 13, color: onSurface(doc), background: it.on ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent" }}>{it.l}</div>
      ))}
    </Stack>
  );
}

export function DropdownPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={0} style={{ alignItems: "flex-start" }}>
      <TButton doc={doc} size="sm" variant="secondary">Actions ▾</TButton>
      <Stack gap={2} style={{ marginTop: 6, width: 150, padding: 6, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, boxShadow: "0 10px 26px rgba(0,0,0,0.18)" }}>
        {[{ l: "Rename", on: true }, { l: "Archive", on: false }].map((it) => (
          <div key={it.l} style={{ padding: "7px 10px", borderRadius: 6, fontSize: 13, color: onSurface(doc), background: it.on ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent" }}>{it.l}</div>
        ))}
      </Stack>
    </Stack>
  );
}

export function LightboxPreview({ doc }: PreviewProps) {
  const arrow = (d: string) => (
    <span style={{ width: 26, height: 26, borderRadius: 9999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: 14 }}>{d}</span>
  );
  return (
    <Scrim>
      <Row wrap={false} style={{ gap: 8, alignItems: "center", width: "100%", justifyContent: "center" }}>
        {arrow("‹")}
        <div style={{ width: 150, height: 92, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: color(doc, "surface-container", surfaceHigh(doc)), color: onSurfaceVar(doc), fontSize: 12 }}>Image 2 / 5</div>
        {arrow("›")}
      </Row>
    </Scrim>
  );
}
