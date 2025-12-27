#  TournamentFox

**TournamentFox** ist eine moderne Web-Plattform für E-Sports Events. Die Plattform ermöglicht es Nutzern, E-Sports Events zu entdecken, zu planen, zu erstellen und an ihnen teilzunehmen.

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architektur](#-architektur)
- [Voraussetzungen](#-voraussetzungen)
- [Installation](#-installation)
- [Konfiguration](#-konfiguration)
- [Entwicklung](#-entwicklung)
- [Docker](#-docker)
- [Projektstruktur](#-projektstruktur)
- [Beitragen](#-beitragen)
- [Lizenz](#-lizenz)

## ✨ Features

- **Event-Entdeckung**: Durchsuche und entdecke E-Sports Events verschiedener Spiele
- **Event-Erstellung**: Erstelle deine eigenen E-Sports Turniere und Events
- **Event-Planung**: Plane Events im Voraus mit detaillierten Informationen
- **Teilnahme**: Nimm an Events teil und verwalte deine Registrierungen
- **Team-Management**: Verwalte Teams und deren Teilnahmen
- **Mehrsprachigkeit**: Unterstützung für Deutsch und Englisch
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Dark/Light Mode**: Unterstützung für verschiedene Theme-Modi

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) mit App Router
- **Sprache**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material-UI (MUI)](https://mui.com/)
- **Styling**: [SASS](https://sass-lang.com/)
- **Internationalisierung**: [next-intl](https://next-intl-docs.vercel.app/)
- **Formular-Validierung**: [Zod](https://zod.dev/)
- **Datum/Zeit**: [Day.js](https://dayjs.org/)
- **Containerisierung**: [Docker](https://www.docker.com/)

## 🏗 Architektur

TournamentFox basiert auf einer **Microservice-Architektur**:

```
┌─────────────────┐
│   Frontend      │  ← Dieses Repository
│   (Next.js)     │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│  API Gateway    │
│  (Backend)      │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼───┐ ┌──▼───┐ ┌───▼───┐ ┌───▼───┐
│ Auth  │ │Event │ │Team   │ │Game   │
│Service│ │Service│ │Service│ │Service│
└───────┘ └──────┘ └───────┘ └───────┘
```

Das Frontend kommuniziert mit dem Backend über eine REST API. Das Backend besteht aus mehreren Microservices, die verschiedene Funktionalitäten bereitstellen.

## 📦 Voraussetzungen

- **Node.js**: Version 18 oder höher
- **npm**: Version 9 oder höher (oder yarn/pnpm)
- **Docker** (optional): Für Container-basierte Entwicklung

## 🚀 Installation

### Lokale Entwicklung

1. **Repository klonen**
```bash
git clone https://github.com/your-username/TF-Frontend.git
cd TF-Frontend
```

2. **Abhängigkeiten installieren**
```bash
npm install
```

3. **Umgebungsvariablen konfigurieren**
```bash
cp example.env .env.local
```

4. **Umgebungsvariablen anpassen**
Bearbeite `.env.local` und setze die erforderlichen Werte (siehe [Konfiguration](#-konfiguration)).

5. **Entwicklungsserver starten**
```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar.

## ⚙️ Konfiguration

### Umgebungsvariablen

Erstelle eine `.env.local` Datei basierend auf `example.env`:

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your-google-client-secret` |
| `GOOGLE_REDIRECT_URI` | Google OAuth Redirect URI | `http://localhost:3000/api/auth/google` |
| `API_URL` | Backend API URL | `http://localhost:8080` |

### Google OAuth Setup

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. Aktiviere die Google+ API
4. Erstelle OAuth 2.0 Credentials
5. Füge die Redirect URI hinzu: `http://localhost:3000/api/auth/google`
6. Kopiere Client ID und Client Secret in deine `.env.local`

## 💻 Entwicklung

### Verfügbare Scripts

```bash
# Entwicklungsserver starten (mit Turbopack)
npm run dev

# Production Build erstellen
npm run build

# Production Server starten
npm start

# Linting ausführen
npm run lint
```

### Projektstruktur

```
TF-Frontend/
├── src/
│   ├── actions/          # Server Actions
│   ├── app/              # Next.js App Router
│   │   ├── [locale]/     # Internationalisierte Routen
│   │   └── api/          # API Routes
│   ├── components/       # React Komponenten
│   │   ├── atoms/        # Atomare Komponenten
│   │   ├── layout/       # Layout Komponenten
│   │   └── providers/    # Context Provider
│   ├── constants/        # Konstanten
│   ├── context/          # React Context
│   ├── enum/             # TypeScript Enums
│   ├── i18n/             # Internationalisierung
│   ├── schemas/          # Zod Schemas
│   ├── style/            # SASS Stylesheets
│   ├── types/            # TypeScript Typen
│   └── utils/            # Utility Funktionen
├── public/               # Statische Assets
├── messages/             # Übersetzungsdateien
├── Dockerfile            # Docker Konfiguration
└── next.config.ts        # Next.js Konfiguration
```

### Code-Stil

- **TypeScript**: Strikte Typisierung wird verwendet
- **ESLint**: Code-Qualität wird durch ESLint sichergestellt
- **Komponenten**: Atomic Design Prinzipien (Atoms, Molecules, Organisms)
- **Styling**: SASS mit BEM-ähnlicher Namenskonvention

## 🐳 Docker

### Docker Build

```bash
docker build -t tournamentfox-frontend .
```

### Docker Run

```bash
docker run -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=your-client-id \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  -e GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google \
  -e API_URL=http://localhost:8080 \
  tournamentfox-frontend
```

### Docker Compose (Beispiel)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
      - API_URL=${API_URL}
```

## 🤝 Beitragen

Beiträge sind willkommen! Bitte befolge diese Schritte:

1. **Fork** das Repository
2. Erstelle einen **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. **Push** zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen **Pull Request**

### Beitragsrichtlinien

- Folge dem bestehenden Code-Stil
- Schreibe aussagekräftige Commit-Messages
- Füge Tests hinzu, wenn möglich
- Aktualisiere die Dokumentation bei Bedarf
- Stelle sicher, dass der Linter keine Fehler meldet

## 📝 Lizenz

Dieses Projekt ist unter der [MIT License](LICENSE) lizenziert - siehe die LICENSE Datei für Details.



## 📧 Kontakt

Bei Fragen oder Anregungen kannst du:
- Ein Issue auf GitHub erstellen
- Einen Pull Request einreichen
- Die Projekt-Maintainer kontaktieren

---

**Entwickelt mit ❤️ für die E-Sports Community**
