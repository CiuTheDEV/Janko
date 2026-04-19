const { Events } = require('discord.js');
const heroldService = require('../services/heroldService');

/**
 * Event: Ready (Internal for Utility Domain)
 * Wyzwalany, gdy bot jest gotowy. Inicjalizuje serwisy cykliczne.
 */
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Startujemy Herolda
        await heroldService.init(client);
    }
};
