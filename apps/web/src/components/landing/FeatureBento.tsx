"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureBento() {
  const { t, language } = useLanguage();
  const [demoSearch, setDemoSearch] = useState("");

  const sampleEntries = [
    { title: "Spotify Family Plan", cat: "Entertainment", amount: "-$16.99", date: "Aug 18" },
    { title: "Weekly Fresh Groceries", cat: "Groceries", amount: "-$64.20", date: "Aug 17" },
    { title: "Freelance UI Project", cat: "Income", amount: "+$850.00", date: "Aug 15" },
    { title: "Electricity & Fiber Internet", cat: "Utilities", amount: "-$92.00", date: "Aug 12" },
  ];

  const filteredEntries = sampleEntries.filter((item) =>
    item.title.toLowerCase().includes(demoSearch.toLowerCase()) ||
    item.cat.toLowerCase().includes(demoSearch.toLowerCase())
  );

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
          <span className="material-symbols-outlined text-[15px]">widgets</span>
          {t("landing.bento_badge")}
        </span>
        <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-4">
          {t("landing.bento_heading")}
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
          {t("landing.bento_sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bento 1: Fast Transaction Logging (Spans 2 columns) */}
        <div className="md:col-span-2 rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10">
                {t("landing.bento_f1_tag")}
              </span>
              <span className="text-xs text-on-surface-variant font-mono hidden sm:inline">
                &lt; 3.0s entry
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.bento_f1_title")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
              {t("landing.bento_f1_desc")}
            </p>
          </div>

          {/* Interactive Mini Filter Demo inside Bento */}
          <div className="rounded-xl border border-outline-variant/25 bg-surface-container-low p-4 space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={demoSearch}
                onChange={(e) => setDemoSearch(e.target.value)}
                placeholder={language === "id" ? "Coba ketik 'Spotify' atau 'Groceries'..." : "Type 'Spotify' or 'Groceries'..."}
                className="w-full pl-9 pr-4 py-2 bg-surface text-xs rounded-lg border border-outline-variant/30 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              {filteredEntries.map((row, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface text-xs border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="font-medium text-on-surface">{row.title}</span>
                    <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                      {row.cat}
                    </span>
                  </div>
                  <span className={`font-mono font-semibold ${row.amount.startsWith('+') ? 'text-secondary' : 'text-on-surface'}`}>
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento 2: Dynamic Category Budgets */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-secondary/10">
                {t("landing.bento_f2_tag")}
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.bento_f2_title")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.bento_f2_desc")}
            </p>
          </div>

          <div className="space-y-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Dining Out</span>
                <span className="text-tertiary">78% (Warning)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Groceries</span>
                <span className="text-secondary">42% (Safe)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bento 3: Cash Flow & Savings Trends */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10">
                {t("landing.bento_f3_tag")}
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.bento_f3_title")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.bento_f3_desc")}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant">{t("landing.f1_savings")}</p>
              <p className="text-2xl font-bold text-primary font-numeric-data mt-0.5">+34.2%</p>
            </div>
            <div className="flex items-end gap-1.5 h-10">
              <div className="w-3.5 h-4 bg-primary/30 rounded-xs" />
              <div className="w-3.5 h-6 bg-primary/50 rounded-xs" />
              <div className="w-3.5 h-8 bg-primary/75 rounded-xs" />
              <div className="w-3.5 h-10 bg-primary rounded-xs" />
            </div>
          </div>
        </div>

        {/* Bento 4: Data Sovereignty */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary px-2 py-0.5 rounded bg-tertiary/10">
                {t("landing.bento_f4_tag")}
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.bento_f4_title")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.bento_f4_desc")}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">download</span>
              <span className="font-semibold text-on-surface">export_ledger.csv</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono font-bold text-[10px]">
              Ready (0 paywalls)
            </span>
          </div>
        </div>

        {/* Bento 5: Multi-Currency & Bilingual */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-secondary/10">
                {t("landing.bento_f5_tag")}
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.bento_f5_title")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.bento_f5_desc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono font-semibold text-primary">
              IDR (Rp)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono font-semibold text-secondary">
              USD ($)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono font-semibold text-tertiary">
              EUR (€)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              Bahasa &amp; English
            </span>
          </div>
        </div>

        {/* Bento 6: PWA Mobile Native Feel (Spans full on mobile/desktop as needed) */}
        <div className="md:col-span-3 rounded-2xl border border-outline-variant/30 bg-gradient-to-r from-surface-container-low via-surface to-surface-container-low p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10 mb-3 inline-block">
              {t("landing.bento_f6_tag")}
            </span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.bento_f6_title")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t("landing.bento_f6_desc")}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 flex items-center gap-3 shadow-xs">
              <span className="material-symbols-outlined text-primary text-[24px]">phone_iphone</span>
              <div className="text-left">
                <p className="text-xs font-bold text-on-surface">iOS &amp; Android</p>
                <p className="text-[10px] text-on-surface-variant">Add to Home Screen</p>
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 flex items-center gap-3 shadow-xs">
              <span className="material-symbols-outlined text-secondary text-[24px]">wifi_off</span>
              <div className="text-left">
                <p className="text-xs font-bold text-on-surface">Offline Cached</p>
                <p className="text-[10px] text-on-surface-variant">Instant load anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
