import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import { LanguageProvider } from "@/lib/language";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "RECOIN - Reverse Vending Machine",
  description: "Tukar sampah kaleng dan kemasan menjadi saldo e-wallet instan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#f4f7f5] text-neutral-900 dark:bg-[#070d0a] dark:text-neutral-100 min-h-screen flex flex-col antialiased transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <SplashScreen />
            <Navbar />
            <main className="flex-1">{children}</main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}