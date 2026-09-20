"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function LandingHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-md border-b border-outline-variant/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                layers
              </span>
            </div>
            <span className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
              FinTrack
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
            {t("landing.badge_version")}
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
          <a href="#features" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
            {t("landing.nav_features")}
          </a>
          <a href="#comparison" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
            {t("landing.nav_comparison")}
          </a>
          <a href="#calculator" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
            {t("landing.nav_calculator")}
          </a>
          <a href="#faq" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
            {t("landing.nav_faq")}
          </a>
        </nav>

        {/* Right Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 border border-outline-variant/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            aria-label="Toggle language"
          >
            <span className="material-symbols-outlined text-[16px]">translate</span>
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 border border-outline-variant/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div className="h-4 w-px bg-outline-variant/30 mx-1" />

          {/* Auth links */}
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("landing.nav_login")}
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {t("landing.nav_register")}
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-1.5 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant/40 cursor-pointer"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-variant/40 border border-outline-variant/30 cursor-pointer"
          >
            {language.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-outline-variant/20 bg-surface/98 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-on-surface-variant">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-primary transition-colors"
            >
              {t("landing.nav_features")}
            </a>
            <a
              href="#comparison"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-primary transition-colors"
            >
              {t("landing.nav_comparison")}
            </a>
            <a
              href="#calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-primary transition-colors"
            >
              {t("landing.nav_calculator")}
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-primary transition-colors"
            >
              {t("landing.nav_faq")}
            </a>
          </nav>
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-lg border border-outline-variant/40 text-sm font-semibold text-on-surface-variant hover:bg-surface-variant/30"
            >
              {t("landing.nav_login")}
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 shadow-sm"
            >
              {t("landing.nav_register")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
