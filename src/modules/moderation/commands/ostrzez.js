const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const modService = require('../ModerationService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ostrzez')
        .setDescription('Nadaje ostrzeżenie użytkownikowi.')
        .addUserOption(option => 
            option.setName('użytkownik')
                .setDescription('Użytkownik do ostrzeżenia')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('powód')
                .setDescription('Powód ostrzeżenia')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('użytkownik');
        const targetUser = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        // Renderujemy wstępnie, aby sprawdzić flagę ephemeral w szablonie
        const preview = uiEngine.render('MODERATION.WARN', {});

        // Odraczamy odpowiedź zgodnie z konfiguracją szablonu
        await interaction.deferReply({ flags: preview.ephemeral ? [MessageFlags.Ephemeral] : [] });

        if (target && !modService.canModerate(interaction.member, target)) {
            return interaction.editReply({ 
                content: ' Nie możesz ostrzec tego użytkownika.'
            });
        }

        try {
            // 1. Zapisz w bazie i logach (serwis obsłuży auto-punishment)
            await modService.addInfraction({
                guild: interaction.guild,
                user: targetUser,
                moderator: interaction.user,
                type: 'WARN',
                reason: reason
            });

            const totalWarns = await modService.getWarnCount(interaction.guild, targetUser);
            const successMsg = uiEngine.render('MODERATION.WARN_SUCCESS', {
                user: targetUser.tag,
                reason: reason,
                totalWarns: totalWarns
            }, { type: 'SUCCESS' });

            await interaction.editReply(successMsg);

        } catch (error) {
            console.error(' [WARN] Błąd:', error);
            await interaction.editReply({ 
                content: ' Wystąpił błąd podczas nadawania ostrzeżenia.'
            });
        }
    },
};
