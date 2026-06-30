# Best practices — Web Components

Custom elements + Shadow DOM, framework-agnostic.

## Component authoring checklist
- [ ] Define custom elements (`customElements.define`); names are hyphenated.
- [ ] Shadow DOM with `:host` styling; reflect attributes ↔ properties.
- [ ] Variants/sizes/states are reflected attributes mapped to tokens, never literals.
- [ ] Emit `CustomEvent`s with `{ bubbles, composed }` as appropriate.
- [ ] Manage focus delegation (`delegatesFocus: true`) for interactive elements.

## Styling checklist
- [ ] `:host` CSS custom properties generated from DESIGN.md tokens (pierce Shadow DOM via vars).
- [ ] No hard-coded color/radius/font; `:focus-visible`/disabled from token deltas.
- [ ] Honor `prefers-reduced-motion`.

## Stories & docs checklist
- [ ] Storybook (web-components) story per element, all states/variants.
- [ ] Markdown doc: attributes, properties, events, slots, a11y, usage snippet.

## Testing checklist
- [ ] @web/test-runner: render, roles, keyboard, attribute reflection.
- [ ] axe smoke check per element.
