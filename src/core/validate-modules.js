const Loader = require('./loader');

/**
 * MockClient - Udaje klienta Discorda do celów walidacji
 */
class MockClient {
    constructor() {
        this.commands = new Map();
        this.components = new Map();
        // Dummy event listeners
        this.on = () => {};
        this.once = () => {};
    }
}

async function validate() {
    console.log('--- ROZPOCZYNANIE WALIDACJI MODUŁÓW ---\n');
    const mockClient = new MockClient();
    
    try {
        await Loader.loadAll(mockClient);
        console.log('\n[SUCCESS] Walidacja zakończona pomyślnie. Wszystkie moduły są zgodne z kontraktem.');
        process.exit(0);
    } catch (error) {
        console.error(`\n[FAIL] Walidacja przerwana: ${error.message}`);
        process.exit(1);
    }
}

validate();
