"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { DashboardOverview } from "@/types";

export default React.memo(function SummaryCards({ data }: { data: DashboardOverview }) {
  const { formatCurrency } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance */}
      <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <p className="font-label-caps text-label-caps text-outline">
            {t("dashboard_page.total_balance")}
          </p>
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <span className="material-symbols-outlined text-[20px]">
              account_balance_wallet
            </span>
          </div>
        </div>
        <div className="relative z-10">
          <h3 className="font-headline-lg text-headline-lg text-on-surface">
            {formatCurrency(data.balance)}
          </h3>
          <div className={`flex items-center gap-1 mt-2 ${data.balanceChange >= 0 ? "text-secondary" : "text-error"}`}>
            <span className="material-symbols-outlined text-[16px]">
              {data.balanceChange >= 0 ? "arrow_upward" : "arrow_downward"}
            </span>
            <span className="font-numeric-data text-numeric-data text-sm">
              {Math.abs(data.balanceChange)}%
            </span>
            <span className="font-label-caps text-label-caps text-outline ml-1 normal-case text-[10px]">
              {t("dashboard_page.vs_last_month")}
            </span>
          </div>
        </div>
      </div>

      {/* Income */}
      <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <p className="font-label-caps text-label-caps text-outline">
            {t("common.income")}
          </p>
          <div className="p-2 bg-secondary-container text-secondary rounded-lg">
            <span className="material-symbols-outlined text-[20px]">
              south_west
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {formatCurrency(data.income)}
          </h3>
          <div className={`flex items-center gap-1 mt-2 ${data.incomeChange >= 0 ? "text-secondary" : "text-error"}`}>
            <span className="material-symbols-outlined text-[16px]">
              {data.incomeChange >= 0 ? "arrow_upward" : "arrow_downward"}
            </span>
            <span className="font-numeric-data text-numeric-data text-sm">
              {Math.abs(data.incomeChange)}%
            </span>
          </div>
        </div>
      </div>

      {/* Expense */}
      <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <p className="font-label-caps text-label-caps text-outline">
            {t("common.expense")}
          </p>
          <div className="p-2 bg-error-container text-error rounded-lg">
            <span className="material-symbols-outlined text-[20px]">
              north_east
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {formatCurrency(data.expense)}
          </h3>
          <div className={`flex items-center gap-1 mt-2 ${data.expenseChange <= 0 ? "text-secondary" : "text-error"}`}>
            <span className="material-symbols-outlined text-[16px]">
              {data.expenseChange >= 0 ? "arrow_upward" : "arrow_downward"}
            </span>
            <span className="font-numeric-data text-numeric-data text-sm">
              {Math.abs(data.expenseChange)}%
            </span>
          </div>
        </div>
      </div>

      {/* Budget Usage */}
      <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <p className="font-label-caps text-label-caps text-outline">
            {t("dashboard_page.budget_usage")}
          </p>
          <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
            <span className="material-symbols-outlined text-[20px]">
              pie_chart
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-end gap-2 mb-2">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {data.budgetUsage}%
            </h3>
            <p className="font-body-sm text-body-sm text-outline pb-0.5 text-[10px]">
              {t("budget_page.of")} {formatCurrency(data.budgetLimit)}
            </p>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`${data.budgetUsage > 90 ? 'bg-error' : data.budgetUsage > 75 ? 'bg-tertiary' : 'bg-primary'} h-2 rounded-full`}
              style={{ width: `${Math.min(data.budgetUsage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
});
