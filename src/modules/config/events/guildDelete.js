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

            // 4. Usuwanie kwarantann
            const quarantineResult = await client.db.quarantineSession.deleteMany({
                where: { guildId: guild.id }
            });

            // 5. Usuwanie audytu użytkowników (Teczki)
            const auditResult = await client.db.userAuditEntry.deleteMany({
                where: { guildId: guild.id }
            });

            // 6. Usuwanie historii nicków
            const nicknameResult = await client.db.nicknameHistory.deleteMany({
                where: { guildId: guild.id }
            });

            // 7. Usuwanie snapshotów serwera
            const snapshotResult = await client.db.serverSnapshot.deleteMany({
                where: { guildId: guild.id }
            });

            // 8. Usuwanie ról czasowych
            const temporalResult = await client.db.temporalRole.deleteMany({
                where: { guildId: guild.id }
            });

            // 9. Usuwanie ustawień głosowych
            const voiceResult = await client.db.userVoiceSettings.deleteMany({
                where: { guildId: guild.id }
            });

            console.log(` [CLEANUP] Sukces dla ${guild.id}:`);
            console.log(`   > Konfiguracja: ${deletedConfig ? 'Usunięta' : 'Brak w bazie'}`);
            console.log(`   > Infekcje: ${infractionResult.count}`);
            console.log(`   > Przypomnienia: ${reminderResult.count}`);
            console.log(`   > Kwarantanny: ${quarantineResult.count}`);
            console.log(`   > Audyty: ${auditResult.count}`);
            console.log(`   > Nicknamy: ${nicknameResult.count}`);
            console.log(`   > Snapshoty: ${snapshotResult.count}`);
            console.log(`   > Role czasowe: ${temporalResult.count}`);
            console.log(`   > Ustawienia głosowe: ${voiceResult.count}\n`);
            
        } catch (error) {
            console.error(` [CLEANUP] BŁĄD podczas czyszczenia danych dla gildii ${guild.id}:`, error.message);
        }
    }
};
