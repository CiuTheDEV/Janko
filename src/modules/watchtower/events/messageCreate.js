const { Events } = require('discord.js');
const watchtowerService = require('../services/WatchtowerService');

const spamMap = new Map();

/**
 * Watchtower: MessageCreate (Anti-Spam Monitor)
 * Loguje sytuacje, w których użytkownik spamuje wiadomościami.
 */
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        const now = Date.now();
        const userId = message.author.id;
        const guildId = message.guild.id;
        const key = `${guildId}-${userId}`;

        if (!spamMap.has(key)) {
            spamMap.set(key, []);
        }

        const timestamps = spamMap.get(key);
        timestamps.push(now);

        // Usuwamy stare timestampy (> 5 sekund)
        const recent = timestamps.filter(t => now - t < 5000);
        spamMap.set(key, recent);

        // Jeśli wysłał 5 wiadomości w 5 sekund
        if (recent.length === 5) {
            await watchtowerService.log(message.guild, 'MODERATION_SPAM', {
                user: `${message.author.tag} (${message.author.id})`,
                channel: `<#${message.channel.id}>`,
                count: recent.length,
                thumbnail: message.author.displayAvatarURL()
            }, { type: 'DANGER' });
        }
    }
};
