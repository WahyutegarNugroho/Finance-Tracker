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
      toast.success(
        transactionToEdit
          ? t("transactions_page.save_success_update")
          : t("transactions_page.save_success_create")
      );
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error(t("transactions_page.save_error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId || !form.date) return;

    const selectedCategory = categories.find((c) => c.id === form.categoryId);
    const payload = {
      type: form.type,
      amount: parseFloat(form.amount),
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
      <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
        <h2
          id="transaction-modal-title"
          className="font-headline-md text-headline-md font-bold text-on-background"
        >
          {transactionToEdit ? t("common.edit") : t("transactions_page.add_new")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.cancel")}
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 p-2 rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        {/* Type Toggle */}
        <div className="flex p-1 bg-surface-variant/30 rounded-xl" role="group" aria-label={t("common.type")}>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "expense", categoryId: "" }))}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              form.type === "expense"
                ? "bg-surface shadow-sm text-error font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t("common.expense")}
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "income", categoryId: "" }))}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              form.type === "income"
                ? "bg-surface shadow-sm text-secondary font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t("common.income")}
          </button>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="tx-amount" className="block text-sm font-medium text-on-surface-variant mb-1">
            {t("transactions_page.table.amount")}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
              {currencySymbol}
            </span>
            <input
              id="tx-amount"
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

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="tx-category" className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("transactions_page.table.category")}
            </label>
            <select
              id="tx-category"
              required
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              disabled={fetchingCats}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
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
          </div>

          {/* Date */}
          <div>
            <label htmlFor="tx-date" className="block text-sm font-medium text-on-surface-variant mb-1">
              {t("transactions_page.table.date")}
            </label>
            <input
              id="tx-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="tx-note" className="block text-sm font-medium text-on-surface-variant mb-1">
            {t("transactions_page.table.note")} {t("transactions_page.optional")}
          </label>
          <input
            id="tx-note"
            type="text"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder={t("transactions_page.table.note")}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full bg-primary text-on-primary font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center cursor-pointer"
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
    </Dialog>
  );
}
