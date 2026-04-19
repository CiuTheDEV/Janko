---
description: audit
---

# Workflow: audit

## Recommended skill chain

1. `change-classifier`
2. `repo-truth-check`
3. `docs-code-boundary`
4. `preflight-verification`
5. `closeout-report`

## Goal

Check whether the repository is technically and documentationally consistent.

## Steps

1. Classify the task as `audit` and usually `audit-only` unless changes are explicitly allowed.
2. Run `npm run check` if the environment supports it.
3. Run `npm run check:prisma` if the task touches database reality.
4. Compare:
   - `README.md`
   - `AGENTS.md`
   - `.agent/memory/current_state.md`
   - `.agent/memory/domain_map.md`
   against the real structure in `src/` and `prisma/`.
5. Check whether documentation describes plans as implemented features.
6. Write unresolved code issues to `docs/CODE_ISSUES_TO_FIX.md`.
7. If a finding is architectural and accepted as a decision, consider `docs/decisions/`.

## Result

After the audit it should be clear:
- what is consistent,
- what is outdated,
- what requires code changes,
- what requires documentation-only correction.