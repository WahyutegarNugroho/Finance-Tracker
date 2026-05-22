"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Budget } from "@/types";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(false);

  // Form State
  const [limitAmount, setLimitAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const formatWithDots = useCallback((val: string) => {
    const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";
    
    if (isDecimalAllowed) {
      // Normalize and split integer and decimal parts
      let cleaned = val.replace(/,/g, ".").replace(/[^0-9.]/g, "");
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }
      
      const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const formattedDec = parts[1] !== undefined ? "." + parts[1] : "";
      return formattedInt + formattedDec;
    } else {
      return val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }, [currency]);

  const fetchCategories = useCallback(async () => {
    setFetchingCats(true);
    try {
      const response = await api.get("/categories");
      const rawData = response?.data;
      const expenseCats = Array.isArray(rawData) 
        ? rawData.filter((c: Category) => c.type === "expense")
        : [];
      setCategories(expenseCats);
      if (!budgetToEdit && expenseCats.length > 0) {
        setCategoryId(expenseCats[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setFetchingCats(false);
    }
  }, [budgetToEdit]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchCategories();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
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
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, budgetToEdit, formatWithDots]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";
    let inputVal = e.target.value;
    
    if (isDecimalAllowed) {
      inputVal = inputVal.replace(/,/g, ".");
      let cleaned = inputVal.replace(/[^0-9.]/g, "");
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }
      
      setLimitAmount(cleaned);
      setDisplayAmount(formatWithDots(cleaned));
    } else {
      const raw = inputVal.replace(/\D/g, "");
      setLimitAmount(raw);
      setDisplayAmount(formatWithDots(raw));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitAmount || !categoryId) return;

    setLoading(true);
    try {
      const selectedCategory = Array.isArray(categories) ? categories.find((c) => c.id === categoryId) : null;
      const payload = {
        limitAmount: parseFloat(limitAmount),
        categoryId,
        categoryName: selectedCategory?.name || "Unknown",
        categoryIcon: selectedCategory?.icon || "category",
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
      };

      if (budgetToEdit) {
        await api.put(`/budgets/${budgetToEdit.id}`, payload);
      } else {
        await api.post("/budgets", payload);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save budget", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((err as any).response?.data?.message || "Failed to save budget.");
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
