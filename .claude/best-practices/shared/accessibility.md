# Best practices — Accessibility

Targets WCAG 2.2 AA. Verified with the Chrome DevTools MCP.

## Checklist
- [ ] Semantic HTML first; ARIA only to fill gaps (roles, `aria-label`, `aria-expanded`, `aria-controls`).
- [ ] Every interactive element is keyboard reachable and operable; logical tab order.
- [ ] Visible `:focus-visible` indicator on all focusable elements.
- [ ] Color contrast ≥ 4.5:1 body text, ≥ 3:1 large text & UI boundaries.
- [ ] Form fields have associated `<label>`s; errors announced via `aria-describedby`/live regions.
- [ ] Images/icons have text alternatives; decorative ones are `aria-hidden`.
- [ ] Hit targets ≥ 24×24 CSS px (44×44 on touch).
- [ ] Respect `prefers-reduced-motion`; no motion-only meaning.
- [ ] Modal/drawer/menu trap & restore focus; `Esc` closes.

## Chrome DevTools MCP workflow
1. `new_page` / `navigate_page` to the preview URL.
2. `take_snapshot` to inspect the accessibility tree.
3. `emulate` for reduced-motion / color-scheme.
4. Record failures with `take_screenshot`; check `list_console_messages` for ARIA warnings.
