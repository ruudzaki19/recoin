"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getActiveUser, logoutUser, UserAccount } from "@/lib/storage";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getActiveUser());
    syncUser();

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setProfileDropdown(false);
    window.location.reload();
  };

  const navLinks = [
    { name: t.navHome, href: "/" },
    { name: t.navCatalog, href: "/catalog" },
    { name: t.navAbout, href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-200/80 bg-white/95 dark:border-emerald-950/80 dark:bg-[#070d0a]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200 text-white">
            ♻️
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
              RE<span className="text-amber-500 dark:text-amber-400">COIN</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-emerald-600 dark:text-emerald-500 uppercase">
              Vending Ecosystem
            </span>
          </div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-600 dark:text-amber-400 border-b-2 border-emerald-600 dark:border-amber-400 pb-1"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Tema + Profil / Auth Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Tombol Pengubah Tema (Ikon menunjukkan STATUS saat ini) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-neutral-800 dark:border-emerald-800/60 dark:bg-[#0e1d16] dark:hover:bg-emerald-950 dark:text-neutral-200 transition shadow-sm cursor-pointer text-lg"
            title={theme === "dark" ? "Mode Saat Ini: Gelap 🌙 (Klik untuk beralih)" : "Mode Saat Ini: Terang ☀️ (Klik untuk beralih)"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-white dark:bg-[#0e1d16] border border-emerald-200 dark:border-emerald-700/60 hover:border-emerald-500 transition shadow-sm cursor-pointer"
              >
                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white max-w-[120px] truncate">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-amber-400 font-bold">
                    Rp{(user.totalEarnedRupiah ?? 0).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl overflow-hidden bg-emerald-100 dark:bg-[#0b1612] border border-emerald-400/50 flex items-center justify-center text-xs font-black text-emerald-700 dark:text-emerald-400 shadow-md">
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
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0c1913] border border-emerald-200 dark:border-emerald-800/70 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-neutral-100 dark:border-emerald-950 pb-3 mb-3">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      {t.navConnectedAccount}
                    </span>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/40 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition"
                    >
                      <span>⚙️</span>
                      <span>{t.navManageProfile}</span>
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.navLogout}</span>
                    <span>⏻</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-xs font-bold text-neutral-700 hover:text-emerald-600 dark:text-neutral-300 dark:hover:text-amber-400 transition"
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-500 text-white dark:bg-amber-400/10 dark:border dark:border-amber-400/40 dark:text-amber-300 rounded-xl hover:bg-emerald-600 dark:hover:bg-amber-400 dark:hover:text-neutral-950 transition shadow-sm"
              >
                {t.navRegister}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Toggle & Menu */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-[#0e1d16] text-base cursor-pointer"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 dark:border-emerald-950/80 bg-white dark:bg-[#0a140f] px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold ${
                  pathname === item.href ? "text-emerald-600 dark:text-amber-400" : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="h-px bg-neutral-100 dark:bg-emerald-950/80 my-2" />
          {user ? (
            <div className="space-y-3">
              <div className="text-xs text-neutral-600 dark:text-neutral-300">
                {t.navConnectedAccount}: <span className="text-emerald-600 dark:text-amber-400 font-bold">{user.fullName}</span>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-neutral-800 dark:text-neutral-200"
              >
                {t.navManageProfile}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 text-xs font-bold rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30 cursor-pointer"
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-emerald-800/60 text-neutral-800 dark:text-neutral-200"
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold rounded-xl bg-emerald-500 dark:bg-amber-400 text-white dark:text-neutral-950 uppercase"
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