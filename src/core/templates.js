/**
 * Centralny słownik tekstów i szablonów Janko.
 * Możesz tutaj edytować każdą wiadomość wysyłaną przez bota.
 * 
 * Używaj placeholderów takich jak {user}, {guild}, {reason} itp.
 */
module.exports = {
    GLOBAL: {
        FOOTER: 'Janko Security & Management',
        ERROR_GENERIC: 'Wystąpił nieoczekiwany problem: {error}',
        ERROR_PERMISSIONS: 'Nie mam wystarczających uprawnień, aby to zrobić!',
        ERROR_HIERARCHY: 'Nie możesz wykonać tej akcji na tym użytkowniku (hierarchia ról).',
        ERROR_NOT_FOUND: 'Nie znaleziono wskazanego celu na tym serwerze.',
        SUCCESS_TITLE: 'Sukces!',
        SUCCESS_DESC: 'Operacja zakończona pomyślnie.',
    },

    CONFIG: {
        DASHBOARD_TITLE: '⚙️ Janko — Centrum Zarządzania',
        DASHBOARD_DESC: 'Witaj w panelu konfiguracyjnym Twojego serwera. Wybierz odpowiednią kategorię poniżej, aby dostosować działanie bota.',
        STATUS_FIELD: '🟢 Fundament stabilny',
        VERSION_FIELD: 'v1.1.0-JANKOGOD',
        OWNER_FIELD: '👑 Właściciel Korony: {owner}',
        DASHBOARD_FIELDS: [
            { name: '📍 Status', value: '🟢 System operacyjny', inline: true },
            { name: '🛠️ Wersja', value: 'v1.1.0-JANKOGOD', inline: true },
            { name: '👑 Właściciel', value: '**{owner}**', inline: true }
        ],

        GENERAL_TITLE: '⚙️ Janko — Ustawienia Ogólne',
        GENERAL_DESC: 'Podstawowe informacje o konfiguracji bota na tym serwerze.\n\n• ID Serwera: `{guildId}`\n• Prefiks: `{prefix}`\n• Właściciel: {owner}\n\n**Wiadomość Powitalna:**\n`{welcomeMsg}`\n\n**Wiadomość Pożegnalna:**\n`{leaveMsg}`',
        GENERAL_FIELDS: [
            { name: '🆔 Guild ID', value: '`{guildId}`', inline: true },
            { name: '✍️ Prefix', value: '`{prefix}`', inline: true },
            { name: '👑 Właściciel', value: '{owner}', inline: true }
        ],

        ROLES_TITLE: '🛡️ Janko — Zarządzanie Rolami',
        ROLES_DESC: 'Zdefiniuj role uprawnione do zarządzania botem i moderacji.',
        ROLES_FIELDS: [
            { name: '⚔️ Moderator', value: '{modRole}', inline: true },
            { name: '👑 Administrator', value: '{adminRole}', inline: true }
        ],

        HEALTH_TITLE: '🩺 Janko — Health Check',
        HEALTH_DESC: 'Diagnostyka uprawnień i konfiguracji bota.\n\n**🛡️ Uprawnienia:** {perms}\n**📺 Kanał Logów:** {logsCh}\n**✍️ Prefix:** `{prefix}`',
        HEALTH_PERMS_OK: '`✅ Wszystkie poprawne`',
        HEALTH_PERMS_ERR: '`❌ Brak wymaganych uprawnień: {missing}`',
        HEALTH_LOGS_OK: '`✅ Skonfigurowany`',
        HEALTH_LOGS_ERR: '`⚠️ Brak konfiguracji`',

        CHANNELS_TITLE: '📺 Janko — Konfiguracja Kanałów',
        CHANNELS_DESC: 'Skonfiguruj kanały dla poszczególnych modułów bota.\n\n• 👋 Powitania: {welcomeCh}\n• 🏃 Pożegnania: {leaveCh}\n• 📝 Logi: {logsCh}',

        NOTIFY_TITLE: '🔔 Janko — Powiadomienia DM',
        NOTIFY_DESC: 'Wybierz, o których karach bot ma informować użytkownika prywatną wiadomością.\n\n• Ostrzeżenia: {warn}\n• Wyciszenia: {timeout}\n• Od-ciszenia: {untimeout}\n• Wyrzucenia: {kick}\n• Bany: {ban}',

        UTILITY_TITLE: '🛠️ Janko — Użyteczność',
        UTILITY_DESC: 'Skonfiguruj moduły ułatwiające życie na serwerze.\n\n**🎙️ Auto-Voice:**\n• Status: {status}\n• Kanał: {autoVoiceCh}\n\n**🎵 Bard Janko:**\n• Głośność domyślna: `{volume}%`\n• Ranga DJ: {djRole}',

        SECURITY_TITLE: '🛡️ Janko — Bezpieczeństwo i Kwarantanna',
        SECURITY_DESC: 'Zarządzaj systemem kwarantanny i ochrony serwera.\n\n• **Rola Kwarantanny**: {quarantineRole}\n• **Kanał Decyzji**: {quarantineCh}\n• **Próg Wieku Konta**: {threshold} dni',
    },

    MODERATION: {
        FOOTER: '🛡️ Straż Grodu Janko — Bezpieczeństwo i Porządek',
        THUMBNAIL: 'attachment://security_avatar.png',

        BAN_TITLE: 'Wygnanie z królestwa!',
        BAN_DESC: 'Użytkownik **{user}** został permanentnie wygnany.\n**Powód:** {reason}',
        BAN_DM_TITLE: '⚔️ Zostałeś wygnany',
        BAN_DM_DESC: 'Witaj {user},\n\nTwoje czyny na serwerze **{guild}** doprowadziły do permanentnego wygnania.\n\n**Powód:** {reason}',
        BAN_EPHEMERAL: true,
        
        KICK_TITLE: 'Wyrzucenie za mury!',
        KICK_DESC: 'Użytkownik **{user}** został wyprowadzony za bramy serwera.\n**Powód:** {reason}',
        KICK_DM_TITLE: '🚪 Zostałeś wyrzucony',
        KICK_DM_DESC: 'Witaj {user},\n\nZostałeś wyprowadzony za bramy serwera **{guild}**.\n\n**Powód:** {reason}',
        KICK_EPHEMERAL: true,
        
        TIMEOUT_TITLE: 'Chwila ciszy...',
        TIMEOUT_DESC: 'Użytkownik **{user}** został wyciszony na: {duration}.\n**Powód:** {reason}',
        TIMEOUT_DM_TITLE: '🛑 Zostałeś wyciszony',
        TIMEOUT_DM_DESC: 'Witaj {user},\n\nOtrzymałeś karę wyciszenia na serwerze **{guild}**.\n\n**Czas trwania:** {duration}\n**Powód:** {reason}\n\n_Jeśli uważasz, że to pomyłka, skontaktuj się z administracją._',
        
        UNTIMEOUT_TITLE: 'Głos przywrócony!',
        UNTIMEOUT_DESC: 'Użytkownik **{user}** może już ponownie przemawiać.',
        UNTIMEOUT_DM_TITLE: '🔊 Twoje wyciszenie minęło',
        UNTIMEOUT_DM_DESC: 'Witaj {user},\n\nKara wyciszenia na serwerze **{guild}** została zakończona. Możesz ponownie zabierać głos!',
        
        WARN_TITLE: 'Oficjalne ostrzeżenie!',
        WARN_DESC: 'Użytkownik **{user}** otrzymał ostrzeżenie.\n**Powód:** {reason}\n**Suma:** {totalWarns}/3',
        WARN_DM_TITLE: '⚠️ Otrzymałeś ostrzeżenie',
        WARN_DM_DESC: 'Witaj {user},\n\nZostałeś upomniany przez straż grodu **{guild}**.\n\n**Powód:** {reason}\n**Suma ostrzeżeń:** {totalWarns}/3\n\n_Pamiętaj, że 3 ostrzeżenia skutkują automatycznym wyciszeniem na godzinę!_',
        
        WARN_EPHEMERAL: true,
        
        WARN_SUCCESS_TITLE: '⚔️ Raport z Ostrzeżenia',
        WARN_SUCCESS_DESC: 'Pomyślnie ostrzeżono użytkownika **{user}**.\nPowód: *{reason}*\nSuma: {totalWarns}/3',
        WARN_SUCCESS_EPHEMERAL: true,

        CLEAR_TITLE: 'Sprzątanie kanału',
        CLEAR_DESC: 'Pomyślnie usunięto **{amount}** wiadomości.',
        CLEAR_EPHEMERAL: true,

        UNDO_TITLE: 'Cofnięto karę',
        UNDO_DESC: 'Kara dla użytkownika **{user}** została anulowana przez moderatora.',
        UNDO_EPHEMERAL: false,

        LIST_TITLE: '📝 Ostrzeżenia: {user}',
        LIST_DESC: '{list}',
        LIST_EMPTY: 'Użytkownik **{user}** nie posiada żadnych ostrzeżeń.',
        LIST_FOOTER: 'Łącznie: {count} ostrzeżeń',
        LIST_EPHEMERAL: true,

        REMOVE_SUCCESS: 'Pomyślnie usunięto ostrzeżenie **#{id}**.',
        REMOVE_SUCCESS_EPHEMERAL: true,
    },

    ONBOARDING: {
        FOOTER: '👋 Sala Tronowa — Powitania i Pożegnania',
        THUMBNAIL: 'attachment://onboarding_avatar.png',
        WELCOME_TITLE: 'Witaj w Sali Tronowej!',
        WELCOME_DESC: '{content}',
        LEAVE_TITLE: 'Pożegnanie...',
        LEAVE_DESC: '{content}',
        DASHBOARD_TITLE: '👋 Konfiguracja Sali Tronowej',
        DASHBOARD_DESC: 'Zarządzaj wiadomościami powitalnymi i pożegnalnymi.\n\n**Powitania:**\n• Status: {status}\n• Obrazek: {imgStatus}\n• Typ: {welcomeType}\n\n**Pożegnania:**\n• Status: {leaveStatus}\n• Obrazek: {leaveImgStatus}\n• Typ: {leaveType}',
        LOG_MEMBER_JOIN: '👑 Nowy członek: {user} dołączył do królestwa.',
    },

    HEROLD: {
        FOOTER: '📯 Herold Królewski — Obwieszczenia i Przypomnienia',
        DASHBOARD_TITLE: '⚔️ Konfigurator Obwieszczenia Herolda',
        DASHBOARD_THUMBNAIL: 'attachment://herold_avatar.png',
        DASHBOARD_DESC: 'Skonfiguruj swoje przypomnienie używając poniższych narzędzi.',
        DASHBOARD_FIELDS: [
            { name: '📝 Treść', value: '> {content}', inline: false },
            { name: '⏰ Czas', value: '{duration}', inline: true },
            { name: '📡 Cel', value: '{delivery}', inline: true },
            { name: '🎭 Format', value: '`{format}`', inline: true },
            { name: '🖼️ Obraz', value: '{image}', inline: true },
            { name: '👥 Cele DM', value: '{targets}', inline: false }
        ],
        DASHBOARD_EPHEMERAL: true,
        
        CONFIRM_TITLE: '🔔 Królewskie Obwieszczenie',
        CONFIRM_THUMBNAIL: 'attachment://herold_avatar.png',
        CONFIRM_DESC: '_Wszem i wobec ogłasza się powyższe zlecenie na prośbę: {user}_.\n\n## {content}',
        CONFIRM_TEXT: '📯 **KRÓLEWSKIE OBWIESZCZENIE**\n━━━━━━━━━━━━━━━━━━━━\n\n{content}\n\n━━━━━━━━━━━━━━━━━━━━\n👑 *Zleceniodawca: {user}*\n🏰 *Gród: **{guild}***',
        CONFIRM_EPHEMERAL: false, // Widoczne dla wszystkich

        CONFIRM_ACK_TITLE: '📜 Herold przyjął zlecenie',
        CONFIRM_ACK_THUMBNAIL: 'attachment://herold_avatar.png',
        CONFIRM_ACK_DESC: 'Zapisano obwieszczenie:\n> **{content}**',
        CONFIRM_ACK_FIELDS: [
            { name: '⏰ Czas realizacji', value: '{time}', inline: true },
            { name: '👥 Cele powiadomień', value: '{targets}', inline: true }
        ],
        
        FOOTER_SENT: 'Herold wypełnił swą powinność.',

        LIST_TITLE: '📜 Twoje Aktywne Zlecenia u Herolda',
        LIST_DESC: 'Oto lista przypomnień, nad którymi czuwa Herold:\n\n{list}',
        LIST_EMPTY: '📜 Twoje księgi przypomnień są puste, Panie.',
        LIST_FOOTER: 'Możesz usunąć zlecenie z ksiąg, wybierając je z listy poniżej.',
        LIST_EPHEMERAL: true,
    },

    SYSTEM: {
        PING_TITLE: '🏓 Królewskie Opóźnienie',
        PING_DESC: 'Odpowiedź nadeszła w ekspresowym tempie:\n\n• Opóźnienie: **{latency}ms**\n• API: **{api}ms**',
        PING_EPHEMERAL: true,
    },

    WATCHTOWER: {
        FOOTER: '🕵️ Watchtower — Oko i Ucho Królestwa',
        THUMBNAIL: 'attachment://watchtower_avatar.png',
        DASHBOARD_TITLE: '🕵️ Ustawienia Watchtower',
        DASHBOARD_DESC: 'Zarządzaj systemem audytu i logowania zdarzeń.\n• Kanał logów: {logsCh}\n\n**Stan modułów:**\n• Wiadomości: {messages}\n• Członkowie: {members}\n• Kanały: {channels}\n• Role: {roles}\n• Anty-Spam: {spam}',
        MSG_DELETE_TITLE: '🗑️ Usunięto wiadomość',
        MSG_DELETE_DESC: 'Wiadomość od {user} została usunięta na kanale {channel}.\n\n**Treść:**\n{content}',
        
        MSG_EDIT_TITLE: '📝 Edytowano wiadomość',
        MSG_EDIT_DESC: 'Wiadomość od {user} została zmieniona na kanale {channel}.\n\n**Stara treść:**\n{old}\n\n**Nowa treść:**\n{new}',
        
        MEMBER_JOIN_TITLE: '📥 Nowy wędrowiec',
        MEMBER_JOIN_DESC: 'Użytkownik {user} dołączył do serwera.\n\n**Informacje:**\n• ID: `{id}`\n• Konto utworzone: {created}',
        
        MEMBER_LEAVE_TITLE: '📤 Wędrowiec odszedł',
        MEMBER_LEAVE_DESC: 'Użytkownik {user} opuścił serwer.\n\n**Informacje:**\n• ID: `{id}`\n• Dołączył: {joined}',
        
        MEMBER_ROLES_TITLE: '🛡️ Zmiana uprawnień',
        MEMBER_ROLES_DESC: 'Zaktualizowano role użytkownika {user}.',
        MEMBER_ROLES_FIELDS: [
            { name: '✅ Nadane', value: '{added}', inline: false },
            { name: '❌ Odebrane', value: '{removed}', inline: false }
        ],
        
        MEMBER_NICK_TITLE: '👤 Zmiana pseudonimu',
        MEMBER_NICK_DESC: 'Użytkownik {user} zmienił swój pseudonim.\n• Stary: **{old}**\n• Nowy: **{new}**',
        
        MEMBER_AVATAR_TITLE: '🖼️ Zmiana awatara',
        MEMBER_AVATAR_DESC: 'Użytkownik {user} zmienił swój profilowy wizerunek.',

        CHANNEL_CREATE_TITLE: '🏗️ Utworzono kanał',
        CHANNEL_CREATE_DESC: 'Nowy kanał {channel} został powołany do życia.',
        
        CHANNEL_DELETE_TITLE: '🔥 Usunięto kanał',
        CHANNEL_DELETE_DESC: 'Kanał **#{name}** został bezpowrotnie zniszczony.',
        
        CHANNEL_UPDATE_TITLE: '⚙️ Zmieniono kanał',
        CHANNEL_UPDATE_DESC: 'Zaktualizowano ustawienia kanału {channel}.\n• Zmiany: {details}\n• Moderator: {executor}',

        ROLE_CREATE_TITLE: '🎨 Utworzono rolę',
        ROLE_CREATE_DESC: 'Nowa rola **{name}** została utworzona.\n• Moderator: {executor}',

        ROLE_DELETE_TITLE: '🗑️ Usunięto rolę',
        ROLE_DELETE_DESC: 'Rola **{name}** została usunięta.\n• Moderator: {executor}',

        ROLE_UPDATE_TITLE: '⚙️ Zmieniono rolę',
        ROLE_UPDATE_DESC: 'Zaktualizowano ustawienia roli **{name}**.\n• Zmiany: {details}\n• Moderator: {executor}',
        
        MODERATION_SPAM_TITLE: '🚫 Wykryto spam',
        MODERATION_SPAM_DESC: 'Użytkownik {user} wysłał zbyt wiele wiadomości w krótkim czasie na kanale {channel}.\n• Liczba: {count} wiadomości / 5s',

        TEMPORAL_GRANT_TITLE: '⏳ Nadano uprawnienia czasowe',
        TEMPORAL_GRANT_DESC: 'Użytkownik {user} otrzymał rolę **{role}** na okres **{duration}**.\n• Moderator: {executor}\n• Wygasa: {expiry}',
        
        TEMPORAL_EXPIRED_TITLE: '⏳ Uprawnienia wygasły',
        TEMPORAL_EXPIRED_DESC: 'Czas trwania rangi **{role}** dla użytkownika {user} dobiegł końca. Rola została odebrana.',
    },
    
    MODERATION: {
        CASEFILE_MAIN_TITLE: '🗂️ Teczka Użytkownika: {user}',
        CASEFILE_MAIN_DESC: 'Pełna historia aktywności i wykroczeń w grodzie **{guild}**.\n\n**Ostatnia aktywność:**\n{timeline}',
        CASEFILE_FIELD_INFRACTIONS: '⚠️ Historia Kar',
        CASEFILE_FIELD_NICKNAMES: '👤 Poprzednie Imiona',
        CASEFILE_FIELD_ROLES: '🛡️ Migawka Ról',
        CASEFILE_NO_DATA: '_Brak zarejestrowanych danych._',
        CASEFILE_LABEL_JOIN: '📥 Dołączenie do grodu',
        CASEFILE_LABEL_LEAVE: '📤 Opuszczenie murów',
        CASEFILE_LABEL_AVATAR: '🖼️ Zmiana wizerunku',
        CASEFILE_LABEL_NICK: '👤 Zmiana imienia',
        CASEFILE_LABEL_ROLES: '🛡️ Migawka ról',

        MODERATION_WARN_TITLE: '⚠️ Nałożono ostrzeżenie',
        MODERATION_WARN_DESC: 'Użytkownik {user} otrzymał ostrzeżenie.\n• Moderator: {moderator}\n• Powód: {reason}\n• Łącznie ostrzeżeń: {totalWarns}\n• ID Kary: `#{infractionId}`',
        
        MODERATION_TIMEOUT_TITLE: '⏳ Wyciszono użytkownika',
        MODERATION_TIMEOUT_DESC: 'Użytkownik {user} został wyciszony.\n• Czas: {duration}\n• Moderator: {moderator}\n• Powód: {reason}\n• ID Kary: `#{infractionId}`',
        
        MODERATION_UNTIMEOUT_TITLE: '🔊 Zdjęto wyciszenie',
        MODERATION_UNTIMEOUT_DESC: 'Przywrócono głos użytkownikowi {user}.\n• Moderator: {moderator}\n• ID Kary: `#{infractionId}`',
        
        MODERATION_KICK_TITLE: '👢 Wyrzucono z serwera',
        MODERATION_KICK_DESC: 'Użytkownik {user} został wyrzucony.\n• Moderator: {moderator}\n• Powód: {reason}\n• ID Kary: `#{infractionId}`',
        
        MODERATION_BAN_TITLE: '🔨 Zbanowano użytkownika',
        MODERATION_BAN_DESC: 'Użytkownik {user} został wygnany na zawsze.\n• Moderator: {moderator}\n• Powód: {reason}\n• ID Kary: `#{infractionId}`',

        MODERATION_REMOVE_WARN_TITLE: '🛡️ Cofnięto ostrzeżenie',
        MODERATION_REMOVE_WARN_DESC: 'Ostrzeżenie `#{infractionId}` dla użytkownika {user} zostało usunięte.\n• Moderator: {moderator}',

        MODERATION_CLEAR_TITLE: '🧹 Sprzątanie kanału',
        MODERATION_CLEAR_DESC: 'Na kanale {channel} usunięto **{amount}** wiadomości.\n• Moderator: {moderator}',
    },

    AUTOVOICE: {
        PANEL_TITLE: '👑 Panel Władcy Komnaty',
        PANEL_DESC: 'Witaj w swojej prywatnej komnacie. Użyj poniższych przycisków, aby zarządzać kanałem.\n\n🔒 **Blokada**: Nikt poza Tobą nie wejdzie.\n🔓 **Odblokowanie**: Otwórz bramy dla wszystkich.\n📝 **Nazwa**: Zmień szyld swojej komnaty.\n👥 **Limit**: Określ ilu gości przyjmiesz.',
        
        LOCKED_TITLE: '🔒 Komnata zamknięta',
        LOCKED_DESC: 'Zaryglowałeś drzwi. Nikt nieproszony nie wejdzie.',
        
        UNLOCKED_TITLE: '🔓 Bramy otwarte',
        UNLOCKED_DESC: 'Twoja komnata jest teraz dostępna dla wszystkich wędrowców.',
        
        RENAMED_TITLE: '📝 Nowy Szyld',
        RENAMED_DESC: 'Przemianowałeś swoją komnatę na: **{name}**',
        
        SAVED_TITLE: '💾 Ustawienia Zapisane',
        SAVED_DESC: 'Twoje preferencje zostały zapamiętane. Następnym razem Twoja komnata zostanie utworzona z tymi samymi parametrami:\n\n📝 **Nazwa**: {name}\n👥 **Limit**: {limit}\n🔒 **Blokada**: {locked}',
        SAVED_EPHEMERAL: true,

        NEW_LEADER_TITLE: '👑 Nowy Władca',
        NEW_LEADER_DESC: 'Poprzedni Władca opuścił komnatę. Nowym panem tych włości zostaje **{newLeader}**!',
        
        GHOST_MODE_ON_TITLE: '👻 Tryb Ducha włączony',
        GHOST_MODE_ON_DESC: 'Twoja komnata została ukryta w cieniu. Jest teraz niewidoczna dla zwykłych śmiertelników.',
        
        GHOST_MODE_OFF_TITLE: '👁️ Tryb Ducha wyłączony',
        GHOST_MODE_OFF_DESC: 'Cienie się rozstąpiły. Twoja komnata jest znów widoczna na mapie serwera.',
    },

    SECURITY: {
        FOOTER: '🛡️ Straż Królestwa — Bezpieczeństwo Janko',
        THUMBNAIL: 'attachment://security_avatar.png',

        QUARANTINE_LOG_TITLE: '🕵️ Przechwycono wiadomość (Kwarantanna)',
        QUARANTINE_LOG_DESC: 'Użytkownik **{user}** (w kwarantannie) wysłał wiadomość na kanale {channel}.\n\n**Treść:**\n> {content}',
        
        DASHBOARD_TITLE: '⚖️ Sala Przesłuchań — Decyzja',
        DASHBOARD_DESC: 'Użytkownik **{user}** trafił do kwarantanny.\n\n**Powód:** {reason}\n**Data dołączenia:** {joined}\n**Wiek konta:** {age} dni\n\nPodaj wyrok, aby zwolnić zasoby kwarantanny.',
        
        APPROVED_TITLE: '✅ Uwolnienie z kwarantanny',
        APPROVED_DESC: 'Użytkownik **{user}** został pomyślnie zweryfikowany i uwolniony przez straż grodu.',
        APPROVED_EPHEMERAL: false,

        KICKED_TITLE: '🚪 Wyprowadzenie za bramy',
        KICKED_DESC: 'Użytkownik **{user}** został wyrzucony z grodu (kick) decyzją straży.',
        KICKED_EPHEMERAL: false,

        REJECTED_TITLE: '🔨 Wygnanie z kwarantanny',
        REJECTED_DESC: 'Użytkownik **{user}** nie przeszedł weryfikacji i został permanentnie usunięty z grodu.',
        REJECTED_EPHEMERAL: false,

        AUDIT_MAIN_TITLE: '⚖️ Janko — Audyt Bezpieczeństwa',
        AUDIT_MAIN_DESC: 'Analiza uprawnień i ról serwera **{guild}** zakończona.\n\n**Risk Score:** {score}/100\n**Status:** {status}',
        AUDIT_FIELD_EVERYONE: '🌐 Rola @everyone',
        AUDIT_FIELD_ADMINS: '⚔️ Administratorzy',
        AUDIT_STATUS_PERFECT: '🟢 Twierdza Niezdobyta',
        AUDIT_STATUS_WARNING: '🟡 Wykryto luki w obronie',
        AUDIT_STATUS_CRITICAL: '🔴 Gród zagrożony!',

        FIX_SUCCESS_TITLE: '✅ Lukę załatano',
        FIX_SUCCESS_DESC: 'Pomyślnie zaktualizowano uprawnienia dla roli **{role}**.',
        SNAPSHOT_DASHBOARD_TITLE: '🛡️ Centrum Snapshotów',
        SNAPSHOT_DASHBOARD_DESC: 'Witaj w systemie kopii zapasowych grodu. Tutaj możesz zarządzać stanem strukturalnym serwera.\n\n• **Ostatni zapis:** {lastSnapshot}\n• **Stan:** {status}',

        SNAPSHOT_CREATE_SUCCESS_TITLE: '📸 Snapshot Utworzony',
        SNAPSHOT_CREATE_SUCCESS_DESC: 'Struktura serwera została pomyślnie zarchiwizowana.\n\n• Nazwa: **{name}**\n• Role: **{roles}**\n• Kanały: **{channels}**\n• ID: `{id}`',
        
        SNAPSHOT_LIST_TITLE: '🗄️ Archiwum Snapshotów',
        SNAPSHOT_LIST_DESC: 'Lista ostatnich kopii zapasowych struktury grodu. Wybierz snapshot z listy poniżej, aby nim zarządzać.\n\n{list}',
        
        SNAPSHOT_MANAGE_TITLE: '⚙️ Zarządzanie Snapshotem',
        SNAPSHOT_MANAGE_DESC: 'Wybrano kopię zapasową do inspekcji.\n\n• Nazwa: **{name}**\n• ID: `{id}`\n• Data: {date}',
        
        SNAPSHOT_DIFF_TITLE: '🔍 Analiza Różnic (Drift)',
        SNAPSHOT_DIFF_DESC: 'Porównanie obecnego stanu serwera z kopią **{name}**.\n\n**Wykryte zmiany:**\n❌ Brakujące elementy: **{missing}**\n➕ Nadmiarowe elementy: **{extra}**\n⚙️ Zmienione nazwy: **{changed}**',
        
        SNAPSHOT_RESTORE_WARN_TITLE: '⚠️ UWAGA: PRZYWRACANIE STRUKTURY',
        SNAPSHOT_RESTORE_WARN_DESC: 'Zamierzasz przywrócić strukturę serwera z kopii **{name}**.\n\n**Ostrzeżenie:** Janko spróbuje odtworzyć brakujące kanały i role. Może to spowodować dużą liczbę powiadomień oraz zmiany w uprawnieniach.\n\nCzy na pewno chcesz kontynuować?',

        SNAPSHOT_RESTORE_SUCCESS_TITLE: '✅ Przywracanie Zakończone',
        SNAPSHOT_RESTORE_SUCCESS_DESC: 'Operacja odtwarzania struktury dobiegła końca.\n\n• Odtworzone role: **{roles}**\n• Odtworzone kanały: **{channels}**\n{errors}',

        CONFIG_RECOMMEND_AUDIT: '⚠️ **UWAGA:** Strażnicy zalecają przeprowadzenie audytu bezpieczeństwa przed konfiguracją bota! Użyj `/check-security`, aby sprawdzić luki w obronie.',

        TEMPORAL_GRANT_TITLE: '⏳ Nadano uprawnienia czasowe',
        TEMPORAL_GRANT_DESC: 'Użytkownik **{user}** otrzymał rolę {role} na okres: **{duration}**.\n\n• Moderator: {moderator}\n• Wygasa: {expiry}',
        TEMPORAL_EXPIRED_TITLE: '⏳ Uprawnienia wygasły',
        TEMPORAL_EXPIRED_DESC: 'Czas trwania uprawnień czasowych dla użytkownika **{user}** dobiegł końca.\n\n• Rola: {role}\n• Status: **Odebrana**',
        TEMPORAL_DM_TITLE: '🛡️ Twoje uprawnienia wygasły',
        TEMPORAL_DM_DESC: 'Witaj {user},\n\nTwoja czasowa ranga **{role}** na serwerze **{guild}** właśnie wygasła i została automatycznie odebrana.',
    },

    BARD: {
        FOOTER: '🎵 Bard Janko — Królewska Muzyka',
        THUMBNAIL: 'attachment://bard_avatar.png',
        
        PLAYER_TITLE: '🎵 Teraz wybrzmiewa: {title}',
        PLAYER_DESC: 'Bardska pieśń płynie przez kanał **{channel}**.\n\n• **Autor:** {author}\n• **Czas trwania:** {duration}\n• **Zleceniodawca:** {user}\n\n{queueInfo}',
        
        PLAYER_STOPPED_TITLE: '⏹️ Pieśń dobiegła końca',
        PLAYER_STOPPED_DESC: 'Bard Janko odłożył lutnię. Cisza zapadła w grodzie.',
        
        QUEUE_TITLE: '📜 Królewska Kolejka Utworów',
        QUEUE_DESC: 'Oto lista pieśni czekających na swą kolej:\n\n{list}',
        QUEUE_EMPTY: '📜 Kolejka jest pusta, Panie. Bard Janko czeka na propozycje.',
        
        ERROR_NOT_IN_VOICE: '❌ Musisz znajdować się w kanale głosowym, aby usłyszeć Barda!',
        ERROR_SAME_VOICE: '❌ Musisz być w tym samym kanale co Bard Janko!',
        ERROR_NO_RESULTS: '❌ Bard nie zna takiej pieśni... (Brak wyników)',
        ERROR_DJ_ONLY: '❌ Tylko osoby z rangą DJ mogą dyrygować Bardem!',
    }
};
