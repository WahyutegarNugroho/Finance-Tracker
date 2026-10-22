"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getAvatarUrl } from "@/lib/formatting";

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { name: t("common.dashboard"), icon: "dashboard", path: "/dashboard" },
    { name: t("common.transactions"), icon: "receipt_long", path: "/transactions" },
    { name: t("common.budget"), icon: "account_balance_wallet", path: "/budget" },
    { name: t("common.analytics"), icon: "analytics", path: "/analytics" },
  ];

  return (
    <aside className="bg-[#08110A] text-[#F5EFE6] fixed left-0 top-0 h-screen w-[260px] hidden md:flex flex-col border-r-2 border-white/10 z-50 p-6 gap-4 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="w-10 h-10 bg-[#39E75F] text-[#08110A] rounded-full flex items-center justify-center font-bold shadow-[0_0_12px_rgba(57,231,95,0.4)]">
          <span className="material-symbols-outlined text-[24px]">waterfall_chart</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-xl font-black uppercase tracking-tight text-white leading-none">
            FinTrack
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#39E75F] font-bold mt-1">
            Precision Wealth
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1 font-display uppercase tracking-wider text-xs font-black">
        {menuItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "bg-[#39E75F] text-[#08110A] border-2 border-[#39E75F] shadow-[3px_3px_0px_rgba(57,231,95,0.35)] flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 min-h-[44px]"
                  : "text-[#F5EFE6]/70 hover:text-white hover:bg-white/5 border-2 border-transparent flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 min-h-[44px]"
              }
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="mt-auto flex flex-col gap-2 font-display uppercase tracking-wider text-xs font-black">
        {/* Settings */}
        <Link
          href="/settings"
          aria-current={activePath === "/settings" ? "page" : undefined}
          className={
            activePath === "/settings"
              ? "bg-[#39E75F] text-[#08110A] border-2 border-[#39E75F] shadow-[3px_3px_0px_rgba(57,231,95,0.35)] flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 min-h-[44px]"
              : "text-[#F5EFE6]/70 hover:text-white hover:bg-white/5 border-2 border-transparent flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 min-h-[44px]"
          }
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={activePath === "/settings" ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            settings
          </span>
          <span>{t("common.settings")}</span>
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="text-[#EF4444] hover:bg-[#EF4444]/15 border-2 border-transparent hover:border-[#EF4444]/40 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer text-left w-full bg-transparent outline-none min-h-[44px]"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>{t("common.logout")}</span>
        </button>

        {/* User Profile Snippet */}
        <div className="mt-2 pt-4 border-t-2 border-white/10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#39E75F] bg-[#112015] shrink-0">
            <Image
              alt={user?.displayName || "User Profile"}
              className="w-full h-full object-cover"
              src={user?.photoURL || getAvatarUrl(user?.displayName)}
              width={40}
              height={40}
            />
          </div>
          <div className="flex-1 overflow-hidden font-sans">
            <p className="text-xs font-display font-bold uppercase truncate text-white">
              {user?.displayName || user?.email?.split("@")[0] || "Account"}
            </p>
            <p className="font-mono text-[10px] text-[#39E75F] truncate">
              {t("common.pro_plan")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
