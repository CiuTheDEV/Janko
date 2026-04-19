const db = require('../../../core/database');

/**
 * ConfigService - Zarządza konfiguracją serwerów w bazie danych.
 * Implementuje cache'owanie w pamięci (RAM), aby zminimalizować zapytania do DB.
 */
class ConfigService {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Pobiera konfigurację serwera (z cache lub bazy danych).
     * @param {string} guildId - ID serwera Discord.
     * @returns {Promise<Object>} Dane konfiguracji.
     */
    async get(guildId) {
        if (!guildId) return null;

        // 1. Sprawdź cache
        if (this.cache.has(guildId)) {
            return this.cache.get(guildId);
        }

        // 2. Jeśli nie ma w cache, spróbuj pobrać z bazy lub stwórz domyślną
        let config = await db.prisma.guildConfig.findUnique({
            where: { guildId }
        });

        if (!config) {
            config = await this.init(guildId);
        }

        // 3. Zapisz w cache i zwróć
        this.cache.set(guildId, config);
        return config;
    }

    /**
     * Inicjalizuje domyślną konfigurację dla nowego serwera.
     * @param {string} guildId - ID serwera.
     */
    async init(guildId) {
        console.log(` [CONFIG] Inicjalizacja domyślnej konfiguracji dla: ${guildId}`);
        const newConfig = await db.prisma.guildConfig.create({
            data: { guildId }
        });
        return newConfig;
    }

    /**
     * Aktualizuje konfigurację serwera.
     * @param {string} guildId - ID serwera.
     * @param {Object} data - Dane do aktualizacji.
     */
    async update(guildId, data) {
        console.log(` [CONFIG] Aktualizacja konfiguracji dla: ${guildId}`, data);
        
        const updated = await db.prisma.guildConfig.update({
            where: { guildId },
            data: { ...data }
        });

        // Odśwież cache po aktualizacji
        this.cache.set(guildId, updated);
        return updated;
    }

    /**
     * Czyści cache (np. po usunięciu bota z serwera).
     */
    clearCache(guildId) {
        this.cache.delete(guildId);
    }
}

// Eksportujemy singelton
module.exports = new ConfigService();
