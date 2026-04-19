const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderMainDashboard } = require('../utils/configRenderer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Otwiera centrum zarządzania Janko (Tylko Administrator)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const payload = await renderMainDashboard(interaction);

        await interaction.reply({
            ...payload,
            flags: [MessageFlags.Ephemeral] 
        });
    }
};
