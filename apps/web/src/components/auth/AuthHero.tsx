"use client";

import React from "react";

interface AuthHeroProps {
  title: string;
  subtitle: string;
}

export default function AuthHero({ title, subtitle }: AuthHeroProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/70 via-primary/40 to-primary/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent z-10"></div>
      <div className="relative z-20 max-w-lg text-left">
        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface/20 backdrop-blur-md border border-white/20 shadow-lg">
          <span
            className="material-symbols-outlined text-4xl text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance
          </span>
        </div>
        <h1 className="font-display text-display text-white mb-6 drop-shadow-sm">
          {title}
        </h1>
        <p className="font-body-lg text-body-lg text-white/90 max-w-md">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
