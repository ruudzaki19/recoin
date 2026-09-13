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
} from "@/lib/storage";
import { useTheme } from "@/lib/theme";

interface TransactionReceipt extends VendingTransaction {
  formattedTime: string;
}

export default function KioskPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [user, setUser] = useState<UserAccount | null>(null);
  const [selectedType, setSelectedType] = useState<string>("can");
  const [weightInput, setWeightInput] = useState<string>("200");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionReceipt | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    setUser(active);
  }, []);

  const activeCategory = TRASH_TYPES.find((t) => t.id === selectedType) || TRASH_TYPES[0];
  const numericWeight = parseInt(weightInput, 10) || 0;
  const totalPayout = Math.round((numericWeight / 10) * activeCategory.ratePer10Gram);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = e.target.value.replace(/\D/g, "");
    setWeightInput(cleanVal);
  };

  const handleSetor = () => {
    if (numericWeight <= 0) {
      alert("Silakan masukkan berat sampah yang valid!");
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime =
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB";

    const newTx: VendingTransaction = {
      id: "REC-" + Date.now().toString(36).toUpperCase(),
      userId: user?.id || "guest",
      userName: user?.fullName || "Tamu",
      userEmail: user?.email || "guest@recoin.id",
      trashType: activeCategory.name,
      weightGram: numericWeight,
      payoutRupiah: totalPayout,
      ewalletType: user?.ewalletType || "GoPay",
      phone: user?.phone || "-",
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
    }, 700);
  };

  return (
    <div
      className="min-h-screen py-12 px-6 relative transition-colors duration-300 selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: isDark ? "#070d0a" : "#f4f7f5",
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        
        {/* Header Kios */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border"
            style={{
              backgroundColor: isDark ? "rgba(6,78,59,0.8)" : "#d1fae5",
              borderColor: isDark ? "rgba(16,185,129,0.4)" : "#a7f3d0",
              color: isDark ? "#34d399" : "#065f46",
            }}
          >
            <span>⚡</span> Smart Reverse Vending Machine
          </div>
          <h1 className="text-3xl md:text-4xl font-black">Setor Limbah Mandiri</h1>
          <p
            className="text-xs"
            style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
          >
            {user
              ? `Penyetoran atas nama: ${user.fullName} (${user.ewalletType} - ${user.phone})`
              : "Anda belum login. Saldo dicatat sebagai Tamu, atau login dahulu agar tersimpan di akun."}
          </p>
        </div>

        {/* Panel Input Mesin */}
        <div
          className="p-8 rounded-3xl border shadow-2xl space-y-6 transition"
          style={{
            backgroundColor: isDark ? "#0e1d16" : "#ffffff",
            borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0",
          }}
        >
          
          {/* 1. Kategori Sampah */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider block mb-3"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              1. Pilih Kategori Sampah
            </label>
            <div className="grid grid-cols-2 gap-4">
              {TRASH_TYPES.map((trash) => {
                const isSelected = selectedType === trash.id;
                return (
                  <button
                    key={trash.id}
                    type="button"
                    onClick={() => setSelectedType(trash.id)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected ? "scale-[1.02] shadow-lg" : ""
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? "rgba(16,185,129,0.15)"
                          : "#ecfdf5"
                        : isDark
                        ? "#09140f"
                        : "#f9fafb",
                      borderColor: isSelected
                        ? "#10b981"
                        : isDark
                        ? "#1f2923"
                        : "#e5e7eb",
                    }}
                  >
                    <div className="text-3xl mb-2">{trash.icon}</div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      {trash.name}
                    </div>
                    <div className="text-xs text-emerald-500 font-mono mt-1 font-semibold">
                      Rp{trash.ratePer10Gram} / 10 gram
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sensor Gramasi */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                2. Berat Sensor Timbangan (Gram)
              </label>
              <span className="text-xs font-mono text-emerald-500 font-bold">
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
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-2xl border text-2xl font-mono focus:outline-none focus:border-emerald-400 tracking-wider [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{
                  backgroundColor: isDark ? "#09140f" : "#f9fafb",
                  borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              />
              <span
                className="absolute right-5 text-sm font-semibold font-mono pointer-events-none select-none"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                Gram
              </span>
            </div>
          </div>

          {/* 3. Total Saldo */}
          <div
            className="p-6 rounded-2xl border flex items-center justify-between"
            style={{
              backgroundColor: isDark ? "#0a1711" : "#fefce8",
              borderColor: isDark ? "rgba(245,158,11,0.4)" : "#fef08a",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: isDark ? "#d4d4d4" : "#4b5563" }}
            >
              Total Saldo Diterima:
            </span>
            <span className="text-3xl font-black text-amber-500 font-mono">
              Rp{totalPayout.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Tombol Eksekusi */}
          <button
            type="button"
            onClick={handleSetor}
            disabled={isSubmitting || numericWeight <= 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-neutral-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Menimbang & Memproses Saldo...</span>
              </>
            ) : (
              <span>SETOR & TRANSFER SALDO SEKARANG</span>
            )}
          </button>
        </div>

        {/* Back to Home */}
        <div className="text-center pt-2 relative z-30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono transition shadow-sm"
            style={{
              backgroundColor: isDark ? "rgba(23,23,23,0.6)" : "#ffffff",
              borderColor: isDark ? "rgba(6,78,59,0.8)" : "#e2e8f0",
              color: isDark ? "#d4d4d4" : "#4b5563",
            }}
          >
            <span>←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

      </div>

      {/* POPUP SUKSES */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="w-full max-w-md rounded-3xl border p-6 md:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300"
            style={{
              backgroundColor: isDark ? "#0b1612" : "#ffffff",
              borderColor: isDark ? "rgba(16,185,129,0.3)" : "#cbd5e1",
              color: isDark ? "#ffffff" : "#111827",
            }}
          >
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <svg
                  className="w-9 h-9 text-neutral-950 stroke-[3.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-500 uppercase">
                  Penyetoran Sukses
                </span>
                <h2 className="text-3xl font-black text-amber-500 font-mono mt-1">
                  +Rp{receiptData.payoutRupiah.toLocaleString("id-ID")}
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  Dana diteruskan ke e-wallet {receiptData.ewalletType}
                </p>
              </div>
            </div>

            <div className="relative my-6">
              <div
                className="border-t-2 border-dashed"
                style={{ borderColor: isDark ? "rgba(6,78,59,0.8)" : "#e2e8f0" }}
              ></div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>ID Transaksi</span>
                <span className="font-mono font-bold">{receiptData.id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>Waktu Penyetoran</span>
                <span>{receiptData.createdAt} • {receiptData.formattedTime}</span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>Penyetor</span>
                <span className="font-bold">{receiptData.userName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>Nomor Akun / HP</span>
                <span className="font-mono">{receiptData.phone}</span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>Kategori Sampah</span>
                <span className="font-semibold">{receiptData.trashType}</span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>Total Berat Ditimbang</span>
                <span className="font-mono font-bold text-emerald-500">
                  {receiptData.weightGram} Gram ({(receiptData.weightGram / 1000).toFixed(2)} Kg)
                </span>
              </div>

              <div
                className="flex justify-between items-center pt-2 border-t"
                style={{ borderColor: isDark ? "#064e3b" : "#e2e8f0" }}
              >
                <span style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}>Status Pembayaran</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 font-bold font-mono text-[10px] uppercase">
                  ✓ Berhasil Masuk
                </span>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReceipt(false);
                  setWeightInput("100");
                }}
                className="flex-1 py-3 rounded-xl border text-xs font-bold transition cursor-pointer"
                style={{
                  borderColor: isDark ? "#065f46" : "#cbd5e1",
                  backgroundColor: isDark ? "rgba(6,78,59,0.3)" : "#f1f5f9",
                  color: isDark ? "#e2e8f0" : "#334155",
                }}
              >
                Setor Lagi
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReceipt(false);
                  router.push("/");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Selesai & Beranda
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}