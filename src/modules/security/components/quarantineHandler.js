const securityService = require('../services/SecurityService');

module.exports = [
    {
        customId: 'security_approve',
        async execute(interaction) {
            const userId = interaction.customId.split('_').pop();
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();

            const response = await securityService.approveUser(interaction.guild, userId, interaction.user);
            
            // Disable buttons in original message
            await interaction.editReply({ components: [] });
            
            // Send success log
            await interaction.followUp(response);
        }
    },
    {
        customId: 'security_kick',
        async execute(interaction) {
            const userId = interaction.customId.split('_').pop();
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();

            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (member) {
                await member.kick(`Kwarantanna odrzucona (Kick) przez ${interaction.user.tag}`);
            }

            const db = require('../../../core/database');
            await db.prisma.quarantineSession.updateMany({
                where: { guildId: interaction.guild.id, userId: userId, status: 'ACTIVE' },
                data: { status: 'REJECTED' }
            });

            const uiEngine = require('../../../core/uiEngine');
            const response = uiEngine.render('SECURITY.KICKED', { user: member ? member.user.tag : userId });
            
            // Disable buttons in original message
            await interaction.editReply({ components: [] });
            
            // Send log
            await interaction.followUp(response);
        }
    },
    {
        customId: 'security_reject',
        async execute(interaction) {
            const userId = interaction.customId.split('_').pop();
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();

            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (member) {
                await member.ban({ reason: `Kwarantanna odrzucona przez ${interaction.user.tag}` });
            }

            const db = require('../../../core/database');
            await db.prisma.quarantineSession.updateMany({
                where: { guildId: interaction.guild.id, userId: userId, status: 'ACTIVE' },
                data: { status: 'REJECTED' }
            });

            const uiEngine = require('../../../core/uiEngine');
            const response = uiEngine.render('SECURITY.REJECTED', { user: member ? member.user.tag : userId });
            
            // Disable buttons
            await interaction.editReply({ components: [] });
            
            // Send rejection log
            await interaction.followUp(response);
        }
    }
];
