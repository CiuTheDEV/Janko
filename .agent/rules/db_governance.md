# DB Governance Policy — Janko

This document defines the database working rules for the Janko repository.

## 1. Version and engine

- the repository uses **Prisma 6.19.3**,
- do not assume Prisma 7 without an explicit decision and validation,
- prefer the native Prisma engine rather than JS adapter experiments.

## 2. Source of connection configuration

The current repository supports two practical variants:

1. `DATABASE_URL` passed directly to Prisma,
2. fallback URL assembly in `src/core/database.js` from:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

If the password contains special characters, it should be encoded with `encodeURIComponent()`.

## 3. Data access rule

- do not create new Prisma clients inside commands or components,
- use the wrapper in `src/core/database.js`,
- keep database logic in domain services, not in UI handlers.

## 4. Current models in `schema.prisma`

- `GuildConfig`
- `UserInfraction`
- `Reminder`
- `UserVoiceSettings`

Any change to one of these models requires synchronization across:
- code,
- documentation,
- the DB workflow.

## 5. Indexes and practical defaults

If you add a Discord-related model, normally consider indexes for fields such as:
- `guildId`
- `userId`
- fields used in `where`
- fields used in `orderBy`

## 6. Schema change workflow

1. change `prisma/schema.prisma`,
2. run `npm run check:prisma`,
3. run `npm run db:push` if appropriate,
4. make sure the Prisma client is up to date,
5. update module docs and issue reports if new risks were discovered.

## 7. Documentation constraint

Do not describe planned tables or models as existing if they are not present in `schema.prisma`.
