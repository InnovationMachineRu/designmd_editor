"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_BREAKPOINTS,
  type ComponentProp,
  type ComponentToken,
  type DecorKind,
  type DesignDoc,
  type Direction,
  type HighlightTarget,
  type StylePreset,
  type ThemeMode,
  type TypographyToken,
  type WritingMode,
} from "./designmd/types";
import { PRESETS } from "./presets";
import { blankDocs } from "./presets/blank";

/** Deep-ish clone of a DesignDoc (plain JSON structure). */
function cloneDoc(doc: DesignDoc): DesignDoc {
  return JSON.parse(JSON.stringify(doc));
}

/** Slugify a style name into an id fragment. */
function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "style";
}

/** Look up a preset (built-in or custom) by id. */
function findPreset(
  id: string,
  custom: Record<string, StylePreset>
): StylePreset | undefined {
  return (PRESETS as Record<string, StylePreset>)[id] ?? custom[id];
}

/** Resolve the active decor family for the preview from current state. */
export function resolveDecor(
  presetId: string,
  custom: Record<string, StylePreset>
): DecorKind {
  return findPreset(presetId, custom)?.decor ?? "material";
}

/** Rename a key in an ordered record while preserving insertion order. */
function renameKey<T>(
  obj: Record<string, T>,
  from: string,
  to: string
): Record<string, T> {
  if (from === to || !(from in obj) || to in obj) return obj;
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(obj)) out[k === from ? to : k] = v;
  return out;
}

export interface EditorState {
  presetId: string;
  theme: ThemeMode;
  docs: Record<ThemeMode, DesignDoc>;

  /** User-created styles, persisted to localStorage. */
  customPresets: Record<string, StylePreset>;

  /** Token selected in the live preview to highlight in the editor. */
  highlight: HighlightTarget | null;

  // UIKit step state
  selectedComponents: string[];
  targetTech: string;

  // --- selectors ---
  active: () => DesignDoc;

  // --- preset / theme ---
  applyPreset: (id: string) => void;
  setTheme: (theme: ThemeMode) => void;
  loadDoc: (doc: DesignDoc) => void;
  importDoc: (doc: DesignDoc) => void;

  // --- writing direction ---
  setDirection: (dir: Direction) => void;
  setWritingMode: (mode: WritingMode) => void;

  // --- breakpoints ---
  setBreakpoint: (name: string, value: number) => void;
  renameBreakpoint: (from: string, to: string) => void;
  addBreakpoint: (name: string, value: number) => void;
  removeBreakpoint: (name: string) => void;

  // --- preview ↔ editor linking ---
  setHighlight: (target: HighlightTarget | null) => void;

  // --- custom styles ---
  saveCurrentAsStyle: (name: string, decor: DecorKind) => void;
  addBlankStyle: (name: string, decor: DecorKind) => void;
  deleteCustomPreset: (id: string) => void;

  // --- meta ---
  setMeta: (patch: Partial<Pick<DesignDoc, "name" | "description" | "version">>) => void;

  // --- colors ---
  setColor: (name: string, value: string) => void;
  renameColor: (from: string, to: string) => void;
  addColor: (name: string, value: string) => void;
  removeColor: (name: string) => void;

  // --- typography ---
  setTypography: (name: string, patch: Partial<TypographyToken>) => void;
  renameTypography: (from: string, to: string) => void;
  addTypography: (name: string) => void;
  removeTypography: (name: string) => void;

  // --- rounded ---
  setRounded: (name: string, value: string) => void;
  renameRounded: (from: string, to: string) => void;
  addRounded: (name: string, value: string) => void;
  removeRounded: (name: string) => void;

  // --- spacing ---
  setSpacing: (name: string, value: string) => void;
  renameSpacing: (from: string, to: string) => void;
  addSpacing: (name: string, value: string) => void;
  removeSpacing: (name: string) => void;

  // --- components ---
  setComponentProp: (comp: string, prop: ComponentProp, value: string) => void;
  renameComponent: (from: string, to: string) => void;
  addComponent: (name: string) => void;
  removeComponent: (name: string) => void;

  // --- sections ---
  setSection: (name: string, text: string) => void;

  // --- uikit ---
  toggleComponent: (id: string) => void;
  setSelectedComponents: (ids: string[]) => void;
  setTargetTech: (tech: string) => void;

  // --- preview UI (ephemeral, not persisted) ---
  settingsCollapsed: boolean;
  previewFullscreen: boolean;
  /** "fit" | "mobile" | a breakpoint name → device frame width. */
  previewDevice: string;
  setSettingsCollapsed: (v: boolean) => void;
  setPreviewFullscreen: (v: boolean) => void;
  setPreviewDevice: (d: string) => void;
}

const initialDocs = {
  light: cloneDoc(PRESETS.material.docs.light),
  dark: cloneDoc(PRESETS.material.docs.dark),
};

export const useEditor = create<EditorState>()(
  persist(
    (set, get) => {
  /** Apply a mutation to the active theme's document. */
  const mutate = (fn: (doc: DesignDoc) => DesignDoc) =>
    set((s) => ({
      docs: { ...s.docs, [s.theme]: fn(cloneDoc(s.docs[s.theme])) },
    }));

  /** Breakpoints are document-wide → mutate both theme docs together. */
  const mutateBreakpoints = (
    fn: (bp: Record<string, number>) => Record<string, number>
  ) =>
    set((s) => {
      const apply = (d: DesignDoc): DesignDoc => ({
        ...d,
        breakpoints: fn(d.breakpoints ?? { ...DEFAULT_BREAKPOINTS }),
      });
      return { docs: { light: apply(s.docs.light), dark: apply(s.docs.dark) } };
    });

  /** Generate a unique custom-style id from a name. */
  const newStyleId = (name: string, custom: Record<string, StylePreset>): string => {
    const base = `custom-${slugify(name)}`;
    let id = base;
    let n = 1;
    while (id in custom || id in PRESETS) id = `${base}-${++n}`;
    return id;
  };

  return {
    presetId: "material",
    theme: "dark",
    docs: initialDocs,
    customPresets: {},
    highlight: null,
    selectedComponents: [],
    targetTech: "react",
    settingsCollapsed: false,
    previewFullscreen: false,
    previewDevice: "fit",

    active: () => get().docs[get().theme],

    applyPreset: (id) => {
      const preset = findPreset(id, get().customPresets);
      if (!preset) return;
      set({
        presetId: id,
        docs: {
          light: cloneDoc(preset.docs.light),
          dark: cloneDoc(preset.docs.dark),
        },
      });
    },

    importDoc: (incoming) =>
      set((s) => {
        // Merge: overwrite groups/values present in the imported doc, keep the rest.
        const base = cloneDoc(s.docs[s.theme]);
        const merged: DesignDoc = {
          ...base,
          ...(incoming.name ? { name: incoming.name } : {}),
          ...(incoming.description !== undefined
            ? { description: incoming.description }
            : {}),
          ...(incoming.version !== undefined ? { version: incoming.version } : {}),
          colors: { ...base.colors, ...incoming.colors },
          typography: { ...base.typography, ...incoming.typography },
          rounded: { ...base.rounded, ...incoming.rounded },
          spacing: { ...base.spacing, ...incoming.spacing },
          components: { ...base.components, ...incoming.components },
          sections: { ...base.sections, ...incoming.sections },
        };
        // direction/writingMode/breakpoints are document-wide → apply to both themes.
        const dir = incoming.direction ?? s.docs[s.theme].direction;
        const wm = incoming.writingMode ?? s.docs[s.theme].writingMode;
        const bp = incoming.breakpoints
          ? { ...(s.docs[s.theme].breakpoints ?? {}), ...incoming.breakpoints }
          : s.docs[s.theme].breakpoints;
        const other: ThemeMode = s.theme === "light" ? "dark" : "light";
        merged.direction = dir;
        merged.writingMode = wm;
        merged.breakpoints = bp;
        const otherDoc = cloneDoc(s.docs[other]);
        otherDoc.direction = dir;
        otherDoc.writingMode = wm;
        otherDoc.breakpoints = bp;
        return { docs: { [s.theme]: merged, [other]: otherDoc } as Record<ThemeMode, DesignDoc> };
      }),

    setDirection: (dir) =>
      set((s) => ({
        docs: {
          light: { ...s.docs.light, direction: dir },
          dark: { ...s.docs.dark, direction: dir },
        },
      })),

    setWritingMode: (mode) =>
      set((s) => ({
        docs: {
          light: { ...s.docs.light, writingMode: mode },
          dark: { ...s.docs.dark, writingMode: mode },
        },
      })),

    setHighlight: (target) => set({ highlight: target }),

    setBreakpoint: (name, value) =>
      mutateBreakpoints((bp) => ({ ...bp, [name]: value })),
    renameBreakpoint: (from, to) =>
      mutateBreakpoints((bp) => renameKey(bp, from, to)),
    addBreakpoint: (name, value) =>
      mutateBreakpoints((bp) => ({ ...bp, [name]: value })),
    removeBreakpoint: (name) =>
      mutateBreakpoints((bp) => {
        const next = { ...bp };
        delete next[name];
        return next;
      }),

    saveCurrentAsStyle: (name, decor) =>
      set((s) => {
        const id = newStyleId(name, s.customPresets);
        const preset: StylePreset = {
          id,
          label: name.trim() || "Custom",
          description: "Custom style",
          decor,
          builtin: false,
          docs: { light: cloneDoc(s.docs.light), dark: cloneDoc(s.docs.dark) },
        };
        return { customPresets: { ...s.customPresets, [id]: preset }, presetId: id };
      }),

    addBlankStyle: (name, decor) =>
      set((s) => {
        const id = newStyleId(name, s.customPresets);
        const docs = blankDocs(name.trim() || "Custom");
        const preset: StylePreset = {
          id,
          label: name.trim() || "Custom",
          description: "Custom style",
          decor,
          builtin: false,
          docs,
        };
        return {
          customPresets: { ...s.customPresets, [id]: preset },
          presetId: id,
          docs: { light: cloneDoc(docs.light), dark: cloneDoc(docs.dark) },
        };
      }),

    deleteCustomPreset: (id) =>
      set((s) => {
        const custom = { ...s.customPresets };
        delete custom[id];
        // If the deleted style was active, fall back to Material.
        const fallback = s.presetId === id;
        return {
          customPresets: custom,
          ...(fallback
            ? {
                presetId: "material",
                docs: {
                  light: cloneDoc(PRESETS.material.docs.light),
                  dark: cloneDoc(PRESETS.material.docs.dark),
                },
              }
            : {}),
        };
      }),

    setTheme: (theme) => set({ theme }),

    loadDoc: (doc) =>
      set((s) => ({ docs: { ...s.docs, [s.theme]: cloneDoc(doc) } })),

    setMeta: (patch) => mutate((d) => ({ ...d, ...patch })),

    setColor: (name, value) =>
      mutate((d) => ({ ...d, colors: { ...d.colors, [name]: value } })),
    renameColor: (from, to) =>
      mutate((d) => ({ ...d, colors: renameKey(d.colors, from, to) })),
    addColor: (name, value) =>
      mutate((d) => ({ ...d, colors: { ...d.colors, [name]: value } })),
    removeColor: (name) =>
      mutate((d) => {
        const colors = { ...d.colors };
        delete colors[name];
        return { ...d, colors };
      }),

    setTypography: (name, patch) =>
      mutate((d) => ({
        ...d,
        typography: {
          ...d.typography,
          [name]: { ...d.typography[name], ...patch },
        },
      })),
    renameTypography: (from, to) =>
      mutate((d) => ({ ...d, typography: renameKey(d.typography, from, to) })),
    addTypography: (name) =>
      mutate((d) => ({
        ...d,
        typography: {
          ...d.typography,
          [name]: { fontFamily: "Inter", fontSize: "16px", fontWeight: "400", lineHeight: "24px" },
        },
      })),
    removeTypography: (name) =>
      mutate((d) => {
        const typography = { ...d.typography };
        delete typography[name];
        return { ...d, typography };
      }),

    setRounded: (name, value) =>
      mutate((d) => ({ ...d, rounded: { ...d.rounded, [name]: value } })),
    renameRounded: (from, to) =>
      mutate((d) => ({ ...d, rounded: renameKey(d.rounded, from, to) })),
    addRounded: (name, value) =>
      mutate((d) => ({ ...d, rounded: { ...d.rounded, [name]: value } })),
    removeRounded: (name) =>
      mutate((d) => {
        const rounded = { ...d.rounded };
        delete rounded[name];
        return { ...d, rounded };
      }),

    setSpacing: (name, value) =>
      mutate((d) => ({ ...d, spacing: { ...d.spacing, [name]: value } })),
    renameSpacing: (from, to) =>
      mutate((d) => ({ ...d, spacing: renameKey(d.spacing, from, to) })),
    addSpacing: (name, value) =>
      mutate((d) => ({ ...d, spacing: { ...d.spacing, [name]: value } })),
    removeSpacing: (name) =>
      mutate((d) => {
        const spacing = { ...d.spacing };
        delete spacing[name];
        return { ...d, spacing };
      }),

    setComponentProp: (comp, prop, value) =>
      mutate((d) => {
        const token: ComponentToken = { ...d.components[comp] };
        if (value === "") delete token[prop];
        else token[prop] = value;
        return { ...d, components: { ...d.components, [comp]: token } };
      }),
    renameComponent: (from, to) =>
      mutate((d) => ({ ...d, components: renameKey(d.components, from, to) })),
    addComponent: (name) =>
      mutate((d) => ({
        ...d,
        components: { ...d.components, [name]: { backgroundColor: "{colors.surface-container}" } },
      })),
    removeComponent: (name) =>
      mutate((d) => {
        const components = { ...d.components };
        delete components[name];
        return { ...d, components };
      }),

    setSection: (name, text) =>
      mutate((d) => ({ ...d, sections: { ...d.sections, [name]: text } })),

    toggleComponent: (id) =>
      set((s) => ({
        selectedComponents: s.selectedComponents.includes(id)
          ? s.selectedComponents.filter((c) => c !== id)
          : [...s.selectedComponents, id],
      })),
    setSelectedComponents: (ids) => set({ selectedComponents: ids }),
    setTargetTech: (tech) => set({ targetTech: tech }),

    setSettingsCollapsed: (v) => set({ settingsCollapsed: v }),
    setPreviewFullscreen: (v) => set({ previewFullscreen: v }),
    setPreviewDevice: (d) => set({ previewDevice: d }),
  };
    },
    {
      name: "designmd-custom-styles",
      storage: createJSONStorage(() => localStorage),
      // Persist only user-created styles, not the live editing session.
      partialize: (s) => ({ customPresets: s.customPresets }),
    }
  )
);
