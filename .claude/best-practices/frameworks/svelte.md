# Best practices — Svelte 5

Runes-based components, token-driven styling.

## Component authoring checklist
- [ ] Runes: `$props()`, `$state()`, `$derived()`, `$effect()` (no legacy reactive labels).
- [ ] Typed props; variants/sizes/states map to tokens, never literals.
- [ ] Two-way binding via `$bindable()` for inputs; dispatch semantic events.

## Styling checklist
- [ ] CSS custom properties on `:root` generated from DESIGN.md tokens.
- [ ] Component `<style>` reads vars; no hard-coded color/radius/font.
- [ ] `:focus-visible`/disabled styles from token deltas; honor reduced-motion.

## Stories & docs checklist
- [ ] Storybook (Svelte + Vite) story per component, all states/variants.
- [ ] Markdown doc: props, events, a11y, usage snippet.

## Testing checklist
- [ ] Svelte Testing Library: render, roles, keyboard, binding round-trip.
- [ ] axe smoke check per component.
