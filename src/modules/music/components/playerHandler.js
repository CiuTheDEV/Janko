const { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const musicService = require('../services/MusicService');
const uiEngine = require('../../../core/uiEngine');

/**
 * playerHandler - Obsługuje interakcje z dashboardem muzycznym.
 */
module.exports = [
    {
        customId: 'music_pause',
        async execute(interaction) {
            const queue = musicService.player.nodes.get(interaction.guildId);
            if (!queue || !queue.currentTrack) return interaction.reply({ content: 'Nic nie gra!', flags: [MessageFlags.Ephemeral] });

            queue.node.setPaused(!queue.node.isPaused());
            await interaction.deferUpdate();
            musicService.updateDashboard(queue, queue.currentTrack);
        }
    },
    {
        customId: 'music_skip',
        async execute(interaction) {
            const queue = musicService.player.nodes.get(interaction.guildId);
            if (!queue || !queue.currentTrack) return interaction.reply({ content: 'Nic nie gra!', ephemeral: true });

            queue.node.skip();
            await interaction.reply({ content: '⏭️ Pominięto pieśń.', flags: [MessageFlags.Ephemeral] });
        }
    },
    {
        customId: 'music_stop',
        async execute(interaction) {
            const queue = musicService.player.nodes.get(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'Nic nie gra!', flags: [MessageFlags.Ephemeral] });

            queue.delete();
            await interaction.reply({ content: '⏹️ Bard Janko przestał grać i opuścił kanał.', flags: [MessageFlags.Ephemeral] });
        }
    },
    {
        customId: 'music_queue',
        async execute(interaction) {
            const queue = musicService.player.nodes.get(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'Kolejka jest pusta!', flags: [MessageFlags.Ephemeral] });

            const tracks = queue.tracks.toArray().slice(0, 10);
            const list = tracks.map((t, i) => `${i + 1}. **${t.title}** (${t.author})`).join('\n') || '_Brak kolejnych utworów_';

            const ui = uiEngine.render('BARD.QUEUE', { list }, { flags: [MessageFlags.Ephemeral] });
            await interaction.reply(ui);
        }
    },
    {
        customId: 'music_add',
        async execute(interaction) {
            const modal = new ModalBuilder()
                .setCustomId('music_add_modal')
                .setTitle('Dodaj nową pieśń');

            const queryInput = new TextInputBuilder()
                .setCustomId('music_query')
                .setLabel('Nazwa utworu lub link')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('np. Sleepcycle Medieval Music')
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(queryInput));
            await interaction.showModal(modal);
        }
    },
    {
        customId: 'music_add_modal',
        async execute(interaction) {
            const query = interaction.fields.getTextInputValue('music_query');
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            try {
                const queue = musicService.player.nodes.get(interaction.guildId);
                if (!queue) {
                    return interaction.editReply('Najpierw wezwij Barda Janko używając `/bard`!');
                }

                const result = await musicService.player.search(query, {
                    requestedBy: interaction.user
                });

                if (!result || !result.tracks.length) {
                    return interaction.editReply('Nie znalazłem takiej pieśni...');
                }

                const track = result.tracks[0];
                queue.addTrack(track);

                await interaction.editReply(`✅ Dodano do kolejki: **${track.title}**`);
                musicService.updateDashboard(queue, queue.currentTrack);
            } catch (error) {
                console.error(' [MUSIC] Błąd dodawania utworu:', error);
                await interaction.editReply('Wystąpił błąd podczas dodawania pieśni.');
            }
        }
    },
    {
        customId: 'music_vol_up',
        async execute(interaction) {
            const queue = musicService.player.nodes.get(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'Nic nie gra!', flags: [MessageFlags.Ephemeral] });

            const currentVol = queue.node.volume;
            const newVol = Math.min(currentVol + 10, 100);
            queue.node.setVolume(newVol);
            
            await interaction.deferUpdate();
            musicService.updateDashboard(queue, queue.currentTrack);
        }
    },
    {
        customId: 'music_vol_down',
        async execute(interaction) {
            const queue = musicService.player.nodes.get(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'Nic nie gra!', flags: [MessageFlags.Ephemeral] });

            const currentVol = queue.node.volume;
            const newVol = Math.max(currentVol - 10, 0);
            queue.node.setVolume(newVol);
            
            await interaction.deferUpdate();
            musicService.updateDashboard(queue, queue.currentTrack);
        }
    }
];
