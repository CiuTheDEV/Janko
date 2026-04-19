---
name: docs-code-boundary
description: Use this skill when a task may be documentation-only, code-only, mixed, or audit-only in the Janko repository. It enforces whether source files may be edited and where unresolved code issues must be reported.
---

# Skill: Docs-Code Boundary

## Goal

Enforce the allowed modification surface so documentation tasks do not silently turn into code changes and mixed tasks stay explicit.

## When to use

Use this skill whenever:
- the request mentions documentation,
- the request forbids code changes,
- the task is an audit,
- the task may involve both docs and code.

## Preconditions

Inspect:
- the user request,
- `AGENTS.md`,
- `.agent/rules/documentation_governance.md`,
- `docs/CODE_ISSUES_TO_FIX.md`.

## Instructions

Decide the allowed scope:

### 1. Docs-only
Allowed:
- `.md`
- documentation structure
- issue reporting in `docs/CODE_ISSUES_TO_FIX.md`

Not allowed:
- `.js`
- `.prisma`
- runtime config files

### 2. Code-only
Allowed:
- source files and runtime-related changes

Required:
- update docs if implementation status changes

### 3. Mixed
Allowed:
- both code and docs

Required:
- keep docs synchronized with the actual code change

### 4. Audit-only
Allowed:
- reports, findings, issue logging

Not allowed:
- silent implementation changes

## Constraints

- do not patch code during a docs-only task,
- do not leave discovered code defects undocumented,
- do not claim “docs-only” while modifying runtime behavior,
- do not skip issue logging for unresolved defects.

## Verification

Before finalizing, confirm:
- whether code was changed,
- whether that matched the classified scope,
- whether unresolved code issues were written to `docs/CODE_ISSUES_TO_FIX.md`,
- whether the final summary states the boundary correctly.

## Related docs

- `AGENTS.md`
- `.agent/rules/documentation_governance.md`
- `docs/CODE_ISSUES_TO_FIX.md`
