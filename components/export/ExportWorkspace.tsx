"use client";

import { useState } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/store";
import { serializeDesignDoc } from "@/lib/designmd/serialize";
import {
  docToCssVarsBlock,
  docToTailwindTheme,
  docToDesignTokensJson,
} from "@/lib/designmd/export";
import type { DesignDoc, LintResult } from "@/lib/designmd/types";
import { generateUikitSpec, validateDesign } from "@/lib/api";
import { ALL_COMPONENTS, TARGET_TECHS, uikitYaml } from "@/lib/uikit/catalog";
import { ALL_LAYOUTS, layoutsYaml } from "@/lib/layouts/catalog";
import { APP_VERSION } from "@/lib/version";
import { Stepper } from "@/components/wizard/Stepper";
import { ChromeThemeSwitcher } from "@/components/ui/ChromeThemeSwitcher";
import { CodePanel } from "@/components/preview/CodePanel";
import { CodeModal } from "@/components/CodeModal";
import { btnGhostCls, btnPrimaryCls } from "@/components/ui/styles";

type TokenFormat = "markdown" | "css" | "tailwind" | "tokens";

const FORMATS: { id: TokenFormat; label: string; filename: string }[] = [
  { id: "markdown", label: "Markdown", filename: "design.md" },
  { id: "css", label: "CSS Vars", filename: "design-tokens.css" },
  { id: "tailwind", label: "Tailwind", filename: "tailwind-tokens.css" },
  { id: "tokens", label: "Tokens JSON", filename: "design-tokens.json" },
];

function getTokenContent(format: TokenFormat, doc: DesignDoc): string {
  if (format === "markdown") return serializeDesignDoc(doc);
  if (format === "css") return docToCssVarsBlock(doc);
  if (format === "tailwind") return docToTailwindTheme(doc);
  return docToDesignTokensJson(doc);
}

const tabBtn = (active: boolean) =>
  `inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
    active
      ? "bg-app-panel-2 text-app-text border border-app-border"
      : "text-app-muted hover:text-app-text"
  }`;

export function ExportWorkspace() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const selected = useEditor((s) => s.selectedComponents);
  const selectedLayouts = useEditor((s) => s.selectedLayouts);
  const tech = useEditor((s) => s.targetTech);
  const setTech = useEditor((s) => s.setTargetTech);

  const [format, setFormat] = useState<TokenFormat>("css");
  const [busy, setBusy] = useState(false);
  const [spec, setSpec] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lint, setLint] = useState<LintResult | null>(null);

  const activeFormat = FORMATS.find((f) => f.id === format)!;
  // Stamp the chosen UIKit components & layouts into the YAML for the exported
  // DESIGN.md (Markdown format). Token-only formats ignore these extra keys.
  const docForExport: DesignDoc = {
    ...doc,
    uikit: uikitYaml(selected, tech),
    layouts: layoutsYaml(selectedLayouts),
  };
  const tokenContent = getTokenContent(format, docForExport);

  // Validate the design system first, then generate. Errors block generation so
  // the produced UIKIT-SPEC.md is always a valid DESIGN.md.
  const onGenerate = async () => {
    setBusy(true);
    setError(null);
    setLint(null);
    try {
      const { lint: result } = await validateDesign(doc);
      setLint(result);
      if (result.summary.errors > 0) {
        setError(
          `Design has ${result.summary.errors} validation error(s). Fix them in the Design system step before generating.`
        );
        return;
      }
      const res = await generateUikitSpec({
        doc,
        tech,
        components: selected,
        layouts: selectedLayouts,
      });
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
      <header className="flex items-center gap-4 px-5 h-16 border-b border-app-border shrink-0">
        <div className="font-display font-semibold text-[15px] tracking-tight text-app-text shrink-0">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-sans font-normal text-xs ml-2 align-middle">
            Export
          </span>
          <span className="text-app-muted/70 font-sans font-normal text-[10px] ml-1.5 align-middle tabular-nums">
            v{APP_VERSION}
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={5} />
        </div>
        <ChromeThemeSwitcher />
        <Link href="/layouts" className="text-sm text-app-muted hover:text-app-text">
          ← Back to Layouts
        </Link>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        {/* Design-token exports */}
        <div className="flex flex-col min-h-0 p-5 border-r border-app-border">
          <div className="mb-3">
            <h1 className="text-lg font-semibold text-app-text">Design tokens</h1>
            <p className="text-sm text-app-muted mt-1">
              Download <code className="font-mono">{doc.name}</code> as Markdown, CSS variables,
              a Tailwind theme, or W3C design tokens.
            </p>
          </div>
          <div className="flex items-center gap-0.5 bg-app-panel rounded-lg border border-app-border p-0.5 mb-3 self-start">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={tabBtn(format === f.id)}
                onClick={() => setFormat(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            <CodePanel content={tokenContent} filename={activeFormat.filename} />
          </div>
        </div>

        {/* UIKit spec */}
        <aside className="p-5 space-y-5 overflow-auto scroll-thin">
          <div>
            <h2 className="text-sm font-semibold text-app-text mb-1">UIKit &amp; Layouts spec (ТЗ)</h2>
            <p className="text-xs text-app-muted mb-3">
              Generate the technical spec for the components and layouts you picked, plus
              media-query rules — targeting your stack.
            </p>
            <h3 className="text-xs font-semibold text-app-text mb-2">Target technology</h3>
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
              <span>Selected layouts</span>
              <span className="text-app-text font-semibold">
                {selectedLayouts.length}/{ALL_LAYOUTS.length}
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
              {busy ? "Validating…" : "Validate & generate UIKit spec (ТЗ)"}
            </button>
            {spec && (
              <button className={btnGhostCls} onClick={() => setShow(true)}>
                View last spec
              </button>
            )}
            {selected.length === 0 && (
              <p className="text-xs text-app-muted">
                Pick components on the{" "}
                <Link href="/uikit" className="text-app-accent hover:underline">
                  UIKit step
                </Link>{" "}
                first.
              </p>
            )}
          </div>

          {path && (
            <div className="text-xs text-app-ok">
              ✓ Written to <code className="font-mono">{path}</code>
            </div>
          )}
          {error && <div className="text-xs text-app-danger">Error: {error}</div>}

          {lint && lint.findings.length > 0 && (
            <div className="rounded-lg border border-app-border p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-app-text">Validation</span>
                <span className="text-app-muted">
                  {lint.summary.errors} err · {lint.summary.warnings} warn
                </span>
              </div>
              <ul className="space-y-1 max-h-40 overflow-auto scroll-thin">
                {lint.findings.map((f, i) => (
                  <li
                    key={i}
                    className={`text-xs ${
                      f.severity === "error"
                        ? "text-app-danger"
                        : f.severity === "warning"
                          ? "text-app-text"
                          : "text-app-muted"
                    }`}
                  >
                    <span className="uppercase text-[10px] font-semibold mr-1">{f.severity}</span>
                    {f.path && <code className="font-mono text-[10px] mr-1">{f.path}</code>}
                    {f.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {lint && lint.findings.length === 0 && (
            <div className="text-xs text-app-ok">✓ Design validated — no issues.</div>
          )}
        </aside>
      </div>

      {show && spec && (
        <CodeModal
          title="UIKIT-SPEC.md"
          filename="UIKIT-SPEC.md"
          secondaryFilename="DESIGN.md"
          content={spec}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
