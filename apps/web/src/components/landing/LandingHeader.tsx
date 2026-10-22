"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import PillButton from "@/components/ui/PillButton";

export default function LandingHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08110A]/90 backdrop-blur-md border-b border-white/10 text-[#F5EFE6] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-[#39E75F] flex items-center justify-center text-[#08110A] group-hover:scale-105 transition-transform border-2 border-[#08110A]">
              <span className="material-symbols-outlined text-[24px] font-bold">
                waterfall_chart
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
                FinTrack
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#39E75F] font-mono font-bold leading-none mt-1">
                Precision Wealth
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-display text-xs uppercase tracking-widest font-extrabold text-[#F5EFE6]/75">
          <a
            href="#features"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1"
          >
            {t("landing.nav_features")}
          </a>
          <a
            href="#built-for"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1"
          >
            {language === "id" ? "Target Pengguna" : "Who It's For"}
          </a>
          <a
            href="#calculator"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1"
          >
            {t("landing.nav_calculator")}
          </a>
          <a
            href="#faq"
            className="hover:text-[#39E75F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] rounded px-1"
          >
            {t("landing.nav_faq")}
          </a>
        </nav>

        {/* Right Controls */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-full text-xs font-display font-extrabold text-[#F5EFE6]/80 hover:text-white hover:border-[#39E75F] border border-white/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08110A]"
            aria-label="Toggle language"
          >
            <span className="material-symbols-outlined text-[16px] text-[#39E75F]">translate</span>
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-full text-[#F5EFE6]/80 hover:text-white hover:border-[#39E75F] border border-white/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08110A]"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[18px]" suppressHydrationWarning>
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div className="h-5 w-px bg-white/20" />

          {/* Auth links */}
          <Link
            href="/login"
            className="font-display text-xs uppercase tracking-wider font-extrabold text-[#F5EFE6]/80 hover:text-[#39E75F] transition-colors min-h-[44px] flex items-center px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08110A] rounded-full"
          >
            {t("landing.nav_login")}
          </Link>
          <PillButton href="/register" variant="neon" size="sm">
            {t("landing.nav_register")}
          </PillButton>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[44px] px-3 py-1 rounded-full text-xs font-display font-bold border border-white/20 text-[#F5EFE6] cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F]"
            aria-label="Toggle Language"
          >
            {language.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-[#F5EFE6] hover:border-[#39E75F] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F]"
            aria-label={isMobileMenuOpen ? (language === "id" ? "Tutup menu" : "Close menu") : (language === "id" ? "Buka menu" : "Open menu")}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={language === "id" ? "Navigasi Seluler" : "Mobile Navigation"}
          className="sm:hidden border-b border-white/10 bg-[#08110A] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl"
        >
          <nav className="flex flex-col space-y-3 font-display uppercase tracking-wider text-sm font-extrabold text-[#F5EFE6]/80">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#39E75F] transition-colors"
            >
              {t("landing.nav_features")}
            </a>
            <a
              href="#built-for"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#39E75F] transition-colors"
            >
              {language === "id" ? "Target Pengguna" : "Who It's For"}
            </a>
            <a
              href="#calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#39E75F] transition-colors"
            >
              {t("landing.nav_calculator")}
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-[#39E75F] transition-colors"
            >
              {t("landing.nav_faq")}
            </a>
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full border border-white/20 font-display text-xs uppercase tracking-wider font-extrabold text-white"
            >
              {t("landing.nav_login")}
            </Link>
            <PillButton
              href="/register"
              variant="neon"
              size="md"
              className="w-full justify-center"
            >
              {t("landing.nav_register")}
            </PillButton>
          </div>
        </div>
      )}
    </header>
  );
}
