# FinTrack — Precision Wealth Management Dashboard

<div align="center">
  <p>A modern financial command center engineered with high precision, premium aesthetics, and intuitive functionality to help you master your financial future.</p>

  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Firebase-13.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/React%20Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
</div>

---

## Nama Project

**FinTrack** (Finance Tracker)

---

## Deskripsi Singkat

Aplikasi web manajemen keuangan pribadi berbasis monorepo (NPM Workspaces) dengan arsitektur Next.js 16 + Express.js + Firebase. Menyediakan dashboard visual, pencatatan transaksi CRUD, smart budgeting, analisis tren keuangan, dan autentikasi aman — semuanya dalam satu antarmuka premium modern.

---

## Problem yang Diselesaikan

1. **Kurangnya transparansi finansial** — saldo, pemasukan, dan pengeluaran tidak terlihat dalam satu tempat.
2. **Pengeluaran melebihi anggaran** — tidak ada peringatan dini saat budget kategori hampir habis.
3. **Ribet mencatat transaksi** — form input tidak intuitif sehingga malas mencatat.
4. **Analisis keuangan sulit** — data mentah berupa angka tanpa visualisasi tren.

---

## Fitur Utama

- **Dashboard Interaktif** — ringkasan saldo, pemasukan/pengeluaran, tren cashflow (Chart.js).
- **Manajemen Transaksi CRUD** — tambah, edit, hapus transaksi dengan filter & pagination cursor-based.
- **Smart Budgeting** — batas pengeluaran per kategori dengan indikator visual (good/warning/critical).
- **Analisis Keuangan** — tren bulanan, breakdown kategori, perbandingan tahunan.
- **Batch Operasi** — buat/hapus transaksi dalam jumlah banyak sekaligus.
- **Autentikasi Firebase** — email/password + Google Sign-In.
- **Multi-mata Uang** — dukungan IDR, USD, EUR, GBP, JPY.
- **Dark/Light Mode + Multi Bahasa** — EN/ID.
- **Ekspor CSV** — unduh data transaksi.

---

## Kelebihan

- **Monorepo terstruktur** — kode frontend dan backend terpisah rapi dalam satu repo.
- **Cursor-based pagination** — performa tinggi untuk ribuan transaksi (tanpa offset).
- **Optimasi query Firestore** — read-after-write dihilangkan, query batch di-chunk 500, analytics 5→3 queries.
- **Denormalized category data** — nama/icon kategori disimpan langsung di transaksi (tidak perlu JOIN).
- **Firestore transaction** — createBudget atomic check-then-insert (cegah duplikat).
- **Token caching** — verifikasi Firebase Auth di-cache 5 menit.
- **Responsive** — mobile-first dengan Sidebar (desktop) & BottomNav (mobile).

## Kekurangan

- **Tidak ada PWA penuh** — hanya service worker dasar untuk cache.
- **Tidak ada notifikasi push** — belum ada reminder tagihan atau budget alert real-time.
- **Search client-side** — pencarian transaksi dilakukan di memori setelah fetch (Firestore tidak mendukung full-text search native).
- **Tidak ada role-based access** — single user per akun, belum support multi-user/sharing.
- **Belum ada backup/restore data** — data sepenuhnya tergantung pada Firestore.

---

## Tech Stack

Proyek ini diarsiteki sebagai **NPM Workspaces (Monorepo)** yang memisahkan concern Frontend dan Backend.

### Frontend (apps/web)

| Teknologi | Peran | Alasan |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | Framework Frontend | RSC, routing berdasarkan direktori, SEO built-in. |
| **React 19** | UI Library | Concurrent features, performa rendering optimal. |
| **Tailwind CSS v4** | Styling | Utility-first, desain cepat dengan CSS variables. |
| **TanStack React Query v5** | State Management Server | Caching otomatis, invalidasi query, optimistic update. |
| **Chart.js + react-chartjs-2** | Visualisasi Data | Chart interaktif ringan untuk dashboard & analitik. |
| **Sonner** | Notifikasi | Toast modern ringan tanpa dependency berat. |

### Backend (apps/api)

| Teknologi | Peran | Alasan |
| :--- | :--- | :--- |
| **Node.js + Express.js** | Runtime & REST API | Ringan, modular middleware, ekosistem luas. |
| **Firebase Admin SDK** | Database & Auth | Cloud Firestore (NoSQL real-time) + Firebase Auth (token aman). |
| **Firestore** | Database | Dokumen NoSQL skalabel, tanpa perlu ORM. |
| **Express Validator** | Validasi Input | Sanitasi data server-side sebelum ke database. |
| **Helmet + CORS** | Keamanan | Header HTTP aman, CORS terkontrol. |
| **Pino** | Logging | Logger berperforma tinggi dengan correlation ID. |
| **Vitest + Supertest** | Testing | Unit test & integration test API. |

---

## Cara Install & Run

### Prasyarat

- Node.js >= 18
- npm
- Firebase project (dengan Authentication & Firestore diaktifkan)

### 1. Clone

```bash
git clone https://github.com/WahyutegarNugroho/Finance-Tracker.git
cd Finance-Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

#### Backend — `apps/api/.env`

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

### 4. Seed Data (Opsional)

```bash
npm run seed
```

Default login: **demo@fintrack.com** / **Demo123456!**

### 5. Jalankan

**Terminal 1 — API (port 5000)**

```bash
cd apps/api && npm start
```

**Terminal 2 — Web (port 3000)**

```bash
cd apps/web && npm run build && npm start
```

Buka **http://localhost:3000**

---

<div align="center">
  <p>© 2026 whtsn dev.</p>
</div>
