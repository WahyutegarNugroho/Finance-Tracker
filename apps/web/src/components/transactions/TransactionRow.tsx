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
      className={`hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors group ${
        selectedIds.has(tx.id) ? "bg-[#39E75F]/10 dark:bg-[#39E75F]/15" : ""
      }`}
    >
      <td className="px-3 py-3 w-10">
        <input
          type="checkbox"
          checked={selectedIds.has(tx.id)}
          onChange={() => toggleSelect(tx.id)}
          className="accent-[#39E75F] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:outline-none rounded w-4 h-4"
          aria-label={t("transactions_page.select_transaction").replace("{id}", tx.note || tx.categoryName)}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold text-[#08110A] dark:text-[#F5EFE6]">
        {formatDate(tx.date, language)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl border border-[#08110A] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#08110A] ${
              tx.type === "income"
                ? "bg-[#39E75F] text-[#08110A]"
                : "bg-[#FB923C] text-[#08110A]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] font-bold">
              {tx.categoryIcon || "receipt_long"}
            </span>
          </div>
          <span className="font-sans text-xs sm:text-sm font-bold text-[#08110A] dark:text-white">
            {tCategory(tx.categoryName || "Others")}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 font-sans text-xs text-[#08110A]/70 dark:text-[#F5EFE6]/70 max-w-xs truncate">
        {tx.note || "-"}
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap font-mono text-xs sm:text-sm text-right font-black ${
          tx.type === "income" ? "text-[#166534] dark:text-[#39E75F]" : "text-[#991B1B] dark:text-[#FB923C]"
        }`}
      >
        {tx.type === "income" ? "+" : "-"}
        {formatCurrency(isNaN(Number(tx.amount)) ? 0 : Number(tx.amount))}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full border border-[#08110A] font-display font-black text-[10px] uppercase shadow-[1px_1px_0px_#08110A] ${
            tx.type === "income"
              ? "bg-[#39E75F] text-[#08110A]"
              : "bg-[#FB923C] text-[#08110A]"
          }`}
        >
          {tx.type === "income" ? t("common.credit") : t("common.debit")}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-outline relative">
        <div
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setOpenMenuId(null);
          }}
          className="inline-flex"
        >
          <button
            type="button"
            onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
            className="w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:outline-none transition-colors flex items-center justify-center cursor-pointer text-[#08110A] dark:text-white"
            aria-label={t("transactions_page.table.actions")}
            aria-expanded={openMenuId === tx.id}
            aria-haspopup="true"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>

          {openMenuId === tx.id && (
            <div
              className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#08110A] border-2 border-[#08110A] dark:border-white/20 rounded-2xl shadow-[4px_4px_0px_#08110A] z-20 flex flex-col overflow-hidden text-left p-1"
            >
              <button
                type="button"
                onClick={() => {
                  onEdit(tx);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-xs font-display font-black uppercase text-[#08110A] dark:text-white hover:bg-[#FAF8F5] dark:hover:bg-white/10 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                {t("common.edit")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(tx.id);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-xs font-display font-black uppercase text-[#991B1B] hover:bg-[#FEE2E2] dark:hover:bg-red-950/40 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                {t("common.delete")}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});
