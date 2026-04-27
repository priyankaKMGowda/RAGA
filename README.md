# MediCore — B2B Healthcare SaaS UI

A production-ready, modular **React + TypeScript** frontend for a B2B healthcare
platform. Includes authentication (Firebase), analytics, patient management
with grid/list views, and service-worker-powered notifications.

> Built as a frontend assignment to demonstrate architecture, state management,
> UX polish, and best practices.

---

## 🚀 Live Demo

🌐 **https://medicore-priyanka.netlify.app**

### Test credentials

| Field | Value |
| --- | --- |
| **Email** | `demo@medicore.app` |
| **Password** | `demo1234` |

> Powered by **Firebase Authentication** (email/password). The same credentials
> work both on the deployed site and locally. If running locally without a
> `.env.local` file, the app falls back to an identical demo account.

---

## ✨ Features

| Module | What's included |
| --- | --- |
| **Authentication** | Firebase email/password login, session persistence via `onAuthStateChanged`, validated form, error handling, protected routes. Falls back to a **demo mode** if Firebase is not configured. |
| **Dashboard** | KPI cards, weekly visits chart, recent admissions feed. |
| **Analytics** | Multiple charts (admissions vs discharges, status pie, NPS line, caseload). |
| **Patients** | Searchable + filterable patient directory with **toggleable Grid ⇄ List view** (preference persisted). |
| **Patient Details** | Vitals chart, diagnosis, medications, **send check-in reminder via push notification**. |
| **Notifications** | Service worker (`/service-worker.js`) with `push`, `notificationclick`, message-driven local notifications, app-shell caching. |
| **State** | Redux Toolkit store with three slices: `auth`, `patients`, `notifications`. |

### Bonus
- **Code-splitting** via `React.lazy` + Vite manual chunks (`react`, `redux`, `firebase`, `charts`).
- **Reusable components** (`ViewToggle`, `Avatar`, `StatusBadge`, `Spinner`).
- **Responsive** mobile → desktop, accessible (ARIA roles, keyboard).
- **Offline-friendly** app shell cached by the service worker.

---

## 🧱 Tech Stack
- **React 18 + TypeScript**
- **Redux Toolkit** + `react-redux` for state management
- **React Router v6**
- **Firebase Authentication** v10
- **Tailwind CSS** for styling
- **Recharts** for analytics
- **Vite** for build tooling
- **Service Worker** (vanilla, in `/public`) for push & offline

---

## 📁 Folder Structure

```
src/
├── app/                      # Redux store + typed hooks
│   ├── store.ts
│   └── hooks.ts
├── features/                 # Feature-based slices (Redux Toolkit)
│   ├── auth/
│   │   ├── authService.ts    # Firebase + demo fallback
│   │   └── authSlice.ts
│   ├── patients/
│   │   ├── patientsData.ts   # Mock dataset
│   │   └── patientsSlice.ts
│   └── notifications/
│       └── notificationsSlice.ts
├── components/
│   ├── common/               # Reusable UI atoms
│   │   ├── Avatar.tsx
│   │   ├── Spinner.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ViewToggle.tsx    # Grid ⇄ List toggle (a11y radiogroup)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── patients/
│       ├── PatientGrid.tsx
│       └── PatientList.tsx
├── pages/                    # Route components (lazy-loaded)
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   ├── Patients.tsx
│   ├── PatientDetails.tsx
│   └── NotFound.tsx
├── routes/
│   ├── AppRoutes.tsx         # Routing + Suspense
│   └── PrivateRoute.tsx      # Auth-guarded layout
├── services/
│   ├── firebase.ts           # Firebase init (gated by env)
│   └── notifications.ts      # SW registration + show helpers
├── types/
│   └── index.ts
├── App.tsx                   # Bootstrap (auth + SW)
├── main.tsx                  # ReactDOM root + Provider
├── index.css                 # Tailwind + design tokens
└── vite-env.d.ts

public/
├── service-worker.js         # Push, notifications, app-shell cache
└── favicon.svg
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure Firebase
cp .env.example .env.local
# Fill in VITE_FIREBASE_* values from your Firebase console

# 3. Start the dev server
npm run dev
```

> If you skip step 2, the app runs in **DEMO mode**.
> Login: `demo@medicore.app` / `demo1234`

### Build & Preview

```bash
npm run build     # Type-check + production build (outputs /dist)
npm run preview   # Locally preview the production build
```

---

## 🔐 Firebase Setup

1. Create a project at https://console.firebase.google.com/.
2. Enable **Email/Password** in **Authentication → Sign-in method**.
3. Copy the web app config into `.env.local` (see `.env.example`).
4. Restart the dev server.

The app automatically detects whether Firebase is configured (`firebaseEnabled`
in `src/services/firebase.ts`) and switches behavior between the real provider
and the local demo mock.

---

## 🔔 Notifications (Service Worker)

- Registered in `App.tsx` via `services/notifications.ts`
- Source: `public/service-worker.js`
- The worker:
  - Caches the app shell (offline-friendly)
  - Listens for `push` events (compatible with FCM web push)
  - Listens for page → SW messages to dispatch local notifications
  - Handles `notificationclick` to focus / open the app

**Live demo:** open any patient → click **"Send check-in reminder"** to trigger
a real browser notification routed through the service worker. The app also
falls back to in-app notifications if browser permission is denied.

---

## 🧠 State Management

Three Redux Toolkit slices are composed in `src/app/store.ts`:

| Slice | Purpose |
| --- | --- |
| `auth` | Current user, status (`loading` / `authenticated` / `error`), thunks for login / logout. |
| `patients` | Patient dataset, **view mode (grid/list)** persisted to `localStorage`, search & status filters. |
| `notifications` | In-app notification feed + browser permission state. |

Typed hooks (`useAppDispatch`, `useAppSelector`) live in `src/app/hooks.ts`.

---

## 🌐 Deployment

Both Vercel and Netlify are pre-configured.

### Vercel
```bash
npm i -g vercel
vercel
```
`vercel.json` already contains the SPA rewrite + correct cache headers for
`/service-worker.js`.

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```
`netlify.toml` configures the build command, publish dir, redirects, and
service-worker headers.

Don't forget to set the `VITE_FIREBASE_*` environment variables on the host
(or accept demo mode).

---

## 🧪 Manual Test Checklist

- [ ] Login with valid demo credentials → redirected to `/dashboard`
- [ ] Invalid credentials show inline error
- [ ] Dashboard KPIs and chart render
- [ ] Analytics page renders all 4 charts
- [ ] `/patients` shows 12 mock patients
- [ ] Toggle Grid ⇄ List — preference persists across reload
- [ ] Search + status filter work
- [ ] Open a patient → vitals chart visible
- [ ] Click **Send check-in reminder** → browser notification appears
- [ ] Sign out clears session and redirects to login

---

## 🏗️ Architecture Notes

- **Feature-first** folder layout for scalability — each feature owns its
  slice, services, and (where appropriate) components.
- **Lazy routing** keeps the initial bundle small (login can be loaded
  independently of authenticated routes).
- **Service-worker-driven notifications** decouple the page from the OS
  layer — pushes arrive even if the tab is backgrounded.
- The `firebaseEnabled` toggle keeps the app **runnable out of the box**
  without leaking demo logic into production paths.
- Types live in `src/types` so domain entities (`Patient`, `AppUser`) are
  easy to evolve and share.

---

## 📜 License
MIT — feel free to use this as a reference architecture.
