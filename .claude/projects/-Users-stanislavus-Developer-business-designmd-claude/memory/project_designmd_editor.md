---
name: project-designmd-editor
description: Core context for the DESIGN.md Editor — product register, visual identity, users, stack, anti-references
metadata:
  type: project
---

**What it is**: An interactive editor for the [design.md](https://github.com/google-labs-code/design.md) design-system specification. Three-step workflow: (1) Brandbook (color, type, shape, motion) → (2) Token editor with live preview → (3) UIKit component spec (ТЗ) generation per framework. Exports `DESIGN.md` + `UIKIT-SPEC.md` to `output/`.

**Register**: Product (design serves the tool workflow).

**Users**: Solo devs and indie makers building side projects; competent with code, want a fast frictionless way to produce validated design-system artifacts.

**Brand personality**: Craft · Depth · Warmth — atelier aesthetic, studio hardware feel. Reference: Pika / Pixelmator (polished indie tools, more designed than their category).

**Anti-references**: Generic SaaS builders (gradient-heavy, over-animated), enterprise dev tools (gray, no soul), Canva-style approachability, VSCode dark-mode clones.

**Existing visual identity** (committed — identity-preservation wins):
- Background: `#0c0d0f` body, `#141518` panel, `#1d1f24` panel-2
- Accent: `#e0a23b` brass (single warm signal), `#c9852a` hover
- Semantic colors: danger `#e5645f`, warn `#e08a3a`, ok `#5bb97d`
- Typography: Space Grotesk (display/wordmark), system-ui/Inter (UI body)
- "Achromatic instrument" concept: chrome recedes so user's tokens are the visual subject

**Stack**: Next.js 16 App Router, Tailwind v4, React 19, Zustand, @google/design.md CLI.

**Accessibility**: WCAG 2.1 AA.

**Why:** Init completed 2026-06-30. PRODUCT.md written to project root. Live config at `.impeccable/live/config.json`. DESIGN.md not yet generated.

**How to apply:** When suggesting design changes, preserve the brass + graphite identity. When suggesting features, prioritize the 3-step workflow and the "chrome earns its invisibility" principle. Suggest `/impeccable document` to generate DESIGN.md when needed.
