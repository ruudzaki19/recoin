"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getActiveUser, updateUserProfile, UserAccount } from "@/lib/storage";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [user, setUser] = useState<UserAccount | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ewalletType, setEwalletType] = useState<string>("GoPay");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (active) {
      setUser(active);
      setFullName(active.fullName || "");
      setPhone(active.phone || "");
      setEwalletType(active.ewalletType || "GoPay");
      setAvatarUrl(active.avatarUrl || "");
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setAvatarUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const updated = updateUserProfile({
      fullName,
      phone,
      ewalletType,
      avatarUrl,
    });

    if (updated) {
      setUser(updated);
      setIsSaving(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-300"
        style={{
          backgroundColor: isDark ? "#070d0a" : "#f4f7f5",
          color: isDark ? "#ffffff" : "#111827",
        }}
      >
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-xl font-bold">Silakan Login Terlebih Dahulu</h2>
        <p
          className="text-xs mt-1 mb-4"
          style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
        >
          Anda perlu login untuk mengakses pengaturan profil & bahasa.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-black text-xs uppercase cursor-pointer"
        >
          Masuk ke Akun
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-6 transition-colors duration-300 selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: isDark ? "#070d0a" : "#f4f7f5",
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Profil */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
            Settings & Account
          </span>
          <h1 className="text-3xl font-black">{t.profileTitle}</h1>
          <p
            className="text-xs"
            style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
          >
            {t.profileSubtitle}
          </p>
        </div>

        {/* Form Profil Utama */}
        <div
          className="p-8 rounded-3xl border shadow-2xl space-y-8 transition"
          style={{
            backgroundColor: isDark ? "#0e1d16" : "#ffffff",
            borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0",
          }}
        >
          {/* Avatar Area */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              <div
                className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500/60 shadow-xl flex items-center justify-center text-3xl font-black text-emerald-500"
                style={{ backgroundColor: isDark ? "#0b1612" : "#ecfdf5" }}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  (fullName || "U").charAt(0).toUpperCase()
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm shadow-lg transition transform hover:scale-110 cursor-pointer"
                title="Ganti Foto Profil"
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <span
              className="text-[11px] font-mono"
              style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
            >
              {t.changeAvatarText}
            </span>
          </div>

          {/* Notifikasi Sukses */}
          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-bold text-center animate-in fade-in">
              ✓ {t.saveSuccessMsg}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label
                className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.fullNameLabel}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-emerald-400"
                style={{
                  backgroundColor: isDark ? "#09140f" : "#f9fafb",
                  borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              />
            </div>

            <div>
              <label
                className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.emailLabel}
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-3 rounded-xl border text-sm font-mono cursor-not-allowed opacity-60"
                style={{
                  backgroundColor: isDark ? "#050b08" : "#f1f5f9",
                  borderColor: isDark ? "#1a251e" : "#e2e8f0",
                  color: isDark ? "#a3a3a3" : "#6b7280",
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm font-mono outline-none focus:border-emerald-400"
                  style={{
                    backgroundColor: isDark ? "#09140f" : "#f9fafb",
                    borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                >
                  {t.ewalletLabel}
                </label>
                <select
                  value={ewalletType}
                  onChange={(e) => setEwalletType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-emerald-400 cursor-pointer"
                  style={{
                    backgroundColor: isDark ? "#09140f" : "#f9fafb",
                    borderColor: isDark ? "rgba(6,78,59,0.8)" : "#cbd5e1",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  <option value="GoPay">GoPay</option>
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
            >
              {isSaving ? t.savingProfileBtn : t.saveProfileBtn}
            </button>
          </form>

          {/* SEKSI PREFERENSI TEMA */}
          <div
            className="pt-6 border-t space-y-4"
            style={{ borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0" }}
          >
            <div>
              <h3 className="text-sm font-black flex items-center gap-2">
                <span>🎨</span> Mode Tampilan Tema
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                Pilih tampilan mode gelap atau mode terang untuk seluruh antarmuka.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isDark ? "shadow-md scale-[1.01]" : "opacity-75"
                }`}
                style={{
                  backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "#f9fafb",
                  borderColor: isDark ? "#10b981" : "#e5e7eb",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌙</span>
                  <div>
                    <div className="text-xs font-bold">Mode Gelap</div>
                    <div
                      className="text-[10px]"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      Eco-Dark
                    </div>
                  </div>
                </div>
                {isDark && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-neutral-950 text-[10px] font-black uppercase font-mono">
                    Aktif
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  !isDark ? "shadow-md scale-[1.01]" : "opacity-75"
                }`}
                style={{
                  backgroundColor: !isDark ? "#ecfdf5" : "#09140f",
                  borderColor: !isDark ? "#10b981" : "#1f2923",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☀️</span>
                  <div>
                    <div className="text-xs font-bold">Mode Terang</div>
                    <div
                      className="text-[10px]"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      Clean Light
                    </div>
                  </div>
                </div>
                {!isDark && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase font-mono">
                    Aktif
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* SEKSI PREFERENSI BAHASA */}
          <div
            className="pt-6 border-t space-y-4"
            style={{ borderColor: isDark ? "rgba(6,78,59,0.6)" : "#e2e8f0" }}
          >
            <div>
              <h3 className="text-sm font-black flex items-center gap-2">
                <span>🌐</span> {t.langSectionTitle}
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
              >
                {t.langSectionDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage("id")}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  language === "id" ? "shadow-md scale-[1.01]" : "opacity-75"
                }`}
                style={{
                  backgroundColor:
                    language === "id"
                      ? isDark
                        ? "rgba(16,185,129,0.15)"
                        : "#ecfdf5"
                      : isDark
                      ? "#09140f"
                      : "#f9fafb",
                  borderColor:
                    language === "id"
                      ? "#10b981"
                      : isDark
                      ? "#1f2923"
                      : "#e5e7eb",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇮🇩</span>
                  <div>
                    <div className="text-xs font-bold">Bahasa Indonesia</div>
                    <div
                      className="text-[10px]"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      IDN
                    </div>
                  </div>
                </div>
                {language === "id" && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-neutral-950 text-[10px] font-black uppercase font-mono">
                    {t.langActiveBadge}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  language === "en" ? "shadow-md scale-[1.01]" : "opacity-75"
                }`}
                style={{
                  backgroundColor:
                    language === "en"
                      ? isDark
                        ? "rgba(16,185,129,0.15)"
                        : "#ecfdf5"
                      : isDark
                      ? "#09140f"
                      : "#f9fafb",
                  borderColor:
                    language === "en"
                      ? "#10b981"
                      : isDark
                      ? "#1f2923"
                      : "#e5e7eb",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <div className="text-xs font-bold">English</div>
                    <div
                      className="text-[10px]"
                      style={{ color: isDark ? "#a3a3a3" : "#6b7280" }}
                    >
                      Global
                    </div>
                  </div>
                </div>
                {language === "en" && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-neutral-950 text-[10px] font-black uppercase font-mono">
                    {t.langActiveBadge}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono transition"
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
    </div>
  );
}