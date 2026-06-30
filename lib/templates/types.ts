import type { DesignDoc } from "@/lib/designmd/types";

/** Inputs that parameterize every generated template file. */
export interface TemplateContext {
  /** The current design document (tokens + rationale). */
  doc: DesignDoc;
  /** Target technology id: react | web-components | vue | angular | svelte. */
  tech: string;
  /** Selected UIKit component ids. */
  components: string[];
  /** Selected layout ids. */
  layouts: string[];
  /** Suggested output directory for the generated UIKit (optional). */
  uikitDir?: string;
}

/** A single file in a generated bundle: a relative path + its text contents. */
export interface TemplateFile {
  path: string;
  contents: string;
}
