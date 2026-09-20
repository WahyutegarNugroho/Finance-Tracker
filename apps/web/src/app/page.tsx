"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroShowcase from "@/components/landing/HeroShowcase";
import ProblemComparison from "@/components/landing/ProblemComparison";
import FeatureBento from "@/components/landing/FeatureBento";
import BudgetCalculator from "@/components/landing/BudgetCalculator";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary/20 selection:text-primary">
      {/* Sticky Glass Navbar */}
      <LandingHeader />

      <main className="flex-1 w-full pt-28 pb-20">
        {/* HERO SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Main Hero Headline */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {t("landing.hero_title_a")}{" "}
            <span className="text-primary">
              {t("landing.hero_title_b")}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="font-body-lg text-sm sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t("landing.hero_sub")}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-6">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary text-on-primary font-semibold text-sm sm:text-base hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <span>{t("landing.cta_register")}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <a
              href="#calculator"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-outline-variant/40 bg-surface/80 hover:bg-surface-variant/40 text-on-surface font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">play_circle</span>
              <span>{t("landing.cta_demo")}</span>
            </a>
          </div>

          {/* Micro-guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-on-surface-variant font-medium mb-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
              {t("landing.guarantee_1")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
              {t("landing.guarantee_2")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
              {t("landing.guarantee_3")}
            </span>
          </div>

          {/* Living Product Showcase */}
          <HeroShowcase />
        </section>

        {/* PROOF POINTS / KEY METRICS STRIP */}
        <section className="mt-20 py-10 border-y border-outline-variant/20 bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <p className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-primary font-numeric-data">
                  {t("landing.metrics_m1_val")}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {t("landing.metrics_m1_label")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-secondary font-numeric-data">
                  {t("landing.metrics_m2_val")}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {t("landing.metrics_m2_label")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-tertiary font-numeric-data">
                  {t("landing.metrics_m3_val")}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {t("landing.metrics_m3_label")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface font-numeric-data">
                  {t("landing.metrics_m4_val")}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {t("landing.metrics_m4_label")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HONEST COMPARISON SECTION */}
        <ProblemComparison />

        {/* DEEP FEATURE BENTO GRID */}
        <FeatureBento />

        {/* 50/30/20 INTERACTIVE BUDGET CALCULATOR */}
        <BudgetCalculator />

        {/* FAQ ACCORDION */}
        <LandingFaq />

        {/* BOTTOM FINAL CONVERSION CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16">
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-8 sm:p-12 lg:p-14 text-center shadow-sm">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
                {t("landing.cta_heading")}
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {t("landing.cta_sub")}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm sm:text-base hover:bg-primary/90 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {t("landing.cta_button")}
                </Link>
              </div>
              <p className="text-xs text-on-surface-variant">
                {t("landing.cta_login_text")}{" "}
                <Link href="/login" className="underline font-semibold text-primary hover:text-primary/80">
                  {t("landing.cta_login_link")}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}
