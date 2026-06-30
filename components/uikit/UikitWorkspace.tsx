"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/store";
import {
  CATALOG,
  DEFAULT_SELECTION,
  TARGET_TECHS,
  ALL_COMPONENTS,
} from "@/lib/uikit/catalog";
import { generateUikitSpec } from "@/lib/api";
import { btnGhostCls, btnPrimaryCls } from "@/components/ui/styles";
import { Stepper } from "@/components/wizard/Stepper";
import { CodeModal } from "@/components/CodeModal";

export function UikitWorkspace() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const selected = useEditor((s) => s.selectedComponents);
  const toggle = useEditor((s) => s.toggleComponent);
  const setSelected = useEditor((s) => s.setSelectedComponents);
  const tech = useEditor((s) => s.targetTech);
  const setTech = useEditor((s) => s.setTargetTech);

  const [busy, setBusy] = useState(false);
  const [spec, setSpec] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Seed a sensible default selection on first visit.
  useEffect(() => {
    if (selected.length === 0) setSelected(DEFAULT_SELECTION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedSet = new Set(selected);

  const onGenerate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await generateUikitSpec({ doc, tech, components: selected });
      setSpec(res.content);
      setPath(res.path);
      setShow(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-4 px-5 h-14 border-b border-app-border shrink-0">
        <div className="font-bold text-app-text">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-normal text-sm ml-2">UIKit</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={3} />
        </div>
        <Link href="/" className="text-sm text-app-muted hover:text-app-text">
          ← Back to editor
        </Link>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Catalog */}
        <div className="overflow-auto scroll-thin p-5 space-y-6 border-r border-app-border">
          <div>
            <h1 className="text-lg font-semibold text-app-text">Choose UIKit components</h1>
            <p className="text-sm text-app-muted mt-1">
              Pick the components your kit needs. Selection plus the{" "}
              <code className="font-mono">{doc.name}</code> tokens become the technical spec.
            </p>
          </div>

          {CATALOG.map((cat) => (
            <section key={cat.id}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-app-text">{cat.label}</h2>
                <span className="text-xs text-app-muted">
                  {cat.components.filter((c) => selectedSet.has(c.id)).length}/
                  {cat.components.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {cat.components.map((comp) => {
                  const on = selectedSet.has(comp.id);
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => toggle(comp.id)}
                      className={`text-left rounded-lg border p-3 transition-colors ${
                        on
                          ? "border-app-accent bg-app-accent/10"
                          : "border-app-border hover:border-app-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                            on
                              ? "bg-app-accent border-app-accent text-white"
                              : "border-app-border"
                          }`}
                        >
                          {on ? "✓" : ""}
                        </span>
                        <span className="text-sm font-medium text-app-text">{comp.name}</span>
                      </div>
                      <p className="text-xs text-app-muted mt-1 line-clamp-2">
                        {comp.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Config rail */}
        <aside className="p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-app-text mb-2">Target technology</h3>
            <div className="space-y-2">
              {TARGET_TECHS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTech(t.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    tech === t.id
                      ? "border-app-accent bg-app-accent/10"
                      : "border-app-border hover:border-app-accent/50"
                  }`}
                >
                  <div className="text-sm font-medium text-app-text">{t.label}</div>
                  <div className="text-xs text-app-muted mt-0.5">{t.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-app-border p-3 text-xs text-app-muted space-y-1">
            <div className="flex justify-between">
              <span>Selected components</span>
              <span className="text-app-text font-semibold">
                {selected.length}/{ALL_COMPONENTS.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Design system</span>
              <span className="text-app-text font-semibold">{doc.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className={btnPrimaryCls}
              onClick={onGenerate}
              disabled={busy || selected.length === 0}
            >
              {busy ? "Generating…" : "Generate UIKit spec (ТЗ)"}
            </button>
            {spec && (
              <button className={btnGhostCls} onClick={() => setShow(true)}>
                View last spec
              </button>
            )}
            <button
              className={btnGhostCls}
              onClick={() => setSelected(DEFAULT_SELECTION)}
            >
              Reset to defaults
            </button>
          </div>

          {path && (
            <div className="text-xs text-app-ok">
              ✓ Written to <code className="font-mono">{path}</code>
            </div>
          )}
          {error && <div className="text-xs text-app-danger">Error: {error}</div>}
        </aside>
      </div>

      {show && spec && (
        <CodeModal
          title="UIKIT-SPEC.md"
          filename="UIKIT-SPEC.md"
          content={spec}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
