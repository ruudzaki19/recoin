"use client";

import { useState } from "react";
import { loginUser, registerUser, getActiveUser, UserAccount } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserAccount) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [ewallet, setEwallet] = useState("GoPay");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (mode === "login") {
      const res = loginUser(email, password);
      setIsLoading(false);
      if (res.success) {
        const active = getActiveUser();
        if (active && onSuccess) onSuccess(active);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!fullName || !phone) {
        setIsLoading(false);
        setErrorMsg("Nama lengkap dan nomor HP wajib diisi.");
        return;
      }

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

      setIsLoading(false);
      if (res.success) {
        const active = getActiveUser();
        if (active && onSuccess) onSuccess(active);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative"
        style={{
          backgroundColor: isDark ? "#141e1a" : "#ffffff",
          borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
          color: isDark ? "#f3f4f6" : "#16201b",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-sm p-1 transition opacity-70 hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <h2 className="text-xl font-bold">
            {mode === "login" ? "Masuk ke Akun RECOIN" : "Daftar Akun Baru"}
          </h2>
          <p className="text-xs mt-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
            {mode === "login"
              ? "Masuk untuk melanjutkan transaksi setoran atau penarikan."
              : "Buat akun untuk mengumpulkan koin dari sampah daur ulang."}
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                placeholder="Nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                style={{
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  color: isDark ? "#f3f4f6" : "#16201b",
                }}
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: isDark ? "#101915" : "#f6faf7",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                color: isDark ? "#f3f4f6" : "#16201b",
              }}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: isDark ? "#101915" : "#f6faf7",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                color: isDark ? "#f3f4f6" : "#16201b",
              }}
            />
          </div>

          {mode === "register" && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1">
                  Nomor HP
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
                  style={{
                    backgroundColor: isDark ? "#101915" : "#f6faf7",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                    color: isDark ? "#f3f4f6" : "#16201b",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1">
                  E-Wallet
                </label>
                <select
                  value={ewallet}
                  onChange={(e) => setEwallet(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none cursor-pointer"
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
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition shadow-sm cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#2e7d32" }}
          >
            {isLoading
              ? "Memproses..."
              : mode === "login"
              ? "Masuk Sekarang"
              : "Daftar Akun"}
          </button>
        </form>

        <div
          className="mt-4 pt-3 border-t text-center text-xs"
          style={{
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
            color: isDark ? "#9ca3af" : "#5d6d66",
          }}
        >
          {mode === "login" ? (
            <span>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg("");
                }}
                className="font-semibold underline cursor-pointer"
                style={{ color: isDark ? "#81c784" : "#2e7d32" }}
              >
                Daftar di sini
              </button>
            </span>
          ) : (
            <span>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className="font-semibold underline cursor-pointer"
                style={{ color: isDark ? "#81c784" : "#2e7d32" }}
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}