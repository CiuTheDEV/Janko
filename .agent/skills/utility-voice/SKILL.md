---
name: utility-voice
description: Use this skill when working on auto-voice join-to-create channels, Auto-Voice config fields, temp-channel cleanup, or UserVoiceSettings persistence in the Janko repository.
---

# Skill: Utility — Auto-Voice

## Goal

Keep the join-to-create system and the owner panel aligned across the event flow, the service layer, and persisted settings.

## When to use

- changing `voiceStateUpdate`,
- changing `autoVoiceService.js`,
- changing `autoVoiceHandler.js`,
- changing Auto-Voice fields in `GuildConfig`,
- changing `UserVoiceSettings`.

## Preconditions

Inspect:
- `src/modules/utility/events/voiceStateUpdate.js`
- `src/modules/utility/services/autoVoiceService.js`
- `src/modules/utility/components/autoVoiceHandler.js`
- `prisma/schema.prisma`
- `src/modules/config/components/dashboardHandler.js`

## Current reality

The system currently supports:
- a generator channel,
- temporary channel creation,
- moving the user,
- an owner panel with actions,
- persisted preferences in `UserVoiceSettings`,
- cleanup of empty channels after a short delay.

## Instructions

### 1. Channel lifecycle
- the user joins the generator channel,
- the bot creates a temporary voice channel,
- the bot moves the user,
- the bot sends the management panel,
- the empty channel is later removed.

### 2. Persistence
If preference storage changes:
- inspect `UserVoiceSettings`,
- inspect how those settings are read during channel creation,
- inspect whether the config dashboard still sets the correct generator and category fields.

### 3. Handlers
Buttons use dynamic prefixes in the `av_*_<userId>` style.  
Do not let the panel payload drift away from what the handler resolves.

## Constraints

- do not describe text-channel cleanup as implemented unless the code exists,
- do not add persistence fields without updating both schema and config,
- do not confuse the generator channel with temporary channels in documentation.

## Verification

- join the generator channel,
- create a room,
- test `lock` / `unlock`,
- test name changes,
- test the user-limit flow,
- test `save`,
- empty the room and verify auto-cleanup.

## Related docs

- `.agent/memory/current_state.md`
- `.agent/skills/config/SKILL.md`
- `.agent/rules/db_governance.md`
- `docs/CODE_ISSUES_TO_FIX.md`
- `.agent/skills/interaction-safety/SKILL.md`
