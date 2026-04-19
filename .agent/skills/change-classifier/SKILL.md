---
name: change-classifier
description: Use this skill at the start of a task to classify the requested work as docs-only, code-only, mixed, audit-only, trivial fix, bugfix, feature, refactor, migration, or architecture change in the Janko repository, and to decide whether formal planning is required.
---

# Skill: Change Classifier

## Goal

Classify the task correctly before work starts so the agent chooses the right workflow, planning depth, and enforcement skills.

## When to use

Use this skill at the beginning of almost every task, especially when the request may involve:
- documentation only,
- code plus documentation,
- audits,
- multi-file changes,
- architecture or schema updates.

## Preconditions

Inspect:
- the user request,
- `AGENTS.md`,
- `.agent/rules/implementation_protocol.md`.

## Instructions

Classify the task in two layers.

### Layer 1 — scope mode
Choose exactly one:
- **docs-only**
- **code-only**
- **mixed**
- **audit-only**

### Layer 2 — change type
Choose the best match:
- **trivial fix**
- **docs update**
- **bugfix**
- **feature**
- **refactor**
- **migration**
- **audit**
- **architecture change**

Then decide:
- whether `planning-standard` is required,
- whether `repo-truth-check` is mandatory,
- whether `docs-code-boundary` is mandatory,
- whether `interaction-safety` or `module-contract-audit` is required.

## Constraints

- do not treat a multi-file task as a trivial fix,
- do not skip docs classification when `.md` files are involved,
- do not assume a task is code-only if the user explicitly asked for documentation changes,
- do not skip planning for migrations, architecture changes, or complex refactors.

## Verification

Before continuing, make sure the classification answers:
- what files may be touched,
- whether code is allowed to change,
- whether a plan is required,
- what the validation surface will be.

## Related docs

- `AGENTS.md`
- `.agent/rules/implementation_protocol.md`
- `.agent/skills/docs-code-boundary/SKILL.md`
- `.agent/skills/planning-standard/SKILL.md`
