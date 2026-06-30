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

const block = (doc: DocT, h: number, w: number | string = "100%") => (
  <span style={{ display: "block", height: h, width: w, borderRadius: 7, background: surfaceHigh(doc), border: `1px solid ${outlineVar(doc)}` }} />
);
type DocT = PreviewProps["doc"];

export function StackPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ width: 180 }}>
      {block(doc, 22)}{block(doc, 22)}{block(doc, 22)}
    </Stack>
  );
}

export function ClusterPreview({ doc }: PreviewProps) {
  const widths = [54, 38, 70, 46, 60];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 200 }}>
      {widths.map((w, i) => (
        <span key={i} style={{ height: 26, width: w, borderRadius: 9999, background: surfaceHigh(doc), border: `1px solid ${outlineVar(doc)}` }} />
      ))}
    </div>
  );
}

export function SpacerPreview({ doc }: PreviewProps) {
  return (
    <Row gap={0} wrap={false} style={{ alignItems: "center" }}>
      {block(doc, 30, 50)}
      <span style={{ width: 36, display: "inline-flex", justifyContent: "center", color: onSurfaceVar(doc), fontSize: 11 }}>↔</span>
      {block(doc, 30, 50)}
    </Row>
  );
}

export function AspectRatioPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={5} style={{ alignItems: "center" }}>
      <div style={{ width: 176, height: 99, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}`, color: onSurfaceVar(doc), fontSize: 12 }}>16 : 9</div>
    </Stack>
  );
}

export function ScrollAreaPreview({ doc }: PreviewProps) {
  return (
    <div style={{ position: "relative", width: 180, height: 96, borderRadius: 10, overflow: "hidden", background: color(doc, "surface", "#fff"), border: `1px solid ${outlineVar(doc)}` }}>
      <Stack gap={7} style={{ padding: 10, paddingRight: 16 }}>
        {block(doc, 12)}{block(doc, 12)}{block(doc, 12)}{block(doc, 12)}
      </Stack>
      <span style={{ position: "absolute", top: 8, bottom: 8, right: 5, width: 4, borderRadius: 9999, background: surfaceHigh(doc) }}>
        <span style={{ display: "block", width: "100%", height: 28, borderRadius: 9999, background: outlineVar(doc) }} />
      </span>
    </div>
  );
}

export function SplitPanePreview({ doc }: PreviewProps) {
  return (
    <Row gap={0} wrap={false} style={{ width: 220, height: 92, borderRadius: 10, overflow: "hidden", border: `1px solid ${outlineVar(doc)}` }}>
      <div style={{ flex: 1, padding: 10, background: color(doc, "surface", "#fff") }}><Caption doc={doc}>Editor</Caption></div>
      <span style={{ width: 4, alignSelf: "stretch", background: outlineVar(doc), cursor: "col-resize" }} />
      <div style={{ flex: 1, padding: 10, background: color(doc, "surface-container", surfaceHigh(doc)) }}><Caption doc={doc}>Preview</Caption></div>
    </Row>
  );
}

export function SectionPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ width: 220 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: onSurface(doc) }}>Team members</div>
      <Caption doc={doc}>Manage who has access to this workspace.</Caption>
      {block(doc, 30)}
    </Stack>
  );
}

export function PageHeaderPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ width: 250 }}>
      <Caption doc={doc}>Projects / Atlas</Caption>
      <Row wrap={false} style={{ justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: onSurface(doc) }}>Atlas</span>
        <span style={{ height: 30, padding: "0 14px", display: "inline-flex", alignItems: "center", borderRadius: 8, fontSize: 12, fontWeight: 600, background: primary(doc), color: color(doc, "on-primary", "#fff") }}>New</span>
      </Row>
      <span style={{ height: 1, background: outlineVar(doc) }} />
    </Stack>
  );
}

export function AppShellPreview({ doc }: PreviewProps) {
  return (
    <div style={{ width: 240, height: 120, borderRadius: 10, overflow: "hidden", border: `1px solid ${outlineVar(doc)}`, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 26, display: "flex", alignItems: "center", padding: "0 10px", gap: 6, background: color(doc, "surface-container", surfaceHigh(doc)), borderBottom: `1px solid ${outlineVar(doc)}` }}>
        <span style={{ width: 14, height: 14, borderRadius: 4, background: primary(doc) }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: onSurface(doc) }}>Acme</span>
      </div>
      <Row gap={0} wrap={false} style={{ flex: 1 }}>
        <Stack gap={6} style={{ width: 54, padding: 8, background: color(doc, "surface-container", surfaceHigh(doc)), borderRight: `1px solid ${outlineVar(doc)}` }}>
          {block(doc, 10)}{block(doc, 10)}{block(doc, 10)}
        </Stack>
        <Stack gap={7} style={{ flex: 1, padding: 10, background: color(doc, "surface", "#fff") }}>
          {block(doc, 12, "70%")}{block(doc, 12)}
        </Stack>
      </Row>
    </div>
  );
}

export function CardGridPreview({ doc }: PreviewProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, width: 220 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Stack key={i} gap={6} style={{ padding: 10, borderRadius: 8, background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: primary(doc), opacity: 0.85 }} />
          <span style={{ height: 8, width: "80%", borderRadius: 5, background: surfaceHigh(doc) }} />
        </Stack>
      ))}
    </div>
  );
}
