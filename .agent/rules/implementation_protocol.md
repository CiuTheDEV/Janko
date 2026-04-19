# Implementation Protocol — Janko

This document defines the default execution protocol for work in the Janko repository.

## 1. Primary rule

Establish the **actual code state first**, then:
- plan,
- describe,
- change,
- update project memory.

## 2. Mandatory execution sequence

For any non-trivial task, use this order:

1. `change-classifier`
2. `repo-truth-check` when status claims, docs, audits, or architecture are involved
3. `docs-code-boundary` when the task might be docs-only, mixed, or audit-only
4. `planning-standard` for non-trivial work
5. relevant domain skill(s)
6. `interaction-safety` when routed interactions or UI are involved
7. `module-contract-audit` when creating or reshaping modules
8. `preflight-verification`
9. **Manual Testing Checklist** — provide a clear list of steps for the User to verify the changes manually.
10. `closeout-report`

## 3. Standard work cycle

### A. Research
- inspect the file structure,
- inspect the relevant module(s) in `src/`,
- inspect `prisma/schema.prisma` if data is involved,
- inspect existing skills and workflows,
- confirm the docs/code boundary before touching files.

### B. Docs-First
For larger tasks:
- use `planning-standard`,
- update context documents before or alongside code,
- record assumptions and open questions explicitly.

### C. Implementation
- put code in the correct domain,
- avoid dumping business logic into `index.js`,
- do not bypass service layers for data operations,
- keep interaction surfaces consistent with handlers and routing.

### D. Reflect
After finishing, check whether you must update:
- `README.md`
- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- the relevant `SKILL.md`
- `ROADMAP.md`
- `docs/CODE_ISSUES_TO_FIX.md` if an issue was found but not fixed

## 4. Domain-First rules

- business modules live in `src/modules/<domain>/`,
- shared technical logic belongs in `src/core/`,
- a new table or data model must have a documentation counterpart.

## 5. Skill rules

Every meaningful skill should include:
- `name`
- `description`
- **Goal**
- **When to use**
- **Preconditions**
- **Instructions**
- **Constraints**
- **Verification**
- **Related docs**

A skill must not describe planned features as completed.

## 6. Anti-hallucination rule

If you are not sure:
- check the code,
- check dependencies,
- check actual file paths.

Do not guess library versions, module existence, or feature completeness.

## 7. Documentation rule

Always separate:
- **current state**
- **issues to fix**
- **roadmap**
- **owner preferences**
- **historical artifacts**

Do not mix these layers in one file without explicit labels.

All agent-facing documentation must be in **English**.

For all new documentation, follow:
- `.agent/rules/documentation_governance.md`

## 8. Problems and decisions

- code problems discovered but not fixed in the current session must be written to `docs/CODE_ISSUES_TO_FIX.md`,
- accepted architectural decisions may be documented in `docs/decisions/`.
