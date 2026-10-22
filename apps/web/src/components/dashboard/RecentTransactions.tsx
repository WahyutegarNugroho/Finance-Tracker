"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { Transaction } from "@/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  formatDate: (date: string) => string;
}

const RecentTransactions = React.memo(function RecentTransactions({ transactions, formatDate }: RecentTransactionsProps) {
  const { formatCurrency } = useAuth();
  const { t, tCategory } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white">
          {t("dashboard_page.recent_transactions")}
        </h3>
        <Link
          className="font-mono text-xs font-bold uppercase underline underline-offset-4 decoration-2 text-[#08110A] dark:text-[#39E75F] hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:outline-none rounded px-1"
          href="/transactions"
        >
          {t("common.view_all")}
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {(!Array.isArray(transactions) || transactions.length === 0) ? (
          <div className="text-center py-8 font-mono text-xs font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60">
            {t("dashboard_page.no_recent")}
          </div>
        ) : (
          transactions.map((tx: Transaction) => (
            <div key={tx.id} className="flex items-center justify-between p-3.5 hover:bg-[#FAF8F5] dark:hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-[#08110A]/10 dark:hover:border-white/10">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 border-[#08110A] shrink-0 shadow-[2px_2px_0px_#08110A] ${
                  tx.type === 'income' 
                    ? 'bg-[#39E75F] text-[#08110A]' 
                    : 'bg-[#FB923C] text-[#08110A]'
                }`}>
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    {tx.categoryIcon || (tx.type === 'income' ? 'payments' : 'receipt')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-sans text-sm font-bold text-[#08110A] dark:text-white truncate">
                    {tx.note || tCategory(tx.categoryName)}
                  </h4>
                  <p className="font-mono text-[10px] font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60 mt-0.5 truncate uppercase">
                    {tCategory(tx.categoryName)} • {formatDate(tx.date)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className={`font-mono text-sm sm:text-base font-black ${
                  tx.type === 'income' 
                    ? 'text-[#166534] dark:text-[#39E75F]' 
                    : 'text-[#C2410C] dark:text-[#FB923C]'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default RecentTransactions;
