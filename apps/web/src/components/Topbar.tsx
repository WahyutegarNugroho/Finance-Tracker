"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.info(t("common.search") + ': ' + searchQuery.trim());
      router.push(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-surface/80 backdrop-blur-md fixed top-0 right-0 w-full md:w-[calc(100%-260px)] h-16 z-40 border-b border-outline-variant/20 shadow-sm flex justify-between items-center px-4 md:px-6">
      <div className="flex items-center">
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary md:hidden">
          FinTrack
        </span>
      </div>
      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline text-xl">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 bg-surface-variant/30 border border-outline-variant/30 rounded-full focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-sm text-body-sm transition-all text-on-surface placeholder:text-outline"
            placeholder={t("common.search")}
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-on-surface-variant">
        <button onClick={toggleTheme} className="hover:text-primary transition-colors cursor-pointer p-2 rounded-full hover:bg-surface-variant/50">
          <span className="material-symbols-outlined" data-icon={theme === 'dark' ? 'light_mode' : 'dark_mode'}>
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button onClick={() => toast.info(t("common.no_notifications"))} className="hover:text-primary transition-colors cursor-pointer p-2 rounded-full hover:bg-surface-variant/50 relative">
          <span
            className="material-symbols-outlined"
            data-icon="notifications"
          >
            notifications
          </span>
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span> */}
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer ml-2 bg-surface-variant">
          <Image
            alt={user?.displayName || "User avatar"}
            className="w-full h-full object-cover"
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=random`}
            width={32}
            height={32}
          />
        </div>
      </div>
    </header>
  );
}
