/**
 * reminderHandler - Obsługa interaktywnych elementów systemu Herold.
 */
module.exports = {
    customId: 'delete_reminder',
    async execute(interaction, client) {
        // Pobieramy ID przypomnienia z wybranej wartości menu
        const reminderId = parseInt(interaction.values[0]);

        if (isNaN(reminderId)) {
            return interaction.reply({ content: '❌ Niepoprawne ID przypomnienia.', ephemeral: true });
        }

        try {
            // Sprawdzamy czy przypomnienie istnieje
            const reminder = await client.db.reminder.findUnique({
                where: { id: reminderId }
            });

            if (!reminder) {
                return interaction.reply({ 
                    content: '📜 Herold nie mógł znaleźć tego wpisu w swoich księgach. Prawdopodobnie został już zrealizowany lub usunięty.', 
                    ephemeral: true 
                });
            }

            // Weryfikacja własności (Bezpieczeństwo)
            if (reminder.userId !== interaction.user.id) {
                return interaction.reply({ 
                    content: '❌ Próbujesz ingerować w cudze zlecenia! Straż została powiadomiona.', 
                    ephemeral: true 
                });
            }

            // Usuwanie z bazy danych
            await client.db.reminder.delete({
                where: { id: reminderId }
            });

            // Aktualizacja wiadomości
            await interaction.update({
                content: '✅ Zlecenie zostało anulowane. Herold wymazał je z pamięci.',
                embeds: [],
                components: []
            });

        } catch (error) {
            console.error('[Herold Handler] Błąd przy usuwaniu:', error.message);
            await interaction.reply({ 
                content: '❌ Wystąpił błąd podczas komunikacji z królewskim archiwum.', 
                ephemeral: true 
            });
        }
    }
};
