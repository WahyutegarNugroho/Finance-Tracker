# 🌌 FinTrack — Precision Wealth Management Dashboard

<div align="center">
  <p>🚀 <strong>Command Center Keuangan Modern</strong> yang dirancang dengan presisi tinggi, estetika premium, dan fungsionalitas intuitif untuk membantu Anda menguasai masa depan finansial Anda.</p>

  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Firebase-13.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/React%20Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
</div>

---

## 📖 Deskripsi Singkat

**FinTrack** adalah aplikasi manajemen kekayaan (wealth management) modern berkonsep *monorepo* yang didesain secara elegan, responsif, dan kaya akan visualisasi data. Dibuat menggunakan arsitektur mutakhir (Next.js 16 + React 19 + Tailwind v4 + Express.js + Firebase), FinTrack berfungsi sebagai pusat komando finansial pribadi Anda. Aplikasi ini dirancang bagi individu yang mendambakan kendali penuh atas arus kas mereka melalui tampilan bertema *sleek dark mode*, grafik interaktif, dan navigasi yang sangat responsif tanpa kompromi performa.

---

## 🎯 Problem yang Diselesaikan

Banyak orang mengalami kesulitan dalam mengelola keuangan pribadi karena beberapa alasan krusial berikut:
1. **Kurangnya Transparansi Finansial:** Sulitnya melihat gambaran besar tentang total saldo, rasio pendapatan, dan pengeluaran secara langsung (real-time).
2. **Kebocoran Anggaran (Budget Overspending):** Sulit membatasi pengeluaran per kategori secara disiplin karena tidak adanya sistem peringatan dini sebelum limit anggaran terlampaui.
3. **Pencatatan Manual yang Rumit:** Proses pencatatan transaksi yang lambat dan antarmuka pengguna yang membingungkan sering kali membuat orang malas mencatat pengeluaran harian mereka.
4. **Kelebihan Beban Kognitif:** Data keuangan yang disajikan dalam bentuk angka-angka mentah yang membosankan sulit dianalisis secara strategis oleh pengguna biasa.

**FinTrack memecahkan masalah ini dengan:**
* Menyediakan **Dashboard Finansial Premium** yang menyajikan statistik visual yang instan dan mudah dibaca.
* Menerapkan **Sistem Pembatasan Anggaran (Budget Tracker)** dengan umpan balik real-time untuk mencegah pengeluaran berlebih.
* Menghadirkan antarmuka entri transaksi yang cepat, responsif, dan didesain dengan konsep *micro-interactions* berkinerja tinggi.

---

## ✨ Fitur Utama

Aplikasi FinTrack dirancang dengan fitur-fitur kelas atas untuk memberikan pengalaman pengguna terbaik:

* **📊 Visual Analytics Dashboard**: Menggunakan **Chart.js** untuk memvisualisasikan tren pengeluaran, perbandingan pendapatan vs pengeluaran bulanan, serta distribusi anggaran per kategori secara dinamis.
* **💸 Manajemen Transaksi Fleksibel (CRUD)**: Catat pendapatan dan pengeluaran Anda dengan mudah. Lengkap dengan sistem pencarian, penyaringan tanggal, pengeditan instan, dan penghapusan transaksi yang aman.
* **🛡️ Smart Budgeting & Limits**: Tetapkan limit anggaran untuk kategori tertentu (misalnya Makanan, Transportasi, Hiburan). Dapatkan umpan balik visual ketika anggaran Anda mendekati batas maksimal.
* **🔐 Autentikasi Pengguna yang Aman**: Proses pendaftaran akun, masuk (Login), dan pengelolaan sesi yang andal menggunakan integrasi penuh dengan **Firebase Authentication**.
* **⚙️ Pengaturan Kustom (Settings)**: Atur preferensi mata uang yang Anda gunakan dan konfigurasi profil pribadi dalam Command Center yang intuitif.
* **📱 Desain Premium & Responsif**: Tampilan bergaya *glassmorphism* modern, sistem navigasi responsif untuk mobile dan desktop, serta transisi animasi yang mulus.

---

## 🛠️ Tech Stack & Alasan Pemilihan

Proyek ini menggunakan arsitektur **NPM Workspaces (Monorepo)** untuk memisahkan logika Frontend dan Backend secara terstruktur tetapi tetap berada dalam satu repositori yang mudah dikelola.

### 💻 Frontend (Web Workspace)

| Teknologi | Peran | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | Framework Frontend | Mendukung *React Server Components* (RSC) untuk pemuatan halaman super cepat, optimasi SEO instan, dan manajemen rute berbasis folder yang terstruktur. |
| **React 19** | Library UI Utama | Mengintegrasikan fitur rendering modern terkini, optimasi *state*, dan pemrosesan komponen yang jauh lebih efisien. |
| **Tailwind CSS v4** | Framework Desain | Memungkinkan pembuatan UI dengan utility-first yang super cepat, sistem tema CSS variabel modern, performa compiler yang lebih ringan, dan fleksibilitas custom utility. |
| **TanStack React Query v5** | Server State Management | Mengeliminasi boilerplate kode pemanggilan API. Menangani caching data secara otomatis, sinkronisasi state server, dan pembaruan UI secara real-time tanpa reload. |
| **Chart.js & React-Chartjs-2** | Data Visualization | Pustaka grafik yang sangat fleksibel dan interaktif untuk merender grafik pengeluaran dan tren keuangan pengguna dengan animasi yang mulus. |
| **Sonner** | Toast Notifications | Library notifikasi modern yang sangat ringan dan elegan untuk memberikan umpan balik visual instan atas setiap aksi pengguna. |

### ⚙️ Backend (API Workspace)

| Teknologi | Peran | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Node.js & Express.js** | Runtime & API Framework | Menghasilkan performa server yang ringan, cepat, sangat mudah dikustomisasi, dan memiliki ekosistem middleware yang kaya untuk pengamanan REST API. |
| **Google Firebase Admin SDK** | Database & Autentikasi | **Cloud Firestore** menyediakan penyimpanan data NoSQL berbasis dokumen yang sangat fleksibel, cepat, dan handal. **Firebase Auth** menangani enkripsi password dan sesi pengguna dengan standar industri tinggi. |
| **Express Validator** | Data Validation | Menjamin setiap data inputan transaksi dan anggaran divalidasi dengan ketat di sisi server sebelum disimpan ke Firestore. |
| **Helmet & CORS** | Security Middleware | Mengamankan server API dari ancaman serangan web umum serta mengatur hak akses lintas domain dengan aman. |

---

## 🚀 Cara Install & Menjalankan Aplikasi

Pastikan Anda telah menginstal **Node.js (versi 18 atau lebih baru)** dan **npm** di komputer Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/WahyutegarNugroho/Finance-Tracker.git
cd Finance-Tracker
```

### 2. Instalasi Dependensi (Root Monorepo)
Gunakan npm untuk menginstal semua dependensi untuk frontend dan backend secara otomatis melalui NPM Workspaces:
```bash
npm install
```

### 3. Konfigurasi Environment Variables

Aplikasi membutuhkan konfigurasi Firebase untuk dapat berjalan. Silakan buat file `.env` di masing-masing workspace sesuai dengan panduan berikut:

#### **A. Konfigurasi Backend (`apps/api/.env`)**
Salin file `.env.example` yang ada di `apps/api/` menjadi `.env` lalu lengkapi nilai-nilainya:
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

# Untuk pembuatan akun demo saat seeder dijalankan
SEED_USER_EMAIL=demo@fintrack.com
SEED_USER_PASSWORD=Demo123456!
```

#### **B. Konfigurasi Frontend (`apps/web/.env.local`)**
Buat file `.env.local` di dalam folder `apps/web/` dan lengkapi konfigurasinya:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Seed Data Awal (Opsional)
Jika Anda ingin mengisi database Firestore Anda dengan data transaksi dan kategori tiruan untuk pengujian, jalankan perintah berikut dari direktori utama (root):
```bash
npm run seed
```
> Akun demo yang dibuat secara otomatis adalah: **demo@fintrack.com** dengan kata sandi **Demo123456!**

### 5. Jalankan Mode Pengembangan (Development)
Untuk menjalankan frontend dan backend secara bersamaan di server lokal Anda:

Buka dua terminal terpisah dari root repositori:

* **Terminal 1: Menjalankan Backend API (Port 5000)**
  ```bash
  npm run dev:api
  ```
* **Terminal 2: Menjalankan Frontend Web (Port 3000)**
  ```bash
  npm run dev:web
  ```

Buka browser Anda dan akses aplikasi di: **[http://localhost:3000](http://localhost:3000)**

---

<div align="center">
  <p>© 2026 whtsn dev.</p>
</div>
