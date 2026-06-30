"use client";

import type { ReactNode } from "react";
import { color } from "@/lib/designmd/tokens";
import { hexToHsl, variationRamp, brandGradients } from "@/lib/designmd/color";
import { ContrastBadge } from "@/components/editor/controls/ContrastBadge";
import { Block, SectionHeader, hairline, type SectionProps } from "./common";

const GROUPS: { label: string; roles: string[] }[] = [
  {
    label: "Brand",
    roles: ["primary", "primary-hover", "secondary", "tertiary", "accent", "error"],
  },
  {
    label: "Surfaces",
    roles: [
      "background",
      "surface",
      "surface-container",
      "surface-container-high",
      "surface-container-highest",
    ],
  },
  {
    label: "Text & lines",
    roles: ["on-surface", "on-surface-variant", "outline", "outline-variant"],
  },
];

/** Brand-ish roles used by the theory sub-blocks (hue / tone / shade / tint). */
const BRAND_ROLES = ["primary", "secondary", "tertiary", "accent", "error"];

/** Foreground/background pairs worth a WCAG read-out. */
const CONTRAST_PAIRS: { fg: string; bg: string; label: string }[] = [
  { fg: "on-primary", bg: "primary", label: "Primary" },
  { fg: "on-secondary", bg: "secondary", label: "Secondary" },
  { fg: "on-tertiary", bg: "tertiary", label: "Tertiary" },
  { fg: "on-surface", bg: "surface", label: "Surface" },
  { fg: "on-surface-variant", bg: "surface", label: "Muted text" },
  { fg: "on-error", bg: "error", label: "Error" },
];

/** Small uppercase sub-heading inside a section. */
function Sub({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
      {children}
    </div>
  );
}

/** A thin tint→shade gradation strip beneath a swatch. */
function RampStrip({ hex }: { hex: string }) {
  const light = variationRamp(hex, "tint", 5).reverse();
  const dark = variationRamp(hex, "shade", 5).slice(1);
  const steps = [...light, ...dark];
  return (
    <div className="flex h-3 w-full">
      {steps.map((c, i) => (
        <span key={i} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}

export function ColorPaletteSection({ doc, mark }: SectionProps) {
  const brand = BRAND_ROLES.filter((r) => doc.colors[r]);
  const surface = color(doc, "surface", color(doc, "background", "#ffffff"));

  // Brand gradients — from the Brandbook scheme when present, else the role
  // palette. Angle follows the Brandbook gradient setting.
  const scheme =
    doc.brandbook?.schemeColors?.length
      ? doc.brandbook.schemeColors
      : brand.map((r) => color(doc, r));
  const gradients = brandGradients(scheme, doc.brandbook?.gradients?.angle ?? 135);

  return (
    <Block>
      <SectionHeader index="01" kicker="Color" title="Palette & color theory" />

      {/* Colors — role swatches with a tint→shade gradation under each */}
      <div className="space-y-6">
        {GROUPS.map((g) => {
          const roles = g.roles.filter((r) => doc.colors[r]);
          if (!roles.length) return null;
          return (
            <div key={g.label}>
              <Sub>{g.label}</Sub>
              <div className="grid grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-5 gap-3">
                {roles.map((role) => {
                  const value = color(doc, role);
                  return (
                    <div
                      key={role}
                      {...mark({ group: "colors", key: role })}
                      className="rounded-lg overflow-hidden"
                      style={{ ...hairline() }}
                    >
                      <div style={{ background: value, height: 48 }} />
                      <RampStrip hex={value} />
                      <div className="px-2 py-1.5">
                        <div className="text-[11px] font-medium truncate">{role}</div>
                        <div className="text-[10px] opacity-50 font-mono uppercase">
                          {value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gradients — derived from the brand scheme, click to copy the CSS */}
      <div className="mt-8">
        <Sub>Gradients</Sub>
        <div className="grid grid-cols-2 @md:grid-cols-3 gap-3">
          {gradients.map((g) => (
            <button
              key={g.label}
              type="button"
              title="Copy CSS"
              onClick={() => navigator.clipboard?.writeText(g.css)}
              className="group text-left rounded-lg overflow-hidden cursor-pointer"
              style={{ ...hairline() }}
            >
              <span className="block h-16 w-full" style={{ background: g.css }} />
              <span className="block px-2 py-1.5">
                <span className="block text-[11px] font-medium truncate">{g.label}</span>
                <span className="block text-[10px] opacity-50 font-mono truncate group-hover:opacity-80">
                  {g.css}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contrast */}
      <div className="mt-8">
        <Sub>Contrast · WCAG</Sub>
        <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-2">
          {CONTRAST_PAIRS.filter((p) => doc.colors[p.fg] && doc.colors[p.bg]).map((p) => {
            const fg = color(doc, p.fg);
            const bg = color(doc, p.bg);
            return (
              <div
                key={p.label}
                className="flex items-center gap-3 rounded-lg px-3 py-2"
                style={{ background: bg, color: fg, ...hairline() }}
              >
                <span className="text-sm font-semibold flex-1">{p.label}</span>
                <span className="text-[11px] font-mono opacity-80">Aa</span>
                <ContrastBadge fg={fg} bg={bg} pairLabel={p.label} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hue */}
      {brand.length > 0 && (
        <div className="mt-8">
          <Sub>Hue · saturation · lightness</Sub>
          <div className="grid grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-5 gap-3">
            {brand.map((role) => {
              const value = color(doc, role);
              const hsl = hexToHsl(value);
              return (
                <div key={role} className="rounded-lg p-3" style={{ ...hairline() }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-full shrink-0"
                      style={{ background: value, ...hairline() }}
                    />
                    <span className="text-[11px] font-medium truncate">{role}</span>
                  </div>
                  {hsl ? (
                    <div className="text-[10px] font-mono opacity-60 leading-relaxed">
                      <div>H {Math.round(hsl.h)}°</div>
                      <div>S {Math.round(hsl.s)}%</div>
                      <div>L {Math.round(hsl.l)}%</div>
                    </div>
                  ) : (
                    <div className="text-[10px] opacity-40">non-hex</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tone / Shade / Tint */}
      {brand.length > 0 && (
        <div className="mt-8 space-y-5">
          {(["tint", "tone", "shade"] as const).map((kind) => (
            <div key={kind}>
              <Sub>
                {kind} —{" "}
                {kind === "tint"
                  ? "color + white"
                  : kind === "tone"
                    ? "color + gray"
                    : "color + black"}
              </Sub>
              <div className="space-y-2">
                {brand.map((role) => {
                  const value = color(doc, role);
                  const ramp = variationRamp(value, kind, 8);
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <span className="text-[11px] opacity-60 w-20 shrink-0 truncate">
                        {role}
                      </span>
                      <div
                        className="flex flex-1 h-6 rounded-md overflow-hidden"
                        style={{ ...hairline() }}
                      >
                        {ramp.map((c, i) => (
                          <span
                            key={i}
                            className="flex-1"
                            style={{ background: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-[11px] opacity-40">On {surface} surface.</p>
        </div>
      )}
    </Block>
  );
}
