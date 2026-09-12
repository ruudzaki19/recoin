"use client";

import { useState } from "react";
import { loginUser, registerUser, UserAccount } from "@/lib/storage";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ewallet, setEwallet] = useState<"GoPay" | "DANA" | "OVO">("GoPay");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "login") {
      const res = loginUser(email, password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!fullName || !phone || !email || !password) {
        setErrorMsg("Lengkapi semua data pendaftaran.");
        return;
      }
      const res = registerUser(fullName, email, password, phone, ewallet);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0e1d16] to-[#070d0a] border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 text-white">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition text-lg"
        >
          ✕
        </button>

        {/* Header Modal */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 text-2xl shadow-lg shadow-emerald-500/20 mb-3">
            ♻️
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {mode === "login" ? "Masuk ke Akun RECOIN" : "Buat Akun RECOIN Baru"}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {mode === "login"
              ? "Kaitkan e-wallet & kumpulkan saldo dari sampahmu"
              : "Daftar sekali untuk akses semua mesin vending RECOIN"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruud Zaki"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#070d0a] border border-emerald-950 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    No. Handphone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#070d0a] border border-emerald-950 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Default E-Wallet
                  </label>
                  <select
                    value={ewallet}
                    onChange={(e) => setEwallet(e.target.value as "GoPay" | "DANA" | "OVO")}
                    className="w-full bg-[#070d0a] border border-emerald-950 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm outline-none transition"
                  >
                    <option value="GoPay">GoPay</option>
                    <option value="DANA">DANA</option>
                    <option value="OVO">OVO</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#070d0a] border border-emerald-950 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#070d0a] border border-emerald-950 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 text-neutral-950 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
          >
            {mode === "login" ? "Masuk Sekarang" : "Buat Akun & Mulai"}
          </button>
        </form>

        {/* Tab Beralih Mode */}
        <div className="mt-6 pt-4 border-t border-emerald-950/80 text-center text-xs text-neutral-400">
          {mode === "login" ? (
            <p>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg("");
                }}
                className="text-amber-400 font-bold hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}