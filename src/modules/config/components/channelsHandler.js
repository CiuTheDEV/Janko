const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla konfiguracji kanałów.
 */
module.exports = [
    {
        customId: 'config_channels',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);

            const embed = uiEngine.createEmbed('CONFIG.CHANNELS', {
                welcomeCh: config.welcomeCh ? `<#${config.welcomeCh}>` : '`❌ Nie ustawiono`',
                leaveCh: config.leaveCh ? `<#${config.leaveCh}>` : '`❌ Nie ustawiono`',
                logsCh: config.logsCh ? `<#${config.logsCh}>` : '`❌ Nie ustawiono`'
            });

            const row1 = new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('select_welcome_ch')
                    .setPlaceholder('Wybierz kanał POWITALNY')
                    .addChannelTypes(ChannelType.GuildText)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('select_leave_ch')
                    .setPlaceholder('Wybierz kanał POŻEGNALNY')
                    .addChannelTypes(ChannelType.GuildText)
            );

            const row3 = new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('select_logs_ch')
                    .setPlaceholder('Wybierz kanał LOGÓW')
                    .addChannelTypes(ChannelType.GuildText)
            );

            const row4 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('config_main')
                    .setLabel('Powrót')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row1, row2, row3, row4]
            });
        }
    },
    {
        customId: 'select_welcome_ch',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { welcomeCh: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_channels');
            await view.execute(interaction);
        }
    },
    {
        customId: 'select_leave_ch',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { leaveCh: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_channels');
            await view.execute(interaction);
        }
    },
    {
        customId: 'select_logs_ch',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { logsCh: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_channels');
            await view.execute(interaction);
        }
    }
];
