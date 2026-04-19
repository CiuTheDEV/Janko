const { Events } = require('discord.js');
const securityService = require('../services/SecurityService');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Skip bots
        if (member.user.bot) return;

        try {
            await securityService.checkAndQuarantine(member);
        } catch (error) {
            console.error(`[SECURITY] Error in guildMemberAdd hook:`, error);
        }
    }
};
