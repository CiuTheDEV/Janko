const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const fs = require('fs');

class ImageGenerator {
    constructor() {
        this.assetsPath = path.join(__dirname, '../../../../assets');
        this.width = 1050;
        this.height = 450;

        // Rejestracja czcionek
        this.registerFonts();
    }

    registerFonts() {
        const fontsPath = path.join(this.assetsPath, 'fonts');
        const regularPath = path.join(fontsPath, 'Cinzel-Regular.ttf');
        const boldPath = path.join(fontsPath, 'Cinzel-Bold.ttf');

        if (fs.existsSync(regularPath)) GlobalFonts.registerFromPath(regularPath, 'Cinzel');
        if (fs.existsSync(boldPath)) GlobalFonts.registerFromPath(boldPath, 'CinzelBold');
    }

    /**
     * Główna funkcja generująca obraz
     */
    async generate(member, type = 'WELCOME') {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        // 1. Tło (21:9 - 1050x450)
        const bgFile = type === 'WELCOME' ? 'welcome_bg.png' : 'leave_bg.png';
        const bgPath = path.join(this.assetsPath, bgFile);
        
        if (fs.existsSync(bgPath)) {
            const background = await loadImage(bgPath);
            const hRatio = this.width / background.width;
            const vRatio = this.height / background.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShiftX = (this.width - background.width * ratio) / 2;
            const centerShiftY = (this.height - background.height * ratio) / 2;
            
            ctx.drawImage(background, 0, 0, background.width, background.height, 
                          centerShiftX, centerShiftY, background.width * ratio, background.height * ratio);
        } else {
            const grad = ctx.createLinearGradient(0, 0, this.width, 0);
            grad.addColorStop(0, '#000000');
            grad.addColorStop(1, type === 'WELCOME' ? '#1a1a1a' : '#2e0000');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // 2. Avatar & Frame
        const centerX = 230; 
        const centerY = this.height / 2;
        const frameSize = 340; 
        const avatarSize = 175; 

        // Rysujemy Awatar
        try {
            const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 512 });
            const avatarImg = await loadImage(avatarUrl);
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(avatarImg, centerX - avatarSize / 2, centerY - avatarSize / 2, avatarSize, avatarSize);
            ctx.restore();
        } catch (e) {
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Rysujemy Ramkę (Dynamiczny plik zależny od typu)
        const frameFile = type === 'WELCOME' ? 'avatar_frame.png' : 'avatar_frame_leave.png';
        const framePath = path.join(this.assetsPath, frameFile);
        
        // Fallback jeśli pożegnalna ramka nie istnieje -> użyj domyślnej
        let finalFramePath = framePath;
        if (!fs.existsSync(framePath) && type === 'LEAVE') {
            finalFramePath = path.join(this.assetsPath, 'avatar_frame.png');
        }

        if (fs.existsSync(finalFramePath)) {
            const frame = await loadImage(finalFramePath);
            ctx.drawImage(frame, centerX - frameSize / 2, centerY - frameSize / 2, frameSize, frameSize);
        }

        // 3. Warstwa czytelności (Prawy bok)
        const textCenterX = 700; 
        const backdropWidth = 600;
        const backdrop = ctx.createLinearGradient(this.width - backdropWidth, 0, this.width, 0);
        
        if (type === 'WELCOME') {
            backdrop.addColorStop(0, 'rgba(0, 0, 0, 0)');
            backdrop.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
            backdrop.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        } else {
            backdrop.addColorStop(0, 'rgba(0, 0, 0, 0)');
            backdrop.addColorStop(0.3, 'rgba(0, 0, 0, 0.7)');
            backdrop.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        }
        
        ctx.fillStyle = backdrop;
        ctx.fillRect(this.width - backdropWidth, 0, backdropWidth, this.height);

        // 4. Konfiguracja tekstów (Używamy displayName dla nicków i global names)
        const name = member.displayName.toUpperCase();
        const subText = type === 'WELCOME' ? 'WITAJ W NASZYM ZAMKU,' : 'POLEGŁ W WALCE,';
        const footerText = type === 'WELCOME' ? 'ZASIĄDŹ Z NAMI PRZY WSPÓLNYM STOLE!' : 'NIGDY NIE ZAPOMNIMY TWOJEJ OFIARY.';

        // --- GRADIENTY ---
        const silverGradient = ctx.createLinearGradient(textCenterX - 200, 0, textCenterX + 200, 0);
        silverGradient.addColorStop(0, '#9A9A9A');
        silverGradient.addColorStop(0.25, '#E5E5E5');
        silverGradient.addColorStop(0.5, '#FFFFFF');
        silverGradient.addColorStop(0.75, '#E5E5E5');
        silverGradient.addColorStop(1, '#9A9A9A');

        let accentGradient = ctx.createLinearGradient(textCenterX - 200, 0, textCenterX + 200, 0);
        if (type === 'WELCOME') {
            accentGradient.addColorStop(0, '#BF953F');
            accentGradient.addColorStop(0.5, '#FCF6BA'); 
            accentGradient.addColorStop(1, '#B38728');
        } else {
            accentGradient.addColorStop(0, '#8B0000');
            accentGradient.addColorStop(0.5, '#FF0000');
            accentGradient.addColorStop(1, '#8B0000');
        }

        // --- RENDERING TEKSTU ---
        ctx.textAlign = 'center';

        // Subtitle (Coord: 130)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = accentGradient;
        ctx.font = '32px CinzelBold'; 
        ctx.fillText(subText, textCenterX, 130);

        // Name (Coord: 240)
        let nameFontSize = 85;
        ctx.font = `${nameFontSize}px CinzelBold`;
        const nameWidth = ctx.measureText(name).width;
        if (nameWidth > 580) {
            nameFontSize = Math.floor(85 * (580 / nameWidth));
            ctx.font = `${nameFontSize}px CinzelBold`;
        }
        
        ctx.shadowColor = type === 'WELCOME' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 0, 0, 0.6)';
        ctx.shadowBlur = type === 'WELCOME' ? 15 : 25;
        ctx.fillStyle = silverGradient; 
        ctx.fillText(name, textCenterX, 240);

        // Dekoracyjna Linia (Coord: 285)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = accentGradient;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(textCenterX - 250, 285);
        ctx.lineTo(textCenterX + 250, 285);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Footer (Coord: 355)
        ctx.shadowColor = 'rgba(0, 0, 0, 1)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFFFFF'; 
        ctx.font = '24px Cinzel';
        ctx.fillText(footerText, textCenterX, 355);

        return canvas.toBuffer('image/png');
    }
}

module.exports = new ImageGenerator();
