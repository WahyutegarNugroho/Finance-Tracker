"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import logger from "@/lib/logger";

function setAuthCookie(token: string | null) {
  if (typeof document === 'undefined') return
  if (token) {
    document.cookie = `auth_token=${token}; path=/; SameSite=Lax; max-age=3600`
  } else {
    document.cookie = 'auth_token=; path=/; SameSite=Lax; max-age=0'
  }
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  IDR: "Rp",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  currency: string;       // e.g. "IDR"
  currencySymbol: string; // e.g. "Rp"
  formatCurrency: (amount: number) => string;
  setCurrency: (code: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  currency: "IDR",
  currencySymbol: "Rp",
  formatCurrency: (amount: number) => `Rp${amount}`,
  setCurrency: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrencyState] = useState("IDR");
  const router = useRouter();

  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === "IDR" || currency === "JPY" ? 0 : 2,
    }).format(amount);
  }, [currency]);

  const setCurrency = useCallback(async (code: string) => {
    setCurrencyState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("currency", code);
    }
    try {
      await api.put("/users/profile", { currency: code });
    } catch (err) {
      logger.warn({ err, currency: code }, "Failed to sync currency preference");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        firebaseUser.getIdToken().then((token) => setAuthCookie(token))
        // Load cached currency immediately to prevent layout shifts
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("currency");
          if (cached) {
            setCurrencyState(cached);
          }
        }

        // Fetch fresh profile in the background
        api.get("/users/profile")
          .then((json) => {
            const userCurrency = json?.data?.currency || "IDR";
            setCurrencyState(userCurrency);
            if (typeof window !== "undefined") {
              localStorage.setItem("currency", userCurrency);
            }
          })
          .catch((err) => {
            logger.warn({ err }, "Failed to fetch profile currency — using cached/default");
          });
      } else {
        setAuthCookie(null)
      }
    });

    // Refresh auth cookie every 30 minutes to stay in sync with Firebase token lifecycle
    const cookieInterval = setInterval(() => {
      if (auth.currentUser) {
        auth.currentUser.getIdToken(true).then(setAuthCookie).catch(() => {})
      }
    }, 30 * 60 * 1000)

    return () => { unsubscribe(); clearInterval(cookieInterval) }
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthCookie(null);
      router.push("/login");
    } catch (err) {
      logger.warn({ err }, "Logout error — redirecting to login");
      setAuthCookie(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, currency, currencySymbol, formatCurrency, setCurrency, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
