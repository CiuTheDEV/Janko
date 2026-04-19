const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla dedykowanego UI Watchtower (Ustawienia Audytu).
 */
module.exports = [
    {
        customId: 'config_watchtower',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);
            await renderWatchtowerView(interaction, config);
        }
    },
    // Handlery przełączników
    { id: 'toggle_wt_messages', field: 'watchtowerLogMessages' },
    { id: 'toggle_wt_members', field: 'watchtowerLogMembers' },
    { id: 'toggle_wt_channels', field: 'watchtowerLogChannels' },
    { id: 'toggle_wt_roles', field: 'watchtowerLogRoles' },
    { id: 'toggle_wt_spam', field: 'watchtowerLogSpam' }
].map(item => {
    if (item.field) {
        return {
            customId: item.id,
            async execute(interaction) {
                if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
                const config = await configService.get(interaction.guild.id);
                const updated = await configService.update(interaction.guild.id, {
                    [item.field]: !config[item.field]
                });
                await renderWatchtowerView(interaction, updated);
            }
        };
    }
    return item;
});

/**
 * Renderuje dedykowany widok Watchtower
 */
async function renderWatchtowerView(interaction, config) {
    const message = uiEngine.render('WATCHTOWER.DASHBOARD', {
        logsCh: config.logsCh ? `<#${config.logsCh}>` : '`❌ Nie ustawiono`',
        messages: config.watchtowerLogMessages ? '✅' : '❌',
        members: config.watchtowerLogMembers ? '✅' : '❌',
        channels: config.watchtowerLogChannels ? '✅' : '❌',
        roles: config.watchtowerLogRoles ? '✅' : '❌',
        spam: config.watchtowerLogSpam ? '✅' : '❌'
    });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('toggle_wt_messages')
            .setLabel('Wiadomości')
            .setEmoji('💬')
            .setStyle(config.watchtowerLogMessages ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('toggle_wt_members')
            .setLabel('Członkowie')
            .setEmoji('👤')
            .setStyle(config.watchtowerLogMembers ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('toggle_wt_spam')
            .setLabel('Anty-Spam')
            .setEmoji('🚫')
            .setStyle(config.watchtowerLogSpam ? ButtonStyle.Success : ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('toggle_wt_channels')
            .setLabel('Kanały')
            .setEmoji('⚙️')
            .setStyle(config.watchtowerLogChannels ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('toggle_wt_roles')
            .setLabel('Role')
            .setEmoji('🎨')
            .setStyle(config.watchtowerLogRoles ? ButtonStyle.Success : ButtonStyle.Danger)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('config_main')
            .setLabel('Powrót')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({ ...message, components: [row1, row2, row3] });
}
