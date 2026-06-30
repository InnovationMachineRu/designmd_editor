"use client";

import type { CSSProperties, ReactNode } from "react";
import { color, resolveComponent, resolveTypography } from "@/lib/designmd/tokens";
import type { DesignDoc } from "@/lib/designmd/types";
import type { Marker } from "../inspect";
import type { Decor } from "../decor";
import { LiveButton } from "./Buttons";
import {
  Icon as BaseIcon,
  IconHome,
  IconSearch,
  IconUser,
  IconMoon,
  IconSun,
  IconTag,
  IconTrash,
  IconPencil,
} from "@/components/icons";
import {
  Block,
  SectionHeader,
  darkSurface,
  hairline,
  type SectionProps,
} from "./common";

/**
 * A single tint-ramp step: mix the role color toward black (dark steps) or
 * white (light steps) by a percentage, sweeping dark → light like the spec.
 */
function rampStep(hex: string, t: number): string {
  // t in [0,1] across the strip. <0.5 → toward black, ≥0.5 → toward white.
  if (t < 0.5) {
    const pct = Math.round(40 + t * 120); // 40%..~100% of the color over black
    return `color-mix(in srgb, ${hex} ${pct}%, #000)`;
  }
  const pct = Math.round((1 - t) * 200); // ~100%..0% of the color over white
  return `color-mix(in srgb, ${hex} ${pct}%, #fff)`;
}

const RAMP = Array.from({ length: 11 }, (_, i) => i / 10);

/** Featured color tiles — friendly labels mapped to real DESIGN.md roles. */
const TILES: { label: string; role: string }[] = [
  { label: "Primary", role: "primary" },
  { label: "Text Secondary", role: "on-surface-variant" },
  { label: "Neutral", role: "outline" },
  { label: "Accent", role: "tertiary" },
];

function ColorTile({
  doc,
  label,
  role,
  mark,
}: {
  doc: DesignDoc;
  label: string;
  role: string;
  mark: Marker;
}) {
  const value = color(doc, role);
  const m = mark({ group: "colors", key: role });
  return (
    <div
      {...m}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ ...hairline(), ...m.style }}
    >
      <div
        className="flex-1 min-h-[64px] flex items-start justify-between gap-2 px-4 pt-3 pb-2"
        style={{ background: value }}
      >
        <span
          className="text-sm font-bold"
          style={{ color: color(doc, "on-primary", "#fff") }}
        >
          {label}
        </span>
        <span
          className="text-[11px] font-mono uppercase opacity-90"
          style={{ color: color(doc, "on-primary", "#fff") }}
        >
          {value}
        </span>
      </div>
      <div className="flex h-3 w-full">
        {RAMP.map((t) => (
          <span key={t} className="flex-1" style={{ background: rampStep(value, t) }} />
        ))}
      </div>
    </div>
  );
}

/** Small card shell matching the spec's tile rhythm (token-driven surface). */
function Tile({
  doc,
  decor,
  mark,
  caption,
  children,
  className = "",
}: {
  doc: DesignDoc;
  decor: Decor;
  mark: Marker;
  caption?: string;
  children: ReactNode;
  className?: string;
}) {
  const m = mark({ group: "components", key: "card" });
  return (
    <div
      {...m}
      className={`rounded-2xl p-5 flex flex-col ${className}`}
      style={{
        ...resolveComponent(doc, doc.components["card"]),
        ...decor.surface,
        ...hairline(),
        ...m.style,
      }}
    >
      {caption && (
        <span
          className="text-[12px] mb-3 opacity-60"
          style={{ color: color(doc, "on-surface-variant", color(doc, "on-surface")) }}
        >
          {caption}
        </span>
      )}
      {children}
    </div>
  );
}

export function SnapshotSection({ doc, decor, mark }: SectionProps) {
  const dark = darkSurface(doc);
  const tiles = TILES.filter((t) => doc.colors[t.role]);

  // Adopt the Brandbook's icon style (stroke width, round/sharp corners).
  const iconCfg = doc.brandbook?.icons;
  const Icon = ({ path, size = 18 }: { path: ReactNode; size?: number }) => (
    <BaseIcon
      path={path}
      size={size}
      strokeWidth={iconCfg?.strokeWidth ?? 1.8}
      corner={iconCfg?.corner ?? "round"}
    />
  );

  const typeSpecs: { caption: string; key: string }[] = [
    { caption: "Headline", key: "headline-lg" },
    { caption: "Body", key: "body-lg" },
    { caption: "Label", key: "label-md" },
  ];

  const fieldStyle: CSSProperties = {
    ...resolveComponent(doc, doc.components["input-field"]),
    ...decor.input,
  };
  const inputMark = mark({ group: "components", key: "input-field" });

  const outlinedBase = resolveComponent(doc, doc.components["button-primary"]);
  const onSurfaceVar = color(doc, "on-surface-variant", color(doc, "on-surface"));

  return (
    <Block>
      <SectionHeader index="00" kicker="Snapshot" title="Design system at a glance" />

      <div className="grid grid-cols-1 @xl:grid-cols-12 gap-4">
        {/* Color tiles column */}
        <div className="@xl:col-span-4 grid grid-cols-2 @xl:grid-cols-1 gap-4">
          {tiles.map((t) => (
            <ColorTile key={t.role} doc={doc} label={t.label} role={t.role} mark={mark} />
          ))}
        </div>

        {/* Cards area */}
        <div className="@xl:col-span-8 grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-4">
          {/* Headline / Body / Label specimens */}
          {typeSpecs
            .filter((s) => doc.typography[s.key])
            .map((s) => (
              <Tile key={s.key} doc={doc} decor={decor} mark={mark} caption={s.caption}>
                <div
                  {...mark({ group: "typography", key: s.key })}
                  className="mt-auto leading-none"
                  style={{
                    ...resolveTypography(doc, `{typography.${s.key}}`),
                    ...mark({ group: "typography", key: s.key }).style,
                  }}
                >
                  Aa
                </div>
              </Tile>
            ))}

          {/* Buttons */}
          <Tile doc={doc} decor={decor} mark={mark} className="@md:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              <LiveButton
                doc={doc}
                base="button-primary"
                hover="button-primary-hover"
                label="Primary"
                decorExtra={decor.button}
                mark={mark}
              />
              <LiveButton
                doc={doc}
                base="button-secondary"
                label="Secondary"
                decorExtra={decor.button}
                mark={mark}
              />
              {/* Inverted — dark surface with contrasting text */}
              <button
                type="button"
                {...mark({ group: "components", key: "button-primary" })}
                className="inline-flex items-center justify-center font-semibold"
                style={{
                  ...outlinedBase,
                  background: dark.bg,
                  color: dark.fg,
                  ...mark({ group: "components", key: "button-primary" }).style,
                }}
              >
                Inverted
              </button>
              {/* Outlined — transparent with primary border + text */}
              <button
                type="button"
                {...mark({ group: "components", key: "button-plain" })}
                className="inline-flex items-center justify-center font-semibold"
                style={{
                  ...outlinedBase,
                  background: "transparent",
                  color: color(doc, "primary"),
                  border: `1px solid ${color(doc, "primary")}`,
                  ...mark({ group: "components", key: "button-plain" }).style,
                }}
              >
                Outlined
              </button>
            </div>
          </Tile>

          {/* Search field */}
          <Tile doc={doc} decor={decor} mark={mark}>
            <div
              {...inputMark}
              className="mt-auto flex items-center gap-2"
              style={{ ...fieldStyle, ...inputMark.style, color: onSurfaceVar }}
            >
              <Icon path={IconSearch} size={16} />
              <span className="opacity-70">Search</span>
            </div>
          </Tile>

          {/* Body lines */}
          <Tile doc={doc} decor={decor} mark={mark}>
            <div className="mt-auto space-y-2.5">
              {[1, 0.85, 0.7, 0.5, 0.35].map((o, i) => (
                <span
                  key={i}
                  className="block h-1 rounded-full"
                  style={{
                    background: color(doc, "primary"),
                    opacity: o,
                    width: `${100 - i * 8}%`,
                  }}
                />
              ))}
            </div>
          </Tile>

          {/* Nav icons */}
          <Tile doc={doc} decor={decor} mark={mark}>
            <div className="mt-auto flex items-center gap-3">
              {[IconHome, IconSearch, IconUser].map((p, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
                  style={
                    i === 0
                      ? { background: color(doc, "primary"), color: color(doc, "on-primary", "#fff") }
                      : {
                          background: color(
                            doc,
                            "secondary-container",
                            color(doc, "surface-container-high")
                          ),
                          color: color(
                            doc,
                            "on-secondary-container",
                            color(doc, "on-surface")
                          ),
                        }
                  }
                >
                  <Icon path={p} />
                </span>
              ))}
            </div>
          </Tile>

          {/* Label pill buttons */}
          <Tile doc={doc} decor={decor} mark={mark}>
            <div className="mt-auto flex items-center gap-3">
              <button
                type="button"
                {...mark({ group: "components", key: "button-primary" })}
                className="inline-flex items-center justify-center w-9 h-9"
                style={{
                  ...outlinedBase,
                  padding: 0,
                  ...mark({ group: "components", key: "button-primary" }).style,
                }}
              >
                <Icon path={IconPencil} size={16} />
              </button>
              <button
                type="button"
                {...mark({ group: "components", key: "button-primary" })}
                className="inline-flex items-center justify-center gap-2 font-semibold"
                style={{
                  ...outlinedBase,
                  ...mark({ group: "components", key: "button-primary" }).style,
                }}
              >
                <Icon path={IconPencil} size={16} />
                Label
              </button>
            </div>
          </Tile>

          {/* Icon button row */}
          <Tile doc={doc} decor={decor} mark={mark}>
            <div className="mt-auto flex items-center gap-3">
              {[
                { icon: IconMoon, role: "primary" },
                { icon: IconSun, role: "primary" },
                { icon: IconTag, role: "primary" },
                { icon: IconTrash, role: "error" },
              ].map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{
                    background: color(doc, b.role, color(doc, "primary")),
                    color: color(
                      doc,
                      b.role === "error" ? "on-error" : "on-primary",
                      "#fff"
                    ),
                  }}
                >
                  <Icon path={b.icon} size={16} />
                </span>
              ))}
            </div>
          </Tile>
        </div>
      </div>
    </Block>
  );
}
