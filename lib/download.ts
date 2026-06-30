"use client";

/**
 * Trigger a browser download for an in-memory Blob. Shared by the token export
 * panel and the AI-agents template bundle so the anchor/objectURL dance lives in
 * one place.
 */
export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Convenience for downloading a text file (UTF-8). */
export function downloadText(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
): void {
  downloadBlob(filename, new Blob([content], { type: mime }));
}
