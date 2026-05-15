"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface SpendingChartProps {
  expenseByCategory: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  totalExpense: number;
}

export default function SpendingChart({ expenseByCategory, totalExpense }: SpendingChartProps) {
  const { formatCurrency } = useAuth();
  const { language, t, tCategory } = useLanguage();

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
        {t("dashboard_page.charts.spending_by_category")}
      </h3>
      
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {expenseByCategory?.length > 0 ? (
          <>
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center relative shadow-inner"
              style={{
                background: `conic-gradient(${
                  (Array.isArray(expenseByCategory) ? expenseByCategory : []).map((cat, i, arr) => {
                    const prevPercentages = arr.slice(0, i).reduce((sum, c) => sum + c.percentage, 0);
                    return `${cat.color} ${prevPercentages}% ${prevPercentages + cat.percentage}%`;
                  }).join(', ')
                })`
              }}
            >
              {/* Inner Circle for Doughnut Effect */}
              <div className="absolute w-28 h-28 bg-surface rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="font-label-caps text-label-caps text-outline text-[9px] uppercase tracking-tighter">
                  {language === 'id' ? 'Total Keluar' : 'Total Exp'}
                </span>
                <span className="font-numeric-data text-[13px] font-bold text-on-surface mt-0.5 px-2 text-center leading-tight">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>

            <div className="mt-8 w-full flex flex-col gap-2.5 overflow-y-auto max-h-[140px] pr-1 custom-scrollbar">
              {Array.isArray(expenseByCategory) ? expenseByCategory.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {tCategory(cat.name)}
                    </span>
                  </div>
                  <span className="font-numeric-data text-numeric-data text-on-surface text-xs font-medium ml-2">
                    {cat.percentage}%
                  </span>
                </div>
              )) : null}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-outline gap-2 py-8">
            <span className="material-symbols-outlined text-4xl">pie_chart</span>
            <p className="text-xs italic">{language === 'id' ? 'Belum ada data pengeluaran' : 'No spending data yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
