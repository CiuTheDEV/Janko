---
name: planning-standard
description: Use this skill when the task requires creating or updating an implementation_plan.md for any non-trivial feature, refactor, integration, migration, architecture change, documentation governance update, or multi-file fix in the Janko bot repository. Produces a docs-first implementation plan with task classification, affected modules, skill usage, dependencies, risks, verification steps, explicit review questions, and a mandatory full end-of-plan test scope.
---

# Skill: Implementation Planning Standard

## Goal

Create a high-quality `implementation_plan.md` that follows the Janko execution protocol, enforces Docs-First work, and is specific enough that another agent can implement the change without guessing.

## When to use

Use this skill whenever the task is larger than a trivial fix, especially when it involves one or more of the following:
- a new feature,
- a refactor touching multiple files or modules,
- a Discord interaction or event-flow change,
- a database or persistence change,
- a dashboard, admin panel, or configuration UI change,
- a migration, integration, or architectural adjustment,
- creation or rewrite of rules, workflows, or skills,
- substantial documentation restructuring.

Do **not** use this skill for:
- typo fixes,
- single-line cosmetic edits,
- trivial comment-only changes,
- tiny isolated fixes that do not need a formal plan.

## Preconditions

Before writing the plan:
1. Read `AGENTS.md`.
2. Read `.agent/memory/current_state.md`.
3. Read `.agent/memory/domain_map.md`.
4. Read `.agent/rules/implementation_protocol.md`.
5. Read `.agent/rules/documentation_governance.md` when the task touches documentation.
6. Run the mental classification enforced by `change-classifier`.
7. Determine whether `docs-code-boundary` is required.
8. Identify impacted files, modules, integrations, and execution surfaces.
9. Identify unknowns, assumptions, and architect decisions that need confirmation.

If a referenced document does not exist, state that explicitly instead of guessing.

## Output requirement

The output must be a complete `implementation_plan.md`.
It must be concrete, operational, and structured so that an implementation agent can execute it directly.
It must always end with a **full testing scope** section that gives the implementer a complete list of validations to perform after the change.

## Mandatory structure of `implementation_plan.md`

### 1. Context & Goal
Explain:
- what is being changed,
- why it matters,
- what repository area owns the change,
- whether the task is docs-only, code-only, mixed, or audit-only.

### 2. Change Classification (MANDATORY)
State the classification selected through `change-classifier`, for example:
- trivial fix,
- docs update,
- bugfix,
- feature,
- refactor,
- migration,
- audit,
- architecture change.

Include whether formal planning is required and why.

### 3. Source of Truth Check (MANDATORY)
List the files used to confirm the current reality, for example:
- `src/...`
- `prisma/schema.prisma`
- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `docs/CODE_ISSUES_TO_FIX.md`

Explicitly separate:
- implemented,
- partial,
- planned,
- historical.

### 4. Skill Stack (MANDATORY)
List the skills that will be used or created.

Include both:
- **Reference** — existing skills that must be used,
- **Creation** — new skills that must be added if part of the task.

Example:
- `change-classifier`
- `repo-truth-check`
- `docs-code-boundary`
- `planning-standard`
- `interaction-safety`

### 5. Documentation Phase (Docs-First)
List the documents to update **before or alongside code**.
Consider:
- `README.md`
- `AGENTS.md`
- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `.agent/rules/documentation_governance.md`
- `ROADMAP.md`
- `docs/CODE_ISSUES_TO_FIX.md`

For docs-only tasks, state explicitly that source code must remain unchanged.

### 6. Technical Implementation Steps
Group work logically by surface. Use only relevant sections.

Typical sections:
- **Core / Infrastructure**
- **Database**
- **Logic / Services**
- **Commands / Interactions / Events**
- **Dashboard / UI**
- **Documentation / Agent Layer**

Each section should name likely files and expected responsibilities.

### 7. Risks, Constraints, and Rollback
Include:
- main risks,
- repository constraints,
- rollback or recovery notes when applicable.

### 8. Verification Plan
Describe exactly how the result will be validated.
Include:
- commands to run,
- manual flows to test,
- docs checks,
- what cannot be verified in the current environment.

### 9. Open Questions / User Review REQUIRED
End with clear architect questions using GitHub-style alerts such as:
- `[!IMPORTANT]`
- `[!NOTE]`

These should highlight:
- unresolved decisions,
- assumptions,
- places where code and documentation disagree.

### 10. Closeout Expectations
State what must be reported after implementation:
- changed files,
- unresolved issues,
- docs updated,
- follow-up recommendations.

### 11. Full Test Scope (MANDATORY FINAL SECTION)
This section must always be the **last section of the plan**.
It must give the implementer a complete end-to-end testing scope for the planned change, not just a few examples.

It must include all relevant categories below, even if some are marked as not applicable:
- **Automated checks** — lint, type checks, build, syntax, test commands, validation scripts.
- **Targeted functional checks** — exact commands, handlers, services, or flows directly touched by the change.
- **Regression scope** — adjacent areas that could break because of shared files, shared services, routing, UI templates, shared config, or persistence.
- **Manual Discord / dashboard / interaction flows** — concrete click paths, commands, button paths, modal paths, role checks, and return navigation checks.
- **Documentation validation** — verify that docs match actual repository reality and that changed docs are linked consistently.
- **Boundary / failure cases** — invalid input, missing config, missing permissions, disabled features, empty state, duplicate action, stale state, retry, and fallback behavior.
- **Environment limitations** — explicitly state what cannot be tested in the current environment and what must be tested locally or in staging.
- **Post-change signoff checklist** — the exact minimum checklist that must be completed before the task is considered done.

The section must be written as a complete execution-ready checklist.
Do not allow the final testing scope to be vague, partial, or implied.

## Constraints

- Do not describe planned modules as implemented.
- Do not skip `docs-code-boundary` when documentation scope matters.
- Do not omit verification just because the task is “only docs”.
- Do not write generic implementation steps with no file ownership.
- Do not use the plan as a place for vague brainstorming.
- Do not skip open questions when assumptions still exist.
- Do not end the plan without the `Full Test Scope` section.
- Do not provide only a narrow test list for the touched files; include regression and boundary scope as well.

## Quality bar

A valid plan should make it obvious:
- what the task actually is,
- what is already true in the repository,
- which skills govern execution,
- what files will be touched,
- how success will be verified,
- what still needs human confirmation,
- what the complete test surface is before the work begins.

## Related docs

- `AGENTS.md`
- `.agent/rules/implementation_protocol.md`
- `.agent/rules/documentation_governance.md`
- `.agent/skills/change-classifier/SKILL.md`
- `.agent/skills/repo-truth-check/SKILL.md`
- `.agent/skills/docs-code-boundary/SKILL.md`
- `.agent/skills/preflight-verification/SKILL.md`
- `.agent/skills/closeout-report/SKILL.md`
