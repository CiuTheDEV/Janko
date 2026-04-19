# Skills — index

This directory contains on-demand skills for agents working in the Janko repository.

## How to use skills

- do not load every skill at once,
- start with `change-classifier`,
- use `repo-truth-check` before making implementation claims,
- use `docs-code-boundary` when task scope may be docs-only or mixed,
- use `planning-standard` for non-trivial work,
- then load the relevant domain or safety skill.

## Core execution skills

- `change-classifier` — classify the task and decide planning depth
- `docs-code-boundary` — enforce docs-only / code-only / mixed / audit-only scope
- `repo-truth-check` — verify claims against the real repository
- `preflight-verification` — define and report the minimum validation set
- `closeout-report` — summarize changed files, unresolved issues, and follow-ups
- `module-contract-audit` — verify new or changed module structure
- `interaction-safety` — protect Discord interaction flows and routed components
- `planning-standard` — produce implementation plans for non-trivial tasks

## Domain skills

- `config` — guild configuration dashboard
- `database-management` — Prisma schema and DB-backed features
- `moderation` — punishments and moderation logging
- `onboarding` — join/leave flows and onboarding graphics
- `utility-herold` — reminders
- `utility-voice` — auto-voice

## Critical rule

A skill must describe:
- real files,
- real constraints,
- real working patterns.

Skills must not be used as a place for future-module fantasy.
