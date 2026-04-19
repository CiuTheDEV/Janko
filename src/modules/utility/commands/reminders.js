const { SlashCommandBuilder, ActionRowBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('przypomnienia')
        .setDescription('Wyszczególnia Twoje aktywne przypomnienia u Herolda'),

    async execute(interaction, client) {
        try {
            const reminders = await client.db.reminder.findMany({
                where: {
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    status: 'ACTIVE'
                },
                orderBy: { remindAt: 'asc' },
                take: 10
            });

            if (reminders.length === 0) {
                return interaction.reply(uiEngine.render('HEROLD.LIST_EMPTY', {}));
            }

            const listText = reminders.map((r, index) => {
                const timestamp = Math.floor(r.remindAt.getTime() / 1000);
                return `**${index + 1}.** ${r.content.substring(0, 50)}${r.content.length > 50 ? '...' : ''}\n⏰ <t:${timestamp}:R> (<t:${timestamp}:f>)`;
            }).join('\n\n');

            const message = uiEngine.render('HEROLD.LIST', { list: listText });

            const select = new StringSelectMenuBuilder()
                .setCustomId('delete_reminder')
                .setPlaceholder('Wybierz przypomnienie do usunięcia...');

            reminders.forEach((r, index) => {
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${index + 1}. ${r.content.substring(0, 30)}...`)
                        .setDescription(`Data: ${r.remindAt.toLocaleString()}`)
                        .setValue(r.id.toString())
                );
            });

            const row = new ActionRowBuilder().addComponents(select);

            await interaction.reply({
                ...message,
                components: [row],
                flags: message.ephemeral ? [MessageFlags.Ephemeral] : []
            });

        } catch (error) {
            console.error('[COMMAND przypomnienia] Błąd:', error);
            await interaction.reply(uiEngine.render('GLOBAL.ERROR_GENERIC', { error: 'Błąd bazy danych' }, { type: 'DANGER', ephemeral: true }));
        }
    }
};
