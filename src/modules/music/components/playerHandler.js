const { MessageFlags } = require('discord.js');
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
            // W przyszłości: Modal do wpisania nowej pieśni
            await interaction.reply({ content: 'Ta funkcja będzie dostępna wkrótce! Użyj `/bard <pieśń>`, aby dodać kolejny utwór.', flags: [MessageFlags.Ephemeral] });
        }
    }
];
