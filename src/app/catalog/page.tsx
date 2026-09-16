"use client";

import Link from "next/link";
import { TRASH_TYPES } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { CanEmblem, SnackEmblem, PaperEmblem, CoinEmblem } from "@/components/Emblems";

export default function CatalogPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const renderEmblem = (id: string) => {
    const colorClass = isDark ? "text-emerald-400" : "text-emerald-700";
    if (id === "can") return <CanEmblem size={36} className={colorClass} />;
    if (id === "snack") return <SnackEmblem size={36} className={colorClass} />;
    return <PaperEmblem size={36} className={colorClass} />;
  };

  return (
    <div
      className="min-h-screen py-16 px-6 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#0d1512" : "#f8f9fa",
        color: isDark ? "#f3f4f6" : "#1f2937",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span
            className="font-mono text-xs font-semibold uppercase tracking-wider block"
            style={{ color: isDark ? "#fcd34d" : "#b45309" }}
          >
            Katalog Lengkap
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Nilai Tukar Daur Ulang</h1>
          <p className="text-xs md:text-sm max-w-xl mx-auto" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
            Daftar jenis limbah yang diterima oleh unit RECOIN Reverse Vending Machine beserta standar koin per 10 gram.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TRASH_TYPES.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border shadow-sm transition space-y-4 flex flex-col justify-between"
              style={{
                backgroundColor: isDark ? "#141e1a" : "#ffffff",
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb",
              }}
            >
              <div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: isDark ? "#1c3227" : "#e8f5e9" }}
                >
                  {renderEmblem(item.id)}
                </div>
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                  {item.description}
                </p>
              </div>

              <div
                className="pt-4 border-t flex justify-between items-baseline"
                style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb" }}
              >
                <span className="text-xs" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                  Nilai Konversi
                </span>
                <span
                  className="text-xl font-bold font-mono inline-flex items-center gap-1"
                  style={{ color: isDark ? "#fcd34d" : "#d97706" }}
                >
                  <CoinEmblem size={18} />
                  {item.ratePer10GramCoins} Koin / 10g
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/kiosk"
            className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition shadow-sm text-white"
            style={{ backgroundColor: "#2e7d32" }}
          >
            <span>Bawa Sampah & Mulai Setor</span>
            <CoinEmblem size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}