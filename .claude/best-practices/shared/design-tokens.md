# Best practices — Design tokens

Tokens are the single source of truth for color, type, radius, and spacing.

## Checklist
- [ ] Never hard-code color/radius/font/spacing in components — reference tokens.
- [ ] In DESIGN.md, cross-references use `{group.token}` (e.g. `{colors.primary}`).
- [ ] Every background/foreground pair has an accessible "on-" color.
- [ ] Light & dark layers both resolve for every token used.
- [ ] Responsive rules are mobile-first (`min-width` media queries) per DESIGN breakpoints.
- [ ] Component tokens use only the 8 valid props: backgroundColor, textColor, typography,
      rounded, padding, size, height, width.
