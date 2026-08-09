"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { getFirebaseErrorMessage } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";

export default function Register() {
  const router = useRouter();
  const { user } = useAuth();
  const googleDoneRef = useRef(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const isGoogle = user.providerData.some((p) => p.providerId === 'google.com');
    if (!isGoogle || sessionStorage.getItem('fintrackGooglePending') !== '1') return;
    sessionStorage.removeItem('fintrackGooglePending');
    if (googleDoneRef.current) return;
    googleDoneRef.current = true;
    user.getIdToken()
      .then((token) => api.post("/auth/google", undefined, { headers: { Authorization: `Bearer ${token}` } }))
      .then(() => router.push("/dashboard"))
      .catch(() => {
        googleDoneRef.current = false;
        setError("Google sign-up failed. Please try again.");
      });
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, displayName });
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err) || 'Failed to register.');
    } finally { setLoading(false); }
  };

  const handleGoogleRegister = async () => {
    setError(""); setLoading(true);
    try {
      sessionStorage.setItem('fintrackGooglePending', '1');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
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
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout
      heroTitle="Take control of your money."
      heroSubtitle="Sign up in seconds and start tracking your income, expenses, and budgets."
    >
      <div className="mb-10 lg:hidden">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FinTrack</span>
        </div>
      </div>
      <div className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Create an account</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Enter your details to get started.</p>
      </div>

      <form className="space-y-5" onSubmit={handleRegister}>
        {error && <div className="p-3 text-sm text-error bg-error-container rounded-lg">{error}</div>}

        <div className="space-y-2">
          <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="name">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface border border-outline/40 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              id="name" placeholder="John Doe" type="text" value={displayName}
              onChange={(e) => setDisplayName(e.target.value)} required aria-label="Full Name" />
          </div>
        </div>

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
          <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface border border-outline/40 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              id="password" placeholder="••••••••" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={6} aria-label="Password" />
          </div>
        </div>

        <button className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded-lg shadow-sm hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          type="submit" disabled={loading}>
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
          ) : "Sign Up"}
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink-0 px-4 font-body-sm text-body-sm text-outline">Or continue with</span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        <GoogleButton onClick={handleGoogleRegister} disabled={loading} label="Sign up with Google" />
      </form>

      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link className="text-primary font-medium hover:underline decoration-primary/30 underline-offset-4 transition-all" href="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
