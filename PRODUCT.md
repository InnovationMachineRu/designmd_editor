# Product

## Register

product

## Users

Solo developers and indie makers building side projects or small products. They open this tool when they need to produce a spec-compliant `DESIGN.md` and a UIKit component spec — fast, without ceremony. They are competent with code and comfortable in dark tooling; they want decisions to land cleanly and artifacts to export without friction. Context: often a single person, mid-project, switching between code and design concerns. They care about the output being correct, not just pretty.

## Product Purpose

An interactive editor for the [design.md](https://github.com/google-labs-code/design.md) design-system specification. Three-step workflow: (1) Brandbook — visual identity (color, type, shape, motion); (2) Token editor — DESIGN.md token blocks with live preview and style-preset switching; (3) UIKit — component catalog with technical spec (ТЗ) generation per target framework. Exports a validated `DESIGN.md` and a `UIKIT-SPEC.md` to `output/`. Success = a maker leaving with production-ready design-system artifacts that bind their brand decisions to code-ready tokens.

## Brand Personality

Craft · Depth · Warmth. An atelier aesthetic — the tool signals quality before the output does, the way a well-made instrument signals the maker's seriousness. Opinionated and specific, not broad and approachable. The brass accent and graphite chrome are studio hardware, not software chrome.

References: Pika, Pixelmator — polished indie tools that feel more designed than their category, with attention to micro-detail and no enterprise bloat.

## Anti-references

- **Generic SaaS builders** (Webflow/Framer marketing sites): over-animated, gradient-heavy, hero-metric templates — nothing borrowed from here.
- **Enterprise dev tools** (Jira, legacy IDEs, gray admin panels): utilitarian, no soul, built to spec not built with love.
- **Consumer-approachable tools** (Canva aesthetic): colorful, rounded, friendly — wrong energy for a spec-grade instrument.
- **VSCode dark mode clone**: monospace everything, flat icon sidebar, soulless — a dark tool that doesn't signal craft.

## Design Principles

1. **The chrome earns its invisibility.** The editor UI should recede so the user's design tokens are the visual subject. Every chrome decision justifies itself by serving that goal — decoration that competes with the preview pane is always wrong.

2. **Craft signals intent.** Micro-details (transitions, spacing rhythm, type calibration) communicate that this tool takes design seriously before the user's output proves it. A sloppy tool produces distrust in the output.

3. **Warmth through material, not volume.** The single brass accent is warm because it is precise and restrained, not because it is everywhere. Warmth comes from the quality of a decision, not from adding more color.

4. **Depth over decoration.** Prefer substance — real validation feedback, legible state, responsive layout decisions — over visual embellishment. A feature that works correctly is always more important than a feature that looks interesting.

5. **Indie soul, professional spine.** This tool is personal and opinionated, made with a maker's care, not engineered to enterprise committee spec. That specificity is a feature; it should show in small, deliberate choices that no enterprise tool would bother with.

## Accessibility & Inclusion

WCAG 2.1 AA minimum. Keyboard navigation throughout (editor, modal, preview controls). Focus management: trap focus in modals, restore on close. Reduced-motion media query honored on all transitions (already wired in globals.css). Contrast: body text ≥ 4.5:1 against panel backgrounds; accent (brass) used only on interactive affordances and active states, verified at each use.
