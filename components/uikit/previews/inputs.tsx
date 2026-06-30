"use client";

import {
  type PreviewProps,
  TInput,
  Row,
  Stack,
  Caption,
  primary,
  onPrimary,
  onSurface,
  onSurfaceVar,
  outlineCol,
  outlineVar,
  surfaceHigh,
} from "./primitives";

export function TextFieldPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={4}>
      <Caption doc={doc}>Email</Caption>
      <TInput doc={doc} type="email" value="you@example.com" />
    </Stack>
  );
}

export function TextareaPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={4}>
      <Caption doc={doc}>Message</Caption>
      <TInput doc={doc} value="Multi-line text input…" style={{ height: 64, padding: "10px 12px", alignItems: "start" }} />
    </Stack>
  );
}

export function SelectPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={4}>
      <Caption doc={doc}>Topic</Caption>
      <div style={{ position: "relative" }}>
        <TInput doc={doc} value="Billing" style={{ paddingRight: 32 }} />
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: onSurfaceVar(doc) }}>▾</span>
      </div>
    </Stack>
  );
}

export function CheckboxPreview({ doc }: PreviewProps) {
  const box = (checked: boolean) => (
    <span
      style={{
        width: 18, height: 18, borderRadius: 5, display: "inline-flex", alignItems: "center",
        justifyContent: "center", fontSize: 12, fontWeight: 700,
        background: checked ? primary(doc) : "transparent",
        color: onPrimary(doc),
        border: `1.5px solid ${checked ? primary(doc) : outlineCol(doc)}`,
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
  return (
    <Stack gap={8}>
      <Row gap={8} wrap={false}>{box(true)}<span style={{ fontSize: 13, color: onSurface(doc) }}>Subscribe to updates</span></Row>
      <Row gap={8} wrap={false}>{box(false)}<span style={{ fontSize: 13, color: onSurface(doc) }}>Send me offers</span></Row>
    </Stack>
  );
}

export function RadioPreview({ doc }: PreviewProps) {
  const dot = (on: boolean) => (
    <span
      style={{
        width: 18, height: 18, borderRadius: 9999, display: "inline-flex", alignItems: "center",
        justifyContent: "center", border: `1.5px solid ${on ? primary(doc) : outlineCol(doc)}`,
      }}
    >
      {on && <span style={{ width: 9, height: 9, borderRadius: 9999, background: primary(doc) }} />}
    </span>
  );
  return (
    <Stack gap={8}>
      <Row gap={8} wrap={false}>{dot(true)}<span style={{ fontSize: 13, color: onSurface(doc) }}>Standard</span></Row>
      <Row gap={8} wrap={false}>{dot(false)}<span style={{ fontSize: 13, color: onSurface(doc) }}>Express</span></Row>
    </Stack>
  );
}

export function SwitchPreview({ doc }: PreviewProps) {
  const track = (on: boolean) => (
    <span
      style={{
        width: 40, height: 22, borderRadius: 9999, padding: 2, display: "inline-flex",
        background: on ? primary(doc) : surfaceHigh(doc),
        border: `1px solid ${on ? primary(doc) : outlineVar(doc)}`,
        justifyContent: on ? "flex-end" : "flex-start", transition: "all .15s",
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: 9999, background: on ? onPrimary(doc) : onSurfaceVar(doc) }} />
    </span>
  );
  return (
    <Stack gap={8}>
      <Row gap={10} wrap={false}>{track(true)}<span style={{ fontSize: 13, color: onSurface(doc) }}>Notifications on</span></Row>
      <Row gap={10} wrap={false}>{track(false)}<span style={{ fontSize: 13, color: onSurface(doc) }}>Dark mode</span></Row>
    </Stack>
  );
}

export function SliderPreview({ doc }: PreviewProps) {
  return (
    <div style={{ position: "relative", height: 22, display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 9999, background: surfaceHigh(doc) }} />
      <span style={{ position: "absolute", left: 0, width: "60%", height: 4, borderRadius: 9999, background: primary(doc) }} />
      <span style={{ position: "absolute", left: "60%", width: 18, height: 18, borderRadius: 9999, background: primary(doc), border: `2px solid ${onPrimary(doc)}`, transform: "translateX(-50%)" }} />
    </div>
  );
}

export function SearchPreview({ doc }: PreviewProps) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: onSurfaceVar(doc), fontSize: 14 }}>⌕</span>
      <TInput doc={doc} placeholder="Search…" style={{ paddingLeft: 30 }} />
    </div>
  );
}
