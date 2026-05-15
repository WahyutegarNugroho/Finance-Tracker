"use client";

import React, { useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import AnalyticsSkeleton from "@/components/analytics/AnalyticsSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types";
import Link from "next/link";

export default function Analytics() {
  const { user, loading: authLoading, formatCurrency } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Queries
  const { data: overviewData, isLoading: overviewLoading } = useQuery<ApiResponse<any>>({
    queryKey: ["analytics-overview"],
    queryFn: () => api.get("/analytics/overview"),
    enabled: !!user,
  });

  const { data: cashflowData, isLoading: cashflowLoading } = useQuery<ApiResponse<any[]>>({
    queryKey: ["analytics-cashflow"],
    queryFn: () => api.get("/analytics/cashflow", { params: { months: 6 } }),
    enabled: !!user,
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery<ApiResponse<any>>({
    queryKey: ["analytics-categories"],
    queryFn: () => api.get("/analytics/categories"),
    enabled: !!user,
  });

  const overview = overviewData?.data;
  const cashflow = cashflowData?.data || [];
  const breakdown = categoryData?.data;
  const categories = breakdown?.categories || [];

  // Chart Logic Helpers
  const maxVal = useMemo(() => {
    if (!Array.isArray(cashflow) || cashflow.length === 0) return 1000;
    return Math.max(...cashflow.map((m: any) => Math.max(m.income, m.expense)), 1000);
  }, [cashflow]);

  const getPoint = (val: number, index: number, total: number) => {
    const x = (index / (total - 1 || 1)) * 100;
    const y = 50 - (val / maxVal) * 45; // Map to SVG viewBox 0-50
    return `${x},${y}`;
  };

  const incomePath = useMemo(() => 
    Array.isArray(cashflow) && cashflow.length > 1
      ? `M${cashflow.map((m: any, i: number) => getPoint(m.income, i, cashflow.length)).join(' L')}`
      : ""
  , [cashflow, maxVal]);

  const expensePath = useMemo(() => 
    Array.isArray(cashflow) && cashflow.length > 1
      ? `M${cashflow.map((m: any, i: number) => getPoint(m.expense, i, cashflow.length)).join(' L')}`
      : ""
  , [cashflow, maxVal]);

  if (authLoading) {
    return (
      <div className="bg-background min-h-screen">
        <Topbar />
        <Sidebar activePath="/analytics" />
        <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
          <AnalyticsSkeleton />
        </main>
        <BottomNav activePath="/analytics" />
      </div>
    );
  }

  const isLoading = overviewLoading || cashflowLoading || categoryLoading;

  return (
    <div className="text-on-background font-body-lg min-h-screen bg-background antialiased flex flex-col">
      <Topbar />
      <Sidebar activePath="/analytics" />

      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full flex-1">
        <div className="max-w-[1440px] mx-auto w-full h-full">
          {isLoading ? (
            <AnalyticsSkeleton />
          ) : (
            <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center md:hidden mb-2">
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">{t("analytics_page.title")}</h1>
              </div>

              {/* Summary Stats */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="glass-card rounded-xl p-5 flex flex-col gap-3 group transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{t("analytics_page.summary.total_income")}</span>
                    <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-lg">trending_up</span>
                    </div>
                  </div>
                  <div className="font-numeric-data text-[28px] font-semibold text-on-surface">
                    {formatCurrency(overview?.income || 0)}
                  </div>
                  <div className="text-sm text-secondary font-medium flex items-center gap-1">
                    {language === 'id' ? 'Pendapatan bulan ini' : 'Income this month'}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5 flex flex-col gap-3 group transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{t("analytics_page.summary.total_expense")}</span>
                    <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error">
                      <span className="material-symbols-outlined text-lg">trending_down</span>
                    </div>
                  </div>
                  <div className="font-numeric-data text-[28px] font-semibold text-on-surface">
                    {formatCurrency(overview?.expense || 0)}
                  </div>
                  <div className="text-sm text-error font-medium flex items-center gap-1">
                    {language === 'id' ? 'Pengeluaran bulan ini' : 'Spending this month'}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group transition-all duration-300 hover:shadow-md">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">{t("analytics_page.summary.total_balance")}</span>
                    <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">savings</span>
                    </div>
                  </div>
                  <div className="font-numeric-data text-[28px] font-bold text-primary relative z-10">
                    {formatCurrency(overview?.balance || 0)}
                  </div>
                  <div className="text-sm text-secondary font-medium flex items-center gap-1 relative z-10">
                    {language === 'id' ? 'Saldo saat ini' : 'Current balance'}
                  </div>
                </div>
              </section>

              {/* Cash Flow Chart */}
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

                <div className="w-full h-[300px] relative mt-4 border-l border-b border-outline-variant/30 pb-8 pl-4 flex items-end">
                  {/* Y Axis */}
                  <div className="absolute left-[-45px] top-0 h-[calc(100%-32px)] flex flex-col justify-between text-[10px] text-outline font-medium">
                    <span>{formatCurrency(maxVal)}</span>
                    <span>{formatCurrency(maxVal * 0.5)}</span>
                    <span>0</span>
                  </div>
                  
                  {/* X Axis Labels */}
                  <div className="absolute bottom-[-28px] left-4 w-[calc(100%-16px)] flex justify-between text-xs text-outline font-medium pr-4">
                    {Array.isArray(cashflow) && cashflow.length > 0 ? (
                      cashflow.map((m: any) => <span key={m.month}>{m.label}</span>)
                    ) : (
                      <span className="w-full text-center italic">{language === 'id' ? 'Belum ada data' : 'No data yet'}</span>
                    )}
                  </div>

                  {/* Trend Lines */}
                  {Array.isArray(cashflow) && cashflow.length > 1 && (
                    <>
                      <div className="absolute bottom-[32px] left-4 w-[calc(100%-16px)] h-[calc(100%-32px)] z-10 flex items-end pointer-events-none">
                        <svg className="w-full h-full preserve-aspect-ratio-none overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <path d={incomePath} fill="none" stroke="var(--color-primary, #4648d4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
                        </svg>
                      </div>
                      <div className="absolute bottom-[32px] left-4 w-[calc(100%-16px)] h-[calc(100%-32px)] z-10 flex items-end pointer-events-none">
                        <svg className="w-full h-full preserve-aspect-ratio-none overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <path d={expensePath} fill="none" stroke="var(--color-error, #ba1a1a)" strokeDasharray="6,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Spending by Category Pie Chart */}
                <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{t("analytics_page.charts.spending_by_category")}</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
                    <div 
                      className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner" 
                      style={{ 
                        background: Array.isArray(categories) && categories.length > 0 
                          ? `conic-gradient(${
                              categories.map((cat: any, i: number, arr: any[]) => {
                                const prevPercentages = arr.slice(0, i).reduce((sum, c) => sum + c.percentage, 0);
                                return `${cat.color || '#4648d4'} ${prevPercentages}% ${prevPercentages + cat.percentage}%`;
                              }).join(', ')
                            })`
                          : 'var(--color-surface-variant)'
                      }}
                    >
                      <div className="absolute w-28 h-28 bg-surface rounded-full flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[10px] text-outline font-bold uppercase tracking-wider">{language === 'id' ? 'Total Keluar' : 'Total Exp'}</span>
                        <span className="font-numeric-data text-lg font-bold text-on-surface">{formatCurrency(breakdown?.totalExpense || 0)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full sm:w-auto overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                      {Array.isArray(categories) ? categories.slice(0, 5).map((cat: any) => (
                        <div key={cat.categoryId} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color || '#4648d4' }}></div>
                            <span className="text-sm text-on-surface-variant font-medium truncate max-w-[120px]">{tCategory(cat.categoryName)}</span>
                          </div>
                          <span className="text-sm font-semibold">{cat.percentage}%</span>
                        </div>
                      )) : null}
                      {(!Array.isArray(categories) || categories.length === 0) && (
                        <p className="text-sm text-outline italic">{language === 'id' ? 'Belum ada pengeluaran' : 'No expenses recorded'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Spending List */}
                <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{language === 'id' ? 'Pengeluaran Terbesar' : 'Top Spending'}</h3>
                    <Link href="/transactions?type=expense" className="text-sm text-primary hover:underline font-bold transition-all">{language === 'id' ? 'Lihat Semua' : 'View All'}</Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {Array.isArray(categories) ? categories.slice(0, 5).map((cat: any) => (
                      <div key={cat.categoryId} className="flex items-center p-3 rounded-lg hover:bg-surface-variant/30 transition-all border border-transparent hover:border-outline-variant/10 group">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${cat.color || '#4648d4'}15`, color: cat.color || '#4648d4' }}
                        >
                          <span className="material-symbols-outlined text-[20px]">{cat.categoryIcon || 'category'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-on-surface">{tCategory(cat.categoryName)}</div>
                          <div className="text-[10px] text-outline uppercase tracking-wider font-bold">{language === 'id' ? 'Kategori utama' : 'Top category'}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-numeric-data font-bold text-on-surface">{formatCurrency(cat.amount)}</span>
                          <span className="text-xs font-semibold text-outline">{cat.percentage}%</span>
                        </div>
                      </div>
                    )) : null}
                    {(!Array.isArray(categories) || categories.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-10 text-outline gap-2">
                        <span className="material-symbols-outlined text-4xl">receipt_long</span>
                        <p className="text-sm">{language === 'id' ? 'Tidak ada data pengeluaran' : 'No spending data found'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <BottomNav activePath="/analytics" />
    </div>
  );
}
