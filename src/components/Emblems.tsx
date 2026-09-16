interface EmblemProps {
  className?: string;
  size?: number;
}

// 1. EMBLEM KALENG ALUMINIUM (CAN)
export function CanEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" strokeDasharray="2 2" />
      <path d="M10 8h4" />
    </svg>
  );
}

// 2. EMBLEM KEMASAN PLASTIK / SNACK (POUCH PACKAGING)
export function SnackEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 3h12l-1.5 18H7.5L6 3z" />
      <path d="M6 7h12" />
      <path d="M9 13a3 3 0 0 0 6 0" />
      <path d="M10 3v2" />
      <path d="M14 3v2" />
    </svg>
  );
}

// 3. EMBLEM KERTAS & KARDUS (BOX / PAPER)
export function PaperEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

// 4. EMBLEM TIMBANGAN SENSOR (SCALE)
export function ScaleEmblem({ className = "", size = 24 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  );
}

// 5. EMBLEM RECOIN (COIN)
export function CoinEmblem({ className = "", size = 24 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
      <path d="M12 5v2" />
      <path d="M12 17v2" />
    </svg>
  );
}

// 6. EMBLEM CAIRKAN SALDO (PAYOUT / WALLET)
export function WalletPayoutEmblem({ className = "", size = 24 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-8 5H6a2 2 0 0 1-2-2V7" />
      <circle cx="18" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}