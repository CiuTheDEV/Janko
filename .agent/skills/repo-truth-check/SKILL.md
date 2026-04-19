---
name: repo-truth-check
description: Use this skill before writing audits, status summaries, architecture notes, roadmap updates, or documentation that describes implementation state in the Janko repository. It forces the agent to verify claims against the actual code and schema before writing them down.
---

# Skill: Repo Truth Check

## Goal

Prevent documentation drift by forcing implementation claims to be checked against the real repository.

## When to use

Use this skill whenever the task involves:
- audits,
- current-state summaries,
- architecture notes,
- roadmap adjustments,
- skill updates,
- statements such as “implemented”, “exists”, “already works”, or “is complete”.

## Preconditions

Inspect the relevant combination of:
- `src/`
- `prisma/schema.prisma`
- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `docs/CODE_ISSUES_TO_FIX.md`
- `ROADMAP.md`
- `artifacts/*.md`

## Instructions

For every important claim, classify it as one of:
- **implemented**
- **partial**
- **planned**
- **historical**

When a document or note mentions a feature:
1. check whether the code exists,
2. check whether the schema supports it,
3. check whether the document is describing a plan instead of reality,
4. rewrite the statement with the correct status label.

## Constraints

- do not treat roadmap items as shipped,
- do not treat artifacts as live truth,
- do not describe a separate module if only fragments exist inside another module,
- do not leave ambiguous words like “done” or “supported” when the status is only partial.

## Verification

Before finalizing, confirm:
- every major status claim can be tied to actual files or schema,
- older documentation has not been copied forward blindly,
- planned and historical areas are explicitly labeled.

## Related docs

- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `ROADMAP.md`
- `docs/CODE_ISSUES_TO_FIX.md`
- `.agent/rules/documentation_governance.md`
