import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { parseDesignDoc } from "@/lib/designmd/parse";
import { designFilePath } from "@/lib/designmd/paths";

export const runtime = "nodejs";

/**
 * Return the current generated DESIGN.md (raw text + parsed doc) so the Import
 * dialog can load what the design-importer agent produced.
 */
export async function GET() {
  const filePath = designFilePath();
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    return NextResponse.json(
      { error: `No DESIGN.md at ${filePath}` },
      { status: 404 }
    );
  }
  try {
    const doc = parseDesignDoc(content);
    return NextResponse.json({ path: filePath, content, doc });
  } catch (e) {
    // Still return the raw text so the caller can inspect/paste it.
    return NextResponse.json({ path: filePath, content, error: (e as Error).message });
  }
}
