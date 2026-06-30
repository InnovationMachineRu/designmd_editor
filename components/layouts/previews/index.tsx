"use client";

import type { CSSProperties, ReactNode } from "react";
import type { DesignDoc } from "@/lib/designmd/types";
import type { LayoutItem, LayoutPreviewHint } from "@/lib/layouts/catalog";
import {
  onSurfaceVar,
  outlineVar,
  primary,
  surfaceHigh,
  radius,
} from "@/components/uikit/previews/primitives";

/**
 * A single generic wireframe that schematically renders any layout from its
 * `preview` hint (or an inference from its regions). This keeps a large layout
 * catalog maintainable — no bespoke preview per entry — while still reflecting
 * the live design tokens (surface, outline, primary, rounding).
 */

/** Derive a preview hint when a layout doesn't declare one explicitly. */
function inferHint(item: LayoutItem): LayoutPreviewHint {
  if (item.preview) return item.preview;
  const has = (r: string) => item.regions.some((x) => x.includes(r));
  const chrome: LayoutPreviewHint["chrome"] = [];
  if (has("header") || has("nav") || has("brand")) chrome.push("header");
  if (has("sidebar")) chrome.push("sidebar");
  if (has("aside") || has("toc") || has("summary")) chrome.push("aside");
  if (has("footer")) chrome.push("footer");
  return { chrome, body: "stack" };
}

export function LayoutWireframe({
  item,
  doc,
}: {
  item: LayoutItem;
  doc: DesignDoc;
}) {
  const hint = inferHint(item);
  const chrome = hint.chrome ?? [];
  const line = outlineVar(doc);
  const fill = surfaceHigh(doc);
  const accent = primary(doc);
  const muted = onSurfaceVar(doc);
  const rad = radius(doc, "sm", "6px");

  const box = (style: CSSProperties, children?: ReactNode): ReactNode => (
    <div
      style={{
        background: fill,
        border: `1px solid ${line}`,
        borderRadius: rad,
        ...style,
      }}
    >
      {children}
    </div>
  );

  // A small fill block used inside the body patterns.
  const bar = (w: number | string, h = 6, color = muted): ReactNode => (
    <div style={{ width: w, height: h, borderRadius: 999, background: color, opacity: 0.5 }} />
  );

  const body = renderBody(hint.body, { box, bar, accent, rad, line, muted });

  const hasSidebar = chrome.includes("sidebar");
  const hasAside = chrome.includes("aside");

  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: 116,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 0,
      }}
    >
      {chrome.includes("header") &&
        box(
          {
            height: 16,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 6px",
            flexShrink: 0,
          },
          <>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />
            {bar(28)}
            <div style={{ flex: 1 }} />
            {bar(14)}
          </>
        )}

      <div style={{ flex: 1, display: "flex", gap: 4, minHeight: 0 }}>
        {hasSidebar &&
          box(
            { width: 26, display: "flex", flexDirection: "column", gap: 5, padding: 5, flexShrink: 0 },
            <>
              {bar("70%")}
              {bar("90%")}
              {bar("60%")}
              {bar("80%")}
            </>
          )}

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>{body}</div>

        {hasAside &&
          box(
            { width: 30, display: "flex", flexDirection: "column", gap: 5, padding: 5, flexShrink: 0 },
            <>
              {bar("80%")}
              {bar("60%")}
              {bar("70%")}
            </>
          )}
      </div>

      {chrome.includes("footer") &&
        box(
          { height: 12, display: "flex", alignItems: "center", gap: 5, padding: "0 6px", flexShrink: 0 },
          <>
            {bar(18)}
            {bar(18)}
            {bar(18)}
          </>
        )}
    </div>
  );
}

type BodyCtx = {
  box: (style: CSSProperties, children?: ReactNode) => ReactNode;
  bar: (w: number | string, h?: number, color?: string) => ReactNode;
  accent: string;
  rad: string;
  line: string;
  muted: string;
};

function renderBody(kind: LayoutPreviewHint["body"], ctx: BodyCtx): ReactNode {
  const { box, bar, accent, rad } = ctx;
  const full: CSSProperties = { flex: 1, minHeight: 0 };

  const tile = (extra?: CSSProperties) =>
    box({ flex: 1, minWidth: 0, minHeight: 0, ...extra });

  switch (kind) {
    case "grid":
    case "cards":
      return (
        <div style={{ ...full, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>{tile()}</div>
          ))}
        </div>
      );
    case "stats":
      return (
        <div style={{ ...full, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, height: 28 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>{tile()}</div>
            ))}
          </div>
          <div style={{ flex: 1 }}>{tile()}</div>
        </div>
      );
    case "list":
    case "feed":
      return (
        <div style={{ ...full, display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 16 }}>
              {tile({ display: "flex", alignItems: "center", gap: 5, padding: "0 5px" })}
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div style={{ ...full, display: "flex", flexDirection: "column" }}>
          {box(
            { flex: 1, padding: 5, display: "flex", flexDirection: "column", gap: 5 },
            <>
              <div style={{ display: "flex", gap: 6 }}>{bar(20, 5, accent)}{bar(28, 5, accent)}{bar(16, 5, accent)}</div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 6 }}>
                  {bar(20)}
                  {bar(28)}
                  {bar(16)}
                </div>
              ))}
            </>
          )}
        </div>
      );
    case "form":
      return (
        <div style={{ ...full, display: "flex", flexDirection: "column", gap: 6, padding: 4 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {bar(24, 4)}
              <div style={{ height: 12 }}>{box({ height: 12 })}</div>
            </div>
          ))}
          <div style={{ alignSelf: "flex-end", width: 28, height: 12, borderRadius: rad, background: accent }} />
        </div>
      );
    case "split":
    case "detail":
      return (
        <div style={{ ...full, display: "flex", gap: 4 }}>
          {tile({ display: "flex", flexDirection: "column", gap: 5, padding: 5 })}
          {box(
            { flex: 1, display: "flex", flexDirection: "column", gap: 5, padding: 5 },
            <>
              {bar("80%")}
              {bar("60%")}
              {bar("70%")}
              <div style={{ width: 22, height: 10, borderRadius: rad, background: accent, marginTop: 2 }} />
            </>
          )}
        </div>
      );
    case "kanban":
      return (
        <div style={{ ...full, display: "flex", gap: 4 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ flex: 1 }}>
              {box(
                { height: "100%", display: "flex", flexDirection: "column", gap: 4, padding: 4 },
                <>
                  {bar("60%", 4)}
                  <div style={{ height: 14 }}>{box({ height: 14 })}</div>
                  <div style={{ height: 14 }}>{box({ height: 14 })}</div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    case "hero":
      return (
        <div style={{ ...full, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {bar(70, 7)}
          {bar(50, 5)}
          <div style={{ width: 28, height: 12, borderRadius: rad, background: accent, marginTop: 2 }} />
        </div>
      );
    case "centered":
      return (
        <div style={{ ...full, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {box(
            { width: "62%", padding: 6, display: "flex", flexDirection: "column", gap: 5, alignItems: "center" },
            <>
              {bar("70%", 6)}
              {bar("50%", 4)}
              <div style={{ width: 26, height: 11, borderRadius: rad, background: accent, marginTop: 2 }} />
            </>
          )}
        </div>
      );
    case "stack":
    default:
      return (
        <div style={{ ...full, display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
          {bar("75%")}
          <div style={{ flex: 1 }}>{tile()}</div>
        </div>
      );
  }
}
