"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle: string;
  heroSubtitle: string;
}

export default function AuthLayout({ children, heroTitle, heroSubtitle }: AuthLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#08110A] text-[#F5EFE6] selection:bg-[#39E75F] selection:text-[#08110A]">
      {/* LEFT PANEL: EDITORIAL BRANDING & SOVEREIGNTY NOTEBOOK */}
      <aside className="relative hidden lg:flex lg:w-[48%] flex-col justify-between p-12 xl:p-16 border-r-2 border-white/10 bg-[#08110A] overflow-hidden select-none">
        {/* Brand Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 relative z-10 focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:outline-none rounded-lg w-fit group"
        >
          <div className="w-10 h-10 rounded-full bg-[#39E75F] flex items-center justify-center text-[#08110A] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(57,231,95,0.4)]">
            <span className="material-symbols-outlined text-[24px] font-bold">waterfall_chart</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
              FinTrack
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#39E75F] font-mono font-bold leading-none mt-1">
              Precision Wealth
            </span>
          </div>
        </Link>

        {/* Center Content & Tactile Card */}
        <div className="max-w-lg relative z-10 my-auto py-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StickerBadge text="KEDAULATAN KAS" color="neon" size="sm" rotate={-2} />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#39E75F]">
                • ZERO THIRD-PARTY PROFILING
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tight text-white leading-[1.05]">
              {heroTitle}
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#F5EFE6]/80 font-medium leading-relaxed">
              {heroSubtitle}
            </p>
          </div>

          {/* Tactile Field Notebook Passport Card */}
          <div className="relative rounded-3xl border-2 border-[#08110A] bg-[#F5EFE6] text-[#08110A] p-6 shadow-[6px_6px_0px_#39E75F] rotate-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#08110A]/15 font-mono text-xs font-black uppercase tracking-wider">
              <span>LEDGER SPECIMEN • 2026</span>
              <span className="text-[#08110A]/60">FT-PRIVATE</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#08110A]/10">
                <span className="text-[#08110A]/70">ARUS KAS MASUK:</span>
                <span className="font-bold text-[#08110A]">+Rp 15.000.000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#08110A]/10">
                <span className="text-[#08110A]/70">BATAS KEBUTUHAN (50%):</span>
                <span className="font-bold text-[#08110A]">-Rp 7.500.000</span>
              </div>
              <div className="flex justify-between py-1.5 bg-[#39E75F]/20 px-2.5 rounded-lg border border-[#39E75F] font-bold">
                <span>NET SURPLUS BULANAN:</span>
                <span className="font-black text-[#08110A]">+Rp 4.800.000</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-[#08110A]/70 uppercase">
                STATUS ANGGARAN: AMAN
              </span>
              <StickerBadge text="SURPLUS +32%" color="yellow" size="sm" rotate={2} />
            </div>
          </div>

          {/* Real Security Assurances Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono text-[#F5EFE6]/70">
            <div className="p-3 rounded-2xl bg-[#0D1910] border border-white/10 space-y-1">
              <span className="material-symbols-outlined text-[#39E75F] text-[18px]">lock</span>
              <span className="block font-bold text-white text-[11px] uppercase">AES-256</span>
              <span className="block text-[10px] text-[#F5EFE6]/60">Terenkripsi</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0D1910] border border-white/10 space-y-1">
              <span className="material-symbols-outlined text-[#39E75F] text-[18px]">shield</span>
              <span className="block font-bold text-white text-[11px] uppercase">0 Akses</span>
              <span className="block text-[10px] text-[#F5EFE6]/60">Data Bank</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0D1910] border border-white/10 space-y-1">
              <span className="material-symbols-outlined text-[#39E75F] text-[18px]">download</span>
              <span className="block font-bold text-white text-[11px] uppercase">CSV 1-Klik</span>
              <span className="block text-[10px] text-[#F5EFE6]/60">Tanpa Kunci</span>
            </div>
          </div>
        </div>

        {/* Footer Tagline */}
        <p className="font-mono text-xs text-[#F5EFE6]/50 relative z-10">
          &copy; {new Date().getFullYear()} FinTrack. Precision Wealth Management.
        </p>
      </aside>

      {/* RIGHT PANEL: ECO-BRUTALIST FORM SURFACE */}
      <main className="flex-1 min-w-0 flex items-center justify-center px-4 sm:px-6 py-12 lg:py-16 bg-[#08110A]">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-display font-extrabold uppercase tracking-wider text-[#F5EFE6]/80 hover:text-[#39E75F] transition-colors focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:outline-none rounded-lg px-2 py-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            {t("auth.back_to_home") || "Kembali ke Beranda"}
          </Link>

          {/* Form Box with Warm Sand or Deep Forest Card */}
          <div className="rounded-3xl border-2 border-[#08110A] bg-[#F5EFE6] text-[#08110A] p-6 sm:p-8 shadow-[8px_8px_0px_#39E75F]">
            {children}
          </div>

          <div className="text-center font-mono text-[11px] text-[#F5EFE6]/50">
            <span>OFFLINE PWA READY • BEBAS IKLAN PIHAK KETIGA</span>
          </div>
        </div>
      </main>
    </div>
  );
}