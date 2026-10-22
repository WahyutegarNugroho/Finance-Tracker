"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import StickerBadge from "@/components/ui/StickerBadge";

export default function BadgeMosaic() {
  const { language } = useLanguage();

  return (
    <section id="benefits" className="w-full bg-[#08110A] text-[#F5EFE6] py-28 px-4 sm:px-6 lg:px-8 border-b-2 border-white/10 relative overflow-hidden select-none">
      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-12">
        {/* Top Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <StickerBadge text="AES-256 ENCRYPTED" color="sky" size="md" rotate={-6} shape="stamp" />
          <StickerBadge text="PWA READY" color="yellow" size="md" rotate={4} shape="stamp" />
          <StickerBadge text="OFFLINE FIRST" color="white" size="md" rotate={-3} shape="stamp" />
          <StickerBadge text="ZERO AD-TRACKERS" color="orange" size="md" rotate={6} shape="stamp" />
        </div>

        {/* Center Punchy Headline */}
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#39E75F]">
            {language === "id" ? "PRINSIP & INTEGRITAS" : "ETHOS & PRIVACY FIRST"}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            {language === "id" ? (
              <>
                Kendali Penuh Atas Keuangan. <br />
                <span className="text-[#39E75F]">Catatan Bersih,</span> Anggaran Terjaga.
              </>
            ) : (
              <>
                Full Control Over Your Finances. <br />
                <span className="text-[#39E75F]">Clean Ledger,</span> Protected Budget.
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-[#F5EFE6]/75 max-w-xl mx-auto font-sans leading-relaxed">
            {language === "id"
              ? "Data transaksi Anda tersimpan privat dan terenkripsi. FinTrack tidak menjual data pengguna, tidak menampilkan iklan, dan tidak pernah meminta akses rekening bank Anda."
              : "Your transaction records are private and encrypted. FinTrack does not sell user data, displays zero advertisements, and never asks for bank credentials."}
          </p>
        </div>

        {/* Bottom Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <StickerBadge text="USER ISOLATED DATA" color="neon" size="md" rotate={3} shape="stamp" />
          <StickerBadge text="INSTANT CSV EXPORT" color="sand" size="md" rotate={-4} shape="stamp" />
          <StickerBadge text="SUB-2S SPEED" color="yellow" size="md" rotate={2} shape="stamp" />
          <StickerBadge text="MULTI-CURRENCY IDR/USD" color="sky" size="md" rotate={-6} shape="stamp" />
        </div>
      </div>
    </section>
  );
}
