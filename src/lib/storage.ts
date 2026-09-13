export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  ewalletType: string;
  totalEarnedRupiah: number;
  totalGrams: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface TrashType {
  id: string;
  name: string;
  icon: string;
  ratePer10Gram: number;
  description: string;
}

export interface VendingTransaction {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  trashType: string;
  weightGram: number;
  payoutRupiah: number;
  ewalletType: string;
  phone: string;
  createdAt: string;
}

export const TRASH_TYPES: TrashType[] = [
  {
    id: "can",
    name: "Kaleng Aluminium",
    icon: "🥫",
    ratePer10Gram: 50,
    description: "Kaleng soda, larutan, atau kopi aluminium bersih.",
  },
  {
    id: "snack",
    name: "Kemasan Makanan / Snack",
    icon: "🥨",
    ratePer10Gram: 20,
    description: "Bungkus biskuit atau mie berbahan plastik multilayer.",
  },
];

const USERS_KEY = "recoin_users";
const ACTIVE_USER_KEY = "recoin_active_user";
const TRANSACTIONS_KEY = "recoin_transactions";

export function getStoredUsers(): UserAccount[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Bersihkan data rusak yang tidak punya email
    return parsed.filter((u) => u && typeof u.email === "string");
  } catch {
    return [];
  }
}

export function getActiveUser(): UserAccount | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ACTIVE_USER_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    if (!user || typeof user !== "object") return null;
    return {
      ...user,
      totalEarnedRupiah: user.totalEarnedRupiah ?? 0,
      totalGrams: user.totalGrams ?? 0,
    };
  } catch {
    return null;
  }
}

export function saveUser(newUser: UserAccount): void {
  const preparedUser: UserAccount = {
    ...newUser,
    totalEarnedRupiah: newUser.totalEarnedRupiah ?? 0,
    totalGrams: newUser.totalGrams ?? 0,
  };

  const users = getStoredUsers();
  users.push(preparedUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(preparedUser));
}

// Mendukung pemanggilan baik objek akun utuh maupun argumen terpisah
export function registerUser(
  userOrName: UserAccount | string,
  email?: string,
  password?: string,
  phone?: string,
  ewalletType?: string
): { success: boolean; message: string; user?: UserAccount } {
  if (typeof window === "undefined") {
    return { success: false, message: "Window tidak tersedia." };
  }

  let newUser: UserAccount;

  if (typeof userOrName === "object" && userOrName !== null) {
    newUser = {
      ...userOrName,
      email: (userOrName.email || "").trim(),
      totalEarnedRupiah: userOrName.totalEarnedRupiah ?? 0,
      totalGrams: userOrName.totalGrams ?? 0,
    };
  } else {
    newUser = {
      id: "REC-" + Date.now().toString(36).toUpperCase(),
      fullName: String(userOrName || ""),
      email: (email || "").trim(),
      password: password || "",
      phone: phone || "",
      ewalletType: ewalletType || "GoPay",
      totalEarnedRupiah: 0,
      totalGrams: 0,
      createdAt: new Date().toLocaleDateString("id-ID"),
    };
  }

  if (!newUser.email) {
    return { success: false, message: "Email wajib diisi!" };
  }

  const users = getStoredUsers();
  const targetEmail = newUser.email.toLowerCase();

  const exists = users.some(
    (u) => u && typeof u.email === "string" && u.email.toLowerCase().trim() === targetEmail
  );

  if (exists) {
    return { success: false, message: "Email sudah terdaftar!" };
  }

  saveUser(newUser);
  return { success: true, message: "Pendaftaran berhasil!", user: newUser };
}

export function loginUser(
  email: string,
  password?: string
): { success: boolean; message: string; user?: UserAccount } {
  if (typeof window === "undefined") {
    return { success: false, message: "Window tidak tersedia." };
  }

  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, message: "Silakan masukkan email Anda!" };
  }

  const users = getStoredUsers();
  const found = users.find(
    (u) =>
      u &&
      typeof u.email === "string" &&
      u.email.trim().toLowerCase() === cleanEmail &&
      (!password || u.password === password)
  );

  if (found) {
    const normalizedUser = {
      ...found,
      totalEarnedRupiah: found.totalEarnedRupiah ?? 0,
      totalGrams: found.totalGrams ?? 0,
    };
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(normalizedUser));
    return { success: true, message: "Login berhasil!", user: normalizedUser };
  }

  return { success: false, message: "Email atau password salah!" };
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function updateUserProfile(updatedData: Partial<UserAccount>): UserAccount | null {
  const active = getActiveUser();
  if (!active) return null;

  const users = getStoredUsers();
  const index = users.findIndex(
    (u) =>
      u &&
      ((active.id && u.id === active.id) ||
        (active.email && u.email?.toLowerCase() === active.email.toLowerCase()))
  );

  const newAccountData: UserAccount = {
    ...active,
    ...updatedData,
    totalEarnedRupiah: updatedData.totalEarnedRupiah ?? active.totalEarnedRupiah ?? 0,
    totalGrams: updatedData.totalGrams ?? active.totalGrams ?? 0,
  };

  if (index !== -1) {
    users[index] = newAccountData;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newAccountData));
  return newAccountData;
}

export function getStoredTransactions(): VendingTransaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TRANSACTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveVendingTransaction(tx: VendingTransaction): void {
  const list = getStoredTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  const active = getActiveUser();
  if (active && (tx.userId === active.id || tx.userEmail === active.email)) {
    const updated = {
      ...active,
      totalEarnedRupiah: (active.totalEarnedRupiah || 0) + tx.payoutRupiah,
      totalGrams: (active.totalGrams || 0) + tx.weightGram,
    };
    updateUserProfile(updated);
  }
}

export const saveTransaction = saveVendingTransaction;