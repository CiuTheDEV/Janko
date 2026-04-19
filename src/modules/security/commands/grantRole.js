const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const temporalRoleService = require('../services/TemporalRoleService');
const uiEngine = require('../../../core/uiEngine');
const TimeParser = require('../../../core/utils/timeParser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grant-role')
        .setDescription('⏳ Nadaje czasową rolę użytkownikowi.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(option => 
            option.setName('uzytkownik')
                .setDescription('Komu nadać rolę?')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('rola')
                .setDescription('Jaka rola?')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('czas')
                .setDescription('Na jak długo? (np. 1h, 2d, 30m)')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('powiadomienie')
                .setDescription('Czy wysłać DM do użytkownika po wygaśnięciu?')
                .setRequired(false)),

    async execute(interaction) {
        const member = interaction.options.getMember('uzytkownik');
        const role = interaction.options.getRole('rola');
        const duration = interaction.options.getString('czas');
        const notify = interaction.options.getBoolean('powiadomienie') ?? true;

        if (!member) {
            return interaction.reply({ 
                content: '❌ Nie znaleziono wskazanego użytkownika na tym serwerze.', 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        // 1. Sprawdzenie uprawnień bota
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ 
                ...uiEngine.render('GLOBAL.ERROR_PERMISSIONS'), 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        // 2. Sprawdzenie hierarchii ról (Bot vs Rola)
        if (role.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({ 
                ...uiEngine.render('GLOBAL.ERROR_HIERARCHY'), 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        // 3. Sprawdzenie hierarchii ról (Użytkownik vs Rola - opcjonalne, ale dobra praktyka)
        // Strażnik nie może nadać roli wyższej niż on sam posiada
        if (interaction.user.id !== interaction.guild.ownerId && role.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: '❌ Nie możesz nadać roli równej lub wyższej od Twojej najwyższej rangi.', 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        // 4. Proces nadawania roli
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
            const result = await temporalRoleService.grantRole(
                interaction.guild,
                member,
                role,
                duration,
                interaction.user,
                notify
            );

            if (!result.success) {
                return interaction.editReply({ content: `❌ ${result.error}` });
            }

            const response = uiEngine.render('SECURITY.TEMPORAL_GRANT', {
                user: member.toString(),
                role: role.name,
                duration: duration,
                moderator: interaction.user.tag,
                expiry: TimeParser.format(result.expiresAt)
            });

            await interaction.editReply(response);

        } catch (error) {
            console.error('[GRANT-ROLE] Błąd:', error);
            await interaction.editReply(`❌ Wystąpił błąd podczas nadawania roli: ${error.message}`);
        }
    }
};
