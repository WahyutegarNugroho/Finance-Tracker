"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";
import PillButton from "@/components/ui/PillButton";
import ScoutBadge from "@/components/ui/ScoutBadge";

export default function StoryShowcase() {
  const { language } = useLanguage();

  return (
    <section className="w-full bg-[#08110A] text-[#F5EFE6] py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#08110A] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: TACTILE FIELD NOTEBOOK / LEDGER CARD */}
          <div className="lg:col-span-6 relative">
            {/* Background offset drop-shadow block */}
            <div className="absolute inset-0 bg-[#39E75F] rounded-3xl translate-x-3 translate-y-3 -rotate-1" />

            {/* Main Tactile Ledger Card */}
            <div className="relative rounded-3xl border-2 border-[#08110A] bg-[#F5EFE6] text-[#08110A] p-6 sm:p-8 shadow-[8px_8px_0px_#08110A] rotate-1 space-y-6">
              {/* Header with woodcut stamp */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#08110A]/20">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#08110A]">
                  PASPOR KEDAULATAN KAS • 2026
                </span>
                <span className="font-mono text-[11px] font-bold text-[#08110A]/60">
                  NO. FT-9821-X
                </span>
              </div>

              {/* Real Photo / Scenic Inset */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#08110A] h-48 sm:h-56">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08110A]/80 via-transparent to-black/20" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-display text-xs font-bold uppercase tracking-wider">
                    {language === "id" ? "Fajar di Lembah Alokasi" : "Alpine Sunrise Allocation"}
                  </span>
                  <span className="font-mono text-[10px] bg-[#39E75F] text-[#08110A] px-2 py-0.5 rounded font-black">
                    SURPLUS +45%
                  </span>
                </div>
              </div>

              {/* Ledger Breakdown Spec */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#08110A]/10">
                  <span className="text-[#08110A]/70">PEMASUKAN BULANAN:</span>
                  <span className="font-bold text-[#08110A]">Rp 18.500.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#08110A]/10">
                  <span className="text-[#08110A]/70">KEBUTUHAN DASAR (50%):</span>
                  <span className="font-bold text-[#08110A]">-Rp 9.250.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#08110A]/10">
                  <span className="text-[#08110A]/70">LEISURE & HOBI (20%):</span>
                  <span className="font-bold text-[#08110A]">-Rp 3.700.000</span>
                </div>
                <div className="flex justify-between py-2 bg-[#39E75F]/20 px-3 rounded-lg border border-[#39E75F]">
                  <span className="font-bold text-[#08110A]">NET SURPLUS TABUNGAN (30%):</span>
                  <span className="font-black text-[#08110A]">+Rp 5.550.000</span>
                </div>
              </div>

              {/* Floating Rotated Stamps */}
              <div className="pt-2 flex items-center justify-between">
                <StickerBadge text="BEBAS UTANG KONSUMTIF" color="neon" size="sm" rotate={-4} />
                <span className="font-display font-black text-xs uppercase tracking-widest text-[#08110A]/60">
                  AUDITED BY DISCIPLINE
                </span>
              </div>
            </div>

            {/* Overlapping Floating Scout Badge on Left Bottom */}
            <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-6 hidden sm:block z-20">
              <ScoutBadge
                title="KEDAULATAN"
                subtitle="FINANSIAL"
                icon="shield"
                variant="yellow"
                size="md"
                rotate={-6}
              />
            </div>
          </div>

          {/* RIGHT: EDITORIAL PHILOSOPHY & NARRATIVE */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <StickerBadge text="ETIKA & FILOSOFI" color="forest" size="sm" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#39E75F]">
                • BUKAN APLIKASI PINJAMAN
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.02]">
              {language === "id" ? (
                <>
                  DISIPLIN NYATA. <br />
                  <span className="text-[#39E75F]">KEBEBASAN PIKIRAN.</span>
                </>
              ) : (
                <>
                  CLEAR NUMBERS. <br />
                  <span className="text-[#39E75F]">CALM DISCIPLINE.</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#F5EFE6]/80 leading-relaxed font-sans font-medium">
              {language === "id"
                ? "Keuangan yang sehat berakar dari mengetahui ke mana uang mengalir setiap hari. FinTrack membantu Anda mencatat pengeluaran tanpa iklan pinjaman atau promosi produk keuangan."
                : "A healthy financial routine starts with knowing where your money goes every day. FinTrack helps you track daily spending without loan advertisements or promoted financial products."}
            </p>

            <p className="text-sm sm:text-base text-[#F5EFE6]/80 leading-relaxed font-sans font-medium">
              {language === "id"
                ? "Saat batas belanja per kategori dipatuhi dan surplus tabungan terlihat jelas di grafik, Anda dapat merencanakan kebutuhan bulanan dengan tenang. Anda yang memegang kendali atas catatan keuangan Anda."
                : "When category spending stays within limits and net savings are visible on your dashboard, you can plan monthly expenses with confidence. You stay in control of your financial records."}
            </p>

            {/* 3 Metric Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
              <div>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#39E75F] block leading-none">
                  0
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-[#F5EFE6]/70 uppercase tracking-wider mt-1 block">
                  {language === "id" ? "Iklan Pinjol" : "Loan Ads"}
                </span>
              </div>

              <div>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#FDE047] block leading-none">
                  {language === "id" ? "1-Klik" : "1-Click"}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-[#F5EFE6]/70 uppercase tracking-wider mt-1 block">
                  {language === "id" ? "Ekspor CSV" : "CSV Export"}
                </span>
              </div>

              <div>
                <span className="font-display text-2xl sm:text-3xl font-black text-white block leading-none">
                  100%
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-[#F5EFE6]/70 uppercase tracking-wider mt-1 block">
                  {language === "id" ? "Data Milik Anda" : "Data Ownership"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <PillButton href="/register" variant="neon" size="lg">
                {language === "id" ? "Mulai Catat Transaksi" : "Start Tracking Ledger"}
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
