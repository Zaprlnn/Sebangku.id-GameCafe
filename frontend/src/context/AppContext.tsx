import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarSrc: string;
  poin: number;
  level: string;
  levelColor: string;
  memberSince: string;
}

export interface Notification {
  id: string;
  type: "order" | "loyalty" | "promo" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  icon: string;
}

export interface AppState {
  tableId: string;
  isGuest: boolean;
  user: UserProfile | null;
  notifications: Notification[];
  unreadCount: number;
  sessionStart: Date;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  // GM Sheet global state
  gmSheetOpen: boolean;
  openGMSheet: () => void;
  closeGMSheet: () => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER: UserProfile = {
  id: "usr_001",
  name: "Budi Santoso",
  username: "budi_gamer",
  email: "budi@email.com",
  avatarSrc: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23F55F1F' rx='8'/><rect x='3' y='3' width='26' height='26' rx='6' fill='%23FF8A50'/><circle cx='16' cy='13' r='5' fill='%23fff'/><ellipse cx='16' cy='26' rx='9' ry='6' fill='%23fff'/></svg>`,
  poin: 1_250,
  level: "Silver",
  levelColor: "#94A3B8",
  memberSince: "Jan 2025",
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "Pesanan Sedang Disiapkan",
    body: "Catan + 2 Kopi Susu sedang dalam proses",
    read: false,
    createdAt: new Date(Date.now() - 3 * 60_000),
    icon: "☕",
  },
  {
    id: "n2",
    type: "loyalty",
    title: "+50 Poin Didapat!",
    body: "Pesanan terakhirmu memberikan 50 poin",
    read: false,
    createdAt: new Date(Date.now() - 12 * 60_000),
    icon: "⭐",
  },
  {
    id: "n3",
    type: "promo",
    title: "Promo Malam Ini 🎉",
    body: "Buy 2 board games, get snack gratis sampai pukul 22.00",
    read: true,
    createdAt: new Date(Date.now() - 60 * 60_000),
    icon: "🎁",
  },
  {
    id: "n4",
    type: "system",
    title: "Selamat Datang di Sebangku!",
    body: "Jangan lupa cek game baru koleksi kami minggu ini",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60_000),
    icon: "🎲",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppState | null>(null);

export function AppProvider({
  children,
  tableId,
  isGuest,
}: {
  children: ReactNode;
  tableId: string;
  isGuest: boolean;
}) {
  const [user] = useState<UserProfile | null>(isGuest ? null : MOCK_USER);
  const [notifications, setNotifications] = useState<Notification[]>(
    isGuest ? [] : MOCK_NOTIFICATIONS
  );
  const [sessionStart] = useState(new Date());
  const [gmSheetOpen, setGmSheetOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "createdAt" | "read">) => {
      setNotifications((prev) => [
        { ...n, id: `n_${Date.now()}`, createdAt: new Date(), read: false },
        ...prev,
      ]);
    },
    []
  );

  const openGMSheet = useCallback(() => setGmSheetOpen(true), []);
  const closeGMSheet = useCallback(() => setGmSheetOpen(false), []);

  // ── Simulate real-time Supabase notification (mock)
  // In production: replace with Supabase realtime channel subscription
  // e.g. supabase.channel('notifications').on('INSERT', ...).subscribe()
  useEffect(() => {
    if (isGuest) return;
    const timer = setTimeout(() => {
      addNotification({
        type: "order",
        title: "Pesanan Siap! 🍽️",
        body: "Pesananmu sudah siap di meja. Selamat menikmati!",
        icon: "🍽️",
      });
    }, 18_000);
    return () => clearTimeout(timer);
  }, [isGuest, addNotification]);

  return (
    <AppContext.Provider
      value={{
        tableId,
        isGuest,
        user,
        notifications,
        unreadCount,
        sessionStart,
        markRead,
        markAllRead,
        addNotification,
        gmSheetOpen,
        openGMSheet,
        closeGMSheet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

// ─── Convenience hook for GM sheet ────────────────────────────────────────────
export function useGMSheet() {
  const { gmSheetOpen, openGMSheet, closeGMSheet } = useAppContext();
  return { gmSheetOpen, openGMSheet, closeGMSheet };
}
