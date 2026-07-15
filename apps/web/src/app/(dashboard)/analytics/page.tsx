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
import { chartColors, chartColorWithOpacity, getCategoryColor } from "@/lib/colors";
import { chartTooltip, chartScales } from "@/lib/chart-config";

export default function Analytics() {
  const { user, formatCurrency } = useAuth();
  const { t, tCategory } = useLanguage();
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
          tension: 0.3, borderWidth: 2.5,
          pointBackgroundColor: chartColors.primary, pointHoverRadius: 6, fill: true,
        },
        {
          label: t("common.expense") || "Expense",
          data: expenseData,
          borderColor: chartColors.error,
          backgroundColor: chartColorWithOpacity(chartColors.error, 0.1),
          tension: 0.3, borderWidth: 2.5,
          pointBackgroundColor: chartColors.error, pointHoverRadius: 6,
          borderDash: [5, 5], fill: false,
        }
      ]
    };
  }, [cashflow, t]);

  const lineChartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tooltip: { ...chartTooltip, callbacks: { label: function(context: any) { return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`; } } }
    },
    scales: chartScales(formatCurrency)
  }), [formatCurrency]);

  const doughnutData = useMemo(() => {
    const labels = Array.isArray(categories) ? categories.map((cat) => tCategory(cat.categoryName)) : [];
    const amounts = Array.isArray(categories) ? categories.map((cat) => cat.amount) : [];
    const colors = Array.isArray(categories) ? categories.map((cat, idx) => getCategoryColor(cat.categoryName, idx)) : [];
    return { labels, datasets: [{ data: amounts, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }] };
  }, [categories, tCategory]);

  const doughnutOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false, cutout: "75%",
    plugins: {
      legend: { display: false },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tooltip: { ...chartTooltip, callbacks: { label: function(context: any) { return ` ${context.label}: ${formatCurrency(context.raw)}`; } } }
    }
  }), [formatCurrency]);

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

      <div className="flex justify-between items-center gap-4 mb-2">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">{t("analytics_page.title")}</h1>
        <div className="flex items-center gap-1 bg-surface-container-high/60 border border-outline-variant/30 rounded-lg p-1">
          {[3, 6, 12].map((m) => (
            <button key={m} onClick={() => setMonthsRange(m)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${monthsRange === m ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
              {m}m
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-card rounded-xl p-5 flex flex-col gap-3 group transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{t("analytics_page.summary.total_income")}</span>
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </div>
          </div>
          <div className="font-numeric-data text-[28px] font-semibold text-on-surface">{formatCurrency(overview?.income || 0)}</div>
          <div className="text-sm text-secondary font-medium flex items-center gap-1">{t("analytics_page.income_this_month")}</div>
        </div>
        <div className="glass-card rounded-xl p-5 flex flex-col gap-3 group transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{t("analytics_page.summary.total_expense")}</span>
            <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-lg">trending_down</span>
            </div>
          </div>
          <div className="font-numeric-data text-[28px] font-semibold text-on-surface">{formatCurrency(overview?.expense || 0)}</div>
          <div className="text-sm text-error font-medium flex items-center gap-1">{t("analytics_page.spending_this_month")}</div>
        </div>
        <div className="glass-card rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group transition-all duration-300 hover:shadow-md">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">{t("analytics_page.summary.total_balance")}</span>
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">savings</span>
            </div>
          </div>
          <div className="font-numeric-data text-[28px] font-bold text-primary relative z-10">{formatCurrency(overview?.balance || 0)}</div>
          <div className="text-sm text-secondary font-medium flex items-center gap-1 relative z-10">{t("analytics_page.current_balance")}</div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">{t("analytics_page.charts.income_vs_expense")}</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-on-surface-variant">{t("common.income")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span className="text-on-surface-variant">{t("common.expense")}</span>
            </div>
          </div>
        </div>
        <div className="w-full h-[320px] relative mt-4">
          {Array.isArray(cashflow) && cashflow.length > 0 ? (
            <Line data={lineChartData} options={lineChartOptions} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline italic">{t("analytics_page.no_data")}</div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{t("analytics_page.charts.spending_by_category")}</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {Array.isArray(categories) && categories.length > 0 ? (
                <>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute w-28 h-28 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-outline font-bold uppercase tracking-wider">{t("dashboard_page.total_expense_short")}</span>
                    <span className="font-numeric-data text-lg font-bold text-on-surface">{formatCurrency(breakdown?.totalExpense || 0)}</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="text-sm text-outline italic">{t("analytics_page.no_expense")}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
              {Array.isArray(categories) ? categories.slice(0, 5).map((cat, idx) => (
                <div key={cat.categoryId} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(cat.categoryName, idx) }}></div>
                    <span className="text-sm text-on-surface-variant font-medium truncate max-w-[120px]">{tCategory(cat.categoryName)}</span>
                  </div>
                  <span className="text-sm font-semibold">{cat.percentage}%</span>
                </div>
              )) : null}
              {Array.isArray(categories) && categories.length > 5 && (
                <div className="flex items-center justify-center pt-1">
                  <span className="text-xs text-on-surface-variant font-medium bg-surface-variant/50 px-2 py-0.5 rounded-full">
                    {t("analytics_page.more_categories").replace("{count}", String(categories.length - 5))}
                  </span>
                </div>
              )}
              {(!Array.isArray(categories) || categories.length === 0) && (
                <p className="text-sm text-outline italic">{t("analytics_page.no_expense")}</p>
              )}
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{t("analytics_page.top_spending")}</h3>
            <Link href="/transactions?type=expense" className="text-sm text-primary hover:underline font-bold transition-all">{t("common.view_all")}</Link>
          </div>
          <div className="flex flex-col gap-3">
            {Array.isArray(categories) ? categories.slice(0, 5).map((cat, idx) => {
              const catColor = getCategoryColor(cat.categoryName, idx);
              return (
                <div key={cat.categoryId} className="flex items-center p-3 rounded-lg hover:bg-surface-variant/30 transition-all border border-transparent hover:border-outline-variant/10 group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                    <span className="material-symbols-outlined text-[20px]">{cat.categoryIcon || 'category'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-on-surface">{tCategory(cat.categoryName)}</div>
                    <div className="text-[10px] text-outline uppercase tracking-wider font-bold">{t("analytics_page.top_category")}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-numeric-data font-bold text-on-surface">{formatCurrency(cat.amount)}</span>
                    <span className="text-xs font-semibold text-outline">{cat.percentage}%</span>
                  </div>
                </div>
              );
            }) : null}
            {(!Array.isArray(categories) || categories.length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 text-outline gap-2">
                <span className="material-symbols-outlined text-4xl">receipt_long</span>
                <p className="text-sm">{t("analytics_page.no_spending_found")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
