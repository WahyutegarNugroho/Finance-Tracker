import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
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
        <ThemeProvider>
          <AuthProvider>
            {/* Decorative Background Image with Overlay */}
            <div
              className="absolute inset-0 z-[-1] opacity-20 pointer-events-none bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_xCGwus8xtDJoTvEo6FJPNIQLBzEJ1FqM0XDINgYWUbXj_Uu6cJ2a9I4k7hr2G9zVbpQaaMHpRKGiiFPI7cWMBMeMMUC-drjEe2M85Crbs9UIM92EauttQAVJxBs8ZmHTnQ3nEiHks3oVpCTypz9wzwhqCjPYz-USlRfERwbLu5IfW__I_NB0FoGRK5_Wa9Ac7hLKN022a1XfbtrIi9NeSDipVTwNyQCo4mI0Wy9mi_KHRjxQ6aBQythGMwQWml99YC64yb7Rzal1')",
              }}
            ></div>
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-background/40 via-background/80 to-background pointer-events-none transition-colors duration-300"></div>

            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
