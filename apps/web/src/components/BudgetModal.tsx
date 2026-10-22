"use client";

import React, { useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Budget, Category, ApiResponse } from "@/types";
import { formatAmount, cleanAmount } from "@/lib/formatting";
import Dialog from "@/components/ui/Dialog";

interface BudgetPayload {
  limitAmount: number;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  month: number;
  year: number;
}

type BudgetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: Budget | null;
  month?: number;
  year?: number;
};

function initForm(budgetToEdit: Budget | null | undefined, firstCategoryId: string) {
  if (budgetToEdit) {
    return {
      limitAmount: budgetToEdit.limitAmount.toString(),
      displayAmount: budgetToEdit.limitAmount.toString(),
      categoryId: budgetToEdit.categoryId,
    };
  }
  return {
    limitAmount: "",
    displayAmount: "",
    categoryId: firstCategoryId,
  };
}

export default function BudgetModal({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit,
  month,
  year,
}: BudgetModalProps) {
  const { currencySymbol, currency } = useAuth();
  const { t, tCategory } = useLanguage();
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading: fetchingCats } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
    enabled: isOpen,
  });

  const categories = useMemo(() => {
    const all = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
    return all.filter((c: Category) => c.type === "expense");
  }, [categoriesData]);

  const [form, setForm] = useState(() => initForm(budgetToEdit, ""));

  const resolvedCategoryId =
    form.categoryId || (!fetchingCats && categories.length > 0 ? categories[0].id : "");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanAmount(e.target.value, currency);
    setForm((f) => ({ ...f, limitAmount: cleaned, displayAmount: formatAmount(cleaned, currency) }));
  };

  const saveMutation = useMutation({
    mutationFn: (payload: BudgetPayload) => {
      if (budgetToEdit) {
        return api.put(`/budgets/${budgetToEdit.id}`, payload);
      }
      return api.post("/budgets", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-summary"] });
      toast.success(
        budgetToEdit ? t("budget_page.updated_success") : t("budget_page.created_success")
      );
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error(t("budget_page.save_error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.limitAmount || !resolvedCategoryId) return;

    const selectedCategory = categories.find((c) => c.id === resolvedCategoryId) || null;
    const payload = {
      limitAmount: parseFloat(form.limitAmount),
      categoryId: resolvedCategoryId,
      categoryName: selectedCategory?.name || "Unknown",
      categoryIcon: selectedCategory?.icon || "category",
      month: month ?? new Date().getMonth() + 1,
      year: year ?? new Date().getFullYear(),
    };

    saveMutation.mutate(payload);
  };

  return (
    <Dialog
      key={budgetToEdit?.id || "new"}
      isOpen={isOpen}
      onClose={onClose}
      titleId="budget-modal-title"
    >
      <div className="flex justify-between items-center p-6 border-b-2 border-[#08110A]/10 dark:border-white/10">
        <h2
          id="budget-modal-title"
          className="font-display font-black text-xl uppercase tracking-tight text-[#08110A] dark:text-white"
        >
          {budgetToEdit ? t("common.edit") : t("budget_page.create_new")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.cancel")}
          className="w-9 h-9 rounded-full border-2 border-[#08110A] dark:border-white/20 hover:bg-[#FAF8F5] dark:hover:bg-white/10 flex items-center justify-center text-[#08110A] dark:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        <div>
          <label htmlFor="budget-category" className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] mb-1">
            {t("transactions_page.table.category")}
          </label>
          <select
            id="budget-category"
            required
            value={resolvedCategoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            disabled={fetchingCats || !!budgetToEdit}
            className="w-full px-4 py-3 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-xl font-sans text-xs sm:text-sm font-bold text-[#08110A] dark:text-white focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1 outline-none transition-all shadow-[2px_2px_0px_#08110A] appearance-none disabled:opacity-50"
          >
            {fetchingCats ? (
              <option>{t("common.loading")}</option>
            ) : (
              categories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {tCategory(c.name)}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="budget-limit" className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] mb-1">
            {t("budget_page.limit_label")}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/50 dark:text-[#F5EFE6]/50 font-mono font-bold text-sm">
              {currencySymbol}
            </span>
            <input
              id="budget-limit"
              type="text"
              inputMode="numeric"
              required
              value={form.displayAmount}
              onChange={handleAmountChange}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-xl font-mono text-sm text-[#08110A] dark:text-white placeholder:text-[#08110A]/40 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1 outline-none transition-all shadow-[2px_2px_0px_#08110A]"
              placeholder="0"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full min-h-[48px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-full border-2 border-[#08110A] shadow-[4px_4px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
            ) : budgetToEdit ? (
              t("common.save")
            ) : (
              t("budget_page.create_new")
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
