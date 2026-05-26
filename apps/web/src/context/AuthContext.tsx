"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

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

  const setCurrency = useCallback((code: string) => {
    setCurrencyState(code);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Fetch user profile to get currency preference
      if (firebaseUser) {
        try {
          const json = await api.get("/users/profile");
          const userCurrency = json?.data?.currency || "IDR";
          setCurrencyState(userCurrency);
        } catch {
          // Keep default currency on error
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, currency, currencySymbol, formatCurrency, setCurrency, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
