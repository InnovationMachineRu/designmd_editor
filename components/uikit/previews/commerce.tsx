"use client";

import {
  type PreviewProps,
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
  radius,
} from "./primitives";
import { color } from "@/lib/designmd/tokens";

const Check = ({ c }: { c: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m20 6-11 11-5-5" />
  </svg>
);

export function PricingCardPreview({ doc }: PreviewProps) {
  const bg = color(doc, "primary-container", surfaceHigh(doc));
  const fg = color(doc, "on-primary-container", onSurface(doc));
  return (
    <Stack gap={10} style={{ width: 190, padding: 16, borderRadius: radius(doc, "lg"), background: bg, color: fg, border: `1px solid ${outlineVar(doc)}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>Pro</div>
      <Row gap={4} wrap={false} style={{ alignItems: "baseline" }}>
        <span style={{ fontSize: 26, fontWeight: 800 }}>$24</span>
        <span style={{ fontSize: 12, opacity: 0.7 }}>/mo</span>
      </Row>
      <Stack gap={5}>
        {["Unlimited projects", "Priority support"].map((f) => (
          <Row key={f} gap={6} wrap={false}><Check c={fg} /><span style={{ fontSize: 12 }}>{f}</span></Row>
        ))}
      </Stack>
      <TButton doc={doc} size="sm" variant="primary">Choose plan</TButton>
    </Stack>
  );
}

export function PricingTablePreview({ doc }: PreviewProps) {
  const cell: React.CSSProperties = { padding: "7px 10px", fontSize: 12, textAlign: "center", color: onSurface(doc) };
  return (
    <div style={{ border: `1px solid ${outlineVar(doc)}`, borderRadius: 10, overflow: "hidden", width: 250 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: surfaceHigh(doc) }}>
            <th style={{ ...cell, textAlign: "left", color: onSurfaceVar(doc) }}>Feature</th>
            <th style={{ ...cell, color: onSurfaceVar(doc) }}>Free</th>
            <th style={{ ...cell, color: primary(doc), fontWeight: 700 }}>Pro</th>
          </tr>
        </thead>
        <tbody>
          {[["Projects", "3", "∞"], ["Support", "—", "✓"]].map((r, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${outlineVar(doc)}` }}>
              <td style={{ ...cell, textAlign: "left" }}>{r[0]}</td>
              <td style={{ ...cell, color: onSurfaceVar(doc) }}>{r[1]}</td>
              <td style={{ ...cell, background: color(doc, "primary-container", surfaceHigh(doc)), color: color(doc, "on-primary-container", onSurface(doc)), fontWeight: 600 }}>{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FeatureCardPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={8} style={{ width: 200, padding: 16, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", background: color(doc, "primary-container", surfaceHigh(doc)) }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color(doc, "on-primary-container", primary(doc))} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m13 2-3 7h6l-5 13" />
        </svg>
      </span>
      <div style={{ fontSize: 14, fontWeight: 700, color: onSurface(doc) }}>Lightning fast</div>
      <Caption doc={doc}>Generate a full design system spec in seconds.</Caption>
    </Stack>
  );
}

export function TestimonialPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={10} style={{ width: 230, padding: 16, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: onSurface(doc) }}>“The cleanest design-to-code handoff I&apos;ve used.”</div>
      <Row gap={8} wrap={false}>
        <span style={{ width: 30, height: 30, borderRadius: 9999, background: primary(doc), color: onPrimary(doc), display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>JD</span>
        <Stack gap={0}>
          <span style={{ fontSize: 12, fontWeight: 700, color: onSurface(doc) }}>Jordan Diaz</span>
          <Caption doc={doc}>Design Lead, Northwind</Caption>
        </Stack>
      </Row>
    </Stack>
  );
}

export function CtaBannerPreview({ doc }: PreviewProps) {
  const bg = color(doc, "primary-container", primary(doc));
  const fg = color(doc, "on-primary-container", onPrimary(doc));
  return (
    <Stack gap={10} style={{ width: 250, padding: "18px 20px", borderRadius: radius(doc, "xl", "16px"), background: bg, color: fg, alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 800 }}>Ship your design system today</div>
      <Caption doc={doc}>Start free — no credit card required.</Caption>
      <span style={{ height: 34, padding: "0 18px", display: "inline-flex", alignItems: "center", borderRadius: 9, fontSize: 13, fontWeight: 700, background: primary(doc), color: onPrimary(doc) }}>Get started</span>
    </Stack>
  );
}

export function StatCardPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={4} style={{ width: 160, padding: 16, borderRadius: radius(doc, "lg"), background: color(doc, "surface-container", surfaceHigh(doc)), border: `1px solid ${outlineVar(doc)}` }}>
      <Caption doc={doc}>Active users</Caption>
      <span style={{ fontSize: 24, fontWeight: 800, color: onSurface(doc) }}>12,480</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: primary(doc) }}>▲ 8.2% this week</span>
    </Stack>
  );
}

export function HeroPreview({ doc }: PreviewProps) {
  return (
    <Stack gap={10} style={{ width: 260, alignItems: "center", textAlign: "center", padding: "8px 4px" }}>
      <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: color(doc, "secondary-container", surfaceHigh(doc)), color: color(doc, "on-secondary-container", onSurface(doc)) }}>New · v2</span>
      <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, color: onSurface(doc) }}>Design systems, done right</div>
      <Caption doc={doc}>Bind brand decisions to code-ready tokens.</Caption>
      <Row gap={8}>
        <TButton doc={doc} size="sm" variant="primary">Start free</TButton>
        <TButton doc={doc} size="sm" variant="plain">Live demo</TButton>
      </Row>
    </Stack>
  );
}
