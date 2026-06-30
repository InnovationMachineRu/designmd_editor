# DESIGN.md format (must produce valid output)

A DESIGN.md is YAML front-matter (tokens) + a Markdown body (canonical sections).
Mirrors `lib/designmd/types.ts`.

## Front-matter token groups
```yaml
name: My System
description: ...
colors:        # name -> hex | rgb() | oklch() | named
  primary: "#3b5bdb"
  surface: "#ffffff"
  on-surface: "#111418"
typography:    # name -> { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
  body: { fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "1.5" }
  heading: { fontFamily: "...", fontWeight: "700" }
rounded:       # name -> dimension
  sm: "4px"
  lg: "12px"
spacing:       # name -> dimension | number
  md: "16px"
components:    # name -> token map (only these 8 props)
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
```

- Cross-references use `{group.token}` (e.g. `{colors.primary}`).
- Component tokens use ONLY: backgroundColor, textColor, typography, rounded,
  padding, size, height, width.

## Body — canonical sections in order
`Overview`, `Colors`, `Typography`, `Layout`, `Elevation & Depth`, `Shapes`,
`Components`, `Do's and Don'ts`.

## Validation
The produced file must lint clean. Map every background to an accessible "on-"
color (≥ 4.5:1). Prefer few, well-named tokens over many ad-hoc ones.
