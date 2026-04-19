const onboardingService = require('../services/onboardingService');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            await onboardingService.handleJoin(member);
        } catch (error) {
            console.error('[Event: guildMemberAdd] Błąd:', error);
        }
    }
};
