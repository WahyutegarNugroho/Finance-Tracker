import React from "react";
import Link from "next/link";
import { MockChart } from "../components/MockChart";

export default function Home() {
  return (
    <>
      <header className="w-full fixed top-0 z-50 glass-panel border-b border-outline-variant/10 px-gutter md:px-container-margin py-4">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-full">
          <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              layers
            </span>
            FinTrack
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="font-label-caps text-label-caps px-3 md:px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors">
              Log In
            </Link>
            <Link href="/register" className="font-label-caps text-label-caps bg-primary text-on-primary px-4 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-32 pb-16">
        <section className="px-gutter md:px-container-margin max-w-[1440px] mx-auto flex flex-col items-center text-center mb-24">
          <h1 className="font-display text-display text-on-background max-w-4xl mb-6 tracking-tight">
            Control your spending. <br className="hidden md:block" />
            <span className="text-primary relative inline-block">
              Grow your savings.
              <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full"></div>
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            A simple, intuitive dashboard to track your daily transactions, monitor cash flow, 
            and set budgets without the complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
            <Link href="/register" className="font-label-caps text-label-caps bg-primary text-on-primary px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors w-full sm:w-auto text-center">
              Get Started
            </Link>
            <Link href="/dashboard" className="font-label-caps text-label-caps border border-outline-variant/40 text-on-surface-variant px-8 py-4 rounded-xl hover:text-primary hover:border-primary/50 transition-colors w-full sm:w-auto text-center">
              View Demo
            </Link>
          </div>

          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[240px_1fr] rounded-2xl border border-outline-variant/25 bg-surface overflow-hidden text-left">
            <aside className="hidden lg:flex flex-col gap-1 p-4 bg-surface-container-low border-b lg:border-b-0 lg:border-r border-outline-variant/20">
              <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg bg-surface border border-outline-variant/25 font-body-sm text-body-sm font-medium">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                Dashboard
              </div>
              <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                Transactions
              </div>
              <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                Budgets
              </div>
              <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">insights</span>
                Analytics
              </div>
              <div className="mt-auto flex items-center gap-2.5 px-3 h-10 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                Settings
              </div>
            </aside>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">October 2026</p>
                  <p className="font-headline-md text-headline-md text-on-background mt-1">FinTrack overview</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span>Income</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary"></span>Expense</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-outline-variant/25 p-4 flex items-center justify-center">
                  <p className="font-label-caps text-label-caps text-white">Balance</p>
                </div>
                <div className="rounded-xl border border-outline-variant/25 p-4 flex items-center justify-center">
                  <p className="font-label-caps text-label-caps text-green-500">Income</p>
                </div>
                <div className="rounded-xl border border-outline-variant/25 p-4 flex items-center justify-center">
                  <p className="font-label-caps text-label-caps text-orange-500">Spent</p>
                </div>
              </div>

              <div className="relative h-48">
                <MockChart />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center py-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">restaurant</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-background">Grocery Store</p>
                      <p className="text-xs text-on-surface-variant">Food &amp; Drink</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center py-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-background">Electricity Bill</p>
                      <p className="text-xs text-on-surface-variant">Utilities</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-background">Monthly Salary</p>
                      <p className="text-xs text-on-surface-variant">Income</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low/50 border-t border-outline-variant/10 px-gutter md:px-container-margin relative">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">
                See Where Your Money Goes
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Visual charts and smart insights that make sense of your spending.
                No accounting degree required.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="rounded-2xl border border-outline-variant/20 bg-surface p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-[26px]">
                    analytics
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-3">
                  Smart Analytics
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Track transactions, spot spending patterns, and understand
                  your financial habits at a glance.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant/20 bg-surface p-8">
                <div className="w-14 h-14 bg-secondary/10 border border-secondary/25 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-[26px]">
                    account_balance_wallet
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-3">
                  Budget Tracking
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Set monthly budgets per category and get alerts before you
                  overspend. Simple, effective, no surprises.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant/20 bg-surface p-8">
                <div className="w-14 h-14 bg-tertiary/10 border border-tertiary/25 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary text-[26px]">
                    smartphone
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-3">
                  Mobile Ready
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Fully responsive design that works on desktop and mobile.
                  Check your finances anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Watermark */}
        <footer className="w-full max-w-5xl mx-auto mt-32 pb-12 border-t border-outline-variant/10 pt-12 flex flex-col items-center gap-4">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FinTrack</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant opacity-80">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
