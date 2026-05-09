"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
};

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: any; // If editing, pass the transaction here
};

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
}: TransactionModalProps) {
  const { currencySymbol } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(false);

  // Form State
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setType(transactionToEdit.type);
        setAmount(transactionToEdit.amount.toString());
        setCategoryId(transactionToEdit.categoryId);
        setDate(new Date(transactionToEdit.date).toISOString().split("T")[0]);
        setNote(transactionToEdit.note || "");
      } else {
        // Reset form for new transaction
        setType("expense");
        setAmount("");
        setCategoryId("");
        setDate(new Date().toISOString().split("T")[0]);
        setNote("");
      }
    }
  }, [isOpen, transactionToEdit]);

  const fetchCategories = async () => {
    setFetchingCats(true);
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
      // Auto select first category if not editing
      if (!transactionToEdit && response.data && response.data.length > 0) {
        const defaultCat = response.data.find((c: any) => c.type === type);
        if (defaultCat) setCategoryId(defaultCat.id);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setFetchingCats(false);
    }
  };

  // Change default category when type changes
  useEffect(() => {
    if (!transactionToEdit && categories.length > 0) {
      const defaultCat = categories.find((c) => c.type === type);
      if (defaultCat) setCategoryId(defaultCat.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categories, transactionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !date) return;

    setLoading(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const payload = {
        type,
        amount: parseFloat(amount),
        categoryId,
        categoryName: selectedCategory?.name || "Unknown",
        categoryIcon: selectedCategory?.icon || "category",
        date: new Date(date).toISOString(),
        note,
      };

      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save transaction", err);
      alert("Failed to save transaction.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/20">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
          <h2 className="font-headline-md text-headline-md font-bold text-on-background">
            {transactionToEdit ? t("common.edit") : t("transactions_page.add_new")}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Type Toggle */}
          <div className="flex p-1 bg-surface-variant/30 rounded-xl">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                type === "expense"
                  ? "bg-surface shadow-sm text-error"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t("common.expense")}
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                type === "income"
                  ? "bg-surface shadow-sm text-secondary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t("common.income")}
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("transactions_page.table.amount")}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                {t("transactions_page.table.category")}
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={fetchingCats}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
              >
                {fetchingCats ? (
                  <option>{t("common.loading")}</option>
                ) : (
                  filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tCategory(c.name)}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                {t("transactions_page.table.date")}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("transactions_page.table.note")} ({language === 'id' ? 'Opsional' : 'Optional'})
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="What was this for?"
            />
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
              ) : transactionToEdit ? (
                t("common.save")
              ) : (
                t("transactions_page.add_new")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
