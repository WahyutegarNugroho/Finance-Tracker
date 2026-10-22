"use client";

import React, { useState, useMemo } from "react";
import AnalyticsSkeleton from "@/components/analytics/AnalyticsSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, CashFlowEntry, AnalyticsOverview, AnalyticsCategories } from "@/types";
import Link from "next/link";

import "@/lib/register-line";
import "@/lib/register-doughnut";
import { Line, Doughnut } from "react-chartjs-2";
import type { TooltipItem } from "chart.js";
import { chartColors, chartColorWithOpacity, getCategoryColor } from "@/lib/colors";
import { chartTooltip, chartScales } from "@/lib/chart-config";

export default function Analytics() {
  const { user, formatCurrency } = useAuth();
  const { t, tCategory, language } = useLanguage();
  const [monthsRange, setMonthsRange] = useState(6);

  const { data: overviewData, isLoading: overviewLoading, isError: overviewError } = useQuery<ApiResponse<AnalyticsOverview>>({
    queryKey: ["analytics-overview"],
    queryFn: () => api.get("/analytics/overview"),
    staleTime: 30 * 1000,
    enabled: !!user,
  });

  const { data: cashflowData, isLoading: cashflowLoading, isError: cashflowError } = useQuery<ApiResponse<CashFlowEntry[]>>({
    queryKey: ["analytics-cashflow", monthsRange],
    queryFn: () => api.get("/analytics/cashflow", { params: { months: monthsRange } }),
    staleTime: 60 * 1000,
    enabled: !!user,
  });

  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useQuery<ApiResponse<AnalyticsCategories>>({
    queryKey: ["analytics-categories"],
    queryFn: () => api.get("/analytics/categories"),
    staleTime: 2 * 60 * 1000,
    enabled: !!user,
  });

  const overview = overviewData?.data;
  const cashflow = useMemo(() => cashflowData?.data || [], [cashflowData]);
  const breakdown = categoryData?.data;
  const categories = useMemo(() => breakdown?.categories || [], [breakdown]);

  const lineChartData = useMemo(() => {
    const labels = Array.isArray(cashflow) ? cashflow.map((m) => m.label) : [];
    const incomeData = Array.isArray(cashflow) ? cashflow.map((m) => m.income) : [];
    const expenseData = Array.isArray(cashflow) ? cashflow.map((m) => m.expense) : [];
    return {
      labels,
      datasets: [
        {
          label: t("common.income") || "Income",
          data: incomeData,
          borderColor: chartColors.primary,
          backgroundColor: chartColorWithOpacity(chartColors.primary, 0.1),
          tension: 0.3,
          borderWidth: 2.5,
          pointBackgroundColor: chartColors.primary,
          pointHoverRadius: 6,
          fill: true,
        },
        {
          label: t("common.expense") || "Expense",
          data: expenseData,
          borderColor: chartColors.error,
          backgroundColor: chartColorWithOpacity(chartColors.error, 0.1),
          tension: 0.3,
          borderWidth: 2.5,
          pointBackgroundColor: chartColors.error,
          pointHoverRadius: 6,
          borderDash: [5, 5],
          fill: false,
        },
      ],
    };
  }, [cashflow, t]);

  const lineChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...chartTooltip,
          callbacks: {
            label: (context: TooltipItem<"line">) =>
              ` ${context.dataset.label}: ${formatCurrency(Number(context.raw))}`,
          },
        },
      },
      scales: chartScales(formatCurrency),
    }),
    [formatCurrency]
  );

  const doughnutData = useMemo(() => {
    const labels = Array.isArray(categories) ? categories.map((cat) => tCategory(cat.categoryName)) : [];
    const amounts = Array.isArray(categories) ? categories.map((cat) => cat.amount) : [];
    const colors = Array.isArray(categories) ? categories.map((cat, idx) => getCategoryColor(cat.categoryName, idx)) : [];
    return { labels, datasets: [{ data: amounts, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }] };
  }, [categories, tCategory]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: { display: false },
        tooltip: {
          ...chartTooltip,
          callbacks: {
            label: (context: TooltipItem<"doughnut">) =>
              ` ${context.label}: ${formatCurrency(Number(context.raw))}`,
          },
        },
      },
    }),
    [formatCurrency]
  );

  const isLoading = overviewLoading || cashflowLoading || categoryLoading;
  const anyError = overviewError || cashflowError || categoryError;

  if (isLoading) return <AnalyticsSkeleton />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {anyError && (
        <div className="p-4 bg-error-container/50 text-error rounded-xl border border-error/20">
          {t("dashboard_page.load_error")}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border-2 border-[#08110A] bg-[#7DD3FC] text-[#08110A] font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_#08110A]">
              {language === "id" ? "TREN FINANSIAL" : "FINANCIAL TRENDS"}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("analytics_page.title")}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-full p-1 shadow-[2px_2px_0px_#08110A]">
          {[3, 6, 12].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonthsRange(m)}
              className={`px-3 py-1 font-mono text-xs font-black rounded-full transition-all cursor-pointer ${
                monthsRange === m
                  ? "bg-[#39E75F] text-[#08110A] border border-[#08110A] shadow-[1px_1px_0px_#08110A]"
                  : "text-[#08110A]/70 dark:text-[#F5EFE6]/70 hover:text-[#08110A] dark:hover:text-white"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Total Balance */}
        <div className="md:col-span-3 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] flex flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display font-black text-xs text-[#08110A]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider">
              {t("analytics_page.summary.total_balance")}
            </span>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#08110A] dark:text-white mt-1">
              {formatCurrency(overview?.balance || 0)}
            </div>
            <div className="font-mono text-xs text-[#08110A]/60 dark:text-[#F5EFE6]/60 mt-1 font-bold">
              {t("analytics_page.current_balance")}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#39E75F] border-2 border-[#08110A] flex items-center justify-center text-[#08110A] shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-3xl font-bold">savings</span>
          </div>
        </div>

        {/* Total Income */}
        <div className="md:col-span-1 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-5 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-xs text-[#08110A]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider">
              {t("analytics_page.summary.total_income")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#39E75F] border-2 border-[#08110A] flex items-center justify-center text-[#08110A] shadow-[2px_2px_0px_#08110A]">
              <span className="material-symbols-outlined text-xl font-bold">trending_up</span>
            </div>
          </div>
          <div className="font-display text-2xl font-black text-[#08110A] dark:text-[#39E75F]">
            +{formatCurrency(overview?.income || 0)}
          </div>
          <div className="font-mono text-xs text-[#166534] dark:text-[#39E75F] font-bold">
            {t("analytics_page.income_this_month")}
          </div>
        </div>

        {/* Total Expense */}
        <div className="md:col-span-2 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-5 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(251,146,60,0.3)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-xs text-[#08110A]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider">
              {t("analytics_page.summary.total_expense")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FB923C] border-2 border-[#08110A] flex items-center justify-center text-[#08110A] shadow-[2px_2px_0px_#08110A]">
              <span className="material-symbols-outlined text-xl font-bold">trending_down</span>
            </div>
          </div>
          <div className="font-display text-2xl font-black text-[#FB923C]">
            -{formatCurrency(overview?.expense || 0)}
          </div>
          <div className="font-mono text-xs text-[#991B1B] dark:text-[#FB923C] font-bold">
            {t("analytics_page.spending_this_month")}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 md:p-8 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("analytics_page.charts.income_vs_expense")}
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <div className="w-3.5 h-3.5 rounded-md border border-[#08110A] bg-[#39E75F]"></div>
              <span className="text-[#08110A] dark:text-[#F5EFE6]">{t("common.income")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <div className="w-3.5 h-3.5 rounded-md border border-[#08110A] bg-[#FB923C]"></div>
              <span className="text-[#08110A] dark:text-[#F5EFE6]">{t("common.expense")}</span>
            </div>
          </div>
        </div>
        <div
          className="w-full h-[320px] relative mt-4"
          role="region"
          aria-label={t("analytics_page.charts.income_vs_expense")}
        >
          {Array.isArray(cashflow) && cashflow.length > 0 ? (
            <Line
              data={lineChartData}
              options={lineChartOptions}
              aria-label={t("analytics_page.charts.income_vs_expense")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#08110A]/50 dark:text-[#F5EFE6]/50">
              {t("analytics_page.no_data")}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(251,146,60,0.3)] flex flex-col gap-6">
          <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("analytics_page.charts.spending_by_category")}
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
            <div
              className="relative w-40 h-40 flex items-center justify-center"
              role="region"
              aria-label={t("analytics_page.charts.spending_by_category")}
            >
              {Array.isArray(categories) && categories.length > 0 ? (
                <>
                  <Doughnut
                    data={doughnutData}
                    options={doughnutOptions}
                    aria-label={t("analytics_page.charts.spending_by_category")}
                  />
                  <div className="absolute w-28 h-28 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-mono text-[9px] font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider">
                      {t("dashboard_page.total_expense_short")}
                    </span>
                    <span className="font-display text-sm font-black text-[#08110A] dark:text-white mt-0.5 px-2 text-center leading-tight">
                      {formatCurrency(breakdown?.totalExpense || 0)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#08110A]/20 dark:border-white/20 flex items-center justify-center">
                  <span className="font-mono text-xs text-[#08110A]/50 dark:text-[#F5EFE6]/50">
                    {t("analytics_page.no_expense")}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {Array.isArray(categories)
                ? categories.slice(0, 5).map((cat, idx) => (
                    <div key={cat.categoryId} className="flex items-center justify-between gap-4 p-1 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3 h-3 rounded-md border border-[#08110A] shrink-0"
                          style={{ backgroundColor: getCategoryColor(cat.categoryName, idx) }}
                        ></div>
                        <span className="font-sans text-xs font-bold text-[#08110A] dark:text-[#F5EFE6] truncate max-w-[120px]">
                          {tCategory(cat.categoryName)}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-[#08110A] dark:text-white">{cat.percentage}%</span>
                    </div>
                  ))
                : null}
              {Array.isArray(categories) && categories.length > 5 && (
                <div className="flex items-center justify-center pt-1">
                  <span className="text-[11px] font-mono font-bold text-[#08110A]/70 dark:text-[#F5EFE6]/70 bg-[#FAF8F5] dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-[#08110A]/20 dark:border-white/20">
                    {(() => {
                      const countStr = String(categories.length - 5);
                      const key = "analytics_page.more_categories";
                      const translation = t(key);
                      if (translation && translation !== key && translation.includes("{count}")) {
                        return translation.replace("{count}", countStr);
                      }
                      return language === "id"
                        ? `+${countStr} kategori lainnya`
                        : `+${countStr} more categories`;
                    })()}
                  </span>
                </div>
              )}
              {(!Array.isArray(categories) || categories.length === 0) && (
                <p className="font-mono text-xs text-[#08110A]/50 dark:text-[#F5EFE6]/50">{t("analytics_page.no_expense")}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white">
              {t("analytics_page.top_spending")}
            </h3>
            <Link
              href="/transactions?type=expense"
              className="font-mono text-xs font-bold uppercase underline underline-offset-4 decoration-2 text-[#08110A] dark:text-[#39E75F] hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:outline-none rounded px-1"
            >
              {t("common.view_all")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {Array.isArray(categories)
              ? categories.slice(0, 5).map((cat, idx) => {
                  const catColor = getCategoryColor(cat.categoryName, idx);
                  return (
                    <div
                      key={cat.categoryId}
                      className="flex items-center p-3 rounded-2xl border border-transparent hover:border-[#08110A]/10 dark:hover:border-white/10 hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl border-2 border-[#08110A] flex items-center justify-center mr-4 transition-transform group-hover:scale-105 shrink-0 shadow-[2px_2px_0px_#08110A]"
                        style={{ backgroundColor: catColor, color: "#08110A" }}
                      >
                        <span className="material-symbols-outlined text-[20px] font-bold">
                          {cat.categoryIcon || "category"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-sans text-sm font-bold text-[#08110A] dark:text-white truncate">
                          {tCategory(cat.categoryName)}
                        </div>
                        <div className="font-mono text-[10px] font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider truncate">
                          {t("analytics_page.top_category")}
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-mono font-black text-sm text-[#08110A] dark:text-white">
                          {formatCurrency(cat.amount)}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60">{cat.percentage}%</span>
                      </div>
                    </div>
                  );
                })
              : null}
            {(!Array.isArray(categories) || categories.length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 text-[#08110A]/40 dark:text-[#F5EFE6]/40 gap-2">
                <span className="material-symbols-outlined text-4xl">receipt_long</span>
                <p className="font-mono text-xs font-bold">{t("analytics_page.no_spending_found")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
