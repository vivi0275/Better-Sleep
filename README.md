# Better Sleep 🌙

**Better Sleep** is an AI-powered sleep optimization web application that helps you improve your sleep quality by providing smart alarm recommendations, sleep analytics, and real-time environment monitoring.

## Features

- **AI-Powered Alarm Recommendations** — The app analyzes your sleep history, environment data, and upcoming calendar events to recommend the optimal wake-up time using the DeepResearch 30B AI model (via [OpenRouter](https://openrouter.ai/)).
- **Sleep Analytics** — Track and visualize your sleep duration and quality over weekly, monthly, and yearly periods with interactive charts.
- **Environment Monitoring** — Monitor your sleep environment in real time: temperature, light level, air quality, and noise level.
- **Google Calendar Integration** — Automatically syncs with your Google Calendar so alarms are scheduled around your upcoming events.
- **Customizable Themes** — Choose from built-in color palettes or create your own custom theme, with support for dark and light modes. Save up to 5 favorite palettes.
- **Onboarding & Authentication** — Simple sign-up / sign-in flow with a guided onboarding experience for new users.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) |
| UI components | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Routing | [React Router v6](https://reactrouter.com/) |
| Data fetching | [TanStack Query (React Query)](https://tanstack.com/query) |
| Charts | [Recharts](https://recharts.org/) |
| Google Calendar | [Google OAuth](https://developers.google.com/identity) + googleapis |
| AI recommendations | [OpenRouter API](https://openrouter.ai/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later and npm

### Installation

```sh
# 1. Clone the repository
git clone https://github.com/vivi0275/Better-Sleep.git
cd Better-Sleep

# 2. Install dependencies
npm install

# 3. Configure environment variables (see section below)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Google Calendar OAuth credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_GOOGLE_PROJECT_ID=your_google_project_id_here

# OpenRouter AI API key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

- **Google credentials** — follow the steps in [`GOOGLE_OAUTH_SETUP.md`](GOOGLE_OAUTH_SETUP.md) and [`GOOGLE_CALENDAR_SETUP.md`](GOOGLE_CALENDAR_SETUP.md) to create an OAuth 2.0 client in Google Cloud Console.
- **OpenRouter API key** — sign up at [openrouter.ai](https://openrouter.ai/) and generate an API key.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/       # Reusable UI components (AlarmCard, SleepChart, …)
├── config/           # App-wide configuration (Figma, theme presets)
├── hooks/            # Custom React hooks (useGoogleCalendar, useAlarmRecommendation, …)
├── lib/              # Utility functions
├── pages/            # Route-level page components
│   ├── Auth.tsx          # Sign-in / sign-up
│   ├── OnboardingIntro.tsx
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx     # Main screen: alarm, sleep stats, environment
│   ├── Analytics.tsx     # Sleep history charts and metrics
│   └── Settings.tsx      # App preferences and theme customization
└── services/         # External API clients (AI recommendations, Google Calendar, Figma)
```

## License

This project is open-source. See the repository for details.
