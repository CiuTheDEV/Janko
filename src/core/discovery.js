const fs = require('fs');
const path = require('path');

/**
 * Discovery - Współdzielona logika odkrywania i walidacji modułów.
 * Zapewnia "Single Source of Truth" dla Loadera i Deplaya.
 */
class Discovery {
    /**
     * Skanuje wszystkie moduły w poszukiwaniu komend.
     * @returns {Object[]} Lista obiektów komend { data, execute, domain, file }
     */
    static discoverCommands() {
        const modulesPath = path.join(__dirname, '..', 'modules');
        const commands = [];
        const errors = [];

        if (!fs.existsSync(modulesPath)) return { commands, errors };

        const domains = fs.readdirSync(modulesPath);
        for (const domain of domains) {
            const domainPath = path.join(modulesPath, domain);
            if (!fs.statSync(domainPath).isDirectory()) continue;

            const commandsPath = path.join(domainPath, 'commands');
            if (!fs.existsSync(commandsPath)) continue;

            const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
            for (const file of files) {
                try {
                    const fullPath = path.join(commandsPath, file);
                    const command = require(fullPath);

                    // Walidacja kontraktu (Audit V6 P1 Hardening)
                    if (!command.data || typeof command.execute !== 'function') {
                        throw new Error(`Brak 'data' lub 'execute' nie jest funkcją.`);
                    }

                    if (typeof command.data.toJSON !== 'function') {
                        throw new Error(`'data' musi być obiektem SlashCommandBuilder (brak toJSON).`);
                    }

                    commands.push({
                        ...command,
                        domain,
                        file,
                        fullPath
                    });
                } catch (error) {
                    errors.push(`Command [${domain}/${file}]: ${error.message}`);
                }
            }
        }

        return { commands, errors };
    }

    /**
     * Skanuje wszystkie moduły w poszukiwaniu komponentów UI.
     * @returns {Object[]} Lista obiektów komponentów { customId, execute, domain, file }
     */
    static discoverComponents() {
        const modulesPath = path.join(__dirname, '..', 'modules');
        const components = [];
        const errors = [];

        if (!fs.existsSync(modulesPath)) return { components, errors };

        const domains = fs.readdirSync(modulesPath);
        for (const domain of domains) {
            const domainPath = path.join(modulesPath, domain);
            if (!fs.statSync(domainPath).isDirectory()) continue;

            const componentsPath = path.join(domainPath, 'components');
            if (!fs.existsSync(componentsPath)) continue;

            const files = fs.readdirSync(componentsPath).filter(f => f.endsWith('.js'));
            for (const file of files) {
                try {
                    const fullPath = path.join(componentsPath, file);
                    const exported = require(fullPath);

                    // Wsparcie dla eksportowania tablicy komponentów w jednym pliku
                    const componentsArray = Array.isArray(exported) ? exported : [exported];

                    for (const component of componentsArray) {
                        // Walidacja kontraktu (Audit V7 P3 Hardening)
                        if (typeof component.customId !== 'string' || component.customId.length === 0) {
                            throw new Error(`Niepoprawny lub brakujący 'customId'.`);
                        }
                        if (typeof component.execute !== 'function') {
                            throw new Error(`'execute' musi być funkcją.`);
                        }

                        components.push({
                            ...component,
                            domain,
                            file,
                            fullPath
                        });
                    }
                } catch (error) {
                    errors.push(`Component [${domain}/${file}]: ${error.message}`);
                }
            }
        }

        return { components, errors };
    }
    /**
     * Skanuje wszystkie moduły w poszukiwaniu eventów.
     * @returns {Object[]} Lista obiektów eventów { name, execute, domain, file }
     */
    static discoverEvents() {
        const modulesPath = path.join(__dirname, '..', 'modules');
        const events = [];
        const errors = [];

        if (!fs.existsSync(modulesPath)) return { events, errors };

        const domains = fs.readdirSync(modulesPath);
        for (const domain of domains) {
            const domainPath = path.join(modulesPath, domain);
            if (!fs.statSync(domainPath).isDirectory()) continue;

            const eventsPath = path.join(domainPath, 'events');
            if (!fs.existsSync(eventsPath)) continue;

            const files = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
            for (const file of files) {
                try {
                    const fullPath = path.join(eventsPath, file);
                    const event = require(fullPath);

                    // Walidacja kontraktu
                    if (typeof event.name !== 'string' || event.name.length === 0) {
                        throw new Error(`Niepoprawna lub brakująca nazwa eventu (name).`);
                    }
                    if (typeof event.execute !== 'function') {
                        throw new Error(`Brakująca funkcja wykonawcza (execute) w evencie.`);
                    }

                    events.push({
                        ...event,
                        domain,
                        file,
                        fullPath
                    });
                } catch (error) {
                    errors.push(`Event [${domain}/${file}]: ${error.message}`);
                }
            }
        }

        return { events, errors };
    }
}

module.exports = Discovery;
