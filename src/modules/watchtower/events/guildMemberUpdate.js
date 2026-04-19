const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');
const casefileService = require('../../moderation/CasefileService');

/**
 * Watchtower: GuildMemberUpdate
 * Loguje zmiany ról użytkowników, nicków i awatarów.
 */
module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        // 1. Zmiana ról
        if (oldRoles.size !== newRoles.size) {
            const added = newRoles.filter(role => !oldRoles.has(role.id));
            const removed = oldRoles.filter(role => !newRoles.has(role.id));

            if (added.size > 0 || removed.size > 0) {
                const addedText = added.map(r => `• ${r.name}`).join('\n') || '_Brak_';
                const removedText = removed.map(r => `• ${r.name}`).join('\n') || '_Brak_';

                const executor = await watchtowerService.getExecutor(
                    newMember.guild,
                    AuditLogEvent.MemberRoleUpdate,
                    newMember.id
                );

                await watchtowerService.log(newMember.guild, 'MEMBER_ROLES', {
                    user: `${newMember.user.tag}`,
                    added: addedText,
                    removed: removedText,
                    executor: executor
                }, { type: 'PRIMARY' });
            }
        }

        // 2. Zmiana pseudonimu
        if (oldMember.nickname !== newMember.nickname) {
            // Log to Casefile
            await casefileService.logNickname(
                newMember.guild.id, 
                newMember.id, 
                oldMember.nickname || null, 
                newMember.nickname || null
            );

            // Log to Watchtower
            await watchtowerService.log(newMember.guild, 'MEMBER_NICK', {
                user: `${newMember.user.tag} (${newMember.id})`,
                old: oldMember.nickname || '_Brak (Domyślny)_',
                new: newMember.nickname || '_Brak (Domyślny)_',
                thumbnail: newMember.user.displayAvatarURL()
            }, { type: 'INFO' });
        }
    
        // 3. Zmiana awatara (również serwerowego)
        if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
            // Log to Casefile
            await casefileService.logEntry(newMember.guild.id, newMember.id, casefileService.EntryType.AVATAR_CHANGE);

            // Log to Watchtower
            await watchtowerService.log(newMember.guild, 'MEMBER_AVATAR', {
                user: `${newMember.user.tag}`,
                thumbnail: newMember.user.displayAvatarURL()
            }, { type: 'INFO' });
        }
    }
};
