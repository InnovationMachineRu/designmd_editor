# Scaffolding rules — Web Components

- Tooling: Vite + TypeScript (no framework runtime).
- Component shape: custom elements with Shadow DOM, attribute↔property reflection,
  `delegatesFocus`, `CustomEvent` for output.
- Tokens: `:host` CSS custom properties from DESIGN.md (pierce Shadow DOM via vars).
- Stories: Storybook (web-components), one per element.
- Tests: @web/test-runner + axe.

Follow `.claude/best-practices/frameworks/web-components.md`.
