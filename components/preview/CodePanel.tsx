"use client";

import { useState } from "react";
import { downloadText } from "@/lib/download";

const actionBtn =
  "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-app-border text-xs text-app-muted hover:text-app-text hover:bg-app-panel-2 transition-colors";

export function CodePanel({ content, filename }: { content: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSave = () => downloadText(filename, content);

  return (
    <div className="flex flex-col h-full min-h-0 rounded-xl border border-app-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-app-border bg-app-panel shrink-0">
        <span className="text-xs font-mono text-app-muted">{filename}</span>
        <div className="flex gap-1.5">
          <button type="button" className={actionBtn} onClick={onCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button type="button" className={actionBtn} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto scroll-thin bg-app-bg">
        <pre className="p-4 text-[11px] font-mono text-app-text leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </pre>
      </div>
    </div>
  );
}
