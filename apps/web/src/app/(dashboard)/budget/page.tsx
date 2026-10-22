"use client";

import React, { useState } from "react";
import BudgetModal from "@/components/BudgetModal";
import BudgetSkeleton from "@/components/budget/BudgetSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse, BudgetWithSpent } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Budget() {
  const { user, formatCurrency } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetWithSpent | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const shiftMonth = (delta: number) => {
    setSelectedMonth((m) => {
      if (m + delta > 12) {
        setSelectedYear((y) => y + 1);
        return 1;
      }
      if (m + delta < 1) {
        setSelectedYear((y) => y - 1);
        return 12;
      }
      return m + delta;
    });
  };

  const getMonthName = (m: number) =>
    new Intl.DateTimeFormat(language === "id" ? "id" : "en", { month: "long" }).format(
      new Date(2024, m - 1)
    );

  const { data: budgetsData, isLoading: budgetsLoading, isError: budgetsError } = useQuery<
    ApiResponse<BudgetWithSpent[]>
  >({
    queryKey: ["budgets", selectedMonth, selectedYear],
    queryFn: () => api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`),
    staleTime: 2 * 60 * 1000,
    enabled: !!user,
  });

  const { data: summaryData, isLoading: summaryLoading, isError: summaryError } = useQuery<
    ApiResponse<{
      totalBudget: number;
      totalSpent: number;
      totalRemaining: number;
      overallPercentage: number;
      categoryCount: number;
    }>
  >({
    queryKey: ["budgets-summary", selectedMonth, selectedYear],
    queryFn: () => api.get(`/budgets/summary?month=${selectedMonth}&year=${selectedYear}`),
    staleTime: 2 * 60 * 1000,
    enabled: !!user,
  });

  const budgets = budgetsData?.data || [];
  const summary = summaryData?.data;
  const loading = budgetsLoading || summaryLoading;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/budgets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-summary"] });
      toast.success(t("budget_page.delete_success"));
    },
    onError: () => toast.error(t("budget_page.delete_error")),
  });

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (budgetToDelete) deleteMutation.mutate(budgetToDelete);
    setIsConfirmOpen(false);
    setBudgetToDelete(null);
  };

  if (loading) return <BudgetSkeleton />;

  const now = new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysRemaining = isCurrentMonth ? Math.max(0, daysInMonth - now.getDate()) : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {(budgetsError || summaryError) && (
        <div className="mb-4 p-4 bg-error-container/50 text-error rounded-xl border border-error/20">
          {t("dashboard_page.load_error")}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border-2 border-[#08110A] bg-[#FDE047] text-[#08110A] font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_#08110A]">
              {language === "id" ? "BATAS PENGELUARAN" : "SPENDING LIMITS"}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("budget_page.title")}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70 mt-1">
            {t("budget_page.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-full p-1.5 shadow-[2px_2px_0px_#08110A]">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-[#08110A] dark:text-[#F5EFE6] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-mono font-black text-xs px-2 text-[#08110A] dark:text-white min-w-[100px] text-center uppercase">
              {getMonthName(selectedMonth)} {selectedYear}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-[#08110A] dark:text-[#F5EFE6] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setBudgetToEdit(null);
              setIsModalOpen(true);
            }}
            className="min-h-[44px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider px-6 py-2.5 rounded-full border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">add</span>
            {t("budget_page.create_new")}
          </button>
        </div>
      </div>

      {summary && (
        <section className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-display font-black text-xs uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70">
                  {t("budget_page.total_monthly_budget")}
                </h2>
                {daysRemaining !== null && (
                  <span className="bg-[#39E75F] text-[#08110A] border border-[#08110A] text-[10px] px-2.5 py-0.5 rounded-full font-mono font-black shadow-[1px_1px_0px_#08110A]">
                    {daysRemaining} {t("budget_page.days_left")}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl text-[#08110A] dark:text-white font-black">
                  {formatCurrency(summary.totalSpent)}
                </span>
                <span className="font-mono text-sm sm:text-base text-[#08110A]/60 dark:text-[#F5EFE6]/60 font-bold">
                  / {formatCurrency(summary.totalBudget)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="font-display font-black text-xs text-[#08110A]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider">
                  {t("budget_page.remaining_label")}
                </span>
                <span className="font-display text-2xl font-black text-[#166534] dark:text-[#39E75F]">
                  {formatCurrency(summary.totalRemaining)}
                </span>
              </div>
              <div className="h-10 w-[2px] bg-[#08110A]/15 dark:bg-white/15"></div>
              <div className="flex flex-col items-end">
                <span className="font-display font-black text-xs text-[#08110A]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider">
                  {t("budget_page.spent_label")}
                </span>
                <span className="font-display text-2xl font-black text-[#08110A] dark:text-white">
                  {summary.overallPercentage}%
                </span>
              </div>
            </div>
          </div>
          <div className="relative w-full h-4 bg-[#FAF8F5] dark:bg-white/10 rounded-full overflow-hidden border-2 border-[#08110A] dark:border-white/20 p-0.5 z-10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                summary.overallPercentage >= 95
                  ? "bg-[#EF4444]"
                  : summary.overallPercentage >= 75
                  ? "bg-[#FB923C]"
                  : "bg-[#39E75F]"
              }`}
              style={{ width: `${Math.min(100, summary.overallPercentage)}%` }}
            ></div>
          </div>
        </section>
      )}

      <div className="mb-4">
        <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white">
          {t("budget_page.category_breakdown")}
        </h3>
      </div>

      {!Array.isArray(budgets) || budgets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#0D1910] rounded-3xl border-2 border-[#08110A] dark:border-white/20 shadow-[3px_3px_0px_#08110A]">
          <span className="material-symbols-outlined text-4xl text-[#08110A]/40 dark:text-white/40 mb-2">
            account_balance_wallet
          </span>
          <p className="font-mono text-xs font-bold text-[#08110A]/70 dark:text-[#F5EFE6]/70">{t("budget_page.no_budgets")}</p>
          <button
            type="button"
            onClick={() => {
              setBudgetToEdit(null);
              setIsModalOpen(true);
            }}
            className="mt-4 font-mono text-xs font-black uppercase text-[#08110A] dark:text-[#39E75F] underline underline-offset-4 decoration-2 cursor-pointer"
          >
            {t("budget_page.create_first")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {budgets.map((b) => {
            let statusColor = "text-[#166534] dark:text-[#39E75F]",
              bgColor = "bg-[#39E75F]",
              bgContainer = "bg-[#39E75F] text-[#08110A]";
            if (b.status === "critical") {
              statusColor = "text-[#991B1B] dark:text-[#EF4444]";
              bgColor = "bg-[#EF4444]";
              bgContainer = "bg-[#EF4444] text-white";
            } else if (b.status === "warning") {
              statusColor = "text-[#C2410C] dark:text-[#FB923C]";
              bgColor = "bg-[#FB923C]";
              bgContainer = "bg-[#FB923C] text-[#08110A]";
            }

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(57,231,95,0.25)] rounded-3xl p-5 transition-transform hover:-translate-y-0.5 flex flex-col justify-between h-48 relative overflow-hidden group"
              >
                
                <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-20 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBudgetToEdit(b);
                      setIsModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-full border border-[#08110A] bg-white dark:bg-[#08110A] hover:bg-[#FAF8F5] dark:hover:bg-white/10 text-[#08110A] dark:text-white transition-colors cursor-pointer flex items-center justify-center shadow-[1px_1px_0px_#08110A]"
                    aria-label={`${t("budget_page.edit_budget")}: ${tCategory(b.categoryName)}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(b.id)}
                    className="w-8 h-8 rounded-full border border-[#08110A] bg-white dark:bg-[#08110A] hover:bg-[#FEE2E2] text-[#991B1B] transition-colors cursor-pointer flex items-center justify-center shadow-[1px_1px_0px_#08110A]"
                    aria-label={`${t("budget_page.delete_budget")}: ${tCategory(b.categoryName)}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl border-2 border-[#08110A] ${bgContainer} flex items-center justify-center shadow-[1px_1px_0px_#08110A] font-bold`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {b.categoryIcon || "category"}
                      </span>
                    </div>
                    <span className="font-sans text-sm font-bold text-[#08110A] dark:text-white truncate pr-8">
                      {tCategory(b.categoryName)}
                    </span>
                  </div>
                </div>
                <div className="mt-auto relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-xs font-bold text-[#08110A] dark:text-white">
                      {formatCurrency(b.spent)}{" "}
                      <span className="text-[#08110A]/50 dark:text-[#F5EFE6]/50 font-normal text-[10px]">
                        / {formatCurrency(b.limitAmount)}
                      </span>
                    </span>
                    <span className={`font-mono font-black text-xs ${statusColor}`}>
                      {b.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FAF8F5] dark:bg-white/10 rounded-full overflow-hidden border border-[#08110A]/20 dark:border-white/20">
                    <div
                      className={`h-full ${bgColor} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    ></div>
                  </div>
                  {b.status === "critical" && (
                    <p className="font-mono text-[10px] font-bold text-[#991B1B] dark:text-[#EF4444] mt-1.5">
                      {b.spent > b.limitAmount
                        ? t("budget_page.over_by")
                          ? t("budget_page.over_by").replace(
                              "{amount}",
                              formatCurrency(b.spent - b.limitAmount)
                            )
                          : language === "id"
                          ? `Melebihi anggaran ${formatCurrency(b.spent - b.limitAmount)}`
                          : `Over budget by ${formatCurrency(b.spent - b.limitAmount)}`
                        : t("budget_page.only_remaining").replace(
                            "{remaining}",
                            formatCurrency(b.remaining)
                          )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: ["budgets", selectedMonth, selectedYear],
          });
          queryClient.invalidateQueries({
            queryKey: ["budgets-summary", selectedMonth, selectedYear],
          });
        }}
        budgetToEdit={budgetToEdit}
        month={selectedMonth}
        year={selectedYear}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t("budget_page.delete_title")}
        message={t("budget_page.delete_message")}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setBudgetToDelete(null);
        }}
      />
    </div>
  );
}
