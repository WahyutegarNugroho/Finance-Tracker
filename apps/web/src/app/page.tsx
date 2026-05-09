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
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-label-caps text-label-caps px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors hidden md:block">
              Log In
            </Link>
            <Link href="/login" className="font-label-caps text-label-caps bg-primary text-on-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-32 pb-16">
        <section className="px-gutter md:px-container-margin max-w-[1440px] mx-auto flex flex-col items-center text-center mb-24">
          <h1 className="font-display text-display text-on-background max-w-4xl mb-6 tracking-tight">
            Take Control of Your <br className="hidden md:block" />
            <span className="text-primary relative inline-block">
              Financial Future
              <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full"></div>
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            Experience precision, security, and forward-thinking technology with
            our modern wealth management platform. Designed for the sophisticated
            architect of their own portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
            <Link href="/login" className="font-label-caps text-label-caps bg-primary text-on-primary px-8 py-4 rounded-xl hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-[0_8px_20px_rgba(70,72,212,0.25)] w-full sm:w-auto text-center flex items-center justify-center">
              Get Started
            </Link>
            <Link href="/dashboard" className="font-label-caps text-label-caps glass-panel text-on-surface-variant px-8 py-4 rounded-xl hover:text-primary hover:scale-[1.02] transition-all w-full sm:w-auto text-center flex items-center justify-center">
              View Demo
            </Link>
          </div>

          <div className="w-full max-w-5xl relative rounded-[2rem] p-3 bg-gradient-to-b from-primary/10 to-transparent">
            <div className="w-full h-[500px] md:h-[600px] bg-surface/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl shadow-[0_24px_48px_-12px_rgba(70,72,212,0.15)] flex overflow-hidden">
              <div className="w-[240px] border-r border-outline-variant/15 hidden md:flex flex-col p-6 gap-2 bg-surface-container-lowest/50">
                <div className="w-28 h-6 bg-primary/20 rounded-md mb-8"></div>
                <div className="w-full h-11 bg-primary/10 rounded-lg flex items-center px-4 gap-3">
                  <span
                    className="material-symbols-outlined text-primary text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    dashboard
                  </span>
                  <div className="w-20 h-2.5 bg-primary/40 rounded-full"></div>
                </div>
                <div className="w-full h-11 flex items-center px-4 gap-3 opacity-60">
                  <span className="material-symbols-outlined text-[20px]">
                    receipt_long
                  </span>
                  <div className="w-24 h-2.5 bg-on-surface-variant/40 rounded-full"></div>
                </div>
                <div className="w-full h-11 flex items-center px-4 gap-3 opacity-60">
                  <span className="material-symbols-outlined text-[20px]">
                    account_balance_wallet
                  </span>
                  <div className="w-16 h-2.5 bg-on-surface-variant/40 rounded-full"></div>
                </div>
                <div className="mt-auto w-full h-11 flex items-center px-4 gap-3 opacity-60">
                  <span className="material-symbols-outlined text-[20px]">
                    settings
                  </span>
                  <div className="w-14 h-2.5 bg-on-surface-variant/40 rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 p-6 md:p-10 flex flex-col gap-8 bg-surface/40">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="w-40 h-6 bg-on-surface-variant/20 rounded-md mb-2"></div>
                    <div className="w-64 h-3 bg-on-surface-variant/10 rounded-full"></div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-surface border border-outline-variant/30 shadow-sm rounded-full sm:flex items-center justify-center hidden">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                        notifications
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  <div className="h-36 glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        trending_up
                      </span>
                    </div>
                    <div>
                      <div className="w-20 h-3 bg-on-surface-variant/20 rounded-full mb-3"></div>
                      <div className="w-32 h-6 bg-primary/20 rounded-md"></div>
                    </div>
                  </div>
                  <div className="h-36 glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full"></div>
                    <div className="w-10 h-10 bg-secondary-container/30 text-secondary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        pie_chart
                      </span>
                    </div>
                    <div>
                      <div className="w-24 h-3 bg-on-surface-variant/20 rounded-full mb-3"></div>
                      <div className="w-28 h-6 bg-on-surface-variant/20 rounded-md"></div>
                    </div>
                  </div>
                  <div className="h-36 glass-panel rounded-2xl p-5 flex-col justify-between relative overflow-hidden hidden sm:flex">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full"></div>
                    <div className="w-10 h-10 bg-tertiary-container/20 text-tertiary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        flag
                      </span>
                    </div>
                    <div>
                      <div className="w-16 h-3 bg-on-surface-variant/20 rounded-full mb-3"></div>
                      <div className="w-24 h-6 bg-on-surface-variant/20 rounded-md"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col">
                  <div className="w-32 h-4 bg-on-surface-variant/20 rounded-full mb-6 z-10"></div>
                  <div className="flex-1 relative">
                    <MockChart />
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
                Engineered for Precision
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                High-density data visualization mapped to intuitive interfaces.
                We eliminate cognitive overload so you can focus on strategy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="glass-panel rounded-2xl p-8 hover:shadow-[0_12px_40px_rgba(70,72,212,0.12)] transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    analytics
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-3">
                  Smart Analytics
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Deep dive into your financial data with AI-driven insights and
                  forecasting tools designed for the modern investor. Visualize
                  trends before they happen.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8 hover:shadow-[0_12px_40px_rgba(70,72,212,0.12)] transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-secondary-container/30 border border-secondary/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-secondary text-[28px]">
                    account_balance_wallet
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-3">
                  Budget Tracking
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Granular control over your cash flow. Categorize, monitor, and
                  optimize your spending with an interface that feels like a
                  precision instrument.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8 hover:shadow-[0_12px_40px_rgba(70,72,212,0.12)] transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-tertiary-container/20 border border-tertiary/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-tertiary text-[28px]">
                    smartphone
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-3">
                  Mobile Ready
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Your financial command center, available anywhere. A seamless,
                  responsive experience across all your devices without
                  compromising functionality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Watermark */}
        <footer className="w-full max-w-5xl mt-32 pb-12 border-t border-outline-variant/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">account_balance_wallet</span>
            </div>
            <span className="font-display-sm text-display-sm tracking-tight text-on-surface">FinTrack</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 px-4 md:px-0">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2026 whtsn. All rights reserved.
            </p>
            <p className="font-label-sm text-label-sm text-primary/60">
              Built with precision and security.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
