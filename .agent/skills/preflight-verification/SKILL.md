---
name: preflight-verification
description: Use this skill before finalizing a task in the Janko repository to define the minimum validation set, report what was actually checked, and state what could not be verified in the current environment.
---

# Skill: Preflight Verification

## Goal

Make final answers evidence-aware by requiring an explicit validation pass before completion.

## When to use

Use this skill before finalizing:
- code changes,
- documentation restructures,
- audits,
- schema changes,
- interaction-flow changes.

## Preconditions

Inspect:
- the changed files,
- the task classification,
- the relevant workflow,
- repository scripts in `package.json`.

## Instructions

Define the minimum verification set based on scope.

### For docs-only tasks
Verify:
- paths exist,
- status claims match the repo,
- no forbidden code edits were made,
- language and ownership are correct.

### For code tasks
Consider:
- `npm run check`
- `npm run check:prisma`
- manual Discord interaction checks
- targeted module validation
- schema and service consistency

### For audits
Verify:
- findings are tied to specific files,
- unresolved issues are clearly separated from fixed issues.

Always report:
- what was checked,
- what passed,
- what was not run,
- why something could not be verified.

## Constraints

- do not imply validation happened if it did not,
- do not skip verification language just because the task was only documentation,
- do not hide environment limitations.

## Verification

The skill itself is complete when the final output clearly states:
- checks performed,
- checks not performed,
- residual uncertainty.

## Related docs

- `package.json`
- `.agent/rules/implementation_protocol.md`
- `.agent/skills/closeout-report/SKILL.md`
