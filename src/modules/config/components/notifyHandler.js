const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla konfiguracji powiadomień.
 */
module.exports = [
    {
        customId: 'config_notify',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);

            const embed = uiEngine.createEmbed('CONFIG.NOTIFY', {
                warn: config.notifyWarn ? '✅' : '❌',
                timeout: config.notifyTimeout ? '✅' : '❌',
                kick: config.notifyKick ? '✅' : '❌',
                ban: config.notifyBan ? '✅' : '❌',
                untimeout: config.notifyUntimeout ? '✅' : '❌'
            });

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('toggle_notify_warn')
                    .setLabel('Warn')
                    .setStyle(config.notifyWarn ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_notify_timeout')
                    .setLabel('Timeout')
                    .setStyle(config.notifyTimeout ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_notify_untimeout')
                    .setLabel('Od-ciszenie')
                    .setStyle(config.notifyUntimeout ? ButtonStyle.Success : ButtonStyle.Danger)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('toggle_notify_kick')
                    .setLabel('Kick')
                    .setStyle(config.notifyKick ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_notify_ban')
                    .setLabel('Ban')
                    .setStyle(config.notifyBan ? ButtonStyle.Success : ButtonStyle.Danger)
            );

            const row3 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('config_main')
                    .setLabel('Powrót')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row1, row2, row3]
            });
        }
    },
    { id: 'toggle_notify_warn', field: 'notifyWarn' },
    { id: 'toggle_notify_timeout', field: 'notifyTimeout' },
    { id: 'toggle_notify_kick', field: 'notifyKick' },
    { id: 'toggle_notify_ban', field: 'notifyBan' },
    { id: 'toggle_notify_untimeout', field: 'notifyUntimeout' }
].map(item => {
    if (item.field) {
        return {
            customId: item.id,
            async execute(interaction) {
                if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
                const config = await configService.get(interaction.guild.id);
                await configService.update(interaction.guild.id, { [item.field]: !config[item.field] });
                const main = module.exports.find(v => v.customId === 'config_notify');
                await main.execute(interaction);
            }
        };
    }
    return item;
});
