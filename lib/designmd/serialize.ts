import { stringify as yamlStringify } from "yaml";
import {
  CANONICAL_SECTIONS,
  type CanonicalSection,
  type DesignDoc,
} from "./types";

/**
 * Build the ordered plain object for the YAML front-matter. Key order follows
 * the spec: meta first, then colors → typography → rounded → spacing → components.
 * Empty groups are omitted.
 */
function frontMatterObject(doc: DesignDoc): Record<string, unknown> {
  const fm: Record<string, unknown> = {};
  if (doc.version) fm.version = doc.version;
  fm.name = doc.name;
  if (doc.description) fm.description = doc.description;

  if (Object.keys(doc.colors).length) fm.colors = doc.colors;
  if (Object.keys(doc.typography).length) {
    // Drop undefined props within each typography token for clean output.
    fm.typography = Object.fromEntries(
      Object.entries(doc.typography).map(([k, t]) => [
        k,
        Object.fromEntries(
          Object.entries(t).filter(([, v]) => v !== undefined && v !== "")
        ),
      ])
    );
  }
  if (Object.keys(doc.rounded).length) fm.rounded = doc.rounded;
  if (Object.keys(doc.spacing).length) fm.spacing = doc.spacing;
  if (Object.keys(doc.components).length) {
    fm.components = Object.fromEntries(
      Object.entries(doc.components).map(([k, c]) => [
        k,
        Object.fromEntries(
          Object.entries(c).filter(([, v]) => v !== undefined && v !== "")
        ),
      ])
    );
  }
  return fm;
}

/** Serialize a DesignDoc into a complete DESIGN.md string. */
export function serializeDesignDoc(doc: DesignDoc): string {
  const yaml = yamlStringify(frontMatterObject(doc), {
    // Preserve string types like fontWeight "400" by quoting when ambiguous.
    defaultStringType: "PLAIN",
    lineWidth: 0,
  }).trimEnd();

  const body: string[] = [];
  for (const section of CANONICAL_SECTIONS) {
    const content = doc.sections[section as CanonicalSection]?.trim();
    if (content) {
      body.push(`## ${section}\n\n${content}\n`);
    }
  }

  return `---\n${yaml}\n---\n\n${body.join("\n")}`.trimEnd() + "\n";
}
