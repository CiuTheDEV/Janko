---
name: config
description: Use this skill when working on the guild configuration dashboard, GuildConfig fields, config interaction handlers, or debugging /config flows in the Janko bot repository.
---

# Skill: Config

## Goal

Maintain and extend the `/config` dashboard without drifting the data model, interaction handlers, and documentation out of sync.

## When to use

Use this skill when the task touches:
- `src/modules/config/commands/config.js`,
- `src/modules/config/components/dashboardHandler.js`,
- `src/modules/config/services/configService.js`,
- the `GuildConfig` model in `prisma/schema.prisma`,
- configuration flows for other modules routed through the dashboard.

## Preconditions

Before editing, inspect:
- `prisma/schema.prisma`
- `src/modules/config/commands/config.js`
- `src/modules/config/components/dashboardHandler.js`
- `src/modules/config/services/configService.js`
- `.agent/memory/current_state.md`
- `docs/CODE_ISSUES_TO_FIX.md`

## Current reality

The code currently contains these config views:
- `config_main`
- `config_channels`
- `config_notify`
- `config_onboarding`
- `config_utility`

The main screen also shows buttons for:
- `config_general`
- `config_roles`
- `config_health`

but not all of them have complete handler coverage. Do not describe them as finished without checking the code.

## Instructions

### 1. Changing a config field
1. Add or modify the field in `GuildConfig` if needed.
2. Synchronize the change in `configService`.
3. Add or correct the relevant view or handler in `dashboardHandler.js`.
4. Verify that the target domain actually reads the new field.

### 2. Adding a new dashboard view
- use a dedicated renderer or a clearly separated section in `dashboardHandler.js`,
- keep a return path to `config_main`,
- do not leave a visible button without a working handler.

### 3. Select menus and modals
- check `interaction.deferred` and `interaction.replied` before calling `deferUpdate()`,
- refresh the correct view after saving to DB,
- keep `customId` values consistent across buttons, modals, and handlers.

## Constraints

- do not add UI-only fields that are not represented in the service or DB when required,
- do not describe `/config` as complete while dead buttons remain,
- do not duplicate configuration-save logic outside `configService`,
- do not mix planned config surfaces with implemented ones.

## Verification

Manually check:
1. opening `/config`,
2. entering every view reachable from the main screen,
3. saving channels,
4. saving onboarding settings,
5. saving notification settings,
6. saving auto-voice settings,
7. returning to the main menu without interaction errors.

## Related docs

- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `.agent/rules/db_governance.md`
- `docs/CODE_ISSUES_TO_FIX.md`
- `.agent/skills/interaction-safety/SKILL.md`
