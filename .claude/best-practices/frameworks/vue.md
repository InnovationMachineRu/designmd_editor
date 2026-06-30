# Best practices — Vue 3

SFCs with `<script setup lang="ts">`, token-driven styling.

## Component authoring checklist
- [ ] `<script setup lang="ts">` with `defineProps<...>()` / `defineEmits<...>()`.
- [ ] Variants/sizes/states are typed props mapped to tokens, never literals.
- [ ] Emit semantic events (`update:modelValue`, `click`); support `v-model` on inputs.
- [ ] Expose focus()/root ref via `defineExpose` on interactive primitives.

## Styling checklist
- [ ] A CSS custom-properties theme layer generated from DESIGN.md tokens.
- [ ] `<style scoped>` reads vars; no hard-coded color/radius/font.
- [ ] `hover`/`:focus-visible`/`[disabled]` styles from token deltas; honor reduced-motion.

## Stories & docs checklist
- [ ] Storybook (Vue3 + Vite) story per component, all states/variants.
- [ ] Markdown doc: props, events, slots, a11y, usage snippet.

## Testing checklist
- [ ] Vue Testing Library: render, roles, keyboard, `v-model` round-trip.
- [ ] axe smoke check per component.
