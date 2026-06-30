import type { DesignDoc } from "../designmd/types";
import { serializeDesignDoc } from "../designmd/serialize";
import { getComponent, TARGET_TECHS } from "./catalog";

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
}): string {
  const { doc, tech, components } = opts;
  const techMeta = TARGET_TECHS.find((t) => t.id === tech);
  const techLabel = techMeta?.label ?? tech;
  const guidance = TECH_GUIDANCE[tech] ?? "- Consume design tokens via CSS custom properties.";

  const selected = components.filter((id) => getComponent(id));

  // Base document: a valid DESIGN.md (front-matter tokens + canonical body).
  const md: string[] = [serializeDesignDoc(doc).trimEnd(), ""];

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
  md.push("");

  return md.join("\n").trimEnd() + "\n";
}
