require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, Partials } = require('discord.js');
const db = require('./src/core/database');
const Loader = require('./src/core/loader');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ]
});

// Kolekcje do przechowywania komend i komponentów
client.commands = new Collection();
client.components = new Collection();

// Globalny handler interakcji (Slash Commands / UI Components / Modals)
client.on(Events.InteractionCreate, async interaction => {
    // 1. Slash Commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            await handleInteractionError(interaction, error);
        }
    } 
    
    // 2. UI Components (Buttons, Select Menus) & Modals
    else if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
        const customId = interaction.customId;
        let component = client.components.get(customId);

        // Jeśli brak dokładnego dopasowania, szukamy po prefixie (standard: prefix_id)
        if (!component) {
            const parts = customId.split('_');
            // Próbujemy dopasować coraz krótsze prefixy (np. herold_modal_msg -> herold_modal -> herold)
            for (let i = parts.length - 1; i > 0; i--) {
                const prefix = parts.slice(0, i).join('_');
                component = client.components.get(prefix);
                if (component) break;
            }
        }

        if (!component) return;

        try {
            await component.execute(interaction, client);
        } catch (error) {
            await handleInteractionError(interaction, error);
        }
    }
});

/**
 * Wspólny handler dla błędów w interakcjach
 */
async function handleInteractionError(interaction, error) {
    console.error(`Błąd interakcji (${interaction.customId || interaction.commandName}):`, error);
    
    // Zapobiegaj próbie odpowiedzi, jeśli interakcja wygasła (Unknown Interaction)
    if (error.code === 10062) {
        console.warn(' [INTERACTION] Pominąłem odpowiedź o błędzie - interakcja wygasła (10062).');
        return;
    }

    const { MessageFlags } = require('discord.js');
    const errorMessage = { content: ' Wystąpił błąd podczas obsługi tej interakcji!', flags: [MessageFlags.Ephemeral] };
    
    try {
        if (interaction.replied) {
            await interaction.followUp(errorMessage).catch(() => {});
        } else if (interaction.deferred) {
            await interaction.editReply(errorMessage).catch(() => {});
        } else {
            await interaction.reply(errorMessage).catch(() => {});
        }
    } catch (err) {
        console.error(' [CORE] Krytyczny błąd w handlerze błędów:', err.message);
    }
}

client.once(Events.ClientReady, () => {
    console.log(`\n========================================`);
    console.log(` [READY] Zalogowano jako ${client.user.tag}`);
    console.log(` [SYSTEM] Janko jest gotowy.`);
    console.log(`========================================\n`);
});

/**
 * Procedura bezpiecznego wyłączania bota (Graceful Shutdown)
 */
async function shutdown(signal) {
    console.log(`\n[SHUTDOWN] Otrzymano sygnał ${signal}. Rozpoczynam procedurę kończenia...`);
    
    try {
        await db.disconnect();
        client.destroy();
        console.log('[SHUTDOWN] Wszystkie połączenia zamknięte. Do widzenia!');
        process.exit(0);
    } catch (error) {
        console.error('[SHUTDOWN] Wystąpił błąd podczas zamykania:', error);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Główna funkcja startowa bota
async function startBot() {
    console.log('--- Janko Bot Boot ---');
    
    try {
        // 1. Logowanie do bazy danych
        await db.connect();
        client.db = db.prisma; // Przypisujemy dopiero po udanym połączeniu!

        // 2. Ładowanie modułów (Domain-First)
        await Loader.loadAll(client);

        // 3. Logowanie do Discorda
        if (!process.env.DISCORD_TOKEN) {
            console.error(' Błąd: Brak tokenu Discord w pliku .env!');
            process.exit(1);
        }
        
        console.log('\n[*] Łączenie z Discord API...');
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error(' [!] KRYTYCZNY BŁĄD STARTU:');
        console.error(` > ${error.message}`);
        
        // Sprzątanie zasobów w przypadku błędu (Audit V6 P2 Fix)
        if (db.prisma || db.pool) {
            console.log('[*] Próba bezpiecznego zamknięcia połączeń po błędzie...');
            await db.disconnect().catch(err => console.error('Błąd przy dyskonekcji:', err));
        }
        
        process.exit(1);
    }
}

startBot();
