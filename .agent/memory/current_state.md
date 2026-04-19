# Current State — Janko

Last verification: **2026-04-17**  
Verification type: **static repository and documentation audit**

## 1. What is actually implemented

### Core
- module discovery works in `src/core/discovery.js`,
- loader and module contract validation exist,
- dynamic `customId` matching exists in `index.js`,
- `styles.js`, `templates.js`, and `uiEngine.js` exist,
- database access goes through `src/core/database.js`.

### Config
- `/config` exists,
- these views exist:
  - `Channels`
  - `Onboarding`
  - `Notifications`
  - `Utility`
  - `General` (with prefix modal)
  - `Roles` (with role select)
  - `Health Check` (diagnostic)
  - return to main menu
- `ConfigService` exists with in-memory cache.
- `configRenderer` utility centralizes the main dashboard UI.

### Moderation
- commands:
  - `ban`
  - `kick`
  - `timeout`
  - `clear`
  - `ostrzez`
  - `ostrzezenia`
  - `usun-ostrzezenie`
- **Personalized DMs**: Dedicated `_DM` templates for all moderation actions (personally addressed to the user).
- **Visual Identity**: Dedicated security avatar (`security_avatar.png`) for all moderation reports.
- punishments are stored in `UserInfraction`,
- automatic punishment escalation after warnings exists,
- moderation action logs exist,
- `messageDelete` and `messageUpdate` events exist.

### Phase 6 — Competitive Edge 🏰
- **Shadow Quarantine**: Automated anti-raid system with staff mirroring and decision dashboard.
- **Visual Security Audit**: `/check-security` command for identifying permission leaks and "one-click" hardening.
- **Permanent User Casefile (Teczka 2.0)**: Persistent user history tracking (joins, leaves, name changes, role snapshots) via `/casefile`.
- **Server Snapshots (Backup)**: [DEVELOPMENT] Structural serialization of roles and channels for recovery.
- [x] **Temporal Permissions**: System for granting temporary roles with automated expiration, DM notifications, and background cleanup.
- [x] **Decision Dashboard**: Interactive interface for Approve, Kick, or Ban decisions.
- [x] **Bard Janko (Music)**: Premium button-driven music system with dashboard, queue visualization, and DJ role support.
- **Integrated Config**: Dedicated security and utility settings in `/config`.

### Onboarding
- `guildMemberAdd` and `guildMemberRemove` are handled,
- welcome and leave messages are configurable,
- `EMBED` and `TEXT` modes exist,
- optional Canvas-based images exist.

- **Herold**:
  - `/remind` creates a reminder draft,
  - the reminder dashboard supports editing content, time, targets, and delivery type,
  - `/reminders` shows active reminders and allows deletion,
  - optimized role member fetching (`guild.members.fetch({ role })`),
  - the Herold scheduler starts on `ready`.
- **Auto-Voice**:
  - creates temporary channels and persists user preferences,
  - **Ownership Transfer**: automatically nominates new leader if creator leaves,
  - **Ghost Mode**: allow hiding channels from `@everyone`,
  - **Permission-based control**: management panel works for current channel owner.
- **Visual Identity**: Dedicated onboarding avatar (`onboarding_avatar.png`) and greeting templates for all join/leave events.

## 2. What is only partially implemented

### `/config`
The panel is fully stabilized. All main menu buttons have complete handler flows and centralized rendering.
- Integrated **Watchtower Dashboard** for audit log control.
- Integrated **Notifications Dashboard** with per-module toggle support.

### UI Engine
The layer is fully stabilized and modernized.
- Centralized `UIEngine` handles all module rendering.
- Generic **Asset Attachment** (automated `assets/` upload via `attachment://` protocol).
- Support for **Category-level Footers and Thumbnails** (fixed fallback logic).
- Modernized **Ephemeral Handling** using `MessageFlags`.
- Hybrid visibility (boolean `ephemeral` + array `flags`) for backward compatibility.

### Watchtower
Implemented and fully stabilized.
- dedicated `watchtower` module in `src/modules/watchtower/`,
- `WatchtowerService` for centralized, template-driven logging,
- exhaustive event logging:
  - `messageDelete` / `messageUpdate` (with executor identification, avatar context, and image previews),
  - `guildMemberAdd` / `guildMemberRemove` (administrative join/leave logs),
  - `guildMemberUpdate` (role changes, nicknames, avatars),
  - `channelCreate` / `channelDelete` / `channelUpdate` (lifecycle logging),
  - `roleCreate` / `roleDelete` / `roleUpdate` (role lifecycle),
  - `messageCreate` (anti-spam monitor with visual alerts),
- Audit Log integration for identify "Who did this?".
- **Rich Media**: All logs now include avatars and visual context where applicable.
- **Dedicated Identity**: Watchtower now has its own visual identity (`watchtower_avatar.png`) and specialized footers.

### Herold
- System hardened and polished.
- **Visual Identity**: Dedicated close-up avatar (`herold_avatar.png`) for high readability.
- **Creator Context**: All reminders now mention the user who ordered them.
- **Flexible Format**: Full support for `TEXT` and `EMBED` modes per reminder.
- **Rich Notifications**: Support for custom image URLs in reminders.
- **Interaction Safety**: Deferred updates implemented to prevent "Unknown Interaction" errors during long processes.

## 3. What is not implemented even if older documents mentioned it

- `System Undo`
- `Human-First verification`
- full role/channel change monitoring

## 4. Current documentation and technical priorities

1. Harden Admin UX (Dashboard refactoring & Watchtower settings)
2. Clarify and extend the Watchtower direction
3. Keep documentation aligned with the actual codebase
4. Enforce stronger task-gating through agent rules and skills

## 5. Sources of truth

To determine project status, use first:
- `src/`
- `prisma/schema.prisma`
- `docs/CODE_ISSUES_TO_FIX.md`

Only after that:
- `ROADMAP.md`
- `artifacts/*.md`
