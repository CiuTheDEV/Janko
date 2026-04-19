const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const musicService = require('../services/MusicService');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../../config/services/configService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bard')
        .setDescription('Wezwij Barda Janko do swojego kanału głosowego.')
        .addStringOption(option => 
            option.setName('pieśń')
                .setDescription('Tytuł pieśni lub link (YouTube/Spotify)')
                .setRequired(false)),
    
    async execute(interaction, client) {
        const query = interaction.options.getString('pieśń');
        const channel = interaction.member.voice.channel;

        // 1. Walidacja obecności na kanale
        if (!channel) {
            return interaction.reply(uiEngine.render('BARD.ERROR_NOT_IN_VOICE', {}, { flags: [MessageFlags.Ephemeral] }));
        }

        // 2. Jeśli bot już gra, a użytkownik jest na innym kanale
        const queue = musicService.player.nodes.get(interaction.guildId);
        if (queue && queue.channel.id !== channel.id) {
            return interaction.reply(uiEngine.render('BARD.ERROR_SAME_VOICE', {}, { flags: [MessageFlags.Ephemeral] }));
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const config = await configService.get(interaction.guildId);

        // 3. Sprawdzenie rangi DJ (jeśli ustawiona)
        if (config.musicDjRole && !interaction.member.roles.cache.has(config.musicDjRole) && !interaction.member.permissions.has('Administrator')) {
            return interaction.editReply(uiEngine.render('BARD.ERROR_DJ_ONLY', {}, { flags: [MessageFlags.Ephemeral] }));
        }

        try {
            // 4. Rozpoczęcie odtwarzania lub dodanie do kolejki
            const { track } = await musicService.player.play(channel, query || 'lofi medieval music', {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        user: interaction.user
                    },
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 30000,
                    leaveOnEnd: false,
                    selfDeaf: true,
                    volume: config.musicVolume || 50
                }
            });

            return interaction.editReply({ 
                content: `🎶 Bard Janko stroi instrumenty dla: **${track.title}**`
            });

        } catch (error) {
            console.error(' [MUSIC] Błąd komendy /bard:', error);
            return interaction.editReply({ 
                content: '❌ Przykro mi Panie, lecz nie potrafię wydobyć dźwięku z tej pieśni...' 
            });
        }
    }
};
