"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { api } from "@/lib/api";
import type { FirebaseAuthError } from "@/types";

export default function Register() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const FIREBASE_ERRORS: Record<string, string> = {
    'auth/user-not-found': 'Email not registered. Please sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password is too weak.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Register via Backend API to create user in Firebase & Firestore with defaults
      await api.post("/auth/register", {
        email,
        password,
        displayName
      });

      // 2. Sign in on the client to get the session
      await signInWithEmailAndPassword(auth, email, password);
      
      // 3. Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      const fbErr = err as FirebaseAuthError;
      const code = fbErr?.code || '';
      const msg = fbErr?.data?.message || fbErr?.message || '';
      setError(FIREBASE_ERRORS[code] || msg || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      await api.post("/auth/google", {});
      router.push("/dashboard");
    } catch (err: unknown) {
      const fbErr = err as FirebaseAuthError;
      const code = fbErr?.code || '';
      setError(FIREBASE_ERRORS[code] || 'Google sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      {/* Left Panel: Hero/Gradient Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Hero Image Background */}
        <img
          alt="Abstract geometric background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFzFlFu7NXs2_VGKnr1njxibMPR6OAbvd9gIAZuBtJyCK_-8XljMIN6rjT4UhjzscYDPoRIl_Zf9LkXCjbilPPXHwrXDkzBs03NNq4Il108IdjC7mVDGu7-egBy4husq4ElZIf54avAFN6WMPy1n4Yt6HXBk7Us6JnfyRYJD26ugcWJGtdtqqUhikdXWU1ygbM1zA3HAzRHGX8kE2KDzHQsyeHusectIkdT6OpIu5WseItKIcL_N2qCBUVm3S5JKDqrLzxjirr_5_6"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-on-primary-fixed/90 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10"></div>

        {/* Hero Content */}
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
            Join the future of finance.
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-md">
            Create an account today to take complete control of your wealth and unlock powerful analytics.
          </p>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface relative">
        {/* Subtle background ambient blob for depth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <Link 
          href="/" 
          className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Home
        </Link>

        <div className="w-full max-w-md relative z-10 mt-8 sm:mt-0">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
              <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
                FinTrack
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
              Create an account
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your details to get started.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="p-3 text-sm text-error bg-error-container rounded-lg">
                {error}
              </div>
            )}
            
            {/* Display Name Field */}
            <div className="space-y-2">
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-3 rounded-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-sm disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink-0 px-4 font-body-sm text-body-sm text-outline">
                Or continue with
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            <div className="w-full">
              <button
                className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm font-medium py-3 rounded-lg hover:bg-surface-variant/50 transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-70"
                type="button"
                onClick={handleGoogleRegister}
                disabled={loading}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Sign up with Google
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium hover:underline decoration-primary/30 underline-offset-4 transition-all"
              href="/login"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
