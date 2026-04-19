---
description: docs-update
---

# Workflow: docs-update

## Recommended skill chain

1. `change-classifier`
2. `docs-code-boundary`
3. `repo-truth-check`
4. `preflight-verification`
5. `closeout-report`

## Steps

1. Classify the task as `docs-only` or `audit-only`.
2. Confirm that source files must remain unchanged.
3. Verify claims against:
   - `src/`
   - `prisma/schema.prisma`
   - `current_state.md`
   - `domain_map.md`
   - `docs/CODE_ISSUES_TO_FIX.md`
4. Update the owning documentation files.
5. If you discover code defects, add them to `docs/CODE_ISSUES_TO_FIX.md`.
6. Explicitly state in the closeout that code was not modified.

## Result

After the workflow:
- documentation is corrected,
- code remains untouched,
- unresolved code problems are clearly logged.