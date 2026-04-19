const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const modService = require('../ModerationService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banuje użytkownika na serwerze.')
        .addUserOption(option => 
            option.setName('użytkownik')
                .setDescription('Użytkownik do zbanowania')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('powód')
                .setDescription('Powód bana')
                .setRequired(false))
        .addIntegerOption(option => 
            option.setName('usuń_wiadomości')
                .setDescription('Usuń wiadomości z ostatnich dni')
                .addChoices(
                    { name: 'Nie usuwaj', value: 0 },
                    { name: '1 dzień', value: 1 },
                    { name: '7 dni', value: 7 }
                )
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('użytkownik');
        const targetUser = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';
        const deleteDays = interaction.options.getInteger('usuń_wiadomości') || 0;

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        if (target && !modService.canModerate(interaction.member, target)) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_HIERARCHY', {}, { type: 'DANGER' }));
        }

        if (target && !target.bannable) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_PERMISSIONS', {}, { type: 'DANGER' }));
        }

        try {
            await interaction.guild.members.ban(targetUser.id, { 
                reason: `${interaction.user.tag}: ${reason}`,
                deleteMessageSeconds: deleteDays * 24 * 60 * 60
            });

            await modService.addInfraction({
                guild: interaction.guild,
                user: targetUser,
                moderator: interaction.user,
                type: 'BAN',
                reason: reason
            });

            await interaction.editReply(uiEngine.render('MODERATION.BAN', {
                user: targetUser.tag,
                reason: reason
            }, { type: 'SUCCESS' }));

        } catch (error) {
            console.error(' [BAN] Błąd:', error);
            await interaction.editReply(uiEngine.render('GLOBAL.ERROR_GENERIC', { error: error.message }, { type: 'DANGER' }));
        }
    },
};
