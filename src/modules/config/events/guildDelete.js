const { Events } = require('discord.js');

/**
 * Event: GuildDelete
 * Wyzwalany, gdy bot opuszcza serwer lub serwer zostaje usunięty.
 * Zgodnie z decyzją Architekta, usuwamy wszystkie powiązane dane (Czystka Pożegnalna).
 */
module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(guild, client) {
        if (!guild || !guild.id) return;
        
        console.log(`\n [CLEANUP] Bot opuścił gildię: ${guild.name || 'Unknown'} (${guild.id})`);
        console.log(` [CLEANUP] Rozpoczynam procedurę usuwania danych (Czystka Pożegnalna)...`);

        try {
            // 1. Usuwanie konfiguracji gildii
            const deletedConfig = await client.db.guildConfig.delete({
                where: { guildId: guild.id }
            }).catch(() => null);

            // 2. Usuwanie historii kar
            const infractionResult = await client.db.userInfraction.deleteMany({
                where: { guildId: guild.id }
            });

            // 3. Usuwanie przypomnień (Herold)
            const reminderResult = await client.db.reminder.deleteMany({
                where: { guildId: guild.id }
            });

            console.log(` [CLEANUP] Sukces dla ${guild.id}:`);
            console.log(`   > Konfiguracja: ${deletedConfig ? 'Usunięta' : 'Brak w bazie'}`);
            console.log(`   > Infekcje: ${infractionResult.count} usuniętych`);
            console.log(`   > Przypomnienia: ${reminderResult.count} usuniętych\n`);
            
        } catch (error) {
            console.error(` [CLEANUP] BŁĄD podczas czyszczenia danych dla gildii ${guild.id}:`, error.message);
        }
    }
};
