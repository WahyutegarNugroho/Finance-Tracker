"use client";

import React from "react";
import { Transaction } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string, lang: string) => string;
}

export default function TransactionTable({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  formatDate,
}: TransactionTableProps) {
  const { language, t, tCategory } = useLanguage();
  const { formatCurrency } = useAuth();

  return (
    <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col min-h-[400px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
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
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : (!Array.isArray(transactions) || transactions.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                  {t("transactions_page.no_data")}
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-variant/20 transition-colors group">
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
                      {tx.type === 'income' ? (language === 'id' ? 'Kredit' : 'Credit') : (language === 'id' ? 'Debit' : 'Debit')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-outline transition-opacity relative group/menu">
                    <button className="p-1 hover:bg-surface-variant rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 bg-surface border border-outline-variant/20 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 flex flex-col overflow-hidden text-left">
                      <button 
                        onClick={() => onEdit(tx)}
                        className="text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        {t("common.edit")}
                      </button>
                      <button 
                        onClick={() => onDelete(tx.id)}
                        className="text-left px-4 py-2 text-sm text-error hover:bg-error-container/50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        {t("common.delete")}
                      </button>
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
}
