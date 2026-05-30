"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl">error</span>
      </div>
      <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
        {t("error_page.title")}
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-8">
        {t("error_page.description")}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-6 py-2 border border-outline text-on-surface rounded-lg hover:bg-surface-variant transition-colors"
        >
          {t("error_page.back_to_dashboard")}
        </button>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors shadow-sm"
        >
          {t("error_page.try_again")}
        </button>
      </div>
    </div>
  );
}
