"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import type { FirebaseAuthError } from "@/types";
import { FIREBASE_ERRORS } from "@/lib/constants";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPwdMsg, setForgotPwdMsg] = useState("");
  const [forgotPwdLoading, setForgotPwdLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const fbErr = err as FirebaseAuthError;
      setError(FIREBASE_ERRORS[fbErr?.code || ''] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setForgotPwdMsg("Please enter your email address first."); return; }
    setError(""); setForgotPwdMsg(""); setForgotPwdLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setForgotPwdMsg("Password reset email sent. Check your inbox.");
    } catch (err: unknown) {
      const fbErr = err as FirebaseAuthError;
      setForgotPwdMsg(FIREBASE_ERRORS[fbErr?.code || ''] || 'Failed to send reset email.');
    } finally { setForgotPwdLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await new Promise(resolve => setTimeout(resolve, 500));
      const token = await result.user.getIdToken();
      await api.post("/auth/google", undefined, { headers: { Authorization: `Bearer ${token}` } });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err?.code === 'auth/popup-closed-by-user') { setError("Sign in cancelled."); return; }
      setError(FIREBASE_ERRORS[err?.code || ''] || err?.message || 'Google sign in failed.');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout
      heroTitle="Smart money management starts here."
      heroSubtitle="Track your income, control expenses, and stay on budget — all from one clean dashboard."
    >
      <div className="mb-10 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FinTrack</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Welcome back</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Please enter your details to access your dashboard.</p>
      </div>

      <form className="space-y-6" onSubmit={handleEmailLogin}>
        {forgotPwdMsg && (
          <div className={`p-3 text-sm rounded-lg ${forgotPwdMsg.includes("sent") ? "text-secondary bg-secondary-container" : "text-error bg-error-container"}`}>
            {forgotPwdMsg}
          </div>
        )}
        {error && <div className="p-3 text-sm text-error bg-error-container rounded-lg">{error}</div>}

        <div className="space-y-2">
          <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface border border-outline/40 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              id="email" placeholder="name@company.com" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required aria-label="Email" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
            <button type="button" onClick={handleForgotPassword} disabled={forgotPwdLoading}
              className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors font-medium disabled:opacity-50">
              {forgotPwdLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface border border-outline/40 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              id="password" placeholder="••••••••" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required aria-label="Password" />
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <button className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded-lg shadow-sm hover:bg-primary-container hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="flex-shrink-0 mx-4 font-body-sm text-body-sm text-outline">or</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>

          <GoogleButton onClick={handleGoogleLogin} disabled={loading} label="Sign in with Google" />
        </div>
      </form>

      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link className="text-primary font-medium hover:underline decoration-primary/30 underline-offset-4 transition-all" href="/register">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
