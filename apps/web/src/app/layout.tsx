import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Script from "next/script";
import "material-symbols/outlined.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const themeScript = `
  try {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch (e) { console.warn('[Theme]', e) }
`;

const swScript = `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function(e) {
        console.warn('[SW]', e);
      });
    });
  }
`;

export const metadata: Metadata = {
  title: "FinTrack - Personal Finance Management",
  description: "Track your income, expenses, and budgets effortlessly.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinTrack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://securetoken.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://securetoken.googleapis.com" />
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-on-background font-body-lg text-body-lg min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300">
        <Script id="register-sw" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: swScript }} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
