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
import { color } from "@/lib/designmd/tokens";

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

export function NumberFieldPreview({ doc }: PreviewProps) {
  const stepper = (sign: string) => (
    <span style={{ width: 30, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: onSurfaceVar(doc), borderLeft: `1px solid ${outlineVar(doc)}` }}>{sign}</span>
  );
  return (
    <div style={{ display: "inline-flex", alignItems: "center", height: 38, borderRadius: 8, overflow: "hidden", border: `1px solid ${outlineCol(doc)}`, background: color(doc, "surface-container-high", surfaceHigh(doc)) }}>
      <span style={{ padding: "0 14px", fontSize: 13, color: onSurface(doc) }}>12</span>
      {stepper("−")}
      {stepper("+")}
    </div>
  );
}

export function PasswordFieldPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={4}>
      <Caption doc={doc}>Password</Caption>
      <div style={{ position: "relative" }}>
        <TInput doc={doc} value="••••••••••" style={{ paddingRight: 34, letterSpacing: 2 }} />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={onSurfaceVar(doc)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </Stack>
  );
}

export function DatePickerPreview({ doc }: PreviewProps) {
  return (
    <div style={{ position: "relative" }}>
      <TInput doc={doc} value="Jun 30, 2026" style={{ paddingRight: 36 }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={onSurfaceVar(doc)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)" }}>
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    </div>
  );
}

export function TimePickerPreview({ doc }: PreviewProps) {
  return (
    <div style={{ position: "relative" }}>
      <TInput doc={doc} value="14:30" style={{ paddingRight: 36 }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={onSurfaceVar(doc)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)" }}>
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </svg>
    </div>
  );
}

export function FileUploadPreview({ doc }: PreviewProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "18px 28px", borderRadius: 12, border: `1.5px dashed ${outlineCol(doc)}`, background: surfaceHigh(doc) }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={primary(doc)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: onSurface(doc) }}>Drop files or browse</span>
      <Caption doc={doc}>PNG, JPG up to 5MB</Caption>
    </div>
  );
}

export function ComboboxPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={6}>
      <div style={{ position: "relative" }}>
        <TInput doc={doc} value="Fra" style={{ paddingRight: 30 }} />
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: onSurfaceVar(doc) }}>▾</span>
      </div>
      <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${outlineVar(doc)}`, background: color(doc, "surface-container-high", surfaceHigh(doc)) }}>
        {["France", "Francia"].map((o, i) => (
          <div key={o} style={{ padding: "7px 12px", fontSize: 13, color: onSurface(doc), background: i === 0 ? color(doc, "secondary-container", surfaceHigh(doc)) : "transparent" }}>{o}</div>
        ))}
      </div>
    </Stack>
  );
}

export function TagInputPreview({ doc }: PreviewProps) {
  const tag = (label: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 6, fontSize: 12, background: color(doc, "secondary-container", surfaceHigh(doc)), color: color(doc, "on-secondary-container", onSurface(doc)) }}>
      {label}<span style={{ opacity: 0.6 }}>×</span>
    </span>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", minHeight: 40, padding: "6px 10px", borderRadius: 8, border: `1px solid ${outlineCol(doc)}`, background: color(doc, "surface-container-high", surfaceHigh(doc)) }}>
      {tag("design")}{tag("tokens")}
      <span style={{ fontSize: 13, color: onSurfaceVar(doc) }}>Add…</span>
    </div>
  );
}

export function OtpInputPreview({ doc }: PreviewProps) {
  const cells = ["4", "2", "", ""];
  return (
    <Row gap={8}>
      {cells.map((c, i) => (
        <span key={i} style={{ width: 36, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, borderRadius: 8, color: onSurface(doc), background: color(doc, "surface-container-high", surfaceHigh(doc)), border: `1.5px solid ${i === 2 ? primary(doc) : outlineCol(doc)}` }}>{c}</span>
      ))}
    </Row>
  );
}

export function RatingPreview({ doc }: PreviewProps) {
  const star = (fill: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={fill} stroke={primary(doc)} strokeWidth="1.5" aria-hidden>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />
    </svg>
  );
  return (
    <Row gap={3}>
      {star(primary(doc))}{star(primary(doc))}{star(primary(doc))}{star(primary(doc))}{star("transparent")}
    </Row>
  );
}

export function ColorInputPreview({ doc }: PreviewProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 38, padding: "0 10px", borderRadius: 8, border: `1px solid ${outlineCol(doc)}`, background: color(doc, "surface-container-high", surfaceHigh(doc)) }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: primary(doc), border: `1px solid ${outlineVar(doc)}` }} />
      <span style={{ fontSize: 13, fontFamily: "ui-monospace, monospace", color: onSurface(doc) }}>{primary(doc).toUpperCase()}</span>
    </div>
  );
}

export function FormFieldPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={5} style={{ maxWidth: 240 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: onSurface(doc) }}>Full name</span>
      <TInput doc={doc} value="Ada Lovelace" />
      <Caption doc={doc}>As it appears on your ID.</Caption>
    </Stack>
  );
}

export function FieldsetPreview({ doc }: PreviewProps) {
  return (
    <div style={{ borderRadius: 10, border: `1px solid ${outlineVar(doc)}`, padding: 12, maxWidth: 250 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: onSurface(doc), marginBottom: 8 }}>Address</div>
      <Stack gap={6}>
        <TInput doc={doc} placeholder="Street" style={{ height: 32 }} />
        <Row gap={6} wrap={false}>
          <TInput doc={doc} placeholder="City" style={{ height: 32 }} />
          <TInput doc={doc} placeholder="ZIP" style={{ height: 32, width: 70 }} />
        </Row>
      </Stack>
    </div>
  );
}
