# build-uikit — exhaustive checklist

## Inputs
- [ ] Target output path confirmed with the user.
- [ ] `output/UIKIT-SPEC.md` and `output/DESIGN.md` read.
- [ ] Target tech read from `.uikit-ready.json` (or asked).
- [ ] Matching `reference/per-framework/<tech>.md` + best-practices read.

## Boilerplate
- [ ] `scaffold.mjs` run; tree created; DESIGN.md/UIKIT-SPEC.md copied.
- [ ] package.json + scripts present and tech-appropriate.
- [ ] Embedded `.claude/` present (interface-builder agent + 5 skills + best practices).

## Tokens
- [ ] `design-tokens.css` generated from DESIGN.md front-matter.
- [ ] Light and dark layers both resolve.
- [ ] Framework token bindings written (theme provider / :host vars / runes).

## Components
- [ ] Only the selected framework emitted (no others).
- [ ] Every selected component has source + story + doc.
- [ ] All states and variants covered.
- [ ] Tokens-only — no hard-coded color, radius, or font.
- [ ] Each component placed under its category folder.

## Layouts & pages
- [ ] Every selected layout implemented.
- [ ] Every page-kind layout produces a base page under `src/pages/`.
- [ ] Mobile-first responsive per DESIGN breakpoints.

## Preview & Storybook
- [ ] Preview app groups components by category.
- [ ] Each component has a working copy-code control.
- [ ] Storybook config builds; one story per component (all states/variants).

## Verify
- [ ] `npm install` succeeds.
- [ ] Build succeeds.
- [ ] Storybook build succeeds.
- [ ] Report the path and run commands to the user.
