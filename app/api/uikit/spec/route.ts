import { NextResponse } from "next/server";
import { mkdir, writeFile, rename } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import type { DesignDoc } from "@/lib/designmd/types";
import { generateSpec } from "@/lib/uikit/spec";
import { uikitSpecPath, uikitReadyPath, designFilePath } from "@/lib/designmd/paths";

export const runtime = "nodejs";

interface Body {
  doc: DesignDoc;
  tech: string;
  components: string[];
  layouts?: string[];
}

/** Generate the UIKit ТЗ and write it to UIKIT-SPEC.md. */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.doc || !Array.isArray(body.components)) {
    return NextResponse.json({ error: "Missing doc or components" }, { status: 400 });
  }

  const content = generateSpec({
    doc: body.doc,
    tech: body.tech ?? "react",
    components: body.components,
    layouts: Array.isArray(body.layouts) ? body.layouts : [],
  });
  const filePath = uikitSpecPath();
  const readyPath = uikitReadyPath();

  try {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");

    // Write the completion sentinel atomically (.tmp → rename) so the
    // orchestrator agent never reads a partial file. The `runId` changes on
    // every export, which is how the agent detects a fresh signal.
    const sentinel = {
      version: 1,
      runId: randomUUID(),
      timestamp: new Date().toISOString(),
      tech: body.tech ?? "react",
      components: body.components,
      layouts: Array.isArray(body.layouts) ? body.layouts : [],
      specPath: filePath,
      designPath: designFilePath(),
    };
    const tmp = `${readyPath}.tmp`;
    await writeFile(tmp, JSON.stringify(sentinel, null, 2), "utf8");
    await rename(tmp, readyPath);
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to write file: ${(e as Error).message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: filePath, readyPath, content });
}
