"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ewallet, setEwallet] = useState<"GoPay" | "DANA" | "OVO">("GoPay");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !phone || !email || !password) {
      setErrorMsg("Mohon lengkapi semua data pendaftaran.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerUser(fullName, email, password, phone, ewallet);
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
    <div className="min-h-screen bg-[#060c09] text-white flex flex-col justify-center items-center p-4 relative selection:bg-amber-400 selection:text-black">
      {/* Background Glow Gold */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
          🪙
        </div>
        <div>
          <span className="text-2xl font-black tracking-tight text-white">
            RE<span className="text-amber-400">COIN</span>
          </span>
          <span className="block text-[10px] text-amber-400 font-mono tracking-widest -mt-1 uppercase">
            Register Portal
          </span>
        </div>
      </Link>

      {/* Box Form Register */}
      <div className="w-full max-w-lg bg-gradient-to-b from-[#121c15] to-[#09120e] border border-amber-500/30 rounded-3xl p-8 md:p-10 shadow-2xl shadow-amber-950/40">
        <div className="mb-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono uppercase tracking-widest mb-3">
            Pendaftaran Baru
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Register Akun RECOIN
          </h1>
          <p className="text-xs text-neutral-400 mt-2">
            Kaitkan nomor e-wallet untuk pencairan instan di mesin vending.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ruud Zaki"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#050a07] border border-emerald-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Nomor HP (E-Wallet)
              </label>
              <input
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#050a07] border border-emerald-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-sm outline-none transition font-mono placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Pilihan E-Wallet
              </label>
              <select
                value={ewallet}
                onChange={(e) => setEwallet(e.target.value as "GoPay" | "DANA" | "OVO")}
                className="w-full bg-[#050a07] border border-emerald-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
              >
                <option value="GoPay">GoPay</option>
                <option value="DANA">DANA</option>
                <option value="OVO">OVO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050a07] border border-emerald-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050a07] border border-emerald-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-neutral-950 font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? "Mendaftarkan Akun..." : "Register Akun Baru 🪙"}
          </button>
        </form>

        {/* Link Pindah ke Login */}
        <div className="mt-6 pt-5 border-t border-emerald-950/80 text-center text-xs text-neutral-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-emerald-400 font-bold hover:text-emerald-300 transition underline underline-offset-4 decoration-emerald-400/40"
          >
            Login di sini
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