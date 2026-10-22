"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";
import PillButton from "@/components/ui/PillButton";
import NeonSlider from "@/components/ui/NeonSlider";

export default function BudgetCalculator() {
  const { language } = useLanguage();
  const [currencyMode, setCurrencyMode] = useState<"IDR" | "USD">(language === "id" ? "IDR" : "USD");
  
  // States
  const [incomeIdr, setIncomeIdr] = useState(15000000);
  const [incomeUsd, setIncomeUsd] = useState(3500);
  const [savingsPct, setSavingsPct] = useState(25);
  const [timelineMonths, setTimelineMonths] = useState(12);

  const isIdr = currencyMode === "IDR";
  const currentIncome = isIdr ? incomeIdr : incomeUsd;

  const monthlySavings = Math.round(currentIncome * (savingsPct / 100));
  const accumulatedWealth = monthlySavings * timelineMonths;
  const livingCost = currentIncome - monthlySavings;

  const formatMoney = (val: number) => {
    if (isIdr) {
      return `Rp ${val.toLocaleString("id-ID")}`;
    }
    return `$${val.toLocaleString("en-US")}`;
  };

  return (
    <section id="calculator" className="w-full bg-[#08110A] text-[#F5EFE6] py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typography & Badges */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <StickerBadge text="WEALTH SIMULATOR" color="neon" size="sm" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#39E75F]">
                • INTERACTIVE CALC
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none mb-8">
              {language === "id" ? "Hitung Proyeksi Tabungan." : "Calculate Your Savings."}
            </h2>

            <p className="text-base sm:text-lg text-[#F5EFE6]/85 font-medium leading-relaxed font-sans mb-8">
              {language === "id"
                ? "Tentukan target alokasi tabungan dan jangka waktu bulan untuk melihat estimasi akumulasi saldo yang dapat Anda kumpulkan."
                : "Set your monthly savings ratio and timeline to calculate an estimate of your accumulated savings."}
            </p>

            <div className="pt-2">
              <PillButton href="/register" variant="neon" size="lg">
                {language === "id" ? "Daftar Akun Gratis" : "Start Tracking Free"}
              </PillButton>
            </div>
          </div>

          {/* Right Column: High-Contrast Forest Calculator Box */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border-2 border-white/15 bg-[#0D1910] p-6 sm:p-8 shadow-[8px_8px_0px_rgba(57,231,95,0.25)] space-y-8">
              {/* Currency toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-[#F5EFE6]/80">
                  {language === "id" ? "PILIH MATA UANG" : "BASE CURRENCY"}
                </span>
                <div className="flex bg-[#08110A] p-1 rounded-full border border-white/15">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode("IDR")}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                      isIdr ? "bg-[#39E75F] text-[#08110A]" : "text-[#F5EFE6]/60 hover:text-white"
                    }`}
                  >
                    IDR (Rp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode("USD")}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                      !isIdr ? "bg-[#39E75F] text-[#08110A]" : "text-[#F5EFE6]/60 hover:text-white"
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Sliders Group */}
              <div className="space-y-6">
                <NeonSlider
                  label={language === "id" ? "Estimasi Pemasukan / Bulan" : "Monthly Inflow / Revenue"}
                  value={currentIncome}
                  min={isIdr ? 3000000 : 1000}
                  max={isIdr ? 75000000 : 15000}
                  step={isIdr ? 500000 : 100}
                  formatValue={formatMoney}
                  icon="account_balance_wallet"
                  onChange={(val) => {
                    if (isIdr) setIncomeIdr(val);
                    else setIncomeUsd(val);
                  }}
                />

                <NeonSlider
                  label={language === "id" ? "Target Alokasi Tabungan" : "Target Savings Ratio"}
                  value={savingsPct}
                  min={10}
                  max={60}
                  step={5}
                  formatValue={(v) => `${v}%`}
                  icon="savings"
                  onChange={setSavingsPct}
                />

                <NeonSlider
                  label={language === "id" ? "Jangka Waktu Akumulasi" : "Timeline Horizon"}
                  value={timelineMonths}
                  min={3}
                  max={36}
                  step={3}
                  formatValue={(v) => `${v} ${language === "id" ? "Bulan" : "Months"}`}
                  icon="calendar_month"
                  onChange={setTimelineMonths}
                />
              </div>

              {/* Giant Numeric Result Output Box */}
              <div className="p-6 rounded-2xl bg-[#08110A] border-2 border-[#39E75F]/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-xs uppercase tracking-widest text-[#F5EFE6]/70">
                    {language === "id" ? "PROYEKSI AKUMULASI DANA" : "ESTIMATED ACCUMULATION"}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#39E75F]">
                    {timelineMonths} {language === "id" ? "BULAN" : "MONTHS"}
                  </span>
                </div>

                {/* Big Neon Amount */}
                <div className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#39E75F] tracking-tight leading-none">
                  {formatMoney(accumulatedWealth)}
                </div>

                {/* Submetrics Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-[#F5EFE6]/60 block">{language === "id" ? "Tabungan / Bulan:" : "Monthly Savings:"}</span>
                    <span className="text-white font-bold">{formatMoney(monthlySavings)}</span>
                  </div>
                  <div>
                    <span className="text-[#F5EFE6]/60 block">{language === "id" ? "Plafon Belanja:" : "Living Budget:"}</span>
                    <span className="text-white font-bold">{formatMoney(livingCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
