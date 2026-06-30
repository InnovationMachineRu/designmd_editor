"use client";

import { useState } from "react";

/** Simple modal showing generated file content with a copy button. */
export function CodeModal({
  title,
  content,
  filename,
  onClose,
}: {
  title: string;
  content: string;
  filename: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-app-panel border border-app-border rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-app-border">
          <span className="text-sm font-semibold text-app-text flex-1">{title}</span>
          <button onClick={copy} className="text-xs text-app-accent hover:underline">
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button onClick={download} className="text-xs text-app-accent hover:underline">
            Download
          </button>
          <button onClick={onClose} className="text-app-muted hover:text-app-text">
            ✕
          </button>
        </div>
        <pre className="flex-1 overflow-auto scroll-thin p-4 text-xs font-mono text-app-text whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
}
