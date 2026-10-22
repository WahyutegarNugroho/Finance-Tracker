"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getAvatarUrl } from "@/lib/formatting";

interface ProfileSectionProps {
  displayName: string;
  setDisplayName: (val: string) => void;
  currency: string;
  setCurrency: (val: string) => void;
  user: {
    email?: string | null;
    photoURL?: string | null;
    displayName?: string | null;
  } | null;
  onSave: () => void;
  isSaving: boolean;
}

export default function ProfileSection({
  displayName,
  setDisplayName,
  currency,
  setCurrency,
  user,
  onSave,
  isSaving,
}: ProfileSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#08110A]/10 dark:border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#39E75F]/20 border-2 border-[#08110A] dark:border-[#39E75F] flex items-center justify-center text-[#08110A] dark:text-[#39E75F]">
          <span className="material-symbols-outlined text-[20px]">person</span>
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-[#08110A] dark:text-[#F5EFE6]">
            {t("settings_page.profile_section.title")}
          </h3>
          <p className="text-xs font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider">
            Identity & Currency
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full border-2 border-[#08110A] dark:border-white/30 p-1 bg-[#FAF8F5] dark:bg-[#08110A] shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)]">
            <Image
              alt={displayName || "Profile avatar"}
              className="rounded-full object-cover w-full h-full"
              src={user?.photoURL || getAvatarUrl(displayName || user?.displayName)}
              width={96}
              height={96}
              sizes="96px"
              priority
            />
          </div>
        </div>

        <div className="flex-grow w-full space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70 mb-1.5">
              {t("settings_page.profile_section.full_name")}
            </label>
            <input 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full min-h-[44px] bg-[#FAF8F5] dark:bg-[#08110A] border-2 border-[#08110A]/20 dark:border-white/20 rounded-xl px-4 py-2.5 text-base font-medium text-[#08110A] dark:text-[#F5EFE6] focus:border-[#08110A] dark:focus:border-[#39E75F] focus:outline-none transition-all placeholder:text-[#08110A]/40" 
              type="text" 
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70 mb-1.5">
              {t("settings_page.profile_section.email")}
            </label>
            <input 
              id="profile-email"
              value={user?.email || ""}
              disabled
              aria-label={t("settings_page.profile_section.email")}
              className="w-full min-h-[44px] bg-[#08110A]/5 dark:bg-white/5 border-2 border-[#08110A]/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm text-[#08110A]/50 dark:text-[#F5EFE6]/50 outline-none cursor-not-allowed" 
              type="email" 
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-[#08110A]/10 dark:border-white/10 pt-6">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70 mb-1.5">
          {t("settings_page.profile_section.primary_currency")}
        </label>
        <div className="relative w-full sm:w-80">
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full min-h-[44px] appearance-none bg-[#FAF8F5] dark:bg-[#08110A] border-2 border-[#08110A]/20 dark:border-white/20 rounded-xl px-4 py-2.5 font-mono text-sm font-semibold text-[#08110A] dark:text-[#F5EFE6] focus:border-[#08110A] dark:focus:border-[#39E75F] focus:outline-none transition-all cursor-pointer pr-10"
          >
            <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
            <option value="USD">USD ($) - United States Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="JPY">JPY (¥) - Japanese Yen</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#08110A]/60 dark:text-[#F5EFE6]/60">
            expand_more
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#39E75F] text-[#08110A] font-bold text-sm border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_#FAF8F5] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#08110A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              {t("settings_page.profile_section.save_changes")}
            </>
          )}
        </button>
      </div>
    </section>
  );
}
