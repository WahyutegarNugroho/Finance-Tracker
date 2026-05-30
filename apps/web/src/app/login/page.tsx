"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { api } from "@/lib/api";
import type { FirebaseAuthError } from "@/types";
import { FIREBASE_ERRORS } from "@/lib/constants";

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
      const code = fbErr?.code || '';
      setError(FIREBASE_ERRORS[code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setForgotPwdMsg("Please enter your email address first.");
      return;
    }
    setError("");
    setForgotPwdMsg("");
    setForgotPwdLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setForgotPwdMsg("Password reset email sent. Check your inbox.");
    } catch (err: unknown) {
      const fbErr = err as FirebaseAuthError;
      const code = fbErr?.code || '';
      const errorMap: Record<string, string> = {
        'auth/user-not-found': 'Email not registered.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      setForgotPwdMsg(errorMap[code] || 'Failed to send reset email.');
    } finally {
      setForgotPwdLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      await api.post("/auth/google", {});
      router.push("/dashboard");
    } catch (err: unknown) {
      const fbErr = err as FirebaseAuthError;
      const code = fbErr?.code || '';
      setError(FIREBASE_ERRORS[code] || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      {/* Left Panel: Hero/Gradient Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Hero Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/30 via-primary-fixed/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10"></div>

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
            Smart money management starts here.
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-md">
            Track your income, control expenses, and stay on budget —
            all from one clean dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
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
              Welcome back
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Please enter your details to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            {forgotPwdMsg && (
              <div className={`p-3 text-sm rounded-lg ${forgotPwdMsg.includes("sent") ? "text-secondary bg-secondary-container" : "text-error bg-error-container"}`}>
                {forgotPwdMsg}
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-error bg-error-container rounded-lg">
                {error}
              </div>
            )}
            
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
              <div className="flex justify-between items-center">
                <label
                  className="block font-label-caps text-label-caps text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotPwdLoading}
                  className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors font-medium disabled:opacity-50"
                >
                  {forgotPwdLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>
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
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-4">
              <button
                className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded-lg shadow-sm hover:bg-primary-container hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && (
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant/50"></div>
                <span className="flex-shrink-0 mx-4 font-body-sm text-body-sm text-outline">
                  or
                </span>
                <div className="flex-grow border-t border-outline-variant/50"></div>
              </div>

              <button
                className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm font-medium py-3 rounded-lg hover:bg-surface-variant/50 transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-70"
                type="button"
                onClick={handleGoogleLogin}
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
                Sign in with Google
              </button>
            </div>
          </form>

          <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              className="text-primary font-medium hover:underline decoration-primary/30 underline-offset-4 transition-all"
              href="/register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
