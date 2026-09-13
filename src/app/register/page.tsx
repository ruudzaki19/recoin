"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ewallet, setEwallet] = useState("GoPay");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !phone || !email || !password) {
      setErrorMsg("Harap isi seluruh formulir pendaftaran.");
      return;
    }

    setIsLoading(true);
    const res = registerUser({
      id: "REC-" + Date.now().toString(36).toUpperCase(),
      fullName,
      email,
      password,
      phone,
      ewalletType: ewallet,
      totalEarnedRupiah: 0,
      totalGrams: 0,
      createdAt: new Date().toLocaleDateString("id-ID"),
    });

    if (res.success) {
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else {
      setErrorMsg(res.message);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300 selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: isDark ? "#070d0a" : "#f4f7f5",
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      <div
        className="w-full max-w-md border rounded-3xl p-8 shadow-2xl relative transition"
        style={{
          backgroundColor: isDark ? "#0e1d16" : "#ffffff",
          borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0",
        }}
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3 border"
            style={{
              backgroundColor: isDark ? "rgba(6,78,59,0.8)" : "#d1fae5",
              borderColor: isDark ? "rgba(16,185,129,0.4)" : "#a7f3d0",
              color: isDark ? "#34d399" : "#065f46",
            }}
          >
            PORTAL PENGGUNA
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Register Akun RECOIN</h1>
          <p
            className="text-xs mt-1"
            style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
          >
            Kaitkan nomor e-wallet untuk pencairan instan di mesin vending.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label
              className="block text-[11px] font-bold uppercase tracking-wider mb-1"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              placeholder="Masukkan nama lengkap akun"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:border-emerald-400"
              style={{
                backgroundColor: isDark ? "#09140f" : "#f9fafb",
                borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                color: isDark ? "#ffffff" : "#111827",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                Nomor HP (E-Wallet)
              </label>
              <input
                type="tel"
                required
                autoComplete="off"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition font-mono focus:border-emerald-400"
                style={{
                  backgroundColor: isDark ? "#09140f" : "#f9fafb",
                  borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                Pilihan E-Wallet
              </label>
              <select
                value={ewallet}
                onChange={(e) => setEwallet(e.target.value)}
                className="w-full rounded-xl px-3 py-3 text-sm outline-none border transition cursor-pointer focus:border-emerald-400"
                style={{
                  backgroundColor: isDark ? "#09140f" : "#f9fafb",
                  borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                <option value="GoPay">GoPay</option>
                <option value="DANA">DANA</option>
                <option value="OVO">OVO</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-[11px] font-bold uppercase tracking-wider mb-1"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:border-emerald-400"
              style={{
                backgroundColor: isDark ? "#09140f" : "#f9fafb",
                borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                color: isDark ? "#ffffff" : "#111827",
              }}
            />
          </div>

          <div>
            <label
              className="block text-[11px] font-bold uppercase tracking-wider mb-1"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Buat kata sandi aman"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition pr-11 focus:border-emerald-400"
                style={{
                  backgroundColor: isDark ? "#09140f" : "#f9fafb",
                  borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 transition cursor-pointer"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                title={showPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? "Mendaftarkan Akun..." : "REGISTER AKUN BARU 🪙"}
          </button>
        </form>

        <div
          className="mt-6 pt-4 border-t text-center text-xs"
          style={{
            borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e2e8f0",
            color: isDark ? "#a3a3a3" : "#6b7280",
          }}
        >
          Sudah punya akun?{" "}
          <Link href="/login" className="text-emerald-500 font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>

      </div>
    </div>
  );
}