const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sprawdza opóźnienie bota.'),
    
    async execute(interaction, client) {
        // Renderujemy szablon ping
        const preview = uiEngine.render('SYSTEM.PING', { latency: '...', api: '...' });

        await interaction.reply({ 
            content: '🏓 Pinging...', 
            flags: preview.ephemeral ? [MessageFlags.Ephemeral] : [] 
        });

        const sent = await interaction.fetchReply();
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply(uiEngine.render('SYSTEM.PING', {
            latency: latency,
            api: Math.round(client.ws.ping)
        }));
    },
};
