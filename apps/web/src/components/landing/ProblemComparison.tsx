"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProblemComparison() {
  const { t, language } = useLanguage();

  return (
    <section id="comparison" className="w-full bg-[#EAE3D2] text-[#08110A] border-b-2 border-[#08110A] py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border-2 border-[#08110A] bg-[#39E75F] text-[#08110A] font-mono font-bold text-xs uppercase mb-4 shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-[15px]">balance</span>
            <span>{t("landing.comparison_badge")}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#08110A] leading-none mb-8">
            {t("landing.comparison_heading")}
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#08110A]/80 leading-relaxed font-medium">
            {t("landing.comparison_sub")}
          </p>
        </div>

        {/* 3-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Column 1: Manual Spreadsheets */}
          <div className="bg-white border-2 border-[#08110A] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#08110A] transition-transform hover:-translate-y-1 duration-200">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#EAE3D2] border-2 border-[#08110A] flex items-center justify-center text-[#08110A] mb-5">
                <span className="material-symbols-outlined text-[24px]">table_view</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#08110A] mb-1.5 leading-tight">
                {t("landing.col1_title")}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#08110A]/70 uppercase mb-6 pb-4 border-b-2 border-[#08110A]/10">
                {t("landing.col1_sub")}
              </p>

              <ul className="space-y-3.5 text-sm sm:text-base text-[#08110A]/85">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">remove_circle_outline</span>
                  <span>{t("landing.col1_p1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">remove_circle_outline</span>
                  <span>{t("landing.col1_p2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">remove_circle_outline</span>
                  <span>{t("landing.col1_p3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-[#08110A]/10 text-xs sm:text-sm text-[#08110A]/75 font-semibold">
              {t("landing.col1_result")}
            </div>
          </div>

          {/* Column 2: Common Bank & Fintech Apps */}
          <div className="bg-white border-2 border-[#08110A] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#08110A] transition-transform hover:-translate-y-1 duration-200">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#EAE3D2] border-2 border-[#08110A] flex items-center justify-center text-[#08110A] mb-5">
                <span className="material-symbols-outlined text-[24px]">account_balance</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#08110A] mb-1.5 leading-tight">
                {t("landing.col2_title")}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#08110A]/70 uppercase mb-6 pb-4 border-b-2 border-[#08110A]/10">
                {t("landing.col2_sub")}
              </p>

              <ul className="space-y-3.5 text-sm sm:text-base text-[#08110A]/85">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">lock_open</span>
                  <span>{t("landing.col2_p1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">campaign</span>
                  <span>{t("landing.col2_p2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">visibility</span>
                  <span>{t("landing.col2_p3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-[#08110A]/10 text-xs sm:text-sm text-[#08110A]/75 font-semibold">
              {t("landing.col2_result")}
            </div>
          </div>

          {/* Column 3: FinTrack (Mindful Ledger) - Flagship Card */}
          <div className="bg-[#08110A] text-[#F5EFE6] border-2 border-[#39E75F] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[8px_8px_0px_#39E75F] relative transition-transform hover:-translate-y-1 duration-200">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#39E75F]/20 border-2 border-[#39E75F] flex items-center justify-center text-[#39E75F]">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <span className="px-3 py-1 rounded-full border border-[#39E75F] bg-[#39E75F]/20 text-[#39E75F] text-xs font-mono font-bold uppercase tracking-wider">
                  {language === "id" ? "Pilihan Sadar" : "Mindful Pick"}
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-1.5 leading-tight">
                {t("landing.col3_title")}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#39E75F] uppercase mb-6 pb-4 border-b-2 border-white/10">
                {t("landing.col3_sub")}
              </p>

              <ul className="space-y-3.5 text-sm sm:text-base text-[#F5EFE6]/90">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#39E75F] text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span className="font-medium">{t("landing.col3_p1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#39E75F] text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span className="font-medium">{t("landing.col3_p2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#39E75F] text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span className="font-medium">{t("landing.col3_p3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-[#39E75F]/30 text-xs sm:text-sm text-[#39E75F] font-bold">
              {t("landing.col3_result")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
