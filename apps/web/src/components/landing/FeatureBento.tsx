"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";

export default function FeatureBento() {
  const { language } = useLanguage();
  const [demoSearch, setDemoSearch] = useState("");

  const sampleEntries = [
    { title: "Spotify Family Premium", cat: "Entertainment", amount: "-Rp 86.000", date: language === "id" ? "Hari Ini" : "Today" },
    { title: "Belanja Mingguan Fresh Mart", cat: "Groceries", amount: "-Rp 640.000", date: language === "id" ? "Kemarin" : "Yesterday" },
    { title: "Pembayaran Invoice Proyek", cat: "Income", amount: "+Rp 8.500.000", date: language === "id" ? "15 Okt" : "Oct 15" },
    { title: "Tagihan Listrik PLN & Fiber", cat: "Utilities", amount: "-Rp 920.000", date: language === "id" ? "12 Okt" : "Oct 12" },
  ];

  const filteredEntries = sampleEntries.filter(
    (item) =>
      item.title.toLowerCase().includes(demoSearch.toLowerCase()) ||
      item.cat.toLowerCase().includes(demoSearch.toLowerCase())
  );

  return (
    <section id="features" className="w-full bg-[#F5EFE6] text-[#08110A] py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#08110A]">
      <div className="max-w-6xl mx-auto">
        {/* SECTION HEADLINE */}
        <div className="relative pb-16 border-b-2 border-[#08110A]/20">
          <div className="max-w-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <StickerBadge text="PRECISION FEATURES" color="forest" size="sm" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08110A]/60">
                {language === "id" ? "• ARSITEKTUR KEUANGAN MODERN" : "• MODERN FINANCIAL ARCHITECTURE"}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#08110A] leading-none mb-8">
              {language === "id"
                ? "Kejelasan Finansial. Tanpa Kerumitan."
                : "Financial Clarity. Zero Complexity."}
            </h2>

            <p className="text-base sm:text-lg text-[#08110A]/85 font-medium max-w-xl leading-relaxed">
              {language === "id"
                ? "Gantikan spreadsheet manual yang melelahkan. FinTrack menyajikan grafik arus kas instan, pemantauan batas anggaran per kategori, dan visibilitas saldo secara langsung."
                : "Replace tedious spreadsheets with instant transaction entry, automated cash flow charts, and clear category budgeting."}
            </p>
          </div>
        </div>

        {/* 4-ROW ALTERNATING FEATURE STACK WITH SCENIC PHOTO BACKDROPS */}
        <div className="divide-y-2 divide-[#08110A]/15">
          {/* ROW 1: CASHFLOW ALLOCATION */}
          <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#08110A]/70 block">
                {language === "id" ? "01 / ARUS KAS" : "01 / CASHFLOW"}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#08110A] leading-tight">
                {language === "id" ? "Alokasi Arus Kas Otomatis." : "Automated Cashflow Allocation."}
              </h3>
              <p className="text-sm sm:text-base text-[#08110A]/85 leading-relaxed font-sans font-medium">
                {language === "id"
                  ? "Lihat ke mana saldo Anda bergerak setiap bulan. Grafik distribusi memetakan pemasukan, belanja kebutuhan, dan sisa tabungan tanpa hitungan manual."
                  : "See where your money moves each month. Visual distribution charts map income, spending, and net savings automatically."}
              </p>
            </div>

            {/* Scenic Photo Backdrop + Floating Financial UI */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl border-2 border-[#08110A] overflow-hidden shadow-[8px_8px_0px_#08110A] p-4 sm:p-8 min-h-[340px] flex items-center justify-center">
                {/* Background Scenic Photo (Yellow Wildflower Alpine Meadow) */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08110A]/70 via-[#08110A]/30 to-black/30" />

                {/* Floating Crisp Financial UI Card */}
                <div className="relative z-10 w-full max-w-lg rounded-xl sm:rounded-2xl border-2 border-[#08110A] bg-white p-5 sm:p-6 shadow-[6px_6px_0px_#08110A]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#08110A]/10">
                    <span className="font-display font-extrabold text-xs uppercase tracking-wider text-[#08110A]">
                      {language === "id" ? "DISTRIBUSI ARUS KAS BULANAN" : "MONTHLY CASHFLOW DISTRIBUTION"}
                    </span>
                    <span className="font-mono text-xs font-black text-[#08110A] bg-[#39E75F] px-2.5 py-0.5 rounded-full border border-[#08110A]">
                      +34.8% SURPLUS
                    </span>
                  </div>

                  {/* Visual Bar Columns */}
                  <div className="grid grid-cols-5 gap-2.5 pt-4 items-end h-36">
                    {[
                      { label: "GAJI", height: "92%", color: "bg-[#39E75F]", val: "+15Jt" },
                      { label: "PROYEK", height: "64%", color: "bg-[#7DD3FC]", val: "+8Jt" },
                      { label: "BIAYA", height: "48%", color: "bg-[#08110A]", val: "-6Jt" },
                      { label: "INVEST", height: "72%", color: "bg-[#FDE047]", val: "9Jt" },
                      { label: "SAVINGS", height: "82%", color: "bg-[#39E75F]", val: "12Jt" },
                    ].map((col, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5">
                        <span className="font-mono text-[9px] font-bold text-[#08110A]">{col.val}</span>
                        <div
                          className={`w-full rounded-lg border-2 border-[#08110A] ${col.color} transition-all duration-500`}
                          style={{ height: col.height }}
                        />
                        <span className="font-display font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider text-[#08110A]/70 text-center">
                          {col.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: BUDGET LIMITS */}
          <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Scenic Photo Backdrop + Floating Financial UI */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-3xl border-2 border-[#08110A] overflow-hidden shadow-[8px_8px_0px_#08110A] p-4 sm:p-8 min-h-[340px] flex items-center justify-center">
                {/* Background Scenic Photo (Misty Green Pine Mountain Valley) */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08110A]/70 via-[#08110A]/30 to-black/30" />

                {/* Floating Dark Financial UI Card */}
                <div className="relative z-10 w-full max-w-lg rounded-xl sm:rounded-2xl border-2 border-[#08110A] bg-[#08110A] text-[#F5EFE6] p-5 sm:p-6 shadow-[6px_6px_0px_#08110A] space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                      {language === "id" ? "STATUS BATAS ANGGARAN" : "BUDGET LIMIT STATUS"}
                    </span>
                    <StickerBadge text="REAL-TIME MONITOR" color="neon" size="sm" />
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      { cat: "KULINER & HANGOUT", spent: "Rp 1.450.000", limit: "Rp 2.000.000", pct: 72, color: "bg-[#FB923C]" },
                      { cat: "BELANJA BULANAN", spent: "Rp 3.100.000", limit: "Rp 4.000.000", pct: 77, color: "bg-[#FDE047]" },
                      { cat: "LANGGANAN CLOUD & SAAS", spent: "Rp 850.000", limit: "Rp 900.000", pct: 94, color: "bg-[#EF4444]" },
                    ].map((b, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#0F1C13] border border-white/10 space-y-1.5">
                        <div className="flex justify-between text-xs font-display font-bold">
                          <span className="text-white">{b.cat}</span>
                          <span className="font-mono text-[#39E75F] text-[11px]">{b.spent} / {b.limit}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#08110A]/70 block">
                {language === "id" ? "02 / BATAS ANGGARAN" : "02 / BUDGET LIMITS"}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#08110A] leading-tight">
                {language === "id" ? "Batas Anggaran per Kategori." : "Category Budget Limits."}
              </h3>
              <p className="text-sm sm:text-base text-[#08110A]/85 leading-relaxed font-sans font-medium">
                {language === "id"
                  ? "Indikator visual memberi peringatan saat pengeluaran kategori mendekati batas bulanan, sehingga Anda tidak belanja berlebihan."
                  : "Color indicators alert you when category spending nears your monthly ceiling, helping you stay within your budget."}
              </p>
            </div>
          </div>

          {/* ROW 3: FAST LOGGING & LIVE SEARCH */}
          <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#08110A]/70 block">
                {language === "id" ? "03 / INPUT CEPAT" : "03 / FAST ENTRY"}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#08110A] leading-tight">
                {language === "id" ? "Pencatatan Cepat dan Filter Instan." : "Fast Logging and Instant Search."}
              </h3>
              <p className="text-sm sm:text-base text-[#08110A]/85 leading-relaxed font-sans font-medium">
                {language === "id"
                  ? "Catat pengeluaran baru dalam hitungan detik. Cari riwayat transaksi berdasarkan catatan atau kategori dengan hasil seketika."
                  : "Log new expenses in seconds. Filter through past transactions by note or category with instant results."}
              </p>
            </div>

            {/* Scenic Photo Backdrop + Floating Interactive Ledger */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl border-2 border-[#08110A] overflow-hidden shadow-[8px_8px_0px_#08110A] p-4 sm:p-8 min-h-[340px] flex items-center justify-center">
                {/* Background Scenic Photo (Sunset Mountain Ridge) */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08110A]/70 via-[#08110A]/30 to-black/30" />

                {/* Floating Interactive Ledger Search Card */}
                <div className="relative z-10 w-full max-w-lg rounded-xl sm:rounded-2xl border-2 border-[#08110A] bg-white p-5 sm:p-6 shadow-[6px_6px_0px_#08110A] space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#08110A]/10">
                    <span className="font-display font-extrabold text-xs uppercase tracking-wider text-[#08110A]">
                      {language === "id" ? "SIMULASI FILTER BUKU BESAR" : "LIVE LEDGER SEARCH FILTER"}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#08110A]/60">4 DATA CONTOH</span>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/70 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      aria-label={language === "id" ? "Filter pencarian transaksi contoh" : "Sample ledger search filter"}
                      value={demoSearch}
                      onChange={(e) => setDemoSearch(e.target.value)}
                      placeholder={
                        language === "id"
                          ? "Ketik 'Spotify', 'Groceries', atau 'PLN'..."
                          : "Type 'Spotify', 'Groceries', or 'PLN'..."
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F5EFE6] text-xs font-bold font-mono rounded-xl border-2 border-[#08110A] text-[#08110A] placeholder:text-[#08110A]/70 focus:outline-none focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F]"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredEntries.map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5EFE6] border-2 border-[#08110A] text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-display font-bold text-[#08110A] truncate">{row.title}</span>
                          <span className="font-mono text-[9px] text-[#08110A]/70 bg-white px-1.5 py-0.5 rounded border border-[#08110A]/20">
                            {row.cat}
                          </span>
                        </div>
                        <span
                          className={`font-mono font-bold shrink-0 ml-2 ${
                            row.amount.startsWith("+") ? "text-[#00875A]" : "text-[#08110A]"
                          }`}
                        >
                          {row.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 4: ASSET RATIO & SAVINGS BUFFER RADAR */}
          <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Scenic Photo Backdrop + Floating Asset Card */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-3xl border-2 border-[#08110A] overflow-hidden shadow-[8px_8px_0px_#08110A] p-4 sm:p-8 min-h-[340px] flex items-center justify-center">
                {/* Background Scenic Photo (Deep Misty Emerald Pine Forest) */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08110A]/75 via-[#08110A]/35 to-black/30" />

                {/* Floating Multi-Month Cashflow Analytics Card */}
                <div className="relative z-10 w-full max-w-lg rounded-xl sm:rounded-2xl border-2 border-[#08110A] bg-[#08110A] text-[#F5EFE6] p-5 sm:p-6 shadow-[6px_6px_0px_#08110A] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                      {language === "id" ? "TINJAUAN ARUS KAS BULANAN" : "MONTHLY CASHFLOW ANALYSIS"}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#39E75F] bg-[#112918] px-2 py-0.5 rounded border border-[#39E75F]">
                      {language === "id" ? "TREN 6 BULAN" : "6-MONTH TREND"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-[#0F1C13] border border-white/10">
                      <span className="font-mono text-[10px] text-[#F5EFE6]/70 uppercase block">
                        {language === "id" ? "RATA-RATA MASUK" : "AVG INFLOW"}
                      </span>
                      <span className="font-display text-sm font-black text-[#39E75F] block mt-1">Rp 18.5Jt</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F1C13] border border-white/10">
                      <span className="font-mono text-[10px] text-[#F5EFE6]/70 uppercase block">
                        {language === "id" ? "RATA-RATA KELUAR" : "AVG OUTFLOW"}
                      </span>
                      <span className="font-display text-sm font-black text-[#FB923C] block mt-1">Rp 11.2Jt</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F1C13] border border-white/10">
                      <span className="font-mono text-[10px] text-[#F5EFE6]/70 uppercase block">
                        {language === "id" ? "SURPLUS BERSIH" : "NET SURPLUS"}
                      </span>
                      <span className="font-display text-sm font-black text-[#7DD3FC] block mt-1">+Rp 7.3Jt</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#F5EFE6]/70">
                        {language === "id" ? "Rasio Tabungan Rata-rata 6 Bulan:" : "Average 6-Month Savings Ratio:"}
                      </span>
                      <span className="font-bold text-[#39E75F]">39.4%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden border border-white/15">
                      <div className="h-full rounded-full bg-[#39E75F]" style={{ width: "39.4%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#08110A]/70 block">
                {language === "id" ? "04 / ANALITIK TREN" : "04 / TREND ANALYTICS"}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#08110A] leading-tight">
                {language === "id" ? "Analisis Arus Kas Multi-Bulan." : "Multi-Month Cashflow Analytics."}
              </h3>
              <p className="text-sm sm:text-base text-[#08110A]/85 leading-relaxed font-sans font-medium">
                {language === "id"
                  ? "Bandingkan pemasukan versus pengeluaran dari bulan ke bulan dan pantau proporsi belanja per kategori secara visual tanpa rumus rumit."
                  : "Compare income versus expenses across months and visualize category spending breakdowns without complex formulas."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
