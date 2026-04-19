const onboardingService = require('../services/onboardingService');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            await onboardingService.handleLeave(member);
        } catch (error) {
            console.error('[Event: guildMemberRemove] Błąd:', error);
        }
    }
};
