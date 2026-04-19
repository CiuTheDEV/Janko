const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: RoleUpdate
 * Loguje zmiany w ustawieniach roli (nazwa, kolor).
 */
module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {
        const changes = [];
        if (oldRole.name !== newRole.name) changes.push(`Nazwa: \`${oldRole.name}\` ➔ \`${newRole.name}\``);
        if (oldRole.color !== newRole.color) changes.push(`Kolor: \`${oldRole.hexColor}\` ➔ \`${newRole.hexColor}\``);
        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            const added = newRole.permissions.toArray().filter(p => !oldRole.permissions.has(p));
            const removed = oldRole.permissions.toArray().filter(p => !newRole.permissions.has(p));
            
            if (added.length > 0) changes.push(`✅ Nadano: \`${added.join(', ')}\``);
            if (removed.length > 0) changes.push(`❌ Odebrano: \`${removed.join(', ')}\``);
            
            if (added.length === 0 && removed.length === 0) changes.push(`Zmiana uprawnień`);
        }

        if (changes.length === 0) return;

        const executor = await watchtowerService.getExecutor(
            newRole.guild,
            AuditLogEvent.RoleUpdate,
            newRole.id
        );

        await watchtowerService.log(newRole.guild, 'ROLE_UPDATE', {
            name: newRole.name,
            details: changes.join('\n'),
            executor: executor
        }, { type: 'WARNING' });
    }
};
