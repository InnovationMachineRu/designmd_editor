import type { TemplateFile } from "./types";

// Canonical best-practices content. This module is the single source of truth:
// the committed `.claude/best-practices/*` files mirror these strings, and the
// Export-step download bundle embeds them too. Each file is checklist-oriented
// so it can both guide the agents and (later) be edited through the UI.

export const SUPPORTED_TECHS = [
  "react",
  "web-components",
  "vue",
  "angular",
  "svelte",
] as const;

export type Tech = (typeof SUPPORTED_TECHS)[number];

export const TECH_LABEL: Record<string, string> = {
  react: "React + TypeScript",
  "web-components": "Web Components",
  vue: "Vue 3",
  angular: "Angular",
  svelte: "Svelte 5",
};

const REACT = `# Best practices — React + TypeScript

Token-driven, accessible, production-grade React components.

## Component authoring checklist
- [ ] Function components with explicit typed props (\`interface XxxProps\`).
- [ ] Forward refs on interactive primitives (\`forwardRef\`) so consumers can focus/measure.
- [ ] Variants are a discriminated prop union (\`variant?: "primary" | "secondary" | "plain"\`), never ad-hoc class strings.
- [ ] Sizes/states map to tokens, not literals. No hard-coded hex, px radius, or font names.
- [ ] Spread \`...rest\` onto the root element; merge \`className\`.
- [ ] Controlled + uncontrolled where it matters (inputs): support \`value\`/\`defaultValue\`.

## Styling checklist
- [ ] Tailwind v4 \`@theme\` maps every DESIGN.md token to a CSS variable.
- [ ] Components read tokens via classes/vars; light & dark layers both resolve.
- [ ] State styles (\`hover\`, \`focus-visible\`, \`disabled\`, \`aria-*\`) come from token deltas.
- [ ] Respect \`prefers-reduced-motion\`.

## Stories & docs checklist
- [ ] One CSF3 \`*.stories.tsx\` per component covering every state and variant.
- [ ] A \`*.md\` doc with props table, states, a11y notes, and a copy-paste usage snippet.

## Testing checklist
- [ ] React Testing Library: render, role queries, keyboard interaction.
- [ ] jest-axe (or equivalent) smoke check per component.
`;

const VUE = `# Best practices — Vue 3

SFCs with \`<script setup lang="ts">\`, token-driven styling.

## Component authoring checklist
- [ ] \`<script setup lang="ts">\` with \`defineProps<...>()\` / \`defineEmits<...>()\`.
- [ ] Variants/sizes/states are typed props mapped to tokens, never literals.
- [ ] Emit semantic events (\`update:modelValue\`, \`click\`); support \`v-model\` on inputs.
- [ ] Expose focus()/root ref via \`defineExpose\` on interactive primitives.

## Styling checklist
- [ ] A CSS custom-properties theme layer generated from DESIGN.md tokens.
- [ ] \`<style scoped>\` reads vars; no hard-coded color/radius/font.
- [ ] \`hover\`/\`:focus-visible\`/\`[disabled]\` styles from token deltas; honor reduced-motion.

## Stories & docs checklist
- [ ] Storybook (Vue3 + Vite) story per component, all states/variants.
- [ ] Markdown doc: props, events, slots, a11y, usage snippet.

## Testing checklist
- [ ] Vue Testing Library: render, roles, keyboard, \`v-model\` round-trip.
- [ ] axe smoke check per component.
`;

const ANGULAR = `# Best practices — Angular

Standalone components with signals, token-driven styling.

## Component authoring checklist
- [ ] \`standalone: true\` components; inputs/outputs via \`input()\` / \`output()\` signals.
- [ ] \`ChangeDetectionStrategy.OnPush\`.
- [ ] Variants/sizes/states are typed inputs mapped to tokens, never literals.
- [ ] Host bindings reflect state (\`[attr.aria-*]\`, \`[class.is-disabled]\`).

## Styling checklist
- [ ] \`:host\` CSS custom properties generated from DESIGN.md tokens.
- [ ] Component styles read vars; no hard-coded color/radius/font.
- [ ] \`:focus-visible\`/disabled styles from token deltas; honor reduced-motion.

## Stories & docs checklist
- [ ] Storybook (Angular) story per component, all states/variants.
- [ ] Markdown doc: inputs, outputs, a11y, usage snippet.

## Testing checklist
- [ ] TestBed + component harness: render, roles, keyboard.
- [ ] axe smoke check per component.
`;

const SVELTE = `# Best practices — Svelte 5

Runes-based components, token-driven styling.

## Component authoring checklist
- [ ] Runes: \`$props()\`, \`$state()\`, \`$derived()\`, \`$effect()\` (no legacy reactive labels).
- [ ] Typed props; variants/sizes/states map to tokens, never literals.
- [ ] Two-way binding via \`$bindable()\` for inputs; dispatch semantic events.

## Styling checklist
- [ ] CSS custom properties on \`:root\` generated from DESIGN.md tokens.
- [ ] Component \`<style>\` reads vars; no hard-coded color/radius/font.
- [ ] \`:focus-visible\`/disabled styles from token deltas; honor reduced-motion.

## Stories & docs checklist
- [ ] Storybook (Svelte + Vite) story per component, all states/variants.
- [ ] Markdown doc: props, events, a11y, usage snippet.

## Testing checklist
- [ ] Svelte Testing Library: render, roles, keyboard, binding round-trip.
- [ ] axe smoke check per component.
`;

const WEB_COMPONENTS = `# Best practices — Web Components

Custom elements + Shadow DOM, framework-agnostic.

## Component authoring checklist
- [ ] Define custom elements (\`customElements.define\`); names are hyphenated.
- [ ] Shadow DOM with \`:host\` styling; reflect attributes ↔ properties.
- [ ] Variants/sizes/states are reflected attributes mapped to tokens, never literals.
- [ ] Emit \`CustomEvent\`s with \`{ bubbles, composed }\` as appropriate.
- [ ] Manage focus delegation (\`delegatesFocus: true\`) for interactive elements.

## Styling checklist
- [ ] \`:host\` CSS custom properties generated from DESIGN.md tokens (pierce Shadow DOM via vars).
- [ ] No hard-coded color/radius/font; \`:focus-visible\`/disabled from token deltas.
- [ ] Honor \`prefers-reduced-motion\`.

## Stories & docs checklist
- [ ] Storybook (web-components) story per element, all states/variants.
- [ ] Markdown doc: attributes, properties, events, slots, a11y, usage snippet.

## Testing checklist
- [ ] @web/test-runner: render, roles, keyboard, attribute reflection.
- [ ] axe smoke check per element.
`;

const FRAMEWORKS: Record<string, string> = {
  react: REACT,
  vue: VUE,
  angular: ANGULAR,
  svelte: SVELTE,
  "web-components": WEB_COMPONENTS,
};

const ACCESSIBILITY = `# Best practices — Accessibility

Targets WCAG 2.2 AA. Verified with the Chrome DevTools MCP.

## Checklist
- [ ] Semantic HTML first; ARIA only to fill gaps (roles, \`aria-label\`, \`aria-expanded\`, \`aria-controls\`).
- [ ] Every interactive element is keyboard reachable and operable; logical tab order.
- [ ] Visible \`:focus-visible\` indicator on all focusable elements.
- [ ] Color contrast ≥ 4.5:1 body text, ≥ 3:1 large text & UI boundaries.
- [ ] Form fields have associated \`<label>\`s; errors announced via \`aria-describedby\`/live regions.
- [ ] Images/icons have text alternatives; decorative ones are \`aria-hidden\`.
- [ ] Hit targets ≥ 24×24 CSS px (44×44 on touch).
- [ ] Respect \`prefers-reduced-motion\`; no motion-only meaning.
- [ ] Modal/drawer/menu trap & restore focus; \`Esc\` closes.

## Chrome DevTools MCP workflow
1. \`new_page\` / \`navigate_page\` to the preview URL.
2. \`take_snapshot\` to inspect the accessibility tree.
3. \`emulate\` for reduced-motion / color-scheme.
4. Record failures with \`take_screenshot\`; check \`list_console_messages\` for ARIA warnings.
`;

const PERFORMANCE = `# Best practices — Performance

Core Web Vitals budgets, verified with the Chrome DevTools MCP.

## Budgets
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms (lab + field).
- [ ] Initial JS payload kept lean; tree-shakeable component exports.
- [ ] No layout shift from web fonts (\`font-display: swap\`, sized fallbacks).
- [ ] Images sized & lazy-loaded below the fold.

## Chrome DevTools MCP workflow
1. \`performance_start_trace\` → exercise the page → \`performance_stop_trace\`.
2. \`performance_analyze_insight\` on the largest opportunities.
3. \`lighthouse_audit\` for a scored snapshot (performance + a11y categories).
4. Re-run after fixes; record before/after numbers.
`;

const TESTING = `# Best practices — Testing

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
`;

const DESIGN_TOKENS = `# Best practices — Design tokens

Tokens are the single source of truth for color, type, radius, and spacing.

## Checklist
- [ ] Never hard-code color/radius/font/spacing in components — reference tokens.
- [ ] In DESIGN.md, cross-references use \`{group.token}\` (e.g. \`{colors.primary}\`).
- [ ] Every background/foreground pair has an accessible "on-" color.
- [ ] Light & dark layers both resolve for every token used.
- [ ] Responsive rules are mobile-first (\`min-width\` media queries) per DESIGN breakpoints.
- [ ] Component tokens use only the 8 valid props: backgroundColor, textColor, typography,
      rounded, padding, size, height, width.
`;

const SHARED: Record<string, string> = {
  accessibility: ACCESSIBILITY,
  performance: PERFORMANCE,
  testing: TESTING,
  "design-tokens": DESIGN_TOKENS,
};

/** Best-practices markdown for one framework (falls back to React). */
export function frameworkBestPractices(tech: string): string {
  return FRAMEWORKS[tech] ?? FRAMEWORKS.react;
}

/** A shared best-practices doc by key. */
export function sharedBestPractices(
  key: "accessibility" | "performance" | "testing" | "design-tokens"
): string {
  return SHARED[key];
}

const README = `# Best practices

Editable references that drive how the AI agents author components, layouts,
and tests. (UI editing is planned; for now edit the markdown directly.)

- \`frameworks/\` — one file per supported technology.
- \`shared/\` — accessibility, performance, testing, design-tokens.
`;

/** All committed best-practices files (mirrors `.claude/best-practices/`). */
export function bestPracticesFiles(prefix = ".claude/best-practices"): TemplateFile[] {
  const files: TemplateFile[] = [{ path: `${prefix}/README.md`, contents: README }];
  for (const tech of SUPPORTED_TECHS) {
    files.push({ path: `${prefix}/frameworks/${tech}.md`, contents: FRAMEWORKS[tech] });
  }
  for (const key of Object.keys(SHARED)) {
    files.push({ path: `${prefix}/shared/${key}.md`, contents: SHARED[key] });
  }
  return files;
}
