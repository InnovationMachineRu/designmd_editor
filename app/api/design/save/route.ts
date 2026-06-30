import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { DesignDoc } from "@/lib/designmd/types";
import { serializeDesignDoc } from "@/lib/designmd/serialize";
import { lintFile } from "@/lib/designmd/cli";
import { designFilePath } from "@/lib/designmd/paths";

export const runtime = "nodejs";

/**
 * Persist a DesignDoc to DESIGN.md (YAML front-matter + markdown body) and
 * validate it with the design.md CLI in one round-trip.
 */
export async function POST(req: Request) {
  let doc: DesignDoc;
  try {
    doc = (await req.json()) as DesignDoc;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!doc || typeof doc.name !== "string") {
    return NextResponse.json({ error: "Missing design document" }, { status: 400 });
  }

  const content = serializeDesignDoc(doc);
  const filePath = designFilePath();

  try {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to write file: ${(e as Error).message}` },
      { status: 500 }
    );
  }

  const lint = await lintFile(filePath, doc);

  return NextResponse.json({ path: filePath, content, lint });
}
