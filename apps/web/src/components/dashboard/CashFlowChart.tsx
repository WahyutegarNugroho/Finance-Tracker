"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, CashFlowEntry } from "@/types";
import { useAuth } from "@/context/AuthContext";
import "@/lib/chart-register";
import { Bar } from "react-chartjs-2";
import { chartColors } from "@/lib/colors";
import { TooltipItem } from "chart.js";

export default function CashFlowChart() {
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
        borderRadius: 4,
      },
      {
        label: t("common.expense") || "Expense",
        data: cashflow.map((m: CashFlowEntry) => m.expense),
        backgroundColor: chartColors.error,
        borderRadius: 4,
      }
    ]
  };

  // ponytail: duplicated chart tooltip config → extract sharedChartOptions factory when 3rd chart is added
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          label: function(context: TooltipItem<'bar'>) {
            return ` ${context.dataset.label}: ${formatCurrency(context.raw as number)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(150, 150, 150, 0.8)",
        }
      },
      y: {
        grid: {
          color: "rgba(150, 150, 150, 0.1)",
        },
        ticks: {
          color: "rgba(150, 150, 150, 0.8)",
          callback: function(value: string | number) {
            return formatCurrency(Number(value));
          }
        }
      }
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 lg:col-span-2 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {t("dashboard_page.charts.cash_flow")}
        </h3>
        <span className="text-on-surface-variant font-body-sm text-body-sm">
          {t("dashboard_page.last_6_months")}
        </span>
      </div>

      <div className="flex-1 min-h-[240px] relative mt-2">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-outline italic">
            {t("dashboard_page.loading_chart")}
          </div>
        ) : cashflow.length > 0 ? (
          <Bar data={barChartData} options={barChartOptions} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-outline italic">
            {t("dashboard_page.no_spending_data")}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.primary }}></div>
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
            {t("common.income")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.error }}></div>
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
            {t("common.expense")}
          </span>
        </div>
      </div>
    </div>
  );
}
