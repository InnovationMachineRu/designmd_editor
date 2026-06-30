"use client";

import {
  type PreviewProps,
  Row,
  Stack,
  Caption,
  onSurface,
  onSurfaceVar,
  outlineVar,
  surfaceHigh,
  primary,
} from "./primitives";
import { color } from "@/lib/designmd/tokens";

export function ContainerPreview({ doc }: PreviewProps) {
  return (
    <div style={{ padding: 10, borderRadius: 10, background: surfaceHigh(doc), border: `1px dashed ${outlineVar(doc)}` }}>
      <div style={{ maxWidth: 200, margin: "0 auto", padding: 12, borderRadius: 8, background: color(doc, "surface", "#fff"), border: `1px solid ${outlineVar(doc)}`, textAlign: "center" }}>
        <Caption doc={doc}>Max-width centered content</Caption>
      </div>
    </div>
  );
}

export function GridPreview({ doc }: PreviewProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} style={{ height: 34, borderRadius: 8, background: i % 2 ? surfaceHigh(doc) : color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }} />
      ))}
    </div>
  );
}

export function DividerPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={10}>
      <span style={{ fontSize: 13, color: onSurface(doc) }}>Section one</span>
      <span style={{ height: 1, background: outlineVar(doc) }} />
      <Row gap={10} wrap={false} style={{ height: 20 }}>
        <span style={{ fontSize: 13, color: onSurfaceVar(doc) }}>Left</span>
        <span style={{ width: 1, alignSelf: "stretch", background: outlineVar(doc) }} />
        <span style={{ fontSize: 13, color: onSurfaceVar(doc) }}>Right</span>
      </Row>
    </Stack>
  );
}

export function ToolbarPreview({ doc }: PreviewProps) {
  const Btn = ({ label, on }: { label: string; on?: boolean }) => (
    <span style={{ width: 30, height: 30, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 7, fontSize: 14, fontWeight: 700, background: on ? primary(doc) : "transparent", color: on ? color(doc, "on-primary", "#fff") : onSurfaceVar(doc) }}>{label}</span>
  );
  return (
    <Row gap={4} style={{ padding: 6, borderRadius: 10, background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, width: "fit-content" }}>
      <Btn label="B" on />
      <Btn label="I" />
      <Btn label="U" />
      <span style={{ width: 1, height: 20, background: outlineVar(doc), margin: "0 4px" }} />
      <Btn label="≡" />
    </Row>
  );
}
