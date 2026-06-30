# Best practices — Testing

A pyramid: unit + story coverage at the base, end-to-end on top.

## Checklist
- [ ] Each component: a story per state/variant (visual + interaction coverage).
- [ ] Unit tests cover rendering, roles, keyboard, controlled/uncontrolled behavior.
- [ ] e2e (Playwright by default) covers real user journeys through composed interfaces.
- [ ] a11y smoke check (axe) wired into unit/story runs.
- [ ] Tests are deterministic (no time/network flakiness); use fixtures.

## End-to-end generation guidance
- Derive specs from the interface's user stories (who, does what, expects what).
- One spec file per journey; assert on roles/labels, not brittle selectors.
- Cover the happy path + at least one error/edge path per journey.
