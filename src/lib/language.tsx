"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "en";

export interface Translations {
  // Navbar
  navHome: string;
  navCatalog: string;
  navKiosk: string;
  navAbout: string;
  navLogin: string;
  navRegister: string;
  navLogout: string;
  navConnectedAccount: string;
  navWalletTitle: string;
  navCoinBalance: string;
  navWithdrawAction: string;
  navManageProfile: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroDesc: string;
  btnDeposit: string;
  btnWithdraw: string;

  // Stats
  statGlobalCoinsLabel: string;
  statGlobalGramsLabel: string;
  walletBadge: string;
  walletCoinsLabel: string;
  walletGramsLabel: string;
  walletWithdrawnLabel: string;

  // Rates Section
  ratesBadge: string;
  ratesTitle: string;
  ratesDesc: string;
  ratesPer10g: string;
  canName: string;
  canDesc: string;
  snackName: string;
  snackDesc: string;
  paperName: string;
  paperDesc: string;

  // Calculator
  calcBadge: string;
  calcTitle: string;
  calcSelectTrash: string;
  calcEstWeight: string;
  calcPotentialCoins: string;
  calcNote: string;

  // Kiosk Page
  kioskTitle: string;
  kioskSubtitleConnected: string;
  kioskSubtitleGuest: string;
  stepDepositTitle: string;
  stepDepositLabelCategory: string;
  stepDepositSensorLabel: string;
  stepDepositPayoutLabel: string;
  stepDepositBtn: string;
  stepDepositProcessing: string;

  stepWithdrawTitle: string;
  stepWithdrawCoinsLabel: string;
  stepWithdrawEstRupiah: string;
  stepWithdrawRateNote: string;
  stepWithdrawEwalletLabel: string;
  stepWithdrawPhoneLabel: string;
  stepWithdrawBtn: string;
  stepWithdrawProcessing: string;

  withdrawErrLogin: string;
  withdrawErrAmount: string;
  withdrawErrInsufficient: string;
  withdrawErrPhone: string;

  // Receipts
  receiptDepositSuccess: string;
  receiptDepositDesc: string;
  receiptWithdrawSuccess: string;
  receiptWithdrawDesc: string;
  receiptId: string;
  receiptTime: string;
  receiptDepositor: string;
  receiptRecipient: string;
  receiptTrashType: string;
  receiptWeight: string;
  receiptEstRate: string;
  receiptEwallet: string;
  receiptPhone: string;
  receiptCoinsExchanged: string;
  receiptStatus: string;
  receiptStatusSuccess: string;
  receiptStatusWithdrawn: string;
  btnWeighAgain: string;
  btnRedeemCoins: string;
  btnBackHome: string;
  btnDone: string;

  // Footer
  footerText: string;
}

const dictionaries: Record<Language, Translations> = {
  id: {
    navHome: "Beranda",
    navCatalog: "Katalog Sampah",
    navKiosk: "Kios & Transaksi",
    navAbout: "Tentang Kami",
    navLogin: "Masuk",
    navRegister: "Daftar",
    navLogout: "Keluar Akun",
    navConnectedAccount: "Akun Terhubung",
    navWalletTitle: "Dompet RECOIN",
    navCoinBalance: "Saldo Koin:",
    navWithdrawAction: "Tukar Koin ke E-Wallet",
    navManageProfile: "Kelola Profil Akun",

    heroBadge: "Reverse Vending Machine Berbasis Koin Presisi",
    heroTitle1: "Timbang Sampahmu,",
    heroTitleHighlight: "Kumpulkan Koin, Cairkan E-Wallet",
    heroDesc:
      "Konversi sampah kaleng, kemasan makanan, dan kertas menjadi RECOIN secara presisi per 10 gram. Kumpulkan koinnya dan tukar langsung menjadi saldo GoPay, DANA, dan OVO.",
    btnDeposit: "Setor Sampah di Mesin",
    btnWithdraw: "Tukar Koin ke Saldo",

    statGlobalCoinsLabel: "Total Koin Didistribusikan ke Semua Pengguna",
    statGlobalGramsLabel: "Total Berat Sampah Terkumpul di Seluruh Mesin",
    walletBadge: "Dompet Akun:",
    walletCoinsLabel: "Saldo Koin Siap Ditarik",
    walletGramsLabel: "Total Sampah Disetor",
    walletWithdrawnLabel: "Total Saldo Sudah Dicairkan",

    ratesBadge: "3 Kategori Limbah Diterima",
    ratesTitle: "Nilai Perolehan RECOIN",
    ratesDesc:
      "Mesin mendeteksi jenis limbah dan menghitung koin secara presisi setiap 10 gram. Nilai tukar: 1 RECOIN = Rp 10.",
    ratesPer10g: "Koin per 10g",
    canName: "Kaleng Minuman (Aluminium)",
    canDesc: "Kaleng soda, teh, larutan, dan kopi aluminium bersih & kering.",
    snackName: "Kemasan Makanan / Plastik",
    snackDesc: "Bungkus biskuit, sachet camilan, dan kemasan multilayer kering.",
    paperName: "Kertas & Kardus (Paper)",
    paperDesc: "Kardus cokelat, kertas HVS bekas, majalah, dan karton bersih.",

    calcBadge: "Simulasi Timbangan",
    calcTitle: "Kalkulator Perolehan RECOIN",
    calcSelectTrash: "Pilih Sampah:",
    calcEstWeight: "Estimasi Berat Ditimbang",
    calcPotentialCoins: "Potensi Koin Yang Didapat",
    calcNote: "Koin akan otomatis tersimpan di dompet akunmu saat proses penimbangan selesai di menu Kios.",

    kioskTitle: "Kios Timbang & Penukaran Koin",
    kioskSubtitleConnected: "Akun Terhubung:",
    kioskSubtitleGuest: "Anda menyetor sebagai Tamu. Silakan login agar koin tersimpan di akun Anda.",
    stepDepositTitle: "Setor Sampah & Klaim Koin",
    stepDepositLabelCategory: "Pilih Jenis Sampah Masuk",
    stepDepositSensorLabel: "Berat Timbangan Sensor (Gram)",
    stepDepositPayoutLabel: "RECOIN Didapat:",
    stepDepositBtn: "SETOR & KLAIM KOIN SEKARANG",
    stepDepositProcessing: "Memproses Timbangan...",

    stepWithdrawTitle: "Tukar Koin & Cairkan Saldo E-Wallet",
    stepWithdrawCoinsLabel: "Jumlah Koin Mau Ditukar",
    stepWithdrawEstRupiah: "Estimasi Rupiah Didapat",
    stepWithdrawRateNote: "1 Koin = Rp10",
    stepWithdrawEwalletLabel: "Tujuan E-Wallet",
    stepWithdrawPhoneLabel: "Nomor HP Akun",
    stepWithdrawBtn: "TUKAR KOIN & CAIRKAN SEKARANG",
    stepWithdrawProcessing: "Memproses Transfer Saldo...",

    withdrawErrLogin: "Silakan login terlebih dahulu untuk menukarkan koin.",
    withdrawErrAmount: "Silakan masukkan jumlah koin yang ingin ditukarkan.",
    withdrawErrInsufficient: "Saldo koin tidak mencukupi.",
    withdrawErrPhone: "Nomor akun e-wallet wajib diisi.",

    receiptDepositSuccess: "Penyetoran Berhasil",
    receiptDepositDesc: "Koin berhasil ditambahkan ke dompet akun Anda",
    receiptWithdrawSuccess: "Pencairan Saldo Berhasil",
    receiptWithdrawDesc: "Saldo berhasil ditransfer ke e-wallet",
    receiptId: "ID Transaksi",
    receiptTime: "Waktu",
    receiptDepositor: "Penyetor",
    receiptRecipient: "Penerima Dana",
    receiptTrashType: "Jenis Sampah",
    receiptWeight: "Total Berat",
    receiptEstRate: "Estimasi Nilai Tukar",
    receiptEwallet: "E-Wallet Tujuan",
    receiptPhone: "Nomor HP Akun",
    receiptCoinsExchanged: "Koin Ditukarkan",
    receiptStatus: "Status Transaksi",
    receiptStatusSuccess: "Sukses Ditambahkan",
    receiptStatusWithdrawn: "Sukses Masuk",
    btnWeighAgain: "Timbang Lagi",
    btnRedeemCoins: "Tukar Koin",
    btnBackHome: "Kembali ke Beranda",
    btnDone: "Selesai",

    footerText: "© 2026 RECOIN Eco-Smart Vending Machine Platform.",
  },
  en: {
    navHome: "Home",
    navCatalog: "Waste Catalog",
    navKiosk: "Kiosk & Trade",
    navAbout: "About Us",
    navLogin: "Login",
    navRegister: "Register",
    navLogout: "Sign Out",
    navConnectedAccount: "Connected Account",
    navWalletTitle: "RECOIN Wallet",
    navCoinBalance: "Coin Balance:",
    navWithdrawAction: "Redeem Coins to E-Wallet",
    navManageProfile: "Manage Account Profile",

    heroBadge: "Precision Coin-Based Reverse Vending Machine",
    heroTitle1: "Weigh Your Recyclables,",
    heroTitleHighlight: "Earn Coins, Cash Out to E-Wallet",
    heroDesc:
      "Convert cans, food packaging, and paper into RECOIN with 10g precision. Accumulate coins and withdraw directly to GoPay, DANA, and OVO.",
    btnDeposit: "Deposit Waste at Machine",
    btnWithdraw: "Redeem Coins to Cash",

    statGlobalCoinsLabel: "Total Coins Distributed Across All Users",
    statGlobalGramsLabel: "Total Recycled Waste Collected Across All Machines",
    walletBadge: "Account Wallet:",
    walletCoinsLabel: "Available Coins to Withdraw",
    walletGramsLabel: "Total Waste Deposited",
    walletWithdrawnLabel: "Total Balance Cashed Out",

    ratesBadge: "3 Accepted Waste Categories",
    ratesTitle: "RECOIN Earnings Value",
    ratesDesc:
      "The kiosk verifies material composition and measures coins per 10 grams. Exchange rate: 1 RECOIN = Rp 10.",
    ratesPer10g: "Coins per 10g",
    canName: "Beverage Cans (Aluminium)",
    canDesc: "Clean & dry aluminium cans of soda, tea, coffee, and drinks.",
    snackName: "Food Packaging / Plastic",
    snackDesc: "Dry biscuit wrappers, snack sachets, and multilayer packaging.",
    paperName: "Paper & Cardboard (Paper)",
    paperDesc: "Brown corrugated boxes, scrap copy paper, books, and cartons.",

    calcBadge: "Scale Simulator",
    calcTitle: "RECOIN Earnings Calculator",
    calcSelectTrash: "Select Material:",
    calcEstWeight: "Estimated Scale Weight",
    calcPotentialCoins: "Potential Coins Earned",
    calcNote: "Coins are credited instantly to your account wallet once verified at the Kiosk.",

    kioskTitle: "Weighing & Coin Exchange Kiosk",
    kioskSubtitleConnected: "Connected Account:",
    kioskSubtitleGuest: "Operating as Guest. Sign in to credit coins directly to your wallet.",
    stepDepositTitle: "Deposit Recyclables & Claim Coins",
    stepDepositLabelCategory: "Select Waste Category",
    stepDepositSensorLabel: "Precision Scale Sensor (Grams)",
    stepDepositPayoutLabel: "RECOIN Earned:",
    stepDepositBtn: "DEPOSIT & CLAIM RECOIN NOW",
    stepDepositProcessing: "Measuring & Verifying Material...",

    stepWithdrawTitle: "Redeem Coins & Cash Out to E-Wallet",
    stepWithdrawCoinsLabel: "Coins to Redeem",
    stepWithdrawEstRupiah: "Estimated Cash Payout",
    stepWithdrawRateNote: "1 Coin = Rp10",
    stepWithdrawEwalletLabel: "Destination E-Wallet",
    stepWithdrawPhoneLabel: "Account Mobile Number",
    stepWithdrawBtn: "REDEEM COINS & WITHDRAW NOW",
    stepWithdrawProcessing: "Transferring Balance to E-Wallet...",

    withdrawErrLogin: "Please log in first to redeem your coins.",
    withdrawErrAmount: "Please enter a valid coin amount to redeem.",
    withdrawErrInsufficient: "Insufficient coin balance in your wallet.",
    withdrawErrPhone: "Mobile account number is required.",

    receiptDepositSuccess: "Deposit Completed",
    receiptDepositDesc: "Coins successfully added to your wallet account",
    receiptWithdrawSuccess: "Withdrawal Completed",
    receiptWithdrawDesc: "Funds transferred successfully to e-wallet",
    receiptId: "Transaction ID",
    receiptTime: "Timestamp",
    receiptDepositor: "Depositor",
    receiptRecipient: "Recipient",
    receiptTrashType: "Waste Type",
    receiptWeight: "Total Weight",
    receiptEstRate: "Estimated Cash Value",
    receiptEwallet: "Target E-Wallet",
    receiptPhone: "Account Mobile",
    receiptCoinsExchanged: "Coins Redeemed",
    receiptStatus: "Transaction Status",
    receiptStatusSuccess: "Successfully Credited",
    receiptStatusWithdrawn: "Successfully Dispatched",
    btnWeighAgain: "Weigh Again",
    btnRedeemCoins: "Redeem Coins",
    btnBackHome: "Back to Home",
    btnDone: "Finished",

    footerText: "© 2026 RECOIN Eco-Smart Vending Machine Platform.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "id",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: dictionaries.id,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("recoin_lang") as Language;
    if (saved === "id" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("recoin_lang", lang);
    window.dispatchEvent(new Event("recoin_lang_changed"));
  };

  const toggleLanguage = () => {
    const nextLang = language === "id" ? "en" : "id";
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: dictionaries[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}