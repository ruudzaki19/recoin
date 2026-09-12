"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TRASH_TYPES,
  saveVendingTransaction,
  TrashType,
  VendingTransaction,
  getActiveUser,
  UserAccount,
} from "@/lib/storage";
import AuthModal from "@/components/AuthModal";

export default function VendingMachinePage() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedTrash, setSelectedTrash] = useState<TrashType | null>(null);
  const [weightGram, setWeightGram] = useState<string>("");
  const [lastTx, setLastTx] = useState<VendingTransaction | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    setUser(getActiveUser());
  }, []);

  const calculatedRupiah =
    selectedTrash && weightGram && parseFloat(weightGram) > 0
      ? Math.round((parseFloat(weightGram) / 10) * selectedTrash.ratePer10Gram)
      : 0;

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthOpen(true);
      return;
    }

    if (!selectedTrash || calculatedRupiah <= 0) return;

    const tx = saveVendingTransaction(
      selectedTrash.name,
      parseFloat(weightGram),
      calculatedRupiah
    );

    if (tx) {
      setLastTx(tx);
      setIsSuccess(true);
      setUser(getActiveUser());
    }
  };

  const handleReset = () => {
    setSelectedTrash(null);
    setWeightGram("");
    setIsSuccess(false);
    setLastTx(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Header Info Terminal */}
      <div className="text-center mb-6">
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
          RECOIN Vending Terminal
        </span>
        <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">Kios Penyetoran Otomatis</h1>

        {user ? (
          <div className="mt-2 inline-flex items-center gap-2 bg-[#0e1d16] border border-emerald-700/50 px-4 py-1.5 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Akun: <strong className="text-emerald-300">{user.fullName}</strong> ({user.email})</span>
            <span className="text-neutral-400">• {user.ewalletType} ({user.phone})</span>
          </div>
        ) : (
          <p className="text-xs text-amber-400 mt-2">
            ⚠️ Belum login. Silakan login agar saldo langsung masuk ke e-wallet kamu.
          </p>
        )}
      </div>

      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {!isSuccess ? (
          <form onSubmit={handleProcess} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                1. Pilih Kategori Sampah
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TRASH_TYPES.map((item) => {
                  const active = selectedTrash?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTrash(item)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        active
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-xs text-emerald-400 mt-1 font-mono">
                        Rp{item.ratePer10Gram} / 10 gram
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                2. Berat Sensor Timbangan (Gram)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Contoh: 200"
                  value={weightGram}
                  disabled={!selectedTrash}
                  onChange={(e) => setWeightGram(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                />
                <span className="absolute right-4 top-3 text-sm text-neutral-500 font-semibold">Gram</span>
              </div>
            </div>

            {calculatedRupiah > 0 && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-xs text-neutral-300">Total Saldo:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  Rp{calculatedRupiah.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedTrash || calculatedRupiah <= 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 text-neutral-950 font-black rounded-2xl transition text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            >
              {user ? "Setor & Transfer Saldo Sekarang" : "Login & Lanjutkan Penyetoran"}
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-bold">Saldo Berhasil Ditransfer!</h2>
            <p className="text-neutral-400 text-xs mt-1">
              Saldo telah masuk ke akun <span className="text-white font-semibold">{lastTx?.userEmail}</span>.
            </p>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-left my-6 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">ID STRUK</span>
                <span>{lastTx?.id}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">SAMPAH</span>
                <span>{lastTx?.trashType}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">BERAT</span>
                <span>{lastTx?.weightGram} Gram</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">PENERIMA</span>
                <span>{lastTx?.ewalletType} ({lastTx?.phoneNumber})</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-neutral-400">TOTAL CAIR</span>
                <span className="text-amber-400">Rp{lastTx?.payoutRupiah.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Setor Lagi (Transaksi Baru)
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}