const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const watchtowerService = require('../../watchtower/services/WatchtowerService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuwa określoną liczbę wiadomości z kanału.')
        .addIntegerOption(option => 
            option.setName('ilość')
                .setDescription('Liczba wiadomości do usunięcia (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('ilość');

        const preview = uiEngine.render('MODERATION.CLEAR', {});
        await interaction.deferReply({ flags: preview.ephemeral ? [MessageFlags.Ephemeral] : [] });

        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);

            await interaction.editReply(uiEngine.render('MODERATION.CLEAR', {
                amount: deleted.size
            }, { type: 'SUCCESS' }));

            // Logowanie do Watchtower
            await watchtowerService.log(interaction.guild, 'MODERATION_CLEAR', {
                channel: interaction.channel.toString(),
                amount: deleted.size,
                moderator: interaction.user.tag
            }, { type: 'SUCCESS' });

        } catch (error) {
            console.error(' [CLEAR] Błąd:', error);
            await interaction.editReply(uiEngine.render('GLOBAL.ERROR_GENERIC', { error: 'Nie mogę usuwać wiadomości starszych niż 14 dni.' }, { type: 'DANGER' }));
        }
    },
};
