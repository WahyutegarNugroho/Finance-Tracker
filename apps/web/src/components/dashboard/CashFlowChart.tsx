"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function CashFlowChart() {
  const { language, t } = useLanguage();

  return (
    <div className="glass-card rounded-xl p-6 lg:col-span-2 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {t("dashboard_page.charts.cash_flow")}
        </h3>
        <select className="bg-transparent border-none text-on-surface-variant font-body-sm text-body-sm focus:ring-0 cursor-pointer pr-8 outline-none">
          <option>{language === 'id' ? '6 Bulan Terakhir' : 'Last 6 Months'}</option>
          <option>{t("analytics_page.time_range.this_year")}</option>
        </select>
      </div>
      {/* Chart Placeholder Layout (CSS simulated) */}
      <div className="flex-1 min-h-[240px] relative flex items-end gap-4 px-2 pb-6 pt-10 border-b border-l border-outline-variant/30">
        {/* Y Axis labels */}
        <div className="absolute left-[-40px] h-full flex flex-col justify-between text-label-caps text-outline py-6 pb-8 text-[10px]">
          <span>10M</span>
          <span>5M</span>
          <span>0</span>
        </div>
        {/* Grid lines */}
        <div className="absolute left-0 top-10 w-full border-t border-dashed border-outline-variant/20"></div>
        <div className="absolute left-0 top-[50%] w-full border-t border-dashed border-outline-variant/20"></div>
        {/* Bar groups */}
        <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
          <div className="w-1/3 bg-secondary-container h-[40%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <div className="w-1/3 bg-error-container h-[20%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <span className="absolute -bottom-6 text-label-caps text-outline text-[10px]">
            {language === 'id' ? 'Jan' : 'Jan'}
          </span>
        </div>
        <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
          <div className="w-1/3 bg-secondary-container h-[50%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <div className="w-1/3 bg-error-container h-[30%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <span className="absolute -bottom-6 text-label-caps text-outline text-[10px]">
            {language === 'id' ? 'Feb' : 'Feb'}
          </span>
        </div>
        <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
          <div className="w-1/3 bg-secondary-container h-[70%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <div className="w-1/3 bg-error-container h-[45%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <span className="absolute -bottom-6 text-label-caps text-outline text-[10px]">
            {language === 'id' ? 'Mar' : 'Mar'}
          </span>
        </div>
        <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
          <div className="w-1/3 bg-secondary-container h-[60%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <div className="w-1/3 bg-error-container h-[35%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <span className="absolute -bottom-6 text-label-caps text-outline text-[10px]">
            {language === 'id' ? 'Apr' : 'Apr'}
          </span>
        </div>
        <div className="flex-1 flex justify-center items-end gap-1 relative z-10 group cursor-pointer">
          <div className="w-1/3 bg-secondary-container h-[85%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <div className="w-1/3 bg-error-container h-[50%] rounded-t-sm group-hover:opacity-80 transition-opacity"></div>
          <span className="absolute -bottom-6 text-label-caps text-outline text-primary font-bold text-[10px]">
            {language === 'id' ? 'Mei' : 'May'}
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
            {t("common.income")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error-container"></div>
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
            {t("common.expense")}
          </span>
        </div>
      </div>
    </div>
  );
}
