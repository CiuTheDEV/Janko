---
name: closeout-report
description: Use this skill after a non-trivial task in the Janko repository to produce a clear closeout: changed files, documentation updates, unresolved issues, verification status, and recommended next steps.
---

# Skill: Closeout Report

## Goal

End tasks with a reliable handoff instead of an informal summary.

## When to use

Use this skill after:
- non-trivial documentation work,
- multi-file code changes,
- audits,
- schema changes,
- architecture work,
- new skill or workflow additions.

## Preconditions

Inspect:
- the changed files,
- the task classification,
- the verification results,
- `docs/CODE_ISSUES_TO_FIX.md` if unresolved issues exist.

## Instructions

The closeout should state:
1. what changed,
2. which files were updated,
3. what was intentionally left unchanged,
4. what was verified,
5. what was not verified,
6. unresolved issues,
7. recommended follow-up.

When relevant, note whether these were updated:
- `README.md`
- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- relevant skills or workflows
- `ROADMAP.md`
- `docs/CODE_ISSUES_TO_FIX.md`

## Constraints

- do not claim “done” without naming the remaining uncertainty,
- do not omit issue logging when debt remains,
- do not hide that a task was docs-only, code-only, mixed, or audit-only.

## Verification

The closeout is valid when another agent can understand:
- what changed,
- what still needs work,
- what evidence supports the completion statement.

## Related docs

- `.agent/skills/preflight-verification/SKILL.md`
- `docs/CODE_ISSUES_TO_FIX.md`
- `.agent/memory/current_state.md`
