"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProblemComparison() {
  const { t } = useLanguage();

  return (
    <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20 mb-3">
          <span className="material-symbols-outlined text-[15px]">balance</span>
          {t("landing.comparison_badge")}
        </span>
        <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-4">
          {t("landing.comparison_heading")}
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
          {t("landing.comparison_sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Column 1: Manual Spreadsheets */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-outline-variant/60">
          <div>
            <div className="w-12 h-12 rounded-xl bg-outline-variant/20 flex items-center justify-center text-outline mb-5">
              <span className="material-symbols-outlined text-[26px]">grid_on</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">
              {t("landing.col1_title")}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 pb-4 border-b border-outline-variant/20">
              Excel / Google Sheets / Notion Templates
            </p>

            <ul className="space-y-4 text-xs sm:text-sm text-on-surface-variant">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                <span>{t("landing.col1_p1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                <span>{t("landing.col1_p2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                <span>{t("landing.col1_p3")}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-outline-variant/15 text-xs text-outline font-medium">
            Result: Abandoned after 2 weeks
          </div>
        </div>

        {/* Column 2: Common Bank & Fintech Apps */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-outline-variant/60">
          <div>
            <div className="w-12 h-12 rounded-xl bg-outline-variant/20 flex items-center justify-center text-outline mb-5">
              <span className="material-symbols-outlined text-[26px]">credit_card_off</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">
              {t("landing.col2_title")}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 pb-4 border-b border-outline-variant/20">
              Aggregator apps, bank apps, financial portals
            </p>

            <ul className="space-y-4 text-xs sm:text-sm text-on-surface-variant">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                <span>{t("landing.col2_p1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                <span>{t("landing.col2_p2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                <span>{t("landing.col2_p3")}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-outline-variant/15 text-xs text-outline font-medium">
            Result: Annoying notifications & privacy worries
          </div>
        </div>

        {/* Column 3: FinTrack (Winner) */}
        <div className="rounded-2xl border-2 border-primary bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            The Calm Way
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[26px]">verified_user</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              {t("landing.col3_title")}
            </h3>
            <p className="text-xs text-primary font-semibold mb-6 pb-4 border-b border-primary/20">
              Local-first • Fast • Zero ads • Pure control
            </p>

            <ul className="space-y-4 text-xs sm:text-sm text-on-surface">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                <span className="font-medium">{t("landing.col3_p1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                <span className="font-medium">{t("landing.col3_p2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                <span className="font-medium">{t("landing.col3_p3")}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-primary/20 text-xs text-secondary font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Result: Clarity, habit consistency & peace of mind
          </div>
        </div>
      </div>
    </section>
  );
}
