"use client";

import { useState } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/store";
import { saveDesign, validateDesign } from "@/lib/api";
import type { LintResult } from "@/lib/designmd/types";
import { btnGhostCls, btnPrimaryCls } from "@/components/ui/styles";
import { Stepper } from "@/components/wizard/Stepper";
import { LintPanel } from "@/components/LintPanel";
import { CodeModal } from "@/components/CodeModal";
import { EditorPanel } from "./EditorPanel";
import { PreviewPane } from "@/components/preview/PreviewPane";

export function Workspace() {
  const doc = useEditor((s) => s.docs[s.theme]);
  const [busy, setBusy] = useState<"save" | "validate" | null>(null);
  const [lint, setLint] = useState<LintResult | null>(null);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setBusy("save");
    setError(null);
    try {
      const res = await saveDesign(doc);
      setLint(res.lint);
      setSavedPath(res.path);
      setContent(res.content);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const onValidate = async () => {
    setBusy("validate");
    setError(null);
    try {
      const res = await validateDesign(doc);
      setLint(res.lint);
      setContent(res.content);
      setSavedPath(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 h-14 border-b border-app-border shrink-0">
        <div className="font-bold text-app-text">
          DESIGN<span className="text-app-accent">.md</span>
          <span className="text-app-muted font-normal text-sm ml-2">editor</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Stepper current={1} />
        </div>
        <div className="flex items-center gap-2">
          <button className={btnGhostCls} onClick={onValidate} disabled={busy !== null}>
            {busy === "validate" ? "Validating…" : "Validate"}
          </button>
          <button className={btnPrimaryCls} onClick={onSave} disabled={busy !== null}>
            {busy === "save" ? "Saving…" : "Save DESIGN.md"}
          </button>
        </div>
      </header>

      {/* Body: editor | preview */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-auto scroll-thin border-r border-app-border p-4">
          <EditorPanel />
        </div>
        <div className="min-h-0 p-4">
          <PreviewPane />
        </div>
      </div>

      {/* Results footer */}
      {(lint || error) && (
        <footer className="shrink-0 border-t border-app-border px-5 py-3 max-h-64 overflow-auto scroll-thin bg-app-panel">
          {error && (
            <div className="text-xs text-app-danger mb-2">Error: {error}</div>
          )}
          {savedPath && (
            <div className="text-xs text-app-ok mb-2 flex items-center gap-2 flex-wrap">
              ✓ Saved to <code className="font-mono">{savedPath}</code>
              {content && (
                <button
                  className="text-app-accent hover:underline"
                  onClick={() => setShowCode(true)}
                >
                  View file
                </button>
              )}
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
    </div>
  );
}
