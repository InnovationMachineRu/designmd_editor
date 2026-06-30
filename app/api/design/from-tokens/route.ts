import { NextResponse } from "next/server";
import type { DesignDoc } from "@/lib/designmd/types";
import { serializeDesignDoc } from "@/lib/designmd/serialize";

export const runtime = "nodejs";

/**
 * Bridge for the design-importer: accept a partial token document and return a
 * guaranteed-valid serialized DESIGN.md. The importer can write the returned
 * `content` to output/DESIGN.md, then validate via POST /api/design/lint.
 */
export async function POST(req: Request) {
  let body: Partial<DesignDoc>;
  try {
    body = (await req.json()) as Partial<DesignDoc>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const doc: DesignDoc = {
    name: typeof body.name === "string" && body.name ? body.name : "Imported System",
    description: body.description,
    version: body.version,
    colors: body.colors ?? {},
    typography: body.typography ?? {},
    rounded: body.rounded ?? {},
    spacing: body.spacing ?? {},
    components: body.components ?? {},
    sections: body.sections ?? {},
  };

  const content = serializeDesignDoc(doc);
  return NextResponse.json({ content, doc });
}
