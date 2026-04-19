const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla ustawień ogólnych.
 */
module.exports = [
    {
        customId: 'config_general',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);

            const embed = uiEngine.createEmbed('CONFIG.GENERAL', {
                guildId: interaction.guild.id,
                prefix: config.prefix || '!',
                owner: `<@${interaction.guild.ownerId}>`,
                welcomeMsg: config.welcomeMsg,
                leaveMsg: config.leaveMsg
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('config_main')
                    .setLabel('Powrót')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });
        }
    }
];
