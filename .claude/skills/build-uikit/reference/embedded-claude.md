# Embedded `.claude/` toolkit

Every generated UIKit ships with its own Claude Code toolkit so interfaces can be
built on top of it. `scaffold.mjs` writes these deterministically; verify they exist.

## Contents
- `.claude/agents/interface-builder.md` (model: sonnet)
  1. **Clarify** the interface purpose (marketing, landing, LMS, CRM, Project
     Management, Product Management, educational org, corporate, dashboard, e-commerce).
  2. **Propose** a component/layout/page set; get confirmation.
  3. **Implement** from UIKit parts only; then verify a11y + perf.
- `.claude/skills/interface-builder/SKILL.md`
- `.claude/skills/generate-e2e-tests/SKILL.md` — Playwright specs from user journeys.
- `.claude/skills/a11y-check/SKILL.md` — Chrome DevTools MCP accessibility audit.
- `.claude/skills/perf-check/SKILL.md` — Chrome DevTools MCP Core Web Vitals.
- `.claude/skills/<tech>-component/SKILL.md` — author new framework-idiomatic components.
- `.claude/best-practices/framework.md` + `shared/{accessibility,performance,testing,design-tokens}.md`.

## Chrome DevTools MCP tools used
`mcp__plugin_chrome-devtools-mcp_chrome-devtools__` + `navigate_page`, `new_page`,
`take_snapshot`, `take_screenshot`, `emulate`, `list_console_messages`,
`lighthouse_audit`, `performance_start_trace`, `performance_stop_trace`,
`performance_analyze_insight`.

## Checklist
- [ ] interface-builder agent present (asks purpose → proposes set → implements).
- [ ] All five skills present.
- [ ] framework.md matches the chosen tech.
- [ ] shared best practices copied.
