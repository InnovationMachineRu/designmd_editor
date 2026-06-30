"use client";

import { useEffect, useState } from "react";
import { iconBtnCls, inputCls } from "@/components/ui/styles";

/**
 * Editable token-name input. Commits a rename on blur / Enter (not on every
 * keystroke) so renaming doesn't fight the controlled store.
 */
export function KeyInput({
  name,
  onRename,
}: {
  name: string;
  onRename: (to: string) => void;
}) {
  const [draft, setDraft] = useState(name);
  useEffect(() => setDraft(name), [name]);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== name) onRename(next);
    else setDraft(name);
  };

  return (
    <input
      className={`${inputCls} font-mono`}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") setDraft(name);
      }}
    />
  );
}

export function DeleteBtn({ onClick, title = "Remove" }: { onClick: () => void; title?: string }) {
  return (
    <button type="button" className={iconBtnCls} onClick={onClick} title={title} aria-label={title}>
      ✕
    </button>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 text-xs font-medium text-app-accent hover:underline"
    >
      + {label}
    </button>
  );
}
