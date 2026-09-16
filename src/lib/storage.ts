export interface TrashType {
  id: string;
  name: string;
  icon: string;
  ratePer10GramCoins: number;
  description: string;
}

export const COIN_TO_RUPIAH_RATE = 10; // 1 RECOIN = Rp 10

export const TRASH_TYPES: TrashType[] = [
  {
    id: "can",
    name: "Kaleng Minuman (Aluminium)",
    icon: "🥫",
    ratePer10GramCoins: 5,
    description: "Kaleng soda, teh, larutan, dan kopi aluminium bersih & kering.",
  },
  {
    id: "snack",
    name: "Kemasan Makanan / Plastik",
    icon: "🥨",
    ratePer10GramCoins: 2,
    description: "Bungkus biskuit, sachet camilan, dan kemasan multilayer kering.",
  },
  {
    id: "paper",
    name: "Kertas & Kardus (Paper)",
    icon: "📦",
    ratePer10GramCoins: 3,
    description: "Kardus cokelat, kertas HVS bekas, majalah, dan karton bersih.",
  },
];

export interface VendingTransaction {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  trashType: string;
  weightGram: number;
  earnedCoins: number;
  createdAt: string;
}

export interface RedeemTransaction {
  id: string;
  userId: string;
  userName: string;
  coinsExchanged: number;
  rupiahReceived: number;
  ewalletType: string;
  phone: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  ewalletType: string;
  coinBalance: number;
  totalCoinsEarned: number;
  totalRupiahWithdrawn: number;
  totalGrams: number;
  avatarUrl?: string;
  createdAt: string;
}

const STORAGE_KEY_USERS = "recoin_users_v3";
const STORAGE_KEY_ACTIVE_USER = "recoin_active_user_v3";
const STORAGE_KEY_TRANSACTIONS = "recoin_txs_v3";
const STORAGE_KEY_REDEEMS = "recoin_redeems_v3";

function broadcastUserChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("recoin_user_updated"));
  }
}

export function getStoredUsers(): UserAccount[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_USERS);
  if (!raw) {
    const defaultUser: UserAccount = {
      id: "REC-USER-01",
      fullName: "Ruud Zaki Bramdani",
      email: "ruud@recoin.id",
      password: "password123",
      phone: "081234567890",
      ewalletType: "GoPay",
      coinBalance: 2500,
      totalCoinsEarned: 2500,
      totalRupiahWithdrawn: 0,
      totalGrams: 5000,
      createdAt: "16 September 2026",
    };
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([defaultUser]));
    return [defaultUser];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ✅ DIPERBAIKI: Jika data kosong (karena logout), kembalikan null (JANGAN auto-login lagi)
export function getActiveUser(): UserAccount | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveUser(user: UserAccount | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
  } else {
    localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
  }
  broadcastUserChange();
}

export function registerUser(newUser: UserAccount): { success: boolean; message: string } {
  const users = getStoredUsers();
  if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
    return { success: false, message: "Email sudah terdaftar. Gunakan email lain." };
  }
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  setActiveUser(newUser);
  return { success: true, message: "Pendaftaran berhasil!" };
}

export function loginUser(email: string, pass: string): { success: boolean; message: string } {
  const users = getStoredUsers();
  const matched = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
  );
  if (!matched) {
    return { success: false, message: "Email atau kata sandi tidak cocok." };
  }
  setActiveUser(matched);
  return { success: true, message: "Login berhasil!" };
}

// ✅ DIPERBAIKI: Hapus total data active user saat logout ditekan
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
  }
  broadcastUserChange();
}

export function updateUserProfile(data: Partial<UserAccount>): UserAccount | null {
  const current = getActiveUser();
  if (!current) return null;

  const updated: UserAccount = { ...current, ...data };
  setActiveUser(updated);

  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === current.id);
  if (idx !== -1) {
    users[idx] = updated;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }
  broadcastUserChange();
  return updated;
}

export function getStoredTransactions(): VendingTransaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveVendingTransaction(tx: VendingTransaction) {
  const all = getStoredTransactions();
  all.unshift(tx);
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(all));

  const current = getActiveUser();
  if (current) {
    updateUserProfile({
      coinBalance: (current.coinBalance || 0) + tx.earnedCoins,
      totalCoinsEarned: (current.totalCoinsEarned || 0) + tx.earnedCoins,
      totalGrams: (current.totalGrams || 0) + tx.weightGram,
    });
  }
}

export function getStoredRedeems(): RedeemTransaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_REDEEMS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function redeemCoinsToEwallet(
  coinsToRedeem: number,
  ewallet: string,
  phoneNumber: string
): { success: boolean; message: string; data?: RedeemTransaction } {
  const current = getActiveUser();
  if (!current) {
    return { success: false, message: "Harap login terlebih dahulu untuk menukarkan koin." };
  }

  if (coinsToRedeem <= 0 || (current.coinBalance || 0) < coinsToRedeem) {
    return { success: false, message: "Saldo RECOIN Anda tidak mencukupi untuk penukaran ini." };
  }

  const rupiahObtained = coinsToRedeem * COIN_TO_RUPIAH_RATE;

  updateUserProfile({
    coinBalance: current.coinBalance - coinsToRedeem,
    totalRupiahWithdrawn: (current.totalRupiahWithdrawn || 0) + rupiahObtained,
  });

  const now = new Date();
  const formattedDate = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime =
    now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB";

  const redeemTx: RedeemTransaction = {
    id: "WD-" + Date.now().toString(36).toUpperCase(),
    userId: current.id,
    userName: current.fullName,
    coinsExchanged: coinsToRedeem,
    rupiahReceived: rupiahObtained,
    ewalletType: ewallet,
    phone: phoneNumber,
    createdAt: `${formattedDate} • ${formattedTime}`,
  };

  const redeems = getStoredRedeems();
  redeems.unshift(redeemTx);
  localStorage.setItem(STORAGE_KEY_REDEEMS, JSON.stringify(redeems));

  return {
    success: true,
    message: `Penarikan berhasil! Rp${rupiahObtained.toLocaleString("id-ID")} telah dikirim ke ${ewallet}.`,
    data: redeemTx,
  };
}