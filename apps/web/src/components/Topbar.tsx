"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getAvatarUrl } from "@/lib/formatting";
import { toast } from "sonner";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      toast.info(t("common.search") + ": " + searchQuery.trim());
      router.push(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <header className="bg-[#FAF8F5]/90 dark:bg-[#08110A]/95 backdrop-blur-md fixed top-0 right-0 w-full md:w-[calc(100%-260px)] h-16 z-40 border-b-2 border-[#08110A]/10 dark:border-white/10 flex justify-between items-center px-4 md:px-6 select-none text-[#08110A] dark:text-[#F5EFE6]">
      <div className="flex items-center gap-2">
        <span className="font-display text-xl font-black uppercase text-[#08110A] dark:text-white md:hidden">
          FinTrack
        </span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#39E75F] text-[18px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/15 dark:border-white/10 rounded-full focus:border-[#39E75F] outline-none font-mono text-xs transition-all text-[#08110A] dark:text-white placeholder:text-[#08110A]/40 dark:placeholder:text-[#F5EFE6]/40 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
            placeholder={t("common.search")}
            type="text"
            aria-label={t("common.search")}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language switch button */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label="Toggle Language"
          className="min-h-[40px] px-3 rounded-full border-2 border-[#08110A]/20 dark:border-white/15 bg-white dark:bg-[#0D1910] text-[11px] font-display font-black uppercase text-[#08110A] dark:text-[#F5EFE6] hover:border-[#39E75F] hover:text-[#39E75F] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
        >
          {language.toUpperCase()}
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t("common.dark_mode")}
          className="w-10 h-10 rounded-full border-2 border-[#08110A]/20 dark:border-white/15 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] hover:border-[#39E75F] hover:text-[#39E75F] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]" suppressHydrationWarning>
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label={t("common.notifications")}
          onClick={() => toast.info(t("common.no_notifications"))}
          className="w-10 h-10 rounded-full border-2 border-[#08110A]/20 dark:border-white/15 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] hover:border-[#39E75F] hover:text-[#39E75F] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center cursor-pointer relative"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
        </button>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#39E75F] ml-1 bg-[#112015] shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
          <Image
            alt="Profile Avatar"
            className="w-full h-full object-cover"
            src={user?.photoURL || getAvatarUrl(user?.displayName)}
            width={36}
            height={36}
          />
        </div>
      </div>
    </header>
  );
}
