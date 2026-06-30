import type { DesignDoc } from "../designmd/types";
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

function tokenSummary(doc: DesignDoc): string {
  const out: string[] = [];

  const colors = Object.entries(doc.colors).slice(0, 60);
  if (colors.length) {
    out.push("### Colors\n");
    out.push(table(["Token", "Value"], colors.map(([k, v]) => [`\`${k}\``, `\`${v}\``])));
    out.push("");
  }

  const typo = Object.entries(doc.typography);
  if (typo.length) {
    out.push("### Typography\n");
    out.push(
      table(
        ["Token", "Family", "Size", "Weight", "Line"],
        typo.map(([k, t]) => [
          `\`${k}\``,
          t.fontFamily ?? "—",
          t.fontSize ?? "—",
          t.fontWeight ?? "—",
          t.lineHeight ?? "—",
        ])
      )
    );
    out.push("");
  }

  const rounded = Object.entries(doc.rounded);
  if (rounded.length) {
    out.push("### Rounding\n");
    out.push(table(["Token", "Value"], rounded.map(([k, v]) => [`\`${k}\``, `\`${v}\``])));
    out.push("");
  }

  const spacing = Object.entries(doc.spacing);
  if (spacing.length) {
    out.push("### Spacing\n");
    out.push(
      table(["Token", "Value"], spacing.map(([k, v]) => [`\`${k}\``, `\`${String(v)}\``]))
    );
    out.push("");
  }

  return out.join("\n");
}

function componentSpec(id: string): string {
  const comp = getComponent(id);
  if (!comp) return "";
  const lines: string[] = [];
  lines.push(`### ${comp.name} \`<${comp.id}>\``);
  lines.push("");
  lines.push(comp.description);
  lines.push("");
  lines.push(`- **States:** ${comp.states.join(", ")}`);
  lines.push(`- **Props / attributes:** ${comp.props.map((p) => `\`${p}\``).join(", ")}`);
  lines.push(
    `- **Token bindings:** ${comp.tokenRoles.map((t) => `\`{…${t}}\``).join(", ")}`
  );
  lines.push(`- **Accessibility:** ${comp.a11y.join("; ")}`);
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate the UIKit technical spec (ТЗ) markdown from the saved design system,
 * the selected components, and the target technology.
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

  const md: string[] = [];
  md.push(`# UIKit Technical Specification — ${doc.name}`);
  md.push("");
  md.push(`> Generated from a DESIGN.md design system for **${techLabel}**.`);
  if (techMeta) md.push(`> ${techMeta.note}`);
  md.push("");

  md.push("## 1. Overview");
  md.push("");
  md.push(
    `This UIKit implements **${selected.length} components** styled by the **${doc.name}** design system ` +
      `(${Object.keys(doc.colors).length} colors, ${Object.keys(doc.typography).length} type scales, ` +
      `${Object.keys(doc.rounded).length} rounding levels). Every component must bind its appearance to ` +
      `the design tokens below rather than hard-coding values.`
  );
  md.push("");

  md.push("## 2. Target technology");
  md.push("");
  md.push(`**${techLabel}**`);
  md.push("");
  md.push(guidance);
  md.push("");

  md.push("## 3. Design tokens");
  md.push("");
  md.push(tokenSummary(doc));

  md.push("## 4. Component requirements");
  md.push("");
  if (selected.length === 0) {
    md.push("_No components selected._");
    md.push("");
  } else {
    for (const id of selected) md.push(componentSpec(id));
  }

  md.push("## 5. Acceptance criteria");
  md.push("");
  md.push("- [ ] Every component implements all listed states with token-bound styling.");
  md.push("- [ ] No hard-coded colors, radii, or font values — all derive from tokens.");
  md.push("- [ ] Accessibility requirements per component are met (roles, focus, keyboard).");
  md.push("- [ ] Light and dark palettes are supported via the token layer.");
  md.push("- [ ] A demo page renders each component in all states.");
  md.push("");

  return md.join("\n");
}
