# FinTrack — Precision Wealth Management Dashboard

<div align="center">
  <p>A modern financial command center engineered with high precision, premium aesthetics, and intuitive functionality to help you master your financial future.</p>

  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/React%20Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/pnpm-workspaces-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</div>

---

## Deskripsi

**FinTrack** adalah aplikasi web manajemen keuangan pribadi berbasis **pnpm Monorepo** dengan arsitektur Next.js 16 (App Router) + Express.js + Firebase. Menyediakan dashboard visual, pencatatan transaksi CRUD, smart budgeting, analisis tren keuangan, transaksi berulang (recurring), serta autentikasi aman — dalam satu antarmuka premium modern.

---

## Problem yang Diselesaikan

1. **Kurangnya transparansi finansial** — saldo, pemasukan, dan pengeluaran tidak terlihat dalam satu tempat.
2. **Pengeluaran melebihi anggaran** — tidak ada peringatan dini saat budget kategori hampir habis.
3. **Ribet mencatat transaksi** — form input tidak intuitif sehingga malas mencatat.
4. **Analisis keuangan sulit** — data mentah berupa angka tanpa visualisasi tren.

---

## Fitur Utama

- **Dashboard Interaktif** — ringkasan saldo, pemasukan/pengeluaran, cashflow chart (Chart.js), spending breakdown per kategori, dan transaksi terbaru.
- **Manajemen Transaksi CRUD** — tambah, edit, hapus transaksi dengan filter (tipe, kategori, tanggal, search), pagination cursor-based, dan ekspor CSV.
- **Recurring Transactions** — transaksi berulang otomatis (daily/weekly/monthly/yearly) dengan endpoint `POST /api/transactions/process-recurring`.
- **Tags & Attachments** — label tag dan lampiran file pada setiap transaksi.
- **Smart Budgeting** — batas pengeluaran per kategori dengan indikator visual (good/warning/critical) per periode (monthly/weekly/yearly).
- **Analisis Keuangan** — cashflow bulanan, breakdown pengeluaran per kategori, tren year-over-year.
- **Batch Operasi** — buat hingga 500 / hapus hingga 100 transaksi sekaligus.
- **Autentikasi Firebase** — email/password + Google Sign-In dengan token auto-refresh.
- **Multi-mata Uang** — IDR, USD, EUR, GBP, JPY, SGD.
- **Dark/Light Mode + Multi Bahasa** — EN/ID, tersimpan per akun.
- **Reset Data** — hapus semua transaksi, budget, dan kategori kustom via `POST /api/users/reset`.

---

## Tech Stack

Monorepo **pnpm Workspaces** — `apps/web` (frontend) dan `apps/api` (backend) terpisah dalam satu repo.

### Frontend — `apps/web`

| Teknologi | Versi | Peran |
| :--- | :--- | :--- |
| Next.js (App Router) | 16.2 | Framework frontend, routing berbasis direktori, RSC |
| React | 19.2 | UI library, concurrent rendering |
| TypeScript | 5 (strict) | Type safety seluruh codebase frontend |
| Tailwind CSS | v4 | Utility-first styling + CSS variables theming |
| TanStack React Query | v5 | Server state, caching, query invalidation |
| Chart.js + react-chartjs-2 | v4 | Visualisasi cashflow & kategori |
| Firebase Client SDK | v12 | Auth (email/password + Google) |
| Sonner | v2 | Toast notification |
| Material Symbols | Google Fonts | Icon system |

### Backend — `apps/api`

| Teknologi | Versi | Peran |
| :--- | :--- | :--- |
| Node.js + Express | 4.21 | REST API runtime |
| Firebase Admin SDK | v13 | Verifikasi token + Firestore Admin |
| Cloud Firestore | — | Database NoSQL, cursor-based pagination |
| express-validator | v7 | Validasi & sanitasi input server-side |
| Helmet + CORS | — | Security headers & CORS terkontrol |
| express-rate-limit | v8 | Rate limiting (auth, batch, reset) |
| Pino + Morgan | — | Structured logging + correlation ID |
| Vitest + Supertest | v4 / v7 | Unit & integration testing |

---

## Struktur Proyek

```
Finance-Tracker/
├── apps/
│   ├── web/                               # Frontend (Next.js 16 App Router)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx             # Root layout (fonts, SW, providers)
│   │       │   ├── page.tsx               # Landing page (/)
│   │       │   ├── error.tsx              # Global error boundary
│   │       │   ├── not-found.tsx          # 404 page
│   │       │   ├── login/page.tsx
│   │       │   ├── register/page.tsx
│   │       │   └── (dashboard)/           # Route group — layout bersama
│   │       │       ├── layout.tsx         # DashboardLayout (Sidebar + Topbar)
│   │       │       ├── dashboard/page.tsx
│   │       │       ├── transactions/page.tsx
│   │       │       ├── budget/page.tsx
│   │       │       ├── analytics/page.tsx
│   │       │       └── settings/page.tsx
│   │       ├── components/
│   │       │   ├── dashboard/             # SummaryCards, CashFlowChart, SpendingChart, RecentTransactions
│   │       │   ├── transactions/          # TransactionTable, FilterBar, TransactionsSkeleton
│   │       │   ├── budget/                # BudgetSkeleton
│   │       │   ├── analytics/             # AnalyticsSkeleton
│   │       │   ├── settings/              # ProfileSection, AppearanceSection, CategoryManager, SettingsSkeleton
│   │       │   ├── auth/                  # AuthHero, AuthLayout, GoogleButton
│   │       │   ├── Sidebar.tsx
│   │       │   ├── Topbar.tsx
│   │       │   ├── BottomNav.tsx
│   │       │   ├── TransactionModal.tsx
│   │       │   ├── BudgetModal.tsx
│   │       │   ├── ConfirmDialog.tsx
│   │       │   ├── Skeleton.tsx
│   │       │   └── Providers.tsx
│   │       ├── context/
│   │       │   ├── AuthContext.tsx        # Firebase auth + currency formatter
│   │       │   ├── ThemeContext.tsx        # Dark/light mode
│   │       │   └── LanguageContext.tsx    # EN/ID i18n
│   │       ├── lib/
│   │       │   ├── api.ts                 # Fetch wrapper (auto-inject + auto-refresh Bearer token)
│   │       │   ├── firebase.ts            # Firebase client init
│   │       │   ├── constants.ts           # FIREBASE_ERRORS mapping
│   │       │   ├── formatting.ts          # Number/date formatters
│   │       │   └── translations.ts        # EN + ID translation keys
│   │       └── types/
│   │           └── index.ts              # Semua TypeScript interfaces
│   │
│   └── api/                              # Backend (Express + Firebase Admin)
│       └── src/
│           ├── index.js                  # Express entry + middleware chain
│           ├── config/firebase.js        # Admin SDK init
│           ├── middleware/
│           │   ├── auth.js               # Token verification + 5-min cache
│           │   ├── errorHandler.js       # Global error handler
│           │   ├── rateLimiter.js        # authLimiter, batchLimiter, resetLimiter
│           │   └── validate.js           # express-validator wrapper
│           ├── routes/
│           │   ├── auth.routes.js
│           │   ├── user.routes.js
│           │   ├── transaction.routes.js
│           │   ├── budget.routes.js
│           │   ├── category.routes.js
│           │   └── analytics.routes.js
│           ├── services/
│           │   ├── auth.service.js
│           │   ├── user.service.js
│           │   ├── transaction.service.js
│           │   ├── budget.service.js
│           │   ├── category.service.js
│           │   ├── analytics.service.js
│           │   └── recurring.service.js  # Proses transaksi berulang
│           ├── utils/
│           │   ├── firestore.js          # Firestore helper queries
│           │   ├── logger.js             # Pino logger + correlation ID
│           │   ├── pagination.js         # Cursor-based pagination
│           │   ├── response.js           # Standardized response helpers
│           │   ├── recurring.js          # Recurring transaction logic
│           │   ├── errors.js             # Custom error classes
│           │   └── constants.js          # App-wide constants
│           ├── seeds/seed.js             # Demo data seeder
│           └── tests/                    # Vitest test suite
│
├── package.json                          # Root workspace config (pnpm)
└── .gitignore
```

---

## Routing Frontend

| Route | File | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| `/` | `app/page.tsx` | No | Landing page |
| `/login` | `app/login/page.tsx` | No | Email/password + Google Sign-In |
| `/register` | `app/register/page.tsx` | No | Registrasi akun baru |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Yes | Summary cards, cashflow chart, spending chart, recent transactions |
| `/transactions` | `app/(dashboard)/transactions/page.tsx` | Yes | CRUD, filter, search, CSV export, batch ops |
| `/budget` | `app/(dashboard)/budget/page.tsx` | Yes | Budget per kategori (good/warning/critical) |
| `/analytics` | `app/(dashboard)/analytics/page.tsx` | Yes | Cashflow trends, category breakdown |
| `/settings` | `app/(dashboard)/settings/page.tsx` | Yes | Profile, tema, bahasa, kategori CRUD |

---

## API Endpoints

Semua response menggunakan format: `{ success: boolean, data?: T, message?: string, pagination?: { hasMore, nextCursor, itemsPerPage } }`

### Auth

| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Registrasi email/password |
| POST | `/api/auth/google` | Yes | Sinkronisasi Google Sign-In |
| GET | `/api/auth/me` | Yes | Data user saat ini |

### Users

| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| GET | `/api/users/profile` | Yes | Ambil profil user |
| PUT | `/api/users/profile` | Yes | Update profil (displayName, currency, darkMode, photoURL) |
| POST | `/api/users/reset` | Yes | Reset semua data user (body: `{ confirm: "RESET" }`) |

### Transactions

| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| GET | `/api/transactions` | Yes | List dengan filter (type, categoryId, startDate, endDate, search, sortBy, order) + cursor pagination |
| POST | `/api/transactions` | Yes | Buat transaksi (support recurring, tags, attachments) |
| GET | `/api/transactions/summary` | Yes | Ringkasan income/expense bulanan (`?month&year`) |
| POST | `/api/transactions/process-recurring` | Yes | Proses transaksi berulang yang jatuh tempo |
| POST | `/api/transactions/batch` | Yes | Batch create hingga 500 transaksi |
| DELETE | `/api/transactions/batch` | Yes | Batch delete hingga 100 transaksi (`body: { ids: [...] }`) |
| GET | `/api/transactions/:id` | Yes | Detail satu transaksi |
| PUT | `/api/transactions/:id` | Yes | Update transaksi |
| DELETE | `/api/transactions/:id` | Yes | Hapus transaksi |

### Budgets

| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| GET | `/api/budgets` | Yes | List budget (`?month&year`) |
| POST | `/api/budgets` | Yes | Buat budget (atomic, cegah duplikat per kategori/periode) |
| GET | `/api/budgets/summary` | Yes | Ringkasan budget usage (`?month&year`) |
| PUT | `/api/budgets/:id` | Yes | Update budget |
| DELETE | `/api/budgets/:id` | Yes | Hapus budget |

### Categories

| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| GET | `/api/categories` | Yes | List semua kategori user |
| POST | `/api/categories` | Yes | Buat kategori (name, icon, color, type) |
| PUT | `/api/categories/:id` | Yes | Update kategori |
| DELETE | `/api/categories/:id` | Yes | Hapus kategori (ditolak jika masih ada transaksi) |

### Analytics

| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| GET | `/api/analytics/overview` | Yes | Balance, income, expense, budget usage, recent transactions |
| GET | `/api/analytics/cashflow` | Yes | Income vs expense bulanan (`?months=6`) |
| GET | `/api/analytics/categories` | Yes | Breakdown pengeluaran per kategori (`?month&year`) |
| GET | `/api/analytics/trends` | Yes | Tren year-over-year |

---

## Cara Install & Run

### Prasyarat

- Node.js >= 18
- **pnpm** >= 9 — `npm install -g pnpm`
- Firebase project dengan **Authentication** dan **Firestore** diaktifkan

### 1. Clone

```bash
git clone https://github.com/WahyutegarNugroho/Finance-Tracker.git
cd Finance-Tracker
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Konfigurasi Environment

#### Backend — `apps/api/.env`

Salin dari `apps/api/.env.example`:

```env
PORT=5000

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

FRONTEND_URL=http://localhost:3000

SEED_USER_EMAIL=demo@fintrack.com
SEED_USER_PASSWORD=Demo123456!
```

#### Frontend — `apps/web/.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Seed Data Demo (Opsional)

```bash
pnpm seed
```

Login dengan: **demo@fintrack.com** / **Demo123456!**

### 5. Jalankan

#### Mode Development (semua sekaligus)

```bash
pnpm dev
```

Atau di dua terminal terpisah:

```bash
# Terminal 1 — API (port 5000)
pnpm dev:api

# Terminal 2 — Web (port 3000)
pnpm dev:web
```

#### Mode Production

```bash
pnpm build

cd apps/api && node src/index.js
cd apps/web && pnpm start
```

Buka **http://localhost:3000**

---

## Commands Lengkap

| Perintah | Fungsi |
| :--- | :--- |
| `pnpm dev` | Jalankan API + Web bersamaan (concurrently) |
| `pnpm dev:web` | Next.js dev server (port 3000) |
| `pnpm dev:api` | Express API dengan nodemon (port 5000) |
| `pnpm build` | Build production Next.js |
| `pnpm seed` | Seed demo data ke Firestore |
| `pnpm test` | Jalankan Vitest test suite |
| `pnpm lint` | Lint semua workspace |
| `pnpm lint:web` | Lint frontend saja |
| `pnpm lint:api` | Lint backend saja |

---

## Auth Flow

1. User login via Firebase Client SDK (`signInWithEmailAndPassword` atau Google popup)
2. `onAuthStateChanged` → fetch profil dari API untuk mendapat preferensi currency
3. `lib/api.ts` otomatis inject `Authorization: Bearer <token>` ke setiap request
4. Jika response 401 → token di-refresh sekali dan request diulang; jika masih 401 → sign out + redirect `/login`
5. Backend `middleware/auth.js` verifikasi token via `admin.auth().verifyIdToken()` dengan in-memory cache 5 menit
6. `req.user` berisi `{ uid, email, name, picture, emailVerified }`

---

## Kelebihan Teknis

- **pnpm Monorepo** — FE dan BE terpisah rapi, dependency di-hoist dengan efisien.
- **Cursor-based pagination** — performa tinggi untuk ribuan transaksi (tanpa offset).
- **Denormalized category data** — `categoryName` dan `categoryIcon` disimpan langsung di transaksi (tidak perlu JOIN/lookup).
- **Atomic budget creation** — Firestore transaction untuk cegah duplikat budget per kategori/periode.
- **Token caching** — verifikasi Firebase Auth di-cache 5 menit di memory.
- **Recurring transactions** — engine otomatis proses transaksi berulang yang jatuh tempo.
- **Rate limiting berlapis** — `authLimiter`, `batchLimiter`, `resetLimiter` berbeda batas.
- **Responsive** — mobile-first dengan Sidebar (desktop) & BottomNav (mobile).
- **Route group `(dashboard)`** — layout bersama (Sidebar + Topbar) tanpa mempengaruhi URL.

## Keterbatasan

- **Search client-side** — pencarian transaksi dilakukan di memori setelah fetch (Firestore tidak mendukung full-text search native).
- **Tidak ada notifikasi push** — belum ada reminder tagihan atau budget alert real-time.
- **Tidak ada role-based access** — single user per akun, belum support multi-user/sharing.
- **Belum ada backup/restore** — data sepenuhnya tergantung pada Firestore.

---

<div align="center">
  <p>© 2026 whtsn dev.</p>
</div>
