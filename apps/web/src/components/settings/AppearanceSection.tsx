"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function AppearanceSection() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="bg-surface border border-outline-variant/20 rounded-xl p-6 shadow-sm">
      <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">palette</span>
        {t("settings_page.appearance_section.title")}
      </h3>
      
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between p-4 border border-outline-variant/30 rounded-lg bg-surface-variant/20 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-variant/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface">dark_mode</span>
          </div>
          <div>
            <h4 className="font-body-lg text-body-lg font-medium text-on-surface">{t("common.dark_mode")}</h4>
            <p className="font-body-sm text-body-sm text-outline">{t("settings_page.appearance_section.dark_mode_desc")}</p>
          </div>
        </div>
        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            className="sr-only peer" 
            type="checkbox" 
            checked={theme === 'dark'} 
            onChange={toggleTheme} 
            aria-label={t("common.dark_mode")}
          />
          <div className="w-11 h-6 bg-surface-variant peer-focus-visible:ring-2 peer-focus-visible:ring-primary/45 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-between p-4 border border-outline-variant/30 rounded-lg bg-surface-variant/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-variant/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface">language</span>
          </div>
          <div>
            <h4 className="font-body-lg text-body-lg font-medium text-on-surface">{t("settings_page.appearance_section.language")}</h4>
            <p className="font-body-sm text-body-sm text-outline">{t("settings_page.appearance_section.language_desc")}</p>
          </div>
        </div>
        <div className="relative">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
            aria-label={t("settings_page.appearance_section.language")}
            className="appearance-none bg-surface-variant/30 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer pr-10"
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">expand_more</span>
        </div>
      </div>
    </section>
  );
}
