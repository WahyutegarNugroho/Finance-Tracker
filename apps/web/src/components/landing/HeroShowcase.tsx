"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";

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
    <div className="w-full max-w-5xl mx-auto rounded-3xl border-2 border-white/15 bg-[#08110A] text-[#F5EFE6] shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300">
      {/* Window Titlebar */}
      <div className="bg-[#0D1910] border-b-2 border-white/10 px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center px-3 py-1 rounded-full bg-[#08110A] border border-white/15">
            <span className="text-xs font-mono font-bold tracking-tight text-[#F5EFE6]">
              {t("landing.showcase_window_title")}
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#08110A] p-1 rounded-full border border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab("cashflow")}
            className={`px-4 py-1.5 text-xs font-display font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "cashflow"
                ? "bg-[#39E75F] text-[#08110A]"
                : "text-[#F5EFE6]/70 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>{t("landing.showcase_tab_cashflow")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("budgets")}
            className={`px-4 py-1.5 text-xs font-display font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "budgets"
                ? "bg-[#39E75F] text-[#08110A]"
                : "text-[#F5EFE6]/70 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">donut_large</span>
            <span>{t("landing.showcase_tab_budgets")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quicklog")}
            className={`px-4 py-1.5 text-xs font-display font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "quicklog"
                ? "bg-[#39E75F] text-[#08110A]"
                : "text-[#F5EFE6]/70 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>{t("landing.showcase_tab_quicklog")}</span>
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#F5EFE6]/60 mr-1 hidden md:inline font-mono uppercase">
            {t("landing.showcase_currency_label")}:
          </span>
          {(["IDR", "USD", "EUR"] as Currency[]).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                currency === curr
                  ? "bg-[#39E75F] text-[#08110A]"
                  : "bg-white/5 text-[#F5EFE6]/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Viewport */}
      <div className="p-6 sm:p-8 min-h-[460px] flex flex-col justify-between">
        {/* TAB 1: CASH FLOW RADAR */}
        {activeTab === "cashflow" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 4 Overview Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0F1C13] border-2 border-white/10 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#F5EFE6]/70">{t("landing.showcase_balance")}</span>
                <span className="text-lg sm:text-2xl font-display font-black text-[#F5EFE6] mt-2">
                  {formatMoney(4680)}
                </span>
                <span className="text-xs text-[#39E75F] font-mono font-bold mt-2 inline-flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
                  {t("landing.showcase_vs_last")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1C13] border-2 border-[#39E75F]/30 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#39E75F] font-bold">{t("landing.showcase_income")}</span>
                <span className="text-lg sm:text-2xl font-display font-black text-[#39E75F] mt-2">
                  +{formatMoney(3600)}
                </span>
                <span className="text-xs text-[#F5EFE6]/60 font-mono mt-2">2 {language === "id" ? "transaksi" : "deposits"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1C13] border-2 border-[#FB923C]/30 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FB923C] font-bold">{t("landing.showcase_expense")}</span>
                <span className="text-lg sm:text-2xl font-display font-black text-[#FB923C] mt-2">
                  -{formatMoney(1740)}
                </span>
                <span className="text-xs text-[#F5EFE6]/60 font-mono mt-2">18 {language === "id" ? "transaksi" : "expenses"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1C13] border-2 border-[#7DD3FC]/30 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#7DD3FC] font-bold">{t("landing.showcase_savings")}</span>
                <span className="text-lg sm:text-2xl font-display font-black text-[#7DD3FC] mt-2">
                  51.6%
                </span>
                <span className="text-xs text-[#39E75F] font-mono font-bold mt-2">
                  {language === "id" ? "Sehat & Aman" : "Healthy margin"}
                </span>
              </div>
            </div>

            {/* Inflow vs Outflow Visual Trend Curve */}
            <div className="p-5 rounded-2xl border-2 border-white/10 bg-[#0D1910]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-black text-white tracking-widest uppercase">
                    {language === "id" ? "TREN ARUS KAS 6 BULAN TERAKHIR" : "6-MONTH CASH FLOW TREND"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-display font-bold uppercase">
                  <span className="inline-flex items-center gap-1.5 text-[#39E75F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39E75F]" />
                    {t("landing.showcase_income")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#FB923C]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                    {t("landing.showcase_expense")}
                  </span>
                </div>
              </div>

              {/* Area SVG Chart */}
              <div className="relative h-32 w-full">
                <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
                  {/* Subtle technical grid guides */}
                  <line x1="0" y1="25" x2="500" y2="25" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />

                  {/* Inflow solid line */}
                  <path d="M 0,65 Q 100,50 200,60 T 400,30 T 500,20" fill="none" stroke="#39E75F" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Outflow dashed line */}
                  <path d="M 0,80 Q 100,70 200,75 T 400,60 T 500,55" fill="none" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
                </svg>
                {/* Months labels */}
                <div className="flex justify-between text-xs text-[#F5EFE6]/60 font-mono mt-3 pt-2 border-t border-white/10">
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span className="font-bold text-[#39E75F]">Aug (Now)</span>
                </div>
              </div>
            </div>

            {/* Recent Authentic Transactions Stream */}
            <div className="divide-y divide-white/10 border-t-2 border-white/10 pt-3">
              {[
                { name: language === "id" ? "Gaji Pokok / Inflow" : "Monthly Client Retainer", cat: "Income", amount: 3600, isIncome: true, icon: "payments", date: "Hari Ini, 09:15" },
                { name: language === "id" ? "Belanja Dapur Supermarket" : "Fresh Market Groceries", cat: "Groceries", amount: 82.5, isIncome: false, icon: "shopping_basket", date: "Kemarin" },
                { name: language === "id" ? "Kopi & Meeting Santai" : "Artisan Coffee & Lunch", cat: "Dining", amount: 14.8, isIncome: false, icon: "local_cafe", date: "2 hari lalu" },
              ].map((tx, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between group hover:bg-white/5 px-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${tx.isIncome ? "bg-[#39E75F]/15 text-[#39E75F] border-[#39E75F]/40" : "bg-white/5 text-[#F5EFE6] border-white/10"}`}>
                      <span className="material-symbols-outlined text-[19px]">{tx.icon}</span>
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-display font-bold text-white truncate">{tx.name}</p>
                      <p className="text-xs text-[#F5EFE6]/60 font-mono">{tx.cat} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-display font-black shrink-0 ${tx.isIncome ? "text-[#39E75F]" : "text-[#FB923C]"}`}>
                    {tx.isIncome ? "+" : "-"}{formatMoney(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BUDGET GUARDRAILS */}
        {activeTab === "budgets" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-white/10">
              <div>
                <h4 className="text-base font-display font-black uppercase text-white tracking-wide">
                  {language === "id" ? "STATUS PLAFON ANGGARAN BULAN INI" : "MONTHLY CATEGORY GUARDRAILS"}
                </h4>
                <p className="text-xs text-[#F5EFE6]/70">
                  {language === "id" ? "Peringatan visual otomatis menjaga pengeluaran tetap terkontrol" : "Visual thresholds alert you before you break your monthly limits"}
                </p>
              </div>
              <StickerBadge text={language === "id" ? "72% TERPAKAI" : "72% CAPACITY"} color="neon" size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category 1: Food & Dining */}
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-[#0F1C13] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#FB923C]/20 text-[#FB923C] material-symbols-outlined text-[20px]">
                      restaurant
                    </span>
                    <span className="text-sm font-display font-bold text-white uppercase">
                      {language === "id" ? "Makanan & Kopi" : "Dining & Cafes"}
                    </span>
                  </div>
                  <StickerBadge text="78% WARNING" color="orange" size="sm" />
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#FB923C] rounded-full" style={{ width: "78%" }} />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{formatMoney(312)} {t("landing.showcase_spent")}</span>
                  <span className="text-[#F5EFE6]/60">{formatMoney(88)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>

              {/* Category 2: Subscriptions */}
              <div className="p-4 rounded-2xl border-2 border-[#EF4444]/40 bg-[#0F1C13] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#EF4444]/20 text-[#EF4444] material-symbols-outlined text-[20px]">
                      subscriptions
                    </span>
                    <span className="text-sm font-display font-bold text-white uppercase">
                      {language === "id" ? "Langganan Digital" : "Digital Subs"}
                    </span>
                  </div>
                  <StickerBadge text="94% CRITICAL" color="yellow" size="sm" />
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#EF4444] rounded-full" style={{ width: "94%" }} />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{formatMoney(141)} {t("landing.showcase_spent")}</span>
                  <span className="text-[#EF4444] font-bold">{formatMoney(9)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>

              {/* Category 3: Groceries */}
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-[#0F1C13] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#39E75F]/20 text-[#39E75F] material-symbols-outlined text-[20px]">
                      shopping_bag
                    </span>
                    <span className="text-sm font-display font-bold text-white uppercase">
                      {language === "id" ? "Supermarket" : "Groceries"}
                    </span>
                  </div>
                  <StickerBadge text="52% SAFE" color="neon" size="sm" />
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#39E75F] rounded-full" style={{ width: "52%" }} />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{formatMoney(260)} {t("landing.showcase_spent")}</span>
                  <span className="text-[#F5EFE6]/60">{formatMoney(240)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>

              {/* Category 4: Transport */}
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-[#0F1C13] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#7DD3FC]/20 text-[#7DD3FC] material-symbols-outlined text-[20px]">
                      directions_car
                    </span>
                    <span className="text-sm font-display font-bold text-white uppercase">
                      {language === "id" ? "Transportasi" : "Transport"}
                    </span>
                  </div>
                  <StickerBadge text="38% SAFE" color="sky" size="sm" />
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#7DD3FC] rounded-full" style={{ width: "38%" }} />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{formatMoney(76)} {t("landing.showcase_spent")}</span>
                  <span className="text-[#F5EFE6]/60">{formatMoney(124)} {t("landing.showcase_remaining")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUICK ENTRY INTERACTION */}
        {activeTab === "quicklog" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-w-md mx-auto text-center space-y-2">
              <StickerBadge text="SPEED LOGGING • SUB-3S" color="yellow" size="sm" />
              <h4 className="text-lg font-display font-black uppercase text-white">
                {t("landing.showcase_quick_title")}
              </h4>
              <p className="text-xs text-[#F5EFE6]/70">
                {t("landing.showcase_quick_sub")}
              </p>
            </div>

            {/* Interactive Simulation Form */}
            <div className="max-w-lg mx-auto p-6 rounded-3xl border-2 border-white/15 bg-[#0D1910] space-y-4">
              <div>
                <label className="text-xs font-display font-bold uppercase tracking-wider text-[#F5EFE6]/80 block mb-2">
                  {language === "id" ? "Klik contoh untuk entri instan:" : "Click a sample to autofill instantly:"}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickItems.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={handleSimulateLog}
                      className="p-3 rounded-2xl border-2 border-white/10 bg-[#08110A] hover:border-[#39E75F] hover:bg-[#39E75F]/5 text-left transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-[#39E75F] text-[20px] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <span className="text-xs font-display font-bold text-white truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#F5EFE6]/70 shrink-0 pl-1">
                        {formatMoney(item.usd)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status feedback */}
              {quickLogAdded ? (
                <div className="p-3.5 rounded-2xl bg-[#39E75F]/20 border-2 border-[#39E75F] text-[#39E75F] text-xs font-display font-bold uppercase flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>
                    {language === "id"
                      ? "Transaksi tersimpan. Saldo dan grafik langsung diperbarui."
                      : "Transaction saved. Ledger and charts updated."}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#08110A] border border-white/10 text-xs text-[#F5EFE6]/70 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#39E75F] text-[18px]">offline_pin</span>
                    {language === "id"
                      ? "Bisa diakses dari browser maupun dipasang sebagai aplikasi PWA"
                      : "Accessible in your browser or installed as a PWA app"}
                  </span>
                  <span className="font-mono text-[10px] bg-white/10 text-[#39E75F] px-2 py-0.5 rounded-full border border-white/20 font-bold">
                    PWA READY
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
