"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("recoin_splash_shown");
    if (!hasSeen) {
      setMounted(true);
      const timer = setTimeout(() => {
        setFadeOut(true);
        sessionStorage.setItem("recoin_splash_shown", "true");
        setTimeout(() => {
          setMounted(false);
        }, 500);
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070d0a] transition-all duration-500 ease-in-out ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Efek Glow di Belakang Logo */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

        {/* LOGO RECOIN UTAMA (Langsung Tanpa Frame, Ukuran Besar) */}
        <div className="relative z-10 w-80 sm:w-96 md:w-[420px] flex items-center justify-center animate-in zoom-in-95 duration-500">
          <Image
            src="/logo-recoin.png"
            alt="RECOIN Logo"
            width={600}
            height={200}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      {/* Slogan */}
      <p className="text-emerald-400 font-mono text-xs sm:text-sm uppercase tracking-[0.4em] mt-2 animate-pulse text-center">
        Recycle Waste • Earn Coin
      </p>

      {/* Progress Shimmer Bar */}
      <div className="w-56 sm:w-64 h-1.5 bg-neutral-900 rounded-full mt-8 overflow-hidden border border-emerald-950/80 shadow-inner">
        <div className="w-full h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
}