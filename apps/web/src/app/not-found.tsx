"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import StickerBadge from "@/components/ui/StickerBadge";
import RetroLandscape from "@/components/ui/RetroLandscape";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname || "/unknown");
  const [timestamp, setTimestamp] = useState("2026-10-22 16:15:00 UTC");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeof window !== "undefined") {
        setCurrentPath(window.location.pathname || pathname || "/unmapped");
        const now = new Date();
        setTimestamp(
          `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]} UTC`
        );
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Robust fallback translator that guarantees no raw dot-keys are ever displayed
  const getT = (key: string, idDefault: string, enDefault: string): string => {
    const val = t(key);
    if (!val || val === key || val.startsWith("not_found.")) {
      return language === "id" ? idDefault : enDefault;
    }
    return val;
  };

  const toggleLang = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  const quickLinks = [
    {
      href: "/dashboard",
      icon: "dashboard",
      title: getT("not_found.quick_dashboard", "Ringkasan Dasbor", "Dashboard Overview"),
      desc: getT("not_found.quick_dashboard_desc", "Kekayaan bersih & arus kas", "Net worth & cash flow"),
      color: "bg-[#39E75F]/20 text-[#166534] dark:text-[#39E75F] border-[#08110A] dark:border-[#39E75F]/50",
    },
    {
      href: "/transactions",
      icon: "receipt_long",
      title: getT("not_found.quick_transactions", "Buku Transaksi", "Ledger Book"),
      desc: getT("not_found.quick_transactions_desc", "Pencatatan & riwayat mutasi", "Transaction history"),
      color: "bg-[#7DD3FC]/20 text-[#0369A1] dark:text-[#7DD3FC] border-[#08110A] dark:border-[#7DD3FC]/50",
    },
    {
      href: "/budget",
      icon: "pie_chart",
      title: getT("not_found.quick_budget", "Anggaran Bulanan", "Budget Planner"),
      desc: getT("not_found.quick_budget_desc", "Batas pengeluaran kategori", "Category spending limits"),
      color: "bg-[#FB923C]/20 text-[#C2410C] dark:text-[#FB923C] border-[#08110A] dark:border-[#FB923C]/50",
    },
    {
      href: "/analytics",
      icon: "monitoring",
      title: getT("not_found.quick_analytics", "Studio Analitik", "Analytics Studio"),
      desc: getT("not_found.quick_analytics_desc", "Visualisasi tren keuangan", "Visual cashflow trends"),
      color: "bg-[#FDE047]/20 text-[#A16207] dark:text-[#FDE047] border-[#08110A] dark:border-[#FDE047]/50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#08110A] text-[#08110A] dark:text-[#F5EFE6] flex flex-col justify-between relative overflow-hidden transition-colors selection:bg-[#39E75F] selection:text-[#08110A]">
      {/* AMBIENT BACKGROUND LEDGER WATERMARK */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #08110A, #08110A 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #08110A, #08110A 1px, transparent 1px, transparent 24px)`,
        }}
      />

      {/* TOP HEADER: BRAND EMBLEM & CONTROLS */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b-2 border-[#08110A]/10 dark:border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-[#39E75F] flex items-center justify-center text-[#08110A] group-hover:scale-105 transition-transform border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]">
            <span className="material-symbols-outlined text-[22px] font-bold">waterfall_chart</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#08110A] dark:text-white leading-none">
              FinTrack
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#166534] dark:text-[#39E75F] font-mono font-bold leading-none mt-1">
              Precision Wealth
            </span>
          </div>
        </Link>

        {/* Right utility toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="h-9 px-3 rounded-full border-2 border-[#08110A] dark:border-white/20 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#08110A] hover:bg-black/5 dark:hover:bg-white/10 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Toggle Language"
          >
            {language === "en" ? "ID" : "EN"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border-2 border-[#08110A] dark:border-white/20 bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] flex items-center justify-center shadow-[2px_2px_0px_#08110A] hover:bg-black/5 dark:hover:bg-white/10 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-[18px]">
              {mounted && theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#08110A] bg-[#39E75F] hover:bg-[#2ed652] text-[#08110A] font-display text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#08110A] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">dashboard</span>
            <span>{getT("not_found.back_to_dashboard", "Ke Dashboard", "Go to Dashboard")}</span>
          </Link>
        </div>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 text-center max-w-4xl mx-auto w-full">
        {/* Overhead badge sticker */}
        <div className="mb-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <StickerBadge
            text={getT("not_found.badge", "ERR // 404 TIDAK DITEMUKAN", "ERR // 404 UNMAPPED")}
            color="orange"
            rotate={-2}
            size="md"
            icon="warning"
          />
        </div>

        {/* Massive 404 typography with overlapping cancellation stamp */}
        <div className="relative select-none my-1 sm:my-2 flex flex-col items-center justify-center">
          <span
            style={{ fontSize: "clamp(6.5rem, 18vw, 13rem)", lineHeight: 0.9 }}
            className="font-display font-black tracking-tighter text-[#08110A] dark:text-white select-none drop-shadow-[5px_5px_0px_#39E75F] transition-all"
            aria-hidden="true"
          >
            404
          </span>

          {/* Stamped cancellation badge */}
          <div className="-mt-3 sm:-mt-6 z-10 rotate-[-4deg]">
            <div className="px-4 py-1 sm:py-1.5 bg-[#FB923C] text-[#08110A] border-2 border-[#08110A] rounded-full shadow-[3px_3px_0px_#08110A] font-display font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] font-bold">block</span>
              <span>{getT("not_found.stamp_void", "BATAL // VOID", "VOID // UNRECONCILED")}</span>
            </div>
          </div>
        </div>

        {/* Headline & Description */}
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#08110A] dark:text-white max-w-2xl mt-4 mb-2">
          {getT("not_found.title", "Koordinat Buku Kas Tidak Seimbang", "Unbalanced Ledger Coordinate")}
        </h1>
        <p className="font-sans text-xs sm:text-base text-[#08110A]/75 dark:text-[#F5EFE6]/75 max-w-xl mx-auto leading-relaxed font-medium mb-6">
          {getT("not_found.description", "Entri yang Anda cari tidak ditemukan dalam catatan buku kas aktif atau mungkin telah dipindahkan.", "The entry you are searching for does not balance with any active ledger record or has been retired.")}
        </p>

        {/* TACTILE THERMAL RECEIPT / AUDIT SLIP */}
        <div className="w-full max-w-md mx-auto mb-8 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-2xl shadow-[5px_5px_0px_#08110A] dark:shadow-[5px_5px_0px_rgba(57,231,95,0.3)] overflow-hidden text-left font-mono">
          {/* Slip Header */}
          <div className="px-4 py-2.5 bg-[#FAF8F5] dark:bg-white/5 border-b-2 border-[#08110A] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#08110A] dark:text-[#39E75F]">
                receipt_long
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6]">
                {getT("not_found.audit_slip_title", "SLIP AUDIT TRANSAKSI", "TRANSACTION AUDIT SLIP")}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#991B1B] dark:text-[#FB923C] bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded border border-[#991B1B]/30">
              {getT("not_found.slip_no", "SLIP #404-BATAL", "SLIP #404-VOID")}
            </span>
          </div>

          {/* Slip Table Body */}
          <div className="p-4 space-y-2 text-xs divide-y divide-[#08110A]/10 dark:divide-white/10">
            <div className="flex justify-between items-center pt-1">
              <span className="text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider text-[10px]">
                {getT("not_found.code_label", "KODE STATUS", "STATUS CODE")}
              </span>
              <span className="font-bold text-[#991B1B] dark:text-[#FB923C]">
                {getT("not_found.code_value", "404_TIDAK_DITEMUKAN", "404_PAGE_NOT_FOUND")}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider text-[10px]">
                {getT("not_found.entry_label", "STATUS REKAMAN", "RECORD STATUS")}
              </span>
              <span className="font-bold text-[#08110A] dark:text-[#F5EFE6]">
                {getT("not_found.entry_value", "JALUR TIDAK TEREKONSILIASI", "UNRECONCILED PATH")}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider text-[10px]">
                PATH
              </span>
              <span className="font-bold text-[#166534] dark:text-[#39E75F] max-w-[220px] truncate" title={currentPath}>
                {currentPath}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider text-[10px]">
                {getT("not_found.time_label", "WAKTU AUDIT", "AUDIT STAMP")}
              </span>
              <span className="font-medium text-[#08110A]/80 dark:text-[#F5EFE6]/80 text-[11px]">
                {timestamp}
              </span>
            </div>

            <div className="pt-2 text-[10px] text-[#08110A]/60 dark:text-[#F5EFE6]/60 leading-normal">
              <span className="font-bold text-[#08110A] dark:text-[#F5EFE6]">
                {getT("not_found.reason_label", "CATATAN", "MEMO")}:{" "}
              </span>
              {getT("not_found.reason_value", "Koordinat URL berada di luar buku kas yang terdaftar", "URL coordinate points outside mapped books")}
            </div>
          </div>

          {/* Slip Decorative Barcode */}
          <div className="px-4 py-2 bg-[#FAF8F5] dark:bg-white/5 border-t-2 border-dashed border-[#08110A]/20 dark:border-white/10 flex flex-col items-center justify-center gap-1 select-none">
            <div className="tracking-[4px] font-mono text-sm opacity-60 font-black text-[#08110A] dark:text-white">
              ||| | |||| || ||| ||||| | ||| ||||
            </div>
            <span className="text-[9px] tracking-widest text-[#08110A]/40 dark:text-[#F5EFE6]/40 uppercase">
              RECONCILE-FAIL-404-FINTRACK
            </span>
          </div>
        </div>

        {/* PRIMARY CALL TO ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md mx-auto mb-10">
          <Link
            href="/dashboard"
            className="min-h-[46px] flex-1 min-w-[190px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider px-5 py-2.5 rounded-full border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">dashboard</span>
            <span>{getT("not_found.back_to_dashboard", "Ke Dashboard", "Go to Dashboard")}</span>
          </Link>

          <Link
            href="/"
            className="min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[#08110A] dark:border-white/20 bg-white dark:bg-[#0D1910] hover:bg-black/5 dark:hover:bg-white/10 text-[#08110A] dark:text-[#F5EFE6] font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>{getT("not_found.back_to_home", "Halaman Utama", "Back to Home")}</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="min-h-[46px] px-4 py-2.5 rounded-full border-2 border-[#08110A]/20 dark:border-white/20 hover:bg-[#08110A]/5 dark:hover:bg-white/5 text-[#08110A] dark:text-[#F5EFE6] font-display text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>{getT("not_found.go_back", "Halaman Sebelumnya", "Previous Page")}</span>
          </button>
        </div>

        {/* QUICK LEDGER SHORTCUTS STRIP */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="h-[2px] w-8 sm:w-16 bg-[#08110A]/15 dark:bg-white/15" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#08110A]/60 dark:text-[#F5EFE6]/60">
              {getT("not_found.quick_destinations", "Navigasi Cepat Buku Kas", "Quick Ledger Navigation")}
            </span>
            <div className="h-[2px] w-8 sm:w-16 bg-[#08110A]/15 dark:bg-white/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-3.5 bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-2xl shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(57,231,95,0.2)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#39E75F] transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${item.color}`}>
                    <span className="material-symbols-outlined text-[17px] font-bold">
                      {item.icon}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-[#08110A] dark:text-white group-hover:text-[#39E75F] transition-colors">
                    {item.title}
                  </h2>
                  <p className="font-sans text-[11px] text-[#08110A]/65 dark:text-[#F5EFE6]/65 mt-0.5 leading-normal line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#08110A]/40 dark:text-[#F5EFE6]/40 group-hover:text-[#39E75F] transition-colors">
                  <span>Open</span>
                  <span className="material-symbols-outlined text-[13px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* BOTTOM ENGRAVING HORIZON & FOOTER NOTE */}
      <footer className="relative z-10 w-full mt-8">
        <RetroLandscape
          variant="footer"
          className="opacity-20 dark:opacity-25 pointer-events-none"
        />
        <div className="bg-[#08110A] text-[#F5EFE6] py-3.5 px-4 text-center border-t-2 border-white/10">
          <p className="font-mono text-[10px] sm:text-[11px] text-[#F5EFE6]/50 uppercase tracking-widest">
            {getT("not_found.footer_note", "FINTRACK LEDGER SYSTEM • MANAJEMEN KEKAYAAN PRESISI • TIDAK ADA DISKREPANSI DITOLERANSI", "FINTRACK LEDGER SYSTEM • PRECISION PERSONAL WEALTH • ZERO DISCREPANCIES TOLERATED")}
          </p>
        </div>
      </footer>
    </div>
  );
}
