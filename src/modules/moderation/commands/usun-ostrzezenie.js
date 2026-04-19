const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../core/database');
const uiEngine = require('../../../core/uiEngine');
const modService = require('../ModerationService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usun-ostrzezenie')
        .setDescription('Usuwa konkretne ostrzeżenie użytkownika po ID.')
        .addIntegerOption(option => 
            option.setName('id')
                .setDescription('ID ostrzeżenia (widoczne w /ostrzezenia)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const infractionId = interaction.options.getInteger('id');

        try {
            // 1. Sprawdź czy kara istnieje
            const infraction = await db.prisma.userInfraction.findUnique({
                where: { id: infractionId }
            });

            if (!infraction || infraction.guildId !== interaction.guild.id) {
                return interaction.reply({ 
                    content: ' Nie znaleziono ostrzeżenia o podanym ID na tym serwerze.', 
                    ephemeral: true
                });
            }

            if (infraction.type !== 'WARN') {
                return interaction.reply({ 
                    content: ' Podane ID nie dotyczy ostrzeżenia (WARN), lecz innej kary.', 
                    ephemeral: true
                });
            }

            // 2. Usuń karę przez serwis (obsłuży logi)
            const result = await modService.removeWarn(interaction.guild, infractionId, interaction.user);

            if (!result) {
                return interaction.reply({ 
                    content: ' Nie udało się usunąć ostrzeżenia.', 
                    ephemeral: true
                });
            }

            await interaction.reply(uiEngine.render('MODERATION.REMOVE_SUCCESS', { id: infractionId }, { type: 'SUCCESS' }));

        } catch (error) {
            console.error(' [REMOVE_WARN] Błąd:', error);
            await interaction.reply({ 
                content: ' Wystąpił błąd podczas usuwania ostrzeżenia.', 
                ephemeral: true
            });
        }
    },
};
