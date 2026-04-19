/**
 * TimeParser - Współdzielona logika parsowania czasu dla Janko.
 */
class TimeParser {
    /**
     * Parsuje ciąg znaków czasu na obiekt Date
     * Przykład: "1h 30m" -> Date(+90min)
     * @param {string} timeStr - Ciąg znaków czasu (np. "1h", "2d", "15m")
     * @returns {Date|null} Obiekt Date w przyszłości lub null jeśli niepoprawny format
     */
    static parse(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return null;

        const regex = /(\d+)\s*(d|dni|h|godz|g|m|min)/g;
        let totalMs = 0;
        let match;

        while ((match = regex.exec(timeStr.toLowerCase())) !== null) {
            const value = parseInt(match[1]);
            const unit = match[2];

            if (unit.startsWith('d')) totalMs += value * 24 * 60 * 60 * 1000;
            else if (unit.startsWith('h') || unit.startsWith('g')) totalMs += value * 60 * 60 * 1000;
            else if (unit.startsWith('m')) totalMs += value * 60 * 1000;
        }

        if (totalMs === 0) return null;
        return new Date(Date.now() + totalMs);
    }

    /**
     * Formatuje datę wygaśnięcia na czytelny ciąg znaków (HH:mm DD.MM.YYYY)
     * @param {Date} date 
     * @returns {string}
     */
    static format(date) {
        return date.toLocaleString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

module.exports = TimeParser;
