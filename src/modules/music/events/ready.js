const { Events } = require('discord.js');
const musicService = require('../services/MusicService');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Inicjalizacja serwisu muzycznego po starcie bota
        try {
            await musicService.init(client);
        } catch (error) {
            console.error(' [MUSIC] Błąd krytyczny inicjalizacji:', error);
        }
    }
};
