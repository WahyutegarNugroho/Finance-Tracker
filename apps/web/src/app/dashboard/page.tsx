"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import TransactionModal from "@/components/TransactionModal";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { user, loading: authLoading, formatCurrency } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Formatter for relative time or date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Query
  const { data: dashboardData, isLoading: dashboardLoading, error: queryError } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => api.get("/analytics/overview"),
    enabled: !!user,
  });

  const data = dashboardData?.data;

  if (authLoading || dashboardLoading) {
    return (
      <div className="bg-background min-h-screen">
        <Topbar />
        <Sidebar activePath="/dashboard" />
        <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
          <DashboardSkeleton />
        </main>
        <BottomNav activePath="/dashboard" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-background text-on-background font-body-sm min-h-screen">
        <Topbar />
        <Sidebar activePath="/dashboard" />
        <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
          <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-background mb-2">
                {t("dashboard_page.no_data")}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
                {t("dashboard_page.no_data_desc")}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-on-primary font-body-sm text-body-sm px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {t("dashboard_page.new_transaction")}
            </button>
          </div>
        </main>
        <BottomNav activePath="/dashboard" />
        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-sm min-h-screen">
      <Topbar />
      <Sidebar activePath="/dashboard" />

      {/* Main Content Canvas */}
      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
        <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-1">
                {t("dashboard_page.title")}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t("dashboard_page.welcome")}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {t("dashboard_page.new_transaction")}
            </button>
          </div>

          {queryError && (
            <div className="mb-4 p-4 bg-error-container text-error rounded-xl">
              Failed to load dashboard data.
            </div>
          )}

          <SummaryCards data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <CashFlowChart />
            <SpendingChart 
              expenseByCategory={data.expenseByCategory} 
              totalExpense={data.expense} 
            />
          </div>

          <RecentTransactions 
            transactions={data.recentTransactions} 
            formatDate={formatDate} 
          />
        </div>
      </main>

      <BottomNav activePath="/dashboard" />
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
        }}
      />
    </div>
  );
}
