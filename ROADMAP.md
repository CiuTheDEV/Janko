# Roadmap — Janko

This file describes the planned direction of the project.

## Important boundary

`ROADMAP.md` is a **plan**, not a source of truth for what is already implemented.

To verify implementation status, use:
- `src/`
- `prisma/schema.prisma`
- `.agent/memory/current_state.md`
- `docs/CODE_ISSUES_TO_FIX.md`

## Phase 1 — Stabilize the current foundation [COMPLETED]

### Goals
- complete unfinished `/config` flows,
- remove documentation drift,
- make agent execution more reliable through stronger rules and skills,
- keep the current modules internally consistent.

### Current focus
- `config_general`, `config_roles`, and `config_health` completeness
- shared main-dashboard renderer for `/config`
- documentation discipline and truth hierarchy
- better execution gates for Antigravity agents

## Phase 2 — Strengthen moderation observability 🛡️ [COMPLETED]

### Goals
- [x] Create dedicated `watchtower` module.
- [x] Implement `WatchtowerService` for centralized logging.
- [x] Add administrative join/leave logs.
- [x] Add role change monitoring (`guildMemberUpdate`).
- [x] Add channel lifecycle monitoring.
- [x] Implement executor identification (Audit Logs).
- [x] Expanded logging (Nicknames, Avatars, Roles).

## Phase 3 — Harden admin UX ⚙️ [COMPLETED]
### Goals
- [x] modularize `/config` dashboard components,
- [x] achieve 100% `uiEngine` coverage in configuration views,
- [x] implement **Watchtower Settings** (per-event toggles),
- [x] standardize interaction behavior and back-navigation across all modules.
- [x] **Media-Rich Logs**: Avatars and image previews in Watchtower.
- [x] **Herold Hardening**: Custom images, format toggles, and creator context.

## Phase 4 — Branding & Polish 👑 [COMPLETED]
### Goals
- [x] Maintain consistent medieval branding across all modules.
- [x] Dedicated visual identities (Security, Herold, Onboarding, Watchtower).
- [x] Optimized mobile readability for all embeds.
- [x] Standardized DM templates (personalized address).

## Phase 5 — Utility polishing [COMPLETED]

### Goals
- improve reminders and auto-voice without bloating the bot,
- prioritize reliability and UX over adding unrelated modules.
- **Auto-Voice**: Ownership transfer and Ghost Mode implemented.
- **Herold**: Performance optimization for role notifications.

### Candidate work
- reminder flow refinements
- clearer active-reminder management
- better auto-voice ownership and safety behavior
- polish around defaults and recovery paths

## Phase 6 — Competitive Edge: Fortress & Intelligence 🏰

### Goals
- improve Janko's position as a premium administrative tool,
- leverage UI Engine for pro-active security visualization,
- implement long-term intelligence gathering (Casefiles).

### Candidate work
### 6.1 Shadow Quarantine (Advanced Anti-Raid) [COMPLETED]
- [x] Define `Probation` role behavior (isolated channels).
- [x] Implementation of a Mirroring System (messages from quarantined users go to staff-only channels).
- [x] Decision Dashboard for moderators (Approve/Reject/Extend).
- [x] Integration with `/config` and UI Engine.

### 6.2 Visual Security Audit (/check-security) [COMPLETED]
- [x] Core security analyzer (calculating effective permissions vs. Best Practices).
- [x] Vulnerability pattern detection (dangerous perms on @everyone, admin bloat).
- [x] UI Engine template for "Security Score" and critical issue visualization.
- [x] Interactive Fixes (one-click permission hardening).

### 6.3 Permanent User Casefile (Teczka 2.0) [COMPLETED]
- [x] DB Schema expansion: `UserAuditEntry` and `NicknameHistory` tables.
- [x] Persistent logging for join/leave events and role snapshots on exit.
- [x] Real-time logging for nickname and avatar changes.
- [x] `/casefile <user>` interactive dashboard with chronological timeline.

### 6.4 Server Snapshots (Backup) [COMPLETED]
- [x] Structural serialization (mapping channels and role hierarchies to JSON).
- [x] Secure database storage for historical snapshots.
- [x] Snapshot comparison tool (audit what changed in structure over time).
- [x] One-click structural restoration (recovery from "nuke" attacks).

### 6.5 Temporal Permissions [COMPLETED]
- [x] `TemporalRole` model in Prisma.
- [x] Background scheduler for automated permission cleanup.
- [x] `/grant-role <user> <role> <duration>` command with UI Engine confirmation.
- [x] Expiry notifications for users (DM via UI Engine).

### 6.6 Premium Music (Bard Janko) [COMPLETED]
- [x] Integration with a lightweight music engine (`discord-player`).
- [x] Button-driven player dashboard (Play, Pause, Volume, Queue).
- [x] Queue visualization with thumbnails (no chat command bloat).
- [x] Persistent per-server audio settings (DJ roles, volume).

## Explicit non-priorities

Unless priorities change, the following are not active targets:
- economy systems
- quotes
- birthdays
- reputation / karma
- AI features for end users
- random social modules that do not improve administration or core utility

## Documentation rule for roadmap updates

When updating this roadmap:
- describe target direction,
- do not rewrite current-state facts here,
- do not mark work as shipped unless the code exists,
- move unresolved defects to `docs/CODE_ISSUES_TO_FIX.md`, not into the roadmap.
