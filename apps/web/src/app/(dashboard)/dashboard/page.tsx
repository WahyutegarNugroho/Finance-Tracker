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

  if (queryError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 rounded-3xl bg-[#FEE2E2] text-[#991B1B] border-2 border-[#08110A] shadow-[4px_4px_0px_#08110A] flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl font-bold">cloud_off</span>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#08110A] dark:text-white">
            {t("dashboard_page.load_error")}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70">
            {queryError instanceof Error ? queryError.message : "Gagal memuat data dari server API."}
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          className="min-h-[44px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider px-6 py-3 rounded-full border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">refresh</span>
          <span>{t("error_page.try_again")}</span>
        </button>
      </div>
    );
  }

  const isDataEmpty = !data || (
    data.recentTransactions?.length === 0 && 
    data.income === 0 && 
    data.expense === 0 && 
    data.balance === 0
  );

  if (isDataEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 rounded-3xl bg-[#39E75F] text-[#08110A] border-2 border-[#08110A] shadow-[4px_4px_0px_#08110A] flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl font-bold">account_balance_wallet</span>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#08110A] dark:text-white">
            {t("dashboard_page.no_data")}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70">
            {t("dashboard_page.no_data_desc")}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="min-h-[44px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider px-6 py-3 rounded-full border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          <span>{t("dashboard_page.new_transaction")}</span>
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
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border-2 border-[#08110A] bg-[#39E75F] text-[#08110A] font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_#08110A]">
              {language === "id" ? "RINGKASAN AKTIF" : "ACTIVE OVERVIEW"}
            </span>
            <span className="font-mono text-xs font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60">
              {new Date().toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("dashboard_page.title")}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70 mt-0.5">
            {t("dashboard_page.welcome")}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="min-h-[44px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider px-5 py-2.5 rounded-full border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] font-bold">add</span>
          <span>{t("dashboard_page.new_transaction")}</span>
        </button>
      </div>

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
