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
    <nav className="fixed bottom-0 left-0 w-full md:hidden z-50 h-[64px] bg-surface/95 border-t border-outline-variant/20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 pb-safe">
      {menuItems.map((item) => {
        const isActive = activePath === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex flex-col items-center text-primary font-bold active:bg-primary/5 p-2 rounded-lg"
                : "flex flex-col items-center text-on-surface-variant hover:text-primary active:bg-primary/5 p-2 rounded-lg transition-colors"
            }
          >
            <span
              className="material-symbols-outlined mb-1"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-[10px] uppercase">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
