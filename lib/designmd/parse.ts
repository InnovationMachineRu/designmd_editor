import { parse as yamlParse } from "yaml";
import {
  CANONICAL_SECTIONS,
  type CanonicalSection,
  type DesignDoc,
  type Sections,
} from "./types";

/** Map known section-heading aliases to their canonical name. */
const SECTION_ALIASES: Record<string, CanonicalSection> = {
  overview: "Overview",
  "brand & style": "Overview",
  "brand and style": "Overview",
  colors: "Colors",
  colours: "Colors",
  typography: "Typography",
  layout: "Layout",
  "layout & spacing": "Layout",
  "layout and spacing": "Layout",
  "elevation & depth": "Elevation & Depth",
  elevation: "Elevation & Depth",
  shapes: "Shapes",
  components: "Components",
  "do's and don'ts": "Do's and Don'ts",
  "dos and don'ts": "Do's and Don'ts",
  "dos and donts": "Do's and Don'ts",
};

function canonicalSection(heading: string): CanonicalSection | null {
  const key = heading.trim().toLowerCase();
  if (SECTION_ALIASES[key]) return SECTION_ALIASES[key];
  const direct = CANONICAL_SECTIONS.find((s) => s.toLowerCase() === key);
  return direct ?? null;
}

/** Split a DESIGN.md string into the raw YAML block and the markdown body. */
function splitFrontMatter(src: string): { yaml: string; body: string } {
  const normalized = src.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (match) return { yaml: match[1], body: match[2] };
  return { yaml: "", body: normalized };
}

/** Parse top-level `## Heading` sections from the markdown body. */
function parseSections(body: string): Sections {
  const sections: Sections = {};
  const lines = body.split("\n");
  let current: CanonicalSection | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) sections[current] = buffer.join("\n").trim();
    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      flush();
      current = canonicalSection(headingMatch[1]);
    } else if (current) {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

/**
 * Parse a DESIGN.md string into a DesignDoc. Missing token groups default to
 * empty maps so the editor always has a complete, mutable structure.
 */
export function parseDesignDoc(src: string): DesignDoc {
  const { yaml, body } = splitFrontMatter(src);
  const fm = (yaml.trim() ? yamlParse(yaml) : {}) ?? {};

  return {
    version: typeof fm.version === "string" ? fm.version : undefined,
    name: typeof fm.name === "string" ? fm.name : "Untitled System",
    description: typeof fm.description === "string" ? fm.description : undefined,
    colors: isRecord(fm.colors) ? fm.colors : {},
    typography: isRecord(fm.typography) ? fm.typography : {},
    rounded: isRecord(fm.rounded) ? fm.rounded : {},
    spacing: isRecord(fm.spacing) ? fm.spacing : {},
    components: isRecord(fm.components) ? fm.components : {},
    sections: parseSections(body),
  };
}

function isRecord(v: unknown): v is Record<string, never> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
