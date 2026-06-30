# Wizard phase checklists

Guide the user through these five route-based steps, one at a time. Confirm each
phase's checklist before advancing. Do not skip ahead.

## 1. Brandbook — `/brandbook`
- [ ] Color scheme / harmony chosen.
- [ ] Fonts (display + body) chosen.
- [ ] Shape / roundness set.
- [ ] Gradients, imagery, motion, and voice reviewed.

## 2. Design system — `/`
- [ ] Tokens reviewed in the live preview.
- [ ] Light and dark both look correct.
- [ ] Any style overrides intentional.

## 3. UIKit — `/uikit`
- [ ] At least one component selected.
- [ ] Selection covers what the product needs (actions, inputs, navigation, data,
      feedback, overlays, layout, commerce as relevant).

## 4. Layouts — `/layouts`
- [ ] Page layouts selected (dashboard, landing, settings, etc. as relevant).
- [ ] Component-kind layouts selected if needed.

## 5. Export — `/export`
- [ ] Target technology chosen (react / web-components / vue / angular / svelte).
- [ ] "Validate & generate UIKit spec (ТЗ)" clicked.
- [ ] No validation errors (otherwise fix in the Design system step and retry).
- [ ] `UIKIT-SPEC.md` and `.uikit-ready.json` present in the output dir.

Optional but recommended: also click **"Download AI agents + UIKit starter (.zip)"**
to grab a portable copy of the toolkit.
