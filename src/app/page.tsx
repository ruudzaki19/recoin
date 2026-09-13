"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getStoredTransactions,
  TRASH_TYPES,
  VendingTransaction,
  getActiveUser,
  UserAccount,
} from "@/lib/storage";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

export default function HomePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [transactions, setTransactions] = useState<VendingTransaction[]>([]);
  const [calcType, setCalcType] = useState<string>("can");
  const [calcWeight, setCalcWeight] = useState<number>(250);

  useEffect(() => {
    setUser(getActiveUser());
    setTransactions(getStoredTransactions());
  }, []);

  const isDark = theme === "dark";
  const activeTrash = TRASH_TYPES.find((t) => t.id === calcType) || TRASH_TYPES[0];
  const calculatedEstimate = Math.round((calcWeight / 10) * activeTrash.ratePer10Gram);

  // STATISTIK GLOBAL
  const globalRupiah = transactions.reduce((acc, curr) => acc + (curr.payoutRupiah || 0), 0);
  const globalGrams = transactions.reduce((acc, curr) => acc + (curr.weightGram || 0), 0);

  // STATISTIK PERSONAL
  const userTransactions = user
    ? transactions.filter((tx) => tx.userId === user.id || tx.userEmail === user.email)
    : [];
  const userRupiah = user ? (user.totalEarnedRupiah || 0) : 0;
  const userGrams = user ? (user.totalGrams || 0) : 0;
  const userDepositCount = userTransactions.length;

  return (
    <div
      className="min-h-screen transition-colors duration-300 relative selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: isDark ? "#070d0a" : "#f4f7f5",
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      {/* Background Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            {t.heroTitle1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">
              {t.heroTitle2}
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-normal"
            style={{ color: isDark ? "#a3a3a3" : "#4b5563" }}
          >
            {t.heroDesc}
          </p>

          <div className="pt-4 flex items-center justify-center">
            <Link
              href="/kiosk"
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black tracking-wide text-xs uppercase transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 hover:scale-105 cursor-pointer"
            >
              <span>{t.heroCta}</span>
              <span className="text-base">🪙</span>
            </Link>
          </div>

          {/* AREA STATISTIK */}
          <div className="pt-10 max-w-4xl mx-auto">
            {!user ? (
              /* BELUM LOGIN */
              <div className="space-y-3">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border"
                  style={{
                    backgroundColor: isDark ? "#111814" : "#e5e7eb",
                    borderColor: isDark ? "#1f2923" : "#d1d5db",
                    color: isDark ? "#a3a3a3" : "#4b5563",
                  }}
                >
                  <span>🌐</span> {t.globalStatBadge}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-6 rounded-3xl border text-left shadow-xl transition"
                    style={{
                      backgroundColor: isDark ? "#0e1d16" : "#ffffff",
                      borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e2e8f0",
                    }}
                  >
                    <div className="text-3xl mb-2">🪙</div>
                    <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono tracking-tight">
                      Rp{globalRupiah.toLocaleString("id-ID")}
                    </div>
                    <div
                      className="text-xs mt-2 font-medium"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      {t.globalTotalEarned}
                    </div>
                  </div>

                  <div
                    className="p-6 rounded-3xl border text-left shadow-xl transition"
                    style={{
                      backgroundColor: isDark ? "#0e1d16" : "#ffffff",
                      borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e2e8f0",
                    }}
                  >
                    <div className="text-3xl mb-2">♻️</div>
                    <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                      {(globalGrams / 1000).toFixed(2)} Kg
                    </div>
                    <div
                      className="text-xs mt-2 font-medium"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      {t.globalTotalWeight}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SUDAH LOGIN */
              <div className="space-y-3">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border"
                  style={{
                    backgroundColor: isDark ? "rgba(6,78,59,0.4)" : "#d1fae5",
                    borderColor: isDark ? "rgba(16,185,129,0.3)" : "#a7f3d0",
                    color: isDark ? "#34d399" : "#047857",
                  }}
                >
                  <span>👤</span> {t.userStatBadge} <strong>{user.fullName}</strong>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className="p-5 rounded-3xl border shadow-xl text-left"
                    style={{
                      backgroundColor: isDark ? "#10221b" : "#ffffff",
                      borderColor: isDark ? "rgba(245,158,11,0.4)" : "#fed7aa",
                    }}
                  >
                    <span className="text-2xl block mb-2">🪙</span>
                    <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
                      Rp{userRupiah.toLocaleString("id-ID")}
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      {t.userTotalEarned}
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-3xl border shadow-xl text-left"
                    style={{
                      backgroundColor: isDark ? "#10221b" : "#ffffff",
                      borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e2e8f0",
                    }}
                  >
                    <span className="text-2xl block mb-2">⚖️</span>
                    <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                      {(userGrams / 1000).toFixed(2)} Kg
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      {t.userTotalWeight} ({userGrams} g)
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-3xl border shadow-xl text-left"
                    style={{
                      backgroundColor: isDark ? "#10221b" : "#ffffff",
                      borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e2e8f0",
                    }}
                  >
                    <span className="text-2xl block mb-2">🧾</span>
                    <div className="text-2xl md:text-3xl font-black font-mono">
                      {userDepositCount} {t.times}
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      {t.userTotalDeposits}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KATALOG NILAI */}
      <section
        id="rates"
        className="py-16 px-6 border-t"
        style={{
          borderColor: isDark ? "rgba(6,78,59,0.4)" : "#e5e7eb",
          backgroundColor: isDark ? "rgba(10,20,16,0.5)" : "#ffffff",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
              {t.categoryBadge}
            </span>
            <h2 className="text-3xl font-black mt-1">{t.categoryTitle}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="p-6 rounded-3xl border"
              style={{
                backgroundColor: isDark ? "#10221b" : "#f9fafb",
                borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e5e7eb",
              }}
            >
              <div className="text-4xl mb-3">🥫</div>
              <h3 className="text-xl font-bold">{t.canTitle}</h3>
              <p
                className="text-xs mt-2 mb-4"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.canDesc}
              </p>
              <div
                className="pt-3 border-t flex justify-between items-baseline"
                style={{ borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e5e7eb" }}
              >
                <span
                  className="text-xs"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  {t.ratePer10g}
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">Rp50 / 10g</span>
              </div>
            </div>

            <div
              className="p-6 rounded-3xl border"
              style={{
                backgroundColor: isDark ? "#10221b" : "#f9fafb",
                borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e5e7eb",
              }}
            >
              <div className="text-4xl mb-3">🥨</div>
              <h3 className="text-xl font-bold">{t.snackTitle}</h3>
              <p
                className="text-xs mt-2 mb-4"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.snackDesc}
              </p>
              <div
                className="pt-3 border-t flex justify-between items-baseline"
                style={{ borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e5e7eb" }}
              >
                <span
                  className="text-xs"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  {t.ratePer10g}
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">Rp20 / 10g</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KALKULATOR */}
      <section id="calculator" className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto border rounded-3xl p-8 shadow-2xl"
          style={{
            backgroundColor: isDark ? "#0d1a14" : "#ffffff",
            borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e5e7eb",
          }}
        >
          <div className="text-center mb-8">
            <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
              {t.calcBadge}
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-1">{t.calcTitle}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label
                  className="text-xs font-semibold block mb-2"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  {t.calcSelectTrash}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TRASH_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCalcType(type.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                        calcType === type.id
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-neutral-700/40 bg-neutral-800/20 opacity-70"
                      }`}
                    >
                      {type.icon} {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div
                  className="flex justify-between text-xs font-semibold mb-2"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  <span>{t.calcEstimatedWeight}</span>
                  <span className="text-emerald-400 font-mono font-bold">{calcWeight} Gram</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div
              className="p-6 rounded-2xl border text-center space-y-3"
              style={{
                backgroundColor: isDark ? "#08120e" : "#f9fafb",
                borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e5e7eb",
              }}
            >
              <span
                className="text-xs uppercase tracking-widest font-semibold block"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.calcPayoutTitle}
              </span>
              <div className="text-4xl font-black text-amber-400 font-mono">
                Rp{calculatedEstimate.toLocaleString("id-ID")}
              </div>
              <p
                className="text-[11px]"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.calcPayoutDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AKTIVITAS TRANSAKSI */}
      <section
        id="activity"
        className="py-16 px-6 border-t"
        style={{
          borderColor: isDark ? "rgba(6,78,59,0.4)" : "#e5e7eb",
          backgroundColor: isDark ? "rgba(10,20,16,0.3)" : "#ffffff",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                {t.liveActivityBadge}
              </span>
              <h2 className="text-2xl md:text-3xl font-black mt-1">{t.liveActivityTitle}</h2>
            </div>
            <span
              className="text-xs font-mono mt-2 md:mt-0"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              {t.liveSyncText}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div
              className="p-12 text-center rounded-3xl border border-dashed"
              style={{
                backgroundColor: isDark ? "rgba(20,20,20,0.2)" : "#f9fafb",
                borderColor: isDark ? "#262626" : "#d1d5db",
              }}
            >
              <p
                className="text-sm"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.noTransactions}
              </p>
              <Link href="/kiosk" className="text-xs text-emerald-400 hover:underline mt-2 inline-block">
                {t.firstDepositPrompt}
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {transactions.slice(0, 5).map((tx, idx) => {
                const trashTypeString = String(tx.trashType || "");
                const isCan = trashTypeString.toLowerCase().includes("kaleng");
                const uniqueKey = tx.id ? `${tx.id}-${idx}` : `tx-${idx}`;

                return (
                  <div
                    key={uniqueKey}
                    className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-600 transition"
                    style={{
                      backgroundColor: isDark ? "#0d1a14" : "#ffffff",
                      borderColor: isDark ? "rgba(6,78,59,0.4)" : "#e5e7eb",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border flex items-center justify-center text-lg"
                        style={{
                          backgroundColor: isDark ? "#062b1b" : "#ecfdf5",
                          borderColor: isDark ? "#065f46" : "#a7f3d0",
                        }}
                      >
                        {isCan ? "🥫" : "🥨"}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{trashTypeString || "Sampah Daur Ulang"}</div>
                        <div
                          className="text-xs font-mono"
                          style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                        >
                          ID: {tx.id || `REC-${idx + 1}`} • {tx.createdAt || "Hari ini"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                      <div>
                        <div
                          className="text-xs font-medium"
                          style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                        >
                          {t.weightLabel}
                        </div>
                        <div className="text-sm font-mono text-emerald-400 font-bold">
                          {tx.weightGram || 0} Gram
                        </div>
                      </div>
                      <div>
                        <div
                          className="text-xs font-medium"
                          style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                        >
                          {t.payoutToLabel} {tx.ewalletType || "E-Wallet"}
                        </div>
                        <div className="text-sm font-mono text-amber-400 font-black">
                          +Rp{(tx.payoutRupiah || 0).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t py-8 text-center text-xs font-mono"
        style={{
          borderColor: isDark ? "rgba(6,78,59,0.4)" : "#e5e7eb",
          color: isDark ? "#737373" : "#9ca3af",
        }}
      >
        <p>© 2026 RECOIN Eco-Smart Vending Machine Platform.</p>
      </footer>
    </div>
  );
}