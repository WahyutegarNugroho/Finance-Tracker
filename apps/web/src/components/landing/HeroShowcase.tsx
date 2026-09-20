"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type Currency = "IDR" | "USD" | "EUR";
type ActiveTab = "cashflow" | "budgets" | "quicklog";

export default function HeroShowcase() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("cashflow");
  const [currency, setCurrency] = useState<Currency>("IDR");
  const [quickLogAdded, setQuickLogAdded] = useState(false);

  // Exchange multiplier approximation for realistic display
  const multipliers: Record<Currency, { rate: number; prefix: string; suffix: string; locale: string }> = {
    IDR: { rate: 16000, prefix: "Rp ", suffix: "", locale: "id-ID" },
    USD: { rate: 1, prefix: "$", suffix: "", locale: "en-US" },
    EUR: { rate: 0.92, prefix: "€", suffix: "", locale: "de-DE" },
  };

  const formatMoney = (usdValue: number): string => {
    const { rate, prefix, suffix, locale } = multipliers[currency];
    const val = usdValue * rate;
    if (currency === "IDR") {
      return `${prefix}${Math.round(val).toLocaleString(locale)}${suffix}`;
    }
    return `${prefix}${val.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
  };

  // Preset quick log items
  const quickItems = [
    { title: language === "id" ? "Kopi & Sarapan" : "Morning Coffee", category: "Dining", icon: "coffee", usd: 4.5 },
    { title: language === "id" ? "Belanja Mingguan" : "Supermarket Run", category: "Groceries", icon: "shopping_cart", usd: 48.0 },
    { title: language === "id" ? "Listrik & Internet" : "Utilities & Wifi", category: "Utilities", icon: "bolt", usd: 65.0 },
    { title: language === "id" ? "Cloud / Hosting" : "Cloud Subscription", category: "Subscriptions", icon: "cloud", usd: 19.99 },
  ];

  const handleSimulateLog = () => {
    setQuickLogAdded(true);
    setTimeout(() => {
      setQuickLogAdded(false);
    }, 2800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 rounded-2xl border border-outline-variant/30 bg-surface shadow-2xl overflow-hidden transition-all duration-300">
      {/* Window Titlebar */}
      <div className="bg-surface-container-low border-b border-outline-variant/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-error/60 border border-error/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim/70 border border-tertiary-fixed-dim/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim/70 border border-secondary-fixed-dim/50 inline-block" />
          </div>
          <span className="text-xs font-semibold text-on-surface-variant/80 tracking-wide font-mono hidden sm:inline">
            {t("landing.showcase_window_title")}
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-surface-container-high/60 p-1 rounded-xl border border-outline-variant/25">
          <button
            type="button"
            onClick={() => setActiveTab("cashflow")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "cashflow"
                ? "bg-surface text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>{t("landing.showcase_tab_cashflow")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("budgets")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "budgets"
                ? "bg-surface text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">donut_large</span>
            <span>{t("landing.showcase_tab_budgets")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quicklog")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "quicklog"
                ? "bg-surface text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">flash_on</span>
            <span>{t("landing.showcase_tab_quicklog")}</span>
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-on-surface-variant mr-1 hidden md:inline font-medium">
            {t("landing.showcase_currency_label")}:
          </span>
          {(["IDR", "USD", "EUR"] as Currency[]).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                currency === curr
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-variant/40 text-on-surface-variant hover:text-primary hover:bg-surface-variant/70"
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Viewport */}
      <div className="p-4 sm:p-6 lg:p-7 min-h-[440px] flex flex-col justify-between">
        {/* TAB 1: CASH FLOW RADAR */}
        {activeTab === "cashflow" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 4 Overview Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
                <span className="text-xs text-on-surface-variant font-medium">{t("landing.showcase_balance")}</span>
                <span className="text-base sm:text-lg font-bold font-numeric-data text-on-surface mt-1.5">
                  {formatMoney(4680)}
                </span>
                <span className="text-[11px] text-secondary font-medium mt-1 inline-flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                  {t("landing.showcase_vs_last")}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/20 flex flex-col justify-between">
                <span className="text-xs text-secondary font-semibold">{t("landing.showcase_income")}</span>
                <span className="text-base sm:text-lg font-bold font-numeric-data text-secondary mt-1.5">
                  +{formatMoney(3600)}
                </span>
                <span className="text-[11px] text-on-surface-variant mt-1">2 {language === "id" ? "transaksi" : "deposits"}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-tertiary/10 border border-tertiary/20 flex flex-col justify-between">
                <span className="text-xs text-tertiary font-semibold">{t("landing.showcase_expense")}</span>
                <span className="text-base sm:text-lg font-bold font-numeric-data text-tertiary mt-1.5">
                  -{formatMoney(1740)}
                </span>
                <span className="text-[11px] text-on-surface-variant mt-1">18 {language === "id" ? "transaksi" : "expenses"}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex flex-col justify-between">
                <span className="text-xs text-primary font-semibold">{t("landing.showcase_savings")}</span>
                <span className="text-base sm:text-lg font-bold font-numeric-data text-primary mt-1.5">
                  51.6%
                </span>
                <span className="text-[11px] text-secondary font-medium mt-1">
                  {language === "id" ? "Sehat & Aman" : "Healthy margin"}
                </span>
              </div>
            </div>

            {/* Inflow vs Outflow Visual Trend Curve */}
            <div className="p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-on-surface tracking-wide uppercase">
                    {language === "id" ? "Tren 6 Bulan Terakhir" : "6-Month Cash Flow Trend"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 text-secondary">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    {t("landing.showcase_income")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-tertiary">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    {t("landing.showcase_expense")}
                  </span>
                </div>
              </div>

              {/* Area SVG Chart */}
              <div className="relative h-28 w-full">
                <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
                  {/* Subtle technical grid guides */}
                  <line x1="0" y1="25" x2="500" y2="25" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeDasharray="2 4" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeDasharray="2 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeDasharray="2 4" />

                  {/* Inflow solid line */}
                  <path d="M 0,65 Q 100,50 200,60 T 400,30 T 500,20" fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Outflow dashed line */}
                  <path d="M 0,80 Q 100,70 200,75 T 400,60 T 500,55" fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
                </svg>
                {/* Months labels */}
                <div className="flex justify-between text-[11px] text-on-surface-variant font-mono mt-2 pt-1 border-t border-outline-variant/15">
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span className="font-bold text-primary">Aug (Now)</span>
                </div>
              </div>
            </div>

            {/* Recent Authentic Transactions Stream */}
            <div className="divide-y divide-outline-variant/15 border-t border-outline-variant/20 pt-2">
              {[
                { name: language === "id" ? "Gaji Pokok / Inflow" : "Monthly Client Retainer", cat: "Income", amount: 3600, isIncome: true, icon: "payments", date: "Today, 09:15" },
                { name: language === "id" ? "Belanja Dapur Supermarket" : "Fresh Market Groceries", cat: "Groceries", amount: 82.5, isIncome: false, icon: "shopping_basket", date: "Yesterday" },
                { name: language === "id" ? "Kopi & Meeting Santai" : "Artisan Coffee & Lunch", cat: "Dining", amount: 14.8, isIncome: false, icon: "local_cafe", date: "2 days ago" },
              ].map((tx, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between group hover:bg-surface-container-low/40 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.isIncome ? "bg-secondary/15 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-[18px]">{tx.icon}</span>
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-on-surface truncate">{tx.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{tx.cat} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold font-numeric-data shrink-0 ${tx.isIncome ? "text-secondary" : "text-tertiary"}`}>
                    {tx.isIncome ? "+" : "-"}{formatMoney(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BUDGET GUARDRAILS */}
        {activeTab === "budgets" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
              <div>
                <h4 className="text-sm font-bold text-on-surface">
                  {language === "id" ? "Status Plafon Anggaran Bulan Ini" : "Monthly Category Guardrails"}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  {language === "id" ? "Peringatan visual otomatis menjaga pengeluaran tetap terkontrol" : "Visual thresholds alert you before you break your monthly limits"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/15 text-secondary font-semibold self-start">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                {language === "id" ? "Total 72% Terpakai" : "Overall 72% Capacity"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category 1: Food & Dining (Warning) */}
              <div className="p-4 rounded-xl border border-tertiary-fixed-dim/40 bg-surface-container-low/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-tertiary/10 text-tertiary material-symbols-outlined text-[18px]">
                      restaurant
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {language === "id" ? "Makanan & Kopi" : "Dining & Cafes"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-tertiary/15 text-tertiary">
                    {t("landing.showcase_warning")} (78%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: "78%" }} />
                </div>
                <div className="flex justify-between text-xs font-numeric-data">
                  <span className="text-on-surface font-semibold">{formatMoney(312)} {t("landing.showcase_spent")}</span>
                  <span className="text-on-surface-variant">{formatMoney(88)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>

              {/* Category 2: Subscriptions (Critical) */}
              <div className="p-4 rounded-xl border border-error/40 bg-surface-container-low/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-error/10 text-error material-symbols-outlined text-[18px]">
                      subscriptions
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {language === "id" ? "Langganan & Software" : "Digital Subscriptions"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-error/15 text-error">
                    {t("landing.showcase_critical")} (94%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-error rounded-full" style={{ width: "94%" }} />
                </div>
                <div className="flex justify-between text-xs font-numeric-data">
                  <span className="text-on-surface font-semibold">{formatMoney(141)} {t("landing.showcase_spent")}</span>
                  <span className="text-error font-medium">{formatMoney(9)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>

              {/* Category 3: Groceries (Safe) */}
              <div className="p-4 rounded-xl border border-outline-variant/25 bg-surface-container-low/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-secondary/15 text-secondary material-symbols-outlined text-[18px]">
                      shopping_bag
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {language === "id" ? "Belanja Supermarket" : "Groceries"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-secondary/15 text-secondary">
                    {t("landing.showcase_safe")} (52%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: "52%" }} />
                </div>
                <div className="flex justify-between text-xs font-numeric-data">
                  <span className="text-on-surface font-semibold">{formatMoney(260)} {t("landing.showcase_spent")}</span>
                  <span className="text-on-surface-variant">{formatMoney(240)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>

              {/* Category 4: Transport (Safe) */}
              <div className="p-4 rounded-xl border border-outline-variant/25 bg-surface-container-low/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-secondary/15 text-secondary material-symbols-outlined text-[18px]">
                      directions_car
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {language === "id" ? "Transportasi & Bensin" : "Commute & Fuel"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-secondary/15 text-secondary">
                    {t("landing.showcase_safe")} (38%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: "38%" }} />
                </div>
                <div className="flex justify-between text-xs font-numeric-data">
                  <span className="text-on-surface font-semibold">{formatMoney(76)} {t("landing.showcase_spent")}</span>
                  <span className="text-on-surface-variant">{formatMoney(124)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUICK ENTRY INTERACTION */}
        {activeTab === "quicklog" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-w-md mx-auto text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                {language === "id" ? "Kecepatan Tanpa Hambatan" : "Sub-3-second Entry"}
              </span>
              <h4 className="text-base font-bold text-on-surface">
                {t("landing.showcase_quick_title")}
              </h4>
              <p className="text-xs text-on-surface-variant">
                {t("landing.showcase_quick_sub")}
              </p>
            </div>

            {/* Interactive Simulation Form */}
            <div className="max-w-lg mx-auto p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low shadow-sm space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">
                  {language === "id" ? "Klik contoh untuk mengisi seketika:" : "Click a sample to autofill instantly:"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickItems.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={handleSimulateLog}
                      className="p-2.5 rounded-xl border border-outline-variant/30 bg-surface hover:border-primary hover:bg-primary/5 text-left transition-all group cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          {item.icon}
                        </span>
                        <span className="text-xs font-medium text-on-surface truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-numeric-data text-on-surface-variant shrink-0 pl-1">
                        {formatMoney(item.usd)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status feedback */}
              {quickLogAdded ? (
                <div className="p-3 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>
                    {language === "id"
                      ? "Tercatat dalam 0.8 detik! Saldo & grafik langsung terupdate."
                      : "Logged in 0.8 seconds! Ledger and charts synced instantly."}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 text-xs text-on-surface-variant flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">keyboard</span>
                    {language === "id" ? "Tekan tombol 'N' di mana saja untuk entri baru" : "Press 'N' anywhere to open fast logger"}
                  </span>
                  <span className="font-mono text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded border border-outline-variant/30">
                    ⌘ + K
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
