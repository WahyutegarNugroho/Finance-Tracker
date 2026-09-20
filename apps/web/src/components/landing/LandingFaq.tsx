"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingFaq() {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: t("landing.faq_q1"), a: t("landing.faq_a1"), icon: "lock" },
    { q: t("landing.faq_q2"), a: t("landing.faq_a2"), icon: "file_download" },
    { q: t("landing.faq_q3"), a: t("landing.faq_a3"), icon: "wallet" },
    { q: t("landing.faq_q4"), a: t("landing.faq_a4"), icon: "smartphone" },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-outline-variant/30 text-on-surface-variant border border-outline-variant/40 mb-3">
          <span className="material-symbols-outlined text-[15px]">quiz</span>
          {t("landing.faq_badge")}
        </span>
        <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-3">
          {t("landing.faq_heading")}
        </h2>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-outline-variant/30 bg-surface overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(i)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
                    {faq.icon}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-on-surface">
                    {faq.q}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 bg-surface-container-low/30 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
