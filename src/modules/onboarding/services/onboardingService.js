const { AttachmentBuilder } = require('discord.js');
const configService = require('../../config/services/configService');
const imageGenerator = require('../utils/ImageGenerator');
const uiEngine = require('../../../core/uiEngine');

class OnboardingService {
    /**
     * Obsługa powitania nowego członka
     */
    async handleJoin(member) {
        const config = await configService.get(member.guild.id);
        if (!config || !config.welcomeEnabled || !config.welcomeCh) return;

        const channel = member.guild.channels.cache.get(config.welcomeCh);
        if (!channel) return;

        const welcomeText = this.parsePlaceholders(config.welcomeMsg, member);
        const formatType = config.welcomeType || 'EMBED';

        const files = [];
        let imageUrl = null;

        if (config.welcomeImageEnabled) {
            try {
                const buffer = await imageGenerator.generate(member, 'WELCOME');
                const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });
                files.push(attachment);
                imageUrl = 'attachment://welcome.png';
            } catch (error) {
                console.error('[OnboardingService] Błąd generowania grafiki powitalnej:', error);
            }
        }

        const message = uiEngine.render('ONBOARDING.WELCOME', 
            { content: welcomeText }, 
            { 
                mode: formatType, 
                image: imageUrl,
                type: 'PRIMARY' // Złoty kolor dla powitań
            }
        );

        await channel.send({ ...message, files });
    }

    /**
     * Obsługa pożegnania członka
     */
    async handleLeave(member) {
        const config = await configService.get(member.guild.id);
        if (!config || !config.leaveEnabled || !config.leaveCh) return;

        const channel = member.guild.channels.cache.get(config.leaveCh);
        if (!channel) return;

        const leaveText = this.parsePlaceholders(config.leaveMsg, member);
        const formatType = config.leaveType || 'EMBED';

        const files = [];
        let imageUrl = null;

        if (config.leaveImageEnabled) {
            try {
                const buffer = await imageGenerator.generate(member, 'LEAVE');
                const attachment = new AttachmentBuilder(buffer, { name: 'leave.png' });
                files.push(attachment);
                imageUrl = 'attachment://leave.png';
            } catch (error) {
                console.error('[OnboardingService] Błąd generowania grafiki pożegnalnej:', error);
            }
        }

        const message = uiEngine.render('ONBOARDING.LEAVE', 
            { content: leaveText }, 
            { 
                mode: formatType, 
                image: imageUrl,
                type: 'DANGER' // Czerwony kolor dla pożegnań
            }
        );

        await channel.send({ ...message, files });
    }

    /**
     * Parsowanie placeholderów w tekście
     */
    parsePlaceholders(text, member) {
        if (!text) return '';
        return text
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{username}/g, member.user.username)
            .replace(/{guild}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount.toString());
    }
}

module.exports = new OnboardingService();
