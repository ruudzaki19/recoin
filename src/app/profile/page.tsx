"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getActiveUser, updateUserProfile, UserAccount } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import { CoinEmblem, ScaleEmblem, WalletPayoutEmblem } from "@/components/Emblems";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
];

export default function ProfilePage() {
  const { theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const isDark = theme === "dark";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserAccount | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ewallet, setEwallet] = useState("GoPay");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const current = getActiveUser();
    if (current) {
      setUser(current);
      setFullName(current.fullName || "");
      setPhone(current.phone || "");
      setEwallet(current.ewalletType || "GoPay");
      setAvatarUrl(current.avatarUrl || "");
    }
  }, []);

  // Handler Upload File Gambar dari Komputer / HP
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batasi file harus format gambar
    if (!file.type.startsWith("image/")) {
      setNotice({
        type: "error",
        text: language === "en" ? "Please select a valid image file." : "Harap pilih file gambar (JPG, PNG, WebP).",
      });
      return;
    }

    // Kompresi ringan gambar via FileReader & Canvas agar tidak membebani local storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatarUrl(compressedDataUrl);
        setNotice({
          type: "success",
          text:
            language === "en"
              ? "Local photo loaded! Click 'SAVE CHANGES' below to save."
              : "Foto lokal berhasil dimuat! Klik 'SIMPAN PERUBAHAN' di bawah untuk menyimpan.",
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!fullName.trim() || !phone.trim()) {
      setNotice({
        type: "error",
        text: language === "en" ? "Full name and phone number are required." : "Nama lengkap dan nomor HP wajib diisi.",
      });
      return;
    }

    const updated = updateUserProfile({
      fullName,
      phone,
      ewalletType: ewallet,
      avatarUrl,
    });

    if (updated) {
      setUser(updated);
      setNotice({
        type: "success",
        text: language === "en" ? "Profile updated successfully!" : "Profil berhasil disimpan!",
      });
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center"
        style={{
          backgroundColor: isDark ? "#0d1512" : "#f1f4f1",
          color: isDark ? "#f3f4f6" : "#1c2520",
        }}
      >
        <p className="text-sm mb-4" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
          {language === "en" ? "You must sign in to manage your profile." : "Anda harus login untuk mengakses profil."}
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white"
          style={{ backgroundColor: "#2e7d32" }}
        >
          {t.navLogin}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 transition-colors duration-300 selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: isDark ? "#0d1512" : "#f1f4f1",
        color: isDark ? "#f3f4f6" : "#1c2520",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Profil */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border font-semibold"
            style={{
              backgroundColor: isDark ? "rgba(46, 125, 50, 0.2)" : "#e5eee7",
              borderColor: isDark ? "rgba(76, 175, 80, 0.3)" : "#c6d8cb",
              color: isDark ? "#a5d6a7" : "#246b3e",
            }}
          >
            PORTAL PENGGUNA
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {language === "en" ? "Account Profile" : "Profil Akun Pengguna"}
          </h1>
          <p className="text-xs max-w-md mx-auto" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
            {language === "en"
              ? "Manage your avatar, personal data, and language preference."
              : "Kelola foto profil, identitas akun, rekening pencairan, dan bahasa aplikasi."}
          </p>
        </div>

        {/* Ringkasan Saldo Koin & Dampak */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className="p-4 rounded-2xl border text-center transition"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(217, 119, 6, 0.3)" : "#f3dfb5",
              boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(22, 32, 27, 0.05)",
            }}
          >
            <span className="text-xs block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
              {t.walletCoinsLabel}
            </span>
            <span
              className="text-xl font-bold font-mono inline-flex items-center gap-1"
              style={{ color: isDark ? "#fcd34d" : "#b45309" }}
            >
              <CoinEmblem size={16} />
              {(user.coinBalance || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <div
            className="p-4 rounded-2xl border text-center transition"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
              boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(22, 32, 27, 0.05)",
            }}
          >
            <span className="text-xs block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
              {t.walletGramsLabel}
            </span>
            <span
              className="text-xl font-bold font-mono inline-flex items-center gap-1"
              style={{ color: isDark ? "#81c784" : "#246b3e" }}
            >
              <ScaleEmblem size={16} />
              {((user.totalGrams || 0) / 1000).toFixed(2)} Kg
            </span>
          </div>

          <div
            className="p-4 rounded-2xl border text-center transition"
            style={{
              backgroundColor: isDark ? "#141e1a" : "#ffffff",
              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
              boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(22, 32, 27, 0.05)",
            }}
          >
            <span className="text-xs block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
              {t.walletWithdrawnLabel}
            </span>
            <span
              className="text-xl font-bold font-mono inline-flex items-center gap-1"
              style={{ color: isDark ? "#81c784" : "#246b3e" }}
            >
              <WalletPayoutEmblem size={16} />
              Rp{(user.totalRupiahWithdrawn || 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Pengaturan Bahasa */}
        <div
          className="p-6 rounded-2xl border transition"
          style={{
            backgroundColor: isDark ? "#141e1a" : "#ffffff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
            boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(22, 32, 27, 0.05)",
          }}
        >
          <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#edf2ee" }}>
            <div>
              <h2 className="text-sm font-bold">
                {language === "en" ? "Application Language" : "Pilihan Bahasa Aplikasi"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                {language === "en" ? "Change UI language across the app" : "Sesuaikan bahasa tampilan RECOIN"}
              </p>
            </div>
            <span className="text-lg">🌐</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`p-3 rounded-xl border text-left font-semibold text-xs transition cursor-pointer flex items-center justify-between ${
                language === "id" ? "shadow-sm" : "opacity-80 hover:opacity-100"
              }`}
              style={{
                backgroundColor: language === "id" ? (isDark ? "#1c3227" : "#e5eee7") : (isDark ? "#101915" : "#f6faf7"),
                borderColor: language === "id" ? (isDark ? "#81c784" : "#2e7d32") : (isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0"),
                color: language === "id" ? (isDark ? "#a5d6a7" : "#1b5e20") : (isDark ? "#d1d5db" : "#5d6d66"),
              }}
            >
              <div className="flex items-center gap-2">
                <span>🇮🇩</span>
                <span>Bahasa Indonesia</span>
              </div>
              {language === "id" && <span>✓</span>}
            </button>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`p-3 rounded-xl border text-left font-semibold text-xs transition cursor-pointer flex items-center justify-between ${
                language === "en" ? "shadow-sm" : "opacity-80 hover:opacity-100"
              }`}
              style={{
                backgroundColor: language === "en" ? (isDark ? "#1c3227" : "#e5eee7") : (isDark ? "#101915" : "#f6faf7"),
                borderColor: language === "en" ? (isDark ? "#81c784" : "#2e7d32") : (isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0"),
                color: language === "en" ? (isDark ? "#a5d6a7" : "#1b5e20") : (isDark ? "#d1d5db" : "#5d6d66"),
              }}
            >
              <div className="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>English</span>
              </div>
              {language === "en" && <span>✓</span>}
            </button>
          </div>
        </div>

        {/* Formulir Lengkap Edit Profil */}
        <div
          className="border rounded-2xl p-6 sm:p-8 transition space-y-6"
          style={{
            backgroundColor: isDark ? "#141e1a" : "#ffffff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
            boxShadow: isDark ? "none" : "0 8px 30px -4px rgba(22, 32, 27, 0.06)",
          }}
        >
          {/* Header Profil & Foto Aktif */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b pb-6" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#edf2ee" }}>
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden border flex items-center justify-center text-2xl font-bold shadow-sm shrink-0"
              style={{
                backgroundColor: isDark ? "#21322b" : "#e6f4ea",
                borderColor: isDark ? "rgba(52, 168, 83, 0.4)" : "#a7f3d0",
                color: isDark ? "#6ee7b7" : "#0f766e",
              }}
            >
              {avatarUrl ? (
                <Image src={avatarUrl} alt={fullName} width={80} height={80} className="w-full h-full object-cover" unoptimized />
              ) : (
                (fullName || "U").charAt(0).toUpperCase()
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold">{fullName || "Pengguna RECOIN"}</h2>
              <p className="text-xs font-mono" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                {user.email}
              </p>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border"
                  style={{
                    backgroundColor: isDark ? "rgba(46, 125, 50, 0.2)" : "#e5eee7",
                    borderColor: isDark ? "rgba(76, 175, 80, 0.3)" : "#c6d8cb",
                    color: isDark ? "#a5d6a7" : "#246b3e",
                  }}
                >
                  ID: {user.id}
                </span>
                <span className="text-[11px] font-mono" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {language === "en" ? "Member since" : "Terdaftar"}: {user.createdAt || "2026"}
                </span>
              </div>
            </div>
          </div>

          {/* UPLOAD FOTO DARI FILE LOKAL */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                {language === "en" ? "Upload Profile Photo" : "Unggah Foto Profil Dari Perangkat"}
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="text-xs font-medium text-red-500 hover:underline cursor-pointer"
                >
                  {language === "en" ? "Remove Photo" : "Hapus Foto"}
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-2 hover:opacity-95"
                style={{
                  backgroundColor: isDark ? "#17231e" : "#e5eee7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#c6d8cb",
                  color: isDark ? "#81c784" : "#246b3e",
                }}
              >
                <span>📁</span>
                <span>{language === "en" ? "Choose from device / files..." : "Pilih dari Galeri / Laptop..."}</span>
              </button>

              <span className="text-[11px]" style={{ color: isDark ? "#9ca3af" : "#71827a" }}>
                PNG, JPG, JPEG, atau WebP
              </span>
            </div>
          </div>

          {/* Atau Pilih Preset Avatar Bulat */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
              {language === "en" ? "Or Select Preset Avatar" : "Atau Pilih Avatar Bawaan"}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {PRESET_AVATARS.map((url, idx) => {
                const isSelected = avatarUrl === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      isSelected ? "scale-105 shadow-md" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: isSelected ? (isDark ? "#81c784" : "#2e7d32") : "transparent",
                    }}
                  >
                    <Image src={url} alt={`Preset ${idx + 1}`} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="px-3 h-12 rounded-xl border text-[11px] font-semibold transition cursor-pointer"
                style={{
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  color: isDark ? "#d1d5db" : "#5d6d66",
                }}
              >
                {language === "en" ? "Use Initial" : "Pakai Huruf"}
              </button>
            </div>
          </div>

          {notice && (
            <div
              className="p-3.5 rounded-xl border text-xs text-center font-semibold"
              style={{
                backgroundColor:
                  notice.type === "success"
                    ? isDark
                      ? "rgba(46, 125, 50, 0.2)"
                      : "#e8f5e9"
                    : isDark
                    ? "rgba(185, 28, 28, 0.2)"
                    : "#fef2f2",
                borderColor: notice.type === "success" ? "#81c784" : "#fca5a5",
                color: notice.type === "success" ? (isDark ? "#a5d6a7" : "#2e7d32") : "#b91c1c",
              }}
            >
              {notice.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                {language === "en" ? "Full Name" : "Nama Lengkap"}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:border-[#2e7d32]"
                style={{
                  backgroundColor: isDark ? "#101915" : "#f6faf7",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  color: isDark ? "#f3f4f6" : "#16201b",
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {language === "en" ? "Phone Number (E-Wallet)" : "Nomor HP (E-Wallet)"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition font-mono focus:border-[#2e7d32]"
                  style={{
                    backgroundColor: isDark ? "#101915" : "#f6faf7",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                    color: isDark ? "#f3f4f6" : "#16201b",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {language === "en" ? "Default E-Wallet" : "Pilihan E-Wallet"}
                </label>
                <select
                  value={ewallet}
                  onChange={(e) => setEwallet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none cursor-pointer focus:border-[#2e7d32]"
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

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                Email ({language === "en" ? "Read-Only" : "Tidak Dapat Diubah"})
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border opacity-60 cursor-not-allowed font-mono"
                style={{
                  backgroundColor: isDark ? "#101915" : "#eef2ef",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dce3de",
                  color: isDark ? "#9ca3af" : "#5d6d66",
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition shadow-sm cursor-pointer"
              style={{ backgroundColor: "#2e7d32" }}
            >
              {language === "en" ? "SAVE CHANGES" : "SIMPAN PERUBAHAN PROFIL"}
            </button>
          </form>
        </div>

        {/* Tombol Balik ke Beranda */}
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
    </div>
  );
}