const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: ChannelDelete
 * Loguje usunięcie kanału.
 */
module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        if (!channel.guild) return;

        const executor = await watchtowerService.getExecutor(
            channel.guild,
            AuditLogEvent.ChannelDelete,
            channel.id
        );

        await watchtowerService.log(channel.guild, 'CHANNEL_DELETE', {
            name: channel.name,
            executor: executor
        }, { type: 'DANGER' });
    }
};
