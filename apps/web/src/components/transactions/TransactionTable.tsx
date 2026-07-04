"use client";

import React, { useState } from "react";
import { Transaction } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

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
  const { language, t, tCategory } = useLanguage();
  const { formatCurrency } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [pendingBatchDelete, setPendingBatchDelete] = useState(false);

  const allSelected = transactions.length > 0 && transactions.every((tx) => selectedIds.has(tx.id));
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
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
    <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col min-h-[400px]">
      {selectedIds.size > 0 && onBatchDelete && (
        <div className="px-4 py-2 bg-error-container/20 border-b border-error/20 flex items-center justify-between">
          <span className="text-sm text-error font-medium">{selectedIds.size} selected</span>
          {pendingBatchDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-error">{t("common.confirm")}?</span>
              <button
                onClick={() => { onBatchDelete(Array.from(selectedIds)); setSelectedIds(new Set()); setPendingBatchDelete(false); }}
                className="text-sm bg-error text-white font-semibold px-3 py-1 rounded-lg transition-colors"
              >
                {t("common.delete")}
              </button>
              <button
                onClick={() => setPendingBatchDelete(false)}
                className="text-sm text-on-surface-variant font-semibold px-2 py-1 rounded-lg hover:bg-surface-variant/50 transition-colors"
              >
                {t("common.cancel")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPendingBatchDelete(true)}
              className="text-sm text-error font-semibold hover:bg-error/10 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete Selected
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
              <th className="px-2 py-4 w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="accent-primary cursor-pointer" aria-label="Select all" />
              </th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">{t("transactions_page.table.date")}</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">{t("transactions_page.table.category")}</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">{t("transactions_page.table.note")}</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider text-right">{t("transactions_page.table.amount")}</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider text-center">{t("common.type")}</th>
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
            ) : (!Array.isArray(transactions) || transactions.length === 0) ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                  {t("transactions_page.no_data")}
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className={`hover:bg-surface-variant/20 transition-colors group ${selectedIds.has(tx.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-2 py-4 w-10">
                    <input type="checkbox" checked={selectedIds.has(tx.id)} onChange={() => toggleSelect(tx.id)} className="accent-primary cursor-pointer" aria-label={`Select ${tx.id}`} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-body-sm text-body-sm text-on-surface">
                    {formatDate(tx.date, language)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {tx.categoryIcon || 'category'}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface">
                        {tCategory(tx.categoryName)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant max-w-xs truncate">
                    {tx.note || "-"}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-numeric-data text-numeric-data text-right font-semibold ${
                    tx.type === 'income' ? 'text-secondary' : 'text-on-surface'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md font-label-caps text-label-caps text-[10px] ${
                      tx.type === 'income' 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-surface-variant/50 text-on-surface-variant'
                    }`}>
                      {tx.type === 'income' ? t("common.credit") : t("common.debit")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-outline relative">
                    <div
                      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpenMenuId(null); }}
                      className="inline-flex"
                    >
                      <button
                        onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                        className="p-1 hover:bg-surface-variant rounded-full transition-colors"
                        aria-label={t("transactions_page.table.actions")}
                        aria-expanded={openMenuId === tx.id}
                      >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                      
                      {/* ponytail: absolute dropdown → use portal+flip logic when table has horizontal scroll */}
                      {openMenuId === tx.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-outline-variant/20 rounded-lg shadow-lg z-10 flex flex-col overflow-hidden text-left" role="menu">
                          <button 
                            onClick={() => { onEdit(tx); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/50 flex items-center gap-2"
                            role="menuitem"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            {t("common.edit")}
                          </button>
                          <button 
                            onClick={() => { onDelete(tx.id); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/50 flex items-center gap-2"
                            role="menuitem"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            {t("common.delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
