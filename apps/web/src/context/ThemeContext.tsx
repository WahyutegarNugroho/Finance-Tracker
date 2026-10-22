"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import React from "react";

// Suppress the React 19 script tag warning in development (next-themes false positive)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args);
  };
}

type Theme = "light" | "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  
  const isDark = resolvedTheme === "dark" || theme === "dark";
  const currentTheme: Theme = isDark ? "dark" : "light";

  return {
    theme: currentTheme,
    rawTheme: theme,
    toggleTheme: () => setTheme(isDark ? "light" : "dark"),
    setTheme,
  };
};
