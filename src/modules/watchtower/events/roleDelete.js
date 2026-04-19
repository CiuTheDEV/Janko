const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: RoleDelete
 * Loguje usunięcie roli.
 */
module.exports = {
    name: Events.GuildRoleDelete,
    async execute(role) {
        const executor = await watchtowerService.getExecutor(
            role.guild,
            AuditLogEvent.RoleDelete,
            role.id
        );

        await watchtowerService.log(role.guild, 'ROLE_DELETE', {
            name: role.name,
            executor: executor
        }, { type: 'DANGER' });
    }
};
