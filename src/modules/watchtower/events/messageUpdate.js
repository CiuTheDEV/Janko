const { Events } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: MessageUpdate
 * Loguje edytowane wiadomości.
 */
module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (oldMessage.partial || oldMessage.author?.bot) return;
        if (oldMessage.content === newMessage.content) return;

        await watchtowerService.log(oldMessage.guild, 'MSG_EDIT', {
            user: `${oldMessage.author.tag} (${oldMessage.author.id})`,
            channel: `<#${oldMessage.channel.id}>`,
            old: oldMessage.content || '_Brak treści_',
            new: newMessage.content || '_Brak treści_',
            thumbnail: oldMessage.author.displayAvatarURL()
        }, { type: 'WARNING' });
    }
};
