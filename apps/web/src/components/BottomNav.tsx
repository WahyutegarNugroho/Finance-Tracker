"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface BottomNavProps {
  activePath: string;
}

export default function BottomNav({ activePath }: BottomNavProps) {
  const { t } = useLanguage();
  const menuItems = [
    { name: t("common.dashboard"), icon: 'home', path: '/dashboard' },
    { name: t("common.transactions"), icon: 'list_alt', path: '/transactions' },
    { name: t("common.budget"), icon: 'account_balance_wallet', path: '/budget' },
    { name: t("common.analytics"), icon: 'query_stats', path: '/analytics' },
    { name: t("common.settings"), icon: 'settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full md:hidden z-50 h-[68px] bg-[#FAF8F5]/95 dark:bg-[#08110A]/95 backdrop-blur-md border-t-2 border-[#08110A]/15 dark:border-white/10 flex justify-around items-center px-2 pb-safe select-none">
      {menuItems.map((item) => {
        const isActive = activePath === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-3 py-1 bg-[#39E75F] text-[#08110A] font-black rounded-xl border border-[#08110A] shadow-[2px_2px_0px_#08110A] transition-transform active:scale-95"
                : "flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 py-1 text-[#08110A]/70 dark:text-[#F5EFE6]/70 hover:text-[#08110A] dark:hover:text-white rounded-xl transition-colors font-bold"
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-display text-[9px] uppercase tracking-wider mt-0.5">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
