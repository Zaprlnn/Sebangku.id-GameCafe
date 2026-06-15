import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "../lib/supabase"; // Sesuaikan lokasi inisialisasi client Supabase Anda

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
  role: "Owner" | "Kasir" | "Customer"; 
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
  loading: boolean; // Flag loading untuk memastikan status auth beres diperiksa
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  gmSheetOpen: boolean;
  openGMSheet: () => void;
  closeGMSheet: () => void;
}

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // ── Fungsi Pengambil Data Profil dari Database ─────────────────────────────
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setUser({
          id: userId,
          name: data.name || "User Sebangku",
          username: data.username || "sebangku_player",
          email: email,
          avatarSrc: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username || userId}`,
          poin: data.poin || 0,
          level: data.role === "Customer" ? "Silver" : data.role,
          levelColor: data.role === "Owner" ? "#EF4444" : data.role === "Kasir" ? "#10B981" : "#94A3B8",
          memberSince: data.created_at 
            ? new Date(data.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
            : "Baru",
          role: data.role,
        });
      }
    } catch (err) {
      console.error("Gagal memuat profil pengguna:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Sinkronisasi Status Auth Nyata dengan Supabase ──────────────────────────
  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }

    // Ambil sesi aktif pertama kali aplikasi di-mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || "");
      } else {
        setLoading(false);
      }
    });

    // Pasang Listener Perubahan Auth secara Real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isGuest]);

  // ── Simulasi Notifikasi Pembuka Real-time ──────────────────────────────────
  useEffect(() => {
    if (isGuest) return;
    const timer = setTimeout(() => {
      addNotification({
        type: "system",
        title: "Selamat Datang di Sebangku! 🎲",
        body: "Yuk cek koleksi game baru kami minggu ini atau kumpulkan poin transaksi!",
        icon: "🎲",
      });
    }, 5000);
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
        loading,
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

export function useGMSheet() {
  const { gmSheetOpen, openGMSheet, closeGMSheet } = useAppContext();
  return { gmSheetOpen, openGMSheet, closeGMSheet };
}