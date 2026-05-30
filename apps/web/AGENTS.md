<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Workspace Rules — Frontend (apps/web)

> **Referensi utama:** `../../AGENTS.md` — dokumen ini hanya berisi aturan spesifik workspace.

---

## Workspace-Specific Conventions

### Pages (Next.js App Router)

Gunakan konvensi `page.tsx` untuk setiap route. Semua page ada di `src/app/`:

| Route | File | Auth |
|-------|------|------|
| `/` | `src/app/page.tsx` | No |
| `/login` | `src/app/login/page.tsx` | No |
| `/register` | `src/app/register/page.tsx` | No |
| `/dashboard` | `src/app/dashboard/page.tsx` | Yes |
| `/transactions` | `src/app/transactions/page.tsx` | Yes |
| `/budget` | `src/app/budget/page.tsx` | Yes |
| `/analytics` | `src/app/analytics/page.tsx` | Yes |
| `/settings` | `src/app/settings/page.tsx` | Yes |

### File Architecture

```
src/
├── app/                # App Router pages + layouts
├── components/         # React components by domain
│   ├── dashboard/
│   ├── transactions/
│   ├── budget/
│   ├── analytics/
│   ├── settings/
│   └── *.tsx           # Shared components (Sidebar, Topbar, BottomNav, etc.)
├── context/            # AuthContext, ThemeContext, LanguageContext
├── lib/                # api.ts, firebase.ts, formatting.ts, translations.ts, constants.ts
└── types/              # index.ts — all TypeScript interfaces
```

### Component Patterns

- **Client Components**: Gunakan `"use client"` directive untuk komponen dengan state/effects/interactivity
- **Server Components**: Default di Next.js App Router — hindari `"use client"` jika tidak perlu
- **Data Fetching**: Gunakan TanStack React Query (`@tanstack/react-query`) untuk semua data dari API
- **API Client**: Gunakan `api` object dari `@/lib/api` — auto-injects Firebase auth token
- **Styling**: Tailwind CSS v4 utility classes + CSS variables untuk theming
- **Icons**: Material Symbols via `<span class="material-symbols-outlined">`
- **i18n**: `useLanguage().t('key')` dengan dot notation; fallback ke English

### Folder Structure for New Components

Buat folder komponen di `src/components/<domain>/` dengan:
- `ComponentName.tsx` — komponen utama
- Gunakan file yang sama untuk sub-komponen jika masih kecil (<200 baris)

### State Handling

Setiap komponen yang fetch data WAJIB handle 4 state:
```typescript
if (isLoading) return <ComponentSkeleton />;
if (error) return <ErrorBanner error={error} onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <Component data={data} />;
```
