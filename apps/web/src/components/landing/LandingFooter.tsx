"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import PillButton from "@/components/ui/PillButton";
import StickerBadge from "@/components/ui/StickerBadge";
import RetroLandscape from "@/components/ui/RetroLandscape";

export default function LandingFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="w-full bg-[#08110A] text-[#F5EFE6] pt-24 pb-12 border-t-2 border-white/10 relative overflow-hidden">
      {/* Massive CTA Header Box */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pb-16 border-b-2 border-white/10">
        <div className="inline-flex items-center gap-2">
          <StickerBadge
            text={language === "id" ? "MULAI HARI INI" : "START TODAY"}
            color="neon"
            size="sm"
          />
        </div>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
          {language === "id" ? (
            <>
              KENDALIKAN ARUS KAS. <br />
              <span className="text-[#39E75F]">BANGUN DANA CADANGAN.</span>
            </>
          ) : (
            <>
              MANAGE CASH FLOW. <br />
              <span className="text-[#39E75F]">BUILD YOUR RESERVE.</span>
            </>
          )}
        </h2>

        <p className="text-sm sm:text-base text-[#F5EFE6]/80 max-w-xl mx-auto font-sans font-medium leading-relaxed">
          {language === "id"
            ? "Mulai catat transaksi harian, tetapkan batas anggaran bulanan dan pantau surplus tabungan Anda."
            : "Log daily expenses, enforce monthly category guardrails and monitor your net savings surplus."}
        </p>

        <div className="pt-2">
          <PillButton href="/register" variant="neon" size="lg">
            {language === "id" ? "Daftar Akun Gratis" : "Start Tracking Free"}
          </PillButton>
        </div>
      </div>

      {/* Retro Woodcut Landscape Engraving In Footer - Edge to Edge */}
      <div className="w-full select-none overflow-hidden mt-12 relative">
        <RetroLandscape variant="footer" />
      </div>

      {/* Footer Navigation & Brand Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-6 flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#39E75F] flex items-center justify-center text-[#08110A]">
            <span className="material-symbols-outlined text-[20px] font-bold">waterfall_chart</span>
          </div>
          <div>
            <span className="font-display text-xl font-black uppercase tracking-tight text-white">
              FinTrack
            </span>
            <p className="text-xs sm:text-sm text-[#F5EFE6]/75 font-mono">
              Precision Wealth Management Dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 font-display text-xs uppercase tracking-widest font-extrabold text-[#F5EFE6]/75">
          <a
            href="#features"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1.5 py-0.5"
          >
            {t("landing.nav_features")}
          </a>
          <a
            href="#built-for"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1.5 py-0.5"
          >
            {language === "id" ? "Target Pengguna" : "Who It's For"}
          </a>
          <a
            href="#calculator"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1.5 py-0.5"
          >
            {t("landing.nav_calculator")}
          </a>
          <a
            href="#faq"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1.5 py-0.5"
          >
            {t("landing.nav_faq")}
          </a>
          <Link
            href="/login"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1.5 py-0.5"
          >
            {t("landing.nav_login")}
          </Link>
          <Link
            href="/register"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1.5 py-0.5"
          >
            {t("landing.nav_register")}
          </Link>
        </div>
      </div>

      {/* Bottom Sub-row */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F5EFE6]/70">
        <p>
          &copy; {new Date().getFullYear()} FinTrack. All rights reserved. Built with precision.
        </p>
        <div className="flex items-center gap-4">
          <span>{language === "id" ? "100% BEBAS IKLAN" : "ZERO AD-TRACKERS"}</span>
          <span>•</span>
          <span>OFFLINE PWA READY</span>
        </div>
      </div>
    </footer>
  );
}
