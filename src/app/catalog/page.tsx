"use client";

import Link from "next/link";
import { TRASH_TYPES } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

export default function CatalogPage() {
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
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-amber-500 font-mono text-xs font-bold uppercase tracking-widest">
            Katalog Lengkap
          </span>
          <h1 className="text-3xl md:text-5xl font-black">Nilai Tukar Daur Ulang</h1>
          <p
            className="text-xs md:text-sm max-w-xl mx-auto"
            style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
          >
            Daftar jenis limbah yang diterima oleh unit RECOIN Reverse Vending Machine beserta standar harga konversi otomatis ke e-wallet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TRASH_TYPES.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl border shadow-xl transition space-y-4"
              style={{
                backgroundColor: isDark ? "#0e1d16" : "#ffffff",
                borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0",
              }}
            >
              <div className="text-5xl">{item.icon}</div>
              <div>
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <p
                  className="text-xs mt-2 leading-relaxed"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  Diterima dalam keadaan kering dan bersih. Sensor optik dan massa mesin akan memverifikasi bahan secara otomatis sebelum mencairkan saldo.
                </p>
              </div>

              <div
                className="pt-4 border-t flex justify-between items-baseline"
                style={{ borderColor: isDark ? "rgba(6,78,59,0.5)" : "#e2e8f0" }}
              >
                <span
                  className="text-xs"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  Nilai Konversi
                </span>
                <span className="text-2xl font-black text-amber-500 font-mono">
                  Rp{item.ratePer10Gram} / 10g
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/kiosk"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition shadow-xl shadow-amber-500/20"
          >
            <span>Bawa Sampah & Mulai Setor</span>
            <span>🪙</span>
          </Link>
        </div>
      </div>
    </div>
  );
}