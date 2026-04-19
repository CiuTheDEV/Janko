const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const db = require('../../../core/database');
const configService = require('../../config/services/configService');
const uiEngine = require('../../../core/uiEngine');

class SecurityService {
    /**
     * Checks if a member should be quarantined upon joining.
     */
    async checkAndQuarantine(member) {
        const config = await configService.get(member.guild.id);
        if (!config || !config.quarantineRoleId) return;

        const accountAgeDays = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));
        
        if (accountAgeDays < config.quarantineThresholdDays) {
            await this.applyQuarantine(member, `Wiek konta (${accountAgeDays} dni) poniżej progu (${config.quarantineThresholdDays} dni).`);
        }
    }

    /**
     * Applies quarantine role and creates a session.
     */
    async applyQuarantine(member, reason) {
        const config = await configService.get(member.guild.id);
        if (!config || !config.quarantineRoleId) return;

        try {
            await member.roles.add(config.quarantineRoleId);
            
            // Create session in DB
            await db.prisma.quarantineSession.create({
                data: {
                    guildId: member.guild.id,
                    userId: member.id,
                    reason: reason,
                    status: 'ACTIVE'
                }
            });

            // Log to staff channel
            await this.sendDecisionDashboard(member, reason);
        } catch (error) {
            console.error(`[SECURITY] Failed to apply quarantine to ${member.id}:`, error);
        }
    }

    /**
     * Sends the interactive dashboard to staff.
     */
    async sendDecisionDashboard(member, reason) {
        const config = await configService.get(member.guild.id);
        if (!config || !config.quarantineLogsCh) return;

        const channel = member.guild.channels.cache.get(config.quarantineLogsCh);
        if (!channel) return;

        const accountAgeDays = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));
        
        const message = uiEngine.render('SECURITY.DASHBOARD', {
            user: member.user.tag,
            reason: reason,
            joined: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
            age: accountAgeDays
        }, { type: 'WARNING' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`security_approve_${member.id}`)
                .setLabel('Zatwierdź')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅'),
            new ButtonBuilder()
                .setCustomId(`security_kick_${member.id}`)
                .setLabel('Wyrzuć (Kick)')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🚪'),
            new ButtonBuilder()
                .setCustomId(`security_reject_${member.id}`)
                .setLabel('Wygnaj (Ban)')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔨')
        );

        await channel.send({ ...message, components: [row] });
    }

    /**
     * Mirrors a message to the staff channel.
     */
    async mirrorMessage(message) {
        const config = await configService.get(message.guild.id);
        if (!config || !config.quarantineLogsCh) return;

        // Check if user is in active quarantine session
        const session = await db.prisma.quarantineSession.findFirst({
            where: {
                guildId: message.guild.id,
                userId: message.author.id,
                status: 'ACTIVE'
            }
        });

        if (!session) return;

        const logChannel = message.guild.channels.cache.get(config.quarantineLogsCh);
        if (!logChannel) return;

        const logMessage = uiEngine.render('SECURITY.QUARANTINE_LOG', {
            user: message.author.tag,
            channel: message.channel.toString(),
            content: message.content || '_Brak treści (obraz/załącznik)_'
        }, { type: 'INFO' });

        // Handle attachments
        const attachments = message.attachments.map(a => a.url);
        
        await logChannel.send({
            ...logMessage,
            files: attachments
        });
    }

    /**
     * Approves a user and releases from quarantine.
     */
    async approveUser(guild, userId, moderator) {
        const config = await configService.get(guild.id);
        const member = await guild.members.fetch(userId).catch(() => null);

        if (member && config.quarantineRoleId) {
            await member.roles.remove(config.quarantineRoleId);
        }

        await db.prisma.quarantineSession.updateMany({
            where: { guildId: guild.id, userId: userId, status: 'ACTIVE' },
            data: { status: 'APPROVED' }
        });

        return uiEngine.render('SECURITY.APPROVED', { user: member ? member.user.tag : userId });
    }

    /**
     * Performs a full security audit of the guild.
     */
    async runSecurityAudit(guild) {
        const everyone = guild.roles.everyone;
        const risks = [];
        let score = 100;

        // 1. Check @everyone for dangerous perms
        const dangerousPerms = [
            { id: PermissionFlagsBits.Administrator, weight: 80, label: 'Administrator' },
            { id: PermissionFlagsBits.ManageGuild, weight: 40, label: 'Zarządzanie Serwerem' },
            { id: PermissionFlagsBits.ManageRoles, weight: 50, label: 'Zarządzanie Rolami' },
            { id: PermissionFlagsBits.ManageChannels, weight: 30, label: 'Zarządzanie Kanałami' },
            { id: PermissionFlagsBits.MentionEveryone, weight: 20, label: 'Wzmianki @everyone' }
        ];

        const everyoneDangerous = dangerousPerms.filter(p => everyone.permissions.has(p.id));
        if (everyoneDangerous.length > 0) {
            risks.push({
                type: 'EVERYONE_PERMS',
                label: '🌐 Krytyczne uprawnienia dla @everyone',
                value: everyoneDangerous.map(p => p.label).join(', '),
                level: 'CRITICAL'
            });
            score -= everyoneDangerous.reduce((sum, p) => sum + p.weight, 0);
        }

        // 2. Check Admin count (fetching only if server is relatively small or using cache fallback)
        let adminsSize = 0;
        let totalMembers = guild.memberCount;

        try {
            // Only fetch all if under 1000 members, otherwise use cache or skip heavy part
            const members = totalMembers < 1000 
                ? await guild.members.fetch({ withPresences: false }) 
                : guild.members.cache;
                
            const admins = members.filter(m => m.permissions.has(PermissionFlagsBits.Administrator) && !m.user.bot);
            adminsSize = admins.size;
        } catch (e) {
            adminsSize = guild.members.cache.filter(m => m.permissions.has(PermissionFlagsBits.Administrator) && !m.user.bot).size;
        }

        if (adminsSize > 5 && (adminsSize / totalMembers) > 0.1) {
            risks.push({
                type: 'TOO_MANY_ADMINS',
                label: '⚔️ Zbyt wielu administratorów',
                value: `Wykryto ${adminsSize} administratorów (nie-botów).`,
                level: 'WARNING'
            });
            score -= 15;
        }

        // Final score clamp
        score = Math.max(0, score);

        // Update DB
        await db.prisma.guildConfig.update({
            where: { guildId: guild.id },
            data: { lastSecurityAudit: new Date() }
        }).catch(() => {}); // Ignore if client not generated yet

        let statusKey = 'AUDIT_STATUS_PERFECT';
        if (score < 50) statusKey = 'AUDIT_STATUS_CRITICAL';
        else if (score < 90) statusKey = 'AUDIT_STATUS_WARNING';

        return {
            score,
            statusKey,
            risks
        };
    }

    /**
     * Fixes a specific security issue.
     */
    async fixSecurityIssue(guild, type) {
        if (type === 'fix_everyone') {
            const everyone = guild.roles.everyone;
            const toRevoke = [
                PermissionFlagsBits.Administrator, 
                PermissionFlagsBits.ManageGuild, 
                PermissionFlagsBits.ManageRoles, 
                PermissionFlagsBits.ManageChannels, 
                PermissionFlagsBits.MentionEveryone
            ];
            
            const newPerms = everyone.permissions.remove(toRevoke);
            
            await everyone.setPermissions(newPerms, 'Janko Security Audit Fix');
            return uiEngine.render('SECURITY.FIX_SUCCESS', { role: '@everyone' });
        }
    }
}

module.exports = new SecurityService();
