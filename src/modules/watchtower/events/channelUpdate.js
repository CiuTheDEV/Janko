const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: ChannelUpdate
 * Loguje zmiany w ustawieniach kanału.
 */
module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        if (!newChannel.guild) return;

        // Logujemy tylko istotne zmiany (nazwa, pozycja, temat)
        const changes = [];
        if (oldChannel.name !== newChannel.name) changes.push(`Nazwa: \`${oldChannel.name}\` ➔ \`${newChannel.name}\``);
        if (oldChannel.topic !== newChannel.topic) changes.push(`Temat: \`${oldChannel.topic || 'Brak'}\` ➔ \`${newChannel.topic || 'Brak'}\``);
        
        if (changes.length === 0) return;

        const executor = await watchtowerService.getExecutor(
            newChannel.guild,
            AuditLogEvent.ChannelUpdate,
            newChannel.id
        );

        await watchtowerService.log(newChannel.guild, 'CHANNEL_UPDATE', {
            channel: `<#${newChannel.id}>`,
            details: changes.join('\n'),
            executor: executor
        }, { type: 'WARNING' });
    }
};
