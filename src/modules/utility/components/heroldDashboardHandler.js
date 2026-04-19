const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');

/**
 * heroldDashboardHandler - Obsługuje wszystkie interakcje z Dashboardem Herolda.
 */
module.exports = [
    // 1. EDYCJA TREŚCI
    {
        customId: 'herold_edit',
        async execute(interaction, client) {
            const draftId = interaction.customId.split('_')[2];
            const draft = await client.db.reminder.findUnique({ where: { id: parseInt(draftId) } });

            const modal = new ModalBuilder()
                .setCustomId(`herold_modal_msg_${draft.id}`)
                .setTitle('⚔️ Zmień treść obwieszczenia');

            const textInput = new TextInputBuilder()
                .setCustomId('message_content')
                .setLabel('Treść przypomnienia')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(draft.content)
                .setMinLength(1)
                .setMaxLength(500)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(textInput));
            await interaction.showModal(modal);
        }
    },
    {
        customId: 'herold_modal_msg',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[3]);
            const newContent = interaction.fields.getTextInputValue('message_content');

            const draft = await client.db.reminder.update({
                where: { id: draftId },
                data: { content: newContent }
            });

            await updateDashboard(interaction, draft);
        }
    },
    // 2. EDYCJA OBRAZU
    {
        customId: 'herold_image',
        async execute(interaction, client) {
            const draftId = interaction.customId.split('_')[2];
            const draft = await client.db.reminder.findUnique({ where: { id: parseInt(draftId) } });

            const modal = new ModalBuilder()
                .setCustomId(`herold_modal_img_${draft.id}`)
                .setTitle('🖼️ Dodaj grafikę do obwieszczenia');

            const textInput = new TextInputBuilder()
                .setCustomId('image_url')
                .setLabel('URL obrazu (direct link)')
                .setPlaceholder('https://example.com/image.png')
                .setStyle(TextInputStyle.Short)
                .setValue(draft.imageUrl || '')
                .setRequired(false);

            modal.addComponents(new ActionRowBuilder().addComponents(textInput));
            await interaction.showModal(modal);
        }
    },
    {
        customId: 'herold_modal_img',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[3]);
            const imageUrl = interaction.fields.getTextInputValue('image_url');

            const draft = await client.db.reminder.update({
                where: { id: draftId },
                data: { imageUrl: imageUrl || null }
            });

            await updateDashboard(interaction, draft);
        }
    },
    // 3. ZMIANA FORMATU (TEXT / EMBED)
    {
        customId: 'herold_format',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[2]);
            const draft = await client.db.reminder.findUnique({ where: { id: draftId } });

            const nextFormat = draft.messageType === 'EMBED' ? 'TEXT' : 'EMBED';

            const updatedDraft = await client.db.reminder.update({
                where: { id: draftId },
                data: { messageType: nextFormat }
            });

            await updateDashboard(interaction, updatedDraft);
        }
    },
    // 4. ZMIANA CZASU
    {
        customId: 'herold_time',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[2]);
            const duration = interaction.values[0];

            const draft = await client.db.reminder.update({
                where: { id: draftId },
                data: { duration }
            });

            await updateDashboard(interaction, draft);
        }
    },
    // 5. ZMIANA CELÓW
    {
        customId: 'herold_targets',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[2]);
            const targets = [];
            
            interaction.members.forEach(m => targets.push({ id: m.id, type: 'user' }));
            interaction.roles.forEach(r => targets.push({ id: r.id, type: 'role' }));

            const draft = await client.db.reminder.update({
                where: { id: draftId },
                data: { targets: JSON.stringify(targets) }
            });

            await updateDashboard(interaction, draft);
        }
    },
    // 6. ZMIANA KANAŁU (TOGGLE)
    {
        customId: 'herold_type',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[2]);
            const draft = await client.db.reminder.findUnique({ where: { id: draftId } });

            const types = ['BOTH', 'CHANNEL', 'DM'];
            const currentIndex = types.indexOf(draft.deliveryType);
            const nextType = types[(currentIndex + 1) % types.length];

            const updatedDraft = await client.db.reminder.update({
                where: { id: draftId },
                data: { deliveryType: nextType }
            });

            await updateDashboard(interaction, updatedDraft);
        }
    },
    // 7. ZATWIERDZENIE
    {
        customId: 'herold_confirm',
        async execute(interaction, client) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            
            const draftId = parseInt(interaction.customId.split('_')[2]);
            const draft = await client.db.reminder.findUnique({ where: { id: draftId } });

            if (!draft.duration) {
                return interaction.followUp({ 
                    ...uiEngine.render('GLOBAL.ERROR_GENERIC', { error: 'Najpierw wybierz czas przypomnienia!' }, { type: 'DANGER' }),
                    flags: [MessageFlags.Ephemeral]
                });
            }

            const heroldService = require('../services/heroldService');
            const remindAt = heroldService.parseTime(draft.duration);

            const updated = await client.db.reminder.update({
                where: { id: draftId },
                data: { 
                    status: 'ACTIVE',
                    remindAt: remindAt
                }
            });

            const timestamp = Math.floor(remindAt.getTime() / 1000);
            
            if (draft.deliveryType === 'DM') {
                return interaction.editReply({
                    content: `✅ **Zlecenie przyjęte prywatnie!**\nRealizacja: <t:${timestamp}:F> (<t:${timestamp}:R>).\n_Nikt na kanale nie został powiadomiony._`,
                    embeds: [],
                    components: []
                });
            }

            const targets = draft.targets ? JSON.parse(draft.targets) : [];
            const targetsText = targets.length > 0 ? targets.map(t => t.type === 'user' ? `<@${t.id}>` : `<@&${t.id}>`).join(', ') : null;

            const publicMessage = uiEngine.render('HEROLD.CONFIRM_ACK', {
                content: draft.content,
                time: `<t:${timestamp}:F> (<t:${timestamp}:R>)`,
                targets: targetsText || 'Brak dodatkowych osób'
            }, { type: 'SUCCESS' });

            const publicResponse = await interaction.channel.send(publicMessage);
            
            await client.db.reminder.update({
                where: { id: draftId },
                data: { confirmationMsgId: publicResponse.id }
            });

            await interaction.editReply({
                content: '✅ **Zlecenie przekazane do realizacji!** Herold ruszył w drogę.',
                embeds: [],
                components: []
            });
        }
    },
    // 8. ANULOWANIE
    {
        customId: 'herold_cancel',
        async execute(interaction, client) {
            const draftId = parseInt(interaction.customId.split('_')[2]);
            await client.db.reminder.delete({ where: { id: draftId } }).catch(() => {});

            await interaction.update({
                content: '❌ Konfiguracja anulowana. Szkic został podarty i wyrzucony.',
                embeds: [],
                components: []
            });
        }
    }
];

/**
 * Funkcja pomocnicza do aktualizacji Dashboardu
 */
async function updateDashboard(interaction, draft) {
    if (!interaction.message) return;
    
    const deliveryMap = { 'BOTH': '📡 Oba (Kanał + DM)', 'CHANNEL': '📢 Tylko Kanał', 'DM': '🔐 Tylko DM' };
    const deliveryVal = deliveryMap[draft.deliveryType] || '📡 Oba';

    let targetsVal = '👤 Tylko Ty';
    if (draft.targets) {
        try {
            const targets = JSON.parse(draft.targets);
            if (targets.length > 0) {
                targetsVal = targets.map(t => t.type === 'user' ? `<@${t.id}>` : `<@&${t.id}>`).join(', ');
            }
        } catch (e) { targetsVal = '👤 Tylko Ty'; }
    }

    const dashboard = uiEngine.render('HEROLD.DASHBOARD', {
        content: draft.content,
        duration: draft.duration ? `za ${draft.duration}` : '🚩 Nie ustawiono',
        delivery: deliveryVal,
        format: draft.messageType || 'EMBED',
        image: draft.imageUrl ? '✅ Ustawiono' : '❌ Brak',
        targets: targetsVal
    });

    // Odtworzenie rzędów przycisków (bo musimy zaktualizować labele)
    const actionRow1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`herold_edit_${draft.id}`)
            .setLabel('Edytuj treść')
            .setEmoji('📝')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`herold_image_${draft.id}`)
            .setLabel(draft.imageUrl ? 'Zmień obraz' : 'Dodaj obraz')
            .setEmoji('🖼️')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`herold_format_${draft.id}`)
            .setLabel(`Format: ${draft.messageType || 'EMBED'}`)
            .setEmoji('🎭')
            .setStyle(ButtonStyle.Secondary)
    );

    const actionRow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`herold_type_${draft.id}`)
            .setLabel('Cel wysyłki')
            .setEmoji('📡')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`herold_confirm_${draft.id}`)
            .setLabel('Zatwierdź')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`herold_cancel_${draft.id}`)
            .setLabel('Anuluj')
            .setStyle(ButtonStyle.Danger)
    );

    // UWAGA: musimy zachować menu (String/Mentionable), ale ich stan się nie zmienia
    // Więc pobieramy je z poprzedniej wiadomości lub tworzymy nowe (bezpieczniej nowe jeśli chcemy być pewni ID)
    // Ale tutaj heroldDashboardHandler tylko aktualizuje embed i przyciski w tym konkretnym rzędzie.
    // Aby nie zgubić Select Menu, musimy je przekazać ponownie.
    
    const components = [
        interaction.message.components[0], // timeMenu
        interaction.message.components[1], // targetMenu
        actionRow1,
        actionRow2
    ];

    await interaction.update({
        ...dashboard,
        components: components
    });
}
