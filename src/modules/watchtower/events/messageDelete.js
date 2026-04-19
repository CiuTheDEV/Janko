const { Events, AuditLogEvent } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

/**
 * Watchtower: MessageDelete
 * Loguje usunięte wiadomości i próbuje ustalić wykonawcę.
 */
module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.partial || message.author?.bot) return;

        // Próba pobrania wykonawcy z Audit Logów
        const executor = await watchtowerService.getExecutor(
            message.guild, 
            AuditLogEvent.MessageDelete, 
            message.author.id
        );

        const firstAttachment = message.attachments.first();
        const imageUrl = firstAttachment && firstAttachment.contentType?.startsWith('image/') ? firstAttachment.url : null;

        await watchtowerService.log(message.guild, 'MSG_DELETE', {
            user: `${message.author.tag} (${message.author.id})`,
            channel: `<#${message.channel.id}>`,
            content: message.content || '_Brak treści_',
            executor: executor,
            thumbnail: message.author.displayAvatarURL(),
            image: imageUrl
        }, { type: 'DANGER' });
    }
};
