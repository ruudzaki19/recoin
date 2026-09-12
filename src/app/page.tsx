"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getStoredTransactions,
  TRASH_TYPES,
  VendingTransaction,
  getActiveUser,
  logoutUser,
  UserAccount,
} from "@/lib/storage";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [transactions, setTransactions] = useState<VendingTransaction[]>([]);
  const [calcType, setCalcType] = useState<string>("can");
  const [calcWeight, setCalcWeight] = useState<number>(250);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    setUser(getActiveUser());
    setTransactions(getStoredTransactions());

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setProfileDropdown(false);
  };

  const activeTrash = TRASH_TYPES.find((t) => t.id === calcType) || TRASH_TYPES[0];
  const calculatedEstimate = Math.round((calcWeight / 10) * activeTrash.ratePer10Gram);

  // 1. STATISTIK GLOBAL (Semua Pengguna)
  const globalRupiah = transactions.reduce((acc, curr) => acc + curr.payoutRupiah, 0);
  const globalGrams = transactions.reduce((acc, curr) => acc + curr.weightGram, 0);

  // 2. STATISTIK PERSONAL (Khusus Akun yang Sedang Login)
  const userTransactions = user
    ? transactions.filter((tx) => tx.userId === user.id || tx.userEmail === user.email)
    : [];
  const userRupiah = user ? user.totalEarnedRupiah : 0;
  const userGrams = user ? user.totalGrams : 0;
  const userDepositCount = userTransactions.length;

  return (
    <>
      {/* 1. SPLASH SCREEN */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070d0a] transition-all duration-700 ease-in-out ${
          loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-105"
        }`}
      >
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-2xl shadow-emerald-500/30">
            <div className="w-full h-full bg-[#0b1612] rounded-[22px] flex items-center justify-center text-4xl">
              ♻️
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
            🪙
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-wider text-white">
          RE<span className="text-amber-400">COIN</span>
        </h1>
        <p className="text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] mt-2 animate-pulse">
          Recycle Waste • Earn Coin
        </p>

        <div className="w-48 h-1 bg-neutral-900 rounded-full mt-8 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-amber-400 animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>

      {/* 2. MAIN SITE */}
      <div className="min-h-screen bg-[#070d0a] text-white selection:bg-emerald-500 selection:text-black">
        {/* Glow Background */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* HEADER / NAVBAR */}
        <header className="sticky top-0 z-40 border-b border-emerald-950/60 bg-[#070d0a]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
                ♻️
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  RE<span className="text-amber-400">COIN</span>
                </span>
                <span className="block text-[10px] text-emerald-400/80 font-mono tracking-wider -mt-1">
                  VENDING ECOSYSTEM
                </span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
              <a href="#rates" className="hover:text-amber-400 transition">Katalog Nilai</a>
              <a href="#calculator" className="hover:text-emerald-400 transition">Kalkulator</a>
              <a href="#activity" className="hover:text-amber-400 transition">Live Vending</a>
              <a href="#sdg" className="hover:text-emerald-400 transition">SDGs 12</a>
            </nav>

            {/* Area Profil / Login */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-[#0e1d16] border border-emerald-700/60 hover:border-emerald-400 transition shadow-lg"
                  >
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-white">{user.fullName}</div>
                      <div className="text-[10px] font-mono text-amber-400 font-bold">
                        Rp{user.totalEarnedRupiah.toLocaleString("id-ID")}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-amber-300 p-0.5 shadow-md">
                      <div className="w-full h-full bg-[#0b1612] rounded-[10px] flex items-center justify-center text-sm font-black text-emerald-400">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c1913] border border-emerald-800/70 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="border-b border-emerald-950 pb-3 mb-3">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                          Akun Terhubung
                        </span>
                        <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      </div>

                      <div className="space-y-2 text-xs mb-3">
                        <div className="flex justify-between text-neutral-400">
                          <span>E-Wallet:</span>
                          <span className="text-white font-semibold">{user.ewalletType}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Nomor HP:</span>
                          <span className="text-white font-mono">{user.phone}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Total Sampah:</span>
                          <span className="text-emerald-400 font-bold font-mono">{user.totalGrams} g</span>
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <span>Keluar Akun</span>
                        <span>⏻</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-emerald-400 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400/10 border border-amber-400/40 text-amber-300 rounded-xl hover:bg-amber-400 hover:text-neutral-950 transition shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Smart Reverse Vending Machine Berbasis Gramasi
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              Timbang Sampahmu, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-300">
                Cairkan Saldo E-Wallet
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-neutral-400 text-base md:text-lg leading-relaxed">
              Solusi sirkular modern untuk mengonversi sampah kaleng minuman dan kemasan makanan menjadi saldo instan ke GoPay, DANA, dan OVO secara presisi per 10 gram.
            </p>

            <div className="pt-4 flex items-center justify-center">
              <Link
                href="/kiosk"
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black tracking-wide text-xs uppercase transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 hover:scale-105"
              >
                <span>Mulai Setor di Kios</span>
                <span className="text-base">🪙</span>
              </Link>
            </div>

            {/* AREA METRIK KONDISIONAL (SEBELUM vs SESUDAH LOGIN) */}
            <div className="pt-10 max-w-4xl mx-auto">
              {!user ? (
                /* TAMPILAN BELUM LOGIN: 2 Kartu Metrik Global */
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 font-mono">
                    <span>🌐</span> Total Dampak Bersama Seluruh Pengguna
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e1d16] to-[#08120e] border border-emerald-900/60 shadow-xl text-left relative overflow-hidden group hover:border-emerald-500/40 transition">
                      <div className="text-3xl mb-2">🪙</div>
                      <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono tracking-tight">
                        Rp{globalRupiah.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-neutral-400 mt-2 font-medium">
                        Total Saldo Tersalurkan (Semua User)
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e1d16] to-[#08120e] border border-emerald-900/60 shadow-xl text-left relative overflow-hidden group hover:border-emerald-500/40 transition">
                      <div className="text-3xl mb-2">♻️</div>
                      <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                        {(globalGrams / 1000).toFixed(2)} Kg
                      </div>
                      <div className="text-xs text-neutral-400 mt-2 font-medium">
                        Total Sampah Terkumpul (Semua User)
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAMPILAN SUDAH LOGIN: 3 Kartu Metrik Personal Milik Akun */
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
                    <span>👤</span> Statistik Khusus Akun: <strong className="text-white">{user.fullName}</strong>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* 1. Saldo Akun Sendiri */}
                    <div className="p-5 rounded-3xl bg-gradient-to-b from-[#10221b] to-[#0a1510] border border-amber-500/40 shadow-xl text-left relative">
                      <span className="text-2xl block mb-2">🪙</span>
                      <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
                        Rp{userRupiah.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 font-medium">
                        Saldo Tersalurkan ke Akun Saya
                      </div>
                    </div>

                    {/* 2. Sampah Akun Sendiri */}
                    <div className="p-5 rounded-3xl bg-gradient-to-b from-[#10221b] to-[#0a1510] border border-emerald-700/50 shadow-xl text-left relative">
                      <span className="text-2xl block mb-2">⚖️</span>
                      <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                        {(userGrams / 1000).toFixed(2)} Kg
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 font-medium">
                        Total Sampah Terkumpul Saya ({userGrams} g)
                      </div>
                    </div>

                    {/* 3. Total Penyetoran Akun Sendiri */}
                    <div className="p-5 rounded-3xl bg-gradient-to-b from-[#10221b] to-[#0a1510] border border-emerald-700/50 shadow-xl text-left relative">
                      <span className="text-2xl block mb-2">🧾</span>
                      <div className="text-2xl md:text-3xl font-black text-white font-mono">
                        {userDepositCount} Kali
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 font-medium">
                        Total Penyetoran Saya
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* KATALOG NILAI */}
        <section id="rates" className="py-16 px-6 border-t border-emerald-950/60 bg-[#0a1410]/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                Nilai Tukar Transparan
              </span>
              <h2 className="text-3xl font-extrabold mt-1">Kategori Sampah Diterima</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10221b] to-[#0d1a14] border border-emerald-800/40">
                <div className="text-4xl mb-3">🥫</div>
                <h3 className="text-xl font-bold">Kaleng Minuman (Aluminium)</h3>
                <p className="text-neutral-400 text-xs mt-2 mb-4">
                  Kaleng soda, teh, larutan, dan kopi aluminium dalam kondisi bersih tanpa sisa air.
                </p>
                <div className="pt-3 border-t border-emerald-950 flex justify-between items-baseline">
                  <span className="text-xs text-neutral-400">Harga per 10 gram</span>
                  <span className="text-xl font-black text-amber-400 font-mono">Rp50 / 10g</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10221b] to-[#0d1a14] border border-emerald-800/40">
                <div className="text-4xl mb-3">🥨</div>
                <h3 className="text-xl font-bold">Kemasan Makanan / Snack</h3>
                <p className="text-neutral-400 text-xs mt-2 mb-4">
                  Bungkus biskuit, sachet makanan ringan, mie instan berbahan plastik multilayer kering.
                </p>
                <div className="pt-3 border-t border-emerald-950 flex justify-between items-baseline">
                  <span className="text-xs text-neutral-400">Harga per 10 gram</span>
                  <span className="text-xl font-black text-amber-400 font-mono">Rp20 / 10g</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KALKULATOR */}
        <section id="calculator" className="py-16 px-6">
          <div className="max-w-4xl mx-auto bg-[#0d1a14] border border-emerald-800/50 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
                Simulasi Penghasilan
              </span>
              <h2 className="text-2xl md:text-3xl font-black mt-1">Kalkulator Saldo RECOIN</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-2">Pilih Sampah</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRASH_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setCalcType(type.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                          calcType === type.id
                            ? "border-emerald-500 bg-emerald-500/20 text-white"
                            : "border-neutral-800 bg-neutral-900/50 text-neutral-400"
                        }`}
                      >
                        {type.icon} {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-400 mb-2">
                    <span>Estimasi Berat</span>
                    <span className="text-emerald-400 font-mono">{calcWeight} Gram</span>
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

              <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-900/80 text-center space-y-3">
                <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold block">
                  Potensi Saldo Cair
                </span>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  Rp{calculatedEstimate.toLocaleString("id-ID")}
                </div>
                <p className="text-[11px] text-neutral-400">
                  Langsung masuk ke saldo akun & dapat ditarik via GoPay/DANA/OVO.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AKTIVITAS LIVE VENDING */}
        <section id="activity" className="py-16 px-6 border-t border-emerald-950/60 bg-[#0a1410]/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                  Transparansi Mesin
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-1">Aktivitas Penyetoran Terkini</h2>
              </div>
              <span className="text-xs text-neutral-400 font-mono mt-2 md:mt-0">
                Sinkron langsung dari memori mesin
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/20">
                <p className="text-neutral-400 text-sm">Belum ada transaksi di mesin.</p>
                <Link href="/kiosk" className="text-xs text-emerald-400 hover:underline mt-2 inline-block">
                  Jadilah orang pertama yang setor sampah di mesin →
                </Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-[#0d1a14] border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-lg">
                        {tx.trashType.toLowerCase().includes("kaleng") ? "🥫" : "🥨"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{tx.trashType}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                          ID: {tx.id} • {tx.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                      <div>
                        <div className="text-xs text-neutral-400 font-medium">Berat</div>
                        <div className="text-sm font-mono text-emerald-300 font-bold">
                          {tx.weightGram} Gram
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400 font-medium">Cair ke {tx.ewalletType}</div>
                        <div className="text-sm font-mono text-amber-400 font-black">
                          +Rp{tx.payoutRupiah.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SDGS 12 SECTION */}
        <section id="sdg" className="py-20 px-6 border-t border-emerald-950/60">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
                Komitmen Berkelanjutan
              </span>
              <h2 className="text-3xl font-black mt-2 leading-tight">
                Mewujudkan Kampus Ramah Lingkungan dengan SDGs 12
              </h2>
              <p className="text-neutral-400 text-sm mt-4 leading-relaxed">
                RECOIN mengintegrasikan prinsip <span className="text-emerald-400 font-semibold">Responsible Consumption and Production</span> dengan mendesentralisasi titik kumpul limbah anorganik di area publik dan institusi pendidikan.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#10221b] to-[#08120e] border border-emerald-800/60 text-center space-y-4">
              <div className="text-6xl">🌍</div>
              <h3 className="text-xl font-bold">SDG Target 12.5</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                &ldquo;Secara substansial mengurangi timbulan sampah melalui pencegahan, pengurangan, daur ulang, dan penggunaan kembali pada tahun 2030.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-emerald-950 py-8 text-center text-xs text-neutral-500 font-mono">
          <p>© 2026 RECOIN Eco-Smart Vending Machine Platform.</p>
        </footer>
      </div>
    </>
  );
}