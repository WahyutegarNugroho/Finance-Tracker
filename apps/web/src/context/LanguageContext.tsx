"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, type Translations } from "../lib/translations";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tCategory: (name: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "id")) {
      // ponytail: setTimeout hydration hack → read lang from <html lang=...> attribute set server-side
      setTimeout(() => {
        setLanguageState(savedLang);
      }, 0);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: string | Translations = translations[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        let fallback: string | Translations = translations["en"];
        for (const fKey of keys) {
          if (fallback && typeof fallback === "object" && fKey in fallback) {
            fallback = fallback[fKey];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === "string" ? fallback : keyPath;
      }
    }

    return typeof current === "string" ? current : keyPath;
  };

  const tCategory = (name: string): string => {
    const dict = translations[language] as Record<string, Record<string, string>>;
    const localizedName = dict?.category_names?.[name];
    if (localizedName) return localizedName;

    if (language !== "en") {
      const enDict = translations["en"] as Record<string, Record<string, string>>;
      const fallbackName = enDict?.category_names?.[name];
      if (fallbackName) return fallbackName;
    }

    return name;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCategory }}>
      {/* Prevent hydration mismatch by only rendering after mount if needed, 
          but for simplicity we just return children and handle mounting in components if necessary */}
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
