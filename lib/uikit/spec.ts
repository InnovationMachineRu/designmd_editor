import { DEFAULT_BREAKPOINTS, type DesignDoc } from "../designmd/types";
import { serializeDesignDoc } from "../designmd/serialize";
import { getComponent, TARGET_TECHS, uikitYaml } from "./catalog";
import { getLayout, layoutsYaml } from "../layouts/catalog";

/** Tech-specific guidance for consuming the design tokens. */
const TECH_GUIDANCE: Record<string, string> = {
  react: [
    "- Build each component as a typed React function component (`forwardRef` where focus matters).",
    "- Consume tokens as CSS custom properties projected on a theme provider, OR via Tailwind v4 `@theme` utilities generated from `design.md export css-tailwind`.",
    "- Co-locate variant logic; expose a `variant`/`size` prop union type.",
  ].join("\n"),
  "web-components": [
    "- Implement each component as a custom element with Shadow DOM.",
    "- Map design tokens to `:host` CSS custom properties (e.g. `--color-primary`) so they cascade through shadow boundaries.",
    "- Reflect key props to attributes; dispatch `CustomEvent`s for interactions.",
  ].join("\n"),
  vue: [
    "- Author components as `<script setup lang=\"ts\">` SFCs.",
    "- Provide tokens via a CSS variables layer or a Pinia/theme provider.",
    "- Type props with `defineProps<...>()` and emits with `defineEmits<...>()`.",
  ].join("\n"),
  angular: [
    "- Use standalone components with signals for state.",
    "- Expose tokens via global CSS variables and `:host` bindings.",
    "- Strongly type inputs/outputs; prefer `input()`/`output()` signal APIs.",
  ].join("\n"),
  svelte: [
    "- Use Svelte 5 runes (`$props`, `$state`, `$derived`).",
    "- Apply tokens through CSS custom properties on a root layout.",
    "- Keep components style-encapsulated; expose events via callback props.",
  ].join("\n"),
};

function table(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return [head, sep, body].join("\n");
}

/** Escape a `|` so it does not break the markdown table layout. */
function cell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function componentSpec(id: string): string {
  const comp = getComponent(id);
  if (!comp) return "";
  const lines: string[] = [];
  lines.push(`### ${comp.name} \`<${comp.id}>\``);
  lines.push("");
  lines.push(comp.description);
  lines.push("");
  lines.push(`**Behavior:** ${comp.behavior}`);
  lines.push("");
  lines.push(`- **States:** ${comp.states.join(", ")}`);
  lines.push(
    `- **Token bindings:** ${comp.tokenRoles.map((t) => `\`{…${t}}\``).join(", ")}`
  );
  lines.push(`- **Accessibility:** ${comp.a11y.join("; ")}`);
  lines.push("");

  lines.push("**Input parameters**");
  lines.push("");
  if (comp.params.length) {
    lines.push(
      table(
        ["Parameter", "Type", "Default", "Description"],
        comp.params.map((prm) => [
          `\`${cell(prm.name)}\``,
          `\`${cell(prm.type)}\``,
          prm.default !== undefined ? `\`${cell(prm.default)}\`` : "—",
          cell(prm.description),
        ])
      )
    );
  } else {
    lines.push("_None._");
  }
  lines.push("");

  lines.push("**Animations**");
  lines.push("");
  for (const a of comp.animations) lines.push(`- ${a}`);
  lines.push("");

  return lines.join("\n");
}

function layoutSpec(id: string): string {
  const l = getLayout(id);
  if (!l) return "";
  const lines: string[] = [];
  lines.push(`### ${l.name} \`${l.kind}\``);
  lines.push("");
  lines.push(l.description);
  lines.push("");
  lines.push(`- **Regions:** ${l.regions.map((r) => `\`${r}\``).join(", ")}`);
  lines.push(`- **Structure:** ${l.structure}`);
  lines.push(`- **Responsive:** ${l.responsive}`);
  lines.push(
    `- **Token bindings:** ${l.tokenRoles.map((t) => `\`{…${t}}\``).join(", ")}`
  );
  lines.push(`- **Accessibility:** ${l.a11y.join("; ")}`);
  lines.push(`- **Best for:** ${l.bestFor}`);
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate the responsive media-query ruleset from the document's breakpoints
 * (or the defaults). This is the contract for HOW components and layouts adapt
 * across screen sizes — mobile-first, min-width ascending.
 */
export function mediaQueryRules(doc: DesignDoc): string {
  const bp = doc.breakpoints && Object.keys(doc.breakpoints).length
    ? doc.breakpoints
    : DEFAULT_BREAKPOINTS;
  const ordered = Object.entries(bp).sort((a, b) => a[1] - b[1]);

  const lines: string[] = [];
  lines.push(
    "Author responsive CSS **mobile-first**: write the base (smallest-screen) styles " +
      "unconditionally, then layer enhancements at each breakpoint with ascending " +
      "`min-width` queries. Never start from desktop and walk down with `max-width`."
  );
  lines.push("");
  lines.push("**Rules**");
  lines.push("");
  lines.push("- Base styles target the smallest viewport — no media query.");
  lines.push("- Each breakpoint is a `min-width` query; they stack and override in ascending order.");
  lines.push("- Use the named breakpoints below; do not hard-code arbitrary pixel values.");
  lines.push("- Prefer fluid techniques (flex/grid `auto-fit`, `clamp()`, `%`/`fr` units) so fewer breakpoints are needed.");
  lines.push("- Use a `max-width` or range query **only** for a style that must apply to a single band exclusively.");
  lines.push("- Respect `prefers-reduced-motion` and `prefers-color-scheme` alongside width queries.");
  lines.push("");
  lines.push("**Breakpoints**");
  lines.push("");
  lines.push(
    table(
      ["Name", "Min width", "Media query"],
      ordered.map(([name, px]) => [
        `\`${name}\``,
        `${px}px`,
        `\`@media (min-width: ${px}px)\``,
      ])
    )
  );
  lines.push("");
  lines.push("**Template**");
  lines.push("");
  lines.push("```css");
  lines.push("/* Base — mobile first, no query */");
  lines.push(".layout { display: grid; grid-template-columns: 1fr; gap: var(--spacing-unit); }");
  for (const [name, px] of ordered) {
    lines.push("");
    lines.push(`/* ≥ ${name} */`);
    lines.push(`@media (min-width: ${px}px) {`);
    lines.push("  .layout { grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); }");
    lines.push("}");
  }
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate the UIKit technical spec (ТЗ) as a **DESIGN.md-compatible** document:
 * a valid design.md (YAML front-matter tokens + canonical body) produced by
 * `serializeDesignDoc`, with the UIKit ТЗ appended as extra markdown sections.
 * Because the design tokens live in the front-matter, the file validates and
 * can be opened/downloaded as a DESIGN.md, while still carrying the full spec.
 */
export function generateSpec(opts: {
  doc: DesignDoc;
  tech: string;
  components: string[];
  layouts?: string[];
}): string {
  const { doc, tech, components, layouts = [] } = opts;
  const techMeta = TARGET_TECHS.find((t) => t.id === tech);
  const techLabel = techMeta?.label ?? tech;
  const guidance = TECH_GUIDANCE[tech] ?? "- Consume design tokens via CSS custom properties.";

  const selected = components.filter((id) => getComponent(id));
  const selectedLayouts = layouts.filter((id) => getLayout(id));

  // Stamp the selected components & layouts into the YAML front-matter so the
  // generated DESIGN.md carries them under x-design-md (selected-only).
  const docForExport: DesignDoc = {
    ...doc,
    uikit: uikitYaml(selected, tech),
    layouts: layoutsYaml(selectedLayouts),
  };

  // Base document: a valid DESIGN.md (front-matter tokens + canonical body).
  const md: string[] = [serializeDesignDoc(docForExport).trimEnd(), ""];

  // UIKit ТЗ appended as additional body sections — keeps the file a valid
  // design.md while documenting the component contract.
  md.push("<!-- UIKit Technical Specification (ТЗ) — generated from this design system. -->");
  md.push("");

  md.push("## UIKit — Overview");
  md.push("");
  md.push(
    `This UIKit implements **${selected.length} components** for **${techLabel}**, styled by the ` +
      `**${doc.name}** design system (${Object.keys(doc.colors).length} colors, ` +
      `${Object.keys(doc.typography).length} type scales, ${Object.keys(doc.rounded).length} rounding levels). ` +
      "Every component must bind its appearance to the design tokens in the front-matter above " +
      "rather than hard-coding values."
  );
  if (techMeta) {
    md.push("");
    md.push(`> ${techMeta.note}`);
  }
  md.push("");

  md.push("## UIKit — Target technology");
  md.push("");
  md.push(`**${techLabel}**`);
  md.push("");
  md.push(guidance);
  md.push("");

  md.push("## UIKit — Component requirements");
  md.push("");
  md.push(
    "Each component below specifies its **behavior**, **states**, typed **input parameters**, " +
      "**animations**, token bindings, and accessibility requirements. Implement every one to spec."
  );
  md.push("");
  if (selected.length === 0) {
    md.push("_No components selected._");
    md.push("");
  } else {
    for (const id of selected) md.push(componentSpec(id));
  }

  // Layouts — page-level and complex-component compositions to implement.
  md.push("## Layouts");
  md.push("");
  md.push(
    "These layouts arrange the components above into pages and complex compositions. " +
      "Each specifies its regions, structure, responsive behavior, and token bindings. " +
      "Implement every layout to spec, driving all responsiveness from the rules below."
  );
  md.push("");
  if (selectedLayouts.length === 0) {
    md.push("_No layouts selected._");
    md.push("");
  } else {
    for (const id of selectedLayouts) md.push(layoutSpec(id));
  }

  // Responsive contract — how everything adapts across breakpoints.
  md.push("## Responsive — Media query rules");
  md.push("");
  md.push(mediaQueryRules(docForExport));

  md.push("## UIKit — Acceptance criteria");
  md.push("");
  md.push("- [ ] Every component implements all listed states with token-bound styling.");
  md.push("- [ ] Each component exposes the documented input parameters with the listed types and defaults.");
  md.push("- [ ] Documented behavior (interactions, focus, lifecycle, edge cases) is implemented.");
  md.push("- [ ] Specified animations/transitions are implemented and respect `prefers-reduced-motion`.");
  md.push("- [ ] No hard-coded colors, radii, or font values — all derive from tokens.");
  md.push("- [ ] Accessibility requirements per component are met (roles, focus, keyboard).");
  md.push("- [ ] Light and dark palettes are supported via the token layer.");
  md.push("- [ ] A demo page renders each component in all states.");
  md.push("- [ ] Every layout implements its documented regions and responsive behavior.");
  md.push("- [ ] All responsiveness is mobile-first and uses the named breakpoints (min-width).");
  md.push("");

  return md.join("\n").trimEnd() + "\n";
}
