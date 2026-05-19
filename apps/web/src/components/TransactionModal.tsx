"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, Transaction, ApiResponse } from "@/types";

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: Transaction | null;
};

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
}: TransactionModalProps) {
  const { currencySymbol, currency } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const queryClient = useQueryClient();

  // Form State
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const formatWithDots = (val: string) => {
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
  };

  // Queries
  const { data: categoriesData, isLoading: fetchingCats } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
    enabled: isOpen,
  });

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setType(transactionToEdit.type);
        const amtStr = transactionToEdit.amount.toString();
        setAmount(amtStr);
        setDisplayAmount(formatWithDots(amtStr));
        setCategoryId((transactionToEdit as any).categoryId || ""); 
        setDate(new Date(transactionToEdit.date).toISOString().split("T")[0]);
        setNote(transactionToEdit.note || "");
      } else {
        setType("expense");
        setAmount("");
        setDisplayAmount("");
        setCategoryId("");
        setDate(new Date().toISOString().split("T")[0]);
        setNote("");
      }
    }
  }, [isOpen, transactionToEdit]);

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
      
      setAmount(cleaned);
      setDisplayAmount(formatWithDots(cleaned));
    } else {
      const raw = inputVal.replace(/\D/g, "");
      setAmount(raw);
      setDisplayAmount(formatWithDots(raw));
    }
  };

  // Change default category when type changes
  useEffect(() => {
    if (!transactionToEdit && Array.isArray(categories) && categories.length > 0) {
      const defaultCat = categories.find((c) => c.type === type);
      if (defaultCat) setCategoryId(defaultCat.id);
    }
  }, [type, categories, transactionToEdit]);

  // Mutation
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (transactionToEdit) {
        return api.put(`/transactions/${transactionToEdit.id}`, payload);
      }
      return api.post("/transactions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(transactionToEdit ? 
        (language === 'id' ? "Transaksi diperbarui!" : "Transaction updated!") : 
        (language === 'id' ? "Transaksi ditambahkan!" : "Transaction added!")
      );
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error(language === 'id' ? "Gagal menyimpan transaksi." : "Failed to save transaction.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !date) return;

    const selectedCategory = Array.isArray(categories) ? categories.find((c) => c.id === categoryId) : null;
    const payload = {
      type,
      amount: parseFloat(amount),
      categoryId,
      categoryName: selectedCategory?.name || "Unknown",
      categoryIcon: selectedCategory?.icon || "category",
      date: new Date(date).toISOString(),
      note,
    };

    saveMutation.mutate(payload);
  };

  if (!isOpen) return null;

  const filteredCategories = Array.isArray(categories) 
    ? categories.filter((c) => c.type === type)
    : [];

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
                ) : Array.isArray(filteredCategories) ? (
                  filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tCategory(c.name)}
                    </option>
                  ))
                ) : null}
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
              disabled={saveMutation.isPending}
              className="w-full bg-primary text-on-primary font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
            >
              {saveMutation.isPending ? (
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
