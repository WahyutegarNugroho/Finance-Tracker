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

## Description

FinTrack is a premium, responsive wealth management web application structured as an NPM Workspaces monorepo. Built on a modern web architecture (Next.js 16, React 19, Tailwind CSS v4, Express.js, and Firebase), FinTrack acts as a comprehensive financial command center. Designed for individuals who demand complete control over their cash flow, the platform combines a sophisticated dark-mode user interface, interactive data visualizations, and high-performance navigation.

---

## Problems Solved

Personal finance management often becomes a hurdle due to several systemic challenges:
1. **Lack of Financial Transparency:** Consolidating real-time balances, income ratios, and aggregate expenditures onto a single unified surface is complex.
2. **Budget Overspending:** Standard platforms fail to enforce category spending discipline, lacking proactive warnings before monthly budget limits are breached.
3. **High-Friction Manual Recording:** Cluttered, unintuitive data-entry forms discourage consistent tracking of day-to-day transactions.
4. **Cognitive Overload:** Raw numerical spreadsheets fail to convey strategic patterns, making financial trends difficult to analyze.

**FinTrack addresses these pain points by:**
* Offering a premium, high-density dashboard that delivers instant visual clarity.
* Implementing a smart budgeting system with dynamic visual indicators to prevent overspending.
* Providing a high-performance transaction workflow refined with smooth micro-interactions.

---

## Key Features

FinTrack is engineered with premium capabilities to provide a superior wealth management experience:

* **Visual Analytics Dashboard:** Uses Chart.js to render interactive spend-distribution charts, income-to-expense ratios, and category allocation structures.
* **Streamlined Transaction Management (CRUD):** Log incoming and outgoing funds with ease. Includes robust searching, date-range filtering, instant updates, and secure transaction deletion.
* **Smart Budgeting & Limits:** Set strict monthly expenditure limits across specific categories (e.g., Food, Utilities, Transport) and receive instant visual indicators as category consumption increases.
* **Secure Authentication:** User accounts, credentials, and stateful sessions are handled securely by Firebase Authentication.
* **Customizable Settings:** Manage profile settings, currency configurations, and general dashboard preferences.
* **Premium Responsive Interface:** Modern glassmorphism components, fully optimized layouts for mobile and desktop screens, and seamless hardware-accelerated animations.

---

## Tech Stack & Architecture Rationale

The project is architected as an **NPM Workspaces (Monorepo)**, decoupling Frontend and Backend concerns while maintaining clean integration.

### Frontend (Web Workspace)

| Technology | Role | Rationale |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | Frontend Framework | Supports React Server Components (RSC) for optimized initial page load, directory-based routing, and built-in SEO capabilities. |
| **React 19** | Core UI Library | Harnesses the latest concurrent features, optimized client rendering cycles, and unified state transition APIs. |
| **Tailwind CSS v4** | UI Styling | Promotes rapid design iteration with utility classes, utilizing CSS variables, compile-time performance optimizations, and sleek aesthetic utilities. |
| **TanStack React Query v5** | Server State Management | Eliminates boilerplate data-fetching code, automating API caching, server state synchronization, and optimistic UI updates. |
| **Chart.js & React-Chartjs-2** | Data Visualization | Renders high-performance interactive charts for responsive data representation. |
| **Sonner** | Toast Notifications | Lightweight and modern toast notification system providing non-intrusive feedback on user transactions. |

### Backend (API Workspace)

| Technology | Role | Rationale |
| :--- | :--- | :--- |
| **Node.js & Express.js** | Runtime & API Framework | Yields a lightweight, secure REST API, allowing modular router separation and highly customizable middleware. |
| **Google Firebase Admin SDK** | Database & Security | **Cloud Firestore** delivers low-latency NoSQL document storage. **Firebase Auth** safely validates tokens, credentials, and user authorization levels. |
| **Express Validator** | Input Validation | Enforces strict, server-side data sanitization and format validation before updating document stores. |
| **Helmet & CORS** | Security Middleware | Hardens HTTP response headers and manages cross-origin resource sharing securely. |

---

## Installation & Setup Instructions

Ensure that you have **Node.js (version 18 or later)** and **npm** installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/WahyutegarNugroho/Finance-Tracker.git
cd Finance-Tracker
```

### 2. Install Monorepo Dependencies
Install all package packages for both workspaces concurrently from the root directory:
```bash
npm install
```

### 3. Configure Environment Variables

The application depends on a Firebase project. Create the required environment files in the respective workspaces:

#### **A. Backend Configuration (`apps/api/.env`)**
Create an `.env` file within the `apps/api/` directory and configure the variables:
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

# Used for creating the seed account
SEED_USER_EMAIL=demo@fintrack.com
SEED_USER_PASSWORD=Demo123456!
```

#### **B. Frontend Configuration (`apps/web/.env.local`)**
Create a `.env.local` file within the `apps/web/` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Seed Initial Data (Optional)
To populate your Firestore database with dummy transaction histories, categories, and active limits, run the seeder command from the root:
```bash
npm run seed
```
> The default credentials created are: **demo@fintrack.com** with password **Demo123456!**

### 5. Start Development Servers
To start the Frontend and Backend concurrently in your development environment:

Launch two separate terminal windows from the root directory:

* **Terminal 1: Start Backend API (Port 5000)**
  ```bash
  npm run dev:api
  ```
* **Terminal 2: Start Frontend Web App (Port 3000)**
  ```bash
  npm run dev:web
  ```

Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

<div align="center">
  <p>© 2026 whtsn dev.</p>
</div>
