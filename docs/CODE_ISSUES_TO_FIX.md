# Code Issues to Fix

This file collects code problems discovered during documentation and repository audits.  
In this session, **active fixes were applied** to resolve critical architectural drift.

Last updated: **2026-04-19**

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
