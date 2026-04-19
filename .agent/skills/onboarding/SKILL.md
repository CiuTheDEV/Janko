---
name: onboarding
description: Use this skill when working on welcome/leave flows, onboarding graphics, onboarding configuration, or Canvas-based join/leave rendering in the Janko repository.
---

# Skill: Onboarding

## Goal

Keep the welcome and leave system aligned with configuration, assets, and image-generation utilities.

## When to use

- changing `guildMemberAdd` / `guildMemberRemove`,
- changing `onboardingService.js`,
- changing `ImageGenerator.js`,
- expanding message text or placeholders,
- debugging onboarding assets.

## Preconditions

Inspect:
- `src/modules/onboarding/events/*`
- `src/modules/onboarding/services/onboardingService.js`
- `src/modules/onboarding/utils/ImageGenerator.js`
- `assets/`
- `prisma/schema.prisma` for onboarding-related `GuildConfig` fields

## Current reality

The onboarding system currently supports:
- welcome messages,
- leave messages,
- `EMBED` mode,
- `TEXT` mode,
- optional Canvas graphics.

The repository does **not** currently contain a complete Human-First verification implementation, even if older documentation referenced it.

## Instructions

### 1. Text and placeholders
Current placeholders are parsed in `onboardingService.js`.  
When adding a placeholder:
- update the parser,
- update the text-editing UI if needed,
- update the documentation.

### 2. Graphics
`ImageGenerator.js` uses assets from `assets/` and fonts from `assets/fonts/`.  
When changing layout, verify:
- banner dimensions,
- fallback without background,
- fallback without a dedicated leave frame.

### 3. Configuration
Onboarding uses `GuildConfig`, so UI and logic changes must stay synchronized with config fields.

## Constraints

- do not describe human verification as implemented without code,
- do not introduce placeholders without updating the parser,
- do not break image dimensions or assets without confirming the generator still works.

## Verification

- test `guildMemberAdd`,
- test `guildMemberRemove`,
- test `EMBED`,
- test `TEXT`,
- test with images enabled and disabled,
- test `TEST JOIN` and `TEST LEAVE` buttons if the task touches them.

## Related docs

- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `.agent/skills/config/SKILL.md`
