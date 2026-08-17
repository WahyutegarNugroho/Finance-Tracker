# AGENTS.md — AI Agent Knowledge Base
> **FinTrack — Precision Wealth Management Dashboard** | Versi: 2.0 | Bahasa: Bilingual (ID/EN)
> Dokumen ini adalah sumber kebenaran tunggal (*single source of truth*) bagi semua AI Agent yang beroperasi di dalam proyek ini.

---

## PROJECT OVERVIEW

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework (FE) | Next.js 16 + App Router |
| UI Library | React 19 |
| Language (FE) | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + PostCSS |
| Icons | Material Symbols (Google Fonts) |
| Server State | TanStack React Query v5 |
| Charts | Chart.js v4 + react-chartjs-2 |
| Auth (FE) | Firebase Client SDK v12 |
| Notifications | Sonner |
| Testing (FE) | Vitest + React Testing Library |
| | |
| **Backend (apps/api)** | |
| Runtime | Node.js + Express 4.21 |
| Language (BE) | JavaScript (ES6+) |
| Auth (BE) | Firebase Admin SDK v13 |
| Database | Cloud Firestore (NoSQL) |
| Validation | express-validator |
| Security | Helmet + CORS + express-rate-limit |
| Logging | Pino + Morgan |
| Testing | Vitest + Supertest |
| Linting | ESLint v9 flat config (both workspaces) |

### Commands

| Perintah | Fungsi |
|----------|--------|
| `pnpm dev:web` | Next.js dev server (port 3000) |
| `pnpm dev:api` | Express API with nodemon (port 5000) |
| `pnpm build` | Build production (next build di apps/web) |
| `pnpm seed` | Seed demo data ke Firestore |
| `pnpm lint` | Lint semua workspace |
| `pnpm test` | Test API dengan Vitest |

### Project Structure (Monorepo — pnpm Workspaces)

```
Finance-Tracker/
├── apps/
│   ├── web/                          # Frontend (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router pages
│   │   │   │   ├── layout.tsx        # Root layout (fonts, SW, providers)
│   │   │   │   ├── page.tsx          # Landing page (/)
│   │   │   │   ├── error.tsx         # Global error boundary
│   │   │   │   ├── not-found.tsx     # 404 page
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── transactions/page.tsx
│   │   │   │   ├── budget/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   ├── components/
│   │   │   │   ├── dashboard/        # SummaryCards, CashFlowChart, etc.
│   │   │   │   ├── transactions/     # TransactionTable, FilterBar
│   │   │   │   ├── budget/          # BudgetSkeleton
│   │   │   │   ├── analytics/       # AnalyticsSkeleton
│   │   │   │   ├── settings/        # ProfileSection, CategoryManager, etc.
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   ├── TransactionModal.tsx
│   │   │   │   ├── BudgetModal.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── MockChart.tsx
│   │   │   │   └── Providers.tsx     # QueryClient + Auth/Theme/Language
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx   # Firebase auth + currency
│   │   │   │   ├── ThemeContext.tsx  # Dark/light mode
│   │   │   │   └── LanguageContext.tsx # EN/ID i18n
│   │   │   ├── lib/
│   │   │   │   ├── api.ts           # fetch wrapper with auth token
│   │   │   │   ├── firebase.ts      # Firebase client init
│   │   │   │   ├── constants.ts     # FIREBASE_ERRORS mapping
│   │   │   │   ├── formatting.ts    # Number/date formatters
│   │   │   │   └── translations.ts  # EN + ID translation keys
│   │   │   └── types/
│   │   │       └── index.ts         # All TypeScript interfaces
│   │   ├── public/
│   │   │   ├── sw.js               # Service worker
│   │   │   └── manifest.json       # PWA manifest
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   ├── postcss.config.mjs
│   │   ├── tsconfig.json
│   │   └── eslint.config.mjs
│   │
│   └── api/                         # Backend (Express + Firebase)
│       ├── src/
│       │   ├── index.js             # Express entry + middleware chain
│       │   ├── config/
│       │   │   └── firebase.js      # Admin SDK init
│       │   ├── middleware/
│       │   │   ├── auth.js          # Firebase token verification
│       │   │   ├── errorHandler.js  # Global error handler
│       │   │   ├── rateLimiter.js   # Rate limiting
│       │   │   └── validate.js      # express-validator wrapper
│       │   ├── routes/
│       │   │   ├── index.js         # Route aggregator
│       │   │   ├── auth.routes.js
│       │   │   ├── user.routes.js
│       │   │   ├── transaction.routes.js
│       │   │   ├── budget.routes.js
│       │   │   ├── category.routes.js
│       │   │   └── analytics.routes.js
│       │   ├── services/
│       │   │   ├── auth.service.js
│       │   │   ├── user.service.js
│       │   │   ├── transaction.service.js
│       │   │   ├── budget.service.js
│       │   │   ├── category.service.js
│       │   │   └── analytics.service.js
│       │   ├── utils/
│       │   │   ├── firestore.js     # Firestore helper queries
│       │   │   ├── logger.js        # Pino logger
│       │   │   ├── pagination.js    # Cursor-based pagination
│       │   │   └── response.js      # Standardized response helpers
│       │   ├── seeds/
│       │   │   └── seed.js          # Demo data seeder
│       │   └── tests/
│       │       ├── setup.js
│       │       ├── pagination.test.js
│       │       ├── response.test.js
│       │       └── middleware/
│       │           ├── rateLimiter.test.js
│       │           └── validate.test.js
│       ├── .env.example
│       ├── vercel.json
│       ├── vitest.config.mjs
│       └── eslint.config.mjs
│
├── packages/                        # Shared internal packages
│   └── shared-types/                # API Contract & shared interfaces
├── package.json                     # Root workspace config
└── .gitignore
```

### Routing (Frontend)

| Route | Component | Auth Required | Deskripsi |
|-------|-----------|---------------|-----------|
| `/` | Home | No | Landing page with hero + features |
| `/login` | Login | No | Firebase email/password + Google sign-in |
| `/register` | Register | No | Firebase email/password registration |
| `/dashboard` | Dashboard | Yes | Summary cards, cash flow chart, spending chart, recent transactions |
| `/transactions` | Transactions | Yes | CRUD table with filter, search, pagination, CSV export, batch ops |
| `/budget` | Budget | Yes | Budget per category with visual indicators (good/warning/critical) |
| `/analytics` | Analytics | Yes | Cashflow trends, category breakdown, time range filters |
| `/settings` | Settings | Yes | Profile, appearance (theme/lang), categories CRUD |

### API Endpoints (Backend)

| Endpoint | Methods | Auth | Deskripsi |
|----------|---------|------|-----------|
| `/api/health` | GET | No | Health check |
| `/api/auth/register` | POST | No | Register with email/password |
| `/api/auth/google` | POST | Yes | Google sign-in sync |
| `/api/auth/me` | GET | Yes | Current user data |
| `/api/users/profile` | GET, PUT | Yes | User profile CRUD |
| `/api/transactions` | GET, POST | Yes | List (cursor-paginated), create |
| `/api/transactions/:id` | GET, PUT, DELETE | Yes | Single transaction CRUD |
| `/api/transactions/summary` | GET | Yes | Monthly summary |
| `/api/transactions/batch` | POST, DELETE | Yes | Batch create/delete |
| `/api/budgets` | GET, POST | Yes | List, create budget |
| `/api/budgets/:id` | PUT, DELETE | Yes | Single budget CRUD |
| `/api/budgets/summary` | GET | Yes | Budget usage summary |
| `/api/categories` | GET, POST | Yes | List, create category |
| `/api/categories/:id` | PUT, DELETE | Yes | Category CRUD |
| `/api/analytics/overview` | GET | Yes | Balance, income, expense totals |
| `/api/analytics/cashflow` | GET | Yes | Monthly cashflow data |
| `/api/analytics/categories` | GET | Yes | Spending by category |
| `/api/analytics/trends` | GET | Yes | Multi-month trends |

### Project Conventions

- **File Naming**: `page.tsx`, `layout.tsx` (Next.js App Router), `ComponentName.tsx` (PascalCase), `use-hook-name.ts` (kebab-case for hooks/utils)
- **TypeScript**: All frontend code is strict TypeScript (no PropTypes). Backend is JavaScript.
- **State Management**: TanStack React Query for server state; React Context for auth/theme/language
- **Performance**: Skeleton components for loading states; React Query caching (staleTime: 60s, retry: 1)
- **Styling**: Tailwind CSS v4 utility classes + CSS variables for theming (Material Design 3-inspired)
- **UI Patterns**: Glass-morphism (`.glass-panel`, `.glass-card` utility classes)
- **Icons**: Material Symbols via `<span class="material-symbols-outlined">` with `fontVariationSettings`
- **Auth Flow**: Firebase Client SDK (browser) → getIdToken() → Bearer token → API middleware verifies with Admin SDK
- **Pagination**: Cursor-based (base64 encoded cursor, no offset), with `hasMore` + `nextCursor` in response
- **API Response Format**: `{ success: boolean, data?: T, message?: string, pagination?: { hasMore, nextCursor, itemsPerPage } }`
- **Error Handling**: Global error handler middleware; standardized `{ success: false, error: string, message: string }` responses
- **Logging**: Correlation ID (`x-correlation-id` header + `crypto.randomUUID()`) on every request; Pino + Morgan
- **i18n**: Two languages (EN/ID) via React Context with dot-notation key lookup + English fallback
- **Dark Mode**: CSS class strategy (`<html class="dark">`) with inline theme-script in `<head>` (pre-hydration)

### Auth Flow (Detailed)

1. User signs in via Firebase Client SDK (`signInWithEmailAndPassword` or `signInWithPopup` with Google)
2. On success, `onAuthStateChanged` fires → user profile fetched from API to get currency preference
3. API client (`lib/api.ts`) automatically injects `Authorization: Bearer <token>` via `auth.currentUser.getIdToken()`
4. On 401 response, the client auto-refreshes the token once and retries; if still 401, signs out and redirects to `/login`
5. Backend middleware (`middleware/auth.js`) verifies the token via `admin.auth().verifyIdToken()` and caches decoded tokens in-memory for 5 minutes
6. Backend attaches `req.user` with `{ uid, email, name, picture, emailVerified }`

---

## 🧭 INDEKS KNOWLEDGE ITEMS

| ID | Kategori | Judul |
|----|----------|-------|
| K-01 | Arsitektur | 3-Tier Agent Architecture |
| K-02 | Fondasi | Clean Code & Industry Standards |
| K-03 | Workflow | Build from Scratch — 4-Phase Protocol |
| K-04 | Workflow | Maintenance & Evolution Protocol |
| K-05 | Keamanan | Security & Anti-Regression Rules |
| K-06 | Keamanan | Lock Critical Core Logic |
| K-07 | Proses | Self-Correction & Troubleshooting Protocol |
| K-08 | Proses | Context-First Reading Mandate |
| K-09 | Output | Code Output Standards |
| K-10 | Output | Response Format Contract |
| K-11 | Proses | Version Control & Commit Protocol |

---

## K-01 · 3-Tier Agent Architecture

Setiap pekerjaan coding dikategorikan ke dalam salah satu dari tiga tier. Agent **wajib** mengidentifikasi tier sebelum mengeksekusi.

```
┌─────────────────────────────────────────────────────┐
│  TIER 1 — THE BLUEPRINT (Arsitektur & Perencanaan)  │
│  Non-deterministik. Output: dokumen, diagram,       │
│  struktur folder. DILARANG menulis logika bisnis.   │
├─────────────────────────────────────────────────────┤
│  TIER 2 — THE BRAIN (Konfigurasi & Integrasi)       │
│  Semi-deterministik. Output: config files,          │
│  schema DB, service layer, wiring antar komponen.   │
├─────────────────────────────────────────────────────┤
│  TIER 3 — THE BODY (Implementasi Logika Bisnis)     │
│  Deterministik penuh. Output: kode produksi yang    │
│  bisa langsung dijalankan. WAJIB bebas dari bug.    │
└─────────────────────────────────────────────────────┘
```

**Aturan Tier Transition:**
- Jangan loncat dari Tier 1 ke Tier 3 tanpa persetujuan user di Tier 2.
- Jika user minta Tier 3, agent harus memastikan Tier 1 & 2 sudah selesai atau diasumsikan secara eksplisit.

---

## K-02 · Clean Code & Industry Standards

### Penamaan (Naming Conventions)

```
Variables & functions : camelCase       → getUserById, cartItems
Components            : PascalCase      → TransactionTable, SummaryCards
Files (components)    : PascalCase.tsx  → TransactionTable.tsx
Files (pages)         : page.tsx        → Next.js App Router convention
Files (utils/hooks)   : kebab-case.ts  → formatting.ts, use-auth.ts
Constants             : SCREAMING_SNAKE → FIREBASE_ERRORS, API_BASE_URL
API routes            : kebab-case     → /api/transactions/summary
Database fields       : camelCase       → userId, categoryName
Firestore collections : plural         → transactions, budgets, categories
```

### Prinsip Wajib

1. **Single Responsibility** — Satu fungsi/komponen hanya melakukan satu hal.
2. **DRY (Don't Repeat Yourself)** — Ekstrak logika duplikat ke utility/helper.
3. **YAGNI (You Aren't Gonna Need It)** — Jangan buat abstraksi yang belum dibutuhkan.
4. **Fail Fast** — Validasi input di awal fungsi (guard clauses), bukan di akhir.
5. **No Magic Numbers** — Semua angka/string literal harus menjadi named constant.

### TypeScript Strictness

```typescript
// ✅ WAJIB — Definisikan interface/type secara eksplisit
export interface Transaction {
  id: string;
  amount: number;
  type: "expense" | "income";
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  note: string;
  date: string;
  userId: string;
}

// ❌ DILARANG — any tanpa alasan yang sah
function process(data: any): any { ... }

// ✅ BOLEH — unknown + type guard jika tipe memang tidak diketahui
function process(data: unknown): Transaction { ... }

// ✅ ESLint: ts-expect-error WAJIB disertai komentar penjelasan
// @ts-expect-error - Library X tidak memiliki type definition untuk fitur Y
```

> **Catatan:** Frontend (apps/web) adalah TypeScript strict. Backend (apps/api) adalah JavaScript. Untuk komponen FE baru, selalu gunakan TypeScript dengan interface yang eksplisit.

---

## K-03 · Build from Scratch — 4-Phase Protocol

### FASE 1 · Blueprint (Tier 1 & 2)

**Trigger:** User meminta membangun fitur/aplikasi baru dari nol.

**Checklist wajib sebelum output:**
- [ ] Tentukan tech stack secara eksplisit (sesuai proyek ini)
- [ ] Identifikasi apakah perubahan di `apps/web`, `apps/api`, atau keduanya
- [ ] Identifikasi dependensi utama beserta versinya (cek package.json)
- [ ] Sepakati bentuk Request/Response dan tulis di `packages/shared-types` sebelum coding FE/BE.
- [ ] **STOP** — Minta persetujuan user sebelum lanjut ke Fase 2

---

### FASE 2 · Frontend Component Development (Tier 3)

**Trigger:** Blueprint sudah disetujui, mulai implementasi UI.

**Aturan Komponen:**
- Setiap pembuatan UI Component yang memiliki interaksi (klik, form, filter) WAJIB disertai file `<NamaKomponen>.test.tsx` sederhana untuk memvalidasi interaksinya.

```typescript
// ✅ Client Component — gunakan "use client" directive jika perlu state/effects/interactivity
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/Skeleton";

// ✅ Definisikan props interface
interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

// ✅ Wajib handle: Loading → Error → Empty → Data
export function TransactionTable({ transactions, isLoading, onEdit, onDelete }: TransactionTableProps) {
  if (isLoading) return <TransactionsSkeleton />;
  if (transactions.length === 0) return <EmptyState message="No transactions found." />;

  return (
    <table className="w-full">
      {/* ... */}
    </table>
  );
}
```

**Urutan Pengerjaan:**
1. Buat komponen dengan loading/error/empty state terlebih dahulu
2. Implementasi data fetching dengan React Query + API service
3. Sambungkan ke API endpoint

---

### FASE 3 · Backend API Development (Tier 3)

**Trigger:** Frontend sudah disetujui, mulai implementasi API.

**Urutan Pembuatan Wajib:**
```
Route → Middleware (auth, validate) → Service → Firestore queries
```

**Template Implementasi:**

```javascript
// 1. ROUTE — Definisi endpoint + middleware chaining
// routes/transaction.routes.js
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body, query } = require('express-validator');

router.get('/', authenticate, transactionService.getAll);
router.post('/', authenticate, validate([
  body('amount').isFloat({ min: 0.01 }),
  body('type').isIn(['expense', 'income']),
  body('categoryId').notEmpty(),
]), transactionService.create);

// 2. SERVICE — Business logic
// services/transaction.service.js
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const snapshot = await db.collection('transactions')
      .where('userId', '==', req.user.uid)
      .orderBy('date', 'desc')
      .limit(limit)
      .get();

    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    response.paginated(res, transactions, {
      hasMore: transactions.length === limit,
      itemsPerPage: limit,
    });
  } catch (error) {
    next(error);
  }
};
```

**HTTP Response Standard (sesuai proyek):**
```javascript
// Helper: utils/response.js
// ✅ Struktur response yang konsisten — gunakan helper, jangan manual
response.success(res, data, message, 200);      // GET berhasil
response.created(res, data, message);            // POST berhasil (201)
response.paginated(res, data, pagination);       // GET dengan pagination
response.error(res, message, statusCode);        // Error
response.notFound(res, resource);                // 404
```

---

### FASE 4 · Integration (Tier 2 + 3)

**Trigger:** FE dan BE sudah selesai secara terpisah.

**Aturan Integrasi:**

```typescript
// ✅ API Service Layer — lib/api.ts sudah menyediakan fetch wrapper
const data = await api.get('/transactions', { params: { page: '1', limit: '10' } });

// ✅ Custom Hook dengan React Query — pola yang benar
export function useTransactions(params: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.get('/transactions', { params }),
    staleTime: 60 * 1000, // 1 menit cache
  });
}
```

**Empat State Wajib Ditangani:**
```typescript
// Setiap komponen yang fetch data WAJIB handle:
if (isLoading) return <TransactionsSkeleton />;
if (error) return <ErrorBanner error={error} onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <TransactionTable data={data} />;
```

**Regression Check Checklist Pasca-Integrasi:**
- [ ] Semua endpoint API merespons dengan success: true
- [ ] Loading skeleton muncul saat data belum tersedia
- [ ] Error state muncul saat endpoint dimatikan
- [ ] Empty state muncul saat data kosong
- [ ] Data tidak stale setelah mutasi (query invalidation)
- [ ] Dark/light mode tetap berfungsi
- [ ] Bahasa EN/ID tetap konsisten
- [ ] Console browser bebas dari error/warning

---

## K-04 · Maintenance & Evolution Protocol

### Bug Fixing Protocol

**Urutan Wajib — JANGAN DILEWATI:**
```
1. DIAGNOSA   → Baca log error (server-side: Pino log; client-side: console/network tab)
2. ANALISIS   → Identifikasi file & baris yang bermasalah. Jelaskan Root Cause.
3. KONFIRMASI → Tunggu persetujuan user atas analisis.
4. EKSEKUSI   → Terapkan Surgical Modification (lihat K-05).
5. VALIDASI   → Berikan langkah verifikasi manual kepada user.
```

**Root Cause Analysis Template:**
```
🔴 GEJALA    : [Apa yang user lihat]
🔍 LOKASI    : [File:baris yang relevan]
💡 PENYEBAB  : [Mengapa ini terjadi secara teknis]
🔧 SOLUSI    : [Perubahan minimal yang diperlukan]
⚠️  RISIKO    : [Efek samping potensial]
```

---

### Feature Addition Protocol

**Urutan Wajib:**
```
1. READ      → Baca seluruh file yang akan dimodifikasi + dependensinya
2. MAP       → Identifikasi titik eksak di mana kode baru akan disisipkan
3. LOCK      → Tandai blok kode yang TIDAK boleh diubah (K-06)
4. INSERT    → Sisipkan kode baru secara presisi
5. VALIDATE  → Berikan Regression Check checklist
```

---

### Refactoring Protocol

**Kontrak Refactoring — Harus dipenuhi semua:**
- ✅ Behavior/output sistem identik 100% sebelum dan sesudah
- ✅ Semua test yang ada masih lulus
- ✅ Tidak ada komentar developer yang dihapus
- ✅ Tidak ada `@ts-expect-error`, `eslint-disable`, atau `TODO` yang dihapus
- ✅ Variabel "redundan" hanya dihapus setelah grep/search global membuktikannya tidak terpakai
- ✅ CSS variables dan utility classes tidak diubah namanya
- ✅ Tampilkan diff sebelum/sesudah untuk setiap file yang diubah

---

## K-05 · Security & Anti-Regression Rules

### Anti-Deletion Protocol (WAJIB)

Agent **DILARANG KERAS** menghapus kode berikut tanpa instruksi eksplisit dari user:

```
🔒 PROTECTED — TIDAK BOLEH DIHAPUS/DIMODIFIKASI TANPA IZIN:
  • Auth middleware (apps/api/src/middleware/auth.js) — verifikasi token Firebase
  • Global error handler (apps/api/src/middleware/errorHandler.js)
  • Rate limiter config (apps/api/src/middleware/rateLimiter.js)
  • Helmet/CORS configuration (apps/api/src/index.js)
  • Firebase Admin SDK init (apps/api/src/config/firebase.js)
  • Firebase Client SDK init (apps/web/src/lib/firebase.ts)
  • API fetch wrapper — auto-refresh token logic (apps/web/src/lib/api.ts)
  • AuthContext — formatCurrency, currency logic (apps/web/src/context/AuthContext.tsx)
  • Theme inline script pre-hydration (apps/web/src/app/layout.tsx:44-53)
  • Service worker registration (apps/web/src/app/layout.tsx:58-70)
  • Environment variable references (.env, .env.local)
  • Firestore indexes (apps/api/firestore.indexes.json)
  • eslint-disable / @ts-expect-error dengan komentar penjelasan
```

### Phantom Cleanup — DILARANG

Phantom Cleanup = menghapus/mengubah kode yang *terlihat* tidak relevan tapi sebenarnya penting.

```javascript
// ❌ PHANTOM CLEANUP — Jangan hapus ini tanpa investigasi
const _unusedVar = require('./legacy-module');  // <-- Mungkin ada side-effect!
const DEBUG_MODE = false;                        // <-- Mungkin dipakai di tempat lain

// ✅ Jika ragu, lakukan dulu:
// grep -r "DEBUG_MODE" apps/web/src/ apps/api/src/
// Hanya hapus jika hasilnya 0 baris selain definisinya
```

---

## K-06 · Lock Critical Core Logic

**Blok yang selalu dikunci secara default di proyek ini:**

- **Auth Middleware** (`apps/api/src/middleware/auth.js`) — token verification + caching
- **Error Handler** (`apps/api/src/middleware/errorHandler.js`) — semua error mapping
- **Rate Limiter** (`apps/api/src/middleware/rateLimiter.js`)
- **API Fetch Wrapper** (`apps/web/src/lib/api.ts`) — auto-refresh token on 401
- **Auth Context** (`apps/web/src/context/AuthContext.tsx`) — formatCurrency, onAuthStateChanged
- **Firebase Init** (`apps/web/src/lib/firebase.ts`, `apps/api/src/config/firebase.js`)
- **Theme Context** (`apps/web/src/context/ThemeContext.tsx`) — dark mode toggle
- **Inline Theme Script** (`apps/web/src/app/layout.tsx` lines 44-53) — pre-hydration dark mode
- **All Firestore index definitions** (`apps/api/firestore.indexes.json`)
- **Response helpers** (`apps/api/src/utils/response.js`)
- **Pagination logic** (`apps/api/src/utils/pagination.js`)

---

## K-07 · Self-Correction & Troubleshooting Protocol

Ketika agent menghasilkan output yang salah atau menghadapi error, ikuti protokol ini:

```
LANGKAH 1 — STOP. Jangan menghasilkan lebih banyak kode yang salah.
LANGKAH 2 — AKUI kesalahan secara eksplisit kepada user.
LANGKAH 3 — DIAGNOSA: Apa yang salah dan mengapa?
LANGKAH 4 — PLAN: Apa pendekatan perbaikan yang benar?
LANGKAH 5 — KONFIRMASI: Minta izin user jika perbaikan melibatkan banyak file.
LANGKAH 6 — EKSEKUSI: Terapkan perbaikan secara Surgical (K-05).
```

**Error Classification:**
```
TIER-1 ERROR : Salah arsitektur/desain → Diskusikan ulang dengan user
TIER-2 ERROR : Salah konfigurasi/integrasi → Perbaiki config, jangan logika bisnis
TIER-3 ERROR : Bug dalam logika bisnis → Surgical fix pada fungsi spesifik
```

---

## K-08 · Context-First Reading Mandate

**Sebelum** menulis atau memodifikasi kode apapun, agent **WAJIB**:

```
CHECKLIST PRA-CODING:
□ Baca seluruh file yang akan dimodifikasi (bukan hanya seksi yang relevan)
□ Baca file yang diimpor oleh file tersebut (satu level)
□ Cek apakah ada test file yang meng-cover kode yang akan diubah
□ Identifikasi semua caller/consumer dari fungsi yang akan diubah
□ Pahami TypeScript interface yang sudah ada (src/types/index.ts)
□ Cek apakah perubahan perlu sinkronisasi FE↔BE (api response shape)
```

**Jika file terlalu besar (>300 baris):**
```
1. Baca bagian imports & exports dulu (gambaran dependensi)
2. Baca fungsi/kelas yang paling relevan
3. Deklarasikan asumsi yang dibuat kepada user secara eksplisit
```

---

## K-09 · Code Output Standards

### Format Output Kode

Agent **WAJIB** menyertakan informasi ini di setiap blok kode:

````markdown
**File:** `apps/web/src/components/transactions/TransactionTable.tsx`
**Action:** CREATE | MODIFY | DELETE
**Affects:** TransactionTable, TransactionsPage, api.get('/transactions')

```typescript
// kode di sini
```

**Perubahan dari versi sebelumnya:**
- Baris 45: Tambah null check sebelum akses `transaction.categoryName`
- Baris 67: Ekstrak format currency ke `useAuth().formatCurrency`
````

### Surgical Modification Format (Diff Style)

Untuk modifikasi pada file yang sudah ada, gunakan format diff:

```diff
// File: apps/web/src/lib/api.ts

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
+   // Ambil token Firebase terbaru
    let token = '';
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
-     Authorization: `Bearer ${token}`,
+     ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
```

---

## K-10 · Response Format Contract

Agent **WAJIB** mengikuti format respons berikut berdasarkan tipe permintaan:

### Untuk Analisis/Review (Read-Only)
```
1. RINGKASAN    → Apa yang ditemukan (3-5 kalimat)
2. TEMUAN       → List berformat dengan severity
3. REKOMENDASI  → Langkah selanjutnya yang disarankan
4. PERTANYAAN   → Jika ada ambiguitas, tanyakan SATU pertanyaan saja
```

### Untuk Implementasi (Write)
```
1. KONFIRMASI PEMAHAMAN → Ulangi apa yang akan dibuat/diubah
2. ASUMSI               → Daftar asumsi yang dibuat secara eksplisit
3. KODE                 → Output dengan format K-09
4. INSTRUKSI PENGGUNAAN → Cara mengintegrasikan kode ini
5. REGRESSION CHECK     → 3-5 langkah verifikasi manual
```

### Checkpoint Wajib (STOP & ASK)

Agent wajib berhenti dan meminta konfirmasi user ketika:
- Akan menghapus lebih dari 10 baris kode
- Akan mengubah TypeScript interface yang dipakai di banyak tempat
- Akan mengubah Firestore collection structure atau indexes
- Akan mengubah response shape dari API (FE/BE contract)
- Akan memodifikasi file konfigurasi keamanan (auth, helmet, CORS, rate-limiter)
- Akan mengubah environment variable yang dibutuhkan
- Tidak yakin dengan requirement (ambiguitas tinggi)
- Akan membuat perubahan yang memengaruhi lebih dari 3 file

---

## K-11 · Version Control & Commit Protocol

Agent WAJIB mengikuti format **Conventional Commits** jika diminta untuk men-generate pesan commit atau membuat Pull Request (PR).

**Format Wajib:** `<type>(<scope>): <deskripsi singkat>`

**Tipe yang Diizinkan:**
- `feat`: Fitur baru (berkaitan dengan Tier 3)
- `fix`: Perbaikan bug (berkaitan dengan K-04)
- `refactor`: Perubahan kode tanpa mengubah fitur (berkaitan dengan K-04)
- `chore`: Update dependensi, konfigurasi (berkaitan dengan Tier 2)
- `docs`: Perubahan dokumentasi/komentar

**Aturan PR (Pull Request):**
Saat menyelesaikan Fase 2 atau Fase 3, Agent WAJIB merangkum perubahan ke dalam format deskripsi PR:
1. Apa yang diubah/ditambahkan?
2. File apa saja yang terpengaruh?
3. Bagaimana cara QA mengujinya?

---

## 🛠️ QUICK REFERENCE — Commands & Shortcuts

| Perintah | Efek |
|----------|------|
| `pnpm dev:web` | Start Next.js frontend (port 3000) |
| `pnpm dev:api` | Start Express API with nodemon (port 5000) |
| `pnpm seed` | Seed Firestore with demo data |
| `pnpm test` | Run Vitest API tests |
| `pnpm lint` | Lint all workspaces |

| AI Command | Efek |
|------------|------|
| `@phase1 [fitur]` | Mulai Fase 1: Blueprint & perencanaan |
| `@phase2 [fitur]` | Mulai Fase 2: Frontend component |
| `@phase3 [fitur]` | Mulai Fase 3: Backend API |
| `@phase4 [komponen]` | Mulai Fase 4: FE↔BE Integration |
| `@fix [gejala]` | Bug fix protocol |
| `@add [fitur] to [file]` | Feature addition protocol |
| `@refactor [file] for [tujuan]` | Refactoring protocol |
| `@audit [file/folder]` | Security audit |

---

*Dokumen ini adalah living document. Update versi setiap kali ada perubahan signifikan pada standar proyek.*
*Last updated: 2026 | Format: Markdown*
