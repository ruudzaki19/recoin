"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import { CoinEmblem } from "@/components/Emblems";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
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

    // Payload pendaftaran yang sudah sesuai dengan interface UserAccount terbaru
    const res = registerUser({
      id: "REC-" + Date.now().toString(36).toUpperCase(),
      fullName,
      email,
      password,
      phone,
      ewalletType: ewallet,
      coinBalance: 0,
      totalCoinsEarned: 0,
      totalRupiahWithdrawn: 0,
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
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#0d1512" : "#f1f4f1",
        color: isDark ? "#f3f4f6" : "#1c2520",
      }}
    >
      <div
        className="w-full max-w-md border rounded-2xl p-8 shadow-sm relative transition"
        style={{
          backgroundColor: isDark ? "#141e1a" : "#ffffff",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
          boxShadow: isDark ? "none" : "0 8px 30px -4px rgba(22, 32, 27, 0.06)",
        }}
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3 border font-semibold"
            style={{
              backgroundColor: isDark ? "rgba(46, 125, 50, 0.2)" : "#e5eee7",
              borderColor: isDark ? "rgba(76, 175, 80, 0.3)" : "#c6d8cb",
              color: isDark ? "#a5d6a7" : "#246b3e",
            }}
          >
            PORTAL PENGGUNA
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Register Akun RECOIN</h1>
          <p
            className="text-xs mt-1"
            style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
          >
            Kaitkan nomor e-wallet untuk pencairan instan di mesin vending.
          </p>
        </div>

        {errorMsg && (
          <div
            className="mb-4 p-3 rounded-xl border text-xs text-center font-medium"
            style={{
              backgroundColor: isDark ? "rgba(185, 28, 28, 0.2)" : "#fef2f2",
              borderColor: isDark ? "rgba(239, 68, 68, 0.3)" : "#fecaca",
              color: isDark ? "#f87171" : "#b91c1c",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
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
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:border-[#2e7d32]"
              style={{
                backgroundColor: isDark ? "#101915" : "#f6faf7",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                color: isDark ? "#f3f4f6" : "#16201b",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
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
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition font-mono focus:border-[#2e7d32]"
                style={{
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  color: isDark ? "#f3f4f6" : "#16201b",
                }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
              >
                Pilihan E-Wallet
              </label>
              <select
                value={ewallet}
                onChange={(e) => setEwallet(e.target.value)}
                className="w-full rounded-xl px-3 py-3 text-sm outline-none border transition cursor-pointer focus:border-[#2e7d32]"
                style={{
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  color: isDark ? "#f3f4f6" : "#16201b",
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
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
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
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:border-[#2e7d32]"
              style={{
                backgroundColor: isDark ? "#101915" : "#f6faf7",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                color: isDark ? "#f3f4f6" : "#16201b",
              }}
            />
          </div>

          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
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
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition pr-11 focus:border-[#2e7d32]"
                style={{
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  color: isDark ? "#f3f4f6" : "#16201b",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 transition cursor-pointer"
                style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
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
            className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundColor: isDark ? "#d97706" : "#f59e0b",
              color: isDark ? "#ffffff" : "#16201b",
            }}
          >
            <CoinEmblem size={16} />
            <span>{isLoading ? "Mendaftarkan Akun..." : "REGISTER AKUN BARU"}</span>
          </button>
        </form>

        <div
          className="mt-6 pt-4 border-t text-center text-xs"
          style={{
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
            color: isDark ? "#9ca3af" : "#5d6d66",
          }}
        >
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: isDark ? "#81c784" : "#2e7d32" }}
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}