"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { inputCls } from "@/components/ui/styles";

export function Voice() {
  const voice = useEditor(
    (s) => s.brandbook.voice ?? { tagline: "", tone: [], dos: "", donts: "" }
  );
  const setVoice = useEditor((s) => s.setVoice);
  const [toneInput, setToneInput] = useState("");

  const addTone = () => {
    const t = toneInput.trim();
    if (t && !voice.tone.includes(t)) setVoice({ tone: [...voice.tone, t] });
    setToneInput("");
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-xs text-app-muted">Tagline</span>
        <input
          className={inputCls}
          value={voice.tagline}
          placeholder="Design once, ship everywhere."
          onChange={(e) => setVoice({ tagline: e.target.value })}
        />
      </label>

      <div>
        <span className="text-xs text-app-muted">Tone of voice</span>
        <div className="flex flex-wrap gap-1.5 my-1.5">
          {voice.tone.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-app-panel-2 border border-app-border text-app-text"
            >
              {t}
              <button
                type="button"
                onClick={() => setVoice({ tone: voice.tone.filter((x) => x !== t) })}
                className="text-app-muted hover:text-app-danger"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={toneInput}
            placeholder="confident, warm, precise…"
            onChange={(e) => setToneInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTone();
              }
            }}
          />
          <button
            type="button"
            onClick={addTone}
            className="px-3 rounded-md border border-app-border text-sm text-app-text hover:bg-app-panel-2"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-app-ok">Do</span>
          <textarea
            className={`${inputCls} min-h-[90px] resize-y`}
            value={voice.dos}
            placeholder="Lead with the benefit. Use plain words."
            onChange={(e) => setVoice({ dos: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-xs text-app-danger">Don&apos;t</span>
          <textarea
            className={`${inputCls} min-h-[90px] resize-y`}
            value={voice.donts}
            placeholder="Avoid jargon. Don't over-promise."
            onChange={(e) => setVoice({ donts: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}
