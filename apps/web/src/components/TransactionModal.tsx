"use client";

import React, { useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, Transaction, ApiResponse } from "@/types";
import { formatAmount, cleanAmount } from "@/lib/formatting";
import Dialog from "@/components/ui/Dialog";

interface TransactionPayload {
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  date: string;
  note: string;
}

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: Transaction | null;
};

function initForm(transactionToEdit: Transaction | null | undefined, defaultDate: string) {
  if (transactionToEdit) {
    const amtStr = transactionToEdit.amount.toString();
    return {
      type: transactionToEdit.type as "income" | "expense",
      amount: amtStr,
      displayAmount: amtStr,
      categoryId: transactionToEdit.categoryId || "",
      date: new Date(transactionToEdit.date).toISOString().split("T")[0],
      note: transactionToEdit.note || "",
    };
  }
  return {
    type: "expense" as "income" | "expense",
    amount: "",
    displayAmount: "",
    categoryId: "",
    date: defaultDate,
    note: "",
  };
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
}: TransactionModalProps) {
  const { currencySymbol, currency } = useAuth();
  const { t, tCategory } = useLanguage();
  const queryClient = useQueryClient();
  const defaultDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [form, setForm] = useState(() => initForm(transactionToEdit, defaultDate));
  const [errors, setErrors] = useState<{ amount?: string; categoryId?: string; date?: string }>({});

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setForm(initForm(transactionToEdit, defaultDate));
        setErrors({});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, transactionToEdit, defaultDate]);

  const { data: categoriesData, isLoading: fetchingCats } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
    enabled: isOpen,
  });

  const categories = useMemo(
    () => (Array.isArray(categoriesData?.data) ? categoriesData.data : []),
    [categoriesData]
  );

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === form.type),
    [categories, form.type]
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanAmount(e.target.value, currency);
    setForm((f) => ({ ...f, amount: cleaned, displayAmount: formatAmount(cleaned, currency) }));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const saveMutation = useMutation({
    mutationFn: (payload: TransactionPayload) => {
      if (transactionToEdit) {
        return api.put(`/transactions/${transactionToEdit.id}`, payload);
      }
      return api.post("/transactions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success(
        transactionToEdit
          ? t("transactions_page.save_success_update")
          : t("transactions_page.save_success_create")
      );
      onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      const errorObj = err as { data?: { message?: string }; message?: string } | undefined;
      const msg = errorObj?.data?.message || errorObj?.message || t("transactions_page.save_error");
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { amount?: string; categoryId?: string; date?: string } = {};

    const parsedAmount = parseFloat(form.amount);
    if (!form.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = t("transactions_page.form_error_amount");
    }
    if (!form.categoryId) {
      newErrors.categoryId = t("transactions_page.form_error_category");
    }
    if (!form.date) {
      newErrors.date = t("transactions_page.form_error_date");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const selectedCategory = categories.find((c) => c.id === form.categoryId);
    const payload = {
      type: form.type,
      amount: parsedAmount,
      categoryId: form.categoryId,
      categoryName: selectedCategory?.name || "Unknown",
      categoryIcon: selectedCategory?.icon || "category",
      date: new Date(form.date).toISOString(),
      note: form.note,
    };

    saveMutation.mutate(payload);
  };

  return (
    <Dialog
      key={transactionToEdit?.id || "new"}
      isOpen={isOpen}
      onClose={onClose}
      titleId="transaction-modal-title"
    >
      <div className="flex justify-between items-center p-6 border-b-2 border-[#08110A]/10 dark:border-white/10">
        <h2
          id="transaction-modal-title"
          className="font-display font-black text-xl uppercase tracking-tight text-[#08110A] dark:text-white"
        >
          {transactionToEdit ? t("common.edit") : t("transactions_page.add_new")}
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
        {/* Type Toggle */}
        <div className="flex p-1 bg-[#FAF8F5] dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-2xl" role="group" aria-label={t("common.type")}>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "expense", categoryId: "" }))}
            className={`flex-1 py-2 text-center rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              form.type === "expense"
                ? "bg-[#FB923C] text-[#08110A] border border-[#08110A] shadow-[2px_2px_0px_#08110A]"
                : "text-[#08110A]/60 dark:text-[#F5EFE6]/60 hover:text-[#08110A] dark:hover:text-white"
            }`}
          >
            {t("common.expense")}
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "income", categoryId: "" }))}
            className={`flex-1 py-2 text-center rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              form.type === "income"
                ? "bg-[#39E75F] text-[#08110A] border border-[#08110A] shadow-[2px_2px_0px_#08110A]"
                : "text-[#08110A]/60 dark:text-[#F5EFE6]/60 hover:text-[#08110A] dark:hover:text-white"
            }`}
          >
            {t("common.income")}
          </button>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="tx-amount" className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] mb-1">
            {t("transactions_page.table.amount")}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/50 dark:text-[#F5EFE6]/50 font-mono font-bold text-sm">
              {currencySymbol}
            </span>
            <input
              id="tx-amount"
              type="text"
              inputMode="numeric"
              value={form.displayAmount}
              onChange={handleAmountChange}
              className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0D1910] border-2 rounded-xl font-mono text-sm text-[#08110A] dark:text-white placeholder:text-[#08110A]/40 outline-none transition-all shadow-[2px_2px_0px_#08110A] ${
                errors.amount
                  ? "border-[#EF4444] ring-2 ring-[#EF4444]/20"
                  : "border-[#08110A] dark:border-white/20 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1"
              }`}
              placeholder="0"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="font-mono text-[10px] font-bold text-[#EF4444] mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="tx-category" className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] mb-1">
              {t("transactions_page.table.category")}
            </label>
            <select
              id="tx-category"
              value={form.categoryId}
              onChange={(e) => {
                setForm((f) => ({ ...f, categoryId: e.target.value }));
                if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: undefined }));
              }}
              disabled={fetchingCats}
              className={`w-full px-3.5 py-3 bg-white dark:bg-[#0D1910] border-2 rounded-xl font-sans text-xs sm:text-sm font-bold text-[#08110A] dark:text-white outline-none transition-all shadow-[2px_2px_0px_#08110A] appearance-none ${
                errors.categoryId
                  ? "border-[#EF4444] ring-2 ring-[#EF4444]/20"
                  : "border-[#08110A] dark:border-white/20 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1"
              }`}
              aria-invalid={!!errors.categoryId}
            >
              {fetchingCats ? (
                <option>{t("common.loading")}</option>
              ) : (
                <>
                  <option value="">{t("common.select") || "Select category"}</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tCategory(c.name)}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.categoryId && (
              <p className="font-mono text-[10px] font-bold text-[#EF4444] mt-1">
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="tx-date" className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] mb-1">
              {t("transactions_page.table.date")}
            </label>
            <input
              id="tx-date"
              type="date"
              value={form.date}
              onChange={(e) => {
                setForm((f) => ({ ...f, date: e.target.value }));
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              className={`w-full px-3.5 py-3 bg-white dark:bg-[#0D1910] border-2 rounded-xl font-mono text-xs sm:text-sm text-[#08110A] dark:text-white outline-none transition-all shadow-[2px_2px_0px_#08110A] ${
                errors.date
                  ? "border-[#EF4444] ring-2 ring-[#EF4444]/20"
                  : "border-[#08110A] dark:border-white/20 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1"
              }`}
              aria-invalid={!!errors.date}
            />
            {errors.date && (
              <p className="font-mono text-[10px] font-bold text-[#EF4444] mt-1">
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="tx-note" className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] mb-1">
            {t("transactions_page.table.note")} {t("transactions_page.optional")}
          </label>
          <input
            id="tx-note"
            type="text"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full px-4 py-3 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-xl font-sans text-xs sm:text-sm text-[#08110A] dark:text-white placeholder:text-[#08110A]/40 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1 outline-none transition-all shadow-[2px_2px_0px_#08110A]"
            placeholder={t("transactions_page.table.note")}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending || fetchingCats}
            className="w-full min-h-[48px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-full border-2 border-[#08110A] shadow-[4px_4px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>{t("common.saving")}</span>
              </>
            ) : transactionToEdit ? (
              t("common.save")
            ) : (
              t("transactions_page.add_new")
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
