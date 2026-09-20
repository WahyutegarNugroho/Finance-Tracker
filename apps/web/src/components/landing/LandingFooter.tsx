"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-low/40 pt-14 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              layers
            </span>
            <span>FinTrack</span>
          </div>
          <p className="text-xs text-on-surface-variant max-w-sm">
            {t("landing.footer_tagline")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-on-surface-variant font-medium">
          <a href="#features" className="hover:text-primary transition-colors">
            {t("landing.nav_features")}
          </a>
          <a href="#comparison" className="hover:text-primary transition-colors">
            {t("landing.nav_comparison")}
          </a>
          <a href="#calculator" className="hover:text-primary transition-colors">
            {t("landing.nav_calculator")}
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            {t("landing.nav_faq")}
          </a>
          <Link href="/login" className="hover:text-primary transition-colors">
            {t("landing.nav_login")}
          </Link>
          <Link href="/register" className="hover:text-primary transition-colors">
            {t("landing.nav_register")}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-outline-variant/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline">
        <p>
          &copy; {new Date().getFullYear()} FinTrack. {t("landing.footer_rights")}
        </p>
        <p className="font-mono text-[11px]">
          {t("landing.footer_privacy_note")}
        </p>
      </div>
    </footer>
  );
}
