"use client";

import { type CSSProperties } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/store";
import { CATALOG, ALL_COMPONENTS } from "@/lib/uikit/catalog";
import { docToCssVars, color } from "@/lib/designmd/tokens";
import { Stepper } from "@/components/wizard/Stepper";
import { ChromeThemeSwitcher } from "@/components/ui/ChromeThemeSwitcher";
import { ThemeToggle } from "@/components/preview/ThemeToggle";
import { COMPONENT_PREVIEWS, PreviewFallback } from "./previews";

const miniBtn =
  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border border-app-border text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors";

export function UikitWorkspace() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const selected = useEditor((s) => s.selectedComponents);
  const toggle = useEditor((s) => s.toggleComponent);
  const setSelected = useEditor((s) => s.setSelectedComponents);

  const selectedSet = new Set(selected);
  const allIds = ALL_COMPONENTS.map((c) => c.id);
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

  // Previews resolve concrete token values; the stage backdrop uses the doc's
  // surface so each component sits on the design system's real background.
  const stageVars = docToCssVars(doc) as CSSProperties;
  const stageBg = color(doc, "surface", "#ffffff");
  const stageInk = color(doc, "on-surface", "#16181d");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-4 px-5 h-16 border-b border-app-border shrink-0">
        <div className="font-display font-semibold text-[15px] tracking-tight text-app-text shrink-0">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-sans font-normal text-xs ml-2 align-middle">
            UIKit
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={3} />
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
            <h1 className="text-lg font-semibold text-app-text">UIKit components</h1>
            <p className="text-sm text-app-muted mt-1 max-w-2xl">
              Live React + TypeScript previews of every component, styled by the{" "}
              <code className="font-mono">{doc.name}</code> tokens — toggle the theme to see
              light/dark. Pick the ones your kit needs; generate the spec on the{" "}
              <Link href="/export" className="text-app-accent hover:underline">Export</Link> step.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
            <span className="text-xs text-app-muted">
              {selected.length}/{ALL_COMPONENTS.length} selected
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

        {CATALOG.map((cat) => {
          const groupIds = cat.components.map((c) => c.id);
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
                {cat.components.map((comp) => {
                  const on = selectedSet.has(comp.id);
                  const Preview = COMPONENT_PREVIEWS[comp.id] ?? PreviewFallback;
                  return (
                    <div
                      key={comp.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      onClick={() => toggle(comp.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(comp.id);
                        }
                      }}
                      className={`rounded-xl border overflow-hidden cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-app-accent ${
                        on
                          ? "border-app-accent"
                          : "border-app-border hover:border-app-accent/50"
                      }`}
                    >
                      {/* Live preview stage (illustrative — clicks pass through to the card) */}
                      <div
                        className="flex items-center justify-center p-5 min-h-[132px] border-b border-app-border/60"
                        style={{ ...stageVars, background: stageBg, color: stageInk }}
                      >
                        <div
                          className="w-full flex items-center justify-center"
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          <Preview doc={doc} />
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
                          <span className="text-sm font-medium text-app-text">{comp.name}</span>
                        </div>
                        <p className="text-xs text-app-muted mt-1 line-clamp-2">{comp.description}</p>
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
