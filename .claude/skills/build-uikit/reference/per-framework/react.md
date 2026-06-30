# Scaffolding rules — React + TypeScript

- Tooling: Vite + React 19 + TypeScript; Tailwind v4 with an `@theme` block that
  maps every DESIGN.md token to a CSS variable.
- File extensions: `.tsx` for components/stories, `.ts` for tokens.
- Component shape: typed `interface Props`, `forwardRef`, variant prop unions,
  `...rest` spread, `className` merge.
- Tokens: import `design-tokens.css`; consume via Tailwind classes / CSS vars.
- Stories: CSF3 `*.stories.tsx`, one per component, args for each variant/state.
- Tests: Vitest + React Testing Library + jest-axe.

Follow `.claude/best-practices/frameworks/react.md`.
