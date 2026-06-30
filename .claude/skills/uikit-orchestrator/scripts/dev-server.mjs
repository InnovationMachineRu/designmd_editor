#!/usr/bin/env node
// Deterministic dev-server lifecycle for the orchestrator.
// Usage: node dev-server.mjs <start|stop|status>
import { spawn } from "node:child_process";
import { openSync, existsSync, readFileSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const outputDir = process.env.DMD_OUTPUT_DIR || join(process.cwd(), "output");
const pidFile = join(outputDir, ".dmd-dev.json");
const logFile = join(outputDir, ".dmd-dev.log");
const readyFile = join(outputDir, ".uikit-ready.json");
const port = process.env.PORT || "3000";

function ensureOutput() {
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readPidFile() {
  if (!existsSync(pidFile)) return null;
  try {
    return JSON.parse(readFileSync(pidFile, "utf8"));
  } catch {
    return null;
  }
}

function baselineRunId() {
  if (!existsSync(readyFile)) return "absent";
  try {
    return JSON.parse(readFileSync(readyFile, "utf8")).runId ?? "absent";
  } catch {
    return "absent";
  }
}

function start() {
  ensureOutput();
  const existing = readPidFile();
  if (existing && isAlive(existing.pid)) {
    console.log(JSON.stringify({ status: "already-running", ...existing, baselineRunId: baselineRunId() }));
    return;
  }
  const out = openSync(logFile, "a");
  const child = spawn("npm", ["run", "dev"], {
    cwd: process.cwd(),
    detached: true,
    stdio: ["ignore", out, out],
    env: { ...process.env, PORT: port },
  });
  child.unref();
  const info = { pid: child.pid, port: Number(port), startedAt: new Date().toISOString() };
  writeFileSync(pidFile, JSON.stringify(info, null, 2));
  console.log(
    JSON.stringify({
      status: "started",
      ...info,
      url: `http://localhost:${port}`,
      log: logFile,
      baselineRunId: baselineRunId(),
    })
  );
}

function stop() {
  const info = readPidFile();
  if (!info) {
    console.log(JSON.stringify({ status: "not-running" }));
    return;
  }
  try {
    // Kill the detached process group (negative pid).
    try {
      process.kill(-info.pid, "SIGTERM");
    } catch {
      process.kill(info.pid, "SIGTERM");
    }
  } catch {
    /* already gone */
  }
  rmSync(pidFile, { force: true });
  console.log(JSON.stringify({ status: "stopped", pid: info.pid }));
}

function status() {
  const info = readPidFile();
  if (!info) {
    console.log(JSON.stringify({ status: "not-running" }));
    return;
  }
  if (isAlive(info.pid)) {
    console.log(JSON.stringify({ status: "running", ...info, url: `http://localhost:${info.port}` }));
  } else {
    rmSync(pidFile, { force: true });
    console.log(JSON.stringify({ status: "stale-cleared", pid: info.pid }));
  }
}

const cmd = process.argv[2];
if (cmd === "start") start();
else if (cmd === "stop") stop();
else if (cmd === "status") status();
else {
  console.error("Usage: dev-server.mjs <start|stop|status>");
  process.exit(1);
}
