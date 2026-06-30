"use client";

import { type CSSProperties } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/store";
import { LAYOUT_CATALOG, ALL_LAYOUTS } from "@/lib/layouts/catalog";
import { docToCssVars, color } from "@/lib/designmd/tokens";
import { APP_VERSION } from "@/lib/version";
import { Stepper } from "@/components/wizard/Stepper";
import { ChromeThemeSwitcher } from "@/components/ui/ChromeThemeSwitcher";
import { ThemeToggle } from "@/components/preview/ThemeToggle";
import { LayoutWireframe } from "./previews";

const miniBtn =
  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border border-app-border text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors";

export function LayoutsWorkspace() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const selected = useEditor((s) => s.selectedLayouts);
  const toggle = useEditor((s) => s.toggleLayout);
  const setSelected = useEditor((s) => s.setSelectedLayouts);

  const selectedSet = new Set(selected);
  const allIds = ALL_LAYOUTS.map((l) => l.id);
  const allSelected = allIds.every((id) => selectedSet.has(id));

  const selectAll = () => setSelected(allIds);
  const deselectAll = () => setSelected([]);

  const toggleGroup = (groupIds: string[]) => {
    const allIn = groupIds.every((id) => selectedSet.has(id));
    if (allIn) {
      setSelected(selected.filter((id) => !groupIds.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...groupIds])]);
    }
  };

  // Wireframes resolve concrete token values; the stage backdrop uses the doc's
  // surface so each layout sits on the design system's real background.
  const stageVars = docToCssVars(doc) as CSSProperties;
  const stageBg = color(doc, "surface", "#ffffff");
  const stageInk = color(doc, "on-surface", "#16181d");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-4 px-5 h-16 border-b border-app-border shrink-0">
        <div className="font-display font-semibold text-[15px] tracking-tight text-app-text shrink-0">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-sans font-normal text-xs ml-2 align-middle">
            Layouts
          </span>
          <span className="text-app-muted/70 font-sans font-normal text-[10px] ml-1.5 align-middle tabular-nums">
            v{APP_VERSION}
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={4} />
        </div>
        <ChromeThemeSwitcher />
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <Link href="/export" className="text-sm font-medium text-app-accent hover:underline">
            Next: Export →
          </Link>
        </div>
      </header>

      <div className="overflow-auto scroll-thin p-5 space-y-8">
        {/* Intro */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-app-text">Layouts</h1>
            <p className="text-sm text-app-muted mt-1 max-w-2xl">
              Every page and complex-component layout your product needs — schematic previews use the{" "}
              <code className="font-mono">{doc.name}</code> tokens. Pick the ones your kit should ship;
              they&apos;re embedded in the exported DESIGN.md and the generated spec on the{" "}
              <Link href="/export" className="text-app-accent hover:underline">Export</Link> step.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
            <span className="text-xs text-app-muted">
              {selected.length}/{ALL_LAYOUTS.length} selected
            </span>
            <button
              type="button"
              className={miniBtn}
              onClick={allSelected ? deselectAll : selectAll}
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
        </div>

        {LAYOUT_CATALOG.map((cat) => {
          const groupIds = cat.layouts.map((l) => l.id);
          const groupSelected = groupIds.filter((id) => selectedSet.has(id)).length;
          const allInGroup = groupSelected === groupIds.length;

          return (
            <section key={cat.id}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-app-text">{cat.label}</h2>
                <span className="text-xs text-app-muted">
                  {groupSelected}/{groupIds.length}
                </span>
                <button type="button" className={miniBtn} onClick={() => toggleGroup(groupIds)}>
                  {allInGroup ? "Deselect group" : "Select group"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {cat.layouts.map((item) => {
                  const on = selectedSet.has(item.id);
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      onClick={() => toggle(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(item.id);
                        }
                      }}
                      className={`rounded-xl border overflow-hidden cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-app-accent ${
                        on
                          ? "border-app-accent"
                          : "border-app-border hover:border-app-accent/50"
                      }`}
                    >
                      {/* Schematic wireframe stage (illustrative — clicks pass through) */}
                      <div
                        className="p-4 min-h-[148px] flex items-center border-b border-app-border/60"
                        style={{ ...stageVars, background: stageBg, color: stageInk }}
                      >
                        <div
                          className="w-full"
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          <LayoutWireframe item={item} doc={doc} />
                        </div>
                      </div>

                      {/* Meta + selection state */}
                      <div className={`p-3 transition-colors ${on ? "bg-app-accent/10" : ""}`}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                              on
                                ? "bg-app-accent border-app-accent text-app-on-accent"
                                : "border-app-border"
                            }`}
                          >
                            {on ? "✓" : ""}
                          </span>
                          <span className="text-sm font-medium text-app-text">{item.name}</span>
                          <span className="text-[10px] uppercase tracking-wide text-app-muted border border-app-border rounded px-1 py-px ml-auto">
                            {item.kind}
                          </span>
                        </div>
                        <p className="text-xs text-app-muted mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
