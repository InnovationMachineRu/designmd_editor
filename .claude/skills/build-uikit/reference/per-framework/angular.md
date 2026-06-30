# Scaffolding rules — Angular

- Tooling: Angular CLI (standalone, no NgModules).
- Component shape: `standalone: true`, `input()`/`output()` signals,
  `ChangeDetectionStrategy.OnPush`, host bindings for state/aria.
- Tokens: `:host` CSS custom properties from DESIGN.md.
- Stories: Storybook (Angular), one per component.
- Tests: TestBed + component harness + axe.

Follow `.claude/best-practices/frameworks/angular.md`.
