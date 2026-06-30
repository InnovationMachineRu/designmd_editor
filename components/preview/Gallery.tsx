"use client";

import { useState, type CSSProperties } from "react";
import type { DesignDoc } from "@/lib/designmd/types";
import { color, resolveComponent, resolveTypography } from "@/lib/designmd/tokens";
import { type Decor } from "./decor";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3
        className="text-xs font-semibold uppercase tracking-wider opacity-60"
        style={{ letterSpacing: "0.08em" }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function PreviewButton({
  doc,
  base,
  hover,
  extra,
  label,
}: {
  doc: DesignDoc;
  base: string;
  hover?: string;
  extra?: CSSProperties;
  label: string;
}) {
  const [over, setOver] = useState(false);
  const style = resolveComponent(doc, doc.components[base]);
  const hoverStyle = hover ? resolveComponent(doc, doc.components[hover]) : {};
  return (
    <button
      type="button"
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.15s ease, box-shadow 0.15s ease",
        ...style,
        ...extra,
        ...(over ? hoverStyle : {}),
      }}
    >
      {label}
    </button>
  );
}

export function Gallery({
  doc,
  decor,
}: {
  doc: DesignDoc;
  decor: Decor;
}) {
  const card = (elevated = false): CSSProperties => ({
    ...resolveComponent(doc, doc.components[elevated ? "card-elevated" : "card"]),
    ...(elevated ? decor.surfaceElevated : decor.surface),
  });

  const onSurface = color(doc, "on-surface", "#111");
  const onSurfaceVar = color(doc, "on-surface-variant", onSurface);

  return (
    <div className="space-y-8">
      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-2" style={{ color: onSurface }}>
          {(["display-lg", "headline-lg", "title-md", "body-md", "label-sm"] as const)
            .filter((k) => doc.typography[k])
            .map((k) => (
              <div key={k} style={resolveTypography(doc, `{typography.${k}}`)}>
                {k === "label-sm" ? "LABEL · SMALL CAPS" : "The quick brown fox"}
              </div>
            ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <PreviewButton
            doc={doc}
            base="button-primary"
            hover="button-primary-hover"
            extra={decor.button}
            label="Primary"
          />
          <PreviewButton doc={doc} base="button-secondary" extra={decor.button} label="Secondary" />
          <PreviewButton doc={doc} base="button-ghost" label="Ghost" />
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs">
        <div className="space-y-2 max-w-sm">
          <label className="block text-xs" style={{ color: onSurfaceVar }}>
            Email address
          </label>
          <input
            placeholder="you@example.com"
            style={{
              width: "100%",
              outline: "none",
              ...resolveComponent(doc, doc.components["input-field"]),
              ...decor.input,
            }}
          />
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={card(false)}>
            <div style={{ ...resolveTypography(doc, "{typography.title-md}"), marginBottom: 6 }}>
              Standard card
            </div>
            <p style={{ ...resolveTypography(doc, "{typography.body-sm}"), color: onSurfaceVar }}>
              Surface container with token-bound padding and radius.
            </p>
          </div>
          <div style={card(true)}>
            <div style={{ ...resolveTypography(doc, "{typography.title-md}"), marginBottom: 6 }}>
              Elevated card
            </div>
            <p style={{ ...resolveTypography(doc, "{typography.body-sm}"), color: onSurfaceVar }}>
              Higher surface with the preset elevation treatment.
            </p>
          </div>
        </div>
      </Section>

      {/* List */}
      <Section title="List">
        <div style={{ ...card(false), padding: 8 }}>
          {["Overview", "Tokens", "Components"].map((item, i) => (
            <ListRow key={item} doc={doc} label={item} index={i + 1} onSurface={onSurface} onSurfaceVar={onSurfaceVar} />
          ))}
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge style={resolveComponent(doc, doc.components["badge"])} label="Primary" />
          <Badge
            style={{
              ...resolveComponent(doc, doc.components["badge"]),
              background: color(doc, "secondary"),
              color: color(doc, "on-secondary"),
            }}
            label="Secondary"
          />
          <Badge
            style={{
              ...resolveComponent(doc, doc.components["badge"]),
              background: color(doc, "error"),
              color: color(doc, "on-error"),
            }}
            label="Error"
          />
        </div>
      </Section>
    </div>
  );
}

function ListRow({
  doc,
  label,
  index,
  onSurface,
  onSurfaceVar,
}: {
  doc: DesignDoc;
  label: string;
  index: number;
  onSurface: string;
  onSurfaceVar: string;
}) {
  const [over, setOver] = useState(false);
  const base = resolveComponent(doc, doc.components["list-item"]);
  const hover = resolveComponent(doc, doc.components["list-item-hover"]);
  return (
    <div
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        transition: "background 0.12s ease",
        ...base,
        ...(over ? hover : {}),
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 9999,
          background: color(doc, "primary"),
          color: color(doc, "on-primary"),
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {index}
      </span>
      <span style={{ flex: 1, color: onSurface, fontSize: 14 }}>{label}</span>
      <span style={{ color: onSurfaceVar, fontSize: 12 }}>›</span>
    </div>
  );
}

function Badge({ style, label }: { style: CSSProperties; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", ...style }}>{label}</span>
  );
}
