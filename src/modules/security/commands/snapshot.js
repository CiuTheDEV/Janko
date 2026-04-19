const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const snapshotService = require('../services/SnapshotService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snapshot')
        .setDescription('🛡️ Zarządzanie strukturą i kopiami zapasowymi serwera.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        }

        const method = interaction.replied || interaction.deferred ? 'editReply' : 'reply';
        try {
            const snapshots = await snapshotService.listSnapshots(interaction.guild.id);
            const last = snapshots[0];

            const response = uiEngine.render('SECURITY.SNAPSHOT_DASHBOARD', {
                lastSnapshot: last ? `**${last.name}** (<t:${Math.floor(last.createdAt.getTime() / 1000)}:R>)` : '_Brak zapisów_',
                status: last ? '✅ System zabezpieczony' : '⚠️ Wymagany pierwszy zapis'
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('security_snapshot_create')
                    .setLabel('Nowy Snapshot')
                    .setEmoji('📸')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('security_snapshot_list')
                    .setLabel('Archiwum')
                    .setEmoji('🗄️')
                    .setStyle(ButtonStyle.Secondary)
            );

            // Only add compare button if there is at least one snapshot
            if (last) {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`security_snapshot_compare_${last.id}`)
                        .setLabel('Analiza Dryfu')
                        .setEmoji('🔍')
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            await interaction[method]({ ...response, components: [row] });
        } catch (error) {
            console.error('[SECURITY] Dashboard error:', error);
            await interaction[method](`❌ Błąd ładowania centrum zabezpieczeń: ${error.message}`);
        }
    }
};
