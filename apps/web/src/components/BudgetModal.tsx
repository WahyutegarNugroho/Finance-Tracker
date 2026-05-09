"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

type Category = {
  id: string;
  name: string;
  icon: string;
  type: string;
};

type BudgetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: any;
};

export default function BudgetModal({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit,
}: BudgetModalProps) {
  const { currencySymbol } = useAuth();
  const { t, tCategory } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(false);

  // Form State
  const [limitAmount, setLimitAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const formatWithDots = (val: string) => {
    return val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (budgetToEdit) {
        const amtStr = budgetToEdit.limitAmount.toString();
        setLimitAmount(amtStr);
        setDisplayAmount(formatWithDots(amtStr));
        setCategoryId(budgetToEdit.categoryId);
      } else {
        setLimitAmount("");
        setDisplayAmount("");
        setCategoryId("");
      }
    }
  }, [isOpen, budgetToEdit]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setLimitAmount(raw);
    setDisplayAmount(formatWithDots(raw));
  };

  const fetchCategories = async () => {
    setFetchingCats(true);
    try {
      const response = await api.get("/categories");
      // Only expense categories make sense for budgets
      const expenseCats = (response.data || []).filter((c: any) => c.type === "expense");
      setCategories(expenseCats);
      if (!budgetToEdit && expenseCats.length > 0) {
        setCategoryId(expenseCats[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setFetchingCats(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitAmount || !categoryId) return;

    setLoading(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const payload = {
        limitAmount: parseFloat(limitAmount),
        categoryId,
        categoryName: selectedCategory?.name || "Unknown",
        categoryIcon: selectedCategory?.icon || "category",
      };

      if (budgetToEdit) {
        await api.put(`/budgets/${budgetToEdit.id}`, payload);
      } else {
        await api.post("/budgets", payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save budget", err);
      alert(err.response?.data?.message || "Failed to save budget.");
    } finally {
      setLoading(false);
    }
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
              ) : (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {tCategory(c.name)}
                  </option>
                ))
              )}
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
              disabled={loading}
              className="w-full bg-primary text-on-primary font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
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
