"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_BREAKPOINTS,
  type BrandbookData,
  type BrandLogo,
  type ComponentProp,
  type ComponentToken,
  type DecorKind,
  type DesignDoc,
  type Direction,
  type HighlightTarget,
  type SchemeName,
  type StylePreset,
  type ThemeMode,
  type TypographyToken,
  type WritingMode,
} from "./designmd/types";
import { harmony, onColorFor, shade } from "./designmd/color";
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

/** Default values for the extended brand sections. */
function defaultBrandSections(): Pick<
  BrandbookData,
  "icons" | "gradients" | "shape" | "imagery" | "motion" | "voice" | "spacing"
> {
  return {
    icons: { strokeWidth: 1.8, size: 24, corner: "round", custom: [] },
    gradients: { angle: 135 },
    shape: { roundness: 1, elevation: 2 },
    imagery: { radius: 12, overlay: 0, duotone: false, images: [] },
    motion: { duration: 200, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    voice: { tagline: "", tone: [], dos: "", donts: "" },
    spacing: { density: "comfortable" },
  };
}

/** Derive a Brandbook snapshot from a document's current tokens. */
function brandbookFromDoc(doc: DesignDoc): BrandbookData {
  if (doc.brandbook) return { ...defaultBrandSections(), ...doc.brandbook };
  const schemeColors = ["primary", "secondary", "tertiary", "accent"]
    .map((r) => doc.colors[r])
    .filter(Boolean) as string[];
  return {
    baseColor: doc.colors.primary ?? "#6750A4",
    scheme: "triadic",
    schemeColors: schemeColors.length ? schemeColors : ["#6750A4"],
    fonts: {
      heading: doc.typography["headline-lg"]?.fontFamily ?? "Inter",
      body: doc.typography["body-md"]?.fontFamily ?? "Inter",
    },
    logos: [],
    ...defaultBrandSections(),
  };
}

/** Apply a roundness factor to the `rounded` token scale (keeps `full`). */
function applyRoundness(doc: DesignDoc, factor: number): DesignDoc {
  const BASE: Record<string, number> = { sm: 4, DEFAULT: 6, md: 8, lg: 12, xl: 16, "2xl": 24 };
  const rounded = { ...doc.rounded };
  for (const key of Object.keys(rounded)) {
    if (key === "full" || /9999|50%/.test(String(rounded[key]))) continue;
    const base = BASE[key];
    if (base !== undefined) rounded[key] = `${Math.round(base * factor)}px`;
  }
  return { ...doc, rounded };
}

/** Apply a base spacing unit to the `spacing` token scale. */
function applySpacing(doc: DesignDoc, unit: number): DesignDoc {
  const MULT: Record<string, number> = {
    unit: 1,
    "control-padding": 1.5,
    "card-gap": 2,
    "container-padding": 3,
    "section-margin": 5,
  };
  const spacing = { ...doc.spacing };
  for (const key of Object.keys(spacing)) {
    const m = MULT[key];
    if (m !== undefined) spacing[key] = `${Math.round(unit * m)}px`;
  }
  return { ...doc, spacing };
}

/** True for heading-tier typography tokens (vs. body/label). */
function isHeadingToken(key: string): boolean {
  return /^(display|headline|title)/.test(key);
}

/**
 * Project a Brandbook onto a document's tokens: brand colors → role colors
 * (with computed on-colors), fonts → typography families. Always stamps the
 * brandbook onto the doc so it serializes into DESIGN.md.
 */
function applyBrandToDoc(doc: DesignDoc, bb: BrandbookData): DesignDoc {
  const colors = { ...doc.colors };
  const [c0, c1, c2, c3] = bb.schemeColors;
  if (c0) {
    colors.primary = c0;
    colors["on-primary"] = onColorFor(c0);
    colors["primary-hover"] = shade(c0, 0.12);
  }
  if (c1) {
    colors.secondary = c1;
    colors["on-secondary"] = onColorFor(c1);
  }
  if (c2) {
    colors.tertiary = c2;
    colors["on-tertiary"] = onColorFor(c2);
  }
  const accent = c3 ?? c2 ?? c1;
  if (accent) {
    colors.accent = accent;
    colors["on-accent"] = onColorFor(accent);
  }

  const typography = Object.fromEntries(
    Object.entries(doc.typography).map(([k, t]) => [
      k,
      { ...t, fontFamily: isHeadingToken(k) ? bb.fonts.heading : bb.fonts.body },
    ])
  );

  return { ...doc, colors, typography, brandbook: bb };
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

  /** Brand definition (color scheme, fonts, logos) driving the tokens. */
  brandbook: BrandbookData;

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

  // --- brandbook ---
  applyBrandbook: (bb: BrandbookData) => void;
  setBrandbookBase: (hex: string) => void;
  setScheme: (scheme: SchemeName) => void;
  setBrandFont: (role: "heading" | "body" | "mono", family: string) => void;
  addLogo: (label: string, dataUrl: string) => void;
  removeLogo: (id: string) => void;

  // --- brandbook: extended sections ---
  patchBrandbook: (patch: Partial<BrandbookData>) => void;
  addAsset: (kind: "logo" | "icon" | "image", label: string, dataUrl: string) => void;
  removeAsset: (kind: "logo" | "icon" | "image", id: string) => void;
  setIconStyle: (patch: Partial<NonNullable<BrandbookData["icons"]>>) => void;
  setGradientAngle: (angle: number) => void;
  setRoundness: (factor: number) => void;
  setElevation: (level: number) => void;
  setImagery: (patch: Partial<NonNullable<BrandbookData["imagery"]>>) => void;
  setMotion: (patch: Partial<NonNullable<BrandbookData["motion"]>>) => void;
  setVoice: (patch: Partial<NonNullable<BrandbookData["voice"]>>) => void;
  setDensity: (density: "compact" | "comfortable" | "spacious") => void;

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

const initialBrandbook = brandbookFromDoc(initialDocs.light);

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
    brandbook: initialBrandbook,
    selectedComponents: [],
    targetTech: "react",
    settingsCollapsed: false,
    previewFullscreen: false,
    previewDevice: "fit",

    active: () => get().docs[get().theme],

    applyPreset: (id) => {
      const preset = findPreset(id, get().customPresets);
      if (!preset) return;
      const light = cloneDoc(preset.docs.light);
      const dark = cloneDoc(preset.docs.dark);
      // Reset the brandbook to reflect the new preset's palette/fonts.
      const bb = brandbookFromDoc(light);
      set({
        presetId: id,
        brandbook: bb,
        docs: {
          light: { ...light, brandbook: bb },
          dark: { ...dark, brandbook: bb },
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
        // Brandbook is document-wide → carry the imported one (or keep current).
        const bb = incoming.brandbook ?? s.brandbook;
        merged.direction = dir;
        merged.writingMode = wm;
        merged.breakpoints = bp;
        merged.brandbook = bb;
        const otherDoc = cloneDoc(s.docs[other]);
        otherDoc.direction = dir;
        otherDoc.writingMode = wm;
        otherDoc.breakpoints = bp;
        otherDoc.brandbook = bb;
        return {
          brandbook: bb,
          docs: { [s.theme]: merged, [other]: otherDoc } as Record<ThemeMode, DesignDoc>,
        };
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

    // --- brandbook ---
    applyBrandbook: (bb) =>
      set((s) => ({
        brandbook: bb,
        docs: {
          light: applyBrandToDoc(s.docs.light, bb),
          dark: applyBrandToDoc(s.docs.dark, bb),
        },
      })),

    setBrandbookBase: (hex) => {
      const prev = get().brandbook;
      get().applyBrandbook({
        ...prev,
        baseColor: hex,
        schemeColors: harmony(hex, prev.scheme),
      });
    },

    setScheme: (scheme) => {
      const prev = get().brandbook;
      get().applyBrandbook({
        ...prev,
        scheme,
        schemeColors: harmony(prev.baseColor, scheme),
      });
    },

    setBrandFont: (role, family) => {
      const prev = get().brandbook;
      get().applyBrandbook({
        ...prev,
        fonts: { ...prev.fonts, [role]: family },
      });
    },

    // Logo changes only touch brandbook (not colors/typography), but still
    // mirror onto both docs so they serialize into DESIGN.md.
    addLogo: (label, dataUrl) =>
      set((s) => {
        const id = `${Date.now().toString(36)}${Math.round(Math.random() * 1e6).toString(36)}`;
        const logo: BrandLogo = { id, label, dataUrl };
        const bb: BrandbookData = { ...s.brandbook, logos: [...s.brandbook.logos, logo] };
        return {
          brandbook: bb,
          docs: {
            light: { ...s.docs.light, brandbook: bb },
            dark: { ...s.docs.dark, brandbook: bb },
          },
        };
      }),

    removeLogo: (id) =>
      set((s) => {
        const bb: BrandbookData = {
          ...s.brandbook,
          logos: s.brandbook.logos.filter((l) => l.id !== id),
        };
        return {
          brandbook: bb,
          docs: {
            light: { ...s.docs.light, brandbook: bb },
            dark: { ...s.docs.dark, brandbook: bb },
          },
        };
      }),

    // Merge a brandbook patch + mirror onto both docs (no color/font reapply).
    patchBrandbook: (patch) =>
      set((s) => {
        const bb: BrandbookData = { ...s.brandbook, ...patch };
        return {
          brandbook: bb,
          docs: {
            light: { ...s.docs.light, brandbook: bb },
            dark: { ...s.docs.dark, brandbook: bb },
          },
        };
      }),

    addAsset: (kind, label, dataUrl) => {
      const id = `${Date.now().toString(36)}${Math.round(Math.random() * 1e6).toString(36)}`;
      const asset: BrandLogo = { id, label, dataUrl };
      const bb = get().brandbook;
      if (kind === "logo") {
        get().patchBrandbook({ logos: [...bb.logos, asset] });
      } else if (kind === "icon") {
        const icons = bb.icons ?? { strokeWidth: 1.8, size: 24, corner: "round", custom: [] };
        get().patchBrandbook({ icons: { ...icons, custom: [...icons.custom, asset] } });
      } else {
        const imagery = bb.imagery ?? { radius: 12, overlay: 0, duotone: false, images: [] };
        get().patchBrandbook({ imagery: { ...imagery, images: [...imagery.images, asset] } });
      }
    },

    removeAsset: (kind, id) => {
      const bb = get().brandbook;
      if (kind === "logo") {
        get().patchBrandbook({ logos: bb.logos.filter((l) => l.id !== id) });
      } else if (kind === "icon" && bb.icons) {
        get().patchBrandbook({
          icons: { ...bb.icons, custom: bb.icons.custom.filter((l) => l.id !== id) },
        });
      } else if (kind === "image" && bb.imagery) {
        get().patchBrandbook({
          imagery: { ...bb.imagery, images: bb.imagery.images.filter((l) => l.id !== id) },
        });
      }
    },

    setIconStyle: (patch) => {
      const icons = get().brandbook.icons ?? {
        strokeWidth: 1.8,
        size: 24,
        corner: "round",
        custom: [],
      };
      get().patchBrandbook({ icons: { ...icons, ...patch } });
    },

    setGradientAngle: (angle) => get().patchBrandbook({ gradients: { angle } }),

    setRoundness: (factor) =>
      set((s) => {
        const shape = { ...(s.brandbook.shape ?? { roundness: 1, elevation: 2 }), roundness: factor };
        const bb: BrandbookData = { ...s.brandbook, shape };
        const apply = (d: DesignDoc) => ({ ...applyRoundness(d, factor), brandbook: bb });
        return { brandbook: bb, docs: { light: apply(s.docs.light), dark: apply(s.docs.dark) } };
      }),

    setElevation: (level) => {
      const shape = { ...(get().brandbook.shape ?? { roundness: 1, elevation: 2 }), elevation: level };
      get().patchBrandbook({ shape });
    },

    setImagery: (patch) => {
      const imagery = get().brandbook.imagery ?? {
        radius: 12,
        overlay: 0,
        duotone: false,
        images: [],
      };
      get().patchBrandbook({ imagery: { ...imagery, ...patch } });
    },

    setMotion: (patch) => {
      const motion = get().brandbook.motion ?? {
        duration: 200,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      };
      get().patchBrandbook({ motion: { ...motion, ...patch } });
    },

    setVoice: (patch) => {
      const voice = get().brandbook.voice ?? { tagline: "", tone: [], dos: "", donts: "" };
      get().patchBrandbook({ voice: { ...voice, ...patch } });
    },

    setDensity: (density) =>
      set((s) => {
        const unit = density === "compact" ? 4 : density === "spacious" ? 12 : 8;
        const bb: BrandbookData = { ...s.brandbook, spacing: { density } };
        const apply = (d: DesignDoc) => ({ ...applySpacing(d, unit), brandbook: bb });
        return { brandbook: bb, docs: { light: apply(s.docs.light), dark: apply(s.docs.dark) } };
      }),

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
      // Persist user-created styles and the brandbook (scheme, fonts, logos),
      // not the live editing session (docs come from the active preset).
      partialize: (s) => ({
        customPresets: s.customPresets,
        brandbook: s.brandbook,
      }),
      // Backfill defaults for any brand sections missing from older persisted
      // state, so selectors never have to synthesize fresh objects (which would
      // cause render loops).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<EditorState>;
        return {
          ...current,
          ...p,
          brandbook: p.brandbook
            ? { ...defaultBrandSections(), ...p.brandbook }
            : current.brandbook,
        };
      },
      // Re-project the rehydrated brandbook onto the freshly-initialized docs
      // so the design tokens match the restored brand definition.
      onRehydrateStorage: () => (state) => {
        if (state?.brandbook) state.applyBrandbook(state.brandbook);
      },
    }
  )
);
