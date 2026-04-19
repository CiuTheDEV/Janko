---
description: feature
---

# Workflow: feature

## Recommended skill chain

1. `change-classifier`
2. `repo-truth-check`
3. `docs-code-boundary`
4. `planning-standard`
5. relevant domain skill
6. `interaction-safety` when UI or interactions are involved
7. `module-contract-audit` when domain structure changes
8. `preflight-verification`
9. `closeout-report`

## Steps

1. Establish the feature scope.
2. Create a formal plan unless the change is truly small.
3. Identify the domain, data models, and interaction surfaces.
4. Update context documentation before or alongside code.
5. Implement changes in:
   - services,
   - commands,
   - components,
   - events,
   - data schema when required.
6. Run validation.
7. Realign project memory after implementation.

## Result

After the feature is complete, it should be clear:
- where the logic lives,
- which files own the feature,
- how it is tested,
- whether repository state was documented correctly.