const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const modService = require('../ModerationService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Nakłada czasowe wyciszenie na użytkownika.')
        .addUserOption(option => 
            option.setName('użytkownik')
                .setDescription('Użytkownik do wyciszenia')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('czas')
                .setDescription('Czas trwania wyciszenia')
                .addChoices(
                    { name: 'Zdejmij wyciszenie', value: 0 },
                    { name: '1 minuta', value: 60 },
                    { name: '5 minut', value: 300 },
                    { name: '10 minut', value: 600 },
                    { name: '1 godzina', value: 3600 },
                    { name: '24 godziny', value: 86400 },
                    { name: '1 tydzień', value: 604800 }
                )
                .setRequired(true))
        .addStringOption(option => 
            option.setName('powód')
                .setDescription('Powód wyciszenia')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('użytkownik');
        const durationSeconds = interaction.options.getInteger('czas');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        if (!target) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_NOT_FOUND', {}, { type: 'DANGER' }));
        }

        if (!modService.canModerate(interaction.member, target)) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_HIERARCHY', {}, { type: 'DANGER' }));
        }

        if (durationSeconds > 0 && !target.moderatable) {
            return interaction.editReply(uiEngine.render('GLOBAL.ERROR_PERMISSIONS', {}, { type: 'DANGER' }));
        }

        try {
            if (durationSeconds === 0) {
                await target.timeout(null, `${interaction.user.tag}: ${reason}`);

                await modService.addInfraction({
                    guild: interaction.guild,
                    user: target.user,
                    moderator: interaction.user,
                    type: modService.InfractionType.UNTIMEOUT,
                    reason: reason
                });

                await interaction.editReply(uiEngine.render('MODERATION.UNDO', {
                    user: target.user.tag
                }, { type: 'SUCCESS' }));
            } else {
                await target.timeout(durationSeconds * 1000, `${interaction.user.tag}: ${reason}`);

                await modService.addInfraction({
                    guild: interaction.guild,
                    user: target.user,
                    moderator: interaction.user,
                    type: modService.InfractionType.TIMEOUT,
                    reason: reason,
                    duration: durationSeconds / 60
                });

                await interaction.editReply(uiEngine.render('MODERATION.TIMEOUT', {
                    user: target.user.tag,
                    duration: `${durationSeconds / 60} min`,
                    reason: reason
                }, { type: 'SUCCESS' }));
            }

        } catch (error) {
            console.error(' [TIMEOUT] Błąd:', error);
            await interaction.editReply(uiEngine.render('GLOBAL.ERROR_GENERIC', {}, { type: 'DANGER' }));
        }
    },
};
