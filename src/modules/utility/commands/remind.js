const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, MentionableSelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('przypomnij')
        .setDescription('Otwiera interaktywny Dashboard Herolda do tworzenia przypomnień')
        .addStringOption(option =>
            option.setName('wiadomosc')
                .setDescription('Treść przypomnienia (możesz też wpisać ją później)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('czas')
                .setDescription('Szybki czas (np. 15m, 1h) - opcjonalnie')
                .setRequired(false)),

    async execute(interaction, client) {
        const content = interaction.options.getString('wiadomosc') || 'Nowe Obwieszczenie';
        const timeStr = interaction.options.getString('czas');
        const duration = timeStr || null;
        
        try {
            const draft = await client.db.reminder.create({
                data: {
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    channelId: interaction.channel.id,
                    content: content,
                    duration: duration,
                    remindAt: null, 
                    status: 'DRAFT',
                    deliveryType: 'BOTH',
                    messageType: 'EMBED'
                }
            });

            const dashboard = uiEngine.render('HEROLD.DASHBOARD', {
                content: content,
                duration: duration ? `za ${duration}` : '🚩 Nie ustawiono',
                delivery: '📡 Oba (Kanał + DM)',
                format: 'EMBED',
                image: '❌ Brak',
                targets: '👤 Tylko Ty'
            });

            const timeMenu = new StringSelectMenuBuilder()
                .setCustomId(`herold_time_${draft.id}`)
                .setPlaceholder('⏱️ Wybierz czas przypomnienia...')
                .addOptions([
                    { label: '1 minuta', value: '1m', description: 'Ekspresowe obwieszczenie' },
                    { label: '5 minut', value: '5m' },
                    { label: '15 minut', value: '15m' },
                    { label: '30 minut', value: '30m' },
                    { label: '1 godzina', value: '1h' },
                    { label: '3 godziny', value: '3h' },
                    { label: 'Jutro', value: '1d', description: '24 godziny od teraz' }
                ]);

            const targetMenu = new MentionableSelectMenuBuilder()
                .setCustomId(`herold_targets_${draft.id}`)
                .setPlaceholder('👥 Kogo mam powiadomić prywatnie?')
                .setMinValues(1)
                .setMaxValues(10);

            const actionRow1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`herold_edit_${draft.id}`)
                    .setLabel('Edytuj treść')
                    .setEmoji('📝')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`herold_image_${draft.id}`)
                    .setLabel('Obraz')
                    .setEmoji('🖼️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`herold_format_${draft.id}`)
                    .setLabel('Format: EMBED')
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

            await interaction.reply({
                ...dashboard,
                components: [
                    new ActionRowBuilder().addComponents(timeMenu),
                    new ActionRowBuilder().addComponents(targetMenu),
                    actionRow1,
                    actionRow2
                ]
            });

        } catch (error) {
            console.error('[HEROLD DASHBOARD] Błąd:', error);
            if (!interaction.replied) {
                await interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', { error: 'Nie udało się zainicjować Dashboardu.' }, { type: 'DANGER', ephemeral: true }));
            }
        }
    }
};
