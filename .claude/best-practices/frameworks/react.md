# Best practices — React + TypeScript

Token-driven, accessible, production-grade React components.

## Component authoring checklist
- [ ] Function components with explicit typed props (`interface XxxProps`).
- [ ] Forward refs on interactive primitives (`forwardRef`) so consumers can focus/measure.
- [ ] Variants are a discriminated prop union (`variant?: "primary" | "secondary" | "plain"`), never ad-hoc class strings.
- [ ] Sizes/states map to tokens, not literals. No hard-coded hex, px radius, or font names.
- [ ] Spread `...rest` onto the root element; merge `className`.
- [ ] Controlled + uncontrolled where it matters (inputs): support `value`/`defaultValue`.

## Styling checklist
- [ ] Tailwind v4 `@theme` maps every DESIGN.md token to a CSS variable.
- [ ] Components read tokens via classes/vars; light & dark layers both resolve.
- [ ] State styles (`hover`, `focus-visible`, `disabled`, `aria-*`) come from token deltas.
- [ ] Respect `prefers-reduced-motion`.

## Stories & docs checklist
- [ ] One CSF3 `*.stories.tsx` per component covering every state and variant.
- [ ] A `*.md` doc with props table, states, a11y notes, and a copy-paste usage snippet.

## Testing checklist
- [ ] React Testing Library: render, role queries, keyboard interaction.
- [ ] jest-axe (or equivalent) smoke check per component.
