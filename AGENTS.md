# AGENTS.md — operational context for the Janko repository

This file is the main operating entry point for AI agents working in the Janko repository.

## 1. Project goal

Janko is a modular Discord bot built in a **Domain-First** style.

The main priorities are:
- keep business domains separate from the technical core,
- prefer interactive UI over command sprawl when it improves UX,
- keep documentation aligned with the actual codebase,
- make agent work reproducible through rules, skills, and workflows.

## 2. Mandatory execution gates

Before starting non-trivial work, use the following gates in order:

1. **`change-classifier`** — classify the task type and decide whether planning is required.
2. **`repo-truth-check`** — verify what is actually implemented before making claims.
3. **`docs-code-boundary`** — decide whether the task is docs-only, code-only, mixed, or audit-only.
4. **`planning-standard`** — required for non-trivial changes, multi-file work, or architectural updates.
5. **Relevant domain skill** — for example `config`, `moderation`, `onboarding`, `utility-herold`, `utility-voice`, or `database-management`.
6. **`interaction-safety`** — required whenever commands, buttons, modals, select menus, or routed interactions are changed.
7. **`module-contract-audit`** — required when creating or significantly reshaping a module.
8. **`preflight-verification`** — define and report the minimum validation set before finalizing.
9. **`closeout-report`** — required after any non-trivial task to summarize changes, unresolved issues, and documentation impact.

For docs-only tasks, `docs-code-boundary` and `repo-truth-check` are not optional.

## 3. Truth hierarchy

If documents disagree, use this order of authority:

1. **Source code** in `src/` and `prisma/`
2. `.agent/memory/current_state.md`
3. `.agent/memory/domain_map.md`
4. `docs/CODE_ISSUES_TO_FIX.md`
5. `ROADMAP.md`
6. `artifacts/*.md` as historical notes only

Do not describe a feature as implemented only because it appears in the roadmap, preferences, or a historical artifact.

## 4. Language standard

All **agent-facing documentation** must be written in **English**:
- `AGENTS.md`
- `GEMINI.md`
- `.agent/**`
- `docs/**` used for execution, audits, or technical guidance

Polish may be used only in clearly user-owned notes or product brainstorming that are not intended to guide agents.

## 5. Documentation discipline

Always keep these layers separate:

- **Current state** — what exists in code now
- **Issues to fix** — known debt or defects not fixed in the current session
- **Roadmap** — planned work
- **Preferences** — owner priorities and product direction
- **Artifacts** — historical notes

If a docs-only session discovers code defects, do **not** patch code opportunistically.
Record the issue in `docs/CODE_ISSUES_TO_FIX.md`.

For all new documentation, follow:
- `.agent/rules/documentation_governance.md`
- `.agent/rules/implementation_protocol.md`

## 6. Repository map

### Technical core
- `index.js`
- `src/core/`

### Domain modules
- `src/modules/config/`
- `src/modules/moderation/`
- `src/modules/onboarding/`
- `src/modules/system/`
- `src/modules/utility/`

### Data model
- `prisma/schema.prisma`

### Agent layer
- `.agent/memory/`
- `.agent/rules/`
- `.agent/skills/`
- `.agent/workflows/`

### Reports and historical materials
- `docs/`
- `artifacts/`

## 7. Working rules

- Do not guess implementation status.
- Do not invent modules, tables, handlers, or validation coverage.
- Do not mix roadmap language into current-state documents.
- Do not leave buttons, views, or workflows described as complete if handlers are missing.
- Do not change documentation language back to Polish in agent-facing files.

## 8. First files to read

For most tasks, start with:
1. `README.md`
2. `GEMINI.md`
3. `.agent/memory/current_state.md`
4. `.agent/memory/domain_map.md`
5. `.agent/rules/implementation_protocol.md`
6. `.agent/rules/documentation_governance.md`

Then load the relevant skill and workflow for the task.
