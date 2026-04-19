# Preferencje i Ograniczenia Projektu

Ten plik zawiera wytyczne od Użytkownika dotyczące kierunku rozwoju bota Janko, ze szczególnym uwzględnieniem rzeczy, których należy unikać oraz zatwierdzonych funkcji podzielonych na kategorie i priorytety.

## 🚫 Czego NIE sugerować / NIE robić:

### UI i Grafika
- **Canvas dla profili**: Nie używamy Canvas API do generowania kart profilu gracza/użytkownika. (Canvas jest dopuszczalny do innych celów, np. onboarding).
- **Information Domain expansion**: Nie rozbudowujemy komend `/user-info` czy `/server-info` o dodatkowe dane techniczne/surowe.

### Funkcje Społecznościowe i Fun
- **Standardowa Ekonomia**: Nie sugerować standardowych systemów ekonomicznych (Użytkownik ma własny plan).
- **Quotes System**: Nie chcemy systemu zapisywania cytatów.
- **Birthdays**: Nie chcemy systemu urodzin.
- **Polls**: Nie chcemy zaawansowanego systemu ankiet.
- **Confessions**: Nie chcemy systemu anonimowych wyznań.
- **Reputacja/Karma**: Nie chcemy systemów punktowania użytkowników.
- **Timezone Tracker**: Nie chcemy śledzenia stref czasowych.
- **Color System**: Nie chcemy systemu zmiany kolorów nicków.

### Automatyzacja i Narzędzia
- **Herold 2.0 (Zapisy na eventy)**: Odrzucono pomysł rozbudowy Herolda o system rezerwacji/zapisów na eventy.
- **Config 2.0**: Nie zmieniać/rozbudowywać obecnego systemu `/config` o bulk editing czy gotowe szablony.
- **Media Cleanup**: Nie chcemy automatycznego usuwania mediów/wiadomości z kanałów.
- **Media Fixer**: Nie chcemy automatycznego naprawiania linków do mediów.
- **Lobby System**: Nie chcemy systemu szukania ekipy do gier.
- **Custom Triggers**: Nie chcemy silnika własnych automatyzacji/wyzwalaczy.
- **Server Status Monitor**: Nie gramy na własnych serwerach, nie potrzebujemy monitoringu.
- **File Downloader**: Nie chcemy funkcji pobierania plików przez bota.
- **Staff Notes**: Nie chcemy systemu prywatnych notatek o użytkownikach w teczce.
- **AFK Intelligence**: Nie chcemy systemu automatycznego przenoszenia AFK.

### Inne
- **Watchdog**: Nie chcemy systemu monitorowania innych botów (celujemy w brak innych botów).
- **Anti-Scam/Phishing**: Nie chcemy dedykowanego modułu ochrony przed linkami scamerskimi.
- **AI Features**: **ABSOLUTNE ZERO AI**. Nie sugerować streszczania rozmów, czatów AI itp.
- **Activity Tracker (User Level)**: Nie rozbudowujemy bota o `/user-info` ani żadne statystyki per-użytkownik widoczne publicznie.

---

## ✅ Zatwierdzone do realizacji:

### 🛡️ Bezpieczeństwo (Security)
**Priorytet: Na już**
- **Audytor Bezpieczeństwa** (`/check-security`): Analiza uprawnień i ról.
- **Strażnik Uprawnień**: Automatyczne cofanie nadań uprawnień krytycznych dla osób innych niż właściciel.
- **System Anty-Raid**: Mechanizmy Lockdown i filtr wiekowy kont.
- **Weryfikacja Human-First**: Prosty system weryfikacji przez przycisk wejściowy.

**Odroczenie: W czasie**
- **Auto-Nuke Protection**: Blokada serwera przy wykryciu masowego usuwania kanałów/ról.
- **Safe-Mode**: "Przycisk paniki" – zamrażanie serwera (Read-Only).
- **Janko Watch**: Globalna sieć bezpieczeństwa (oznaczanie znanych raiderów).

### 📊 Dane i Monitoring (Watchtower)
**Priorytet: Na już**
- **Logowanie Watchtower**: Szczegółowe logi edycji/usuwania wiadomości oraz zmian w kanałach.
- **Teczka Użytkownika**: Permanentna historia każdego członka (wejścia, wyjścia, kary, zmiany nicków).
- **Smart Logs (Action Grouping)**: Grupowanie wielu szybkich zmian w jeden zbiorczy log.
- **Wykrywanie Ghost-Pingów**: Logowanie i oznaczanie ghost-pingów.
- **Admin Quick Actions**: Przyciski akcji (Kick/Ban/Mute) bezpośrednio w logach.

**Odroczenie: W czasie**
- **Activity Tracker**: Podsumowania aktywności w grach oraz czasu na Voice (Dzień/Tydzień/Miesiąc).
- **Social Stream**: Powiadomienia o streamach znajomych (Twitch, YT, Kick).
- **Incident Deep Dive**: Przycisk "Generuj Raport" pod podejrzanymi logami.

### ⚙️ Administracja i Infrastruktura
**Priorytet: Na już**
- [x] **Centralized UI Config & Templates**: Centralny plik ze stylami i szablonami tekstów.
- [x] **Dynamic Visibility Control**: Widoczność komunikatów (Publiczne/Prywatne) zarządzana wyłącznie przez `templates.js` (klucze `_EPHEMERAL`).
- [ ] **Config Polish**: Informacja o właścicielu serwera w panelu `/config`.
- [ ] **Przywracanie Ról**: Automatyczne nadawanie rang przy powrocie użytkownika.

**Odroczenie: W czasie**
- [ ] **Backupy Serwera**: Snapshosty struktury kanałów i ról.
- [ ] **Czasowe Uprawnienia**: Nadawanie dostępu/roli na określony czas.
- [ ] **Bot Health Status**: Komenda `/janko-status`.

### 🎵 Rozrywka
**Priorytet: Na już**
- [ ] **Bard Janko**: Wbudowany odtwarzacz muzyki YouTube/Spotify.

---

## 💎 Planowany Tuning (Standard Premium):

### 🔊 Auto-Voice (Komnaty)
- [x] **Na już**: Panel Władcy Komnaty (Blokada, Nazwa, Limit).
- [ ] **Na już**: Voice Text Cleanup (Automatyczne czyszczenie kanału tekstowego po sesji).

### 🛡️ Moderacja
- [x] **Na już**: Verbose Errors (Przez UI Engine).
- [ ] **Na już**: System Undo (Przycisk "Cofnij Akcję" przy logach kar).

### ✉️ Herold (Przypomnienia)
- [x] **Na już**: Pełna integracja z UI Engine (Fields, TEXT mode).
- [ ] **W czasie**: Full Modal Interface.

---

## 💡 Ogólne Preferencje:
- **Dashboard**: Szlifowanie obecnego systemu `/config` (Buttons/Selects) jest priorytetem.
- **Konkrety**: Skupienie na unikalnych, niszowych rozwiązaniach.
- **Minimalizm**: Janko jako jedyny bot na serwerze.
