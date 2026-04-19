const Discovery = require('./discovery');

/**
 * Loader - Serce architektury Domain-First
 * Pozwala na automatyczne ładowanie modułów przy użyciu Discovery.
 */
class Loader {
    constructor() {
        this.stats = {
            commands: 0,
            events: 0,
            components: 0,
            errors: []
        };
    }

    /**
     * Główna funkcja ładująca wszystkie zasoby
     */
    static async loadAll(client) {
        const loader = new Loader();
        
        console.log('--- Rozpoczynam ładowanie modułów ---');

        // 1. Ładowanie Komend
        const cmdResult = Discovery.discoverCommands();
        loader.stats.errors.push(...cmdResult.errors);
        
        for (const cmd of cmdResult.commands) {
            try {
                if (client.commands.has(cmd.data.name)) {
                    throw new Error(`Duplikat nazwy komendy: /${cmd.data.name}`);
                }
                client.commands.set(cmd.data.name, cmd);
                loader.stats.commands++;
                console.log(`[CMD] /${cmd.data.name} (Domena: ${cmd.domain})`);
            } catch (error) {
                loader.stats.errors.push(`Command [${cmd.domain}/${cmd.file}]: ${error.message}`);
                console.error(`[ERROR] Command ${cmd.file}:`, error.message);
            }
        }

        // 2. Ładowanie Eventów
        const eventResult = Discovery.discoverEvents();
        loader.stats.errors.push(...eventResult.errors);

        for (const evt of eventResult.events) {
            try {
                if (evt.once) {
                    client.once(evt.name, (...args) => evt.execute(...args, client));
                } else {
                    client.on(evt.name, (...args) => evt.execute(...args, client));
                }
                loader.stats.events++;
                console.log(`[EVENT] ${evt.name} (Domena: ${evt.domain})`);
            } catch (error) {
                loader.stats.errors.push(`Event [${evt.domain}/${evt.file}]: ${error.message}`);
                console.error(`[ERROR] Event ${evt.file}:`, error.message);
            }
        }

        // 3. Ładowanie Komponentów
        const compResult = Discovery.discoverComponents();
        loader.stats.errors.push(...compResult.errors);

        for (const comp of compResult.components) {
            try {
                if (client.components.has(comp.customId)) {
                    throw new Error(`Duplikat customId komponentu: ${comp.customId}`);
                }
                client.components.set(comp.customId, comp);
                loader.stats.components++;
                console.log(`[COMP] ${comp.customId} (Domena: ${comp.domain})`);
            } catch (error) {
                loader.stats.errors.push(`Component [${comp.domain}/${comp.file}]: ${error.message}`);
                console.error(`[ERROR] Component ${comp.file}:`, error.message);
            }
        }

        loader.printSummary();

        if (loader.stats.errors.length > 0) {
            console.error('\n [!] KRYTYCZNY BŁĄD ŁADOWANIA MODUŁÓW!');
            throw new Error(`Loader failed with ${loader.stats.errors.length} errors.`);
        }
    }

    /**
     * Wypisuje podsumowanie ładowania (Audit V5)
     */
    printSummary() {
        console.log(`\n========================================`);
        console.log(` [LOADER] ZAKOŃCZONO ŁADOWANIE`);
        console.log(` > Komendy: ${this.stats.commands}`);
        console.log(` > Eventy:  ${this.stats.events}`);
        console.log(` > UI Comp: ${this.stats.components}`);
        
        if (this.stats.errors.length > 0) {
            console.warn(`\n [!] WYKRYTO BŁĘDY (${this.stats.errors.length}):`);
            this.stats.errors.forEach(err => console.error(` - ${err}`));
        } else {
            console.log(`\n [SUCCESS] Wszystkie moduły załadowane poprawnie.`);
        }
        console.log(`========================================\n`);
    }
}

module.exports = Loader;
