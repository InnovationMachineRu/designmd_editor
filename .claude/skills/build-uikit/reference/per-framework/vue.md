# Scaffolding rules — Vue 3

- Tooling: Vite + Vue 3 + TypeScript.
- File extensions: `.vue` SFCs with `<script setup lang="ts">`.
- Component shape: `defineProps`/`defineEmits`, `v-model` for inputs,
  `defineExpose` for focus refs.
- Tokens: a CSS custom-properties theme layer from DESIGN.md; `<style scoped>` reads vars.
- Stories: Storybook (Vue3 + Vite), one per component.
- Tests: Vitest + Vue Testing Library + axe.

Follow `.claude/best-practices/frameworks/vue.md`.
