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

const FilterBar = React.memo(function FilterBar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  onExport,
  onResetPagination,
}: FilterBarProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-4 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(57,231,95,0.25)] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      {/* Search */}
      <div className="relative w-full lg:w-96">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/50 dark:text-[#F5EFE6]/50 text-[20px]">
          search
        </span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] dark:bg-[#08110A] border-2 border-[#08110A] dark:border-white/20 rounded-full font-mono text-xs text-[#08110A] dark:text-white placeholder:text-[#08110A]/40 dark:placeholder:text-[#F5EFE6]/40 focus:outline-none focus:ring-2 focus:ring-[#39E75F] transition-all min-h-[40px]"
          placeholder={t("transactions_page.search_placeholder")}
          type="text"
          aria-label={t("common.search")}
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Type Filters as Pill Buttons */}
        <div className="flex bg-[#FAF8F5] dark:bg-[#08110A] p-1 rounded-full border-2 border-[#08110A] dark:border-white/20">
          {[
            { value: "all", label: t("transactions_page.filter_all_types") || "All" },
            { value: "income", label: t("common.income") || "Income" },
            { value: "expense", label: t("common.expense") || "Expense" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTypeFilter(opt.value);
                onResetPagination();
              }}
              className={`px-4 py-1.5 rounded-full font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                typeFilter === opt.value 
                  ? "bg-[#39E75F] text-[#08110A] border border-[#08110A] shadow-[1px_1px_0px_#08110A]" 
                  : "text-[#08110A]/60 dark:text-[#F5EFE6]/60 hover:text-[#08110A] dark:hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        <div className="w-[2px] h-6 bg-[#08110A]/20 dark:bg-white/20 mx-1 hidden lg:block"></div>
        
        {/* Export */}
        <button 
          onClick={onExport}
          className="min-h-[40px] flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-full hover:bg-[#39E75F] hover:text-[#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:outline-none transition-all font-display font-black text-xs uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] ml-auto lg:ml-0 cursor-pointer shadow-[2px_2px_0px_#08110A]"
        >
          <span className="material-symbols-outlined text-[18px] font-bold">
            download
          </span>
          {t("transactions_page.export_csv")}
        </button>
      </div>
    </div>
  );
});

export default FilterBar;
