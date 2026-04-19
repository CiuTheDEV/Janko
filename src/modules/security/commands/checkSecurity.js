const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const securityService = require('../services/SecurityService');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-security')
        .setDescription('🛡️ Przeprowadza audyt bezpieczeństwa serwera.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const audit = await securityService.runSecurityAudit(interaction.guild);
        const statusLabel = uiEngine.renderText(`SECURITY.${audit.statusKey}`);

        const response = uiEngine.render('SECURITY.AUDIT_MAIN', {
            guild: interaction.guild.name,
            score: audit.score,
            status: statusLabel
        });

        // Map risks to embed fields
        if (audit.risks.length > 0) {
            response.embeds[0].addFields(audit.risks.map(r => ({
                name: r.label,
                value: r.value,
                inline: false
            })));
        }

        const row = new ActionRowBuilder();

        // Add fix buttons if needed
        if (audit.risks.some(r => r.type === 'EVERYONE_PERMS')) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('security_fix_everyone')
                    .setLabel('Napraw @everyone')
                    .setEmoji('🛡️')
                    .setStyle(ButtonStyle.Success)
            );
        }

        if (row.components.length > 0) {
            response.components = [row];
        }

        await interaction.editReply(response);
    }
};
