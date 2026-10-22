"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function TickerBar() {
  const { language } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const tickerItems = [
    { label: language === "id" ? "PENCATATAN PENGELUARAN CEPAT" : "FAST EXPENSE LOGGING", icon: "bolt" },
    { label: language === "id" ? "NOL AKSES PERBANKAN • 100% PRIVAT" : "ZERO BANK CREDENTIALS • 100% PRIVATE", icon: "shield" },
    { label: language === "id" ? "BATAS ANGGARAN PER KATEGORI" : "CATEGORY BUDGET GUARDRAILS", icon: "notifications_active" },
    { label: language === "id" ? "GRAFIK ARUS KAS WATERFALL" : "MONTHLY CASHFLOW RADAR", icon: "analytics" },
    { label: language === "id" ? "EKSPOR CSV SATU KLIK" : "1-CLICK CLEAN CSV EXPORT", icon: "file_download" },
    { label: language === "id" ? "APLIKASI PWA OFFLINE-READY" : "OFFLINE-READY PWA APP", icon: "offline_pin" },
    { label: language === "id" ? "DUKUNGAN RUPIAH / USD / EUR" : "MULTI-CURRENCY IDR / USD / EUR", icon: "currency_exchange" },
    { label: language === "id" ? "PERINGATAN DINI LIMIT ANGGARAN" : "PROACTIVE LIMIT WARNINGS", icon: "speed" },
  ];

  return (
    <div
      role="region"
      aria-label={language === "id" ? "Pita Pengumuman Fitur" : "Feature Highlights Strip"}
      className="w-full bg-[#7DD3FC] text-[#08110A] py-3.5 border-y-2 border-[#08110A] overflow-hidden select-none font-display font-black text-xs uppercase tracking-widest shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] relative group"
    >
      <div
        className={`animate-marquee motion-reduce:animate-none items-center gap-8 ${
          isPaused ? "[animation-play-state:paused]" : "hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        }`}
      >
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 shrink-0 px-2">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-[#08110A] leading-none">
              {item.icon}
            </span>
            <span>{item.label}</span>
            <span aria-hidden="true" className="text-black/30 font-serif text-lg leading-none">✦</span>
          </div>
        ))}
      </div>

      {/* Accessible Pause / Play Toggle Button for SC 2.2.2 */}
      <button
        type="button"
        onClick={() => setIsPaused(!isPaused)}
        aria-label={isPaused ? (language === "id" ? "Jalankan animasi pita" : "Resume ticker animation") : (language === "id" ? "Jeda animasi pita" : "Pause ticker animation")}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#08110A] text-[#7DD3FC] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#7DD3FC]"
      >
        <span className="material-symbols-outlined text-[16px]">
          {isPaused ? "play_arrow" : "pause"}
        </span>
      </button>
    </div>
  );
}
