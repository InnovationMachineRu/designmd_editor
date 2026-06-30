# The `.uikit-ready.json` signal contract

When the user clicks **"Validate & generate UIKit spec (ТЗ)"** on the Export step
(and validation passes), the app writes two files into the output directory
(`DMD_OUTPUT_DIR` or `<cwd>/output`):

- `UIKIT-SPEC.md` — the UIKit ТЗ (a valid DESIGN.md).
- `.uikit-ready.json` — the completion sentinel, written atomically.

## Sentinel shape
```json
{
  "version": 1,
  "runId": "uuid-v4",
  "timestamp": "ISO-8601",
  "tech": "react",
  "components": ["button", "card", "..."],
  "layouts": ["dashboard", "..."],
  "specPath": "/abs/path/output/UIKIT-SPEC.md",
  "designPath": "/abs/path/output/DESIGN.md"
}
```

## Detection rule (deterministic)
- Capture the baseline `runId` at start (it may not exist yet → "absent").
- A **new or changed `runId`** is the only valid "requirements received" event.
  This distinguishes a real export from an editorial re-save and carries the exact
  tech/components/layouts to build.
- The file is written `.tmp` → `rename`, so it is never read half-written.
- The orchestrator leaves the file in place as the latest-export record; the
  `runId` comparison handles staleness on the next run.
