"use client";

import type { DesignDoc, LintResult } from "./designmd/types";

export interface SaveResponse {
  path: string;
  content: string;
  lint: LintResult;
}

export async function saveDesign(doc: DesignDoc): Promise<SaveResponse> {
  const res = await fetch("/api/design/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  return res.json();
}

export async function validateDesign(
  doc: DesignDoc
): Promise<{ content: string; lint: LintResult }> {
  const res = await fetch("/api/design/lint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Validation failed");
  return res.json();
}

export interface UikitSpecResponse {
  path: string;
  content: string;
}

export async function generateUikitSpec(payload: {
  doc: DesignDoc;
  tech: string;
  components: string[];
  layouts?: string[];
}): Promise<UikitSpecResponse> {
  const res = await fetch("/api/uikit/spec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Generation failed");
  return res.json();
}
