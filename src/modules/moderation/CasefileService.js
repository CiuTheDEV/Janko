const db = require('../../core/database');

/**
 * CasefileService - Persistent user history (Dossier).
 */
class CasefileService {
    
    /**
     * Entry types for UserAuditEntry.
     */
    get EntryType() {
        return {
            JOIN: 'JOIN',
            LEAVE: 'LEAVE',
            AVATAR_CHANGE: 'AVATAR_CHANGE',
            ROLES_SNAPSHOT: 'ROLES_SNAPSHOT'
        };
    }

    /**
     * Logs a general audit entry.
     */
    async logEntry(guildId, userId, type, data = null) {
        try {
            return await db.prisma.userAuditEntry.create({
                data: {
                    guildId,
                    userId,
                    type,
                    data: data ? JSON.stringify(data) : null
                }
            });
        } catch (error) {
            console.error(` [CASEFILE] Error logging entry (${type}):`, error);
        }
    }

    /**
     * Logs a nickname change.
     */
    async logNickname(guildId, userId, oldNickname, newNickname) {
        try {
            return await db.prisma.nicknameHistory.create({
                data: {
                    guildId,
                    userId,
                    oldNickname,
                    newNickname
                }
            });
        } catch (error) {
            console.error(' [CASEFILE] Error logging nickname:', error);
        }
    }

    /**
     * Fetches full casefile data for a user.
     */
    async getCasefileData(guildId, userId) {
        const [infractions, nicknames, entries] = await Promise.all([
            db.prisma.userInfraction.findMany({
                where: { guildId, userId },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            db.prisma.nicknameHistory.findMany({
                where: { guildId, userId },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            db.prisma.userAuditEntry.findMany({
                where: { guildId, userId },
                orderBy: { createdAt: 'desc' },
                take: 15
            })
        ]);

        return { infractions, nicknames, entries };
    }

    /**
     * Pobiera ostatnią migawkę ról użytkownika.
     */
    async getLatestRoleSnapshot(guildId, userId) {
        const snapshot = await db.prisma.userAuditEntry.findFirst({
            where: {
                guildId,
                userId,
                type: this.EntryType.ROLES_SNAPSHOT
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!snapshot || !snapshot.data) return null;
        try {
            const parsed = JSON.parse(snapshot.data);
            return parsed.roleIds || null;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new CasefileService();
