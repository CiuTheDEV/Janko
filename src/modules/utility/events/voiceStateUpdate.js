const autoVoiceService = require('../services/autoVoiceService');

/**
 * Handle voice state updates for the Auto-Voice system.
 */
module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        try {
            // Przekazujemy obsługę do dedykowanego serwisu
            await autoVoiceService.handleUpdate(oldState, newState);
        } catch (error) {
            console.error('[Event: voiceStateUpdate] Fatal error:', error);
        }
    }
};
