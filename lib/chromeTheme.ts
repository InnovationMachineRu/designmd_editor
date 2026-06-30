"use client";

import { useSyncExternalStore } from "react";

/**
 * Global app-chrome theme (the editor UI itself), independent of the design
 * document being previewed. Drives the `data-theme` attribute on <html>, which
 * globals.css reads to swap the `--color-app-*` tokens:
 *   - "light"  → the default Studio Daylight tokens
 *   - "dark"   → the Studio Midnight overrides
 *   - "system" → follows `prefers-color-scheme` via the CSS media query
 *
 * Persisted to localStorage and mirrored to <html> before paint by an inline
 * script in app/layout.tsx (no flash on load). This module keeps the React UI
 * (the switcher) in sync without a context provider.
 */
export type ChromeTheme = "light" | "dark" | "system";

export const CHROME_THEMES: ChromeTheme[] = ["light", "system", "dark"];

const STORAGE_KEY = "dmd-chrome-theme";

function isChromeTheme(v: unknown): v is ChromeTheme {
  return v === "light" || v === "dark" || v === "system";
}

let current: ChromeTheme = "system";
let initialized = false;
const listeners = new Set<() => void>();

function readStored(): ChromeTheme {
  try {
    return isChromeTheme(localStorage.getItem(STORAGE_KEY))
      ? (localStorage.getItem(STORAGE_KEY) as ChromeTheme)
      : "system";
  } catch {
    return "system";
  }
}

function applyAttribute(theme: ChromeTheme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

/** Read the persisted value once on the client and reconcile the <html> tag. */
function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  current = readStored();
  applyAttribute(current);
}

export function getChromeTheme(): ChromeTheme {
  ensureInit();
  return current;
}

export function setChromeTheme(theme: ChromeTheme) {
  current = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — still apply for this session */
  }
  applyAttribute(theme);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  ensureInit();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Reactively read + set the chrome theme. SSR/first-paint snapshot is "system";
 * useSyncExternalStore reconciles to the stored value on mount without a
 * hydration warning.
 */
export function useChromeTheme(): readonly [ChromeTheme, (t: ChromeTheme) => void] {
  const theme = useSyncExternalStore(
    subscribe,
    getChromeTheme,
    () => "system" as ChromeTheme
  );
  return [theme, setChromeTheme] as const;
}
