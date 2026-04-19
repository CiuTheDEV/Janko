---
name: interaction-safety
description: Use this skill when changing Discord commands, buttons, modals, select menus, dashboard views, routed customId handlers, or event-driven interaction flows in the Janko repository. It protects against dead buttons, reply/defer mistakes, and routing drift.
---

# Skill: Interaction Safety

## Goal

Keep Discord interaction flows safe, complete, and internally consistent.

## When to use

Use this skill when the task changes:
- slash commands,
- buttons,
- modals,
- select menus,
- dashboard views,
- routed `customId` handlers,
- interaction-related events.

## Preconditions

Inspect:
- the command or component file,
- the corresponding service,
- the main router in `index.js` when relevant,
- `.agent/memory/current_state.md`,
- `docs/CODE_ISSUES_TO_FIX.md`.

## Instructions

Check the flow for these risks:

### 1. Routing consistency
- does the emitted `customId` match what the handler resolves?
- if dynamic prefixes are used, does the fallback routing still work?
- are view names and return paths consistent?

### 2. Interaction lifecycle
- does each path reply exactly once or defer safely?
- is `interaction.deferred` / `interaction.replied` respected before calling follow-up methods?
- can a modal or select submission refresh the correct screen?

### 3. UI completeness
- are there visible buttons with no handler?
- can the user return to the main dashboard?
- does the changed surface have an error-safe path?

### 4. Service alignment
- does the interaction update the correct service or persistence layer?
- are config fields, handler logic, and displayed labels still synchronized?

## Constraints

- do not leave dead buttons in visible UI,
- do not rely on routing behavior you did not verify,
- do not duplicate reply logic in multiple branches without need,
- do not document an interaction flow as complete if navigation still breaks.

## Verification

For changed interaction surfaces, test:
- entry into the flow,
- success path,
- back-navigation,
- invalid or partial input path,
- persistence or refresh behavior.

## Related docs

- `.agent/skills/config/SKILL.md`
- `.agent/skills/utility-herold/SKILL.md`
- `.agent/skills/utility-voice/SKILL.md`
- `docs/CODE_ISSUES_TO_FIX.md`
