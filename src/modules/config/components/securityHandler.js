const { ActionRowBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla ustawień Bezpieczeństwa (Kwarantanna).
 */
module.exports = [
    {
        customId: 'config_security',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);
            await renderSecurityView(interaction, config);
        }
    },
    {
        customId: 'set_quarantine_role',
        async execute(interaction) {
            const roleId = interaction.values[0];
            const config = await configService.update(interaction.guild.id, { quarantineRoleId: roleId });
            await interaction.deferUpdate();
            await renderSecurityView(interaction, config);
        }
    },
    {
        customId: 'set_quarantine_channel',
        async execute(interaction) {
            const channelId = interaction.values[0];
            const config = await configService.update(interaction.guild.id, { quarantineLogsCh: channelId });
            await interaction.deferUpdate();
            await renderSecurityView(interaction, config);
        }
    },
    {
        customId: 'toggle_quarantine_threshold',
        async execute(interaction) {
            const config = await configService.get(interaction.guild.id);
            // Simple toggle cycle: 1, 3, 7, 14, 30
            const thresholds = [0, 1, 3, 7, 14, 30];
            let nextIndex = (thresholds.indexOf(config.quarantineThresholdDays) + 1) % thresholds.length;
            
            const updated = await configService.update(interaction.guild.id, { 
                quarantineThresholdDays: thresholds[nextIndex] 
            });
            
            await interaction.deferUpdate();
            await renderSecurityView(interaction, updated);
        }
    }
];

async function renderSecurityView(interaction, config) {
    const message = uiEngine.render('CONFIG.SECURITY', {
        quarantineRole: config.quarantineRoleId ? `<@&${config.quarantineRoleId}>` : '`❌ Nie ustawiono`',
        quarantineCh: config.quarantineLogsCh ? `<#${config.quarantineLogsCh}>` : '`❌ Nie ustawiono`',
        threshold: config.quarantineThresholdDays
    });

    const roleRow = new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
            .setCustomId('set_quarantine_role')
            .setPlaceholder('Wybierz rolę kwarantanny (np. Probation)')
    );

    const channelRow = new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
            .setCustomId('set_quarantine_channel')
            .setPlaceholder('Wybierz kanał dla logów i decyzji')
            .addChannelTypes(ChannelType.GuildText)
    );

    const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('toggle_quarantine_threshold')
            .setLabel(`Próg: ${config.quarantineThresholdDays} dni`)
            .setEmoji('⏳')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('config_main')
            .setLabel('Powrót')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
        ...message,
        components: [roleRow, channelRow, actionRow]
    });
}
