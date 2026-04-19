# Janko

Janko is a modular Discord bot organized in a **Domain-First** architecture.

This repository is designed to support both:
- normal engineering work on the bot itself,
- agent-assisted execution through a structured `.agent/` layer.

## What exists in the repository today

### Core
The technical core lives in `src/core/` and currently includes:
- module discovery,
- module loading and contract validation,
- command deployment,
- shared UI helpers,
- a Prisma database wrapper.

### Domain modules
The business logic lives in `src/modules/`:
- `config` — guild configuration and `/config`
- `moderation` — moderation commands, infractions, and message-log fragments
- `onboarding` — join/leave flows and image generation
- `system` — technical slash commands
- `utility` — reminders and auto-voice

### Data model
Prisma schema:
- `GuildConfig`
- `UserInfraction`
- `Reminder`
- `UserVoiceSettings`

## Repository structure

```text
.
├── .agent/
│   ├── memory/
│   ├── rules/
│   ├── skills/
│   └── workflows/
├── docs/
├── artifacts/
├── prisma/
├── src/
│   ├── core/
│   └── modules/
├── AGENTS.md
├── GEMINI.md
├── README.md
└── ROADMAP.md
```

## Scripts

- `npm run dev` — start the bot
- `npm run deploy` — deploy slash commands
- `npm run validate` — validate module contracts
- `npm run check` — JS syntax check + module validation
- `npm run check:prisma` — Prisma schema validation
- `npm run check:full` — combined repository check
- `npm run db:push` — push Prisma schema
- `npm run db:studio` — open Prisma Studio

## Documentation hierarchy

Use these files in this order:

1. `src/` and `prisma/schema.prisma`
2. `.agent/memory/current_state.md`
3. `.agent/memory/domain_map.md`
4. `docs/CODE_ISSUES_TO_FIX.md`
5. `ROADMAP.md`
6. `artifacts/*.md`

### Important
- `README.md` is a technical repository overview.
- `current_state.md` is the live implementation snapshot.
- `ROADMAP.md` is the development plan.
- `artifacts/*.md` are historical materials, not live truth.

## Documentation and code boundary

This repository explicitly distinguishes:
- docs-only work,
- code-only work,
- mixed work,
- audit-only work.

When a task is docs-only, code issues must be reported in:
- `docs/CODE_ISSUES_TO_FIX.md`

They must **not** be silently fixed unless the task scope explicitly includes code changes.

## Agent layer

The `.agent/` folder contains:
- memory files describing the current repo,
- always-active rules,
- on-demand skills,
- compact workflows.

The expected execution pattern is:
1. classify the task,
2. verify the real repo state,
3. enforce the docs/code boundary,
4. plan if necessary,
5. use a domain skill,
6. verify before finalizing,
7. produce a closeout report for non-trivial work.

## Current priority areas

The main near-term priorities are:
- finish incomplete `/config` surfaces,
- improve consistency between documentation and code,
- continue expanding moderation observability,
- keep reminders and auto-voice polished rather than adding random modules.

See `ROADMAP.md` for sequencing.
