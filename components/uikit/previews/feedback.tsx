"use client";

import {
  type PreviewProps,
  Row,
  Stack,
  Caption,
  TButton,
  primary,
  onPrimary,
  onSurface,
  onSurfaceVar,
  outlineVar,
  surfaceHigh,
  radius,
} from "./primitives";
import { color } from "@/lib/designmd/tokens";

export function AlertPreview({ doc }: PreviewProps) {
  const accent = color(doc, "primary", "#2563eb");
  const bg = color(doc, "primary-container", color(doc, "surface-container-high", surfaceHigh(doc)));
  const fg = color(doc, "on-primary-container", onSurface(doc));
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: radius(doc, "lg"), background: bg, color: fg }}>
      <span style={{ width: 18, height: 18, borderRadius: 9999, background: accent, color: onPrimary(doc), display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>i</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>Heads up</div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Your changes were saved automatically.</div>
      </div>
    </div>
  );
}

export function ToastPreview({ doc }: PreviewProps) {
  return (
    <Row
      wrap={false}
      style={{
        gap: 12, padding: "10px 14px", borderRadius: radius(doc, "lg"), maxWidth: 280,
        background: color(doc, "inverse-surface", onSurface(doc)),
        color: color(doc, "inverse-on-surface", color(doc, "surface", "#fff")),
        boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
      }}
    >
      <span style={{ fontSize: 13, flex: 1 }}>Message sent</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: primary(doc) }}>Undo</span>
    </Row>
  );
}

export function ProgressBarPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={6}>
      <span style={{ height: 8, borderRadius: 9999, background: surfaceHigh(doc), overflow: "hidden", display: "block" }}>
        <span style={{ display: "block", width: "65%", height: "100%", borderRadius: 9999, background: primary(doc) }} />
      </span>
      <Caption doc={doc}>Uploading — 65%</Caption>
    </Stack>
  );
}

export function SpinnerPreview({ doc }: PreviewProps) {
  return (
    <span
      style={{
        width: 28, height: 28, borderRadius: 9999, display: "inline-block",
        border: `3px solid ${surfaceHigh(doc)}`, borderTopColor: primary(doc),
        animation: "dmd-spin 0.8s linear infinite",
      }}
    />
  );
}

export function SkeletonPreview({ doc }: PreviewProps) {
  const bar = (w: string | number) => (
    <span style={{ display: "block", height: 12, width: w, borderRadius: 6, background: surfaceHigh(doc), opacity: 0.7 }} />
  );
  return (
    <Row gap={12} wrap={false}>
      <span style={{ width: 40, height: 40, borderRadius: 9999, background: surfaceHigh(doc), opacity: 0.7, flexShrink: 0 }} />
      <Stack gap={8} style={{ flex: 1 }}>{bar("80%")}{bar("55%")}</Stack>
    </Row>
  );
}

export function EmptyStatePreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ alignItems: "center", textAlign: "center", padding: "8px 4px" }}>
      <span style={{ width: 44, height: 44, borderRadius: 12, background: surfaceHigh(doc), display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: onSurfaceVar(doc), border: `1px dashed ${outlineVar(doc)}` }}>＋</span>
      <div style={{ fontWeight: 700, fontSize: 13, color: onSurface(doc) }}>No projects yet</div>
      <Caption doc={doc}>Create your first project to get started.</Caption>
      <TButton doc={doc} size="sm" variant="primary">New project</TButton>
    </Stack>
  );
}
