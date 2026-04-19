# Security Module — Janko

This module handles proactive server safety, anti-raid mechanisms, and the Shadow Quarantine system.

## Domain Role
Proactively protecting the guild from malicious actors while minimizing false positives through a "quarantine and observe" approach.

## Key Features
- **Shadow Quarantine**: Automated probation for new/suspicious accounts.
- **Message Mirroring**: Real-time mirroring of quarantined messages to staff channels.
- **Moderator Dashboard**: Interactive decision-making interface for quarantine management.
- **Visual Security Audit**: Proactive scanning for dangerous permission configurations via `/check-security`.

## Components
- `services/SecurityService.js`: Core logic for quarantine and audits.
- `commands/checkSecurity.js`: Slash command for manual audits.
- `components/`: Interaction handlers for quarantine and fix buttons.
- `events/`: Listeners for member join and message creation.
