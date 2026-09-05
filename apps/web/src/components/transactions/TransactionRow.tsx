"use client";

import React, { useState } from "react";
import { Transaction } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

interface TransactionRowProps {
  tx: Transaction;
  isLoading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  formatDate: (date: string, lang: string) => string;
}

export default React.memo(function TransactionRow({
  tx,
  isLoading,
  onEdit,
  onDelete,
  selectedIds,
  toggleSelect,
  formatDate,
}: TransactionRowProps) {
  const { language, t, tCategory } = useLanguage();
  const { formatCurrency } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (isLoading) return null;

  return (
    <tr
      className={`hover:bg-surface-variant/20 transition-colors group ${
        selectedIds.has(tx.id) ? "bg-primary/5" : ""
      }`}
    >
      <td className="px-2 py-4 w-10">
        <input
          type="checkbox"
          checked={selectedIds.has(tx.id)}
          onChange={() => toggleSelect(tx.id)}
          className="accent-primary cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none rounded-sm"
          aria-label={t("transactions_page.select_transaction").replace("{id}", tx.note || tx.categoryName)}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-body-sm text-body-sm text-on-surface">
        {formatDate(tx.date, language)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              tx.type === "income"
                ? "bg-secondary/10 text-secondary"
                : "bg-primary/10 text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {tx.categoryIcon || "category"}
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
      <td
        className={`px-6 py-4 whitespace-nowrap font-numeric-data text-numeric-data text-right font-semibold ${
          tx.type === "income" ? "text-secondary" : "text-on-surface"
        }`}
      >
        {tx.type === "income" ? "+" : "-"}
        {formatCurrency(tx.amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md font-label-caps text-label-caps text-[10px] ${
            tx.type === "income"
              ? "bg-secondary/10 text-secondary"
              : "bg-surface-variant/50 text-on-surface-variant"
          }`}
        >
          {tx.type === "income" ? t("common.credit") : t("common.debit")}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-outline relative">
        <div
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setOpenMenuId(null);
          }}
          className="inline-flex"
        >
          <button
            type="button"
            onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
            className="p-1 hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none rounded-full transition-colors cursor-pointer"
            aria-label={t("transactions_page.table.actions")}
            aria-expanded={openMenuId === tx.id}
            aria-haspopup="true"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>

          {openMenuId === tx.id && (
            <div
              className="absolute right-0 top-full mt-1 w-32 bg-surface border border-outline-variant/20 rounded-lg shadow-lg z-10 flex flex-col overflow-hidden text-left"
            >
              <button
                type="button"
                onClick={() => {
                  onEdit(tx);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/50 focus-visible:bg-surface-variant/50 focus-visible:outline-none flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                {t("common.edit")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(tx.id);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/50 focus-visible:bg-error-container/50 focus-visible:outline-none flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                {t("common.delete")}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});
