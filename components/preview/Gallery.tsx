"use client";

import { useState, type CSSProperties } from "react";
import type { DesignDoc, HighlightTarget } from "@/lib/designmd/types";
import { useEditor } from "@/lib/store";
import { color, resolveComponent, resolveTypography } from "@/lib/designmd/tokens";
import { type Decor } from "./decor";

/** Props that make a preview element select a token + show a highlight ring. */
type Marker = (target: HighlightTarget) => {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  style: CSSProperties;
};

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
  mark,
}: {
  doc: DesignDoc;
  base: string;
  hover?: string;
  extra?: CSSProperties;
  label: string;
  mark: Marker;
}) {
  const [over, setOver] = useState(false);
  const style = resolveComponent(doc, doc.components[base]);
  const hoverStyle = hover ? resolveComponent(doc, doc.components[hover]) : {};
  const m = mark({ group: "components", key: base });
  return (
    <button
      type="button"
      onClick={m.onClick}
      title={m.title}
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
        ...m.style,
      }}
    >
      {label}
    </button>
  );
}

const SWATCH_ROLES = [
  "primary",
  "secondary",
  "tertiary",
  "error",
  "surface",
  "surface-container",
  "outline",
];

export function Gallery({
  doc,
  decor,
}: {
  doc: DesignDoc;
  decor: Decor;
}) {
  const highlight = useEditor((s) => s.highlight);
  const setHighlight = useEditor((s) => s.setHighlight);

  /** Build click + ring props for a target; clicking re-selects (toggles off). */
  const mark: Marker = (target) => {
    const active =
      highlight?.group === target.group && highlight?.key === target.key;
    return {
      onClick: (e) => {
        e.stopPropagation();
        setHighlight(active ? null : target);
      },
      title: `${target.group}.${target.key}`,
      style: active
        ? { outline: "2px solid var(--color-app-accent, #4f8cff)", outlineOffset: 2 }
        : {},
    };
  };

  const card = (elevated = false): CSSProperties => ({
    ...resolveComponent(doc, doc.components[elevated ? "card-elevated" : "card"]),
    ...(elevated ? decor.surfaceElevated : decor.surface),
  });

  const onSurface = color(doc, "on-surface", "#111");
  const onSurfaceVar = color(doc, "on-surface-variant", onSurface);

  return (
    <div className="space-y-8">
      {/* Colors */}
      <Section title="Colors">
        <div className="flex flex-wrap gap-2">
          {SWATCH_ROLES.filter((r) => doc.colors[r]).map((role) => {
            const m = mark({ group: "colors", key: role });
            return (
              <button
                key={role}
                type="button"
                onClick={m.onClick}
                title={m.title}
                className="flex flex-col items-center gap-1"
                style={{ cursor: "pointer" }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: color(doc, role),
                    border: "1px solid rgba(128,128,128,0.3)",
                    ...m.style,
                  }}
                />
                <span style={{ fontSize: 9, color: onSurfaceVar }}>{role}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-2" style={{ color: onSurface }}>
          {(["display-lg", "headline-lg", "title-md", "body-md", "label-sm"] as const)
            .filter((k) => doc.typography[k])
            .map((k) => {
              const m = mark({ group: "typography", key: k });
              return (
                <div
                  key={k}
                  onClick={m.onClick}
                  title={m.title}
                  style={{
                    cursor: "pointer",
                    ...resolveTypography(doc, `{typography.${k}}`),
                    ...m.style,
                  }}
                >
                  {k === "label-sm" ? "LABEL · SMALL CAPS" : "The quick brown fox"}
                </div>
              );
            })}
          {/* Direction/flow demo strings (Arabic RTL + CJK vertical). */}
          {doc.typography["body-md"] && (
            <div
              className="pt-1 space-y-1 opacity-90"
              style={resolveTypography(doc, "{typography.body-md}")}
            >
              <div dir="rtl">العربية — مرحبا بالعالم ١٢٣</div>
              <div lang="ja">日本語 — 速い茶色のキツネ</div>
            </div>
          )}
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
            mark={mark}
          />
          <PreviewButton doc={doc} base="button-secondary" extra={decor.button} label="Secondary" mark={mark} />
          <PreviewButton doc={doc} base="button-ghost" label="Ghost" mark={mark} />
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs">
        <div className="space-y-2 max-w-sm">
          <label className="block text-xs" style={{ color: onSurfaceVar }}>
            Email address
          </label>
          {(() => {
            const m = mark({ group: "components", key: "input-field" });
            return (
              <input
                placeholder="you@example.com"
                readOnly
                onClick={m.onClick}
                title={m.title}
                style={{
                  width: "100%",
                  outline: "none",
                  cursor: "pointer",
                  ...resolveComponent(doc, doc.components["input-field"]),
                  ...decor.input,
                  ...m.style,
                }}
              />
            );
          })()}
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { key: "card", title: "Standard card", elevated: false, desc: "Surface container with token-bound padding and radius." },
            { key: "card-elevated", title: "Elevated card", elevated: true, desc: "Higher surface with the preset elevation treatment." },
          ] as const).map((c) => {
            const m = mark({ group: "components", key: c.key });
            return (
              <div
                key={c.key}
                onClick={m.onClick}
                title={m.title}
                style={{ cursor: "pointer", ...card(c.elevated), ...m.style }}
              >
                <div style={{ ...resolveTypography(doc, "{typography.title-md}"), marginBottom: 6 }}>
                  {c.title}
                </div>
                <p style={{ ...resolveTypography(doc, "{typography.body-sm}"), color: onSurfaceVar }}>
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* List */}
      <Section title="List">
        <div style={{ ...card(false), padding: 8 }}>
          {["Overview", "Tokens", "Components"].map((item, i) => (
            <ListRow
              key={item}
              doc={doc}
              label={item}
              index={i + 1}
              onSurface={onSurface}
              onSurfaceVar={onSurfaceVar}
              mark={mark}
            />
          ))}
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge
            label="Primary"
            mark={mark}
            target={{ group: "components", key: "badge" }}
            style={resolveComponent(doc, doc.components["badge"])}
          />
          <Badge
            label="Secondary"
            mark={mark}
            target={{ group: "colors", key: "secondary" }}
            style={{
              ...resolveComponent(doc, doc.components["badge"]),
              background: color(doc, "secondary"),
              color: color(doc, "on-secondary"),
            }}
          />
          <Badge
            label="Error"
            mark={mark}
            target={{ group: "colors", key: "error" }}
            style={{
              ...resolveComponent(doc, doc.components["badge"]),
              background: color(doc, "error"),
              color: color(doc, "on-error"),
            }}
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
  mark,
}: {
  doc: DesignDoc;
  label: string;
  index: number;
  onSurface: string;
  onSurfaceVar: string;
  mark: Marker;
}) {
  const [over, setOver] = useState(false);
  const base = resolveComponent(doc, doc.components["list-item"]);
  const hover = resolveComponent(doc, doc.components["list-item-hover"]);
  const m = mark({ group: "components", key: "list-item" });
  return (
    <div
      onClick={m.onClick}
      title={m.title}
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
        ...m.style,
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

function Badge({
  style,
  label,
  mark,
  target,
}: {
  style: CSSProperties;
  label: string;
  mark: Marker;
  target: HighlightTarget;
}) {
  const m = mark(target);
  return (
    <span
      onClick={m.onClick}
      title={m.title}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", ...style, ...m.style }}
    >
      {label}
    </span>
  );
}
