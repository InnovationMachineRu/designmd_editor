# Best practices — Angular

Standalone components with signals, token-driven styling.

## Component authoring checklist
- [ ] `standalone: true` components; inputs/outputs via `input()` / `output()` signals.
- [ ] `ChangeDetectionStrategy.OnPush`.
- [ ] Variants/sizes/states are typed inputs mapped to tokens, never literals.
- [ ] Host bindings reflect state (`[attr.aria-*]`, `[class.is-disabled]`).

## Styling checklist
- [ ] `:host` CSS custom properties generated from DESIGN.md tokens.
- [ ] Component styles read vars; no hard-coded color/radius/font.
- [ ] `:focus-visible`/disabled styles from token deltas; honor reduced-motion.

## Stories & docs checklist
- [ ] Storybook (Angular) story per component, all states/variants.
- [ ] Markdown doc: inputs, outputs, a11y, usage snippet.

## Testing checklist
- [ ] TestBed + component harness: render, roles, keyboard.
- [ ] axe smoke check per component.
