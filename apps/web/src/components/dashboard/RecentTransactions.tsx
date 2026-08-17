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
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {t("dashboard_page.recent_transactions")}
        </h3>
        <Link
          className="text-primary hover:text-primary-container font-label-caps text-label-caps transition-colors text-[12px]"
          href="/transactions"
        >
          {t("common.view_all")}
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {(!Array.isArray(transactions) || transactions.length === 0) ? (
          <div className="text-center py-6 text-on-surface-variant">
            {t("dashboard_page.no_recent")}
          </div>
        ) : (
          transactions.map((tx: Transaction) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-surface-variant/30 rounded-lg transition-colors border border-transparent hover:border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  tx.type === 'income' 
                    ? 'bg-secondary-container/20 text-secondary border-secondary/20' 
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                }`}>
                  <span className="material-symbols-outlined">
                    {tx.categoryIcon || (tx.type === 'income' ? 'payments' : 'receipt')}
                  </span>
                </div>
                <div>
                  <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">
                    {tx.note || tCategory(tx.categoryName)}
                  </h4>
                  <p className="font-label-caps text-label-caps text-outline mt-1 text-[10px]">
                    {tCategory(tx.categoryName)} • {formatDate(tx.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-numeric-data text-numeric-data ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface'}`}>
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
