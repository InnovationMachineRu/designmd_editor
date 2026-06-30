"use client";

import { useState } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/store";
import { validateDesign } from "@/lib/api";
import type { LintResult } from "@/lib/designmd/types";
import { btnGhostCls, btnPrimaryCls } from "@/components/ui/styles";
import { Stepper } from "@/components/wizard/Stepper";
import { ChromeThemeSwitcher } from "@/components/ui/ChromeThemeSwitcher";
import { LintPanel } from "@/components/LintPanel";
import { CodeModal } from "@/components/CodeModal";
import { ImportDialog } from "@/components/ImportDialog";
import { EditorPanel } from "./EditorPanel";
import { PreviewPane } from "@/components/preview/PreviewPane";

export function Workspace() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const settingsCollapsed = useEditor((s) => s.settingsCollapsed);
  const fullscreen = useEditor((s) => s.previewFullscreen);
  const [busy, setBusy] = useState<"validate" | null>(null);
  const [lint, setLint] = useState<LintResult | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onValidate = async () => {
    setBusy("validate");
    setError(null);
    try {
      const res = await validateDesign(doc);
      setLint(res.lint);
      setContent(res.content);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 h-16 border-b border-app-border shrink-0">
        <div className="font-display font-semibold text-[15px] tracking-tight text-app-text shrink-0">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-sans font-normal text-xs ml-2 align-middle">
            token editor
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={2} />
        </div>
        <ChromeThemeSwitcher />
        <div className="flex items-center gap-2 shrink-0">
          <button className={btnGhostCls} onClick={() => setShowImport(true)} disabled={busy !== null}>
            Import
          </button>
          <button className={btnPrimaryCls} onClick={onValidate} disabled={busy !== null}>
            {busy === "validate" ? "Validating…" : "Validate"}
          </button>
          <Link href="/uikit" className="text-sm text-app-accent hover:underline font-medium ml-1">
            Next: UIKit →
          </Link>
        </div>
      </header>

      {/* Body: editor | preview (editor hidden when collapsed). Hidden while
          fullscreen so only the overlay's PreviewPane mounts. */}
      {!fullscreen && (
        <div
          className={`flex-1 min-h-0 grid grid-cols-1 ${
            settingsCollapsed ? "" : "lg:grid-cols-2"
          }`}
        >
          {!settingsCollapsed && (
            <div className="min-h-0 overflow-auto scroll-thin border-r border-app-border p-4">
              <EditorPanel />
            </div>
          )}
          <div className="min-h-0 p-4">
            <PreviewPane />
          </div>
        </div>
      )}

      {/* Fullscreen preview overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-40 bg-app-bg p-4">
          <PreviewPane />
        </div>
      )}

      {/* Results footer */}
      {(lint || error) && (
        <footer className="shrink-0 border-t border-app-border px-5 py-3 max-h-64 overflow-auto scroll-thin bg-app-panel">
          {error && (
            <div className="text-xs text-app-danger mb-2">Error: {error}</div>
          )}
          {content && (
            <div className="text-xs text-app-muted mb-2 flex items-center gap-2 flex-wrap">
              <button
                className="text-app-accent hover:underline"
                onClick={() => setShowCode(true)}
              >
                View DESIGN.md
              </button>
              <Link href="/uikit" className="text-app-accent hover:underline ml-auto font-medium">
                Next: choose UIKit components →
              </Link>
            </div>
          )}
          {lint && <LintPanel lint={lint} />}
        </footer>
      )}

      {showCode && content && (
        <CodeModal
          title="DESIGN.md"
          filename="DESIGN.md"
          content={content}
          onClose={() => setShowCode(false)}
        />
      )}

      {showImport && <ImportDialog onClose={() => setShowImport(false)} />}
    </div>
  );
}
