import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Providers from "@/components/Providers";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-on-background font-body-lg text-body-lg min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300">
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {
                    // SW registration failure is expected in dev/offline — silent
                  });
                });
              }
            `,
          }}
        />
        <Providers>
          {/* Decorative Background Gradient */}
          <div className="absolute inset-0 z-[-1] pointer-events-none bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent"></div>
          <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-background/40 via-background/80 to-background pointer-events-none transition-colors duration-300"></div>

          {children}
        </Providers>
      </body>
    </html>
  );
}
