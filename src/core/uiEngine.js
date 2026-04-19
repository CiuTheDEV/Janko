const { EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const styles = require('./styles');
const templates = require('./templates');

/**
 * Silnik UI Janko — zarządza tworzeniem spójnych embedów i szablonów.
 */
class UIEngine {
    /**
     * Główna metoda renderująca wiadomość.
     * @param {string} path Ścieżka do szablonu
     * @param {Object} data Dane
     * @param {Object} options Opcje (mode: 'EMBED' | 'TEXT', type: 'PRIMARY'...)
     * @returns {Object} Obiekt gotowy do interaction.reply()
     */
    static render(path, data = {}, options = {}) {
        const [category, key] = path.split('.');
        const mode = options.mode || 'EMBED';
        const type = options.type || 'PRIMARY';

        // Pobranie flagi ephemeral z szablonu (domyślnie false)
        const ephemeral = templates[category]?.[`${key}_EPHEMERAL`] ?? options.ephemeral ?? false;

        if (mode === 'TEXT') {
            const message = { 
                content: this.renderText(path, data), 
                embeds: []
            };
            if (ephemeral) {
                message.flags = [MessageFlags.Ephemeral];
            }
            return message;
        }

        const embed = this.createEmbed(path, data, type);
        
        // Dynamiczne grafiki z opcji
        if (options.thumbnail) embed.setThumbnail(options.thumbnail);
        if (options.image) embed.setImage(options.image);
        
        const message = { 
            embeds: [embed],
            components: [],
            files: options.files || []
        };

        // Obsługa przycisków z opcji (pojedynczy rząd lub wiele rzędów)
        if (options.buttons && Array.isArray(options.buttons)) {
            const createRow = (btns) => {
                const row = new ActionRowBuilder();
                btns.forEach(btn => {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(btn.id)
                            .setLabel(btn.label)
                            .setStyle(ButtonStyle[btn.style] || ButtonStyle.Primary)
                            .setDisabled(!!btn.disabled)
                    );
                });
                return row;
            };

            // Sprawdzamy czy przekazano wiele rzędów (tablica tablic)
            if (Array.isArray(options.buttons[0]?.buttons || options.buttons[0])) {
                // Jeśli pierwsza pozycja to tablica lub obiekt z kluczem buttons, traktujemy jako rzędy
                options.buttons.forEach(rowGroup => {
                    const btns = Array.isArray(rowGroup) ? rowGroup : rowGroup.buttons;
                    if (btns.length > 0) message.components.push(createRow(btns));
                });
            } else {
                // Pojedynczy rząd
                message.components.push(createRow(options.buttons));
            }
        }

        if (ephemeral) {
            message.flags = [MessageFlags.Ephemeral];
        }

        // Automatyczne dołączanie lokalnych zasobów jeśli są użyte w embedzie
        const thumb = embed.data.thumbnail?.url;
        const img = embed.data.image?.url;

        [thumb, img].forEach(url => {
            if (url?.startsWith('attachment://')) {
                const fileName = url.replace('attachment://', '');
                const filePath = `./assets/${fileName}`;
                if (!message.files.includes(filePath)) {
                    message.files.push(filePath);
                }
            }
        });

        return message;
    }

    /**
     * Tworzy embed na podstawie szablonu.
     */
    static createEmbed(path, data = {}, type = 'PRIMARY') {
        const [category, key] = path.split('.');
        const titleKey = `${key}_TITLE`;
        const descKey = `${key}_DESC`;
        const fieldsKey = `${key}_FIELDS`;
        const imageKey = `${key}_IMAGE`;
        const thumbKey = `${key}_THUMBNAIL`;

        let title = templates[category]?.[titleKey] || templates[category]?.[key] || 'Janko';
        let description = templates[category]?.[descKey] || '';
        const fieldsTemplate = templates[category]?.[fieldsKey];

        title = this.replacePlaceholders(title, data);
        description = this.replacePlaceholders(description, data);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description || null)
            .setColor(styles.COLORS[type] || styles.COLORS.PRIMARY)
            .setTimestamp();

        // Obsługa grafik z danych lub szablonu
        const imageUrl = data.imageUrl || templates[category]?.[imageKey] || templates[category]?.IMAGE;
        const thumbUrl = data.thumbnailUrl || templates[category]?.[thumbKey] || templates[category]?.THUMBNAIL;

        if (imageUrl) embed.setImage(this.replacePlaceholders(imageUrl, data));
        if (thumbUrl) embed.setThumbnail(this.replacePlaceholders(thumbUrl, data));

        // Obsługa pól dynamicznych z szablonu
        if (fieldsTemplate && Array.isArray(fieldsTemplate)) {
            const mappedFields = fieldsTemplate.map(f => ({
                name: this.replacePlaceholders(f.name, data),
                value: this.replacePlaceholders(f.value, data),
                inline: !!f.inline
            }));
            embed.addFields(mappedFields);
        }

        const footerText = templates[category]?.FOOTER || templates.GLOBAL.FOOTER;
        embed.setFooter({ text: footerText });

        return embed;
    }

    /**
     * Renderuje sam tekst na podstawie szablonu _TEXT lub _DESC.
     */
    static renderText(path, data = {}) {
        const [category, key] = path.split('.');
        const textKey = `${key}_TEXT`;
        const descKey = `${key}_DESC`;

        let text = templates[category]?.[textKey] || templates[category]?.[descKey] || templates[category]?.[key] || '';
        return this.replacePlaceholders(text, data);
    }

    /**
     * Pomocnicza funkcja do zamiany placeholderów.
     */
    static replacePlaceholders(text, data) {
        if (typeof text !== 'string') return text;
        return text.replace(/{(\w+)}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    }

    static get styles() {
        return styles;
    }
}

module.exports = UIEngine;
