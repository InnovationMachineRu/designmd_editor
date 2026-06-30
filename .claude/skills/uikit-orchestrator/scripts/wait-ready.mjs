#!/usr/bin/env node
// Block until a fresh UIKit export signal appears, then print its payload.
// Usage: node wait-ready.mjs [--baseline <runId>] [--timeout <seconds>] [--interval <seconds>]
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = process.env.DMD_OUTPUT_DIR || join(process.cwd(), "output");
const readyFile = join(outputDir, ".uikit-ready.json");

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const intervalMs = Number(arg("--interval", "2")) * 1000;
const timeoutMs = Number(arg("--timeout", "1800")) * 1000;

function read() {
  if (!existsSync(readyFile)) return null;
  try {
    return JSON.parse(readFileSync(readyFile, "utf8"));
  } catch {
    return null; // mid-write; try again next tick
  }
}

let baseline = arg("--baseline", null);
if (baseline === null) {
  const cur = read();
  baseline = cur?.runId ?? "absent";
}

const deadline = Date.now() + timeoutMs;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  while (Date.now() < deadline) {
    const cur = read();
    if (cur && cur.runId && cur.runId !== baseline) {
      console.log(JSON.stringify(cur, null, 2));
      process.exit(0);
    }
    await sleep(intervalMs);
  }
  console.error(JSON.stringify({ status: "timeout", waitedSeconds: timeoutMs / 1000, baseline }));
  process.exit(2);
})();
