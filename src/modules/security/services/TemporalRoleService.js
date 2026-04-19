const uiEngine = require('../../../core/uiEngine');
const TimeParser = require('../../../core/utils/timeParser');
const watchtower = require('../../watchtower/services/WatchtowerService');

/**
 * TemporalRoleService - Zarządza uprawnieniami czasowymi.
 */
class TemporalRoleService {
    constructor() {
        this.client = null;
        this.checkInterval = null;
    }

    /**
     * Inicjalizacja i start schedulera
     */
    async init(client) {
        this.client = client;
        console.log(' [SECURITY] System uprawnień czasowych zainicjalizowany.');

        // Sprawdzenie co 60 sekund
        this.checkInterval = setInterval(() => {
            this.checkExpirations();
        }, 60000);

        // Pierwsze sprawdzenie po starcie
        await this.checkExpirations();
    }

    /**
     * Główna pętla sprawdzająca wygasłe role
     */
    async checkExpirations() {
        if (!this.client || !this.client.db) return;

        try {
            const now = new Date();
            const expired = await this.client.db.temporalRole.findMany({
                where: { expiresAt: { lte: now } }
            });

            if (expired.length === 0) return;

            console.log(` [SECURITY] Przetwarzam ${expired.length} wygasłych ról...`);

            for (const entry of expired) {
                await this.processExpiry(entry);
            }
        } catch (error) {
            console.error('[TemporalRoleService] Błąd podczas sprawdzania wygaśnięć:', error);
        }
    }

    /**
     * Proces odebrania wygasłej roli
     */
    async processExpiry(entry) {
        try {
            const guild = this.client.guilds.cache.get(entry.guildId);
            if (!guild) {
                await this.client.db.temporalRole.delete({ where: { id: entry.id } });
                return;
            }

            const member = await guild.members.fetch(entry.userId).catch(() => null);
            const role = guild.roles.cache.get(entry.roleId);

            if (member && role && member.roles.cache.has(role.id)) {
                await member.roles.remove(role, 'Wygaśnięcie uprawnień czasowych');
                
                // Powiadomienie DM (tylko jeśli flaga notifyUser jest true)
                if (entry.notifyUser !== false) {
                    const dmEmbed = uiEngine.render('SECURITY.TEMPORAL_DM', {
                        user: member.user.username,
                        role: role.name,
                        guild: guild.name
                    });
                    await member.send(dmEmbed).catch(() => {});
                }

                // Log do Watchtower
                await watchtower.log(guild, 'TEMPORAL_EXPIRED', {
                    user: member.toString(),
                    role: role.name
                }, { type: 'WARNING' });
            }

            // Usunięcie z bazy
            await this.client.db.temporalRole.delete({ where: { id: entry.id } });

        } catch (error) {
            console.error(`[TemporalRoleService] Błąd przy procesowaniu wygaśnięcia ${entry.id}:`, error);
        }
    }

    /**
     * Nadaje czasową rolę
     */
    async grantRole(guild, member, role, durationStr, moderator, notifyUser = true) {
        const expiresAt = TimeParser.parse(durationStr);
        if (!expiresAt) return { success: false, error: 'Niepoprawny format czasu (np. 1h, 2d).' };

        // Sprawdzenie czy użytkownik już ma tę rolę czasowo (jeśli tak, aktualizujemy)
        const existing = await this.client.db.temporalRole.findFirst({
            where: { guildId: guild.id, userId: member.id, roleId: role.id }
        });

        if (existing) {
            await this.client.db.temporalRole.update({
                where: { id: existing.id },
                data: { expiresAt, notifyUser }
            });
        } else {
            await this.client.db.temporalRole.create({
                data: {
                    guildId: guild.id,
                    userId: member.id,
                    roleId: role.id,
                    expiresAt,
                    notifyUser
                }
            });
        }

        // Nadanie roli na Discordzie
        await member.roles.add(role, `Nadano czasowo przez ${moderator.tag} na ${durationStr}`);

        // Log do Watchtower
        await watchtower.log(guild, 'TEMPORAL_GRANT', {
            user: member.toString(),
            role: role.name,
            duration: durationStr,
            executor: moderator.tag,
            expiry: TimeParser.format(expiresAt)
        }, { type: 'SUCCESS' });

        return { success: true, expiresAt };
    }
}

module.exports = new TemporalRoleService();
