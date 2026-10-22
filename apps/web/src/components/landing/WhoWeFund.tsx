"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";

export default function WhoWeFund() {
  const { language } = useLanguage();

  const personas = [
    {
      num: "01",
      tag: language === "id" ? "BUFFER KAS 6 BULAN" : "6-MONTH CASH BUFFER",
      title: language === "id" ? "FREELANCER & KREATOR MANDIRI" : "FREELANCERS & INDEPENDENTS",
      desc:
        language === "id"
          ? "Pendapatan fluktuatif membutuhkan pemisahan tegas antara saldo proyek, invoice tertunda, dan biaya hidup harian. FinTrack menghindarkan Anda dari ilusi kas melimpah."
          : "Variable cash flow requires strict separation between project payouts, pending invoices, and daily living costs. FinTrack prevents the illusion of temporary surplus.",
      points:
        language === "id"
          ? ["Pemisahan kas proyek dan operasional", "Pencatatan pengeluaran harian < 3 detik", "Pantauan rasio tabungan cadangan"]
          : ["Project vs living expense segregation", "Sub-3-second daily expense logging", "Visual cash buffer ratio tracker"],
      badgeVariant: "neon" as const,
    },
    {
      num: "02",
      tag: language === "id" ? "TRANSPARANSI RUMAH TANGGA" : "HOUSEHOLD TRANSPARENCY",
      title: language === "id" ? "KELUARGA & PASANGAN CERDAS" : "SMART FAMILIES & COUPLES",
      desc:
        language === "id"
          ? "Kelola pos belanja kebutuhan dapur, tagihan listrik rumah, dan dana darurat bersama. Batas anggaran per kategori mencegah pengeluaran berlebih di akhir bulan."
          : "Coordinate essential grocery limits, home utilities, and shared emergency reserves. Category guardrails prevent month-end budgeting surprises.",
      points:
        language === "id"
          ? ["Plafon anggaran per kategori belanja", "Peringatan visual sebelum batas terlewati", "Ekspor CSV 1-klik untuk arsip tahunan"]
          : ["Strict category spending guardrails", "Visual early warning before limit breach", "1-click clean CSV yearly archives"],
      badgeVariant: "yellow" as const,
    },
    {
      num: "03",
      tag: language === "id" ? "SURPLUS LIKUIDITAS" : "SURPLUS LIQUIDITY",
      title: language === "id" ? "DISIPLIN TABUNGAN & INVESTOR" : "DISCIPLINED ACCUMULATORS",
      desc:
        language === "id"
          ? "Bagi Anda yang fokus pada akumulasi tabungan bulanan. Pantau surplus kas riil setelah belanja kebutuhan untuk dialokasikan ke dana darurat atau investasi."
          : "For individuals focused on growing monthly savings. Monitor your net cash surplus after living costs to fund emergency reserves and investments.",
      points:
        language === "id"
          ? ["Grafik distribusi arus kas bulanan", "Nol akses kredensial perbankan", "Antarmuka tanpa iklan produk pinjaman"]
          : ["Monthly cashflow distribution chart", "Zero bank credentials required", "Clean interface with zero loan ads"],
      badgeVariant: "forest" as const,
    },
  ];

  return (
    <section id="built-for" className="w-full bg-[#08110A] text-[#F5EFE6] border-b-2 border-[#08110A]">
      {/* SCENIC MOUNTAIN BANNER */}
      <div className="relative w-full min-h-[420px] sm:h-[460px] overflow-hidden border-b-2 border-[#08110A]">
        {/* Background Scenic Image (Highland Valley / Alpine Wilderness) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80")',
          }}
        />

        {/* Deep Gradient Overlays for contrast and moody tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08110A] via-[#08110A]/40 to-[#08110A]/60" />
        <div className="absolute inset-0 bg-[#08110A]/30 mix-blend-multiply" />

        {/* Content Over Scenic Backdrop */}
        <div className="relative max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-10 z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <StickerBadge
                text={language === "id" ? "TARGET PENGGUNA" : "WHO IT'S FOR"}
                color="neon"
                size="sm"
              />
              <span className="font-mono text-xs font-bold tracking-widest text-[#F5EFE6]/80 hidden sm:inline">
                {language === "id" ? "• ARSITEKTUR KEUANGAN TERFOKUS" : "• PURPOSE-BUILT ARCHITECTURE"}
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none mb-8">
              {language === "id" ? (
                <>
                  UNTUK SIAPA <br />
                  <span className="text-[#39E75F]">FINTRACK DIBANGUN.</span>
                </>
              ) : (
                <>
                  WHO WE ARE <br />
                  <span className="text-[#39E75F]">BUILT FOR.</span>
                </>
              )}
            </h2>
            <p className="text-base sm:text-lg text-[#F5EFE6]/85 max-w-2xl font-medium leading-relaxed">
              {language === "id"
                ? "FinTrack dirancang bagi mereka yang mencatat transaksi secara mandiri, membutuhkan batas anggaran kategori yang tegas, dan menolak pelacakan data perbankan."
                : "FinTrack is engineered for individuals who log expenses directly, require strict category guardrails, and refuse third-party financial tracking."}
            </p>
          </div>
        </div>
      </div>

      {/* 3-COLUMN EDITORIAL PILLARS */}
      <div className="w-full bg-[#F5EFE6] text-[#08110A]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#08110A]">
          {personas.map((item, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 flex flex-col justify-between space-y-8 hover:bg-white/60 transition-colors"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#08110A]/40">
                    {item.num}
                  </span>
                  <StickerBadge
                    text={item.tag}
                    color={item.badgeVariant === "neon" ? "neon" : item.badgeVariant === "yellow" ? "yellow" : "forest"}
                    size="sm"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#08110A] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#08110A]/85 leading-relaxed font-sans font-medium">
                    {item.desc}
                  </p>
                </div>

                {/* Bullet points */}
                <ul className="space-y-2.5 pt-2 border-t border-[#08110A]/15">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#08110A]">
                      <span className="w-4 h-4 rounded-full bg-[#08110A] text-[#39E75F] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
