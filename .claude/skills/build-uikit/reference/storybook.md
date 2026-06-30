# Storybook stories

- One story file per component, colocated with the source.
- A default/primary story plus a story (or args control) for **every** state and
  variant declared in UIKIT-SPEC.md (`<component>-<state>`, `<component>-<variant>`).
- Use the framework's CSF3 conventions (React/Vue/Svelte/Angular/web-components).
- Import `design-tokens.css` so stories render with the real tokens.
- Add a dark-mode toggle (Storybook globals or a decorator) so both layers are visible.

## Checklist
- [ ] `.storybook/` config builds (`npm run storybook`, `storybook build`).
- [ ] Every component has a story.
- [ ] Every state and variant is reachable from the story.
- [ ] Tokens render correctly in light and dark.
