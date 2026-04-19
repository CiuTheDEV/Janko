const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla modułów użyteczności (np. Auto-Voice).
 */
module.exports = [
    {
        customId: 'config_utility',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);

            const embed = uiEngine.createEmbed('CONFIG.UTILITY', {
                status: config.autoVoiceEnabled ? '`✅ Włączone`' : '`❌ Wyłączone`',
                autoVoiceCh: config.autoVoiceCh ? `<#${config.autoVoiceCh}>` : '`❌ Nie ustawiono`',
                volume: config.musicVolume,
                djRole: config.musicDjRole ? `<@&${config.musicDjRole}>` : '`❌ Nie ustawiono`'
            });

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('toggle_autovoice')
                    .setLabel('Auto-Voice')
                    .setEmoji('🎙️')
                    .setStyle(config.autoVoiceEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('config_main')
                    .setLabel('Powrót')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('select_autovoice_ch')
                    .setPlaceholder('Wybierz kanał "Dołącz aby stworzyć"')
                    .addChannelTypes(ChannelType.GuildVoice)
            );

            const row3 = new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('select_music_dj')
                    .setPlaceholder('Wybierz rangę DJ (opcjonalnie)')
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row1, row2, row3]
            });
        }
    },
    {
        customId: 'toggle_autovoice',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);
            await configService.update(interaction.guild.id, { autoVoiceEnabled: !config.autoVoiceEnabled });
            const view = module.exports.find(v => v.customId === 'config_utility');
            await view.execute(interaction);
        }
    },
    {
        customId: 'select_autovoice_ch',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { autoVoiceCh: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_utility');
            await view.execute(interaction);
        }
    },
    {
        customId: 'select_music_dj',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { musicDjRole: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_utility');
            await view.execute(interaction);
        }
    }
];
