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

## 8. Auto-Voice tries to send messages into voice channels

### Problem
`src/modules/utility/services/autoVoiceService.js` calls `channel.send(...)` in both `transferOwnership()` and `createKomnata()`, but those channels are created as `ChannelType.GuildVoice`.

### Effect
The Auto-Voice room can still be created, but the owner panel and leadership-transfer panel fail at runtime because voice channels are not text-based.

### What to fix
Move the control UI to a text-capable surface:
- a linked text channel,
- DMs,
- or an interaction-based control flow that does not rely on `VoiceChannel#send`.

## 12. Music: Missing `music_add` modal implementation

### Problem
The "Add" button in the Bard Janko dashboard currently sends a placeholder message instead of opening a modal for track search.

### Effect
Users cannot add songs directly from the interactive dashboard.

### What to fix
Implement a Discord Modal triggered by the `music_add` customId to capture song queries and add them to the queue.

## 13. Music: Static volume control

### Problem
The volume in `MusicService` is set at the start of the session from `GuildConfig` and cannot be adjusted dynamically via the dashboard.

### Effect
Users must use `/config` to change volume, which is slow during a music session.

### What to fix
Add volume control buttons or a select menu to the player dashboard to adjust `queue.node.setVolume()`.
