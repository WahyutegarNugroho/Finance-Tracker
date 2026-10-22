"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryColor } from "@/lib/colors";
import { chartTooltip } from "@/lib/chart-config";
import { TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "@/lib/register-doughnut";

interface SpendingChartProps {
  expenseByCategory: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  totalExpense: number;
}

const SpendingChart = React.memo(function SpendingChart({
  expenseByCategory,
  totalExpense,
}: SpendingChartProps) {
  const { formatCurrency } = useAuth();
  const { t, tCategory, language } = useLanguage();

  const doughnutData = {
    labels: Array.isArray(expenseByCategory)
      ? expenseByCategory.map((cat) => tCategory(cat.name))
      : [],
    datasets: [
      {
        data: Array.isArray(expenseByCategory)
          ? expenseByCategory.map((cat) => cat.percentage)
          : [],
        backgroundColor: Array.isArray(expenseByCategory)
          ? expenseByCategory.map((cat, idx) => getCategoryColor(cat.name, idx))
          : [],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
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
        ...chartTooltip,
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            return ` ${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 flex flex-col shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(251,146,60,0.3)]">
      <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white mb-6">
        {t("dashboard_page.charts.spending_by_category")}
      </h3>

      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {expenseByCategory?.length > 0 ? (
          <>
            <div
              className="relative w-40 h-40 flex items-center justify-center"
              role="region"
              aria-label={t("dashboard_page.charts.spending_by_category")}
            >
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                aria-label={t("dashboard_page.charts.spending_by_category")}
              />
              <div className="absolute w-28 h-28 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono text-[9px] font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider">
                  {t("dashboard_page.total_expense_short")}
                </span>
                <span className="font-display text-sm font-black text-[#08110A] dark:text-white mt-0.5 px-2 text-center leading-tight">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>

            <div className="mt-6 w-full flex flex-col gap-2">
              {Array.isArray(expenseByCategory)
                ? expenseByCategory.slice(0, 5).map((cat, idx) => (
                    <div key={cat.name} className="flex items-center justify-between p-1 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-3 h-3 rounded-md border border-[#08110A] shrink-0"
                          style={{ backgroundColor: getCategoryColor(cat.name, idx) }}
                        ></div>
                        <span className="font-sans text-xs font-bold text-[#08110A] dark:text-[#F5EFE6] truncate">
                          {tCategory(cat.name)}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-[#08110A] dark:text-white ml-2">
                        {cat.percentage}%
                      </span>
                    </div>
                  ))
                : null}
              {Array.isArray(expenseByCategory) && expenseByCategory.length > 5 && (
                <div className="flex items-center justify-center pt-1">
                  <span className="text-[11px] font-mono font-bold text-[#08110A]/70 dark:text-[#F5EFE6]/70 bg-[#FAF8F5] dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-[#08110A]/20 dark:border-white/20">
                    {(() => {
                      const countStr = String(expenseByCategory.length - 5);
                      const key = "dashboard_page.more_categories";
                      const translation = t(key);
                      if (translation && translation !== key && translation.includes("{count}")) {
                        return translation.replace("{count}", countStr);
                      }
                      const altKey = "analytics_page.more_categories";
                      const altTranslation = t(altKey);
                      if (altTranslation && altTranslation !== altKey && altTranslation.includes("{count}")) {
                        return altTranslation.replace("{count}", countStr);
                      }
                      return language === "id"
                        ? `+${countStr} kategori lainnya`
                        : `+${countStr} more categories`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-[#08110A]/40 dark:text-[#F5EFE6]/40 gap-3 py-8 relative w-40 h-40">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#08110A]/20 dark:border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">donut_large</span>
            </div>
            <p className="text-[11px] font-mono font-bold mt-24 text-center">{t("dashboard_page.no_spending_data")}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default SpendingChart;
