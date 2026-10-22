"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { getFirebaseErrorMessage } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";

import StickerBadge from "@/components/ui/StickerBadge";

export default function Register() {
  const router = useRouter();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, displayName });
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err) || t("auth.register_failed"));
    } finally { setLoading(false); }
  };

  const handleGoogleRegister = async () => {
    setError(""); setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await api.post("/auth/google", undefined, { headers: { Authorization: `Bearer ${token}` } });
      router.push("/dashboard");
    } catch (err: unknown) {
      setLoading(false);
      const code = (err as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError("Sign up cancelled.");
        return;
      }
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-allowed') {
        setError("Popup was blocked by the browser. Enable popups and try again.");
        return;
      }
      setError(getFirebaseErrorMessage(err) || "Google sign-up failed. If the window was blocked, try again.");
    }
  };

  return (
    <AuthLayout
      heroTitle={t("auth.hero_title_register")}
      heroSubtitle={t("auth.hero_subtitle_register")}
    >
      <div className="mb-6 lg:hidden flex items-center justify-between pb-4 border-b-2 border-[#08110A]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#39E75F] flex items-center justify-center text-[#08110A] border border-[#08110A]">
            <span className="material-symbols-outlined text-[18px] font-bold">waterfall_chart</span>
          </div>
          <span className="font-display text-lg font-black uppercase tracking-tight text-[#08110A]">
            FinTrack
          </span>
        </div>
        <StickerBadge text="DAFTAR" color="yellow" size="sm" />
      </div>

      <div className="mb-8">
        <div className="hidden lg:inline-block mb-3">
          <StickerBadge text="REKENING BARU" color="yellow" size="sm" rotate={1} />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#08110A]">
          {t("auth.create_account")}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#08110A]/75 font-medium mt-1">
          {t("auth.register_subtitle")}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleRegister}>
        {error && (
          <div className="p-3 text-xs font-mono font-bold text-[#991B1B] bg-[#FEE2E2] rounded-xl border-2 border-[#08110A] shadow-[2px_2px_0px_#991B1B]">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A]" htmlFor="name">
            {t("auth.full_name")}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/50 text-[20px]">
              person
            </span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#08110A] rounded-xl font-mono text-xs sm:text-sm text-[#08110A] placeholder:text-[#08110A]/40 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1 outline-none transition-all shadow-[2px_2px_0px_#08110A]"
              id="name"
              placeholder="Budi Santoso"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              aria-label={t("auth.full_name")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A]" htmlFor="email">
            {t("auth.email")}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/50 text-[20px]">
              mail
            </span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#08110A] rounded-xl font-mono text-xs sm:text-sm text-[#08110A] placeholder:text-[#08110A]/40 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1 outline-none transition-all shadow-[2px_2px_0px_#08110A]"
              id="email"
              placeholder="nama@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={t("auth.email")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-[#08110A]" htmlFor="password">
            {t("auth.password")}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08110A]/50 text-[20px]">
              lock
            </span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#08110A] rounded-xl font-mono text-xs sm:text-sm text-[#08110A] placeholder:text-[#08110A]/40 focus:border-[#08110A] focus:ring-2 focus:ring-[#39E75F] focus:ring-offset-1 outline-none transition-all shadow-[2px_2px_0px_#08110A]"
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-label={t("auth.password")}
            />
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <button
            className="w-full min-h-[48px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-full border-2 border-[#08110A] shadow-[4px_4px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : (
              <>
                <span>{t("auth.sign_up")}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t-2 border-[#08110A]/15"></div>
            <span className="flex-shrink-0 px-4 font-mono text-xs font-bold text-[#08110A]/60 uppercase tracking-widest">{t("auth.or_continue_with")}</span>
            <div className="flex-grow border-t-2 border-[#08110A]/15"></div>
          </div>

          <GoogleButton onClick={handleGoogleRegister} disabled={loading} label={t("auth.sign_up_with_google")} />
        </div>
      </form>

      <p className="mt-8 text-center font-mono text-xs text-[#08110A]/70">
        {t("auth.have_account")}{" "}
        <Link
          className="font-bold underline underline-offset-4 decoration-2 text-[#08110A] hover:text-[#08110A]/80 transition-all focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:outline-none rounded px-1"
          href="/login"
        >
          {t("auth.sign_in")}
        </Link>
      </p>
    </AuthLayout>
  );
}
