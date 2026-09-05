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
    <section className="bg-surface border border-outline-variant/20 rounded-xl p-6 shadow-sm">
      <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">person</span>
        {t("settings_page.profile_section.title")}
      </h3>
      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8">
        <div className="relative">
          <Image
            alt={displayName || "Profile avatar"}
            className="rounded-full border-2 border-primary/20 shadow-sm object-cover bg-surface-variant"
            src={user?.photoURL || getAvatarUrl(displayName || user?.displayName)}
            width={96}
            height={96}
            sizes="96px"
            priority
          />
        </div>
        <div className="flex-grow w-full">
          <div className="mb-4">
            <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase">
              {t("settings_page.profile_section.full_name")}
            </label>
            <input 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-surface-variant/30 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-lg text-body-lg text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              type="text" required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block font-label-caps text-label-caps text-outline mb-1 uppercase">
              {t("settings_page.profile_section.email")}
            </label>
            <input 
              id="profile-email"
              value={user?.email || ""}
              disabled
              aria-label={t("settings_page.profile_section.email")}
              className="w-full bg-surface-variant/10 border border-outline-variant/10 rounded-lg px-4 py-2 font-body-lg text-body-lg text-outline outline-none cursor-not-allowed" 
              type="email" 
            />
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/20 pt-6">
        <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase">
          {t("settings_page.profile_section.primary_currency")}
        </label>
        <div className="relative w-full sm:w-1/2">
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full appearance-none bg-surface-variant/30 border border-outline-variant/30 rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer pr-10"
          >
            <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
            <option value="USD">USD ($) - United States Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="JPY">JPY (¥) - Japanese Yen</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
            expand_more
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-lg hover:scale-[1.02] hover:bg-primary-container focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:outline-none transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
          ) : (
            t("settings_page.profile_section.save_changes")
          )}
        </button>
      </div>
    </section>
  );
}
