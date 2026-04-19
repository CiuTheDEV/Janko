---
name: moderation
description: Use this skill when working on moderation commands, UserInfraction logic, moderation notifications, or message-event logging in the Janko bot repository.
---

# Skill: Moderation

## Goal

Extend the moderation module without breaking infraction history, permissions, and event logging.

## When to use

- changing moderation commands,
- changing `ModerationService.js`,
- working on moderation logs,
- working on automatic punishment escalation,
- analyzing `messageDelete` and `messageUpdate` flows.

## Preconditions

Inspect:
- `src/modules/moderation/ModerationService.js`
- `src/modules/moderation/commands/*`
- `src/modules/moderation/events/*`
- `prisma/schema.prisma`
- `src/modules/config/services/configService.js`

## Current reality

The module currently includes:
- `ban`
- `kick`
- `timeout`
- `clear`
- `ostrzez`
- `ostrzezenia`
- `usun-ostrzezenie`

and writes to `UserInfraction`.

Part of the Watchtower idea currently exists only as a moderation extension, not as a standalone domain.

## Instructions

### 1. Commands
Every moderation command should:
- check permissions,
- go through `ModerationService`,
- log the result,
- avoid direct DB-write sprawl inside handlers.

### 2. DMs and logs
- DM behavior is configured through `notify*` fields in `GuildConfig`,
- actions like `BAN` and `KICK` should account for the user losing guild access immediately,
- DM delivery failures must not block the punishment action.

### 3. Infraction history
- persistence goes through `UserInfraction`,
- if punishment types change, synchronize `InfractionType` and documentation.

### 4. Watchtower fragments
If you edit message events, remember that they currently belong to the moderation surface.  
Do not document a separate complete Watchtower module unless the code actually exists.

## Constraints

- do not bypass `ModerationService`,
- do not describe `Undo` as implemented without code,
- do not mix future safety features with the current command set,
- do not expand infraction history without updating the data model.

## Verification

- test each changed moderation command on a test server,
- verify the `UserInfraction` record,
- verify the moderation log channel,
- verify DM behavior with notify flags enabled and disabled,
- test `messageDelete` and `messageUpdate` when event flows were changed.

## Related docs

- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `.agent/rules/db_governance.md`
- `docs/CODE_ISSUES_TO_FIX.md`
- `.agent/skills/repo-truth-check/SKILL.md`
