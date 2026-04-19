const { Events } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');
const casefileService = require('../../moderation/CasefileService');

/**
 * Watchtower: GuildMemberAdd
 * Loguje dołączenie nowego członka (log administracyjny).
 */
module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // 1. Log to Casefile (Persistence)
        await casefileService.logEntry(member.guild.id, member.id, casefileService.EntryType.JOIN);

        // 2. Automatyczne przywracanie ról (Teczka 2.0)
        const roleIds = await casefileService.getLatestRoleSnapshot(member.guild.id, member.id);
        if (roleIds && roleIds.length > 0) {
            try {
                const me = member.guild.members.me;
                const rolesToRestore = roleIds.filter(id => {
                    const role = member.guild.roles.cache.get(id);
                    return role && role.position < me.roles.highest.position && !role.managed;
                });

                if (rolesToRestore.length > 0) {
                    await member.roles.add(rolesToRestore, 'Automatyczne przywracanie ról (Teczka 2.0)');
                }
            } catch (error) {
                console.error(` [CASEFILE] Błąd przywracania ról dla ${member.id}:`, error);
            }
        }

        // 3. Log to Watchtower (Real-time)
        const createdAgo = Math.floor(member.user.createdTimestamp / 1000);
        
        await watchtowerService.log(member.guild, 'MEMBER_JOIN', {
            user: `${member.user.tag}`,
            id: member.id,
            created: `<t:${createdAgo}:R>`
        }, { type: 'SUCCESS' });
    }
};
