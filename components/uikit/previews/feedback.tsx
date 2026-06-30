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

export function CalloutPreview({ doc }: PreviewProps) {
  const bg = color(doc, "primary-container", surfaceHigh(doc));
  const fg = color(doc, "on-primary-container", onSurface(doc));
  return (
    <div style={{ display: "flex", gap: 10, maxWidth: 270, padding: "12px 14px", borderRadius: radius(doc, "lg"), background: bg, color: fg }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" />
      </svg>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>Good to know</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Tokens cascade to every component automatically.</div>
      </div>
    </div>
  );
}

export function BannerPreview({ doc }: PreviewProps) {
  const bg = color(doc, "secondary-container", surfaceHigh(doc));
  const fg = color(doc, "on-secondary-container", onSurface(doc));
  return (
    <Row wrap={false} style={{ gap: 12, width: 290, padding: "10px 14px", borderRadius: radius(doc, "lg"), background: bg, color: fg }}>
      <span style={{ fontSize: 13, flex: 1 }}>Scheduled maintenance this Sunday.</span>
      <span style={{ fontSize: 13, fontWeight: 700, textDecoration: "underline" }}>Details</span>
      <span style={{ opacity: 0.6 }}>✕</span>
    </Row>
  );
}

export function InlineMessagePreview({ doc }: PreviewProps) {
  return (
    <Stack gap={6}>
      <Row gap={6} wrap={false} style={{ color: primary(doc), fontSize: 12, fontWeight: 600 }}>
        <span>✓</span><span>Username is available</span>
      </Row>
      <Row gap={6} wrap={false} style={{ color: color(doc, "error", "#dc2626"), fontSize: 12, fontWeight: 600 }}>
        <span>!</span><span>Password is too short</span>
      </Row>
    </Stack>
  );
}

export function ProgressCirclePreview({ doc }: PreviewProps) {
  const track = surfaceHigh(doc);
  return (
    <span
      style={{
        width: 52, height: 52, borderRadius: 9999, display: "inline-flex", alignItems: "center",
        justifyContent: "center", fontSize: 13, fontWeight: 700, color: onSurface(doc),
        background: `conic-gradient(${primary(doc)} 0 70%, ${track} 70% 100%)`,
      }}
    >
      <span style={{ width: 38, height: 38, borderRadius: 9999, background: color(doc, "surface", "#fff"), display: "inline-flex", alignItems: "center", justifyContent: "center" }}>70%</span>
    </span>
  );
}

export function StatusDotPreview({ doc }: PreviewProps) {
  const item = (c: string, label: string) => (
    <Row gap={6} wrap={false}>
      <span style={{ width: 9, height: 9, borderRadius: 9999, background: c }} />
      <span style={{ fontSize: 12, color: onSurface(doc) }}>{label}</span>
    </Row>
  );
  return (
    <Stack gap={7}>
      {item(primary(doc), "Online")}
      {item(color(doc, "tertiary", "#f59e0b"), "Away")}
      {item(color(doc, "error", "#dc2626"), "Busy")}
    </Stack>
  );
}

export function LoadingOverlayPreview({ doc }: PreviewProps) {
  return (
    <div style={{ position: "relative", width: 220, height: 96, borderRadius: radius(doc, "lg"), overflow: "hidden", background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      <Stack gap={6} style={{ padding: 12, opacity: 0.4 }}>
        <span style={{ height: 10, width: "70%", borderRadius: 6, background: surfaceHigh(doc), display: "block" }} />
        <span style={{ height: 10, width: "45%", borderRadius: 6, background: surfaceHigh(doc), display: "block" }} />
      </Stack>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.18)" }}>
        <span style={{ width: 26, height: 26, borderRadius: 9999, border: `3px solid ${surfaceHigh(doc)}`, borderTopColor: primary(doc), animation: "dmd-spin 0.8s linear infinite" }} />
      </div>
    </div>
  );
}
