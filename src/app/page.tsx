"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getStoredTransactions,
  getStoredRedeems,
  TRASH_TYPES,
  VendingTransaction,
  RedeemTransaction,
  getActiveUser,
  UserAccount,
  COIN_TO_RUPIAH_RATE,
} from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import {
  CanEmblem,
  SnackEmblem,
  PaperEmblem,
  ScaleEmblem,
  CoinEmblem,
  WalletPayoutEmblem,
} from "@/components/Emblems";

export default function HomePage() {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isDark = theme === "dark";

  const [user, setUser] = useState<UserAccount | null>(null);
  const [transactions, setTransactions] = useState<VendingTransaction[]>([]);
  const [redeems, setRedeems] = useState<RedeemTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const [calcType, setCalcType] = useState<string>("can");
  const [calcWeight, setCalcWeight] = useState<number>(250);

  useEffect(() => {
    const sync = () => {
      setUser(getActiveUser());
      setTransactions(getStoredTransactions());
      setRedeems(getStoredRedeems());
    };
    sync();

    window.addEventListener("recoin_user_updated", sync);
    return () => window.removeEventListener("recoin_user_updated", sync);
  }, []);

  const activeTrash = TRASH_TYPES.find((t) => t.id === calcType) || TRASH_TYPES[0];
  const calculatedEstimateCoins = Math.round((calcWeight / 10) * activeTrash.ratePer10GramCoins);
  const estimatedRupiahValue = calculatedEstimateCoins * COIN_TO_RUPIAH_RATE;

  const globalCoins = transactions.reduce((acc, curr) => acc + (curr.earnedCoins || 0), 0);
  const globalGrams = transactions.reduce((acc, curr) => acc + (curr.weightGram || 0), 0);

  const getTrashTitle = (id: string) => {
    if (id === "can") return t.canName;
    if (id === "snack") return t.snackName;
    return t.paperName;
  };

  const getTrashDesc = (id: string) => {
    if (id === "can") return t.canDesc;
    if (id === "snack") return t.snackDesc;
    return t.paperDesc;
  };

  const renderTrashEmblem = (id: string, size = 30) => {
    const colorClass = isDark ? "text-emerald-400" : "text-emerald-800";
    if (id === "can") return <CanEmblem size={size} className={colorClass} />;
    if (id === "snack") return <SnackEmblem size={size} className={colorClass} />;
    return <PaperEmblem size={size} className={colorClass} />;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 relative"
      style={{
        backgroundColor: isDark ? "#0d1512" : "#f1f4f1",
        color: isDark ? "#f3f4f6" : "#1c2520",
      }}
    >
      {!isDark && (
        <div
          className="absolute top-0 inset-x-0 h-[480px] pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 350px at 50% 0%, rgba(200, 220, 208, 0.45), transparent 70%)",
          }}
        />
      )}

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wide border shadow-sm font-semibold"
            style={{
              backgroundColor: isDark ? "rgba(46, 125, 50, 0.2)" : "#e5eee7",
              borderColor: isDark ? "rgba(76, 175, 80, 0.3)" : "#c6d8cb",
              color: isDark ? "#a5d6a7" : "#246b3e",
            }}
          >
            <span>{t.heroBadge}</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
            style={{ color: isDark ? "#ffffff" : "#16201b" }}
          >
            {t.heroTitle1} <br />
            <span style={{ color: isDark ? "#fcd34d" : "#b45309" }}>
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-normal"
            style={{ color: isDark ? "#9ca3af" : "#47554f" }}
          >
            {t.heroDesc}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/kiosk"
              className="px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition shadow-sm hover:opacity-95 flex items-center justify-center gap-2.5"
              style={{
                backgroundColor: "#2e7d32",
                color: "#ffffff",
              }}
            >
              <ScaleEmblem size={17} />
              <span>{t.btnDeposit}</span>
            </Link>

            <Link
              href="/kiosk#tukar-koin-section"
              className="px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition shadow-sm hover:opacity-95 flex items-center justify-center gap-2.5"
              style={{
                backgroundColor: isDark ? "#d97706" : "#f59e0b",
                color: isDark ? "#ffffff" : "#16201b",
              }}
            >
              <WalletPayoutEmblem size={17} />
              <span>{t.btnWithdraw}</span>
            </Link>
          </div>

          {/* KARTU STATISTIK */}
          <div className="pt-10 max-w-4xl mx-auto">
            {!user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-6 rounded-2xl border text-left transition"
                  style={{
                    backgroundColor: isDark ? "#141e1a" : "#ffffff",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                    boxShadow: isDark
                      ? "none"
                      : "0 6px 20px -4px rgba(22, 32, 27, 0.06)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: isDark ? "#282015" : "#fcf4e6",
                      color: isDark ? "#fcd34d" : "#c26d05",
                    }}
                  >
                    <CoinEmblem size={24} />
                  </div>
                  <div
                    className="text-3xl md:text-4xl font-bold font-mono tracking-tight"
                    style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                  >
                    {globalCoins.toLocaleString(language === "en" ? "en-US" : "id-ID")} RECOIN
                  </div>
                  <div
                    className="text-xs mt-2 font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                  >
                    {t.statGlobalCoinsLabel}
                  </div>
                </div>

                <div
                  className="p-6 rounded-2xl border text-left transition"
                  style={{
                    backgroundColor: isDark ? "#141e1a" : "#ffffff",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                    boxShadow: isDark
                      ? "none"
                      : "0 6px 20px -4px rgba(22, 32, 27, 0.06)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: isDark ? "#1f2d26" : "#e7efe9",
                      color: isDark ? "#81c784" : "#246b3e",
                    }}
                  >
                    <ScaleEmblem size={24} />
                  </div>
                  <div
                    className="text-3xl md:text-4xl font-bold font-mono tracking-tight"
                    style={{ color: isDark ? "#81c784" : "#246b3e" }}
                  >
                    {(globalGrams / 1000).toFixed(2)} Kg
                  </div>
                  <div
                    className="text-xs mt-2 font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                  >
                    {t.statGlobalGramsLabel}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border shadow-sm"
                  style={{
                    backgroundColor: isDark ? "rgba(46, 125, 50, 0.2)" : "#e5eee7",
                    borderColor: isDark ? "rgba(76, 175, 80, 0.3)" : "#c6d8cb",
                    color: isDark ? "#a5d6a7" : "#246b3e",
                  }}
                >
                  <span>{t.walletBadge} <strong>{user.fullName}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className="p-5 rounded-2xl border text-left transition"
                    style={{
                      backgroundColor: isDark ? "#141e1a" : "#ffffff",
                      borderColor: isDark ? "rgba(217, 119, 6, 0.35)" : "#f3dfb5",
                      boxShadow: isDark
                        ? "none"
                        : "0 6px 20px -4px rgba(22, 32, 27, 0.05)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: isDark ? "#282015" : "#fcf4e6",
                        color: isDark ? "#fcd34d" : "#c26d05",
                      }}
                    >
                      <CoinEmblem size={22} />
                    </div>
                    <div
                      className="text-2xl md:text-3xl font-bold font-mono"
                      style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                    >
                      {(user.coinBalance || 0).toLocaleString(language === "en" ? "en-US" : "id-ID")}
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                    >
                      {t.walletCoinsLabel} (≈ Rp{((user.coinBalance || 0) * COIN_TO_RUPIAH_RATE).toLocaleString("id-ID")})
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-2xl border text-left transition"
                    style={{
                      backgroundColor: isDark ? "#141e1a" : "#ffffff",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                      boxShadow: isDark
                        ? "none"
                        : "0 6px 20px -4px rgba(22, 32, 27, 0.05)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: isDark ? "#1f2d26" : "#e7efe9",
                        color: isDark ? "#81c784" : "#246b3e",
                      }}
                    >
                      <ScaleEmblem size={22} />
                    </div>
                    <div
                      className="text-2xl md:text-3xl font-bold font-mono"
                      style={{ color: isDark ? "#81c784" : "#246b3e" }}
                    >
                      {((user.totalGrams || 0) / 1000).toFixed(2)} Kg
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                    >
                      {t.walletGramsLabel} ({user.totalGrams || 0} g)
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-2xl border text-left transition"
                    style={{
                      backgroundColor: isDark ? "#141e1a" : "#ffffff",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                      boxShadow: isDark
                        ? "none"
                        : "0 6px 20px -4px rgba(22, 32, 27, 0.05)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: isDark ? "#1f2d26" : "#e7efe9",
                        color: isDark ? "#81c784" : "#246b3e",
                      }}
                    >
                      <WalletPayoutEmblem size={22} />
                    </div>
                    <div
                      className="text-2xl md:text-3xl font-bold font-mono"
                      style={{ color: isDark ? "#81c784" : "#246b3e" }}
                    >
                      Rp{(user.totalRupiahWithdrawn || 0).toLocaleString("id-ID")}
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                    >
                      {t.walletWithdrawnLabel}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 KATEGORI SAMPAH */}
      <section
        id="rates"
        className="py-16 px-6 border-t"
        style={{
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
          backgroundColor: isDark ? "#101915" : "#e9eee9",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="font-mono text-xs font-semibold uppercase tracking-wider block"
              style={{ color: isDark ? "#fcd34d" : "#b45309" }}
            >
              {t.ratesBadge}
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mt-1"
              style={{ color: isDark ? "#ffffff" : "#16201b" }}
            >
              {t.ratesTitle}
            </h2>
            <p
              className="text-xs mt-2 max-w-lg mx-auto"
              style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
            >
              {t.ratesDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TRASH_TYPES.map((trash) => (
              <div
                key={trash.id}
                className="p-6 rounded-2xl border flex flex-col justify-between transition"
                style={{
                  backgroundColor: isDark ? "#141e1a" : "#ffffff",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                  boxShadow: isDark
                    ? "none"
                    : "0 4px 16px -2px rgba(22, 32, 27, 0.05)",
                }}
              >
                <div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: isDark ? "#1c3227" : "#eef4f0",
                    }}
                  >
                    {renderTrashEmblem(trash.id, 30)}
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: isDark ? "#ffffff" : "#16201b" }}
                  >
                    {getTrashTitle(trash.id)}
                  </h3>
                  <p
                    className="text-xs mt-2 mb-4 leading-relaxed"
                    style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                  >
                    {getTrashDesc(trash.id)}
                  </p>
                </div>

                <div
                  className="pt-3 border-t flex justify-between items-baseline"
                  style={{
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#edf2ee",
                  }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                  >
                    {t.ratesPer10g}
                  </span>
                  <span
                    className="text-lg font-bold font-mono inline-flex items-center gap-1"
                    style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                  >
                    <CoinEmblem size={16} />
                    {trash.ratePer10GramCoins} Koin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KALKULATOR ESTIMASI */}
      <section id="calculator" className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto border rounded-2xl p-8 transition"
          style={{
            backgroundColor: isDark ? "#141e1a" : "#ffffff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
            boxShadow: isDark
              ? "none"
              : "0 8px 30px -4px rgba(22, 32, 27, 0.06)",
          }}
        >
          <div className="text-center mb-8">
            <span
              className="font-mono text-xs font-semibold uppercase tracking-wider block"
              style={{ color: isDark ? "#a5d6a7" : "#246b3e" }}
            >
              {t.calcBadge}
            </span>
            <h2
              className="text-2xl md:text-3xl font-extrabold mt-1"
              style={{ color: isDark ? "#ffffff" : "#16201b" }}
            >
              {t.calcTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label
                  className="text-xs font-medium block mb-2"
                  style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                >
                  {t.calcSelectTrash}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TRASH_TYPES.map((type) => {
                    const isSelected = calcType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setCalcType(type.id)}
                        className="p-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer flex flex-col items-center justify-center gap-1.5"
                        style={{
                          backgroundColor: isSelected
                            ? isDark
                              ? "rgba(46, 125, 50, 0.25)"
                              : "#e2ede4"
                            : isDark
                            ? "#17231e"
                            : "#f6faf7",
                          borderColor: isSelected
                            ? isDark
                              ? "#81c784"
                              : "#2e7d32"
                            : isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "#dce3de",
                          color: isSelected
                            ? isDark
                              ? "#a5d6a7"
                              : "#1b5e20"
                            : isDark
                            ? "#d1d5db"
                            : "#5d6d66",
                        }}
                      >
                        <div>{renderTrashEmblem(type.id, 22)}</div>
                        <div className="text-[11px] truncate">{getTrashTitle(type.id).split(" ")[0]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div
                  className="flex justify-between text-xs font-medium mb-2"
                  style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                >
                  <span>{t.calcEstWeight}</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: isDark ? "#a5d6a7" : "#246b3e" }}
                  >
                    {calcWeight} Gram
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#2e7d32]"
                />
              </div>
            </div>

            <div
              className="p-6 rounded-2xl border text-center space-y-2"
              style={{
                backgroundColor: isDark ? "#101915" : "#f6faf7",
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
              }}
            >
              <span
                className="text-xs uppercase tracking-wider font-semibold block"
                style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
              >
                {t.calcPotentialCoins}
              </span>
              <div
                className="text-4xl font-bold font-mono inline-flex items-center justify-center gap-2"
                style={{ color: isDark ? "#fcd34d" : "#b45309" }}
              >
                <CoinEmblem size={30} />
                {calculatedEstimateCoins.toLocaleString(language === "en" ? "en-US" : "id-ID")} Koin
              </div>
              <div
                className="text-sm font-semibold font-mono"
                style={{ color: isDark ? "#81c784" : "#246b3e" }}
              >
                ≈ Rp{estimatedRupiahValue.toLocaleString("id-ID")}
              </div>
              <p
                className="text-[11px] pt-1"
                style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
              >
                {t.calcNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* RIWAYAT TRANSAKSI TERBARU (LIVE AUDIT TRAIL)                   */}
      {/* ============================================================== */}
      <section
        id="history"
        className="py-16 px-6 border-t"
        style={{
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
          backgroundColor: isDark ? "#101915" : "#e9eee9",
        }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span
              className="font-mono text-xs font-semibold uppercase tracking-wider block"
              style={{ color: isDark ? "#fcd34d" : "#b45309" }}
            >
              {language === "en" ? "Live Activity Feed" : "Histori Real-Time"}
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ color: isDark ? "#ffffff" : "#16201b" }}
            >
              {language === "en" ? "Recent Transactions" : "Riwayat Transaksi Terkini"}
            </h2>
            <p className="text-xs max-w-lg mx-auto" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
              {language === "en"
                ? "Live audit trail of waste deposits and e-wallet cash payouts across all kiosks."
                : "Aktivitas setoran sampah dan penukaran saldo e-wallet yang tercatat langsung pada sistem."}
            </p>

            {/* TAB SELECTOR */}
            <div className="pt-3 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("deposit")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "deposit" ? "shadow-sm" : "opacity-75 hover:opacity-100"
                }`}
                style={{
                  backgroundColor:
                    activeTab === "deposit"
                      ? isDark
                        ? "#1c3227"
                        : "#e2ede4"
                      : isDark
                      ? "#141e1a"
                      : "#ffffff",
                  borderColor:
                    activeTab === "deposit"
                      ? isDark
                        ? "#81c784"
                        : "#2e7d32"
                      : isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#dfe5e0",
                  color:
                    activeTab === "deposit"
                      ? isDark
                        ? "#a5d6a7"
                        : "#1b5e20"
                      : isDark
                      ? "#d1d5db"
                      : "#5d6d66",
                  borderWidth: 1,
                }}
              >
                <ScaleEmblem size={15} />
                <span>{language === "en" ? "Waste Deposits" : "Setoran Sampah"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("withdraw")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "withdraw" ? "shadow-sm" : "opacity-75 hover:opacity-100"
                }`}
                style={{
                  backgroundColor:
                    activeTab === "withdraw"
                      ? isDark
                        ? "#282015"
                        : "#fcf4e6"
                      : isDark
                      ? "#141e1a"
                      : "#ffffff",
                  borderColor:
                    activeTab === "withdraw"
                      ? isDark
                        ? "#fcd34d"
                        : "#b45309"
                      : isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#dfe5e0",
                  color:
                    activeTab === "withdraw"
                      ? isDark
                        ? "#fcd34d"
                        : "#b45309"
                      : isDark
                      ? "#d1d5db"
                      : "#5d6d66",
                  borderWidth: 1,
                }}
              >
                <WalletPayoutEmblem size={15} />
                <span>{language === "en" ? "Cash Payouts" : "Pencairan Saldo"}</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT: SETORAN SAMPAH */}
          {activeTab === "deposit" && (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div
                  className="p-10 rounded-2xl border text-center space-y-2"
                  style={{
                    backgroundColor: isDark ? "#141e1a" : "#ffffff",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                  }}
                >
                  <p className="text-xs" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                    {language === "en" ? "No waste deposit records yet." : "Belum ada riwayat setoran sampah."}
                  </p>
                  <Link
                    href="/kiosk"
                    className="text-xs font-semibold inline-block hover:underline"
                    style={{ color: isDark ? "#81c784" : "#2e7d32" }}
                  >
                    {language === "en" ? "Make your first deposit →" : "Setor sampah pertama sekarang →"}
                  </Link>
                </div>
              ) : (
                transactions.slice(0, 6).map((tx, idx) => {
                  const typeLower = String(tx.trashType || "").toLowerCase();
                  const isCan = typeLower.includes("kaleng") || typeLower.includes("can");
                  const isPaper = typeLower.includes("kertas") || typeLower.includes("paper");

                  return (
                    <div
                      key={tx.id || idx}
                      className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition shadow-sm"
                      style={{
                        backgroundColor: isDark ? "#141e1a" : "#ffffff",
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: isDark ? "#1f2d26" : "#e8f5e9",
                            color: isDark ? "#81c784" : "#2e7d32",
                          }}
                        >
                          {isCan ? (
                            <CanEmblem size={22} />
                          ) : isPaper ? (
                            <PaperEmblem size={22} />
                          ) : (
                            <SnackEmblem size={22} />
                          )}
                        </div>
                        <div>
                          <div
                            className="text-sm font-bold truncate max-w-[220px] sm:max-w-xs"
                            style={{ color: isDark ? "#ffffff" : "#16201b" }}
                          >
                            {tx.trashType}
                          </div>
                          <div
                            className="text-xs font-mono"
                            style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                          >
                            {tx.userName} • {tx.createdAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#edf2ee" }}>
                        <div className="text-left sm:text-right">
                          <span
                            className="text-[10px] uppercase font-mono block"
                            style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                          >
                            {language === "en" ? "Weight" : "Berat"}
                          </span>
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: isDark ? "#81c784" : "#246b3e" }}
                          >
                            {tx.weightGram} g
                          </span>
                        </div>

                        <div className="text-right">
                          <span
                            className="text-[10px] uppercase font-mono block"
                            style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                          >
                            {language === "en" ? "Coins Earned" : "Koin Masuk"}
                          </span>
                          <span
                            className="text-sm font-mono font-bold inline-flex items-center gap-1"
                            style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                          >
                            <CoinEmblem size={14} />
                            +{tx.earnedCoins}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB CONTENT: PENCAIRAN SALDO */}
          {activeTab === "withdraw" && (
            <div className="space-y-3">
              {redeems.length === 0 ? (
                <div
                  className="p-10 rounded-2xl border text-center space-y-2"
                  style={{
                    backgroundColor: isDark ? "#141e1a" : "#ffffff",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                  }}
                >
                  <p className="text-xs" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                    {language === "en" ? "No cash payout records yet." : "Belum ada riwayat penarikan saldo."}
                  </p>
                  <Link
                    href="/kiosk#tukar-koin-section"
                    className="text-xs font-semibold inline-block hover:underline"
                    style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                  >
                    {language === "en" ? "Redeem coins now →" : "Tukar koin ke saldo sekarang →"}
                  </Link>
                </div>
              ) : (
                redeems.slice(0, 6).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition shadow-sm"
                    style={{
                      backgroundColor: isDark ? "#141e1a" : "#ffffff",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isDark ? "#282015" : "#fcf4e6",
                          color: isDark ? "#fcd34d" : "#b45309",
                        }}
                      >
                        <WalletPayoutEmblem size={22} />
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold flex items-center gap-2"
                          style={{ color: isDark ? "#ffffff" : "#16201b" }}
                        >
                          <span>{item.ewalletType}</span>
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold"
                            style={{
                              backgroundColor: isDark ? "rgba(46, 125, 50, 0.2)" : "#e5eee7",
                              color: isDark ? "#a5d6a7" : "#246b3e",
                            }}
                          >
                            ✓ Berhasil
                          </span>
                        </div>
                        <div
                          className="text-xs font-mono"
                          style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                        >
                          {item.userName} ({item.phone}) • {item.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#edf2ee" }}>
                      <div className="text-left sm:text-right">
                        <span
                          className="text-[10px] uppercase font-mono block"
                          style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                        >
                          {language === "en" ? "Coins Spent" : "Koin Ditukar"}
                        </span>
                        <span
                          className="text-xs font-mono font-bold"
                          style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                        >
                          -🪙 {item.coinsExchanged}
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className="text-[10px] uppercase font-mono block"
                          style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}
                        >
                          {language === "en" ? "Cash Received" : "Rupiah Diterima"}
                        </span>
                        <span
                          className="text-sm font-mono font-bold"
                          style={{ color: isDark ? "#81c784" : "#246b3e" }}
                        >
                          Rp{item.rupiahReceived.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t py-8 text-center text-xs font-mono"
        style={{
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
          color: isDark ? "#6b7280" : "#71827a",
        }}
      >
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}