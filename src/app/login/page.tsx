"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const res = loginUser(email, password);
      if (res.success) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMsg(res.message);
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#060c09] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Background Glow Emerald */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-800/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
          ♻️
        </div>
        <div>
          <span className="text-2xl font-black tracking-tight text-white">
            RE<span className="text-amber-400">COIN</span>
          </span>
          <span className="block text-[10px] text-emerald-400/80 font-mono tracking-widest -mt-1 uppercase">
            Smart Ecosystem
          </span>
        </div>
      </Link>

      {/* Card Form Masuk */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#0e1d16] to-[#08120e] border border-emerald-500/30 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-950/60 relative">
        <div className="mb-8 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase tracking-widest mb-3">
            Portal Pengguna
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs text-neutral-400 mt-2">
            Masuk untuk memantau saldo e-wallet dan histori setor sampah.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Email Terdaftar
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050a07] border border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-neutral-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050a07] border border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-neutral-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50 text-neutral-950 font-black text-xs uppercase tracking-widest transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Memverifikasi...</span>
            ) : (
              <span>Masuk ke Akun →</span>
            )}
          </button>
        </form>

        {/* Link ke Halaman Daftar */}
        <div className="mt-8 pt-6 border-t border-emerald-950 text-center text-xs text-neutral-400">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-amber-400 font-bold hover:text-amber-300 transition underline underline-offset-4 decoration-amber-400/40"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}