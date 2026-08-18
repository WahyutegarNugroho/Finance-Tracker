"use client";

import React, { useState } from "react";
import TransactionModal from "@/components/TransactionModal";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatShortDate } from "@/lib/formatting";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dashboardData, isLoading: dashboardLoading, error: queryError, refetch } = useQuery({
    queryKey: ["dashboard-overview", user?.uid],
    queryFn: () => api.get("/analytics/overview"),
    staleTime: 30 * 1000,
    enabled: !!user,
  });

  const data = dashboardData?.data;

  if (authLoading || dashboardLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          className="bg-primary hover:bg-primary/90 text-on-primary font-body-sm text-body-sm px-6 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:outline-none transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t("dashboard_page.new_transaction")}
        </button>
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
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
          className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm px-4 py-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:outline-none transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t("dashboard_page.new_transaction")}
        </button>
      </div>

      {queryError && (
        <div className="mb-4 p-4 bg-error-container text-error rounded-xl flex items-center justify-between gap-4">
          <span>{t("dashboard_page.load_error")}</span>
          <button
            onClick={() => refetch()}
            className="bg-error text-on-error px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-error/90 focus-visible:ring-2 focus-visible:ring-error/45 focus-visible:outline-none transition-colors shrink-0"
          >
            {t("error_page.try_again")}
          </button>
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
        formatDate={(d) => formatShortDate(d, language)} 
      />

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
