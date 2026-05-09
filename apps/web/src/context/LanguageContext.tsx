"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "../lib/translations";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "id")) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = translations[language];

    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else {
        // Fallback to English if key missing in current language
        let fallback: any = translations["en"];
        for (const fKey of keys) {
          if (fallback && fallback[fKey]) {
            fallback = fallback[fKey];
          } else {
            return keyPath; // Return the path as last resort
          }
        }
        return fallback;
      }
    }

    return typeof current === "string" ? current : keyPath;
  };

  const tCategory = (name: string): string => {
    const localizedName = translations[language]?.category_names?.[name];
    if (localizedName) return localizedName;
    
    // Fallback to English mapping if current language is not English
    if (language !== "en") {
      const fallbackName = translations["en"]?.category_names?.[name];
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
