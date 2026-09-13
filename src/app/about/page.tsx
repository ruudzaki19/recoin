"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme";

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="min-h-screen py-16 px-6 transition-colors duration-300 selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: isDark ? "#070d0a" : "#f4f7f5",
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-emerald-500 font-mono text-xs font-bold uppercase tracking-widest">
            Tentang Proyek
          </span>
          <h1 className="text-3xl md:text-5xl font-black">RECOIN Ecosystem</h1>
          <p
            className="text-xs md:text-sm"
            style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
          >
            Inovasi Reverse Vending Machine (RVM) berbasis sensor presisi untuk ekonomi sirkular modern.
          </p>
        </div>

        <div
          className="p-8 rounded-3xl border shadow-xl space-y-6 transition"
          style={{
            backgroundColor: isDark ? "#0e1d16" : "#ffffff",
            borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0",
          }}
        >
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Misi Sirkular Kami</h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: isDark ? "#d4d4d4" : "#4b5563" }}
            >
              RECOIN dirancang untuk mengatasi kebiasaan membuang sampah sembarangan dengan memberikan insentif langsung. Setiap kaleng aluminium atau bungkus kemasan yang dimasukkan ke dalam unit vending akan ditimbang dan langsung dikonversi menjadi saldo e-wallet nyata (GoPay, DANA, OVO).
            </p>
          </div>

          <div
            className="p-5 rounded-2xl border"
            style={{
              backgroundColor: isDark ? "#09140f" : "#f9fafb",
              borderColor: isDark ? "rgba(6,78,59,0.4)" : "#e5e7eb",
            }}
          >
            <h3 className="text-sm font-bold mb-2">⚡ Fitur Utama Sistem:</h3>
            <ul
              className="text-xs space-y-2 list-disc list-inside"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              <li>Pencatatan gramasi presisi per 10 gram limbah</li>
              <li>Penyaluran saldo otomatis ke akun e-wallet terhubung</li>
              <li>Struk digital instan ala aplikasi fintech modern</li>
              <li>Dukungan multi-bahasa (ID / EN) & tema ganda (Gelap / Terang)</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-mono transition hover:text-emerald-500"
            style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}