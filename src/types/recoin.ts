export interface TrashType {
  id: string;
  name: string;
  ratePerKg: number; // Koin per kg
  icon: string;
}

export interface Transaction {
  id: string;
  userName: string;
  trashType: string;
  weightKg: number;
  earnedCoin: number;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  nim: string;
  prodi: string;
  balanceCoin: number;
  totalWeightKg: number;
}