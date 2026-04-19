const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const db = require('../../../core/database');

/**
 * autoVoiceHandler - Obsługuje interakcje z Panelem Władcy (Auto-Voice).
 */
/**
 * Pomocnicza funkcja sprawdzająca czy użytkownik jest aktualnym Władcą (ma uprawnienia ManageChannels)
 */
function isOwner(interaction) {
    return interaction.member.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels);
}

const ERROR_NOT_OWNER = { error: 'Tylko aktualny Władca tej komnaty może nią zarządzać!' };

/**
 * autoVoiceHandler - Obsługuje interakcje z Panelem Władcy (Auto-Voice).
 */
module.exports = [
    // 1. BLOKADA KANAŁU
    {
        customId: 'av_lock',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                Connect: false
            });

            await interaction.reply(uiEngine.render('AUTOVOICE.LOCKED', {}, { type: 'PRIMARY', ephemeral: true }));
        }
    },
    // 2. ODBLOKOWANIE KANAŁU
    {
        customId: 'av_unlock',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                Connect: true
            });

            await interaction.reply(uiEngine.render('AUTOVOICE.UNLOCKED', {}, { type: 'SUCCESS', ephemeral: true }));
        }
    },
    // 3. TRYB DUCHA (VIEW_CHANNEL)
    {
        customId: 'av_ghost',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const channel = interaction.channel;
            const everyone = interaction.guild.roles.everyone;
            const canSee = channel.permissionOverwrites.cache.get(everyone.id)?.allow.has(PermissionFlagsBits.ViewChannel);

            if (canSee !== false) {
                // Ukryj
                await channel.permissionOverwrites.edit(everyone, { ViewChannel: false });
                await interaction.reply(uiEngine.render('AUTOVOICE.GHOST_MODE_ON', {}, { type: 'INFO', ephemeral: true }));
            } else {
                // Pokaż
                await channel.permissionOverwrites.edit(everyone, { ViewChannel: true });
                await interaction.reply(uiEngine.render('AUTOVOICE.GHOST_MODE_OFF', {}, { type: 'SUCCESS', ephemeral: true }));
            }
        }
    },
    // 4. ZMIANA NAZWY (MODAL)
    {
        customId: 'av_rename',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const modal = new ModalBuilder()
                .setCustomId('av_modal_rename')
                .setTitle('📝 Zmień nazwę komnaty');

            const nameInput = new TextInputBuilder()
                .setCustomId('new_name')
                .setLabel('Nowa nazwa')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('np. Karczma u Janka')
                .setMinLength(2)
                .setMaxLength(30)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(nameInput));
            await interaction.showModal(modal);
        }
    },
    // Handler dla Modala Zmiany Nazwy
    {
        customId: 'av_modal_rename',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const newName = interaction.fields.getTextInputValue('new_name');
            await interaction.channel.setName(newName);
            
            await interaction.reply(uiEngine.render('AUTOVOICE.RENAMED', { name: newName }, { type: 'SUCCESS', ephemeral: true }));
        }
    },
    // 5. LIMIT OSÓB (MODAL)
    {
        customId: 'av_limit',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const modal = new ModalBuilder()
                .setCustomId('av_modal_limit')
                .setTitle('👥 Ustaw limit osób');

            const limitInput = new TextInputBuilder()
                .setCustomId('user_limit')
                .setLabel('Liczba osób (0 = brak limitu)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('0-99')
                .setMinLength(1)
                .setMaxLength(2)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(limitInput));
            await interaction.showModal(modal);
        }
    },
    // Handler dla Modala Limitu
    {
        customId: 'av_modal_limit',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const limit = parseInt(interaction.fields.getTextInputValue('user_limit'));
            if (isNaN(limit) || limit < 0 || limit > 99) {
                return interaction.reply({ content: '❌ Podaj poprawną liczbę od 0 do 99.', flags: [MessageFlags.Ephemeral] });
            }

            await interaction.channel.setUserLimit(limit);
            await interaction.reply({ content: `✅ Limit osób ustawiony na: **${limit === 0 ? 'Brak limitu' : limit}**.`, flags: [MessageFlags.Ephemeral] });
        }
    },
    // 6. ZAPIS USTAWIEŃ
    {
        customId: 'av_save',
        async execute(interaction) {
            if (!isOwner(interaction)) {
                return interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', ERROR_NOT_OWNER, { type: 'DANGER', ephemeral: true }));
            }

            const channel = interaction.channel;
            const guild = interaction.guild;

            // Sprawdzamy czy everyone ma Connect: false
            const everyonePerms = channel.permissionOverwrites.cache.get(guild.roles.everyone.id);
            const isLocked = everyonePerms?.deny.has(PermissionFlagsBits.Connect) || false;

            // Zapis w bazie
            await db.prisma.userVoiceSettings.upsert({
                where: {
                    userId_guildId: {
                        userId: interaction.user.id,
                        guildId: guild.id
                    }
                },
                update: {
                    name: channel.name,
                    userLimit: channel.userLimit,
                    isLocked: isLocked
                },
                create: {
                    userId: interaction.user.id,
                    guildId: guild.id,
                    name: channel.name,
                    userLimit: channel.userLimit,
                    isLocked: isLocked
                }
            });

            await interaction.reply(uiEngine.render('AUTOVOICE.SAVED', {
                name: channel.name,
                limit: channel.userLimit === 0 ? 'Brak limitu' : channel.userLimit,
                locked: isLocked ? 'Tak' : 'Nie'
            }, { type: 'SUCCESS', ephemeral: true }));
        }
    }
];
