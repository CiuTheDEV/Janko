const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const uiEngine = require('../../../core/uiEngine');
const configService = require('../services/configService');
const onboardingService = require('../../onboarding/services/onboardingService');

/**
 * Handler dla konfiguracji powitań i pożegnań.
 */
module.exports = [
    {
        customId: 'config_onboarding',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);

            const message = uiEngine.render('ONBOARDING.DASHBOARD', {
                status: config.welcomeEnabled ? '`✅ Włączone`' : '`❌ Wyłączone`',
                imgStatus: config.welcomeImageEnabled ? '`✅ Włączona`' : '`❌ Wyłączona`',
                welcomeType: config.welcomeType || 'EMBED',
                leaveStatus: config.leaveEnabled ? '`✅ Włączone`' : '`❌ Wyłączone`',
                leaveImgStatus: config.leaveImageEnabled ? '`✅ Włączona`' : '`❌ Wyłączona`',
                leaveType: config.leaveType || 'EMBED'
            });

            // Row 1: Powitania (Status + Grafika + Typ)
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('toggle_welcome_enabled')
                    .setLabel('Powitania')
                    .setEmoji('👋')
                    .setStyle(config.welcomeEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_welcome_image')
                    .setLabel('Grafika (W)')
                    .setStyle(config.welcomeImageEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_welcome_type')
                    .setLabel(config.welcomeType === 'TEXT' ? 'Tryb: TEXT' : 'Tryb: EMBED')
                    .setStyle(ButtonStyle.Secondary)
            );

            // Row 2: Pożegnania (Status + Grafika + Typ)
            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('toggle_leave_enabled')
                    .setLabel('Pożegnania')
                    .setEmoji('🏃')
                    .setStyle(config.leaveEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_leave_image')
                    .setLabel('Grafika (P)')
                    .setStyle(config.leaveImageEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('toggle_leave_type')
                    .setLabel(config.leaveType === 'TEXT' ? 'Tryb: TEXT' : 'Tryb: EMBED')
                    .setStyle(ButtonStyle.Secondary)
            );

            // Row 3: Testy
            const row3 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('test_welcome')
                    .setLabel('Test Powitania')
                    .setEmoji('🧪')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('test_leave')
                    .setLabel('Test Pożegnania')
                    .setEmoji('🧪')
                    .setStyle(ButtonStyle.Primary)
            );

            // Row 4: Nawigacja
            const row4 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('config_channels')
                    .setLabel('Kanały')
                    .setEmoji('📺')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('config_main')
                    .setLabel('Powrót')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({
                ...message,
                components: [row1, row2, row3, row4]
            });
        }
    },
    // Przełączniki boolean (te same co wcześniej)
    { id: 'toggle_welcome_enabled', field: 'welcomeEnabled' },
    { id: 'toggle_welcome_image', field: 'welcomeImageEnabled' },
    { id: 'toggle_leave_enabled', field: 'leaveEnabled' },
    { id: 'toggle_leave_image', field: 'leaveImageEnabled' },

    // Przełączniki typu (TEXT/EMBED)
    {
        customId: 'toggle_welcome_type',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);
            const newType = config.welcomeType === 'TEXT' ? 'EMBED' : 'TEXT';
            await configService.update(interaction.guild.id, { welcomeType: newType });
            const main = module.exports.find(v => v.customId === 'config_onboarding');
            await main.execute(interaction);
        }
    },
    {
        customId: 'toggle_leave_type',
        async execute(interaction) {
            if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
            const config = await configService.get(interaction.guild.id);
            const newType = config.leaveType === 'TEXT' ? 'EMBED' : 'TEXT';
            await configService.update(interaction.guild.id, { leaveType: newType });
            const main = module.exports.find(v => v.customId === 'config_onboarding');
            await main.execute(interaction);
        }
    },

    // Testy
    {
        customId: 'test_welcome',
        async execute(interaction) {
            // Nie deferujemy, bo wysyłamy nową wiadomość a potem editReply (opcjonalnie)
            // Ale Dashboard wymaga edycji pierwotnej wiadomości, aby nie zniknął.
            const config = await configService.get(interaction.guild.id);
            if (!config.welcomeCh) {
                return interaction.reply({ content: '❌ Najpierw ustaw kanał powitalny!', ephemeral: true });
            }
            
            await interaction.deferUpdate();
            await onboardingService.handleJoin(interaction.member);
            // Nie musimy nic więcej robić, Dashboard zostaje
        }
    },
    {
        customId: 'test_leave',
        async execute(interaction) {
            const config = await configService.get(interaction.guild.id);
            if (!config.leaveCh) {
                return interaction.reply({ content: '❌ Najpierw ustaw kanał pożegnalny!', ephemeral: true });
            }

            await interaction.deferUpdate();
            await onboardingService.handleLeave(interaction.member);
        }
    }
].map(item => {
    // Wsparcie dla uproszczonych handlerów boolean
    if (item.field) {
        return {
            customId: item.id,
            async execute(interaction) {
                if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate();
                const config = await configService.get(interaction.guild.id);
                await configService.update(interaction.guild.id, { [item.field]: !config[item.field] });
                const main = module.exports.find(v => v.customId === 'config_onboarding');
                await main.execute(interaction);
            }
        };
    }
    return item;
});
