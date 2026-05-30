"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  onExport: () => void;
  onResetPagination: () => void;
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  onExport,
  onResetPagination,
}: FilterBarProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      {/* Search */}
      <div className="relative w-full lg:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-background placeholder:text-outline"
          placeholder={t("transactions_page.search_placeholder")}
          type="text"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Type Filter */}
        <div className="relative group">
          <select 
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              onResetPagination();
            }}
            className="appearance-none flex items-center gap-2 pl-3 pr-8 py-2 bg-surface border border-outline-variant/30 rounded-lg hover:bg-surface-variant/30 transition-colors font-body-sm text-body-sm text-on-surface-variant focus:outline-none"
          >
            <option value="all">{t("transactions_page.filter_all_types")}</option>
            <option value="income">{t("common.income")}</option>
            <option value="expense">{t("common.expense")}</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">
            expand_more
          </span>
        </div>
        
        <div className="w-[1px] h-6 bg-outline-variant/30 mx-1 hidden lg:block"></div>
        
        {/* Export */}
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant/30 rounded-lg hover:bg-surface-variant/30 transition-colors font-body-sm text-body-sm text-primary font-medium ml-auto lg:ml-0"
        >
          <span className="material-symbols-outlined text-[18px]">
            download
          </span>
          {t("transactions_page.export_csv")}
        </button>
      </div>
    </div>
  );
}
