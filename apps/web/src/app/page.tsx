import React from "react";
import Link from "next/link";
import { MockChart } from "../components/MockChart";

export default function Home() {
  return (
    <>
      <header className="w-full fixed top-0 z-50 bg-surface/95 border-b border-outline-variant/10 px-gutter md:px-container-margin py-3.5 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-full">
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              layers
            </span>
            FinTrack
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login" className="font-label-caps text-label-caps px-3 md:px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors">
              Log In
            </Link>
            <Link href="/register" className="font-label-caps text-label-caps bg-primary text-on-primary px-4 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-24 pb-12">
        <section className="px-gutter md:px-container-margin max-w-[1440px] mx-auto flex flex-col items-center text-center mb-16">
          <h1 className="font-display text-display text-on-background max-w-3xl mb-4 tracking-tight">
            Control your spending. <br className="hidden md:block" />
            <span className="text-primary">
              Grow your savings.
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
            Track daily transactions, monitor cash flow, and set category budgets from a clean, fast dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-14 w-full sm:w-auto">
            <Link href="/register" className="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3.5 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto text-center shadow-sm">
              Start Free
            </Link>
            <Link href="/login" className="font-label-caps text-label-caps border border-outline-variant/40 text-on-surface-variant px-6 py-3.5 rounded-lg hover:text-primary hover:border-primary/50 transition-colors w-full sm:w-auto text-center">
              Sign In
            </Link>
          </div>

          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[220px_1fr] rounded-xl border border-outline-variant/25 bg-surface overflow-hidden text-left shadow-sm">
            <aside className="hidden lg:flex flex-col gap-1 p-3 bg-surface-container-low border-b lg:border-b-0 lg:border-r border-outline-variant/20">
              <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-surface border border-outline-variant/25 font-body-sm text-body-sm font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                Dashboard
              </div>
              <div className="flex items-center gap-2 px-3 h-9 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                Transactions
              </div>
              <div className="flex items-center gap-2 px-3 h-9 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                Budgets
              </div>
              <div className="flex items-center gap-2 px-3 h-9 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">insights</span>
                Analytics
              </div>
              <div className="mt-auto flex items-center gap-2 px-3 h-9 rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </div>
            </aside>

            <div className="p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-headline-md text-headline-md text-on-background">FinTrack overview</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span>Income</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary"></span>Expense</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-outline-variant/25 p-3 flex items-center justify-center bg-surface-container-low/50">
                  <p className="font-label-caps text-label-caps text-on-surface font-semibold">Balance</p>
                </div>
                <div className="rounded-lg border border-outline-variant/25 p-3 flex items-center justify-center bg-secondary/10">
                  <p className="font-label-caps text-label-caps text-secondary font-semibold">Income</p>
                </div>
                <div className="rounded-lg border border-outline-variant/25 p-3 flex items-center justify-center bg-tertiary/10">
                  <p className="font-label-caps text-label-caps text-tertiary font-semibold">Spent</p>
                </div>
              </div>

              <div className="relative h-44">
                <MockChart />
              </div>

              <div className="flex flex-col divide-y divide-outline-variant/15">
                <div className="flex items-center py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-background">Grocery Store</p>
                      <p className="text-xs text-on-surface-variant">Food &amp; Drink</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">bolt</span>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-background">Electricity Bill</p>
                      <p className="text-xs text-on-surface-variant">Utilities</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
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

        <section className="py-16 bg-surface-container-low/50 border-t border-outline-variant/10 px-gutter md:px-container-margin relative">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
                See Where Your Money Goes
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
                Visual charts and clear breakdowns that make sense of your spending.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              <div className="rounded-xl border border-outline-variant/20 bg-surface p-6 flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  analytics
                </span>
                <h3 className="font-headline-md text-headline-md text-on-background">
                  Cashflow Trends
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Monthly income vs. expense graphs with category breakdowns and multi-month comparisons.
                </p>
              </div>

              <div className="rounded-xl border border-outline-variant/20 bg-surface p-6 flex flex-col gap-3">
                <span className="material-symbols-outlined text-secondary text-[28px]">
                  account_balance_wallet
                </span>
                <h3 className="font-headline-md text-headline-md text-on-background">
                  Budget Limits
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Set monthly caps per category with good/warning/critical status indicators.
                </p>
              </div>

              <div className="rounded-xl border border-outline-variant/20 bg-surface p-6 flex flex-col gap-3">
                <span className="material-symbols-outlined text-tertiary text-[28px]">
                  receipt_long
                </span>
                <h3 className="font-headline-md text-headline-md text-on-background">
                  Fast Logging
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Add transactions with auto-formatted currency, CSV export, and cursor-paginated search.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto mt-16 pb-8 border-t border-outline-variant/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 text-center sm:text-left">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FinTrack</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} FinTrack. Precision wealth management.
          </p>
        </footer>
      </main>
    </>
  );
}
