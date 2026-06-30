# Importing the produced DESIGN.md into the workflow

The produced file must land where the app's workflow picks it up.

## Option A — write to the output dir (always works)
Write the validated document to `output/DESIGN.md` (`DMD_OUTPUT_DIR` or
`<cwd>/output`). This is the canonical artifact the rest of the pipeline reads.

## Option B — load into the running app
If the dev server is running, the user can import it through the UI:
- Open the **Import DESIGN.md** dialog and paste the file, or
- If the load route is available, choose **"Import from generated output/DESIGN.md"**
  (`GET /api/design/load` returns the current `output/DESIGN.md`).

The app **merges**: only token groups/values present in the file overwrite the
current document, so partial imports are safe.

## Validation bridge (optional)
If the dev server is up, you can POST a partial token JSON to
`POST /api/design/from-tokens` to get back a guaranteed-valid serialized DESIGN.md
to write out.

## Checklist
- [ ] `output/DESIGN.md` written and lint-clean.
- [ ] User told how to import (UI dialog or load route).
- [ ] Handoff: suggest continuing with the `uikit-studio` agent.
