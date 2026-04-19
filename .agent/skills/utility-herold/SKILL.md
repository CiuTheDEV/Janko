---
name: utility-herold
description: Use this skill when working on reminders, reminder dashboard flows, reminder delivery behavior, or the Herold scheduler in the Janko repository.
---

# Skill: Utility — Herold

## Goal

Keep reminder creation, editing, scheduling, and delivery behavior consistent across commands, dashboards, and the DB model.

## When to use

- changing `/remind`,
- changing `/reminders`,
- changing reminder dashboard interactions,
- changing `heroldService.js`,
- changing the `Reminder` model.

## Preconditions

Inspect:
- `src/modules/utility/commands/remind.js`
- `src/modules/utility/commands/reminders.js`
- `src/modules/utility/components/heroldDashboardHandler.js`
- `src/modules/utility/components/reminderHandler.js`
- `src/modules/utility/services/heroldService.js`
- `prisma/schema.prisma`

## Current reality

The current flow is:

1. `/remind` creates a `DRAFT` record,
2. the user sets content, time, targets, and delivery type,
3. `herold_confirm` switches the record to `ACTIVE` and sets `remindAt`,
4. the scheduler finds reminders due for delivery,
5. `/reminders` lists active reminders and allows deletion.

## Instructions

### 1. Dashboard
The dashboard uses dynamic `customId` values with the `herold_*_<id>` pattern.  
Keep the following aligned:
- button,
- modal,
- handler,
- refreshed view.

### 2. Reminder model
If `Reminder` fields change, synchronize:
- the entry command,
- the dashboard,
- the scheduler,
- the active-reminder list.

### 3. Scheduler
If delivery logic changes:
- inspect `ready.js`,
- inspect draft cleanup behavior,
- inspect DM-only behavior.

## Constraints

- do not describe recurring reminders as implemented unless the code exists,
- do not mix `DRAFT` and `ACTIVE` semantics,
- do not skip DM-only and public-confirmation testing,
- do not assume a separate queue/worker module if the repository does not have one.

## Verification

- create a draft through `/remind`,
- edit content,
- change time,
- choose targets,
- change delivery type,
- confirm the reminder,
- verify scheduler delivery,
- delete the entry through `/reminders`.

## Related docs

- `.agent/memory/current_state.md`
- `.agent/memory/domain_map.md`
- `.agent/rules/db_governance.md`
- `.agent/skills/interaction-safety/SKILL.md`
