const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const configService = require('../../config/services/configService');
const uiEngine = require('../../../core/uiEngine');
const db = require('../../../core/database');

/**
 * AutoVoiceService - Zarządzanie dynamicznymi kanałami głosowymi.
 */
class AutoVoiceService {
    constructor() {
        this.tempChannels = new Set();
    }

    /**
     * Główny handler dla zmiany stanu głosowego
     */
    async handleUpdate(oldState, newState) {
        const guildId = newState.guild.id || oldState.guild.id;
        const config = await configService.get(guildId);

        if (!config || !config.autoVoiceEnabled || !config.autoVoiceCh) return;

        // 1. Dołączenie do kanału tworzącego
        if (newState.channelId === config.autoVoiceCh) {
            await this.createKomnata(newState.member, config);
        }

        // 2. Opuszczenie kanału
        if (oldState.channelId && oldState.channelId !== newState.channelId) {
            const channel = oldState.channel;
            
            // Czy to kanał tymczasowy?
            const isTemp = this.tempChannels.has(channel.id) || 
                         (config.autoVoiceCategory && channel.parentId === config.autoVoiceCategory && channel.id !== config.autoVoiceCh);

            if (isTemp) {
                // Jeśli kanał nie jest pusty, sprawdź czy wyszedł lider
                if (channel.members.size > 0) {
                    const wasOwner = channel.permissionOverwrites.cache.get(oldState.member.id)?.allow.has(PermissionFlagsBits.ManageChannels);
                    if (wasOwner) {
                        const newOwner = channel.members.first();
                        if (newOwner) {
                            await this.transferOwnership(channel, oldState.member, newOwner);
                        }
                    }
                } else {
                    // Kanał pusty -> sprzątanie
                    await this.cleanupChannel(channel, config);
                }
            }
        }
    }

    /**
     * Przekazuje uprawnienia nowemu liderowi
     */
    async transferOwnership(channel, oldOwner, newOwner) {
        try {
            // 1. Odbierz uprawnienia staremu (jeśli jeszcze nie wyszedł - np. przy przenoszeniu, ale tu zwykle już wyszedł)
            await channel.permissionOverwrites.delete(oldOwner.id);

            // 2. Nadaj uprawnienia nowemu
            await channel.permissionOverwrites.edit(newOwner.id, {
                ManageChannels: true,
                MoveMembers: true,
                MuteMembers: true,
                DeafenMembers: true,
                Connect: true
            });

            // 3. Poinformuj na chacie + Daj nowy panel
            const panel = uiEngine.render('AUTOVOICE.PANEL', {});
            const actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('av_lock').setLabel('Zablokuj').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('av_unlock').setLabel('Odblokuj').setEmoji('🔓').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('av_ghost').setLabel('Tryb Ducha').setEmoji('👻').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('av_rename').setLabel('Zmień nazwę').setEmoji('📝').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('av_limit').setLabel('Limit osób').setEmoji('👥').setStyle(ButtonStyle.Secondary)
            );

            const actionRow2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('av_save').setLabel('Zapisz na stałe').setEmoji('💾').setStyle(ButtonStyle.Success)
            );

            const embed = uiEngine.render('AUTOVOICE.NEW_LEADER', {
                oldLeader: oldOwner.displayName,
                newLeader: `<@${newOwner.id}>`
            }, { type: 'INFO' });

            await channel.send({
                ...embed,
                components: [actionRow, actionRow2]
            });

        } catch (error) {
            console.error('[AutoVoiceService] Błąd podczas przekazywania władzy:', error);
        }
    }

    /**
     * Tworzy nową "Komnatę" dla użytkownika
     */
    async createKomnata(member, config) {
        try {
            const guild = member.guild;
            const categoryId = config.autoVoiceCategory;

            // 1. Pobierz zapisane ustawienia użytkownika
            const savedSettings = await db.prisma.userVoiceSettings.findUnique({
                where: {
                    userId_guildId: {
                        userId: member.id,
                        guildId: guild.id
                    }
                }
            });

            const channelName = savedSettings?.name || `🏮 Komnata: ${member.displayName}`;
            const userLimit = savedSettings?.userLimit || 0;
            const isLocked = savedSettings?.isLocked || false;

            // 2. Przygotowanie uprawnień
            const overwrites = [
                {
                    id: member.id,
                    allow: [
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MoveMembers,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.DeafenMembers,
                        PermissionFlagsBits.Connect
                    ]
                },
                {
                    id: guild.roles.everyone.id,
                    allow: [PermissionFlagsBits.ViewChannel]
                }
            ];

            // Jeśli kanał ma być zablokowany od startu
            if (isLocked) {
                overwrites[1].deny = [PermissionFlagsBits.Connect];
            } else {
                overwrites[1].allow.push(PermissionFlagsBits.Connect);
            }

            const newChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildVoice,
                parent: categoryId || null,
                userLimit: userLimit,
                permissionOverwrites: overwrites
            });

            await member.voice.setChannel(newChannel);
            this.tempChannels.add(newChannel.id);

            // --- PANEL WŁADCY ---
            const panel = uiEngine.render('AUTOVOICE.PANEL', {});
            const actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('av_lock')
                    .setLabel('Zablokuj')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('av_unlock')
                    .setLabel('Odblokuj')
                    .setEmoji('🔓')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('av_ghost')
                    .setLabel('Tryb Ducha')
                    .setEmoji('👻')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('av_rename')
                    .setLabel('Zmień nazwę')
                    .setEmoji('📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('av_limit')
                    .setLabel('Limit osób')
                    .setEmoji('👥')
                    .setStyle(ButtonStyle.Secondary)
            );

            const actionRow2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('av_save')
                    .setLabel('Zapisz na stałe')
                    .setEmoji('💾')
                    .setStyle(ButtonStyle.Success)
            );

            await newChannel.send({
                content: `Witaj <@${member.id}>! Twoja komnata jest gotowa.`,
                ...panel,
                components: [actionRow, actionRow2]
            });

        } catch (error) {
            console.error('[AutoVoiceService] Błąd podczas tworzenia komnaty:', error);
        }
    }

    /**
     * Usuwa kanał jeśli jest pusty i należy do systemu Auto-Voice
     */
    async cleanupChannel(channel, config) {
        try {
            // Sprawdzamy czy kanał jest pusty
            if (channel.members.size > 0) return;

            // Sprawdzamy czy to kanał tymczasowy (przez Set lub przynależność do kategorii)
            const isTemp = this.tempChannels.has(channel.id) || 
                         (config.autoVoiceCategory && channel.parentId === config.autoVoiceCategory && channel.id !== config.autoVoiceCh);

            if (isTemp) {
                // Małe opóźnienie dla stabilności (uniknięcie race condition)
                setTimeout(async () => {
                    try {
                        // Ponowne sprawdzenie po timeout
                        const freshChannel = channel.guild.channels.cache.get(channel.id);
                        if (freshChannel && freshChannel.members.size === 0) {
                            await freshChannel.delete('Królewskie Komnaty: Automatyczne sprzątanie.');
                            this.tempChannels.delete(channel.id);
                        }
                    } catch (e) {
                        // Kanał mógł zostać usunięty ręcznie
                        this.tempChannels.delete(channel.id);
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('[AutoVoiceService] Błąd podczas sprzątania komnaty:', error);
        }
    }
}

module.exports = new AutoVoiceService();
