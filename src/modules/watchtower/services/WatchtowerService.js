const configService = require('../../config/services/configService');
const uiEngine = require('../../../core/uiEngine');

/**
 * WatchtowerService - Centralna usługa monitoringu i logowania zdarzeń.
 * Odpowiada za wysyłanie profesjonalnych logów administracyjnych.
 */
class WatchtowerService {
    /**
     * Główna metoda logująca zdarzenia systemowe.
     * @param {Guild} guild Serwer
     * @param {string} templateKey Klucz szablonu (bez prefixu WATCHTOWER.)
     * @param {Object} data Dane do placeholderów
     * @param {Object} options Opcje (type: 'DANGER', 'WARNING'...)
     */
    async log(guild, templateKey, data = {}, options = {}) {
        const config = await configService.get(guild.id);
        if (!config || !config.logsCh) return;

        // --- Sprawdzanie przełączników Watchtower ---
        const category = templateKey.split('_')[0]; // np. MSG, MEMBER, CHANNEL, ROLE, MODERATION
        
        const toggles = {
            'MSG': config.watchtowerLogMessages,
            'MEMBER': config.watchtowerLogMembers,
            'CHANNEL': config.watchtowerLogChannels,
            'ROLE': config.watchtowerLogRoles
        };

        // Specjalna obsługa dla MODERATION - tylko SPAM jest przełączalny w tej kategorii
        if (templateKey === 'MODERATION_SPAM' && config.watchtowerLogSpam === false) return;

        // Jeśli kategoria jest zdefiniowana w przełącznikach i jest wyłączona - przerywamy
        if (toggles[category] === false) return;
        // --------------------------------------------

        const channel = guild.channels.cache.get(config.logsCh);
        if (!channel) return;

        // Renderowanie za pomocą uiEngine
        const message = uiEngine.render(`WATCHTOWER.${templateKey}`, data, {
            type: options.type || 'PRIMARY',
            thumbnail: options.thumbnail || data.thumbnail,
            image: options.image || data.image
        });

        if (!message.embeds || message.embeds.length === 0) return;

        // Dodanie ikony Watchtower i ewentualnie wykonawcy do stopki
        const executorPart = data.executor ? `Wykonawca: ${data.executor} | ` : '';
        const footerText = `Watchtower | ${executorPart}Janko Security`;
        
        message.embeds[0].setFooter({ 
            text: footerText,
            iconURL: guild.iconURL() 
        });

        try {
            await channel.send(message);
        } catch (error) {
            console.error(` [WATCHTOWER] Błąd wysyłania logu na kanał ${config.logsCh}:`, error);
        }
    }

    /**
     * Pobiera wykonawcę akcji z Audit Logów (best-effort).
     * @param {Guild} guild 
     * @param {number} type AuditLogEvent (np. 72 dla MessageDelete)
     * @param {string} targetId ID celu (np. autora wiadomości)
     * @returns {Promise<string|null>} Tag wykonawcy lub null
     */
    async getExecutor(guild, type, targetId) {
        try {
            // Wymaga uprawnień VIEW_AUDIT_LOG
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: type
            });
            const entry = auditLogs.entries.first();
            
            if (!entry) return null;
            
            // Sprawdzenie czy log dotyczy właściwego celu
            // Dla usunięcia wiadomości targetId w audit logu to ID autora, nie ID wiadomości
            if (entry.target?.id !== targetId) return null;
            
            // Sprawdzenie czasu (czy log jest świeży - ostatnie 10 sekund)
            if (Date.now() - entry.createdTimestamp > 10000) return null;

            return entry.executor ? entry.executor.tag : null;
        } catch (error) {
            return null;
        }
    }
}

module.exports = new WatchtowerService();
