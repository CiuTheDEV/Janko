const { Events } = require('discord.js');
const securityService = require('../services/SecurityService');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Skip bots and DMs
        if (message.author.bot || !message.guild) return;

        try {
            await securityService.mirrorMessage(message);
        } catch (error) {
            console.error(`[SECURITY] Error in messageCreate mirroring hook:`, error);
        }
    }
};
