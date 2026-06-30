import { CANONICAL_SECTIONS, type CanonicalSection, type DesignDoc } from "./types";
import { getComponent } from "../uikit/catalog";

/** Join up to `max` items as inline-code, appending "…" when truncated. */
function codeList(keys: string[], max = 10): string {
  if (!keys.length) return "—";
  const shown = keys.slice(0, max).map((k) => `\`${k}\``);
  return shown.join(", ") + (keys.length > max ? ", …" : "");
}

/**
 * Auto-generate the markdown text for a canonical rationale section from the
 * document's tokens and the selected UIKit components, with inline references to
 * the YAML token keys (`group.key`). Used when a section is in "auto" mode.
 */
export function generateSection(
  section: CanonicalSection,
  doc: DesignDoc,
  selectedComponentIds: string[]
): string {
  const colorKeys = Object.keys(doc.colors);
  const onKeys = colorKeys.filter((k) => k.startsWith("on-"));
  const typeKeys = Object.keys(doc.typography);
  const roundedKeys = Object.keys(doc.rounded);
  const spacingKeys = Object.keys(doc.spacing);
  const componentKeys = Object.keys(doc.components);
  const selected = selectedComponentIds
    .map((id) => getComponent(id))
    .filter((c): c is NonNullable<ReturnType<typeof getComponent>> => Boolean(c));
  const mono = doc.brandbook?.fonts.mono;

  switch (section) {
    case "Overview":
      return (
        `**${doc.name}** — a token-driven design system: ` +
        `${colorKeys.length} color roles in \`colors\`, ${typeKeys.length} styles in ` +
        `\`typography\`, ${roundedKeys.length} radii in \`rounded\` and ${spacingKeys.length} ` +
        `spacing steps in \`spacing\`, bound to ${selected.length} UIKit component${
          selected.length === 1 ? "" : "s"
        }.` +
        (doc.description ? ` ${doc.description}` : "")
      );

    case "Colors":
      return (
        `Color roles live under \`colors\`: ${codeList(colorKeys, 8)}. ` +
        `Pair each surface/role with its \`on-*\` foreground (${codeList(onKeys, 6)}) ` +
        `for AA contrast. Reference colors as \`{colors.<role>}\` rather than literals.`
      );

    case "Typography":
      return (
        `The type scale in \`typography\` runs \`${typeKeys[0] ?? "label-sm"}\` → ` +
        `\`${typeKeys[typeKeys.length - 1] ?? "display-lg"}\` (${typeKeys.length} steps): ` +
        `${codeList(typeKeys, 8)}. Heading and body families come from the Brandbook` +
        (mono ? `, with \`${mono}\` for monospace/code.` : ".")
      );

    case "Layout":
      return (
        `Spacing is driven by \`spacing\` (${codeList(spacingKeys, 8)}). ` +
        `The base unit is \`spacing.unit\`; containers use \`spacing.container-padding\` ` +
        `and cards use \`spacing.card-gap\`. Components lay out on a 12-column grid.`
      );

    case "Elevation & Depth":
      return (
        `Depth communicates hierarchy. Elevated surfaces use ` +
        `\`components.card-elevated\` over \`components.card\`; prefer the documented ` +
        `elevation treatment over ad-hoc shadows.`
      );

    case "Shapes":
      return (
        `Corner radii live under \`rounded\` (${codeList(roundedKeys, 8)}). ` +
        `Apply consistent radii to related controls; pills use \`rounded.full\`.`
      );

    case "Components": {
      if (!selected.length) {
        return (
          `Component tokens are defined under \`components\` ` +
          `(${codeList(componentKeys, 8)}), bound to tokens via \`{group.token}\` references. ` +
          `Select UIKit components on the UIKit step to expand this section.`
        );
      }
      const names = selected.map((c) => c.name).join(", ");
      const example = selected[0];
      const roles = example.tokenRoles.map((r) => `\`{…${r}}\``).join(", ");
      return (
        `This system ships ${selected.length} component${selected.length === 1 ? "" : "s"}: ` +
        `${names}. Each binds its look to tokens via \`{group.token}\` references — ` +
        `e.g. **${example.name}** → ${roles}. ` +
        `Component tokens live under \`components\` (${codeList(componentKeys, 6)}).`
      );
    }

    case "Do's and Don'ts":
      return (
        `Do reference tokens (\`{colors.primary}\`, \`{rounded.md}\`, ` +
        `\`{typography.label-md}\`) instead of hard-coding values. ` +
        `Don't introduce off-scale colors or radii outside \`colors\` / \`rounded\`.`
      );

    default:
      return "";
  }
}

/**
 * Return a copy of `doc` with every auto section (flag !== false; default auto)
 * regenerated from the current tokens + selected components. Manual sections
 * (flag === false) are left untouched.
 */
export function regenAutoSections(
  doc: DesignDoc,
  selectedComponentIds: string[]
): DesignDoc {
  const auto = doc.sectionsAuto ?? {};
  const sections = { ...doc.sections };
  for (const section of CANONICAL_SECTIONS) {
    if (auto[section] !== false) {
      sections[section] = generateSection(section, doc, selectedComponentIds);
    }
  }
  return { ...doc, sections };
}
