const db = require('../../core/database');
const configService = require('../config/services/configService');
const uiEngine = require('../../core/uiEngine');
const watchtowerService = require('../watchtower/services/WatchtowerService');

/**
 * ModerationService - Logika biznesowa dla modułu moderacji.
 * Odpowiada za zapisywanie kar w bazie danych oraz logowanie akcji na kanałach.
 */
class ModerationService {
    
    /**
     * Typy kar obsługiwane przez system.
     */
    get InfractionType() {
        return {
            WARN: 'WARN',
            TIMEOUT: 'TIMEOUT',
            UNTIMEOUT: 'UNTIMEOUT',
            KICK: 'KICK',
            BAN: 'BAN'
        };
    }

    /**
     * Dodaje rekord kary do bazy danych i wysyła log na kanał.
     */
    async addInfraction({ guild, user, moderator, type, reason, duration = null }) {
        try {
            // 1. Zapis w bazie danych
            const infraction = await db.prisma.userInfraction.create({
                data: {
                    guildId: guild.id,
                    userId: user.id,
                    moderatorId: moderator.id,
                    type: type,
                    duration: duration,
                    reason: reason || 'Brak powodu'
                }
            });

            // 2. Powiadomienie DM dla użytkownika
            await this.notifyUser(guild, user, {
                type,
                reason: reason || 'Brak powodu',
                duration: duration ? `${duration} min` : null,
                totalWarns: type === 'WARN' ? await this.getWarnCount(guild, user) : 0
            });

            // 3. Logowanie na kanał administracyjny
            await this.logToChannel(guild, {
                infractionId: infraction.id,
                user,
                moderator,
                type,
                reason: reason || 'Brak powodu',
                duration: duration ? `${duration} min` : null,
                totalWarns: type === 'WARN' ? await this.getWarnCount(guild, user) : 0
            });

            // 4. Sprawdź automatyczne kary
            if (type === this.InfractionType.WARN) {
                await this.checkAutoPunishment(guild, user);
            }

            return infraction;
        } catch (error) {
            console.error(' [MODERATION] Błąd podczas dodawania kary:', error);
            throw error;
        }
    }

    /**
     * Wysyła powiadomienie DM do użytkownika o nałożonej karze.
     */
    async notifyUser(guild, user, data) {
        const config = await configService.get(guild.id);
        if (!config) return;

        // Mapowanie typu kary na pole w konfiguracji
        const fieldMap = {
            WARN: 'notifyWarn',
            TIMEOUT: 'notifyTimeout',
            UNTIMEOUT: 'notifyUntimeout',
            KICK: 'notifyKick',
            BAN: 'notifyBan'
        };

        const configField = fieldMap[data.type];
        if (!configField || !config[configField]) return;

        // Wybór trybu na podstawie konfiguracji serwera
        const renderOptions = {
            mode: config.notifyType || 'TEXT',
            type: data.type === 'UNTIMEOUT' ? 'SUCCESS' : 'DANGER'
        };

        // Wybór szablonu (preferuj wersję _DM dla powiadomień prywatnych)
        const templatePath = `MODERATION.${data.type}_DM`;
        const fallbackPath = `MODERATION.${data.type}`;
        
        // Sprawdź czy wersja _DM istnieje w szablonach (prosta weryfikacja przez uiEngine nie jest możliwa bez exportu templates, 
        // ale wiemy że dodaliśmy je do templates.js)
        const message = uiEngine.render(templatePath, {
            user: user.username,
            guild: guild.name,
            reason: data.reason,
            duration: data.duration,
            totalWarns: data.totalWarns
        }, renderOptions);

        try {
            await user.send(message);
        } catch (err) {
            console.warn(` [MODERATION] Nie można wysłać DM do użytkownika ${user.id}.`);
        }
    }

    /**
     * Pobiera liczbę ostrzeżeń użytkownika.
     */
    async getWarnCount(guild, user) {
        return await db.prisma.userInfraction.count({
            where: {
                guildId: guild.id,
                userId: user.id,
                type: this.InfractionType.WARN
            }
        });
    }

    /**
     * Sprawdza liczbę ostrzeżeń i nakłada automatyczne kary.
     */
    async checkAutoPunishment(guild, user) {
        const warnCount = await this.getWarnCount(guild, user);

        if (warnCount >= 3) {
            const member = await guild.members.fetch(user.id).catch(() => null);
            if (member && member.moderatable) {
                const durationMs = 60 * 60 * 1000; // 1h
                await member.timeout(durationMs, 'Automatyczna kara: Przekroczono limit 3 ostrzeżeń.');
                
                await this.addInfraction({
                    guild,
                    user,
                    moderator: { id: 'SYSTEM', tag: 'System Automatyczny' },
                    type: this.InfractionType.TIMEOUT,
                    reason: 'Przekroczono limit 3 ostrzeżeń.',
                    duration: 60
                });
            }
        }
    }

    /**
     * Usuwa ostrzeżenie i loguje akcję.
     */
    async removeWarn(guild, infractionId, moderator) {
        // 1. Pobierz dane przed usunięciem
        const infraction = await db.prisma.userInfraction.findUnique({
            where: { id: infractionId }
        });

        if (!infraction) return null;

        // 2. Usuń z bazy
        await db.prisma.userInfraction.delete({
            where: { id: infractionId }
        });

        // 3. Logowanie
        const user = await guild.client.users.fetch(infraction.userId).catch(() => ({ tag: 'Unknown', id: infraction.userId }));
        
        await watchtowerService.log(guild, 'MODERATION_REMOVE_WARN', {
            infractionId: infraction.id,
            user: `${user.tag} (${user.id})`,
            moderator: moderator.tag,
        }, { type: 'SUCCESS' });

        return infraction;
    }

    /**
     * Wysyła Embed z informacją o karze na skonfigurowany kanał logów.
     */
    async logToChannel(guild, data) {
        await watchtowerService.log(guild, `MODERATION_${data.type}`, {
            user: `${data.user.tag} (${data.user.id})`,
            moderator: data.moderator.tag || 'System',
            reason: data.reason,
            duration: data.duration,
            totalWarns: data.totalWarns || 'N/A',
            infractionId: data.infractionId
        }, { 
            type: data.type === 'UNTIMEOUT' ? 'SUCCESS' : 'DANGER' 
        });
    }

    /**
     * Sprawdza, czy moderator może wykonać akcję na celu (hierarchia ról).
     * @param {GuildMember} moderator 
     * @param {GuildMember} target 
     * @returns {boolean}
     */
    canModerate(moderator, target) {
        if (!target) return true; // Jeśli użytkownika nie ma na serwerze (np. ban po ID)
        
        // Właściciel serwera zawsze może wszystko
        if (moderator.id === moderator.guild.ownerId) return true;
        
        // Cel jest właścicielem - nikt nie może go ruszyć
        if (target.id === target.guild.ownerId) return false;

        // Porównanie najwyższych ról
        return moderator.roles.highest.position > target.roles.highest.position;
    }
}

module.exports = new ModerationService();
