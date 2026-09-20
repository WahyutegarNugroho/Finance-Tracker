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
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold block mb-2">
          {t("landing.pillars_heading")}
        </span>
        <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-3">
          {t("landing.bento_heading")}
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
          {t("landing.pillars_sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Pillar 1: Fast Transaction Logging & Precision Filter */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                {t("landing.pillar1_tag")}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                &lt; 3.0s
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.pillar1_title")}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.pillar1_desc")}
            </p>
          </div>

          {/* Interactive Mini Filter Demo */}
          <div className="rounded-xl border border-outline-variant/25 bg-surface-container-low p-3.5 space-y-2.5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                search
              </span>
              <input
                type="text"
                value={demoSearch}
                onChange={(e) => setDemoSearch(e.target.value)}
                placeholder={language === "id" ? "Cari 'Spotify' / 'Groceries'..." : "Search 'Spotify' / 'Groceries'..."}
                className="w-full pl-8 pr-3 py-1.5 bg-surface text-xs rounded-lg border border-outline-variant/30 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary font-sans"
              />
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
              {filteredEntries.map((row, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface text-xs border border-outline-variant/15">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="font-medium text-on-surface truncate">{row.title}</span>
                  </div>
                  <span className={`font-mono font-semibold shrink-0 ml-2 ${row.amount.startsWith('+') ? 'text-secondary' : 'text-on-surface'}`}>
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 2: Proactive Budget Guardrails */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-secondary px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20">
                {t("landing.pillar2_tag")}
              </span>
              <span className="text-xs text-secondary font-mono">
                {language === "id" ? "Aman / Waspada / Kritis" : "Safe / Warn / Critical"}
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.pillar2_title")}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.pillar2_desc")}
            </p>
          </div>

          <div className="space-y-3.5 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-on-surface">{language === "id" ? "Kuliner & Kopi" : "Dining Out"}</span>
                <span className="text-tertiary font-mono">78% ({language === "id" ? "Waspada" : "Warning"})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-on-surface">{language === "id" ? "Belanja Dapur" : "Groceries"}</span>
                <span className="text-secondary font-mono">42% ({language === "id" ? "Aman" : "Safe"})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-on-surface">{language === "id" ? "Langganan Digital" : "Subscriptions"}</span>
                <span className="text-error font-mono">94% ({language === "id" ? "Kritis" : "Critical"})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-error rounded-full" style={{ width: "94%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Data Sovereignty & Offline Mobility */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                {t("landing.pillar3_tag")}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                CSV • PWA • Multi-Cur
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              {t("landing.pillar3_title")}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              {t("landing.pillar3_desc")}
            </p>
          </div>

          <div className="space-y-3">
            {/* CSV ready preview */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">download</span>
                <span className="font-mono font-semibold text-on-surface">export_ledger.csv</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono font-bold text-[10px]">
                {language === "id" ? "Siap (Tanpa Biaya)" : "Ready (Zero Cost)"}
              </span>
            </div>

            {/* Currency support */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/30 text-[11px] font-mono font-semibold text-primary">
                IDR (Rp)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/30 text-[11px] font-mono font-semibold text-secondary">
                USD ($)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/30 text-[11px] font-mono font-semibold text-tertiary">
                EUR (€)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary">
                ID &amp; EN
              </span>
            </div>

            {/* Mobile PWA indication */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">install_mobile</span>
                <span className="font-semibold text-on-surface">PWA Mobile Ready</span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono">
                iOS / Android
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
