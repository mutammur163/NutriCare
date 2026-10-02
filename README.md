# NutriCare — Child Nutrition & Meal Planning System

A functional web application for tracking and managing child nutrition, growth measurements, and balanced meal plans. Built as a college project demonstration.

## Technology Stack

- **Frontend**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date handling**: date-fns
- **Persistence**: Browser localStorage

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Demo Credentials

> ⚠️ **IMPORTANT**: These credentials are hardcoded for demonstration purposes only. Replace with real authentication before any production deployment.

| Role | Email | Password |
|------|-------|----------|
| Worker | worker@anganwadi.demo | Worker@123 |
| Supervisor | supervisor@anganwadi.demo | Supervisor@123 |
| Parent / Caregiver | parent@anganwadi.demo | Parent@123 |

### Quick Login
Click the demo account buttons on the login page to autofill credentials.

## Features

### Worker / Supervisor
- **Dashboard** — Summary metrics, weekly distribution chart, recent activity feed
- **Children** — Register, view, edit, and delete child records with search and filters
- **Growth Monitoring** — Record measurements, view trend charts, WHO-based screening flags
- **Meal Planner** — Create 7-day plans, rule-based meal suggestions, allergen checking
- **Meal Distribution** — Record and track planned vs. actual servings per day
- **Follow-ups** — Manage outstanding tasks with priority and status tracking
- **Nutrition Education** — Multilingual articles (English, Kannada, Hindi)
- **Reports** — Summary stats and CSV exports for all modules
- **Settings** — Centre info, language, budget, and demo data reset

### Parent / Caregiver
- View linked child's growth history
- Access nutrition education content
- View follow-up reminders

## Demo Data

All data is stored in browser `localStorage`. Demo data includes:
- 15 fictional children with Indian names (not real beneficiaries)
- Multiple growth measurements per child
- Weekly meal plans with regional Indian foods
- Meal distribution records
- Follow-up tasks
- Nutrition education articles in English, Kannada, and Hindi

Use **Settings → Reset to Demo Data** to restore the original fictional records.

## Growth Monitoring Disclaimer

Growth screening in this application uses approximate median reference values from WHO Child Growth Standards (2006). Software-generated flags are **NOT clinical diagnoses**. They are screening indicators only. Consult a qualified health professional for any clinical assessment.

## Limitations & Future Work

For a production deployment, the following should be replaced:

1. **Authentication**: Replace hardcoded demo credentials with a proper authentication backend (JWT, OAuth, etc.)
2. **Database**: Replace `localStorage` with a server-side database (PostgreSQL, Firebase Firestore, etc.)
3. **WHO Growth Standards**: Integrate full Z-score tables from WHO Anthro software
4. **Multi-centre**: Add proper centre management and data isolation
5. **Offline support**: Add service worker for offline use in low-connectivity areas
6. **i18n**: Complete translations for all UI text in Kannada and Hindi
7. **Sync**: Add data synchronisation when connectivity is restored

## Project Structure

```
src/
├── types/          # TypeScript interfaces
├── data/           # Demo credentials and seed data
├── services/       # Data access layer (localStorage)
├── utils/          # Date, ID, and formatting utilities
├── contexts/       # Auth context
├── routes/         # Protected route component
├── layouts/        # App shell (Sidebar, AppLayout)
└── pages/          # Route-level page components
```

## Disclaimer

This application is a college project demonstration. All data is fictional. The nutrition information provided is for general educational purposes only and is not medical advice. Do not use this application for actual clinical decisions.
