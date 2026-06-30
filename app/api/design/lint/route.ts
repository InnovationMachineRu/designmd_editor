import { NextResponse } from "next/server";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DesignDoc } from "@/lib/designmd/types";
import { serializeDesignDoc } from "@/lib/designmd/serialize";
import { lintFile } from "@/lib/designmd/cli";

export const runtime = "nodejs";

/** Validate a DesignDoc without persisting it (uses a temp file). */
export async function POST(req: Request) {
  let doc: DesignDoc;
  try {
    doc = (await req.json()) as DesignDoc;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const content = serializeDesignDoc(doc);
  const dir = await mkdtemp(join(tmpdir(), "dmd-"));
  const filePath = join(dir, "DESIGN.md");
  try {
    await writeFile(filePath, content, "utf8");
    const lint = await lintFile(filePath, doc);
    return NextResponse.json({ content, lint });
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
