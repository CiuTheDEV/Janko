const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla diagnostyki stanu bota.
 */
module.exports = [
    {
        customId: 'config_health',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);
            const botMember = interaction.guild.members.me;

            const requiredPerms = [
                PermissionsBitField.Flags.Administrator,
                PermissionsBitField.Flags.ManageChannels,
                PermissionsBitField.Flags.ManageRoles,
                PermissionsBitField.Flags.ManageMessages,
                PermissionsBitField.Flags.ModerateMembers
            ];

            const missing = botMember.permissions.missing(requiredPerms);

            const embed = uiEngine.createEmbed('CONFIG.HEALTH', {
                perms: missing.length === 0 ? '`✅ Wszystkie poprawne`' : `\`❌ Brak:\` ${missing.join(', ')}`,
                logsCh: config.logsCh ? '`✅ Skonfigurowany`' : '`⚠️ Brak konfiguracji`',
                prefix: config.prefix || '!'
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('config_health')
                    .setLabel('Odśwież')
                    .setEmoji('🔄')
                    .setStyle(ButtonStyle.Primary),
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
