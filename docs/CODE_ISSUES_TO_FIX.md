# Code Issues to Fix

This file collects code problems discovered during documentation and repository audits.  
In this session, **code was not manually fixed** unless a task explicitly allowed it.

Last updated: **2026-04-17**

## 1. Inconsistent Prisma version comment

### Problem
In `src/core/database.js`, a comment references “Native Prisma 7”, while the repository in `package.json` uses Prisma `6.19.3`.

### Effect
The in-code technical comment is misleading.

### What to fix
Update the comment and naming in that file to match the real version.

## 6. Older artifacts describe the repository too optimistically

### Problem
`artifacts/task.md` and `artifacts/walkthrough.md` present the migration as more complete than the current code indicates.

### Effect
A new agent may mistake a historical artifact for current implementation truth.

### What to fix
Keep those files explicitly historical and avoid using them as current-state references.

## 7. One stable documentation truth hierarchy is required

### Problem
Earlier `.md` files mixed:
- current state,
- backlog,
- preferences,
- historical notes.

### Effect
An agent may implement something “because it was in a document” even when it does not exist in code.

### What to fix
Keep this long-term rule:
- `current_state.md` = live repo state
- `ROADMAP.md` = plan
- `preferences.md` = owner preference
- `artifacts/*.md` = historical context
- `CODE_ISSUES_TO_FIX.md` = unresolved technical debt
