"use client";

import {
  type PreviewProps,
  TButton,
  Row,
  primary,
  onPrimary,
  onSurface,
  onSurfaceVar,
  outlineVar,
  surfaceHigh,
} from "./primitives";

export function ButtonPreview({ doc }: PreviewProps) {
  return (
    <Row>
      <TButton doc={doc} variant="primary">Primary</TButton>
      <TButton doc={doc} variant="secondary">Secondary</TButton>
      <TButton doc={doc} variant="plain">Plain</TButton>
    </Row>
  );
}

const Glyph = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function IconButtonPreview({ doc }: PreviewProps) {
  return (
    <Row>
      <button
        type="button"
        style={{
          width: 38, height: 38, display: "inline-flex", alignItems: "center",
          justifyContent: "center", borderRadius: 9999, border: "none",
          background: primary(doc), cursor: "pointer",
        }}
        aria-label="Add"
      >
        <Glyph color={onPrimary(doc)} />
      </button>
      <button
        type="button"
        style={{
          width: 38, height: 38, display: "inline-flex", alignItems: "center",
          justifyContent: "center", borderRadius: 9999,
          border: `1px solid ${outlineVar(doc)}`, background: "transparent", cursor: "pointer",
        }}
        aria-label="Add"
      >
        <Glyph color={onSurface(doc)} />
      </button>
    </Row>
  );
}

export function ButtonGroupPreview({ doc }: PreviewProps) {
  const items = ["Day", "Week", "Month"];
  const active = 1;
  return (
    <div style={{ display: "inline-flex", borderRadius: 10, overflow: "hidden", border: `1px solid ${outlineVar(doc)}` }}>
      {items.map((it, i) => (
        <button
          key={it}
          type="button"
          style={{
            padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
            borderLeft: i ? `1px solid ${outlineVar(doc)}` : "none",
            background: i === active ? primary(doc) : "transparent",
            color: i === active ? onPrimary(doc) : onSurface(doc),
          }}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

export function FabPreview({ doc }: PreviewProps) {
  return (
    <button
      type="button"
      aria-label="Compose"
      style={{
        width: 52, height: 52, display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: 16, border: "none", background: primary(doc), cursor: "pointer",
        boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
      }}
    >
      <Glyph color={onPrimary(doc)} />
    </button>
  );
}

export function LinkPreview({ doc }: PreviewProps) {
  return (
    <span style={{ fontSize: 14, color: onSurface(doc) }}>
      Read our{" "}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: primary(doc), textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        documentation
      </a>{" "}
      to learn more.
    </span>
  );
}

const Chevron = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function SplitButtonPreview({ doc }: PreviewProps) {
  return (
    <div style={{ display: "inline-flex", borderRadius: 10, overflow: "hidden" }}>
      <TButton doc={doc} variant="primary" style={{ borderRadius: 0, borderRight: `1px solid ${outlineVar(doc)}` }}>
        Save
      </TButton>
      <button
        type="button"
        aria-label="More actions"
        style={{
          width: 34, display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: "none", background: primary(doc), cursor: "pointer",
        }}
      >
        <Chevron color={onPrimary(doc)} />
      </button>
    </div>
  );
}

export function ToggleButtonPreview({ doc }: PreviewProps) {
  const Item = ({ label, on }: { label: string; on: boolean }) => (
    <button
      type="button"
      aria-pressed={on}
      style={{
        height: 36, padding: "0 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        borderRadius: 8, border: `1px solid ${outlineVar(doc)}`,
        background: on ? surfaceHigh(doc) : "transparent",
        color: on ? onSurface(doc) : onSurfaceVar(doc),
      }}
    >
      {label}
    </button>
  );
  return (
    <Row>
      <Item label="Bold" on />
      <Item label="Italic" on={false} />
    </Row>
  );
}

export function CopyButtonPreview({ doc }: PreviewProps) {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex", alignItems: "center", gap: 7, height: 34, padding: "0 12px",
        fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8,
        border: `1px solid ${outlineVar(doc)}`, background: surfaceHigh(doc), color: onSurface(doc),
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={onSurface(doc)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
      Copy
    </button>
  );
}

export function SegmentedControlPreview({ doc }: PreviewProps) {
  const items = ["List", "Board", "Grid"];
  const active = 0;
  return (
    <div
      style={{
        display: "inline-flex", gap: 2, padding: 3, borderRadius: 9999,
        background: surfaceHigh(doc), border: `1px solid ${outlineVar(doc)}`,
      }}
    >
      {items.map((it, i) => (
        <span
          key={it}
          style={{
            padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 9999,
            background: i === active ? primary(doc) : "transparent",
            color: i === active ? onPrimary(doc) : onSurfaceVar(doc),
          }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}
