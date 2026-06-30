# Best practices — Performance

Core Web Vitals budgets, verified with the Chrome DevTools MCP.

## Budgets
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms (lab + field).
- [ ] Initial JS payload kept lean; tree-shakeable component exports.
- [ ] No layout shift from web fonts (`font-display: swap`, sized fallbacks).
- [ ] Images sized & lazy-loaded below the fold.

## Chrome DevTools MCP workflow
1. `performance_start_trace` → exercise the page → `performance_stop_trace`.
2. `performance_analyze_insight` on the largest opportunities.
3. `lighthouse_audit` for a scored snapshot (performance + a11y categories).
4. Re-run after fixes; record before/after numbers.
