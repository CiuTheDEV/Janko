const db = require('../../../core/database');
const { ChannelType } = require('discord.js');

/**
 * SnapshotService - Manages server structural backups.
 */
class SnapshotService {
    /**
     * Creates a full structural snapshot of the guild.
     */
    async takeSnapshot(guild, creatorId, name = null) {
        const roles = guild.roles.cache
            .filter(r => r.name !== '@everyone' && !r.managed)
            .map(r => ({
                id: r.id,
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions.bitfield.toString(),
                position: r.position,
                mentionable: r.mentionable
            }));

        const channels = guild.channels.cache.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            parentId: c.parentId,
            position: c.position,
            topic: c.topic || null,
            nsfw: c.nsfw || false,
            rateLimitPerUser: c.rateLimitPerUser || 0,
            overwrites: c.permissionOverwrites.cache.map(o => ({
                id: o.id,
                type: o.type,
                allow: o.allow.bitfield.toString(),
                deny: o.deny.bitfield.toString()
            }))
        }));

        const snapshotData = {
            roles,
            channels,
            timestamp: Date.now(),
            version: '1.0'
        };

        return await db.prisma.serverSnapshot.create({
            data: {
                guildId: guild.id,
                creatorId,
                name: name || `Snapshot ${new Date().toLocaleString('pl-PL')}`,
                data: JSON.stringify(snapshotData)
            }
        });
    }

    /**
     * Fetches all snapshots for a guild.
     */
    async listSnapshots(guildId) {
        return await db.prisma.serverSnapshot.findMany({
            where: { guildId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
    }

    /**
     * Gets a specific snapshot.
     */
    async getSnapshot(id) {
        const snapshot = await db.prisma.serverSnapshot.findUnique({
            where: { id: parseInt(id) }
        });
        if (!snapshot) return null;
        return {
            ...snapshot,
            data: JSON.parse(snapshot.data)
        };
    }

    /**
     * Compares current guild state with a snapshot.
     */
    async compare(guild, snapshotId) {
        const snapshot = await this.getSnapshot(snapshotId);
        if (!snapshot) throw new Error('Nie znaleziono snapshotu.');

        const currentChannels = guild.channels.cache;
        const savedChannels = snapshot.data.channels;

        const missing = savedChannels.filter(sc => !currentChannels.has(sc.id));
        const extra = currentChannels.filter(cc => !savedChannels.find(sc => sc.id === cc.id));
        
        // Simplified drift check for names
        const changed = savedChannels.filter(sc => {
            const cc = currentChannels.get(sc.id);
            return cc && cc.name !== sc.name;
        });

        return {
            missingCount: missing.length,
            extraCount: extra.size,
            changedCount: changed.length,
            missingList: missing.map(m => m.name),
            extraList: extra.map(e => e.name),
            snapshotName: snapshot.name
        };
    }

    /**
     * Restores a snapshot (Additive mode).
     */
    async restore(guild, snapshotId) {
        const snapshot = await this.getSnapshot(snapshotId);
        if (!snapshot) throw new Error('Nie znaleziono snapshotu.');

        const results = { roles: 0, channels: 0, errors: [] };

        // 1. Restore Roles (skip if name already exists to avoid duplicates in additive mode)
        for (const sr of snapshot.data.roles) {
            const existing = guild.roles.cache.find(r => r.name === sr.name);
            if (!existing) {
                try {
                    await guild.roles.create({
                        name: sr.name,
                        color: sr.color,
                        hoist: sr.hoist,
                        permissions: BigInt(sr.permissions),
                        mentionable: sr.mentionable,
                        reason: 'Przywracanie ze snapshotu Janko'
                    });
                    results.roles++;
                } catch (e) {
                    results.errors.push(`Rola ${sr.name}: ${e.message}`);
                }
            }
        }

        // 2. Restore Categories first
        const idMap = new Map();
        const categories = snapshot.data.channels.filter(c => c.type === ChannelType.GuildCategory);
        
        for (const sc of categories) {
            let cat = guild.channels.cache.find(c => c.name === sc.name && c.type === ChannelType.GuildCategory);
            if (!cat) {
                try {
                    cat = await guild.channels.create({
                        name: sc.name,
                        type: sc.type,
                        position: sc.position,
                        reason: 'Przywracanie ze snapshotu Janko'
                    });
                    results.channels++;
                } catch (e) {
                    results.errors.push(`Kategoria ${sc.name}: ${e.message}`);
                }
            }
            if (cat) idMap.set(sc.id, cat.id);
        }

        // 3. Restore other channels
        const otherChannels = snapshot.data.channels.filter(c => c.type !== ChannelType.GuildCategory);
        for (const sc of otherChannels) {
            const existing = guild.channels.cache.find(c => c.name === sc.name && c.type === sc.type);
            if (!existing) {
                try {
                    await guild.channels.create({
                        name: sc.name,
                        type: sc.type,
                        topic: sc.topic,
                        nsfw: sc.nsfw,
                        rateLimitPerUser: sc.rateLimitPerUser,
                        parent: idMap.get(sc.parentId) || null,
                        position: sc.position,
                        reason: 'Przywracanie ze snapshotu Janko'
                    });
                    results.channels++;
                } catch (e) {
                    results.errors.push(`Kanał ${sc.name}: ${e.message}`);
                }
            }
        }

        return results;
    }
}

module.exports = new SnapshotService();
