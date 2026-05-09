"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Analytics() {
  const { formatCurrency } = useAuth();
  const { language, t } = useLanguage();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/transactions", { params: { limit: 1000 } });
        setTransactions(response.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate Stats
  const stats = useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        savings: 0,
        categories: [],
        monthlyTrend: []
      };
    }

    let income = 0;
    let expense = 0;
    const categoryMap: Record<string, any> = {};
    const monthlyMap: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      const date = new Date(tx.date);
      const monthKey = date.toLocaleString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short' });

      // Monthly Trend
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }

      if (tx.type === "income") {
        income += amount;
        monthlyMap[monthKey].income += amount;
      } else {
        expense += amount;
        monthlyMap[monthKey].expense += amount;

        // Category Breakdown
        if (!categoryMap[tx.categoryId]) {
          categoryMap[tx.categoryId] = {
            name: tx.categoryName,
            icon: tx.categoryIcon || 'category',
            amount: 0,
            color: tx.categoryColor || '#4648d4'
          };
        }
        categoryMap[tx.categoryId].amount += amount;
      }
    });

    const categories = Object.values(categoryMap)
      .sort((a, b) => b.amount - a.amount)
      .map(cat => ({
        ...cat,
        percentage: expense > 0 ? Math.round((cat.amount / expense) * 100) : 0
      }));

    // Generate last 5 months for trend or all months present
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTrend = Object.keys(monthlyMap)
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .map(m => ({
        month: m,
        ...monthlyMap[m]
      }));

    return {
      totalIncome: income,
      totalExpense: expense,
      savings: income - expense,
      categories,
      monthlyTrend
    };
  }, [transactions]);

  // Chart Logic Helpers
  const maxVal = Math.max(...stats.monthlyTrend.map(m => Math.max(m.income, m.expense)), 1000);
  const getPoint = (val: number, index: number, total: number) => {
    const x = (index / (total - 1 || 1)) * 100;
    const y = 50 - (val / maxVal) * 45; // Map to SVG viewBox 0-50
    return `${x},${y}`;
  };

  const incomePath = stats.monthlyTrend.length > 1
    ? `M${stats.monthlyTrend.map((m, i) => getPoint(m.income, i, stats.monthlyTrend.length)).join(' L')}`
    : "";

  const expensePath = stats.monthlyTrend.length > 1
    ? `M${stats.monthlyTrend.map((m, i) => getPoint(m.expense, i, stats.monthlyTrend.length)).join(' L')}`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          <p className="text-outline animate-pulse">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-on-background font-body-lg min-h-screen bg-background">
      <Topbar />
      <Sidebar activePath="/analytics" />

      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full flex flex-col">
        <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 md:gap-8">
          <div className="flex justify-between items-center md:hidden mb-2">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">{t("analytics_page.title")}</h1>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{t("analytics_page.summary.total_income")}</span>
                <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-lg">trending_up</span>
                </div>
              </div>
              <div className="font-numeric-data text-[28px] font-semibold text-on-surface">
                {formatCurrency(stats.totalIncome)}
              </div>
              <div className="text-sm text-secondary font-medium flex items-center gap-1">
                All time record
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Expense</span>
                <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-lg">trending_down</span>
                </div>
              </div>
              <div className="font-numeric-data text-[28px] font-semibold text-on-surface">
                {formatCurrency(stats.totalExpense)}
              </div>
              <div className="text-sm text-error font-medium flex items-center gap-1">
                Cumulative spending
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Net Savings</span>
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">savings</span>
                </div>
              </div>
              <div className="font-numeric-data text-[28px] font-bold text-primary relative z-10">
                {formatCurrency(stats.savings)}
              </div>
              <div className="text-sm text-secondary font-medium flex items-center gap-1 relative z-10">
                Current balance
              </div>
            </div>
          </section>

          <section className="glass-card rounded-xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Income vs Expense Trend</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-on-surface-variant">Income</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <span className="text-on-surface-variant">Expense</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[300px] relative mt-4 border-l border-b border-outline-variant/30 pb-6 pl-4 flex items-end">
              <div className="absolute left-[-35px] top-0 h-[calc(100%-24px)] flex flex-col justify-between text-[10px] text-outline-variant pb-0">
                <span>{formatCurrency(maxVal)}</span>
                <span>{formatCurrency(maxVal * 0.75)}</span>
                <span>{formatCurrency(maxVal * 0.5)}</span>
                <span>{formatCurrency(maxVal * 0.25)}</span>
                <span>0</span>
              </div>
              
              <div className="absolute bottom-[-24px] left-4 w-[calc(100%-16px)] flex justify-between text-xs text-outline-variant pr-4">
                {stats.monthlyTrend.length > 0 ? (
                  stats.monthlyTrend.map(m => <span key={m.month}>{m.month}</span>)
                ) : (
                  <span>No data yet</span>
                )}
              </div>

              {/* Trend Lines */}
              {stats.monthlyTrend.length > 1 && (
                <>
                  <div className="absolute bottom-[24px] left-4 w-[calc(100%-16px)] h-[calc(100%-24px)] z-10 flex items-end pointer-events-none">
                    <svg className="w-full h-full preserve-aspect-ratio-none overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path d={incomePath} fill="none" stroke="var(--color-primary, #4648d4)" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    </svg>
                  </div>
                  <div className="absolute bottom-[24px] left-4 w-[calc(100%-16px)] h-[calc(100%-24px)] z-10 flex items-end pointer-events-none">
                    <svg className="w-full h-full preserve-aspect-ratio-none overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path d={expensePath} fill="none" stroke="var(--color-error, #ba1a1a)" strokeDasharray="4,4" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    </svg>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Category Breakdown</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
                <div 
                  className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner" 
                  style={{ 
                    background: stats.categories.length > 0 
                      ? `conic-gradient(${
                          stats.categories.map((cat, i, arr) => {
                            const prevPercentages = arr.slice(0, i).reduce((sum, c) => sum + c.percentage, 0);
                            return `${cat.color} ${prevPercentages}% ${prevPercentages + cat.percentage}%`;
                          }).join(', ')
                        })`
                      : 'var(--color-surface-variant)'
                  }}
                >
                  <div className="absolute w-28 h-28 bg-surface rounded-full flex flex-col items-center justify-center shadow-sm">
                    <span className="text-xs text-outline font-medium uppercase tracking-wider">Total Exp</span>
                    <span className="font-numeric-data text-lg font-bold text-on-surface">{formatCurrency(stats.totalExpense)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto overflow-y-auto max-h-[160px] pr-2">
                  {stats.categories.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm text-on-surface-variant truncate max-w-[120px]">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium">{cat.percentage}%</span>
                    </div>
                  ))}
                  {stats.categories.length === 0 && (
                    <p className="text-sm text-outline italic">No expenses recorded</p>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Top Spending</h3>
                <Link href="/transactions?type=expense" className="text-sm text-primary hover:underline font-medium">View All</Link>
              </div>
              <div className="flex flex-col gap-3">
                {stats.categories.slice(0, 5).map((cat) => (
                  <div key={cat.name} className="flex items-center p-3 rounded-lg hover:bg-surface-variant/30 transition-colors border border-transparent hover:border-outline-variant/20">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-on-surface">{cat.name}</div>
                      <div className="text-xs text-on-surface-variant">Top category</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-numeric-data font-semibold text-on-surface">{formatCurrency(cat.amount)}</span>
                      <span className="text-xs font-medium text-outline">{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
                {stats.categories.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-outline gap-2">
                    <span className="material-symbols-outlined text-4xl">receipt_long</span>
                    <p>No spending data found</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav activePath="/analytics" />
    </div>
  );
}
