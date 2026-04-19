const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: ChannelCreate
 * Loguje utworzenie nowego kanału.
 */
module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        if (!channel.guild) return;

        const executor = await watchtowerService.getExecutor(
            channel.guild,
            AuditLogEvent.ChannelCreate,
            channel.id
        );

        await watchtowerService.log(channel.guild, 'CHANNEL_CREATE', {
            channel: `<#${channel.id}>`,
            executor: executor
        }, { type: 'SUCCESS' });
    }
};
