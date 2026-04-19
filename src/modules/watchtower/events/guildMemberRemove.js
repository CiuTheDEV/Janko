const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');
const casefileService = require('../../moderation/CasefileService');

/**
 * Watchtower: GuildMemberRemove
 * Loguje odejście członka (opcjonalnie z info o wyrzuceniu).
 */
module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        // 1. Log to Casefile (Persistence)
        await casefileService.logEntry(member.guild.id, member.id, casefileService.EntryType.LEAVE);
        
        // Snapshot ról przy wyjściu
        const cacheRoles = member.roles.cache.filter(r => r.name !== '@everyone');
        const roleNames = cacheRoles.map(r => r.name).join(', ');
        const roleIds = cacheRoles.map(r => r.id);
            
        if (roleNames) {
            await casefileService.logEntry(member.guild.id, member.id, casefileService.EntryType.ROLES_SNAPSHOT, { 
                roles: roleNames,
                roleIds: roleIds
            });
        }

        // 2. Log to Watchtower (Real-time)
        // Próba ustalenia czy to był kick
        const executor = await watchtowerService.getExecutor(
            member.guild,
            AuditLogEvent.MemberKick,
            member.id
        );

        // Czas dołączenia
        const joinedAgo = member.joinedTimestamp 
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` 
            : '_Nieznany_';

        await watchtowerService.log(member.guild, 'MEMBER_LEAVE', {
            user: `${member.user.tag}`,
            id: member.id,
            joined: joinedAgo,
            executor: executor // Jeśli to był kick, pokaże kto wyrzucił
        }, { type: executor ? 'DANGER' : 'WARNING' });
    }
};
