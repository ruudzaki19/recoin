"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "en";

export const translations = {
  id: {
    // Navbar
    navHome: "Home",
    navCatalog: "Katalog Nilai",
    navAbout: "Tentang Kami",
    navLogin: "Login",
    navRegister: "Register",
    navManageProfile: "Kelola Profil & Pengaturan",
    navLogout: "Keluar Akun",
    navConnectedAccount: "Akun Terhubung",

    // Home
    heroTitle1: "Timbang Sampahmu,",
    heroTitle2: "Cairkan Saldo E-Wallet",
    heroDesc:
      "Solusi sirkular modern untuk mengonversi sampah kaleng minuman dan kemasan makanan menjadi saldo instan ke GoPay, DANA, dan OVO secara presisi per 10 gram.",
    heroCta: "Mulai Setor di Kios",
    globalStatBadge: "Total Dampak Bersama Seluruh Pengguna",
    globalTotalEarned: "Total Saldo Tersalurkan (Semua User)",
    globalTotalWeight: "Total Sampah Terkumpul (Semua User)",
    userStatBadge: "Statistik Khusus Akun:",
    userTotalEarned: "Saldo Tersalurkan ke Akun Saya",
    userTotalWeight: "Total Sampah Terkumpul Saya",
    userTotalDeposits: "Total Penyetoran Saya",
    categoryBadge: "Nilai Tukar Transparan",
    categoryTitle: "Kategori Sampah Diterima",
    canTitle: "Kaleng Minuman (Aluminium)",
    canDesc: "Kaleng soda, teh, larutan, dan kopi aluminium dalam kondisi bersih tanpa sisa air.",
    snackTitle: "Kemasan Makanan / Snack",
    snackDesc: "Bungkus biskuit, sachet makanan ringan, mie instan berbahan plastik multilayer kering.",
    ratePer10g: "Harga per 10 gram",
    calcBadge: "Simulasi Penghasilan",
    calcTitle: "Kalkulator Saldo RECOIN",
    calcSelectTrash: "Pilih Sampah",
    calcEstimatedWeight: "Estimasi Berat",
    calcPayoutTitle: "Potensi Saldo Cair",
    calcPayoutDesc: "Langsung masuk ke saldo akun & dapat ditarik via GoPay/DANA/OVO.",
    liveActivityBadge: "Transparansi Mesin",
    liveActivityTitle: "Aktivitas Penyetoran Terkini",
    liveSyncText: "Sinkron langsung dari memori mesin",
    noTransactions: "Belum ada transaksi di mesin.",
    firstDepositPrompt: "Jadilah orang pertama yang setor sampah di mesin →",
    weightLabel: "Berat",
    payoutToLabel: "Cair ke",

    // Profile & Settings
    profileTitle: "Pengaturan & Akun Pengguna",
    profileSubtitle: "Kelola foto profil, identitas e-wallet, dan preferensi bahasa sistem",
    changeAvatarText: "Klik ikon kamera untuk mengganti foto profil",
    fullNameLabel: "Nama Lengkap",
    emailLabel: "Alamat Email (Permanen)",
    phoneLabel: "No. Handphone E-Wallet",
    ewalletLabel: "Default E-Wallet Pencairan",
    saveProfileBtn: "Simpan Perubahan Profil",
    savingProfileBtn: "Menyimpan...",
    saveSuccessMsg: "Profil dan preferensi berhasil diperbarui!",
    
    // Language Setting Section in Profile
    langSectionTitle: "Preferensi Bahasa / Language Preference",
    langSectionDesc: "Pilih bahasa tampilan antarmuka yang diinginkan untuk seluruh platform RECOIN.",
    langId: "Bahasa Indonesia",
    langEn: "English",
    langActiveBadge: "Aktif",
    
    // Misc
    times: "Kali",
  },
  en: {
    // Navbar
    navHome: "Home",
    navCatalog: "Value Rates",
    navAbout: "About Us",
    navLogin: "Login",
    navRegister: "Register",
    navManageProfile: "Profile & Settings",
    navLogout: "Log Out",
    navConnectedAccount: "Connected Account",

    // Home
    heroTitle1: "Weigh Your Recyclables,",
    heroTitle2: "Cash Out to E-Wallet",
    heroDesc:
      "Modern circular solution converting aluminium beverage cans and snack wrappers into instant balance on GoPay, DANA, and OVO with precise 10-gram calculation.",
    heroCta: "Start Deposit at Kiosk",
    globalStatBadge: "Community Impact Across All Users",
    globalTotalEarned: "Total Payout Disbursed (All Users)",
    globalTotalWeight: "Total Waste Collected (All Users)",
    userStatBadge: "Account Summary for:",
    userTotalEarned: "Balance Received in My Account",
    userTotalWeight: "My Total Recycled Weight",
    userTotalDeposits: "My Total Deposits",
    categoryBadge: "Transparent Exchange Rates",
    categoryTitle: "Accepted Waste Categories",
    canTitle: "Beverage Cans (Aluminium)",
    canDesc: "Clean and dry aluminium soda, tea, or coffee cans without residual fluids.",
    snackTitle: "Snack & Food Packaging",
    snackDesc: "Dry multilayer plastic wrappers of biscuits, snacks, and instant noodles.",
    ratePer10g: "Rate per 10 grams",
    calcBadge: "Earnings Simulation",
    calcTitle: "RECOIN Balance Calculator",
    calcSelectTrash: "Select Waste Category",
    calcEstimatedWeight: "Estimated Weight",
    calcPayoutTitle: "Potential Cash Out",
    calcPayoutDesc: "Instantly credited to your balance and withdrawal-ready via GoPay/DANA/OVO.",
    liveActivityBadge: "Machine Transparency",
    liveActivityTitle: "Latest Deposit Activity",
    liveSyncText: "Real-time sync from vending machine memory",
    noTransactions: "No machine transactions recorded yet.",
    firstDepositPrompt: "Be the first to deposit waste into the machine →",
    weightLabel: "Weight",
    payoutToLabel: "Transferred to",

    // Profile & Settings
    profileTitle: "User Profile & Settings",
    profileSubtitle: "Manage your profile picture, e-wallet payout info, and language preferences",
    changeAvatarText: "Click the camera icon to update profile picture",
    fullNameLabel: "Full Name",
    emailLabel: "Email Address (Permanent)",
    phoneLabel: "E-Wallet Phone Number",
    ewalletLabel: "Default E-Wallet Destination",
    saveProfileBtn: "Save Profile Changes",
    savingProfileBtn: "Saving...",
    saveSuccessMsg: "Profile and preferences updated successfully!",

    // Language Setting Section in Profile
    langSectionTitle: "Language Preferences",
    langSectionDesc: "Choose your preferred display language across the entire RECOIN platform.",
    langId: "Bahasa Indonesia",
    langEn: "English",
    langActiveBadge: "Active",

    // Misc
    times: "Times",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.id;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "id",
  setLanguage: () => {},
  t: translations.id,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("recoin_language") as Language;
    if (saved === "id" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("recoin_language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);