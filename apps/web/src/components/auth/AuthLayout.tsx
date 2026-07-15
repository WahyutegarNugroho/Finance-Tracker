"use client";

import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle: string;
  heroSubtitle: string;
}

export default function AuthLayout({ children, heroTitle, heroSubtitle }: AuthLayoutProps) {
  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      {/* Left Panel: Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/70 via-primary/40 to-primary/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent z-10"></div>
        <div className="relative z-20 max-w-lg text-left">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface/20 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="material-symbols-outlined text-4xl text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <h1 className="font-display text-display text-white mb-6 drop-shadow-sm">
            {heroTitle}
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-md">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface-container-low relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <Link href="/"
          className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Home
        </Link>
        <div className="w-full max-w-md relative z-10 mt-8 sm:mt-0 bg-surface rounded-2xl shadow-xl border border-outline-variant/20 p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
