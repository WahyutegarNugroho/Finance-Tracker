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
      {/* Left Panel: Premium gradient surface */}
      <div className="relative hidden lg:flex lg:w-[44%] flex-col justify-between p-12 xl:p-16 overflow-hidden bg-[#0A0D14]">
        
        {/* Modern abstract background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[0%] -right-[20%] w-[80%] h-[80%] rounded-full bg-tertiary/20 blur-[120px]"></div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 font-headline-md text-headline-md font-bold tracking-tight text-white relative z-10">
          <span className="material-symbols-outlined text-[26px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          FinTrack
        </Link>

        <div className="max-w-lg relative z-10">
          <h1 className="font-display text-display text-white mb-6 leading-[1.15]">{heroTitle}</h1>
          <p className="font-body-lg text-body-lg text-white/70 max-w-md leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="mt-12 rounded-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] p-6 max-w-sm shadow-2xl relative overflow-hidden group">
            {/* Glossy hover effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.05] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[0.08]">
              <span className="font-label-caps text-label-caps text-white/60">
                This month&apos;s balance
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center">
                <span className="material-symbols-outlined text-white/90 text-[18px]">trending_up</span>
              </div>
            </div>
            <dl className="flex flex-col gap-3 font-body-sm text-body-sm">
              <div className="flex items-center justify-between">
                <dt className="text-white/60">Income</dt>
                <dd className="font-medium text-white text-base">Rp41,200,000</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-white/60">Expenses</dt>
                <dd className="font-medium text-white text-base">Rp16,620,000</dd>
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.08]">
                <dt className="text-white/60">Saved</dt>
                <dd className="font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md">59%</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-white/40 relative z-10">Track your account. Grow your savings.</p>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 min-w-0 flex items-center justify-center px-4 py-12 bg-surface-container-low">
        <div className="w-full max-w-md">
          <Link href="/"
            className="inline-flex mb-6 items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Home
          </Link>
          <div className="rounded-2xl border border-outline-variant/25 bg-surface p-8 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}