"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function AppearanceSection() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#08110A]/10 dark:border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#39E75F]/20 border-2 border-[#08110A] dark:border-[#39E75F] flex items-center justify-center text-[#08110A] dark:text-[#39E75F]">
          <span className="material-symbols-outlined text-[20px]">palette</span>
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-[#08110A] dark:text-[#F5EFE6]">
            {t("settings_page.appearance_section.title")}
          </h3>
          <p className="text-xs font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider">
            {language === "id" ? "Tema & Bahasa Antarmuka" : "Theme & Interface Language"}
          </p>
        </div>
      </div>
      
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-2 border-[#08110A]/15 dark:border-white/15 rounded-2xl bg-[#FAF8F5] dark:bg-[#08110A] mb-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/20 dark:border-white/20 flex items-center justify-center text-[#08110A] dark:text-[#39E75F]">
            <span className="material-symbols-outlined text-[22px]">dark_mode</span>
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-[#08110A] dark:text-[#F5EFE6]">
              {t("common.dark_mode")}
            </h4>
            <p className="text-xs font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60">
              {t("settings_page.appearance_section.dark_mode_desc")}
            </p>
          </div>
        </div>
        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[56px] justify-center">
          <input 
            className="sr-only peer" 
            type="checkbox" 
            checked={mounted ? theme === 'dark' : false} 
            onChange={toggleTheme} 
            aria-label={t("common.dark_mode")}
          />
          <div className="w-14 h-8 bg-[#08110A]/20 dark:bg-white/20 peer-focus-visible:ring-2 peer-focus-visible:ring-[#39E75F] rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-[#08110A] after:content-[''] after:absolute after:top-[11px] after:left-[4px] after:bg-white after:border-2 after:border-[#08110A] after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#39E75F] dark:peer-checked:bg-[#39E75F] border-2 border-[#08110A]"></div>
        </label>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-2 border-[#08110A]/15 dark:border-white/15 rounded-2xl bg-[#FAF8F5] dark:bg-[#08110A]">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/20 dark:border-white/20 flex items-center justify-center text-[#08110A] dark:text-[#39E75F]">
            <span className="material-symbols-outlined text-[22px]">language</span>
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-[#08110A] dark:text-[#F5EFE6]">
              {t("settings_page.appearance_section.language")}
            </h4>
            <p className="text-xs font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60">
              {t("settings_page.appearance_section.language_desc")}
            </p>
          </div>
        </div>
        <div className="relative">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
            aria-label={t("settings_page.appearance_section.language")}
            className="appearance-none min-h-[44px] bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/20 dark:border-white/20 rounded-xl px-4 py-2 font-mono text-sm font-semibold text-[#08110A] dark:text-[#F5EFE6] focus:border-[#08110A] dark:focus:border-[#39E75F] focus:outline-none transition-all cursor-pointer pr-10"
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#08110A]/60 dark:text-[#F5EFE6]/60 text-[18px]">expand_more</span>
        </div>
      </div>
    </section>
  );
}
