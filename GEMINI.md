# GEMINI.md — quick bootstrap for the Janko repository

Use this file as the fast startup note for agent work.

## Read order

1. `AGENTS.md`
2. `.agent/memory/current_state.md`
3. `.agent/memory/domain_map.md`
4. `.agent/rules/implementation_protocol.md`
5. `.agent/rules/documentation_governance.md`
6. the relevant skill in `.agent/skills/`
7. the relevant workflow in `.agent/workflows/`

## Mandatory task gates

- Start with `change-classifier`.
- Use `repo-truth-check` before audits, documentation edits, architecture notes, or status claims.
- Use `docs-code-boundary` whenever the task may be docs-only or mixed.
- Use `planning-standard` for any non-trivial feature, refactor, migration, architecture change, or multi-file fix.
- Use `preflight-verification` before finalizing.
- Use `closeout-report` after non-trivial work.

## Documentation rule

Agent-facing documentation in this repository must be in **English**.

If you discover a code issue during a docs-only task:
- do not patch code,
- write the issue to `docs/CODE_ISSUES_TO_FIX.md`.

## Current reality reminder

- `current_state.md` is the live implementation snapshot.
- `ROADMAP.md` is not a source of truth for what is already shipped.
- `artifacts/*.md` are historical and must not be treated as live implementation status.
