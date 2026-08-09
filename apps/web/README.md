# FinTrack — Web Frontend (Next.js 16)

<div align="center">
  <p>The client application for FinTrack Wealth Management Dashboard.</p>

  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
</div>

---

## Deskripsi

Frontend FinTrack dibangun menggunakan **Next.js 16 (App Router)** dan **React 19**, menggunakan **TypeScript** yang ketat (strict mode), serta styling ultra-modern menggunakan **Tailwind CSS v4** dengan pendekatan UI Glassmorphism dan warna terinspirasi dari Material Design 3.

---

## Tech Stack & Libraries

- **Next.js 16 (App Router)** — Routing dinamis berbasis direktori dan Server Components.
- **React 19** — Fitur konkurensi rendering.
- **TanStack React Query v5** — Sinkronisasi state server, automatic caching, query invalidation, dan loading states management.
- **Chart.js + react-chartjs-2** — Menggambar tren cashflow dan breakdown pengeluaran secara interaktif.
- **Firebase Client SDK v12** — Autentikasi email/password dan integrasi Google Sign-In.
- **Tailwind CSS v4 + PostCSS** — Styling responsif, modern, dan modular.
- **Sonner** — Sistem notifikasi toast yang ringan.
- **Material Symbols** — Sistem icon Google.

---

## Struktur Folder

```
src/
├── app/                  # Route Next.js App Router (layout, page, error)
│   ├── login/            # Halaman login
│   ├── register/         # Halaman register
│   └── (dashboard)/      # Route group yang menggunakan layout Sidebar/Topbar bersama
│       ├── dashboard/    # Ringkasan visual & ringkasan saldo
│       ├── transactions/ # CRUD tabel transaksi + filter + ekspor CSV
│       ├── budget/       # Visualisasi batas budget per kategori
│       ├── analytics/    # Grafik tren cashflow & detail kategori
│       └── settings/     # Pengaturan profil, bahasa, tema, dan kategori
├── components/           # Kumpulan komponen UI modular
│   ├── dashboard/        # CashFlowChart, SpendingChart, SummaryCards, dll.
│   ├── transactions/     # FilterBar, TransactionTable, dll.
│   ├── settings/         # ProfileSection, AppearanceSection, CategoryManager
│   └── *.tsx             # Komponen global (Sidebar, Topbar, BottomNav, dll.)
├── context/              # Context global React
│   ├── AuthContext.tsx   # State login, user profile, dan formatting uang
│   ├── ThemeContext.tsx  # State Dark/Light Mode
│   └── LanguageContext.tsx # State multi bahasa (ID/EN)
├── lib/                  # Helper & utility client
│   ├── api.ts            # Client API client (auto-attach token & auto-refresh)
│   ├── firebase.ts       # Inisialisasi Firebase Client SDK
│   ├── formatting.ts     # Format mata uang dan tanggal
│   ├── translations.ts   # Kamus lokalisasi EN/ID
│   └── constants.ts      # Mapping error auth Firebase
└── types/                # Type definitions TypeScript global
```

---

## Environment Variables

Buat file `apps/web/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Perintah Pengembangan

Jalankan perintah ini di root monorepo:

```bash
# Mode development server
pnpm dev:web

# Lakukan pengecekan tipe TypeScript
pnpm --filter web type-check

# Jalankan linter
pnpm lint:web

# Build aplikasi untuk production
pnpm build
```

---

<div align="center">
  <p>© 2026 whtsn dev.</p>
</div>
