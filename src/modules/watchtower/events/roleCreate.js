const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: RoleCreate
 * Loguje utworzenie nowej roli.
 */
module.exports = {
    name: Events.GuildRoleCreate,
    async execute(role) {
        const executor = await watchtowerService.getExecutor(
            role.guild,
            AuditLogEvent.RoleCreate,
            role.id
        );

        await watchtowerService.log(role.guild, 'ROLE_CREATE', {
            name: role.name,
            executor: executor
        }, { type: 'SUCCESS' });
    }
};
