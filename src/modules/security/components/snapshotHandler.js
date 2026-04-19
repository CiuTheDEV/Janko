const snapshotService = require('../services/SnapshotService');
const uiEngine = require('../../../core/uiEngine');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'security_snapshot',
    
    async execute(interaction) {
        const parts = interaction.customId.split('_');
        const action = parts[2]; // e.g., 'create', 'list', 'restore', 'compare'
        const snapshotId = parts[3];

        if (action === 'create') {
            await interaction.deferUpdate();
            const snapshot = await snapshotService.takeSnapshot(interaction.guild, interaction.user.id);
            const data = JSON.parse(snapshot.data);

            const response = uiEngine.render('SECURITY.SNAPSHOT_CREATE_SUCCESS', {
                name: snapshot.name,
                roles: data.roles.length,
                channels: data.channels.length,
                id: snapshot.id
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('security_snapshot_back')
                    .setLabel('Wróć do Dashboardu')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({ ...response, components: [row] });
        }

        else if (action === 'list') {
            await interaction.deferUpdate();
            const snapshots = await snapshotService.listSnapshots(interaction.guild.id);
            
            if (snapshots.length === 0) {
                return await interaction.editReply({ content: '❌ Brak zapisów.', components: [this.getBackRow()] });
            }

            const listText = snapshots.map(s => 
                `• \`ID: ${s.id}\` | **${s.name}** | <t:${Math.floor(s.createdAt.getTime() / 1000)}:R>`
            ).join('\n');

            const response = uiEngine.render('SECURITY.SNAPSHOT_LIST', { list: listText });

            // Create a select menu for snapshots
            const select = new StringSelectMenuBuilder()
                .setCustomId('security_snapshot_select')
                .setPlaceholder('Wybierz snapshot, aby zarządzać...')
                .addOptions(snapshots.slice(0, 25).map(s => ({
                    label: s.name.substring(0, 100),
                    description: `Data: ${s.createdAt.toLocaleString('pl-PL')}`,
                    value: s.id.toString()
                })));

            const row = new ActionRowBuilder().addComponents(select);
            const backRow = this.getBackRow();

            await interaction.editReply({ ...response, components: [row, backRow] });
        }

        else if (action === 'select') {
            const selectedId = interaction.values[0];
            await interaction.deferUpdate();
            const snapshot = await snapshotService.getSnapshot(selectedId);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`security_snapshot_compare_${selectedId}`)
                    .setLabel('Analiza Dryfu')
                    .setEmoji('🔍')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`security_snapshot_restore_${selectedId}`)
                    .setLabel('Przywróć')
                    .setEmoji('♻️')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('security_snapshot_list')
                    .setLabel('Powrót do listy')
                    .setStyle(ButtonStyle.Secondary)
            );

            const response = uiEngine.render('SECURITY.SNAPSHOT_MANAGE', {
                name: snapshot.name,
                id: selectedId,
                date: `<t:${Math.floor(snapshot.createdAt.getTime() / 1000)}:F>`
            });

            await interaction.editReply({ 
                ...response,
                components: [row]
            });
        }

        else if (action === 'compare') {
            await interaction.deferUpdate();
            const diff = await snapshotService.compare(interaction.guild, snapshotId);

            const response = uiEngine.render('SECURITY.SNAPSHOT_DIFF', {
                name: diff.snapshotName,
                missing: diff.missingCount > 0 ? `${diff.missingCount} (${diff.missingList.slice(0, 3).join(', ')}${diff.missingList.length > 3 ? '...' : ''})` : '0',
                extra: diff.extraCount > 0 ? `${diff.extraCount} (${diff.extraList.slice(0, 3).join(', ')}${diff.extraList.length > 3 ? '...' : ''})` : '0',
                changed: diff.changedCount
            });

            await interaction.editReply({ ...response, components: [this.getBackRow()] });
        }

        else if (action === 'restore') {
            await interaction.deferUpdate();
            const snapshot = await snapshotService.getSnapshot(snapshotId);

            const response = uiEngine.render('SECURITY.SNAPSHOT_RESTORE_WARN', { name: snapshot.name });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`security_snapshot_confirmrestore_${snapshotId}`)
                    .setLabel('Tak, przywróć strukturę')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('security_snapshot_back')
                    .setLabel('Anuluj')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({ ...response, components: [row] });
        }

        else if (action === 'confirmrestore') {
            await interaction.deferUpdate();
            try {
                const results = await snapshotService.restore(interaction.guild, snapshotId);
                const errorsText = results.errors.length > 0 
                    ? `\n\n**Błędy:**\n${results.errors.slice(0, 5).join('\n')}${results.errors.length > 5 ? '\n...i więcej' : ''}`
                    : '';

                const response = uiEngine.render('SECURITY.SNAPSHOT_RESTORE_SUCCESS', {
                    roles: results.roles,
                    channels: results.channels,
                    errors: errorsText
                });

                await interaction.editReply({ ...response, components: [this.getBackRow()] });
            } catch (error) {
                await interaction.editReply({ content: `❌ Błąd krytyczny: ${error.message}`, components: [this.getBackRow()] });
            }
        }

        else if (action === 'back') {
            // Re-execute dashboard command logic
            const snapshotCmd = require('../commands/snapshot');
            await snapshotCmd.execute(interaction);
        }
    },

    getBackRow() {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('security_snapshot_back')
                .setLabel('Wróć do Dashboardu')
                .setStyle(ButtonStyle.Secondary)
        );
    }
};
