"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProblemComparison() {
  const { t } = useLanguage();

  return (
    <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold block mb-2">
          {t("landing.comparison_badge")}
        </span>
        <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-3">
          {t("landing.comparison_heading")}
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
          {t("landing.comparison_sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Column 1: Manual Spreadsheets */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-outline-variant/60">
          <div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[22px]">table_view</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">
              {t("landing.col1_title")}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 pb-4 border-b border-outline-variant/20">
              {t("landing.col1_sub")}
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-on-surface-variant">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
                <span>{t("landing.col1_p1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
                <span>{t("landing.col1_p2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
                <span>{t("landing.col1_p3")}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-outline-variant/15 text-xs text-on-surface-variant/80 font-medium">
            {t("landing.col1_result")}
          </div>
        </div>

        {/* Column 2: Common Bank & Fintech Apps */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-outline-variant/60">
          <div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">
              {t("landing.col2_title")}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 pb-4 border-b border-outline-variant/20">
              {t("landing.col2_sub")}
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-on-surface-variant">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
                <span>{t("landing.col2_p1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
                <span>{t("landing.col2_p2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
                <span>{t("landing.col2_p3")}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-outline-variant/15 text-xs text-on-surface-variant/80 font-medium">
            {t("landing.col2_result")}
          </div>
        </div>

        {/* Column 3: FinTrack (Mindful Ledger) */}
        <div className="rounded-2xl border border-primary/40 bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4 border border-primary/30">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">
              {t("landing.col3_title")}
            </h3>
            <p className="text-xs text-primary font-medium mb-6 pb-4 border-b border-primary/20">
              {t("landing.col3_sub")}
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-on-surface">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="font-medium">{t("landing.col3_p1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="font-medium">{t("landing.col3_p2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="font-medium">{t("landing.col3_p3")}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-primary/20 text-xs text-primary font-semibold">
            {t("landing.col3_result")}
          </div>
        </div>
      </div>
    </section>
  );
}
