export interface TrashType {
  id: string;
  name: string;
  ratePer10Gram: number;
  icon: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  ewalletType: "GoPay" | "DANA" | "OVO";
  totalEarnedRupiah: number;
  totalGrams: number;
  createdAt: string;
}

export interface VendingTransaction {
  id: string;
  userId: string;
  userEmail: string;
  ewalletType: "GoPay" | "DANA" | "OVO";
  phoneNumber: string;
  trashType: string;
  weightGram: number;
  payoutRupiah: number;
  createdAt: string;
}

export const TRASH_TYPES: TrashType[] = [
  { id: "can", name: "Kaleng Minuman", ratePer10Gram: 50, icon: "🥫" },
  { id: "packaging", name: "Kemasan Makanan / Snack", ratePer10Gram: 20, icon: "🥨" },
];

export const getStoredUsers = (): UserAccount[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("recoin_accounts");
  return data ? JSON.parse(data) : [];
};

export const getActiveUser = (): UserAccount | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("recoin_active_session");
  return data ? JSON.parse(data) : null;
};

export const setActiveUser = (user: UserAccount | null) => {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem("recoin_active_session");
  } else {
    localStorage.setItem("recoin_active_session", JSON.stringify(user));
  }
};

export const registerUser = (
  fullName: string,
  email: string,
  password: string,
  phone: string,
  ewalletType: "GoPay" | "DANA" | "OVO"
): { success: boolean; message: string; user?: UserAccount } => {
  const users = getStoredUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return { success: false, message: "Email sudah terdaftar! Silakan login." };
  }

  const newUser: UserAccount = {
    id: "USR-" + Date.now(),
    fullName,
    email: email.toLowerCase(),
    password,
    phone,
    ewalletType,
    totalEarnedRupiah: 0,
    totalGrams: 0,
    createdAt: new Date().toLocaleDateString("id-ID"),
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem("recoin_accounts", JSON.stringify(updatedUsers));
  setActiveUser(newUser);

  return { success: true, message: "Pendaftaran berhasil!", user: newUser };
};

export const loginUser = (
  email: string,
  password: string
): { success: boolean; message: string; user?: UserAccount } => {
  const users = getStoredUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: "Email atau password salah!" };
  }

  setActiveUser(user);
  return { success: true, message: "Login berhasil!", user };
};

export const logoutUser = () => {
  setActiveUser(null);
};

export const getStoredTransactions = (): VendingTransaction[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("recoin_vending_tx");
  return data ? JSON.parse(data) : [];
};

export const saveVendingTransaction = (
  trashTypeName: string,
  weightGram: number,
  payoutRupiah: number
): VendingTransaction | null => {
  const active = getActiveUser();
  if (!active) return null;

  const txList = getStoredTransactions();
  const newTx: VendingTransaction = {
    id: "RC-" + Math.floor(100000 + Math.random() * 900000),
    userId: active.id,
    userEmail: active.email,
    ewalletType: active.ewalletType,
    phoneNumber: active.phone,
    trashType: trashTypeName,
    weightGram: Math.round(weightGram),
    payoutRupiah: Math.round(payoutRupiah),
    createdAt: new Date().toLocaleString("id-ID"),
  };

  // Perbarui saldo akun aktif & database user lokal
  const updatedUser: UserAccount = {
    ...active,
    totalEarnedRupiah: active.totalEarnedRupiah + newTx.payoutRupiah,
    totalGrams: active.totalGrams + newTx.weightGram,
  };

  const allUsers = getStoredUsers().map((u) => (u.id === active.id ? updatedUser : u));

  localStorage.setItem("recoin_accounts", JSON.stringify(allUsers));
  setActiveUser(updatedUser);
  localStorage.setItem("recoin_vending_tx", JSON.stringify([newTx, ...txList]));

  return newTx;
};