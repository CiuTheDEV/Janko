const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/ConfigService');

/**
 * Shared renderer for the Config Dashboard to ensure consistency between
 * the initial command and dashboard navigation.
 */
async function renderMainDashboard(interaction) {
    const owner = interaction.guild.members.cache.get(interaction.guild.ownerId);
    const styles = uiEngine.styles.ICONS;
    const config = await configService.get(interaction.guild.id);

    // 1. Build the base message using UI Engine render
    const message = uiEngine.render('CONFIG.DASHBOARD', {
        owner: owner ? owner.user.username : 'Nieznany'
    });

    // 2. Add security recommendation if audit is missing
    if (!config.lastSecurityAudit) {
        const recommendation = uiEngine.render('SECURITY.CONFIG_RECOMMEND_AUDIT');
        message.embeds[0].description = recommendation.content + '\n\n' + (message.embeds[0].description || '');
    }

    // 3. Navigation Buttons
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('config_general')
            .setLabel('Ogólne')
            .setEmoji(styles.CONFIG)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('config_channels')
            .setLabel('Kanały')
            .setEmoji(styles.CHANNELS)
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('config_roles')
            .setLabel('Role')
            .setEmoji(styles.ROLES)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('config_health')
            .setLabel('Health Check')
            .setEmoji(styles.WARNING)
            .setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('config_onboarding')
            .setLabel('Powitania')
            .setEmoji(styles.ONBOARDING)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('config_notify')
            .setLabel('Powiadomienia')
            .setEmoji(styles.NOTIFY)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('config_utility')
            .setLabel('Użyteczność')
            .setEmoji(styles.UTILITY)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('config_watchtower')
            .setLabel('Watchtower')
            .setEmoji('🕵️')
            .setStyle(ButtonStyle.Primary)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('config_security')
            .setLabel('Bezpieczeństwo')
            .setEmoji('🛡️')
            .setStyle(ButtonStyle.Primary)
    );

    return {
        ...message,
        components: [row1, row2, row3]
    };
}

module.exports = {
    renderMainDashboard
};
