require('dotenv').config();
const { REST, Routes } = require('discord.js');
const Discovery = require('./discovery');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Walidacja wymaganych zmiennych środowiskowych
if (!token || !clientId) {
    console.error('\n [!] BŁĄD KONFIGURACJI:');
    if (!token) console.error(' > Brak DISCORD_TOKEN w pliku .env');
    if (!clientId) console.error(' > Brak CLIENT_ID w pliku .env');
    console.log('\n Upewnij się, że plik .env jest poprawnie wypełniony.\n');
    process.exit(1);
}

const isClearMode = process.argv.includes('--clear');
const commands = [];

// Dynamiczne ładowanie komend przy użyciu Discovery (Audit V5 P2 Fix)
if (!isClearMode) {
    console.log('[*] Skanowanie modułów w poszukiwaniu komend...');
    const result = Discovery.discoverCommands();
    
    // Jeśli są błędy kontraktu, przerywamy (Audit V7 P2 - Fail Fast Policy)
    if (result.errors.length > 0) {
        console.error(`\n [!] KRYTYCZNY BŁĄD: Znaleziono błędy w ${result.errors.length} komendach:`);
        result.errors.forEach(err => console.error(` - ${err}`));
        console.error('\n Rejestracja została przerwana. Napraw kontrakty komend przed ponowną próbą.');
        process.exit(1);
    }

    for (const cmd of result.commands) {
        commands.push(cmd.data.toJSON());
        console.log(`[DEPLOY] Znaleziono /${cmd.data.name} (Domena: ${cmd.domain})`);
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        if (isClearMode) {
            console.log('\n--- Rozpoczynam czyszczenie komend ---');
            
            console.log('[-] Usuwanie komend globalnych...');
            await rest.put(Routes.applicationCommands(clientId), { body: [] });
            
            if (guildId) {
                console.log(`[-] Usuwanie komend z serwera: ${guildId}`);
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
            }
            
            console.log('[+] Wszystkie komendy zostały usunięte.');
        } else {
            console.log(`\n--- Rejestracja komend (${guildId ? 'Tryb Guild' : 'Tryb Global'}) ---`);
            
            const route = guildId 
                ? Routes.applicationGuildCommands(clientId, guildId) 
                : Routes.applicationCommands(clientId);

            console.log(`[*] Wysyłanie ${commands.length} komend do Discord API...`);
            
            await rest.put(route, { body: commands });
            
            console.log('[SUCCESS] Komendy zostały zaktualizowane pomyślnie.');
        }
    } catch (error) {
        console.error('\n [!] BŁĄD PODCZAS OPERACJI NA KOMENDACH:');
        console.error(error);
        process.exitCode = 1;
    }
})();
