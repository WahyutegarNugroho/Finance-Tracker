"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl">search_off</span>
      </div>
      <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
        {t("not_found.title")}
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-8">
        {t("not_found.description")}
      </p>
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="px-8 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-all shadow-md font-medium"
      >
        {t("not_found.back_to_dashboard")}
      </button>
    </div>
  );
}
