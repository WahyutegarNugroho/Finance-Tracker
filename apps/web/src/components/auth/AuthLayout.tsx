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
      {/* Left Panel: Solid brand surface */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12 xl:p-16 bg-primary text-on-primary">
        <Link href="/" className="inline-flex items-center gap-2 font-headline-md text-headline-md font-bold tracking-tight">
          <span
            className="material-symbols-outlined text-[26px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
          FinTrack
        </Link>

        <div className="max-w-lg">
          <h1 className="font-headline-lg text-headline-lg mb-5">{heroTitle}</h1>
          <p className="font-body-lg text-body-lg text-on-primary/85 max-w-md leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 ring-1 ring-white/20 p-5 max-w-sm">
            <div className="flex items-center justify-between mb-2 pb-4 border-b border-white/15">
              <span className="font-label-caps text-label-caps text-on-primary/80">
                This month&apos;s balance
              </span>
              <span className="material-symbols-outlined text-on-primary/80">trending_up</span>
            </div>
            <dl className="flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex items-center justify-between">
                <dt className="text-on-primary/75">Income</dt>
                <dd className="font-medium">Rp41,200,000</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-primary/75">Expenses</dt>
                <dd className="font-medium">Rp16,620,000</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-primary/75">Saved</dt>
                <dd className="font-medium text-secondary-container">59%</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-primary/70">Track your account. Grow your savings.</p>
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