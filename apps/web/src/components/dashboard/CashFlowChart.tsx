"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, CashFlowEntry } from "@/types";
import { useAuth } from "@/context/AuthContext";
import "@/lib/register-bar";
import { Bar } from "react-chartjs-2";
import { chartColors } from "@/lib/colors";
import { chartTooltip, chartScales } from "@/lib/chart-config";
import { TooltipItem } from "chart.js";

const CashFlowChart = React.memo(function CashFlowChart() {
  const { t } = useLanguage();
  const { formatCurrency } = useAuth();

  const { data: cashflowData, isLoading } = useQuery<ApiResponse<CashFlowEntry[]>>({
    queryKey: ["dashboard-cashflow"],
    queryFn: () => api.get("/analytics/cashflow", { params: { months: 6 } }),
  });

  const cashflow = cashflowData?.data || [];

  const barChartData = {
    labels: cashflow.map((m: CashFlowEntry) => m.label),
    datasets: [
      {
        label: t("common.income") || "Income",
        data: cashflow.map((m: CashFlowEntry) => m.income),
        backgroundColor: chartColors.primary,
        borderRadius: 6,
      },
      {
        label: t("common.expense") || "Expense",
        data: cashflow.map((m: CashFlowEntry) => m.expense),
        backgroundColor: chartColors.error,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...chartTooltip,
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            return ` ${context.dataset.label}: ${formatCurrency(context.raw as number)}`;
          },
        },
      },
    },
    scales: chartScales(formatCurrency),
  };

  return (
    <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 lg:col-span-2 flex flex-col shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("dashboard_page.charts.cash_flow")}
          </h3>
          <span className="text-[#08110A]/60 dark:text-[#F5EFE6]/60 font-mono text-xs">
            {t("dashboard_page.last_6_months")}
          </span>
        </div>
      </div>

      <div
        className="flex-1 min-h-[240px] relative mt-2 chart-container"
        role="region"
        aria-label={t("dashboard_page.charts.cash_flow")}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[#08110A]/50 dark:text-[#F5EFE6]/50">
            {t("dashboard_page.loading_chart")}
          </div>
        ) : cashflow.length > 0 ? (
          <Bar data={barChartData} options={barChartOptions} aria-label={t("dashboard_page.charts.cash_flow")} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[#08110A]/50 dark:text-[#F5EFE6]/50">
            {t("dashboard_page.no_spending_data")}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-md border border-[#08110A]"
            style={{ backgroundColor: chartColors.primary }}
          ></div>
          <span className="font-mono text-xs font-bold uppercase text-[#08110A] dark:text-[#F5EFE6]">
            {t("common.income")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-md border border-[#08110A]"
            style={{ backgroundColor: chartColors.error }}
          ></div>
          <span className="font-mono text-xs font-bold uppercase text-[#08110A] dark:text-[#F5EFE6]">
            {t("common.expense")}
          </span>
        </div>
      </div>
    </div>
  );
});

export default CashFlowChart;
