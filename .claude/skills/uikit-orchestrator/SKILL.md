---
name: uikit-orchestrator
description: Launch the design-system dev server, guide the user through the wizard phases deterministically, detect the UIKit export signal, and stop the server.
version: 1.0.0
user-invocable: true
argument-hint: "[start|wait|stop|status|run]"
allowed-tools:
  - Bash(node .claude/skills/uikit-orchestrator/scripts/*)
  - Bash(npm run dev)
  - Read
---

Deterministic dev-server lifecycle + phase guidance + export detection.

## Setup
Read `reference/signal.md` (the `.uikit-ready.json` contract) and
`reference/phases.md` (per-phase checklists) before acting.

## Steps
1. **start** — `node .claude/skills/uikit-orchestrator/scripts/dev-server.mjs start`.
   It spawns `npm run dev` detached, writes a PID file, and prints the URL.
   Note the baseline runId it reports for `output/.uikit-ready.json` (or "absent").
2. **guide** — Walk the user through Brandbook → Design system → UIKit → Layouts →
   Export, one phase at a time, using the checklists in `reference/phases.md`.
   Confirm each phase is complete before advancing.
3. **wait** — `node .claude/skills/uikit-orchestrator/scripts/wait-ready.mjs --baseline <runId>`
   passing the baseline runId from step 1 (so an export that happens before this
   call is not missed). It blocks until the runId changes, then prints the payload
   JSON (tech, components, layouts, specPath, designPath).
4. **stop** — `node .claude/skills/uikit-orchestrator/scripts/dev-server.mjs stop`.
   Confirm the process is gone (run `status`) and the port is free.

`run` does start → (you guide) → wait → stop in sequence.

## Failure handling
- **Port in use** — `status` reports it; offer to `stop` the stale server.
- **Stale PID file** — `status` reconciles (clears it if the process is dead).
- **wait timeout** — tell the user the export was not detected; do NOT proceed to
  build. Common cause: the user didn't click "Validate & generate UIKit spec", or
  validation errored (no spec is written on validation failure).

## Checklist
- [ ] Server started; URL printed; baseline runId captured.
- [ ] User guided through all five phases with explicit confirmation.
- [ ] Signal detected (runId changed); payload read.
- [ ] Server stopped; port confirmed free.
