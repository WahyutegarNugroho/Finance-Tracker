"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroShowcase from "@/components/landing/HeroShowcase";
import TickerBar from "@/components/landing/TickerBar";
import FeatureBento from "@/components/landing/FeatureBento";
import ProblemComparison from "@/components/landing/ProblemComparison";
import ManifestoQuote from "@/components/landing/ManifestoQuote";
import WhoWeFund from "@/components/landing/WhoWeFund";
import BudgetCalculator from "@/components/landing/BudgetCalculator";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingFooter from "@/components/landing/LandingFooter";
import PillButton from "@/components/ui/PillButton";
import RetroLandscape from "@/components/ui/RetroLandscape";

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#08110A] text-[#F5EFE6] selection:bg-[#39E75F] selection:text-[#08110A] bg-grain">
      {/* Sticky Top Navbar */}
      <LandingHeader />

      <main className="flex-1 w-full pt-28">
        {/* HERO SECTION - DEEP FOREST */}
        <section className="relative w-full flex flex-col items-center text-center overflow-hidden">
          {/* Centered Content Container */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Massive Display Hero Headline */}
            <h1
              suppressHydrationWarning
              className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white max-w-5xl leading-none mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700"
            >
              {language === "id" ? (
                <>
                  KENDALIKAN ARUS KAS. <br />
                  <span className="text-[#39E75F]">LINDUNGI TABUNGAN ANDA.</span>
                </>
              ) : (
                <>
                  DIRECT CASH FLOW. <br />
                  <span className="text-[#39E75F]">PROTECT YOUR SAVINGS.</span>
                </>
              )}
            </h1>

            {/* Subheadline (Floor: 16px min for primary body) */}
            <p
              suppressHydrationWarning
              className="font-sans text-base sm:text-lg text-[#F5EFE6]/80 max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-medium"
            >
              {language === "id"
                ? "Catat transaksi harian dalam hitungan detik, tentukan batas anggaran per kategori dan pantau arus kas secara langsung. Tanpa iklan, tanpa pelacakan data dan tanpa rumus spreadsheet yang rumit."
                : "Record daily expenses in seconds, set category limits and track cash flow in real time. No ads, no data tracking and no spreadsheet formulas."}
            </p>

            {/* Action CTAs */}
            <div
              suppressHydrationWarning
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700"
            >
              <PillButton href="/register" variant="neon" size="lg">
                {language === "id" ? "Daftar Akun Gratis" : "Start Tracking Free"}
              </PillButton>
              <PillButton href="#calculator" variant="forest" size="lg" icon="calculate" iconPosition="left">
                {language === "id" ? "Hitung Anggaran" : "Calculate Budget"}
              </PillButton>
            </div>
          </div>

          {/* Full-bleed Edge-to-Edge Panoramic Landscape Illustration (like Kikin) */}
          <div className="w-full select-none overflow-hidden">
            <RetroLandscape variant="hero" />
          </div>
        </section>

        {/* 1. SKY BLUE MARQUEE TICKER STRIP (Directly below the image) */}
        <TickerBar />

        {/* Living Interactive Product Showcase */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-10 pb-20 sm:pt-14 sm:pb-24">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/5 text-[#F5EFE6]/80 font-mono font-bold text-xs uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#39E75F] animate-pulse" />
              <span>{language === "id" ? "EKSPLORASI DASHBOARD INTERAKTIF" : "LIVE INTERACTIVE PREVIEW"}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#F5EFE6]/60 font-sans max-w-md">
              {language === "id"
                ? "Eksplorasi modul arus kas, simulasi pencatatan kilat dan batas limit secara langsung."
                : "Interact with live cashflow charts, simulate instant entries and test budget limits."}
            </p>
          </div>
          <HeroShowcase />
        </section>

        {/* 2. WARM SAND 4-ROW ALTERNATING FEATURE STACK WITH SCENIC BACKDROPS */}
        <FeatureBento />

        {/* 3. HONEST 3-COLUMN PROBLEM COMPARISON TABLE */}
        <ProblemComparison />

        {/* 4. SCENIC BANNER & 3-COLUMN PILLARS: WHO WE ARE BUILT FOR */}
        <WhoWeFund />

        {/* 5. EDITORIAL SERIF QUIET CONFIDENCE MANIFESTO */}
        <ManifestoQuote />

        {/* 6. DEEP FOREST INTERACTIVE 50/30/20 CALCULATOR */}
        <BudgetCalculator />

        {/* 7. WARM SAND 2-COLUMN EDITORIAL FAQS */}
        <LandingFaq />
      </main>

      {/* MASSIVE DEEP FOREST FOOTER WITH RETRO LANDSCAPE ENGRAVING */}
      <LandingFooter />
    </div>
  );
}
