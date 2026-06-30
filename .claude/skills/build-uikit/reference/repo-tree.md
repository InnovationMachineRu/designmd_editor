# Generated UIKit repo tree (selected framework only)

```
<target>/
  package.json            # deps + scripts: dev, build, storybook, test, preview   [scaffold]
  README.md  .gitignore   BUILD-NOTES.md                                            [scaffold]
  DESIGN.md  UIKIT-SPEC.md                                                           [scaffold, copied]
  design-tokens.css       # CSS custom properties (light + dark)                     [authored]
  .storybook/             # Storybook config for the framework                       [authored]
  src/
    tokens/               # theme provider / :host vars / runes                      [authored]
    components/<categoryId>/<componentId>/
        <Component>.<ext>            # source, token-bound, all states/variants       [authored]
        <Component>.stories.<ext>    # Storybook story                                [authored]
        <Component>.md               # per-component doc + copy snippet               [authored]
    layouts/<layoutId>/   # every selected layout (page + component kinds)           [authored]
    pages/<pageLayoutId>/ # base pages from page-kind layouts                        [authored]
  preview/                # categorized Preview app, copy-code-per-component         [authored]
  tests/e2e/              # Playwright (or framework default) specs                  [authored]
  .claude/                # embedded toolkit                                          [scaffold]
    agents/interface-builder.md
    skills/{interface-builder,generate-e2e-tests,a11y-check,perf-check,<tech>-component}/SKILL.md
    best-practices/framework.md + shared/{accessibility,performance,testing,design-tokens}.md
```

Category ids (from the catalog): `actions, inputs, navigation, data, feedback,
overlays, layout, commerce`. Place each component under its category folder.
