"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { DashboardOverview } from "@/types";

const ChangeBadge = ({ change, label, isZero }: { change: number; label?: string; isZero: boolean }) => {
  const isNeutral = isZero || change === 0;
  const isPositive = change > 0 && !isZero;
  const isNegative = change < 0 && !isZero;

  let badgeStyle = "bg-gray-100 dark:bg-white/10 text-[#08110A] dark:text-[#F5EFE6] border-[#08110A]/20 dark:border-white/20";
  let icon = "horizontal_rule";
  
  if (isPositive) {
    badgeStyle = "bg-[#39E75F] text-[#08110A] border-[#08110A] shadow-[1px_1px_0px_#08110A]";
  } else if (isNegative) {
    badgeStyle = "bg-[#FB923C] text-[#08110A] border-[#08110A] shadow-[1px_1px_0px_#08110A]";
    icon = "arrow_downward";
  }

  if (isPositive) icon = "arrow_upward";

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-mono font-black ${badgeStyle}`}>
        <span className="material-symbols-outlined text-[13px] leading-none">
          {icon}
        </span>
        <span>{isNeutral ? "0" : Math.abs(change)}%</span>
      </span>
      {label && (
        <span className="font-mono text-[10px] font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60 truncate">
          {label}
        </span>
      )}
    </div>
  );
};

export default React.memo(function SummaryCards({ data }: { data: DashboardOverview }) {
  const { formatCurrency } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* Total Balance */}
      <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-5 lg:col-span-2 relative overflow-hidden group shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] transition-all hover:-translate-y-0.5">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <p className="font-display font-black text-xs uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70">
            {t("dashboard_page.total_balance")}
          </p>
          <div className="p-2.5 bg-[#39E75F] text-[#08110A] rounded-2xl border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-[20px] font-bold">
              account_balance_wallet
            </span>
          </div>
        </div>
        <div className="relative z-10">
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#08110A] dark:text-white tracking-tight">
            {formatCurrency(data.balance)}
          </h3>
          <ChangeBadge 
            change={data.balanceChange} 
            label={t("dashboard_page.vs_last_month")} 
            isZero={data.balance === 0 && data.income === 0 && data.expense === 0} 
          />
        </div>
      </div>

      {/* Income */}
      <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-5 lg:col-span-1 relative overflow-hidden group shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.3)] transition-all hover:-translate-y-0.5">
        <div className="flex justify-between items-start mb-4">
          <p className="font-display font-black text-xs uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70">
            {t("common.income")}
          </p>
          <div className="p-2.5 bg-[#39E75F] text-[#08110A] rounded-2xl border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-[20px] font-bold">
              south_west
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-[#08110A] dark:text-[#39E75F] tracking-tight">
            +{formatCurrency(data.income)}
          </h3>
          <ChangeBadge change={data.incomeChange} isZero={data.income === 0} />
        </div>
      </div>

      {/* Expense */}
      <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-5 lg:col-span-1 relative overflow-hidden group shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(251,146,60,0.3)] transition-all hover:-translate-y-0.5">
        <div className="flex justify-between items-start mb-4">
          <p className="font-display font-black text-xs uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70">
            {t("common.expense")}
          </p>
          <div className="p-2.5 bg-[#FB923C] text-[#08110A] rounded-2xl border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-[20px] font-bold">
              north_east
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-[#FB923C] dark:text-[#FB923C] tracking-tight">
            -{formatCurrency(data.expense)}
          </h3>
          <ChangeBadge change={data.expenseChange} isZero={data.expense === 0} />
        </div>
      </div>

      {/* Budget Usage */}
      <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-5 lg:col-span-1 relative overflow-hidden group shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(125,211,252,0.3)] transition-all hover:-translate-y-0.5">
        <div className="flex justify-between items-start mb-4">
          <p className="font-display font-black text-xs uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70">
            {t("dashboard_page.budget_usage")}
          </p>
          <div className="p-2.5 bg-[#7DD3FC] text-[#08110A] rounded-2xl border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-[20px] font-bold">
              pie_chart
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-end gap-2 mb-2">
            <h3 className="font-display text-xl sm:text-2xl font-black text-[#08110A] dark:text-white tracking-tight">
              {data.budgetUsage}%
            </h3>
            <p className="font-mono text-[10px] font-bold text-[#08110A]/60 dark:text-[#F5EFE6]/60 pb-1 truncate">
              {t("budget_page.of")} {formatCurrency(data.budgetLimit)}
            </p>
          </div>
          <div className="w-full bg-[#FAF8F5] dark:bg-white/10 rounded-full h-3 mt-3 overflow-hidden border-2 border-[#08110A] dark:border-white/20 p-0.5">
            <div
              className={`${
                data.budgetUsage > 90
                  ? "bg-[#EF4444]"
                  : data.budgetUsage > 75
                  ? "bg-[#FB923C]"
                  : "bg-[#39E75F]"
              } h-full rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(data.budgetUsage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
