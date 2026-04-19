const { Events } = require('discord.js');
const temporalRoleService = require('../services/TemporalRoleService');

/**
 * Event: Ready (Internal for Security Domain)
 * Wyzwalany, gdy bot jest gotowy. Inicjalizuje serwisy cykliczne.
 */
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Startujemy system uprawnień czasowych
        await temporalRoleService.init(client);
    }
};
