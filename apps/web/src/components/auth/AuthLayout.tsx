"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle: string;
  heroSubtitle: string;
}

export default function AuthLayout({ children, heroTitle, heroSubtitle }: AuthLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      {/* Left Panel */}
      <aside className="relative hidden lg:flex lg:w-[44%] flex-col justify-between p-12 xl:p-16 overflow-hidden bg-[#0A0D14]">
        <Link href="/" className="inline-flex items-center gap-2 font-headline-md text-headline-md font-bold tracking-tight text-white relative z-10">
          <span className="material-symbols-outlined text-[26px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          FinTrack
        </Link>

        <div className="max-w-lg relative z-10">
          <h1 className="font-display text-display text-white mb-6 leading-[1.15]">{heroTitle}</h1>
          <p className="font-body-lg text-body-lg text-white/70 max-w-md leading-relaxed">
            {heroSubtitle}
          </p>
        </div>

        <p className="font-body-sm text-body-sm text-white/40 relative z-10">{t("auth.hero_tagline")}</p>
      </aside>

      {/* Right Panel: Form */}
      <main className="flex-1 min-w-0 flex items-center justify-center px-4 py-12 bg-surface-container-low">
        <div className="w-full max-w-md">
          <Link href="/"
            className="inline-flex mb-6 items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            {t("auth.back_to_home")}
          </Link>
          <div className="rounded-2xl border border-outline-variant/25 bg-surface p-8 sm:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}