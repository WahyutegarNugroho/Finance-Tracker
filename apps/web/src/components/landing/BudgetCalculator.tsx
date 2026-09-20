"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function BudgetCalculator() {
  const { t, language } = useLanguage();
  const [currencyMode, setCurrencyMode] = useState<"IDR" | "USD">(language === "id" ? "IDR" : "USD");
  
  // Default values
  const [incomeIdr, setIncomeIdr] = useState(15000000);
  const [incomeUsd, setIncomeUsd] = useState(4500);

  const isIdr = currencyMode === "IDR";
  const currentIncome = isIdr ? incomeIdr : incomeUsd;

  const needs = Math.round(currentIncome * 0.5);
  const wants = Math.round(currentIncome * 0.3);
  const savings = Math.round(currentIncome * 0.2);

  const formatValue = (val: number) => {
    if (isIdr) {
      return `Rp ${val.toLocaleString("id-ID")}`;
    }
    return `$${val.toLocaleString("en-US")}`;
  };

  return (
    <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low/70 p-6 sm:p-10 lg:p-12 shadow-lg">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/25 mb-3">
            <span className="material-symbols-outlined text-[15px]">calculate</span>
            {t("landing.calc_badge")}
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-4">
            {t("landing.calc_heading")}
          </h2>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {t("landing.calc_sub")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-surface rounded-2xl border border-outline-variant/30 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Income Slider Controller */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label htmlFor="income-slider" className="text-sm font-bold text-on-surface">
                {t("landing.calc_income_label")}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex bg-surface-container-high p-0.5 rounded-lg border border-outline-variant/30 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode("IDR")}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      isIdr ? "bg-surface text-primary shadow-xs" : "text-on-surface-variant"
                    }`}
                  >
                    IDR (Rp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode("USD")}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      !isIdr ? "bg-surface text-primary shadow-xs" : "text-on-surface-variant"
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
                <span className="text-lg sm:text-xl font-bold font-numeric-data text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  {formatValue(currentIncome)}
                </span>
              </div>
            </div>

            <input
              id="income-slider"
              type="range"
              min={isIdr ? 3000000 : 1000}
              max={isIdr ? 60000000 : 15000}
              step={isIdr ? 500000 : 100}
              value={currentIncome}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (isIdr) setIncomeIdr(val);
                else setIncomeUsd(val);
              }}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant font-mono">
              <span>{isIdr ? "Rp 3.000.000" : "$1,000"}</span>
              <span>{isIdr ? "Rp 60.000.000" : "$15,000"}</span>
            </div>
          </div>

          {/* Visual Proportion Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-surface-container-high">
              <div className="h-full bg-primary" style={{ width: "50%" }} title="50% Needs" />
              <div className="h-full bg-tertiary" style={{ width: "30%" }} title="30% Wants" />
              <div className="h-full bg-secondary" style={{ width: "20%" }} title="20% Savings" />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-on-surface-variant px-1">
              <span className="text-primary font-semibold">50% Needs</span>
              <span className="text-tertiary font-semibold">30% Wants</span>
              <span className="text-secondary font-semibold">20% Savings</span>
            </div>
          </div>

          {/* 3 Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                {t("landing.calc_needs_title")}
              </div>
              <p className="text-lg font-bold font-numeric-data text-on-surface">
                {formatValue(needs)}
              </p>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {t("landing.calc_needs_desc")}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-tertiary/25 bg-tertiary/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-tertiary text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                {t("landing.calc_wants_title")}
              </div>
              <p className="text-lg font-bold font-numeric-data text-on-surface">
                {formatValue(wants)}
              </p>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {t("landing.calc_wants_desc")}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-secondary/25 bg-secondary/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                {t("landing.calc_savings_title")}
              </div>
              <p className="text-lg font-bold font-numeric-data text-on-surface">
                {formatValue(savings)}
              </p>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {t("landing.calc_savings_desc")}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant">
            {t("landing.calc_tip")}
          </div>
        </div>
      </div>
    </section>
  );
}
