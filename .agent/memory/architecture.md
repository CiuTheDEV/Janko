# System Architecture — Janko

## 1. Purpose

Janko is built as a **modular Discord bot** with emphasis on:
- strong separation between business domains,
- low chaos in `index.js`,
- interactive UI where it improves administration,
- documentation that is readable for both humans and agents.

## 2. Current stack

- **Node.js** — CommonJS
- **discord.js** — 14.x
- **Prisma** — 6.19.3
- **MySQL / MariaDB**
- **dotenv**
- **@napi-rs/canvas** — onboarding images

## 3. Repository structure

### `src/core/`
Shared technical layer for the entire bot:
- `database.js`
- `discovery.js`
- `loader.js`
- `validate-modules.js`
- `deploy-commands.js`
- `styles.js`
- `templates.js`
- `uiEngine.js`

### `src/modules/`
Business domains:
- `config`
- `moderation`
- `onboarding`
- `system`
- `utility`

### `prisma/`
Data model and datasource configuration.

### `.agent/`
Agent-facing execution layer:
- project memory,
- rules,
- skills,
- workflows.

## 4. Key mechanisms

### Discovery
`src/core/discovery.js` scans `commands/`, `events/`, and `components/` for each domain.

### Loader
`src/core/loader.js` loads discovered modules into the Discord client and blocks startup when contracts are invalid or duplicates exist.

### Dynamic interaction routing
In `index.js`, a component can be resolved by:
- full `customId`,
- progressively shorter prefixes.

This supports patterns such as:
- `herold_time_123`
- `av_lock_<userId>`

without registering every variant separately.

### UI Engine
`uiEngine` works with:
- `styles.js` — visual tokens and icon helpers,
- `templates.js` — message templates.

The UI Engine exists and is used, but not every configuration screen is fully standardized to one rendering approach yet.

### Database wrapper
`src/core/database.js` is the single point for creating the Prisma Client instance.

Domain code should prefer:
- services,
- `client.db`,
- wrapper-based access

rather than creating new Prisma clients directly.

## 5. Current domains

- **Config** — guild settings and `/config`
- **Moderation** — punishments, infraction history, and moderation logs
- **Onboarding** — join/leave messages and image generation
- **System** — technical commands
- **Utility** — reminders and auto-voice

## 6. Critical documentation rule

Documentation must always distinguish:
- what already exists in code,
- what is planned,
- what is only a product preference.

Failing to separate these layers was a previous source of repository drift.
