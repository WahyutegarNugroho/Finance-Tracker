"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import TransactionModal from "@/components/TransactionModal";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";



// Formatter for relative time or date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

export default function Dashboard() {
  const { user, loading: authLoading, formatCurrency } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get("/analytics/overview");
      setData(response.data);
    } catch (err: any) {
      setError("Failed to load dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-background text-on-background font-body-sm min-h-screen">
      <Topbar />
      <Sidebar activePath="/dashboard" />

      {/* Main Content Canvas */}
      <main className="pt-[88px] pb-[88px] md:pb-8 md:pl-[284px] pr-4 md:pr-8 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-1">
                Dashboard
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Welcome back, here's your financial overview.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Transaction
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-error-container text-error rounded-xl">
              {error}
            </div>
          )}

          {/* Summary Cards (Bento Layout Top Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Balance */}
            <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <p className="font-label-caps text-label-caps text-outline">
                  Total Balance
                </p>
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">
                    account_balance_wallet
                  </span>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline-lg text-headline-lg text-on-surface">
                  {formatCurrency(data.balance)}
                </h3>
                <div className={`flex items-center gap-1 mt-2 ${data.balanceChange >= 0 ? "text-secondary" : "text-error"}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {data.balanceChange >= 0 ? "arrow_upward" : "arrow_downward"}
                  </span>
                  <span className="font-numeric-data text-numeric-data text-sm">
                    {Math.abs(data.balanceChange)}%
                  </span>
                  <span className="font-label-caps text-label-caps text-outline ml-1 normal-case">
                    vs last month
                  </span>
                </div>
              </div>
            </div>

            {/* Income */}
            <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-caps text-label-caps text-outline">
                  Income
                </p>
                <div className="p-2 bg-secondary-container text-secondary rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">
                    south_west
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {formatCurrency(data.income)}
                </h3>
                <div className={`flex items-center gap-1 mt-2 ${data.incomeChange >= 0 ? "text-secondary" : "text-error"}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {data.incomeChange >= 0 ? "arrow_upward" : "arrow_downward"}
                  </span>
                  <span className="font-numeric-data text-numeric-data text-sm">
                    {Math.abs(data.incomeChange)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Expense */}
            <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-caps text-label-caps text-outline">
                  Expense
                </p>
                <div className="p-2 bg-error-container text-error rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">
                    north_east
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {formatCurrency(data.expense)}
                </h3>
                <div className={`flex items-center gap-1 mt-2 ${data.expenseChange <= 0 ? "text-secondary" : "text-error"}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {data.expenseChange >= 0 ? "arrow_upward" : "arrow_downward"}
                  </span>
                  <span className="font-numeric-data text-numeric-data text-sm">
                    {Math.abs(data.expenseChange)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Usage */}
            <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-caps text-label-caps text-outline">
                  Budget Usage
                </p>
                <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">
                    pie_chart
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    {data.budgetUsage}%
                  </h3>
                  <p className="font-body-sm text-body-sm text-outline pb-0.5">
                    of {formatCurrency(data.budgetLimit)}
                  </p>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className={`${data.budgetUsage > 90 ? 'bg-error' : data.budgetUsage > 75 ? 'bg-tertiary' : 'bg-primary'} h-2 rounded-full`}
                    style={{ width: `${Math.min(data.budgetUsage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Chart: Income vs Expense */}
            <div className="glass-card rounded-xl p-6 lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Cash Flow
                </h3>
                <select className="bg-transparent border-none text-on-surface-variant font-body-sm text-body-sm focus:ring-0 cursor-pointer pr-8 outline-none">
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              {/* Chart Placeholder Layout (CSS simulated) */}
              <div className="flex-1 min-h-[240px] relative flex items-end gap-4 px-2 pb-6 pt-10 border-b border-l border-outline-variant/30">
                {/* Y Axis labels */}
                <div className="absolute left-[-40px] h-full flex flex-col justify-between text-label-caps text-outline py-6 pb-8">
                  <span>10M</span>
                  <span>5M</span>
                  <span>0</span>
                </div>
                {/* Grid lines */}
                <div className="absolute left-0 top-10 w-full border-t border-dashed border-outline-variant/20"></div>
                <div className="absolute left-0 top-[50%] w-full border-t border-dashed border-outline-variant/20"></div>
                {/* Bar groups */}
                <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
                  <div className="w-1/3 bg-secondary-container h-[40%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/3 bg-error-container h-[20%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 text-label-caps text-outline">
                    Jan
                  </span>
                </div>
                <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
                  <div className="w-1/3 bg-secondary-container h-[50%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/3 bg-error-container h-[30%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 text-label-caps text-outline">
                    Feb
                  </span>
                </div>
                <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
                  <div className="w-1/3 bg-secondary-container h-[70%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/3 bg-error-container h-[45%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 text-label-caps text-outline">
                    Mar
                  </span>
                </div>
                <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
                  <div className="w-1/3 bg-secondary-container h-[60%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/3 bg-error-container h-[35%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 text-label-caps text-outline">
                    Apr
                  </span>
                </div>
                <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
                  <div className="w-1/3 bg-secondary-container h-[85%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/3 bg-error-container h-[50%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 text-label-caps text-outline text-primary font-bold">
                    May
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Income
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error-container"></div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Expense
                  </span>
                </div>
              </div>
            </div>

            {/* Doughnut Chart: Spending by Category */}
            <div className="glass-card rounded-xl p-6 flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
                Spending by Category
              </h3>
              {/* CSS Doughnut visualization */}
              <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
                <div
                  className="w-40 h-40 rounded-full border-[16px] border-surface-variant relative overflow-hidden"
                  style={{
                    borderColor: "#efecf8",
                    borderRightColor: "#4648d4",
                    borderBottomColor: "#6cf8bb",
                    borderLeftColor: "#ffb95f",
                    transform: "rotate(45deg)",
                  }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-label-caps text-label-caps text-outline">
                    Total
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1">
                    {formatCurrency(data.expense)}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Food & Dining
                    </span>
                  </div>
                  <span className="font-numeric-data text-numeric-data text-on-surface text-sm">
                    45%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Transportation
                    </span>
                  </div>
                  <span className="font-numeric-data text-numeric-data text-on-surface text-sm">
                    30%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Groceries
                    </span>
                  </div>
                  <span className="font-numeric-data text-numeric-data text-on-surface text-sm">
                    25%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Recent Transactions
              </h3>
              <a
                className="text-primary hover:text-primary-container font-label-caps text-label-caps transition-colors"
                href="/transactions"
              >
                View All
              </a>
            </div>
            <div className="flex flex-col gap-2">
              {data.recentTransactions?.length === 0 ? (
                <div className="text-center py-6 text-on-surface-variant">
                  No recent transactions found.
                </div>
              ) : (
                data.recentTransactions?.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-surface-variant/30 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        tx.type === 'income' 
                          ? 'bg-secondary-container/20 text-secondary border-secondary/20' 
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                      }`}>
                        <span className="material-symbols-outlined">
                          {tx.categoryIcon || (tx.type === 'income' ? 'payments' : 'receipt')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {tx.note || tx.categoryName}
                        </h4>
                        <p className="font-label-caps text-label-caps text-outline mt-1">
                          {tx.categoryName} • {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-numeric-data text-numeric-data ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav activePath="/dashboard" />

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
}
