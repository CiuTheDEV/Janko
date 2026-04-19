const { ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');

/**
 * Handler dla konfiguracji ról uprawnionych.
 */
module.exports = [
    {
        customId: 'config_roles',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);

            const embed = uiEngine.createEmbed('CONFIG.ROLES', {
                modRole: config.modRole ? `<@&${config.modRole}>` : '`❌ Nie ustawiono`',
                adminRole: config.adminRole ? `<@&${config.adminRole}>` : '`❌ Nie ustawiono`'
            });

            const row1 = new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('select_mod_role')
                    .setPlaceholder('Wybierz rolę MODERATORA')
            );

            const row2 = new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('select_admin_role')
                    .setPlaceholder('Wybierz rolę ADMINISTRATORA')
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
    {
        customId: 'select_mod_role',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { modRole: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_roles');
            await view.execute(interaction);
        }
    },
    {
        customId: 'select_admin_role',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            await configService.update(interaction.guild.id, { adminRole: interaction.values[0] });
            const view = module.exports.find(v => v.customId === 'config_roles');
            await view.execute(interaction);
        }
    }
];
