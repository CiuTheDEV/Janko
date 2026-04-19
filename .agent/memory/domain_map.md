# Domain Map — Janko

This file describes **domains that exist in the repository** and keeps them separate from planned areas.

## Implemented domains

### Core
**Path:** `src/core/`  
**Role:** discovery, loading, interaction routing, database access, UI engine.

### Config
**Path:** `src/modules/config/`  
**Role:** guild configuration and `/config`.  
**Main elements:**
- `commands/config.js`
- `components/dashboardHandler.js`
- `services/configService.js`

### Moderation
**Path:** `src/modules/moderation/`  
**Role:** punishments, infraction history, and part of administrative logging.  
**Data:** `UserInfraction`

### Onboarding
**Path:** `src/modules/onboarding/`  
**Role:** welcome/leave messaging and join/leave graphics.  
**Main elements:**
- `guildMemberAdd` / `guildMemberRemove`
- `services/onboardingService.js`
- `utils/ImageGenerator.js`

### System
**Path:** `src/modules/system/`  
**Role:** technical slash commands.  
**Current command:** `ping`

### Utility
**Path:** `src/modules/utility/`  
**Role:** reminders and auto-voice.  
**Data:**
- `Reminder`
- `UserVoiceSettings`

## Cross-cutting areas

### UI Engine
Centralized rendering system in `src/core/`.
- Modernized template-driven logic.
- Automated local asset management (`assets/`).
- Standardized visibility control.

### Watchtower
**Path:** `src/modules/watchtower/`  
**Role:** administrative logging, message monitoring, member and channel lifecycle tracking.  
**Main elements:**
- `services/WatchtowerService.js` (Audit Log integration).
- `events/` (comprehensive event coverage).
- **Dashboard**: Dedicated config view for event management.

### Security
**Path:** `src/modules/security/`  
**Role:** proactive server safety, anti-raid, shadow quarantine, and security audits.  
**Main elements:**
- `services/SecurityService.js`
- `services/TemporalRoleService.js` (background cleanup).
- `components/quarantineHandler.js`
- `commands/grantRole.js`

### Music (Bard Janko)
**Path:** `src/modules/music/`
**Role:** premium music playback, queue management, and interactive dashboard.
**Main elements:**
- `services/MusicService.js` (discord-player integration).
- `commands/bard.js`
- `components/playerHandler.js`

## Planned / backlog areas

The following do not yet have dedicated domain implementations:
- Human-First verification
- System Undo

## Maintenance rule

Add to `domain_map.md` only:
- domains that exist in code,
- or planned areas clearly marked as backlog.

Never mix those two levels without labels.
