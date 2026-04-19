const securityService = require('../services/SecurityService');

module.exports = [
    {
        customId: 'security_fix_everyone',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();

            const response = await securityService.fixSecurityIssue(interaction.guild, 'fix_everyone');
            
            // Disable button
            await interaction.editReply({ components: [] });
            
            await interaction.followUp(response);
        }
    }
];
