"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Cek apakah di tab browser ini sudah pernah muncul splash screen
    const hasSeen = sessionStorage.getItem("recoin_splash_shown");
    if (!hasSeen) {
      setMounted(true);
      const timer = setTimeout(() => {
        setFadeOut(true);
        sessionStorage.setItem("recoin_splash_shown", "true");
        // Hapus elemen dari DOM total setelah transisi 500ms selesai
        setTimeout(() => {
          setMounted(false);
        }, 500);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  // Jika sudah tidak aktif, jangan render apa pun ke layar (agar tidak menghalangi klik)
  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070d0a] transition-all duration-500 ease-in-out ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-2xl shadow-emerald-500/30">
          <div className="w-full h-full bg-[#0b1612] rounded-[22px] flex items-center justify-center text-4xl">
            ♻️
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
          🪙
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-wider text-white">
        RE<span className="text-amber-400">COIN</span>
      </h1>
      <p className="text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] mt-2 animate-pulse">
        Recycle Waste • Earn Coin
      </p>

      <div className="w-48 h-1 bg-neutral-900 rounded-full mt-8 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-amber-400 animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
}