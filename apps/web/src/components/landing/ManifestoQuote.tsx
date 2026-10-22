"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ManifestoQuote() {
  const { language } = useLanguage();

  return (
    <section className="w-full bg-[#08110A] text-[#F5EFE6] border-y-2 border-white/10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient linocut texture highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-[#39E75F]/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="sr-only">
          {language === "id" ? "Manifesto FinTrack" : "FinTrack Manifesto"}
        </h2>

        {/* The Bold Editorial Manifesto Statement in Authentic Graphik */}
        <blockquote className="font-sans font-medium text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-snug sm:leading-tight text-white max-w-4xl mx-auto text-center mb-8 tracking-tight">
          {language === "id"
            ? "“Pengelolaan uang tidak membutuhkan gamifikasi, algoritma yang rumit, atau penawaran pinjaman instan. Yang Anda butuhkan adalah buku kas yang jujur, cepat, dan sepenuhnya berada di bawah kendali Anda.”"
            : "“Money management does not need gamified badges, complex algorithms, or instant loan pitches. What you need is an honest, fast ledger that stays entirely under your control.”"}
        </blockquote>

        {/* Attribution / Archival Registry Stamp */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono tracking-widest text-[#39E75F] uppercase font-semibold">
          <span>FINTRACK MANIFESTO</span>
          <span className="text-white/40">•</span>
          <span>{language === "id" ? "KEDAULATAN KEUANGAN MANDIRI" : "FINANCIAL SOVEREIGNTY"}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/60">EST. 2026</span>
        </div>
      </div>
    </section>
  );
}
