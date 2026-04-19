# Project Preferences and Constraints

This file describes **owner product preferences** and directional constraints.  
It is **not** a list of implemented features.

## 1. What should not be expanded

### UI and graphics
- do not build profile-card style user panels through Canvas,
- do not turn simple information commands such as `/user-info` or `/server-info` into large raw dashboards.

### Social / fun systems
- no classic economy,
- no quote system,
- no birthday system,
- no large polling system,
- no anonymous confessions,
- no reputation / karma,
- no timezone tracking,
- no nickname color system.

### Low-priority automations
- no event sign-up system in the style of “Herold 2.0”
- no bulk editing or preset packs for `/config`
- no media cleanup / media fixer
- no party-finder lobby
- no custom trigger engine
- no private game-server monitoring
- no file downloader
- no staff notes
- no automatic AFK intelligence

### Other constraints
- no module for monitoring other bots,
- no separate anti-scam / phishing module if it explodes project scope,
- no AI features for end users of the bot,
- no public per-user stats.

## 2. Preferred direction

### Safety
- permission audit,
- protection of critical permissions,
- anti-raid / safe mode,
- simple human verification only if it is actually implemented.

### Monitoring
- better administrative change logging,
- event grouping,
- continued Watchtower-layer development.

### Administration and UX
- continue polishing `/config`,
- keep a consistent dashboard experience,
- reduce unnecessary text-command sprawl.

### Utility
- improve reminders and auto-voice,
- prefer premium polish over adding random modules.

## 3. Interpretation rule

If something appears here as approved or desired, it only means:
- it is product-allowed,
- it may be planned,
- but it does **not** mean it already exists in the repository.

Implementation status must be checked in:
- `.agent/memory/current_state.md`
- `docs/CODE_ISSUES_TO_FIX.md`
