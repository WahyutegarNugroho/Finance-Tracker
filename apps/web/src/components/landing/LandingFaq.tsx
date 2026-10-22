"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";

type FaqCategory = "all" | "security" | "budget" | "export";

export default function LandingFaq() {
  const { t, language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<FaqCategory>("all");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = [
    { id: "all" as FaqCategory, label: language === "id" ? "Semua Pertanyaan" : "All Questions" },
    { id: "security" as FaqCategory, label: language === "id" ? "Keamanan Data" : "Data Security" },
    { id: "budget" as FaqCategory, label: language === "id" ? "Plafon Anggaran" : "Budget Limits" },
    { id: "export" as FaqCategory, label: language === "id" ? "Ekspor CSV & PWA" : "CSV & PWA" },
  ];

  const allFaqs = [
    {
      id: 0,
      cat: "security",
      q: t("landing.faq_q1"),
      a: t("landing.faq_a1"),
      tag: language === "id" ? "PRIVASI BANK" : "BANK PRIVACY",
      icon: "lock",
    },
    {
      id: 1,
      cat: "export",
      q: t("landing.faq_q2"),
      a: t("landing.faq_a2"),
      tag: language === "id" ? "KEDAULATAN DATA" : "DATA SOVEREIGNTY",
      icon: "file_download",
    },
    {
      id: 2,
      cat: "budget",
      q: t("landing.faq_q3"),
      a: t("landing.faq_a3"),
      tag: language === "id" ? "GRATIS & TRANSPARAN" : "ZERO PAYWALL",
      icon: "wallet",
    },
    {
      id: 3,
      cat: "export",
      q: t("landing.faq_q4"),
      a: t("landing.faq_a4"),
      tag: language === "id" ? "OFFLINE & MOBILE" : "PWA MOBILE",
      icon: "smartphone",
    },
    {
      id: 4,
      cat: "budget",
      q:
        language === "id"
          ? "Bagaimana cara kerja visual alert pada batas anggaran?"
          : "How do visual alerts work for category budget ceilings?",
      a:
        language === "id"
          ? "Setiap kategori belanja dapat dipasangi plafon bulanan (misal Rp 2.000.000 untuk Kuliner). Saat pengeluaran mencapai 70%, indikator berubah menjadi kuning waspada. Di atas 90%, indikator berubah merah kritis untuk mencegah pengeluaran berlebih."
          : "Each spending category can have an optional monthly cap (e.g. $200 for Dining). When expenses cross 70%, the indicator shifts to warning yellow. Above 90%, it turns alert red to prevent accidental overspending.",
      tag: language === "id" ? "LOGIKA LIMIT" : "LIMIT LOGIC",
      icon: "speed",
    },
  ];

  const filteredFaqs = allFaqs.filter((item) => selectedCat === "all" || item.cat === selectedCat);

  const toggleAccordion = (id: number) => {
    setOpenIdx(openIdx === id ? null : id);
  };

  return (
    <section id="faq" className="w-full bg-[#F5EFE6] text-[#08110A] py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#08110A]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT COLUMN: TITLE & CATEGORY SELECTOR */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <div className="flex items-center gap-2 mb-4">
              <StickerBadge text="FREQUENTLY ASKED" color="forest" size="sm" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#08110A]/60">
                {language === "id" ? "• JAWABAN TERBUKA" : "• TRANSPARENT ANSWERS"}
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#08110A] leading-none mb-8">
              FAQS
            </h2>

            <p className="text-base sm:text-lg text-[#08110A]/85 font-medium leading-relaxed mb-8">
              {language === "id"
                ? "Semua jawaban transparan mengenai keamanan data, fleksibilitas mata uang, dan cara kerja FinTrack."
                : "Transparent facts regarding data security, multi-currency flexibility, and our architectural decisions."}
            </p>

            {/* Category Filter Buttons */}
            <div role="tablist" aria-label="FAQ Categories" className="space-y-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={selectedCat === cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`w-full text-left px-4 py-3 min-h-[44px] rounded-2xl border-2 border-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EFE6] ${
                    selectedCat === cat.id
                      ? "bg-[#08110A] text-white shadow-[4px_4px_0px_#39E75F]"
                      : "bg-white text-[#08110A] hover:bg-[#F5EFE6]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedCat === cat.id ? "arrow_forward" : "chevron_right"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ACCORDION LIST */}
          <div className="lg:col-span-7 space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIdx === faq.id;
              const questionId = `faq-trigger-${faq.id}`;
              const answerId = `faq-panel-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className="rounded-3xl border-2 border-[#08110A] bg-white overflow-hidden shadow-[4px_4px_0px_#08110A] transition-all"
                >
                  <button
                    id={questionId}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 min-h-[48px] text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-[#F5EFE6]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-[#08110A] text-[#39E75F] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">{faq.icon}</span>
                      </span>
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block font-mono text-[10px] font-bold uppercase text-[#08110A]/60 bg-[#F5EFE6] px-2 py-0.5 rounded border border-[#08110A]/20">
                          {faq.tag}
                        </span>
                        <h3 className="font-display text-sm sm:text-base font-black uppercase text-[#08110A] leading-snug">
                          {faq.q}
                        </h3>
                      </div>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined text-[#08110A] transition-transform duration-200 shrink-0 font-bold mt-1 ${
                        isOpen ? "rotate-180 text-[#39E75F]" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      className="px-5 sm:px-6 pb-6 pt-3 text-xs sm:text-sm text-[#08110A]/80 font-medium leading-relaxed border-t-2 border-[#08110A]/10 bg-[#FAF7F2] animate-in fade-in duration-200"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
