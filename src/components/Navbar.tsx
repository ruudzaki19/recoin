"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getActiveUser, logoutUser, UserAccount } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import { CoinEmblem } from "@/components/Emblems";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    const syncUser = () => setUser(getActiveUser());
    syncUser();

    window.addEventListener("recoin_user_updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("recoin_user_updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdown(false);
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setProfileDropdown(false);
    setMobileMenuOpen(false);
    window.location.reload();
  };

  const navLinks = [
    { name: t.navHome, href: "/" },
    { name: t.navCatalog, href: "/catalog" },
    { name: t.navKiosk, href: "/kiosk" },
    { name: t.navAbout, href: "/about" },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-md"
      style={{
        backgroundColor: isDark ? "rgba(13, 21, 18, 0.95)" : "rgba(255, 255, 255, 0.95)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
      }}
    >
      {/* Full width container tanpa max-w-7xl agar mentok kiri & kanan */}
      <div className="w-full px-2 sm:px-6 h-20 sm:h-22 flex items-center justify-between">
        
        {/* LOGO RECOIN BESAR & MENTOK KIRI */}
        <Link href="/" className="flex items-center -ml-1 sm:ml-0 group shrink-0">
          <div className="relative h-14 sm:h-24 w-36 sm:w-64 flex items-center justify-start overflow-visible">
            <Image
              src="/logo-recoin.png"
              alt="RECOIN Logo"
              width={420}
              height={140}
              priority
              className="object-contain w-auto h-12 sm:h-24 scale-125 sm:scale-[1.85] origin-left group-hover:scale-[1.9] transition-transform duration-200"
            />
          </div>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 pb-1 ${
                  isActive
                    ? isDark
                      ? "text-amber-300 border-b-2 border-amber-400 font-semibold"
                      : "text-emerald-700 border-b-2 border-emerald-600 font-semibold"
                    : isDark
                    ? "text-neutral-300 hover:text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Area Desktop (Mentok Kanan) */}
        <div className="hidden md:flex items-center gap-3.5 pr-1 sm:pr-2">
          {/* Tombol Tema */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition shadow-sm cursor-pointer text-base"
            style={{
              backgroundColor: isDark ? "#17231e" : "#f1f4f1",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#d1dcd4",
              color: isDark ? "#e2e8f0" : "#374151",
            }}
            title={isDark ? "Mode: Gelap 🌙" : "Mode: Terang ☀️"}
          >
            {isDark ? "🌙" : "☀️"}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-3 p-1.5 pl-3.5 rounded-2xl border transition shadow-sm cursor-pointer"
                style={{
                  backgroundColor: isDark ? "#17231e" : "#ffffff",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dce3de",
                }}
              >
                <div className="text-right">
                  <div
                    className="text-xs font-semibold max-w-[130px] truncate"
                    style={{ color: isDark ? "#f3f4f6" : "#1f2937" }}
                  >
                    {user.fullName}
                  </div>
                  <div className="text-[11px] font-mono text-amber-500 dark:text-amber-300 font-bold flex items-center justify-end gap-1">
                    <span>🪙</span>
                    <span>{(user.coinBalance || 0).toLocaleString("id-ID")} RECOIN</span>
                  </div>
                </div>

                <div
                  className="w-9 h-9 rounded-xl overflow-hidden border flex items-center justify-center text-xs font-bold shadow-sm"
                  style={{
                    backgroundColor: isDark ? "#21322b" : "#e6f4ea",
                    borderColor: isDark ? "rgba(52, 168, 83, 0.4)" : "#a7f3d0",
                    color: isDark ? "#6ee7b7" : "#0f766e",
                  }}
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    (user.fullName || "U").charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              {profileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl border p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
                  style={{
                    backgroundColor: isDark ? "#141e1a" : "#ffffff",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#dfe5e0",
                  }}
                >
                  <div className="border-b pb-3 mb-3" style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#edf2ee" }}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-emerald-600 dark:text-emerald-400 font-medium">
                      {t.navWalletTitle}
                    </span>
                    <p className="text-sm font-semibold truncate" style={{ color: isDark ? "#ffffff" : "#111827" }}>
                      {user.fullName}
                    </p>
                    <div
                      className="mt-2.5 p-2.5 rounded-xl border flex items-center justify-between"
                      style={{
                        backgroundColor: isDark ? "#1b2823" : "#fefce8",
                        borderColor: isDark ? "rgba(217, 119, 6, 0.3)" : "#fef08a",
                      }}
                    >
                      <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">{t.navCoinBalance}</span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-300 font-mono">
                        🪙 {(user.coinBalance || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <Link
                      href="/kiosk#tukar-koin-section"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition"
                      style={{
                        backgroundColor: isDark ? "#1f2a24" : "#faf5eb",
                        borderColor: isDark ? "rgba(217, 119, 6, 0.3)" : "#fed7aa",
                        color: isDark ? "#fcd34d" : "#9a3412",
                      }}
                    >
                      <span>💸</span>
                      <span>{t.navWithdrawAction}</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition"
                      style={{
                        backgroundColor: isDark ? "#17231e" : "#f8faf9",
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb",
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      <span>⚙️</span>
                      <span>{t.navManageProfile}</span>
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      backgroundColor: isDark ? "rgba(185, 28, 28, 0.15)" : "#fef2f2",
                      borderColor: isDark ? "rgba(239, 68, 68, 0.3)" : "#fecaca",
                      color: isDark ? "#f87171" : "#b91c1c",
                    }}
                  >
                    <span>{t.navLogout}</span>
                    <span>⏻</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium transition"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-xs font-semibold tracking-wide rounded-xl transition shadow-sm"
                style={{
                  backgroundColor: "#2e7d32",
                  color: "#ffffff",
                }}
              >
                {t.navRegister}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Control Area (Tetap rapi dan responsif) */}
        <div className="md:hidden flex items-center gap-2 pr-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center border text-base active:scale-95 transition"
            style={{
              backgroundColor: isDark ? "#17231e" : "#f1f4f1",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#d1dcd4",
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? "🌙" : "☀️"}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border text-lg font-bold active:scale-95 transition cursor-pointer"
            style={{
              backgroundColor: isDark ? "#17231e" : "#f1f4f1",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#d1dcd4",
              color: isDark ? "#f3f4f6" : "#16201b",
            }}
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Drawer Menu Mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-5 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl"
          style={{
            backgroundColor: isDark ? "#0d1512" : "#ffffff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0",
          }}
        >
          {user && (
            <div
              className="p-3.5 rounded-2xl border flex items-center justify-between mb-2"
              style={{
                backgroundColor: isDark ? "#141e1a" : "#f6faf7",
                borderColor: isDark ? "rgba(217, 119, 6, 0.3)" : "#f3dfb5",
              }}
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider block" style={{ color: isDark ? "#9ca3af" : "#5d6d66" }}>
                  {user.fullName}
                </span>
                <span className="text-sm font-bold font-mono inline-flex items-center gap-1 mt-0.5" style={{ color: isDark ? "#fcd34d" : "#b45309" }}>
                  <CoinEmblem size={14} />
                  {(user.coinBalance || 0).toLocaleString("id-ID")} RECOIN
                </span>
              </div>
              <Link
                href="/profile"
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: isDark ? "#81c784" : "#2e7d32",
                  color: isDark ? "#a5d6a7" : "#246b3e",
                }}
              >
                Profil
              </Link>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-between"
                  style={{
                    backgroundColor: isActive ? (isDark ? "#1c3227" : "#e5eee7") : "transparent",
                    color: isActive ? (isDark ? "#a5d6a7" : "#1b5e20") : isDark ? "#e5e7eb" : "#16201b",
                  }}
                >
                  <span>{item.name}</span>
                  {isActive && <span>•</span>}
                </Link>
              );
            })}
          </nav>

          <div className="h-px my-2" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#dfe5e0" }} />

          {user ? (
            <div className="space-y-2 pt-1">
              <Link
                href="/kiosk#tukar-koin-section"
                className="block text-center py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm"
                style={{ backgroundColor: "#d97706", color: "#ffffff" }}
              >
                {t.navWithdrawAction}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 text-xs font-semibold rounded-xl border"
                style={{
                  backgroundColor: isDark ? "rgba(185, 28, 28, 0.2)" : "#fef2f2",
                  borderColor: isDark ? "rgba(239, 68, 68, 0.3)" : "#fecaca",
                  color: isDark ? "#f87171" : "#b91c1c",
                }}
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <div className="flex gap-2.5 pt-1">
              <Link
                href="/login"
                className="flex-1 text-center py-3 text-xs font-semibold rounded-xl border"
                style={{
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#d1d5db",
                  color: isDark ? "#e5e7eb" : "#374151",
                }}
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-3 text-xs font-semibold rounded-xl text-white"
                style={{ backgroundColor: "#2e7d32" }}
              >
                {t.navRegister}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}