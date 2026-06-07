"use client";

import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const menuItems = [
    { name: t("common.dashboard"), icon: 'dashboard', path: '/dashboard' },
    { name: t("common.transactions"), icon: 'receipt_long', path: '/transactions' },
    { name: t("common.budget"), icon: 'account_balance_wallet', path: '/budget' },
    { name: t("common.analytics"), icon: 'analytics', path: '/analytics' },
  ];

  return (
    <aside className="bg-surface/95 backdrop-blur-xl fixed left-0 top-0 h-screen w-[260px] hidden md:flex flex-col border-r border-outline-variant/20 shadow-sm z-50 p-6 gap-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center font-bold text-xl">
          FT
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            FinTrack
          </h1>
          <p className="font-label-caps text-label-caps text-outline">
            Wealth Management
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={
                isActive
                  ? "text-primary font-bold flex items-center gap-3 px-4 py-3 bg-primary/10 rounded-lg cursor-pointer transition-all duration-200"
                  : "text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 transition-all duration-200 hover:scale-[1.02] rounded-lg cursor-pointer"
              }
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-body-sm text-body-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="mt-auto">
        {/* Settings */}
        <Link
          href="/settings"
          className={
            activePath === '/settings'
              ? "text-primary font-bold flex items-center gap-3 px-4 py-3 bg-primary/10 rounded-lg cursor-pointer transition-all duration-200"
              : "text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 transition-all duration-200 hover:scale-[1.02] rounded-lg cursor-pointer"
          }
        >
          <span className="material-symbols-outlined" style={activePath === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
          <span className="font-body-sm text-body-sm">{t("common.settings")}</span>
        </Link>

        {/* User Profile Snippet in Sidebar */}
        <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-surface-variant shrink-0">
            <Image
              alt={user?.displayName || "User Profile"}
              className="w-full h-full object-cover"
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=random`}
              width={40}
              height={40}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-body-sm text-body-sm font-semibold truncate text-on-surface">
              {user?.displayName || "John Doe"}
            </p>
            <p className="font-label-caps text-label-caps text-outline truncate">
              {t("common.language") === "Bahasa" ? "Akun Pro" : "Pro Plan"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
