const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../core/database');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ostrzezenia')
        .setDescription('Lista ostrzeżeń użytkownika.')
        .addUserOption(option => 
            option.setName('użytkownik')
                .setDescription('Użytkownik, którego ostrzeżenia chcesz sprawdzić')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('użytkownik');

        try {
            const infractions = await db.prisma.userInfraction.findMany({
                where: {
                    guildId: interaction.guild.id,
                    userId: targetUser.id,
                    type: 'WARN'
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            });
            
            const preview = uiEngine.render('MODERATION.LIST', { user: targetUser.tag, list: '', count: 0 });
            await interaction.deferReply({ flags: preview.ephemeral ? ['Ephemeral'] : [] });

            if (infractions.length === 0) {
                return interaction.editReply(uiEngine.render('MODERATION.LIST_EMPTY', { user: targetUser.tag }));
            }

            const listText = infractions.map((inf, index) => 
                `**${index + 1}.** [ID: #${inf.id}] - ${inf.reason} *(<t:${Math.floor(inf.createdAt.getTime() / 1000)}:R>)*`
            ).join('\n');

            const message = uiEngine.render('MODERATION.LIST', {
                user: targetUser.tag,
                list: listText,
                count: infractions.length
            });

            // Ustawiamy stopkę ręcznie jeśli uiEngine jej jeszcze nie wspiera dynamicznie w description
            message.embeds[0].setFooter({ text: `Łącznie: ${infractions.length} ostrzeżeń` });

            await interaction.editReply(message);

        } catch (error) {
            console.error(' [WARNINGS] Błąd:', error);
            await interaction.reply({ content: ' Wystąpił błąd podczas pobierania listy ostrzeżeń.', ephemeral: true });
        }
    },
};
