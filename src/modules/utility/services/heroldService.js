const uiEngine = require('../../../core/uiEngine');
const TimeParser = require('../../../core/utils/timeParser');

/**
 * HeroldService - Zarządza cyklem życia przypomnień.
 * Skanuje bazę danych i dostarcza powiadomienia w określonym czasie.
 */
class HeroldService {
    constructor() {
        this.client = null;
        this.checkInterval = null;
    }

    /**
     * Inicjalizacja serwisu i start schedulera
     */
    async init(client) {
        this.client = client;
        console.log(' [HEROLD] System przypomnień zainicjalizowany.');

        // Uruchomienie pętli sprawdzającej (co 60 sekund)
        this.checkInterval = setInterval(() => {
            this.processQueue();
            this.cleanDrafts();
        }, 60000);
        
        // Natychmiastowe sprawdzenie raz po starcie
        await this.processQueue();
        await this.cleanDrafts();
    }

    /**
     * Główna funkcja sprawdzająca bazę danych
     */
    async processQueue() {
        if (!this.client || !this.client.db) return;

        try {
            const now = new Date();
            
            const pendingReminders = await this.client.db.reminder.findMany({
                where: {
                    remindAt: { lte: now },
                    status: 'ACTIVE'
                }
            });

            if (pendingReminders.length === 0) return;

            console.log(` [HEROLD] Przetwarzam ${pendingReminders.length} przypomnień...`);

            for (const reminder of pendingReminders) {
                await this.sendReminder(reminder);
            }

        } catch (error) {
            console.error('[HeroldService] Błąd podczas przetwarzania kolejki:', error);
        }
    }

    /**
     * Wysyła przypomnienie do użytkowników i rang
     */
    async sendReminder(reminder) {
        try {
            const guild = this.client.guilds.cache.get(reminder.guildId);
            if (!guild) {
                await this.client.db.reminder.delete({ where: { id: reminder.id } });
                return;
            }

            const channel = guild.channels.cache.get(reminder.channelId);
            const creator = await this.client.users.fetch(reminder.userId).catch(() => null);

            // 1. Lazy Cleanup
            if (channel && reminder.confirmationMsgId) {
                try {
                    const oldMsg = await channel.messages.fetch(reminder.confirmationMsgId);
                    if (oldMsg) await oldMsg.delete();
                } catch (e) {}
            }

            // 2. Przygotowanie celów
            const targets = reminder.targets ? JSON.parse(reminder.targets) : [];
            const userIdsToNotify = new Set();
            if (creator) userIdsToNotify.add(creator.id);

            for (const target of targets) {
                if (target.type === 'user') {
                    userIdsToNotify.add(target.id);
                } else if (target.type === 'role') {
                    const role = guild.roles.cache.get(target.id);
                    if (role) {
                        try {
                            // Optymalizacja: pobieramy tylko członków danej roli
                            const roleMembers = await guild.members.fetch({ role: role.id });
                            roleMembers.forEach(m => userIdsToNotify.add(m.id));
                        } catch (e) {
                            console.error(`[HeroldService] Błąd przy pobieraniu członków roli ${role.id}:`, e);
                        }
                    }
                }
            }

            // 3. Renderowanie
            const delivery = reminder.deliveryType || 'BOTH';
            
            // 4. Wysyłka publiczna
            if (channel && (delivery === 'BOTH' || delivery === 'CHANNEL')) {
                const message = uiEngine.render('HEROLD.CONFIRM', 
                    { 
                        content: reminder.content, 
                        imageUrl: reminder.imageUrl, 
                        guild: guild.name,
                        user: `<@${reminder.userId}>`
                    }, 
                    { mode: reminder.messageType || 'EMBED' }
                );
                const mentionString = Array.from(userIdsToNotify).map(id => `<@${id}>`).join(' ');
                
                await channel.send({ 
                    content: `📢 **Uwaga Mieszkańcy!** ${mentionString}`, 
                    ...message 
                });
            }

            // 5. Wysyłka prywatna
            if (delivery === 'BOTH' || delivery === 'DM') {
                const dmMessage = uiEngine.render('HEROLD.CONFIRM', 
                    { 
                        content: reminder.content, 
                        imageUrl: reminder.imageUrl, 
                        guild: guild.name,
                        user: `<@${reminder.userId}>`
                    }, 
                    { mode: reminder.messageType || 'EMBED' }
                );

                for (const userId of userIdsToNotify) {
                    try {
                        const user = await this.client.users.fetch(userId);
                        if (user && !user.bot) {
                            await user.send(dmMessage).catch(() => {});
                        }
                    } catch (e) {}
                }
            }

            // 6. Usuwamy przypomnienie z bazy
            await this.client.db.reminder.delete({
                where: { id: reminder.id }
            });

        } catch (error) {
            console.error(`[HeroldService] Błąd przy wysyłce przypomnienia ${reminder.id}:`, error);
        }
    }

    /**
     * Parsuje ciąg znaków czasu na obiekt Date
     * Przykład: "1h 30m" -> Date(+90min)
     */
    parseTime(timeStr) {
        return TimeParser.parse(timeStr);
    }

    /**
     * Sprząta niedokończone konfiguracje (DRAFT) starsze niż 15 minut
     */
    async cleanDrafts() {
        if (!this.client || !this.client.db) return;

        try {
            const timeout = new Date(Date.now() - 15 * 60 * 1000);
            const deleted = await this.client.db.reminder.deleteMany({
                where: {
                    status: 'DRAFT',
                    createdAt: { lte: timeout }
                }
            });

            if (deleted.count > 0) {
                console.log(` [HEROLD] Usunięto ${deleted.count} wygasłych szkiców (DRAFT).`);
            }
        } catch (error) {
            console.error('[HeroldService] Błąd podczas czyszczenia draftów:', error);
        }
    }
}

module.exports = new HeroldService();
