const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const uiEngine = require('../../../core/uiEngine');

/**
 * MusicService - Serce Barda Janko.
 * Zarządza odtwarzaczem muzyki, kolejkami i zdarzeniami dźwiękowymi.
 */
class MusicService {
    constructor() {
        this.player = null;
        this.client = null;
    }

    /**
     * Inicjalizuje gracza (Player) i rejestruje ekstraktory.
     * Wywoływane przy starcie bota (event ready).
     */
    async init(client) {
        if (this.player) return;
        
        console.log(' [MUSIC] Inicjalizacja Barda Janko...');
        this.client = client;
        
        this.player = new Player(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        });

        // Ładowanie domyślnych ekstraktorów (YouTube, Spotify itp.)
        await this.player.extractors.loadMulti(DefaultExtractors);
        
        console.log(' [MUSIC] Ekstraktory załadowane. Bard Janko gotowy.');

        // --- Zdarzenia Odtwarzacza ---

        this.player.events.on('playerStart', (queue, track) => {
            console.log(` [MUSIC] Start odtwarzania: ${track.title} na ${queue.guild.name}`);
            this.updateDashboard(queue, track);
        });

        this.player.events.on('audioTrackAdd', (queue, track) => {
            // Można dodać powiadomienie o dodaniu do kolejki
        });

        this.player.events.on('emptyChannel', (queue) => {
            console.log(` [MUSIC] Kanał pusty na ${queue.guild.name}. Rozłączam.`);
            queue.delete();
        });

        this.player.events.on('error', (queue, error) => {
            console.error(` [MUSIC] Błąd kolejki (${queue.guild.name}):`, error);
        });

        this.player.events.on('playerError', (queue, error) => {
            console.error(` [MUSIC] Błąd odtwarzania (${queue.guild.name}):`, error);
        });
    }

    /**
     * Odświeża lub wysyła dashboard odtwarzacza.
     */
    async updateDashboard(queue, track) {
        try {
            const channel = queue.metadata.channel;
            const user = track.requestedBy || queue.metadata.user;
            
            const renderData = {
                title: track.title,
                author: track.author,
                duration: track.duration,
                channel: queue.channel.name,
                volume: queue.node.volume,
                user: user ? user.toString() : 'Nieznany podróżnik',
                queueInfo: queue.tracks.size > 0 ? `+ ${queue.tracks.size} kolejnych pieśni` : '_Kolejka pusta_'
            };

            const ui = uiEngine.render('BARD.PLAYER', renderData, {
                // Przyciski odtwarzacza (wielorzędowe)
                buttons: [
                    // Rząd 1: Kontrola odtwarzania
                    [
                        { id: 'music_pause', label: '⏸️/▶️', style: 'SECONDARY' },
                        { id: 'music_skip', label: '⏭️ Skip', style: 'PRIMARY' },
                        { id: 'music_stop', label: '⏹️ Stop', style: 'DANGER' },
                        { id: 'music_queue', label: '📜 Kolejka', style: 'SECONDARY' },
                        { id: 'music_add', label: '➕ Dodaj', style: 'SUCCESS' }
                    ],
                    // Rząd 2: Kontrola głośności
                    [
                        { id: 'music_vol_down', label: '🔉 Głośność -', style: 'SECONDARY' },
                        { id: 'music_vol_up', label: '🔊 Głośność +', style: 'SECONDARY' }
                    ]
                ],
                thumbnail: track.thumbnail
            });

            // Jeśli mamy zapisaną wiadomość dashboardu, edytujemy ją. 
            // W przeciwnym razie wysyłamy nową.
            if (queue.metadata.lastMessage) {
                await queue.metadata.lastMessage.edit(ui).catch(() => {});
            } else {
                const msg = await channel.send(ui);
                queue.metadata.lastMessage = msg;
            }
        } catch (error) {
            console.error(' [MUSIC] Błąd aktualizacji dashboardu:', error);
        }
    }
}

module.exports = new MusicService();
