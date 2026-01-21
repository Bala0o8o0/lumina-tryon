import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import CardNav from "@/components/CardNav";
import Aurora from "@/components/Aurora";
import SplashCursor from "@/components/SplashCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtual Try-On | AI Fashion Technology",
  description: "Experience the future of fashion with neural rendering. Try on any outfit instantly with physics-accurate simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white relative`}
      >
        {/* Base Background Layer */}
        <div className="fixed inset-0 bg-black -z-50" />





        {/* Splash Cursor */}
        <SplashCursor />

        <AuthProvider>
          {/* Card Navigation */}
          <CardNav />

          <main className="min-h-screen relative z-10">
            {children}
          </main>

          <Toaster />

          {/* Footer */}
          <footer className="relative border-t border-purple-500/20 bg-black/80 backdrop-blur-xl mt-auto">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
              <div className="flex flex-col items-center gap-8">
                <div className="flex justify-center space-x-10">
                  {['Twitter', 'GitHub', 'Discord'].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-zinc-400 hover:text-purple-400 transition-colors text-sm font-medium"
                    >
                      {item}
                    </a>
                  ))}
                </div>
                <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <p className="text-center text-sm text-zinc-400">
                  © 2025 Lumina Try. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}