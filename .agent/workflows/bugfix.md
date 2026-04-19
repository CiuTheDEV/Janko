---
description: Workflow: bugfix
---

# Workflow: bugfix

## Recommended skill chain

1. `change-classifier`
2. `docs-code-boundary`
3. `repo-truth-check` when status claims are involved
4. `planning-standard` when the bug is non-trivial
5. relevant domain skill
6. `preflight-verification`
7. `closeout-report`

## Steps

1. Reproduce the problem or establish it statically from code.
2. Identify the owner surface:
   - `src/core/`
   - a domain in `src/modules/`
   - `prisma/schema.prisma`
   - `.md` documentation
3. If the bug is non-trivial, create a plan through `planning-standard`.
4. Apply the fix within the allowed scope.
5. Run the relevant validation.
6. Update:
   - `current_state.md` if implementation status changed,
   - `domain_map.md` if domain boundaries changed,
   - `docs/CODE_ISSUES_TO_FIX.md` if more unresolved problems were discovered.

## Note

If the task is **documentation-only**, do not “fix code on the side”.  
Record the code problem in `docs/CODE_ISSUES_TO_FIX.md`.