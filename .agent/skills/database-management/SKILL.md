---
name: database-management
description: Use this skill when changing Prisma schema, diagnosing database connection behavior, updating DB-backed features, or synchronizing documentation with actual models in the Janko repository.
---

# Skill: Database Management

## Goal

Change the data layer safely without drifting the schema, the DB wrapper, and the documentation out of sync.

## When to use

- modifying `prisma/schema.prisma`,
- diagnosing DB connection behavior,
- adding a new field or model used by a module,
- correcting documentation related to models or connection behavior.

## Preconditions

Inspect:
- `package.json`
- `prisma/schema.prisma`
- `src/core/database.js`
- `.agent/rules/db_governance.md`
- `docs/CODE_ISSUES_TO_FIX.md`

## Current models

The current schema contains:
- `GuildConfig`
- `UserInfraction`
- `Reminder`
- `UserVoiceSettings`

## Instructions

### 1. Changing the schema
1. Edit `prisma/schema.prisma`.
2. Verify naming and types.
3. Run `npm run check:prisma`.
4. Run `npm run db:push` when appropriate.
5. Update the documentation for modules that use the changed field.

### 2. Changing connection behavior
- remember that Prisma reads `env("DATABASE_URL")` in the schema,
- the wrapper in `src/core/database.js` can assemble a URL from separate environment variables,
- do not add parallel connection paths outside the wrapper without an explicit reason.

### 3. Changing data access logic
- keep query logic in domain services,
- do not scatter Prisma calls across slash commands and components.

## Constraints

- do not describe planned tables as existing,
- do not change the documented Prisma version without checking `package.json`,
- do not assume migration files exist if the repository currently uses `db push`,
- do not add models without updating domain documentation.

## Verification

- `npm run check:prisma`
- `npm run db:push`
- a functional test path that uses the changed field
- a documentation check to ensure the project memory still reflects the real models

## Related docs

- `.agent/rules/db_governance.md`
- `.agent/workflows/db-change.md`
- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
