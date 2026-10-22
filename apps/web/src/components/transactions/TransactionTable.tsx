"use client";

import React, { useState } from "react";
import { Transaction } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import TransactionRow from "./TransactionRow";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onBatchDelete?: (ids: string[]) => Promise<void> | void;
  formatDate: (date: string, lang: string) => string;
  searchQuery?: string;
  typeFilter?: string;
  onClearSearch?: () => void;
  onClearFilter?: () => void;
  onAddNew?: () => void;
  isBatchDeleting?: boolean;
}

export default React.memo(function TransactionTable({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onBatchDelete,
  formatDate,
  searchQuery,
  typeFilter,
  onClearSearch,
  onClearFilter,
  onAddNew,
  isBatchDeleting = false,
}: TransactionTableProps) {
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingBatchDelete, setPendingBatchDelete] = useState(false);

  const allSelected =
    transactions.length > 0 && transactions.every((tx) => selectedIds.has(tx.id));

  const toggleSelect = (id: string) => {
    if (isBatchDeleting) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (isBatchDeleting) return;
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((tx) => tx.id)));
    }
  };

  return (
    <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.25)] overflow-hidden flex-1 flex flex-col min-h-[400px]">
      {selectedIds.size > 0 && onBatchDelete && (
        <div className="px-4 py-2.5 bg-[#FEE2E2] dark:bg-[#450a0a] border-b-2 border-[#08110A] text-[#991B1B] dark:text-[#fca5a5] flex items-center justify-between font-mono text-xs font-bold">
          <span>
            {t("common.selected_count").replace("{count}", String(selectedIds.size))}
          </span>
          {pendingBatchDelete ? (
            <div className="flex items-center gap-2">
              <span>{t("common.confirm_question")}</span>
              <button
                type="button"
                disabled={isBatchDeleting}
                onClick={async () => {
                  await onBatchDelete(Array.from(selectedIds));
                  setSelectedIds(new Set());
                  setPendingBatchDelete(false);
                }}
                className="bg-[#991B1B] text-white font-black px-3 py-1 rounded-full border border-[#08110A] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isBatchDeleting && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isBatchDeleting ? t("common.deleting") : t("common.delete")}</span>
              </button>
              <button
                type="button"
                disabled={isBatchDeleting}
                onClick={() => setPendingBatchDelete(false)}
                className="text-[#08110A] dark:text-white font-bold px-2 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isBatchDeleting}
              onClick={() => setPendingBatchDelete(true)}
              className="text-[#991B1B] dark:text-[#fca5a5] font-black hover:underline px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              {t("common.delete_selected")}
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#08110A]/10 dark:border-white/10 bg-[#FAF8F5] dark:bg-white/5">
              <th className="px-3 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  disabled={isBatchDeleting}
                  onChange={toggleSelectAll}
                  className="accent-[#39E75F] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:outline-none rounded w-4 h-4"
                  aria-label={t("common.select_all")}
                />
              </th>
              <th className="px-4 py-3.5 font-mono text-xs font-black text-[#08110A] dark:text-[#F5EFE6] uppercase tracking-wider">
                {t("transactions_page.table.date")}
              </th>
              <th className="px-4 py-3.5 font-mono text-xs font-black text-[#08110A] dark:text-[#F5EFE6] uppercase tracking-wider">
                {t("transactions_page.table.category")}
              </th>
              <th className="px-4 py-3.5 font-mono text-xs font-black text-[#08110A] dark:text-[#F5EFE6] uppercase tracking-wider">
                {t("transactions_page.table.note")}
              </th>
              <th className="px-4 py-3.5 font-mono text-xs font-black text-[#08110A] dark:text-[#F5EFE6] uppercase tracking-wider text-right">
                {t("transactions_page.table.amount")}
              </th>
              <th className="px-4 py-3.5 font-mono text-xs font-black text-[#08110A] dark:text-[#F5EFE6] uppercase tracking-wider text-center">
                {t("common.type")}
              </th>
              <th className="px-4 py-3.5 font-mono text-xs font-black text-[#08110A] dark:text-[#F5EFE6] uppercase tracking-wider w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#08110A]/10 dark:divide-white/10 relative">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="w-8 h-8 border-4 border-[#39E75F] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : !Array.isArray(transactions) || transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-3">
                    {searchQuery && searchQuery.trim() ? (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 border-2 border-[#08110A] dark:border-amber-400/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-[2px_2px_0px_#08110A]">
                          <span className="material-symbols-outlined text-[24px]">search_off</span>
                        </div>
                        <p className="font-mono text-xs font-bold text-[#08110A]/80 dark:text-[#F5EFE6]/80">
                          {t("transactions_page.empty_search").replace("{search}", searchQuery)}
                        </p>
                        {onClearSearch && (
                          <button
                            type="button"
                            onClick={onClearSearch}
                            className="mt-1 px-4 py-1.5 bg-[#FAF8F5] dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 border-2 border-[#08110A] dark:border-white/20 rounded-full font-display text-xs font-black uppercase tracking-wider text-[#08110A] dark:text-white shadow-[2px_2px_0px_#08110A] transition-all cursor-pointer"
                          >
                            {t("transactions_page.clear_search")}
                          </button>
                        )}
                      </>
                    ) : typeFilter && typeFilter !== "all" ? (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-[#7DD3FC]/30 border-2 border-[#08110A] dark:border-sky-400/30 flex items-center justify-center text-[#08110A] dark:text-sky-300 shadow-[2px_2px_0px_#08110A]">
                          <span className="material-symbols-outlined text-[24px]">filter_alt_off</span>
                        </div>
                        <p className="font-mono text-xs font-bold text-[#08110A]/80 dark:text-[#F5EFE6]/80">
                          {t("transactions_page.empty_filter").replace(
                            "{type}",
                            typeFilter === "income" ? t("common.income") : t("common.expense")
                          )}
                        </p>
                        {onClearFilter && (
                          <button
                            type="button"
                            onClick={onClearFilter}
                            className="mt-1 px-4 py-1.5 bg-[#FAF8F5] dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 border-2 border-[#08110A] dark:border-white/20 rounded-full font-display text-xs font-black uppercase tracking-wider text-[#08110A] dark:text-white shadow-[2px_2px_0px_#08110A] transition-all cursor-pointer"
                          >
                            {t("transactions_page.clear_filter")}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-[#39E75F]/20 border-2 border-[#08110A] dark:border-[#39E75F]/40 flex items-center justify-center text-[#08110A] dark:text-[#39E75F] shadow-[2px_2px_0px_#08110A]">
                          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                        </div>
                        <p className="font-mono text-xs font-bold text-[#08110A]/80 dark:text-[#F5EFE6]/80">
                          {t("transactions_page.no_data")}
                        </p>
                        {onAddNew && (
                          <button
                            type="button"
                            onClick={onAddNew}
                            className="mt-1 px-4 py-2 bg-[#39E75F] hover:bg-[#2ed652] border-2 border-[#08110A] rounded-full font-display text-xs font-black uppercase tracking-wider text-[#08110A] shadow-[2px_2px_0px_#08110A] transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                            <span>{t("transactions_page.create_first")}</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  isLoading={isLoading}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selectedIds={selectedIds}
                  toggleSelect={toggleSelect}
                  formatDate={formatDate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
