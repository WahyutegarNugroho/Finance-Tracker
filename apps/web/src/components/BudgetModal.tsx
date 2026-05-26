"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Budget, Category, ApiResponse } from "@/types";
import { formatWithDots, cleanAmountInput } from "@/lib/formatting";

type BudgetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: Budget | null;
  month?: number;
  year?: number;
};

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

  // Form State
  const [limitAmount, setLimitAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: categoriesData, isLoading: fetchingCats } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
    enabled: isOpen,
  });

  const allCategories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const categories = allCategories.filter((c: Category) => c.type === "expense");

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (budgetToEdit) {
          const amtStr = budgetToEdit.limitAmount.toString();
          setLimitAmount(amtStr);
          setDisplayAmount(formatWithDots(amtStr, currency));
          setCategoryId(budgetToEdit.categoryId);
        } else {
          setLimitAmount("");
          setDisplayAmount("");
          if (categories.length > 0) {
            setCategoryId(categories[0].id);
          } else {
            setCategoryId("");
          }
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, budgetToEdit, currency]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanAmountInput(e.target.value, currency);
    setLimitAmount(cleaned);
    setDisplayAmount(formatWithDots(cleaned, currency));
  };

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => {
      if (budgetToEdit) {
        return api.put(`/budgets/${budgetToEdit.id}`, payload);
      }
      return api.post("/budgets", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-summary"] });
      toast.success(budgetToEdit ? "Budget updated!" : "Budget created!");
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error("Failed to save budget.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitAmount || !categoryId) return;

    const selectedCategory = categories.find((c) => c.id === categoryId) || null;
    const payload = {
      limitAmount: parseFloat(limitAmount),
      categoryId,
      categoryName: selectedCategory?.name || "Unknown",
      categoryIcon: selectedCategory?.icon || "category",
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
    };

    saveMutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={fetchingCats || !!budgetToEdit} // Do not allow changing category when editing
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none disabled:opacity-50"
            >
              {fetchingCats ? (
                <option>{t("common.loading")}</option>
              ) : Array.isArray(categories) ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {tCategory(c.name)}
                  </option>
                ))
              ) : null}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("budget_page.title")}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                {currencySymbol}
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={displayAmount}
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
