"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TRASH_TYPES,
  saveVendingTransaction,
  getActiveUser,
  UserAccount,
  VendingTransaction,
  COIN_TO_RUPIAH_RATE,
  redeemCoinsToEwallet,
  RedeemTransaction,
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

interface TransactionReceipt extends VendingTransaction {
  formattedTime: string;
}

export default function KioskPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isDark = theme === "dark";

  const [user, setUser] = useState<UserAccount | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // STATE TIMBANG SAMPAH
  const [selectedType, setSelectedType] = useState<string>("can");
  const [weightInput, setWeightInput] = useState<string>("200");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionReceipt | null>(null);

  // STATE TUKAR KOIN
  const [coinInput, setCoinInput] = useState<string>("500");
  const [withdrawEwallet, setWithdrawEwallet] = useState<string>("GoPay");
  const [withdrawPhone, setWithdrawPhone] = useState<string>("");
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [showWithdrawReceipt, setShowWithdrawReceipt] = useState(false);
  const [withdrawReceiptData, setWithdrawReceiptData] = useState<RedeemTransaction | null>(null);
  const [withdrawError, setWithdrawError] = useState<string>("");

  useEffect(() => {
    const sync = () => {
      const active = getActiveUser();
      setUser(active);
      if (active) {
        setWithdrawEwallet(active.ewalletType || "GoPay");
        setWithdrawPhone(active.phone || "");
      }
      setIsCheckingAuth(false);
    };
    sync();

    window.addEventListener("recoin_user_updated", sync);
    return () => window.removeEventListener("recoin_user_updated", sync);
  }, []);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/\D/g, "");
    if (clean.length > 1 && clean.startsWith("0")) {
      clean = clean.replace(/^0+/, "");
    }
    setWeightInput(clean);
  };

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/\D/g, "");
    if (clean.length > 1 && clean.startsWith("0")) {
      clean = clean.replace(/^0+/, "");
    }
    setCoinInput(clean);
  };

  const activeCategory = TRASH_TYPES.find((t) => t.id === selectedType) || TRASH_TYPES[0];
  const numericWeight = parseInt(weightInput, 10) || 0;
  const totalCoinsEarned = Math.round((numericWeight / 10) * activeCategory.ratePer10GramCoins);

  const numericCoinWithdraw = parseInt(coinInput, 10) || 0;
  const rupiahEstimated = numericCoinWithdraw * COIN_TO_RUPIAH_RATE;

  const getTrashTitle = (id: string) => {
    if (id === "can") return t.canName;
    if (id === "snack") return t.snackName;
    return t.paperName;
  };

  const renderTrashIcon = (id: string, isSelected: boolean) => {
    const colorClass = isSelected
      ? isDark
        ? "text-emerald-400"
        : "text-emerald-700"
      : isDark
      ? "text-neutral-400"
      : "text-neutral-600";

    if (id === "can") return <CanEmblem size={24} className={colorClass} />;
    if (id === "snack") return <SnackEmblem size={24} className={colorClass} />;
    return <PaperEmblem size={24} className={colorClass} />;
  };

  // EKSEKUSI SETOR SAMPAH
  const handleSetor = () => {
    if (!user) {
      alert(language === "en" ? "Please sign in to deposit waste and collect coins!" : "Wajib masuk ke akun untuk menyetor sampah dan mengklaim koin!");
      router.push("/login");
      return;
    }

    if (numericWeight <= 0) {
      alert(language === "en" ? "Please enter a valid weight!" : "Silakan masukkan berat sampah yang valid!");
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime =
      now.toLocaleTimeString(language === "en" ? "en-US" : "id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + (language === "en" ? " UTC+7" : " WIB");

    const newTx: VendingTransaction = {
      id: "REC-" + Date.now().toString(36).toUpperCase(),
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      trashType: getTrashTitle(activeCategory.id),
      weightGram: numericWeight,
      earnedCoins: totalCoinsEarned,
      createdAt: formattedDate,
    };

    saveVendingTransaction(newTx);

    setTimeout(() => {
      setReceiptData({
        ...newTx,
        formattedTime,
      });
      setIsSubmitting(false);
      setShowReceipt(true);
    }, 600);
  };

  // EKSEKUSI PENUKARAN KOIN KE E-WALLET
  const handleTukarUang = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");

    if (!user) {
      setWithdrawError(t.withdrawErrLogin);
      router.push("/login");
      return;
    }

    if (numericCoinWithdraw <= 0) {
      setWithdrawError(t.withdrawErrAmount);
      return;
    }

    if (numericCoinWithdraw > (user.coinBalance || 0)) {
      setWithdrawError(`${t.withdrawErrInsufficient} (${user.coinBalance || 0} RECOIN).`);
      return;
    }

    if (!withdrawPhone) {
      setWithdrawError(t.withdrawErrPhone);
      return;
    }

    setIsProcessingWithdraw(true);

    setTimeout(() => {
      const res = redeemCoinsToEwallet(numericCoinWithdraw, withdrawEwallet, withdrawPhone);
      setIsProcessingWithdraw(false);

      if (res.success && res.data) {
        setWithdrawReceiptData(res.data);
        setShowWithdrawReceipt(true);
      } else {
        setWithdrawError(res.message);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen py-8 sm:py-12 px-3.5 sm:px-6 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#0d1512" : "#f1f4f1",
        color: isDark ? "#f3f4f6" : "#1c2520",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-10">
        
        {/* Header Kios */}
        <div className="text-center space-y-2 px-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t.kioskTitle}</h1>
          <p className="text-xs max-w-xl mx-auto leading-relaxed" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
            {user ? (
              <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                <span>{t.kioskSubtitleConnected} <strong>{user.fullName}</strong> •</span>
                <span
                  style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                  className="font-mono font-bold inline-flex items-center gap-1"
                >
                  <CoinEmblem size={15} />
                  {(user.coinBalance || 0).toLocaleString(language === "en" ? "en-US" : "id-ID")} RECOIN
                </span>
              </span>
            ) : (
              language === "en"
                ? "You must sign in to an account to weigh recyclables and cash out coins."
                : "Anda wajib masuk ke akun terlebih dahulu untuk menyetor sampah atau mencairkan saldo."
            )}
          </p>
        </div>

        {/* NOTIFIKASI WAJIB LOGIN JIKA BELUM MASUK */}
        {!isCheckingAuth && !user && (
          <div
            className="p-6 rounded-2xl border text-center space-y-4 shadow-sm animate-in fade-in duration-300"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(217, 119, 6, 0.4)" : "#f3dfb5",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm"
              style={{
                backgroundColor: isDark ? "#282015" : "#fcf4e6",
                color: isDark ? "#fcd34d" : "#b45309",
              }}
            >
              🔒
            </div>

            <div>
              <h2 className="text-base font-bold">
                {language === "en" ? "Authentication Required" : "Akses Memerlukan Akun"}
              </h2>
              <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                {language === "en"
                  ? "To ensure your coins are securely stored and cash payouts are sent to your verified e-wallet, please log in or register before using the kiosk."
                  : "Untuk memastikan perolehan koin tersimpan di dompet Anda dan pencairan saldo dapat terkirim dengan aman ke e-wallet, silakan masuk ke akun terlebih dahulu."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: "#2e7d32" }}
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition"
                style={{
                  borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#d1dcd4",
                  color: isDark ? "#f3f4f6" : "#16201b",
                }}
              >
                {t.navRegister}
              </Link>
            </div>
          </div>
        )}

        {/* SECTION 1: TIMBANG SAMPAH */}
        <div
          id="timbang-section"
          className={`p-5 sm:p-8 rounded-2xl border shadow-sm space-y-5 transition ${
            !user ? "opacity-60 pointer-events-none select-none" : ""
          }`}
          style={{
            backgroundColor: isDark ? "#141e1a" : "#ffffff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
          }}
        >
          <div className="border-b pb-3.5 flex items-center justify-between" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0" }}>
            <h2 className="text-lg sm:text-xl font-bold">{t.stepDepositTitle}</h2>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isDark ? "#1f2d26" : "#e8f5e9",
                color: isDark ? "#a5d6a7" : "#2e7d32",
              }}
            >
              <ScaleEmblem size={20} />
            </div>
          </div>

          {/* 3 Jenis Sampah */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2.5" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
              {t.stepDepositLabelCategory}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {TRASH_TYPES.map((trash) => {
                const isSelected = selectedType === trash.id;
                return (
                  <button
                    key={trash.id}
                    type="button"
                    onClick={() => setSelectedType(trash.id)}
                    className="p-2.5 sm:p-4 rounded-xl border text-center sm:text-left transition cursor-pointer flex flex-col items-center sm:items-start justify-between min-h-[90px] sm:min-h-[110px]"
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
                    }}
                  >
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center mb-1.5"
                      style={{
                        backgroundColor: isSelected
                          ? isDark
                            ? "#1c3227"
                            : "#d1fae5"
                          : isDark
                          ? "#111815"
                          : "#edf2ee",
                      }}
                    >
                      {renderTrashIcon(trash.id, isSelected)}
                    </div>
                    <div className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-1 w-full" style={{ color: isDark ? "#f3f4f6" : "#16201b" }}>
                      {getTrashTitle(trash.id).split(" ")[0]}
                    </div>
                    <div
                      className="text-[10px] sm:text-[11px] font-mono mt-0.5 font-bold"
                      style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                    >
                      🪙 {trash.ratePer10GramCoins}k/10g
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Berat Gramasi */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                {t.stepDepositSensorLabel}
              </label>
              <span className="text-xs font-mono font-bold" style={{ color: isDark ? "#81c784" : "#246b3e" }}>
                {(numericWeight / 1000).toFixed(2)} Kg
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={weightInput}
                onChange={handleWeightChange}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border text-xl sm:text-2xl font-mono outline-none tracking-wider [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-[#2e7d32]"
                style={{
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  color: isDark ? "#f3f4f6" : "#16201b",
                  fontSize: "18px",
                }}
              />
              <span className="absolute right-4 text-xs font-semibold font-mono pointer-events-none select-none" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                Gram
              </span>
            </div>
          </div>

          {/* Total Koin Dihasilkan */}
          <div
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{
              backgroundColor: isDark ? "#101915" : "#fefce8",
              borderColor: isDark ? "rgba(217, 119, 6, 0.25)" : "#fef08a",
            }}
          >
            <div>
              <span className="text-xs font-medium block" style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                {t.stepDepositPayoutLabel}
              </span>
              <span className="text-[11px] font-mono" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                ≈ Rp{(totalCoinsEarned * COIN_TO_RUPIAH_RATE).toLocaleString("id-ID")}
              </span>
            </div>
            <span
              className="text-2xl sm:text-3xl font-bold font-mono inline-flex items-center gap-1"
              style={{ color: isDark ? "#fcd34d" : "#b45309" }}
            >
              <CoinEmblem size={24} />
              {totalCoinsEarned.toLocaleString(language === "en" ? "en-US" : "id-ID")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSetor}
            disabled={!user || isSubmitting || numericWeight <= 0}
            className="w-full min-h-[48px] py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
            style={{ backgroundColor: "#2e7d32" }}
          >
            <CoinEmblem size={18} />
            <span>
              {!user
                ? (language === "en" ? "SIGN IN REQUIRED TO DEPOSIT" : "MASUK KE AKUN UNTUK MENYETOR")
                : (isSubmitting ? t.stepDepositProcessing : t.stepDepositBtn)}
            </span>
          </button>
        </div>

        {/* SECTION 2: TUKAR KOIN KE SALDO E-WALLET */}
        <div
          id="tukar-koin-section"
          className={`p-5 sm:p-8 rounded-2xl border shadow-sm space-y-5 transition scroll-mt-20 ${
            !user ? "opacity-60 pointer-events-none select-none" : ""
          }`}
          style={{
            backgroundColor: isDark ? "#141e1a" : "#ffffff",
            borderColor: isDark ? "rgba(217, 119, 6, 0.35)" : "#fed7aa",
          }}
        >
          <div className="border-b pb-3.5 flex items-center justify-between" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0" }}>
            <h2 className="text-lg sm:text-xl font-bold">{t.stepWithdrawTitle}</h2>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isDark ? "#282015" : "#fcf4e6",
                color: isDark ? "#fcd34d" : "#b45309",
              }}
            >
              <WalletPayoutEmblem size={20} />
            </div>
          </div>

          {withdrawError && (
            <div
              className="p-3 rounded-xl border text-xs text-center font-semibold"
              style={{
                backgroundColor: isDark ? "rgba(185, 28, 28, 0.2)" : "#fef2f2",
                borderColor: isDark ? "rgba(239, 68, 68, 0.3)" : "#fecaca",
                color: isDark ? "#f87171" : "#b91c1c",
              }}
            >
              ⚠️ {withdrawError}
            </div>
          )}

          <form onSubmit={handleTukarUang} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {t.stepWithdrawCoinsLabel}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    disabled={!user}
                    value={coinInput}
                    onChange={handleCoinChange}
                    className="w-full px-4 py-3 rounded-xl border font-mono outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-amber-500"
                    style={{
                      backgroundColor: isDark ? "#101915" : "#f6faf7",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                      color: isDark ? "#f3f4f6" : "#16201b",
                      fontSize: "16px",
                    }}
                  />
                  <span
                    className="absolute right-4 text-xs font-mono font-bold pointer-events-none inline-flex items-center gap-1"
                    style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                  >
                    <CoinEmblem size={14} />
                    Koin
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {t.stepWithdrawEstRupiah}
                </label>
                <div
                  className="px-4 py-3 rounded-xl border font-mono font-bold flex items-center justify-between"
                  style={{
                    backgroundColor: isDark ? "#101915" : "#f6faf7",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                    color: isDark ? "#81c784" : "#246b3e",
                    fontSize: "16px",
                  }}
                >
                  <span>Rp{rupiahEstimated.toLocaleString("id-ID")}</span>
                  <span className="text-[10px] font-normal" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                    {t.stepWithdrawRateNote}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {t.stepWithdrawEwalletLabel}
                </label>
                <select
                  disabled={!user}
                  value={withdrawEwallet}
                  onChange={(e) => setWithdrawEwallet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none cursor-pointer focus:border-amber-500"
                  style={{
                    backgroundColor: isDark ? "#101915" : "#f6faf7",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                    color: isDark ? "#f3f4f6" : "#16201b",
                    fontSize: "16px",
                  }}
                >
                  <option value="GoPay">GoPay</option>
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {t.stepWithdrawPhoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  disabled={!user}
                  placeholder="08xxxxxxxxxx"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm font-mono outline-none focus:border-amber-500"
                  style={{
                    backgroundColor: isDark ? "#101915" : "#f6faf7",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                    color: isDark ? "#f3f4f6" : "#16201b",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!user || isProcessingWithdraw || numericCoinWithdraw <= 0}
              className="w-full min-h-[48px] mt-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
              style={{
                backgroundColor: isDark ? "#d97706" : "#f59e0b",
                color: isDark ? "#ffffff" : "#16201b",
              }}
            >
              <WalletPayoutEmblem size={18} />
              <span>
                {!user
                  ? (language === "en" ? "SIGN IN REQUIRED TO WITHDRAW" : "MASUK KE AKUN UNTUK MENCAIRKAN")
                  : (isProcessingWithdraw ? t.stepWithdrawProcessing : t.stepWithdrawBtn)}
              </span>
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono transition shadow-sm"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#dfe5e0",
              color: isDark ? "#d1d5db" : "#4b5563",
            }}
          >
            <span>←</span>
            <span>{t.btnBackHome}</span>
          </Link>
        </div>

      </div>

      {/* POPUP 1: STRUK TIMBANG */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div
            className="w-full max-w-sm rounded-2xl border p-5 sm:p-7 shadow-xl relative my-auto"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
              color: isDark ? "#f3f4f6" : "#16201b",
            }}
          >
            <div className="flex flex-col items-center text-center space-y-2 pt-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: isDark ? "#282015" : "#fcf4e6",
                  color: isDark ? "#fcd34d" : "#b45309",
                }}
              >
                <CoinEmblem size={28} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-semibold tracking-wider uppercase" style={{ color: isDark ? "#81c784" : "#246b3e" }}>
                  {t.receiptDepositSuccess}
                </span>
                <h2
                  className="text-2xl font-bold font-mono mt-0.5 inline-flex items-center gap-1 justify-center"
                  style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                >
                  <CoinEmblem size={22} />
                  +{receiptData.earnedCoins} RECOIN
                </h2>
                <p className="text-[11px] mt-0.5" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {t.receiptDepositDesc}
                </p>
              </div>
            </div>

            <div className="relative my-4">
              <div className="border-t border-dashed" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#dfe5e0" }}></div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptId}</span>
                <span className="font-mono font-semibold text-[11px]">{receiptData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptTime}</span>
                <span className="text-[11px]">{receiptData.createdAt} • {receiptData.formattedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptDepositor}</span>
                <span className="font-semibold truncate max-w-[140px]">{receiptData.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptTrashType}</span>
                <span className="font-medium truncate max-w-[140px]">{receiptData.trashType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptWeight}</span>
                <span className="font-mono font-semibold" style={{ color: isDark ? "#81c784" : "#246b3e" }}>
                  {receiptData.weightGram} g
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0" }}>
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptEstRate}</span>
                <span className="font-mono font-bold" style={{ color: isDark ? "#fcd34d" : "#b45309" }}>
                  ≈ Rp{(receiptData.earnedCoins * COIN_TO_RUPIAH_RATE).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="pt-5 space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReceipt(false);
                    setWeightInput("100");
                  }}
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer"
                  style={{
                    borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#d1dcd4",
                    backgroundColor: isDark ? "#17231e" : "#f1f4f1",
                    color: isDark ? "#e5e7eb" : "#374151",
                  }}
                >
                  {t.btnWeighAgain}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReceipt(false);
                    const el = document.getElementById("tukar-koin-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                  style={{
                    backgroundColor: isDark ? "#d97706" : "#f59e0b",
                    color: isDark ? "#ffffff" : "#16201b",
                  }}
                >
                  {t.btnRedeemCoins}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowReceipt(false);
                  router.push("/");
                }}
                className="w-full min-h-[42px] py-2 rounded-xl border text-xs font-medium transition cursor-pointer text-center"
                style={{
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                  color: isDark ? "#9ca3af" : "#5d6d66",
                }}
              >
                {t.btnBackHome}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: STRUK PENARIKAN */}
      {showWithdrawReceipt && withdrawReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div
            className="w-full max-w-sm rounded-2xl border p-5 sm:p-7 shadow-xl relative my-auto"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
              color: isDark ? "#f3f4f6" : "#16201b",
            }}
          >
            <div className="flex flex-col items-center text-center space-y-2 pt-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: isDark ? "#1c3227" : "#e5eee7",
                  color: isDark ? "#81c784" : "#246b3e",
                }}
              >
                <WalletPayoutEmblem size={28} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-semibold tracking-wider uppercase" style={{ color: isDark ? "#81c784" : "#246b3e" }}>
                  {t.receiptWithdrawSuccess}
                </span>
                <h2
                  className="text-2xl font-bold font-mono mt-0.5"
                  style={{ color: isDark ? "#81c784" : "#246b3e" }}
                >
                  Rp{withdrawReceiptData.rupiahReceived.toLocaleString("id-ID")}
                </h2>
                <p className="text-[11px] mt-0.5" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {t.receiptWithdrawDesc} {withdrawReceiptData.ewalletType}
                </p>
              </div>
            </div>

            <div className="relative my-4">
              <div className="border-t border-dashed" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#dfe5e0" }}></div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptId}</span>
                <span className="font-mono font-semibold text-[11px]">{withdrawReceiptData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptTime}</span>
                <span className="text-[11px]">{withdrawReceiptData.createdAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptRecipient}</span>
                <span className="font-semibold truncate max-w-[140px]">{withdrawReceiptData.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptEwallet}</span>
                <span className="font-semibold" style={{ color: isDark ? "#fcd34d" : "#b45309" }}>{withdrawReceiptData.ewalletType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptPhone}</span>
                <span className="font-mono font-semibold">{withdrawReceiptData.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptCoinsExchanged}</span>
                <span className="font-mono font-semibold inline-flex items-center gap-1" style={{ color: isDark ? "#fcd34d" : "#b45309" }}>
                  - <CoinEmblem size={13} /> {withdrawReceiptData.coinsExchanged.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0" }}>
                <span style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>{t.receiptStatus}</span>
                <span
                  className="px-2 py-0.5 rounded-md font-semibold font-mono text-[10px] uppercase"
                  style={{
                    backgroundColor: isDark ? "rgba(46, 125, 50, 0.25)" : "#e5eee7",
                    color: isDark ? "#a5d6a7" : "#246b3e",
                  }}
                >
                  ✓ {t.receiptStatusWithdrawn}
                </span>
              </div>
            </div>

            <div className="pt-5 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowWithdrawReceipt(false);
                  setCoinInput("100");
                }}
                className="w-full min-h-[46px] py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition shadow-sm cursor-pointer active:scale-[0.99]"
                style={{ backgroundColor: "#2e7d32" }}
              >
                {t.btnDone}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWithdrawReceipt(false);
                  router.push("/");
                }}
                className="w-full min-h-[42px] py-2 rounded-xl border text-xs font-medium transition cursor-pointer text-center"
                style={{
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
                  color: isDark ? "#9ca3af" : "#5d6d66",
                }}
              >
                {t.btnBackHome}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}