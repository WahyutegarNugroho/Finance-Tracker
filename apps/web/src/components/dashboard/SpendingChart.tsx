"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

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
  const { t, tCategory } = useLanguage();

  const doughnutData = {
    labels: Array.isArray(expenseByCategory) ? expenseByCategory.map((cat) => tCategory(cat.name)) : [],
    datasets: [
      {
        data: Array.isArray(expenseByCategory) ? expenseByCategory.map((cat) => cat.percentage) : [],
        backgroundColor: Array.isArray(expenseByCategory) ? expenseByCategory.map((cat) => cat.color || "#4648d4") : [],
        borderWidth: 0,
        hoverOffset: 4,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 30, 40, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 10,
        callbacks: {
          label: function(context: TooltipItem<'doughnut'>) {
            return ` ${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
        {t("dashboard_page.charts.spending_by_category")}
      </h3>
      
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {expenseByCategory?.length > 0 ? (
          <>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              {/* Inner Circle for Doughnut Effect */}
              <div className="absolute w-28 h-28 bg-surface rounded-full flex flex-col items-center justify-center shadow-sm pointer-events-none">
                <span className="font-label-caps text-label-caps text-outline text-[9px] uppercase tracking-tighter">
                  {t("dashboard_page.total_expense_short")}
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
              {Array.isArray(expenseByCategory) && expenseByCategory.length > 5 && (
                <div className="flex items-center justify-center pt-1">
                  <span className="text-xs text-on-surface-variant font-medium bg-surface-variant/50 px-2 py-0.5 rounded-full">
                    +{expenseByCategory.length - 5} more
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-outline gap-2 py-8">
            <span className="material-symbols-outlined text-4xl">pie_chart</span>
            <p className="text-xs italic">{t("dashboard_page.no_spending_data")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
