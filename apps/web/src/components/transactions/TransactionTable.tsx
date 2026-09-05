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
  onBatchDelete?: (ids: string[]) => void;
  formatDate: (date: string, lang: string) => string;
}

export default React.memo(function TransactionTable({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onBatchDelete,
  formatDate,
}: TransactionTableProps) {
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingBatchDelete, setPendingBatchDelete] = useState(false);

  const allSelected =
    transactions.length > 0 && transactions.every((tx) => selectedIds.has(tx.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((tx) => tx.id)));
    }
  };

  return (
    <div className="bg-surface border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
      {selectedIds.size > 0 && onBatchDelete && (
        <div className="px-4 py-2 bg-error-container/20 border-b border-error/20 flex items-center justify-between">
          <span className="text-sm text-error font-medium">
            {t("common.selected_count").replace("{count}", String(selectedIds.size))}
          </span>
          {pendingBatchDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-error">{t("common.confirm_question")}</span>
              <button
                type="button"
                onClick={() => {
                  onBatchDelete(Array.from(selectedIds));
                  setSelectedIds(new Set());
                  setPendingBatchDelete(false);
                }}
                className="text-sm bg-error text-white font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {t("common.delete")}
              </button>
              <button
                type="button"
                onClick={() => setPendingBatchDelete(false)}
                className="text-sm text-on-surface-variant font-semibold px-2 py-1 rounded-lg hover:bg-surface-variant/50 transition-colors cursor-pointer"
              >
                {t("common.cancel")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPendingBatchDelete(true)}
              className="text-sm text-error font-semibold hover:bg-error/10 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
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
            <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
              <th className="px-2 py-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-primary cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none rounded-sm"
                  aria-label={t("common.select_all")}
                />
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">
                {t("transactions_page.table.date")}
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">
                {t("transactions_page.table.category")}
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">
                {t("transactions_page.table.note")}
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider text-right">
                {t("transactions_page.table.amount")}
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider text-center">
                {t("common.type")}
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 relative">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : !Array.isArray(transactions) || transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                  {t("transactions_page.no_data")}
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
