const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const casefileService = require('../CasefileService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('casefile')
        .setDescription('🗂️ Wyświetla teczkę użytkownika (historia kar i aktywności).')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Użytkownik, którego teczkę chcesz przejrzeć.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const guild = interaction.guild;

        // Fetch data from service
        const data = await casefileService.getCasefileData(guild.id, target.id);

        // 1. Format Timeline
        const timelineText = data.entries.length > 0 
            ? data.entries.map(e => {
                const date = `<t:${Math.floor(e.createdAt.getTime() / 1000)}:d>`;
                let label = `**${e.type}**`;
                
                // Map types to user-friendly labels from templates
                if (e.type === 'JOIN') label = uiEngine.renderText('MODERATION.CASEFILE_LABEL_JOIN');
                if (e.type === 'LEAVE') label = uiEngine.renderText('MODERATION.CASEFILE_LABEL_LEAVE');
                if (e.type === 'AVATAR_CHANGE') label = uiEngine.renderText('MODERATION.CASEFILE_LABEL_AVATAR');
                if (e.type === 'NICKNAME_CHANGE') label = uiEngine.renderText('MODERATION.CASEFILE_LABEL_NICK');
                if (e.type === 'ROLES_SNAPSHOT') {
                    const roles = JSON.parse(e.data || '{}').roles;
                    return `• ${date} **${uiEngine.renderText('MODERATION.CASEFILE_LABEL_ROLES')}**: \`${roles}\``;
                }

                return `• ${date} ${label}`;
            }).join('\n')
            : uiEngine.renderText('MODERATION.CASEFILE_NO_DATA');

        // 2. Format Infractions
        const infractionsText = data.infractions.length > 0
            ? data.infractions.map(i => `• \`#${i.id}\` **${i.type}**: ${i.reason} (<t:${Math.floor(i.createdAt.getTime() / 1000)}:R>)`).join('\n')
            : uiEngine.renderText('MODERATION.CASEFILE_NO_DATA');

        // 3. Format Nicknames
        const nicknameText = data.nicknames.length > 0
            ? data.nicknames.map(n => `• \`${n.oldNickname || 'Domyślny'}\` ➔ \`${n.newNickname || 'Domyślny'}\``).join('\n')
            : uiEngine.renderText('MODERATION.CASEFILE_NO_DATA');

        // Render main response
        const response = uiEngine.render('MODERATION.CASEFILE_MAIN', {
            user: target.tag,
            guild: guild.name,
            timeline: timelineText,
            thumbnailUrl: target.displayAvatarURL()
        });

        // Add fields manually
        response.embeds[0].addFields([
            { name: uiEngine.renderText('MODERATION.CASEFILE_FIELD_INFRACTIONS'), value: infractionsText },
            { name: uiEngine.renderText('MODERATION.CASEFILE_FIELD_NICKNAMES'), value: nicknameText }
        ]);

        // Ensure no big image is present
        response.embeds[0].setImage(null);

        await interaction.reply(response);
    }
};
