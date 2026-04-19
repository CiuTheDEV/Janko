const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const modService = require('../ModerationService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Wyrzuca użytkownika z serwera.')
        .addUserOption(option => 
            option.setName('użytkownik')
                .setDescription('Użytkownik do wyrzucenia')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('powód')
                .setDescription('Powód wyrzucenia')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('użytkownik');
        const targetUser = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        if (!target) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_NOT_FOUND', {}, { type: 'DANGER' }));
        }

        if (!modService.canModerate(interaction.member, target)) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_HIERARCHY', {}, { type: 'DANGER' }));
        }

        if (!target.kickable) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_PERMISSIONS', {}, { type: 'DANGER' }));
        }

        try {
            await modService.addInfraction({
                guild: interaction.guild,
                user: targetUser,
                moderator: interaction.user,
                type: 'KICK',
                reason: reason
            });

            await target.kick(`${interaction.user.tag}: ${reason}`);

            await interaction.editReply(uiEngine.render('MODERATION.KICK', {
                user: targetUser.tag,
                reason: reason
            }, { type: 'SUCCESS' }));

        } catch (error) {
            console.error(' [KICK] Błąd:', error);
            await interaction.editReply(uiEngine.render('GLOBAL.ERROR_GENERIC', {}, { type: 'DANGER' }));
        }
    },
};
