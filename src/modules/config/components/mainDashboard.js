const { renderMainDashboard } = require('../utils/configRenderer');

/**
 * Handler dla głównego widoku Dashboardu.
 */
module.exports = {
    customId: 'config_main',
    async execute(interaction) {
        if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
        
        const payload = await renderMainDashboard(interaction);

        await interaction.editReply({
            ...payload
        });
    }
};
