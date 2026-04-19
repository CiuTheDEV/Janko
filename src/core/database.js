const { PrismaClient } = require('@prisma/client');

/**
 * Klasa zarządzająca połączeniem z bazą danych (Natywna Prisma 6)
 */
class Database {
    constructor() {
        this.prisma = null;
    }

    /**
     * Waliduje i przygotowuje konfigurację
     */
    validateConfig() {
        // Jeśli mamy DATABASE_URL w env, używamy go bezpośrednio (zgodnie z schema.prisma)
        if (process.env.DATABASE_URL) {
            return process.env.DATABASE_URL;
        }

        // Rezerwowy mechanizm budowania URL z pojedynczych zmiennych
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || '3306';
        const user = process.env.DB_USER;
        const pass = process.env.DB_PASSWORD;
        const name = process.env.DB_NAME;

        if (!user || !pass || !name) {
            throw new Error('Brak wymaganych zmiennych środowiskowych bazy danych (DB_USER, DB_PASSWORD lub DB_NAME).');
        }

        // Budowanie URL (z encode dla znaków specjalnych w haśle)
        const encodedPass = encodeURIComponent(pass);
        return `mysql://${user}:${encodedPass}@${host}:${port}/${name}`;
    }

    /**
     * Inicjalizuje połączenie natywnego silnika Prisma
     */
    async connect() {
        console.log(' [DB] Inicjalizacja natywnego silnika Prisma...');

        try {
            const datasourceUrl = this.validateConfig();
            
            // Tworzymy instancję Prisma korzystając z natywnych bibliotek (Shared Library)
            // To omija problemy z Driver Adapterami i pool timeoutami
            this.prisma = new PrismaClient({
                datasources: {
                    db: { url: datasourceUrl }
                }
            });

            // Prosta weryfikacja połączenia
            await this.prisma.$connect();
            console.log(' [DB] Pomyślnie połączono z bazą danych (Silnik Natywny).');

            return this.prisma;
        } catch (error) {
            console.error(' [DB] KRYTYCZNY BŁĄD POŁĄCZENIA NATYWNEGO:');
            console.error(` > Kod: ${error.code || 'Brak'}`);
            console.error(` > Wiadomość: ${error.message}`);
            
            throw error;
        }
    }

    /**
     * Rozłącza bazę danych
     */
    async disconnect() {
        if (this.prisma) {
            await this.prisma.$disconnect();
            console.log(' [DB] Rozłączono z bazą danych.');
        }
    }
}

module.exports = new Database();
