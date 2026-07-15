"use client";

import React, { useState, useMemo, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Budget, Category, ApiResponse } from "@/types";
import { formatAmount, cleanAmount } from "@/lib/formatting";

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

  const resolvedCategoryId = form.categoryId ||
    (!fetchingCats && categories.length > 0 ? categories[0].id : "");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanAmount(e.target.value, currency);
    setForm(f => ({ ...f, limitAmount: cleaned, displayAmount: formatAmount(cleaned, currency) }));
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
      toast.success(budgetToEdit ? t("budget_page.updated_success") : t("budget_page.created_success"));
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error(t("budget_page.save_error"));
    }
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

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div key={budgetToEdit?.id || 'new'} role="dialog" aria-modal="true" aria-label={budgetToEdit ? t("common.edit") : t("budget_page.create_new")} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/20">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
          <h2 className="font-headline-md text-headline-md font-bold text-on-background">
            {budgetToEdit ? t("common.edit") : t("budget_page.create_new")}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("transactions_page.table.category")}
            </label>
            <select
              required
              value={resolvedCategoryId}
              onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}
              disabled={fetchingCats || !!budgetToEdit}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none disabled:opacity-50"
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
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("budget_page.limit_label")}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                {currencySymbol}
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={form.displayAmount}
                onChange={handleAmountChange}
                className="w-full pl-8 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-primary text-on-primary font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
            >
              {saveMutation.isPending ? (
                <span className="material-symbols-outlined animate-spin">
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
      </div>
    </div>
  );
}
