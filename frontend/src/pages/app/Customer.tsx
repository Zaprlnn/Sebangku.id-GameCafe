import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Gamepad2, Calendar, Receipt, BarChart2, LogOut,
  Bell, Search, Menu, X, Edit2, Flame, Trophy, Target, Zap,
  ChevronRight, Phone, Mail, Check, Save, Undo2, Clock, Users, Package, CreditCard,
  FileText, ChevronDown, Utensils, Compass, Award, Star, Moon, Shield, Gem, Brain, Dices,
  ShoppingBag, Plus, Minus, Camera, CheckCircle, Send, Printer, PlayCircle, Trash2, AlertTriangle
} from "lucide-react";
import { BOARDGAMES_SEED } from "../../data/boardgames_seed";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";
import { supabase } from "../../lib/supabase";

// Import Board Game Images
import mystKidsImg from "../../assets/images/Mysterium Kids.png";
import luckyCapImg from "../../assets/images/Lucky Captain.png";
import krakenAttImg from "../../assets/images/Kraken Attack.png";
import sleepyCasImg from "../../assets/images/Sleepy Castle.png";
import detCharImg from "../../assets/images/Detective Charlie.png";
import rubenRalImg from "../../assets/images/Ruben Rallye.png";
import waroongWarsImg from "../../assets/images/Waroong Wars.png";
import foldItImg from "../../assets/images/Fold it.png";
import slideQuestImg from "../../assets/images/Slide Quest.png";
import goldOrinImg from "../../assets/images/Gold Am Orinoko.png";
import fourRowImg from "../../assets/images/4 in a Row On The Go.png";
import magicMazeImg from "../../assets/images/Magic Maze.png";

// ─── Mock User Data ──────────────────────────────────────────────────────────  
const DEFAULT_USER = {
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  memberSince: "",
  level: 1,
  levelLabel: "New Player",
  kunjungan: 0,
  waktuJam: 0,
  winRate: 0,
  streakHari: 0,
  totalMenang: 0,
  gameDicoba: 0,
  achievement: "0/12",
  status: "Active",
  gameFavorit: "",
  totalBelanjaFNB: 0,
  totalTransaksi: 0,
  rataRataKunjungan: 0,
  favGames: [] as { rank: number, name: string, image: string }[],
};

// ─── Products & Games Data (synced from Owner via localStorage) ──────────────
const PRODUCTS_FALLBACK = [
  { id: "p1", name: "Mie Goreng Special", price: 25000, category: "Food", emoji: "🍜", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&fit=crop&q=80" },
  { id: "p2", name: "Nasi Goreng", price: 22000, category: "Food", emoji: "🍛", image: "https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?w=200&fit=crop&q=80" },
  { id: "p3", name: "Kentang Goreng", price: 18000, category: "Snacks", emoji: "🍟", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&fit=crop&q=80" },
  { id: "p4", name: "Kopi Hitam", price: 12000, category: "Drinks", emoji: "☕", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&fit=crop&q=80" },
  { id: "p5", name: "Es Teh Manis", price: 8000, category: "Drinks", emoji: "🍹", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=200&fit=crop&q=80" },
  { id: "p6", name: "Es Kopi Susu", price: 20000, category: "Drinks", emoji: "🥛", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&fit=crop&q=80" },
  { id: "p7", name: "Snack Mix", price: 15000, category: "Snacks", emoji: "🍿", image: "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?w=200&fit=crop&q=80" },
  { id: "p8", name: "Pisang Goreng", price: 14000, category: "Snacks", emoji: "🍌", image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=200&fit=crop&q=80" },
  { id: "p9", name: "Sandwich Tuna", price: 28000, category: "Food", emoji: "🥪", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&fit=crop&q=80" },
];

const RENT_GAMES_FALLBACK = [
  { id: "g1", name: "Mysterium Kids", price: 15000, category: "Cooperative", emoji: "🎲", image: mystKidsImg, description: "Bekerjasama untuk menemukan harta karun dengan mendengarkan suara misterius.", tutorialLink: "https://www.youtube.com/watch?v=F6K2k4Fm4aY" },
  { id: "g2", name: "Lucky Captain", price: 12000, category: "Strategy", emoji: "🚂", image: luckyCapImg, description: "Game strategi ringan tentang mengelola kapal dan kru bajak laut.", tutorialLink: "https://www.youtube.com/results?search_query=how+to+play+lucky+captain+board+game" },
  { id: "g3", name: "Kraken Attack", price: 12000, category: "Strategy", emoji: "🦠", image: krakenAttImg, description: "Lindungi kapalmu dari serangan Kraken! Game kooperatif yang seru.", tutorialLink: "https://www.youtube.com/watch?v=D-nU587JdYQ" },
  { id: "g4", name: "Sleepy Castle", price: 10000, category: "Strategy", emoji: "🏠", image: sleepyCasImg, description: "Bangun kastil sebelum naga terbangun.", tutorialLink: "https://www.youtube.com/results?search_query=how+to+play+sleepy+castle+game" },
  { id: "g5", name: "Detective Charlie", price: 8000, category: "Strategy", emoji: "👑", image: detCharImg, description: "Bantu Detektif Charlie memecahkan misteri di pulau liburan.", tutorialLink: "https://www.youtube.com/watch?v=9g0H290L2yE" },
  { id: "g6", name: "Ruben Rallye", price: 8000, category: "Family", emoji: "🕵️", image: rubenRalImg, description: "Balapan seru dengan karakter-karakter unik.", tutorialLink: "https://www.youtube.com/results?search_query=how+to+play+ruben+rallye" },
  { id: "g7", name: "Waroong Wars", price: 15000, category: "Strategy", emoji: "🐦", image: waroongWarsImg, description: "Jadilah pedagang warung terbaik dan kumpulkan menu-menu tradisional.", tutorialLink: "https://www.youtube.com/watch?v=rFvQ_R4m_wU" },
  { id: "g8", name: "Fold it", price: 10000, category: "Party", emoji: "🌲", image: foldItImg, description: "Lipat sapu tangan ajaib secepat mungkin sesuai dengan resep yang dipesan.", tutorialLink: "https://www.youtube.com/watch?v=Ff6_h_w23Hw" },
  { id: "g9", name: "Slide Quest", price: 10000, category: "Party", emoji: "🛡️", image: slideQuestImg, description: "Bekerjasama menggerakkan papan untuk memandu kesatria ke akhir level.", tutorialLink: "https://www.youtube.com/watch?v=2e6i0mQ18r0" },
  { id: "g10", name: "Gold Am Orinoko", price: 12000, category: "Strategy", emoji: "🥇", image: goldOrinImg, description: "Jelajahi sungai Orinoko dan kumpulkan emas sebanyak-banyaknya.", tutorialLink: "https://www.youtube.com/results?search_query=how+to+play+gold+am+orinoko" },
  { id: "g11", name: "4 in a Row On The Go", price: 5000, category: "Family", emoji: "🔘", image: fourRowImg, description: "Game klasik menyusun 4 keping sebaris secara vertikal, horizontal, atau diagonal.", tutorialLink: "https://www.youtube.com/watch?v=yDWPi1pZ0Po" },
  { id: "g12", name: "Magic Maze", price: 12000, category: "Strategy", emoji: "🧙", image: magicMazeImg, description: "Curi barang dari mall ajaib tanpa berbicara satu sama lain. Sangat intens!", tutorialLink: "https://www.youtube.com/watch?v=M6XJ2D-FpBM" },
];

// ─── Nav Config ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profil", label: "Profil Saya", Icon: User, path: "profil" },
  { id: "pesan", label: "Pesan & Bayar", Icon: ShoppingBag, path: "pesan" },
  { id: "pesanan", label: "Pesanan Saya", Icon: Package, path: "pesanan" },
  { id: "history", label: "History Game", Icon: Gamepad2, path: "history" },
  { id: "kunjungan", label: "History Kunjungan", Icon: Calendar, path: "kunjungan" },
  { id: "transaksi", label: "Riwayat Transaksi", Icon: Receipt, path: "transaksi" },
  { id: "statistik", label: "Statistik Bermain", Icon: BarChart2, path: "statistik" },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function todayLabel() {
  return new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return "-";
  // Convert YYYY-MM-DD to DD-MM-YYYY
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

// ─── Avatar Component ────────────────────────────────────────────────────────
interface AvatarCircleProps {
  name: string;
  size?: number;
  fontSize?: number;
}

function AvatarCircle({ name, size = 48, fontSize = 18 }: AvatarCircleProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white shrink-0 select-none shadow-sm"
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
      }}
    >
      <User size={size * 0.45} strokeWidth={1.8} />
    </div>
  );
}

// ─── Toast Notification System ───────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", title?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: number) => void }) {
  const toastConfig: Record<ToastType, { bg: string; border: string; icon: React.ReactNode; titleColor: string }> = {
    success: {
      bg: "linear-gradient(135deg, #ECFDF5, #F0FDF4)",
      border: "#86EFAC",
      titleColor: "#15803D",
      icon: <CheckCircle size={20} className="text-emerald-500 shrink-0" strokeWidth={2} />,
    },
    error: {
      bg: "linear-gradient(135deg, #FEF2F2, #FFF1F1)",
      border: "#FCA5A5",
      titleColor: "#DC2626",
      icon: <AlertTriangle size={20} className="text-red-500 shrink-0" strokeWidth={2} />,
    },
    warning: {
      bg: "linear-gradient(135deg, #FFFBEB, #FEFCE8)",
      border: "#FCD34D",
      titleColor: "#B45309",
      icon: <AlertTriangle size={20} className="text-amber-500 shrink-0" strokeWidth={2} />,
    },
    info: {
      bg: "linear-gradient(135deg, #EFF6FF, #F0F9FF)",
      border: "#93C5FD",
      titleColor: "#1D4ED8",
      icon: <Bell size={20} className="text-blue-500 shrink-0" strokeWidth={2} />,
    },
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none" style={{ maxWidth: 360 }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const cfg = toastConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border"
              style={{
                background: cfg.bg,
                borderColor: cfg.border,
                borderWidth: 1,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div className="mt-0.5">{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-xs font-black mb-0.5" style={{ color: cfg.titleColor, fontFamily: "'Poppins', sans-serif" }}>
                    {toast.title}
                  </p>
                )}
                <p className="text-xs text-[#334155] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer mt-0.5 shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

// ── Profil Page ──
interface ProfilPageProps {
  userData: typeof DEFAULT_USER;
  setUserData: React.Dispatch<React.SetStateAction<typeof DEFAULT_USER>>;
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

function ProfilPage({ userData, setUserData, showToast }: ProfilPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    birthDate: userData.birthDate,
  });

  // Keep form in sync when userData changes from elsewhere
  useEffect(() => {
    setEditForm({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      birthDate: userData.birthDate,
    });
  }, [userData, isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        showToast("Anda belum login atau sesi telah berakhir. Silakan refresh halaman.", "error", "Gagal Menyimpan");
        setIsSaving(false);
        return;
      }
      
      const userId = authData.user.id;
      console.log("Saving profile for user:", userId, editForm);

      // Use upsert so it works even if the row doesn't exist yet
      const { data: upsertData, error } = await supabase
        .from('customer_profiles')
        .upsert({
          user_id: userId,
          nama_depan: editForm.firstName,
          nama_belakang: editForm.lastName,
          tanggal_lahir: editForm.birthDate,
          phone: editForm.phone,
        }, { onConflict: 'user_id' })
        .select();

      console.log("Upsert result:", upsertData, error);
        
      if (!error) {
        setUserData(prev => ({
          ...prev,
          ...editForm,
          name: `${editForm.firstName} ${editForm.lastName}`.trim(),
        }));
        setIsEditing(false);
        showToast("Data profil Anda berhasil diperbarui.", "success", "Profil Diperbarui!");
      } else {
        showToast("Gagal menyimpan: " + error.message, "error", "Terjadi Kesalahan");
        console.error("Gagal menyimpan:", error);
      }
    } catch (err: any) {
      showToast("Error: " + err?.message, "error", "Terjadi Kesalahan");
      console.error("Error saving profile:", err);
    }
    setIsSaving(false);
  };


  const statCards = [
    { icon: Flame, label: "STREAK AKTIF", value: `${userData.streakHari} hari`, color: "#EF4444", bg: "#FEF2F2" },
    { icon: Trophy, label: "TOTAL MENANG", value: `${userData.totalMenang} game`, color: "#F59E0B", bg: "#FFFBEB" },
    { icon: Target, label: "GAME DICOBA", value: `${userData.gameDicoba} judul`, color: "#10B981", bg: "#ECFDF5" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">Sebangku</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">Profil Saya</span>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 flex-1 text-center sm:text-left">
            <div className="relative group">
              <AvatarCircle name={userData.name} size={80} fontSize={28} />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-all duration-200"
                title="Edit Profil"
              >
                <Edit2 size={12} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                <h1
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  className="text-2xl font-black text-[#0F172A]"
                >
                  {userData.name}
                </h1>
                <div className="flex gap-2 justify-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-[#3B82F6] self-center">
                    {userData.levelLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#F59E0B] bg-[#FFFBEB] border border-[#FDE68A] self-center">
                    LVL {userData.level}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#64748B] justify-center sm:justify-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mail size={13} className="text-[#94A3B8]" />
                  {userData.email}
                </span>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Phone size={13} className="text-[#94A3B8]" />
                  {userData.phone}
                </span>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar size={13} className="text-[#94A3B8]" />
                  Member sejak {userData.memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t lg:border-t-0 lg:border-l border-[#F1F5F9] pt-4 lg:pt-0 lg:pl-8 shrink-0">
            <div className="text-center px-2">
              <p className="text-2xl md:text-3xl font-black text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {userData.kunjungan}
              </p>
              <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Kunjungan</p>
            </div>
            <div className="text-center px-2 border-x border-[#F1F5F9]">
              <p className="text-2xl md:text-3xl font-black text-[#3B82F6]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {userData.waktuJam}h
              </p>
              <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Waktu</p>
            </div>
            <div className="text-center px-2">
              <p className="text-2xl md:text-3xl font-black text-[#10B981]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {userData.winRate}%
              </p>
              <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Win Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Informasi Personal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A]">
            Informasi Personal
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold hover:bg-[#EFF6FF] hover:border-[#3B82F6] transition-colors cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Edit2 size={12} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Undo2 size={12} /> Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white text-xs font-bold hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
              >
                {isSaving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full" />
                ) : (
                  <Save size={12} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Nama Depan
              </label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Nama Belakang
              </label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={editForm.birthDate}
                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Nomor HP
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Status
              </label>
              <input
                type="text"
                disabled
                value={userData.status}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "Nama Depan", value: userData.firstName },
              { label: "Nama Belakang", value: userData.lastName },
              { label: "Tanggal Lahir", value: formatDateDisplay(userData.birthDate) },
              { label: "Email", value: userData.email },
              { label: "Nomor HP", value: userData.phone },
              { label: "Status", value: userData.status },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {field.label}
                </p>
                <p className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Profil Gaming */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] mb-4">
          Profil Gaming
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {statCards.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 flex flex-col gap-2 transition-shadow hover:shadow-md cursor-pointer select-none"
              style={{ background: s.bg, border: `1px solid ${s.color}18` }}
            >
              <div className="flex items-center">
                <span className="text-[9px] font-black uppercase tracking-wider"
                  style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>
                  {s.label}
                </span>
              </div>
              <p className="text-lg font-black text-[#0F172A] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Game Favorit */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] mb-4 md:mb-0"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] mb-4">
          Game Favorit
        </h2>

        {/* Responsive Grid with swipeable carousel on mobile */}
        <div
          className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {userData.favGames.map((g) => (
            <motion.div
              key={g.rank}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-start shadow-sm border border-[#E2E8F0]/50"
            >
              <img
                src={g.image}
                alt={g.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3 w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-[10px] font-black">#{g.rank}</span>
              </div>
              <p
                className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold truncate tracking-wide drop-shadow-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {g.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Mock History Game Data ──────────────────────────────────────────────────
const MOCK_HISTORY_GAMES = [
  { id: 1, name: "Mysterium Kids", rating: 5, date: "8 Jun 2025", duration: "2h 30m", table: "Table A1", players: 4, status: "WIN", comment: "Epic win! Cured all 4 diseases with 1 card left in player deck!", image: mystKidsImg },
  { id: 2, name: "Lucky Captain", rating: 4, date: "5 Jun 2025", duration: "1h 45m", table: "Table B2", players: 3, status: "LOSS", comment: "So close! Needed only 1 longest road to win.", image: luckyCapImg },
  { id: 3, name: "Kraken Attack", rating: 5, date: "1 Jun 2025", duration: "3h 00m", table: "Table C1", players: 2, status: "WIN", comment: "Best bird engine build so far! Scored 110 points.", image: krakenAttImg },
  { id: 4, name: "Sleepy Castle", rating: 3, date: "28 Mei 2025", duration: "1h 00m", table: "Table A3", players: 4, status: "WIN", comment: "Perfect tiles drafting strategy worked out well.", image: sleepyCasImg },
  { id: 5, name: "Detective Charlie", rating: 4, date: "22 Mei 2025", duration: "2h 00m", table: "Table D2", players: 5, status: "LOSS", comment: "Finally connected coast to coast! But lost on points.", image: detCharImg },
  { id: 6, name: "Ruben Rallye", rating: 4, date: "18 Mei 2025", duration: "2h 45m", table: "Table B1", players: 3, status: "WIN", comment: "The Woodland Alliance revolt was extremely satisfying.", image: rubenRalImg },
  { id: 7, name: "Waroong Wars", rating: 3, date: "12 Mei 2025", duration: "1h 15m", table: "Table A2", players: 2, status: "LOSS", comment: "Learned the meeple placement rules. Good game.", image: waroongWarsImg },
  { id: 8, name: "Magic Maze", rating: 5, date: "8 Mei 2025", duration: "0h 45m", table: "Table C3", players: 6, status: "WIN", comment: "Team MVP! All clues landed perfectly on blue cards.", image: magicMazeImg }
];

// ── Confirm Clear Modal ──
function ConfirmClearModal({
  isOpen, title, description, onConfirm, onCancel, isLoading
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-500" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F172A] mb-1">{title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
                ) : (
                  <Trash2 size={12} />
                )}
                {isLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── History Game Page ──
function HistoryPage({ searchQuery, data = [], onClearHistory, showToast }: { searchQuery: string, data?: any[], onClearHistory?: () => void, showToast?: (msg: string, type?: ToastType, title?: string) => void }) {
  const filteredHistoryGames = useMemo(() => {
    return data.filter(game =>
      (game.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.comment || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Belum login");
      const { error } = await supabase
        .from('customer_game_history')
        .delete()
        .eq('user_id', authData.user.id);
      if (error) throw error;
      setShowConfirm(false);
      showToast?.("Semua history game berhasil dihapus.", "success", "Riwayat Dihapus");
      if (onClearHistory) onClearHistory();
    } catch (err: any) {
      showToast?.("Gagal menghapus riwayat: " + err.message, "error", "Terjadi Kesalahan");
    }
    setIsClearing(false);
  };

  const stats = [
    { id: "total_sesi", value: data.length, label: "Total Sesi", icon: Gamepad2, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "total_menang", value: data.filter(d => d.status === 'WIN').length, label: "Total Menang", icon: Trophy, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "game_unik", value: new Set(data.map(d => d.name)).size, label: "Game Unik", icon: Package, color: "#3B82F6", bg: "#EFF6FF" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <ConfirmClearModal
        isOpen={showConfirm}
        title="Hapus Semua History Game?"
        description="Semua riwayat sesi bermain Anda akan dihapus secara permanen dan tidak dapat dikembalikan."
        onConfirm={handleClearHistory}
        onCancel={() => setShowConfirm(false)}
        isLoading={isClearing}
      />

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">History Game</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">History Game</h1>
        {data.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} /> Hapus Riwayat
          </button>
        )}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              <s.icon size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#0F172A] leading-none">{s.value}</p>
              <p className="text-xs text-[#64748B] font-bold mt-1.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {filteredHistoryGames.map(game => (
          <div key={game.id} className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
            {/* Header Image with Overlay */}
            <div className="relative h-40 overflow-hidden">
              <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Win/Loss Badge */}
              <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm flex items-center gap-1 ${game.status === "WIN"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                {game.status === "WIN" ? (
                  <>
                    <Trophy size={10} strokeWidth={2.5} />
                    WIN
                  </>
                ) : (
                  "LOSS"
                )}
              </span>

              {/* Title */}
              <h3 className="absolute bottom-4 left-4 text-white text-base font-bold drop-shadow-sm truncate pr-4 text-left">{game.name}</h3>
            </div>

            {/* Content info */}
            <div className="p-4 flex-1 flex flex-col justify-between text-left">
              <div>
                {/* Stars and Date */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-xs ${i < game.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#94A3B8]">{game.date}</span>
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-3 text-[10px] font-bold text-[#64748B] mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} strokeWidth={2} />
                    {game.duration}
                  </span>

                  {/* Table Badge */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${game.table.includes("A") ? "bg-red-50 text-red-500" :
                    game.table.includes("B") ? "bg-amber-50 text-amber-600" :
                      game.table.includes("C") ? "bg-purple-50 text-purple-600" :
                        "bg-blue-50 text-blue-500"
                    }`}>
                    {game.table}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users size={12} strokeWidth={2} />
                    {game.players} players
                  </span>
                </div>

                {/* Comment quote box */}
                <div
                  onClick={() => setExpandedCard(expandedCard === game.id ? null : game.id)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <p className={`text-[11px] text-[#64748B] leading-relaxed text-left ${expandedCard === game.id ? "" : "line-clamp-1"}`}>
                    "{game.comment}"
                  </p>
                  <div className="flex justify-end mt-1 text-[9px] text-[#3B82F6] font-bold">
                    {expandedCard === game.id ? "Show Less ▲" : "Show More ▼"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredHistoryGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 gap-5"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
            <Gamepad2 size={36} className="text-[#3B82F6]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {searchQuery ? "Tidak ada hasil pencarian" : "Belum Ada History Game"}
            </p>
            <p className="text-sm text-[#64748B] mt-1.5">
              {searchQuery
                ? `Tidak ada game yang cocok dengan "${searchQuery}"`
                : "Riwayat sesi bermain Anda akan muncul di sini setelah bermain di Sebangku Cafe."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Mock Visit Data ─────────────────────────────────────────────────────────
const MOCK_VISITS = [
  { id: 1, date: "8 Jun 2025", time: "14:00 WIB", gameName: "Mysterium Kids", gameImage: mystKidsImg, duration: "2h 30m", table: "A1", friends: 4, spending: 82000 },
  { id: 2, date: "5 Jun 2025", time: "16:30 WIB", gameName: "Lucky Captain", gameImage: luckyCapImg, duration: "1h 45m", table: "B2", friends: 3, spending: 43000 },
  { id: 3, date: "1 Jun 2025", time: "13:00 WIB", gameName: "Kraken Attack", gameImage: krakenAttImg, duration: "3h 00m", table: "C1", friends: 2, spending: 95000 },
  { id: 4, date: "28 Mei 2025", time: "15:00 WIB", gameName: "Sleepy Castle", gameImage: sleepyCasImg, duration: "1h 00m", table: "A3", friends: 4, spending: 57000 },
  { id: 5, date: "22 Mei 2025", time: "17:00 WIB", gameName: "Detective Charlie", gameImage: detCharImg, duration: "2h 00m", table: "D2", friends: 5, spending: 68000 },
  { id: 6, date: "18 Mei 2025", time: "19:00 WIB", gameName: "Ruben Rallye", gameImage: rubenRalImg, duration: "2h 45m", table: "B1", friends: 3, spending: 75000 },
  { id: 7, date: "12 Mei 2025", time: "14:30 WIB", gameName: "Waroong Wars", gameImage: waroongWarsImg, duration: "1h 15m", table: "A2", friends: 2, spending: 38000 },
  { id: 8, date: "8 Mei 2025", time: "20:00 WIB", gameName: "Magic Maze", gameImage: magicMazeImg, duration: "0h 45m", table: "C3", friends: 6, spending: 55000 }
];

// ── History Kunjungan Page ──
function KunjunganPage({ searchQuery, data = [], onClearHistory, showToast }: { searchQuery: string, data?: any[], onClearHistory?: () => void, showToast?: (msg: string, type?: ToastType, title?: string) => void }) {
  const filteredVisits = useMemo(() => {
    return data.filter(visit =>
      (visit.gameName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (visit.table || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Belum login");
      // Kunjungan bersumber dari customer_transactions, hapus semua transaksi user
      const { error } = await supabase
        .from('customer_transactions')
        .delete()
        .eq('user_id', authData.user.id);
      if (error) throw error;
      setShowConfirm(false);
      showToast?.("Semua history kunjungan berhasil dihapus.", "success", "Riwayat Dihapus");
      if (onClearHistory) onClearHistory();
    } catch (err: any) {
      showToast?.("Gagal menghapus riwayat: " + err.message, "error", "Terjadi Kesalahan");
    }
    setIsClearing(false);
  };

  const stats = [
    { id: "total_visit", value: data.length, label: "Total Kunjungan", icon: Users, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "avg_spend", value: `Rp ${Math.round(data.reduce((acc, curr) => acc + (curr.spending || 0), 0) / (data.length || 1)).toLocaleString("id-ID")}`, label: "Rata-rata Pengeluaran", icon: Receipt, color: "#10B981", bg: "#ECFDF5" },
    { id: "avg_friend", value: Math.round(data.reduce((acc, curr) => acc + (curr.friends || 1), 0) / (data.length || 1)), label: "Rata-rata Teman", icon: Users, color: "#8B5CF6", bg: "#F3E8FF" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <ConfirmClearModal
        isOpen={showConfirm}
        title="Hapus Semua History Kunjungan?"
        description="Semua riwayat kunjungan Anda akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleClearHistory}
        onCancel={() => setShowConfirm(false)}
        isLoading={isClearing}
      />

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">History Kunjungan</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">History Kunjungan</h1>
        {data.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} /> Hapus Riwayat
          </button>
        )}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              <s.icon size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#64748B] font-bold mt-1.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visits Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm mt-2">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A]">Riwayat Kunjungan</h2>
          {data.length > 0 && (
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{data.length} kunjungan tercatat</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-[#64748B]">
                <th className="p-4 pl-6">TANGGAL</th>
                <th className="p-4">GAME DIMAINKAN</th>
                <th className="p-4">DURASI</th>
                <th className="p-4">MEJA</th>
                <th className="p-4">TEMAN</th>
                <th className="p-4 text-right pr-6">PENGELUARAN</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.map(visit => (
                <tr key={visit.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 text-left">
                    <p className="font-bold text-[#1E293B]">{visit.date}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{visit.time}</p>
                  </td>
                  <td className="p-4 font-bold text-[#1E293B]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={visit.gameImage} alt={visit.gameName} className="w-full h-full object-cover" />
                      </div>
                      <span>{visit.gameName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-semibold">{visit.duration}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full inline-flex items-center justify-center text-[10px] font-bold whitespace-nowrap ${visit.table.includes("A") ? "bg-red-50 text-red-500" :
                      visit.table.includes("B") ? "bg-amber-50 text-amber-600" :
                        visit.table.includes("C") ? "bg-purple-50 text-purple-600" :
                          "bg-blue-50 text-blue-500"
                      }`}>
                      {visit.table}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-[#94A3B8]" />
                      <span>{visit.friends} players</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-[#1E293B] pr-6">
                    Rp {visit.spending.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              {filteredVisits.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
                        <Calendar size={30} className="text-[#3B82F6]" strokeWidth={1.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {searchQuery ? "Tidak ada hasil pencarian" : "Belum Ada Riwayat Kunjungan"}
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">
                          {searchQuery
                            ? `Tidak ada kunjungan yang cocok dengan "${searchQuery}"`
                            : "Riwayat kunjungan Anda akan muncul di sini setelah datang ke Sebangku Cafe."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Mock Transactions Data ──────────────────────────────────────────────────
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    date: "8 Jun 2025 · 14:05 WIB",
    items: "Mie Goreng · Kopi Susu · Mysterium Kids 2h Rental",
    amount: 82000,
    method: "QRIS",
    details: [
      { name: "Mie Goreng", price: 25000, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&fit=crop&q=80" },
      { name: "Kopi Susu", price: 22000, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&fit=crop&q=80" },
      { name: "Mysterium Kids (2h)", price: 35000, image: mystKidsImg }
    ]
  },
  {
    id: 2,
    date: "5 Jun 2025 · 16:35 WIB",
    items: "Es Teh · Lucky Captain 1h Rental",
    amount: 43000,
    method: "Cash",
    details: [
      { name: "Es Teh", price: 8000, image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=200&fit=crop&q=80" },
      { name: "Lucky Captain (1h)", price: 35000, image: luckyCapImg }
    ]
  },
  {
    id: 3,
    date: "1 Jun 2025 · 13:05 WIB",
    items: "Snack Mix · Es Kopi · Kraken Attack 3h Rental",
    amount: 95000,
    method: "Transfer",
    details: [
      { name: "Snack Mix", price: 15000, image: "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?w=200&fit=crop&q=80" },
      { name: "Es Kopi Susu", price: 20000, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&fit=crop&q=80" },
      { name: "Kraken Attack (3h)", price: 60000, image: krakenAttImg }
    ]
  },
  {
    id: 4,
    date: "28 Mei 2025 · 15:05 WIB",
    items: "Croissant · Sleepy Castle 1h Rental",
    amount: 57000,
    method: "QRIS",
    details: [
      { name: "Croissant", price: 22000, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&fit=crop&q=80" },
      { name: "Sleepy Castle (1h)", price: 35000, image: sleepyCasImg }
    ]
  },
  {
    id: 5,
    date: "22 Mei 2025 · 17:05 WIB",
    items: "Kentang Goreng · Detective Charlie 2h Rental",
    amount: 68000,
    method: "QRIS",
    details: [
      { name: "Kentang Goreng", price: 18000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&fit=crop&q=80" },
      { name: "Detective Charlie (2h)", price: 50000, image: detCharImg }
    ]
  }
];

// ── Riwayat Transaksi Page ──
function TransaksiPage({ searchQuery, data = [], userData, onClearHistory, showToast }: { searchQuery: string, data?: any[], userData?: any, onClearHistory?: () => void, showToast?: (msg: string, type?: ToastType, title?: string) => void }) {
  const transactions = data;
  const [expandedTx, setExpandedTx] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx =>
      (tx.items || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.date || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.method || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Belum login");
      const { error } = await supabase
        .from('customer_transactions')
        .delete()
        .eq('user_id', authData.user.id);
      if (error) throw error;
      setShowConfirm(false);
      showToast?.("Semua riwayat transaksi berhasil dihapus.", "success", "Riwayat Dihapus");
      if (onClearHistory) onClearHistory();
    } catch (err: any) {
      showToast?.("Gagal menghapus riwayat: " + err.message, "error", "Terjadi Kesalahan");
    }
    setIsClearing(false);
  };

  const stats = [
    { id: "total_fnb", value: `Rp ${(userData?.totalBelanjaFNB || 0).toLocaleString("id-ID")}`, label: "Total Belanja F&B", icon: Utensils, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "total_tx", value: `${userData?.totalTransaksi || 0} kali`, label: "Total Transaksi", icon: Receipt, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "avg_kunjungan", value: `Rp ${(userData?.rataRataKunjungan || 0).toLocaleString("id-ID")}`, label: "Rata-rata / Kunjungan", icon: BarChart2, color: "#3B82F6", bg: "#EFF6FF" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <ConfirmClearModal
        isOpen={showConfirm}
        title="Hapus Semua Riwayat Transaksi?"
        description="Semua data transaksi Anda akan dihapus secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleClearHistory}
        onCancel={() => setShowConfirm(false)}
        isLoading={isClearing}
      />

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">Riwayat Transaksi</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Riwayat Transaksi</h1>
        {data.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} /> Hapus Riwayat
          </button>
        )}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              <s.icon size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#64748B] font-bold mt-1.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase List Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm mt-2 text-left">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#0F172A]">Riwayat Pembelian F&B</h2>
          {data.length > 0 && (
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{data.length} transaksi tercatat</span>
          )}
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-8 md:pl-10 border-l border-[#E2E8F0] space-y-6">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="relative">
              {/* Icon Circle */}
              <div className="absolute -left-[48px] md:-left-[56px] top-1 w-8 h-8 rounded-full bg-white border-2 border-[#3B82F6] flex items-center justify-center shadow-sm">
                <FileText size={14} className="text-[#3B82F6]" />
              </div>

              {/* Transaction Item Card */}
              <div
                onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                className="bg-white border border-[#E2E8F0] hover:border-[#3B82F6]/30 rounded-2xl p-4 md:p-5 flex flex-col gap-4 cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{tx.date}</p>
                    <p className="text-xs font-bold text-[#1E293B] mt-1 truncate pr-4">{tx.items}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-[#0F172A]">Rp {tx.amount.toLocaleString("id-ID")}</p>
                      <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full mt-1.5 ${tx.method === "QRIS" ? "bg-blue-50 text-[#3B82F6]" :
                          tx.method === "Cash" ? "bg-emerald-50 text-emerald-600" :
                            "bg-purple-50 text-purple-600"
                        }`}>
                        {tx.method}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#94A3B8] transition-transform duration-200 ${expandedTx === tx.id ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {/* Dropdown Details Block */}
                <AnimatePresence>
                  {expandedTx === tx.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-[#F1F5F9] pt-4 mt-2"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      <div className="space-y-3">
                        {tx.details.map((detail: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                                <img src={detail.image} alt={detail.name} className="w-full h-full object-contain" />
                              </div>
                              <span className="font-semibold text-slate-700">{detail.name}</span>
                            </div>
                            <span className="font-bold text-[#1E293B]">Rp {detail.price.toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3 mt-1 text-xs font-black">
                          <span className="text-[#0F172A]">Total</span>
                          <span className="text-[#3B82F6] text-sm">Rp {tx.amount.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-20 gap-5"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
                <Receipt size={36} className="text-[#3B82F6]" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {searchQuery ? "Tidak ada hasil pencarian" : "Belum Ada Riwayat Transaksi"}
                </p>
                <p className="text-sm text-[#64748B] mt-1.5">
                  {searchQuery
                    ? `Tidak ada transaksi yang cocok dengan "${searchQuery}"`
                    : "Riwayat pembayaran Anda akan tercatat di sini setelah melakukan transaksi di Sebangku Cafe."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Statistik Bermain Page ──
function StatistikPage({ gamesData = [], visitsData = [] }: { gamesData?: any[], visitsData?: any[] }) {
  const hasData = gamesData.length > 0 || visitsData.length > 0;

  // Compute real stats from actual data
  const totalWins = gamesData.filter(g => g.status === 'WIN').length;
  const totalSesi = gamesData.length;
  const winRate = totalSesi > 0 ? Math.round((totalWins / totalSesi) * 100) : 0;

  // Top games from real data
  const gameCountMap: Record<string, number> = {};
  gamesData.forEach(g => { if (g.name) gameCountMap[g.name] = (gameCountMap[g.name] || 0) + 1; });
  const sortedGames = Object.entries(gameCountMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = sortedGames[0]?.[1] || 1;
  const COLORS = ["#EF4444", "#F59E0B", "#8B5CF6", "#3B82F6", "#F97316"];
  const topGames = sortedGames.map(([name, count], i) => ({
    name, count, color: COLORS[i], pct: Math.round((count / maxCount) * 100)
  }));

  // Achievements — all locked for new users
  const achievements = [
    { id: 1, name: "First Victory", label: "First Victory", icon: Trophy, earned: totalWins >= 1, statusText: "Diraih", current: totalWins, total: 1 },
    { id: 2, name: "On Fire", label: "On Fire", icon: Flame, earned: false, current: 0, total: 5 },
    { id: 3, name: "Dice Master", label: "Dice Master", icon: Dices, earned: false, current: 0, total: 10 },
    { id: 4, name: "Team Player", label: "Team Player", icon: Users, earned: false, current: 0, total: 10 },
    { id: 5, name: "Speed Runner", label: "Speed Runner", icon: Zap, earned: false, current: 0, total: 5 },
    { id: 6, name: "Explorer", label: "Explorer", icon: Compass, earned: false, current: 0, total: 8 },
    { id: 7, name: "Cafe Regular", label: "Cafe Regular", icon: Award, earned: false, current: visitsData.length, total: 50 },
    { id: 8, name: "Legend", label: "Legend", icon: Star, earned: false, current: visitsData.length, total: 50 },
    { id: 9, name: "Grand Strategist", label: "Grand Strategist", icon: Brain, earned: false, current: totalSesi, total: 30 },
    { id: 10, name: "Night Owl", label: "Night Owl", icon: Moon, earned: false, current: 0, total: 10 },
    { id: 11, name: "Solo Warrior", label: "Solo Warrior", icon: Shield, earned: false, current: 0, total: 15 },
    { id: 12, name: "Diamond Member", label: "Diamond Member", icon: Gem, earned: false, current: visitsData.length, total: 100 }
  ];

  // Activity Grid (7 days x 10 weeks) — zeros for new users
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const activityData = Array(7).fill(null).map(() => Array(10).fill(0));

  const stats = [
    { id: "total_waktu", value: `${visitsData.reduce((acc: number, v: any) => acc + (v.waktu_bermain || 0), 0)} jam`, label: "Total Waktu Bermain", icon: Clock, color: "#3B82F6", bg: "#EFF6FF", sub: "Semua sesi" },
    { id: "total_menang", value: `${totalWins} dari ${totalSesi}`, label: "Total Menang", icon: Trophy, color: "#3B82F6", bg: "#EFF6FF", sub: `Win rate ${winRate}%` },
    { id: "avg_sesi", value: totalSesi > 0 ? "Terhitung" : "Belum ada", label: "Rata-rata Sesi", icon: Calendar, color: "#3B82F6", bg: "#EFF6FF", sub: "Per kunjungan" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-left">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">Statistik Bermain</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Statistik Bermain</h1>
      </div>

      {!hasData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-24 gap-5"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
            <BarChart2 size={36} className="text-[#3B82F6]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Belum Ada Statistik
            </p>
            <p className="text-sm text-[#64748B] mt-1.5 max-w-xs">
              Statistik bermain Anda akan muncul secara otomatis setelah Anda mulai bermain di Sebangku Cafe. 🎲
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { icon: "🎮", label: "Sesi Bermain", value: "0" },
              { icon: "🏆", label: "Total Menang", value: "0" },
              { icon: "📅", label: "Kunjungan", value: "0" },
            ].map(item => (
              <div key={item.label} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 text-center shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-xl font-black text-[#0F172A] mt-1">{item.value}</p>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (<>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Paling Sering Dimainkan */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Paling Sering Dimainkan</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Berdasarkan jumlah sesi bermain</p>
          </div>
          <div className="space-y-4 mt-6">
            {topGames.map(game => (
              <div key={game.name} className="flex items-center gap-4 text-xs">
                <span className="w-24 font-semibold text-slate-700 truncate">{game.name}</span>
                <div className="flex-1 bg-slate-50 h-5 rounded-lg overflow-hidden relative border border-slate-100/50">
                  <div
                    className="h-full rounded-r-lg transition-all duration-500"
                    style={{ width: `${game.pct}%`, backgroundColor: game.color }}
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    {game.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart: Gaya Bermain */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Gaya Bermain</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Berdasarkan genre yang dimainkan</p>
          </div>
          <div className="flex items-center justify-center py-4 relative">
            <svg viewBox="0 0 200 200" className="w-44 h-44 overflow-visible">
              {/* Radar Grid circles */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="#E2E8F0" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="100" cy="100" r="20" fill="none" stroke="#E2E8F0" strokeWidth="1" />

              {/* Grid Lines */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="30" y1="60" x2="170" y2="140" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="30" y1="140" x2="170" y2="60" stroke="#E2E8F0" strokeWidth="1" />

              {/* Data polygon */}
              <polygon
                points="100,35 152,70 140,135 100,160 55,125 48,70"
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#3B82F6"
                strokeWidth="2"
              />

              {/* Labels */}
              <text x="100" y="12" textAnchor="middle" className="text-[9px] font-bold fill-slate-500 font-sans">Strategy</text>
              <text x="180" y="72" textAnchor="start" className="text-[9px] font-bold fill-slate-500 font-sans">Coop</text>
              <text x="180" y="138" textAnchor="start" className="text-[9px] font-bold fill-slate-500 font-sans">Party</text>
              <text x="100" y="195" textAnchor="middle" className="text-[9px] font-bold fill-slate-500 font-sans">Card</text>
              <text x="20" y="138" textAnchor="end" className="text-[9px] font-bold fill-slate-500 font-sans">Abstract</text>
              <text x="20" y="72" textAnchor="end" className="text-[9px] font-bold fill-slate-500 font-sans">Roleplay</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row: Play Activity Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Aktivitas Bermain</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">10 minggu terakhir</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <span>Jarang</span>
            <div className="w-3.5 h-3.5 rounded bg-[#EFF6FF] border border-slate-100" />
            <div className="w-3.5 h-3.5 rounded bg-[#DBEAFE]" />
            <div className="w-3.5 h-3.5 rounded bg-[#93C5FD]" />
            <div className="w-3.5 h-3.5 rounded bg-[#3B82F6]" />
            <div className="w-3.5 h-3.5 rounded bg-[#1D4ED8]" />
            <span>Sering</span>
          </div>
        </div>

        {/* Activity Grid Render */}
        <div className="flex items-start gap-4 overflow-x-auto pb-2">
          <div className="flex flex-col gap-2 pt-6 text-[10px] font-bold text-slate-400">
            {days.map(d => (
              <span key={d} className="h-4 flex items-center">{d}</span>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {/* Week Indicators */}
            <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1">
              <span>W10</span>
              <span>W8</span>
              <span>W6</span>
              <span>W4</span>
              <span>W2</span>
            </div>
            <div className="flex flex-col gap-2">
              {activityData.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-2">
                  {row.map((lvl, cIdx) => (
                    <div
                      key={cIdx}
                      className={`flex-1 h-4 rounded transition-all hover:scale-110 cursor-pointer ${lvl === 1 ? "bg-[#EFF6FF] border border-[#E2E8F0]" :
                          lvl === 2 ? "bg-[#DBEAFE]" :
                            lvl === 3 ? "bg-[#93C5FD]" :
                              lvl === 4 ? "bg-[#3B82F6]" :
                                "bg-[#1D4ED8]"
                        }`}
                      title={`Week ${10 - cIdx}, Day ${rIdx + 1}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        {stats.map(s => (
          <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              <s.icon size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#64748B] font-bold mt-1.5">{s.label}</p>
              <p className="text-[10px] text-[#94A3B8] font-bold mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
      </>)}
    </div>
  );
}

// ── Pesan Page ──
interface PesanPageProps {
  userData: typeof DEFAULT_USER;
  onOrderSuccess: () => void;
  onNotify?: (category: string, text: string, type: string) => void;
  showToast?: (message: string, type?: ToastType, title?: string) => void;
}

function PesanPage({ userData, onOrderSuccess, onNotify, showToast }: PesanPageProps) {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "A1";

  const [products, setProducts] = useState<any[]>([]);
  const [rentGames, setRentGames] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [tables, setTables] = useState<string[]>(["A1", "A2", "B1", "B2", "C1", "C2"]);

  useEffect(() => {
    const fetchCatalog = async () => {
      const { data: menuData } = await supabase.from('menus').select('*').order('name');
      const { data: gameData } = await supabase.from('boardgames').select('*').order('name');
      const { data: tableData } = await supabase.from('cafe_tables').select('*');
      const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (catData) setDbCategories(catData);
      
      if (tableData && tableData.length > 0) {
        const tableNames = tableData.map((t: any) => String(t.table_no || t.name || t.id));
        setTables(tableNames);
        setSelectedTable(prev => tableNames.includes(prev) ? prev : tableNames[0]);
      }
      
      const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
      };

      if (menuData) {
        setProducts(menuData.map((m: any) => {
          const exactFallback = PRODUCTS_FALLBACK.find(f => f.name.toLowerCase() === (m.name || "").toLowerCase())?.image;
          const randomFallback = PRODUCTS_FALLBACK[hashString(m.name || "") % PRODUCTS_FALLBACK.length]?.image;
          return {
            id: `p${m.id}`,
            name: m.name,
            price: m.price,
            category: m.category || "Food",
            emoji: m.emoji || "🍽️",
            image: m.image_url || m.image || exactFallback || randomFallback
          };
        }));
      }
      
      if (gameData) {
        setRentGames(gameData.map((g: any) => {
          const exactFallback = RENT_GAMES_FALLBACK.find(f => f.name.toLowerCase() === (g.name || "").toLowerCase())?.image;
          const randomFallback = RENT_GAMES_FALLBACK[hashString(g.name || "") % RENT_GAMES_FALLBACK.length]?.image;
          return {
            id: `g${g.id}`,
            name: g.name,
            price: g.price || 15000,
            category: g.category || "Strategy",
            description: g.description,
            emoji: "🎲",
            image: g.image_url || g.image || exactFallback || randomFallback,
            status: g.status || "Available"
          };
        }));
      }

      setIsLoadingCatalog(false);
    };
    fetchCatalog();
  }, []);

  const [activeTab, setActiveTab] = useState<"f&b" | "rent">("f&b");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "Cash">("QRIS");
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [qrisStatus, setQrisStatus] = useState<"pending" | "success">("pending");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");
  const [selectedGameForModal, setSelectedGameForModal] = useState<any | null>(null);
  const [selectedTable, setSelectedTable] = useState("A1");
  const [selectedPlayers, setSelectedPlayers] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = useMemo(() => {
    const typeFilter = activeTab === "f&b" ? "fnb" : "game";
    const list = dbCategories.filter(c => c.type === typeFilter).map(c => c.name);
    return ["All", ...list];
  }, [activeTab, dbCategories]);

  const itemsToDisplay = useMemo(() => {
    const list = activeTab === "f&b" ? products : rentGames;
    return list.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeTab, selectedCategory, searchQuery, products, rentGames]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, duration: item.id.startsWith("g") ? "2 Hours" : undefined }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean);
    });
  };

  const updateDuration = (id: string, duration: string) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, duration } : i));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === "QRIS") {
      setQrisStatus("pending");
      setShowQRISModal(true);
    } else {
      await processOrder();
    }
  };

  const processOrder = async () => {
    const now = new Date();
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;

    // Split items into food & beverage and game rental
    const rentalItems = cart.filter(i => String(i.id).startsWith("g"));

    setIsSubmitting(true);
    // --- Backend Integration: Save to Supabase ---
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("User not authenticated");
      const userId = authData.user.id;

      // Ensure customer profile exists to prevent foreign key constraint error
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .single();
        
      if (!existingProfile) {
         await supabase.from('customer_profiles').insert({
            user_id: userId,
            nama_depan: authData.user.user_metadata?.name?.split(' ')[0] || 'Customer',
            nama_belakang: authData.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
            phone: authData.user.user_metadata?.phone || '-',
            level: 1,
            kunjungan: 0,
            waktu_bermain: 0,
            win_rate: 0,
            status: "Active · Regular",
            member_sejak: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
         });
      }

      // 0. Fetch a valid UUID for table_no to prevent UUID syntax error if cafe_tables uses UUID
      let realTableId: string | null = null;
      try {
        const { data: tableData } = await supabase.from('cafe_tables').select('*');
        if (tableData) {
          const foundTable = tableData.find((t: any) => 
            String(t.table_no || t.name || t.id).toLowerCase() === selectedTable.toLowerCase()
          );
          if (foundTable) realTableId = foundTable.id;
        }
      } catch (e) {
        // ignore if fails
      }

      // 1. Insert Transaction (for Kasir Incoming Orders)
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert({
          customer_id: userId,
          table_id: realTableId || selectedTable,
          total: cartTotal,
          payment_method: paymentMethod,
          status: 'Pending'
        })
        .select('id')
        .single();
        
      if (txError) throw txError;
      const txId = txData.id;

      // 1b. Insert Transaction Details
      const detailsData = cart
        .filter(item => item.id.startsWith('p'))
        .map(item => {
          const itemIdStr = String(item.id);
          const cleanMenuId = itemIdStr.substring(1);
          return {
            transaction_id: txId,
            menu_id: parseInt(cleanMenuId, 10),
            qty: item.quantity || 1,
            price: item.price || 0
          };
        });

      if (detailsData.length > 0) {
        const { error: detailsError } = await supabase.from('transaction_details').insert(detailsData);
        if (detailsError) throw detailsError;
      }

      // 2. Insert Game Sessions if there are rentals
      let gsInsertedData: any[] = [];
      if (rentalItems.length > 0) {
        const gameSessionInserts = rentalItems.map(item => {
          let durationMins = 120;
          if (item.duration === "1 Hour") durationMins = 60;
          if (item.duration === "2 Hours") durationMins = 120;
          if (item.duration === "3 Hours") durationMins = 180;
          if (item.duration === "All Day") durationMins = 600;

          const itemIdStr = String(item.id);
          const cleanGameId = itemIdStr.startsWith("g") ? itemIdStr.substring(1) : itemIdStr;

          return {
            customer_id: userId,
            table_id: realTableId || selectedTable,
            boardgame_id: parseInt(cleanGameId, 10),
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + durationMins * 60000).toISOString(),
            duration: durationMins,
            cost: item.price || 0,
            status: 'Pending'
          };
        });

        const { data: gameData, error: gameError } = await supabase
          .from('game_sessions')
          .insert(gameSessionInserts)
          .select('id, boardgame_id');
          
        if (gameError) throw gameError;
        if (gameData) {
          gsInsertedData = gameData;
          // Update boardgame status to "In Use"
          const boardgameIds = gameData.map((g: any) => g.boardgame_id);
          if (boardgameIds.length > 0) {
            await supabase.from('boardgames').update({ status: 'In Use' }).in('id', boardgameIds);
          }
        }
      }

      // Save the number of players in localStorage for History view
      try {
        const savedPlayers = localStorage.getItem("sebangku_order_players");
        const playersMap = savedPlayers ? JSON.parse(savedPlayers) : {};
        if (txId) {
          playersMap[String(txId)] = selectedPlayers;
        }
        if (gsInsertedData.length > 0) {
          gsInsertedData.forEach((gs: any) => {
            playersMap[`gs-${gs.id}`] = selectedPlayers;
          });
        }
        localStorage.setItem("sebangku_order_players", JSON.stringify(playersMap));
      } catch (e) {
        console.error("Failed to save players count", e);
      }

      // Call success callback to refresh parent data (transactions/history)
      onOrderSuccess();
      if (onNotify) {
        onNotify("Pesanan Dibuat", "Pesanan Anda berhasil dikirim dan sedang menunggu konfirmasi Kasir.", "check");
      }
      showToast?.("Pesanan berhasil dikirim dan menunggu konfirmasi kasir.", "success", "Pesanan Dibuat!");
      
    } catch (err: any) {
      console.error("Error saving checkout to Supabase", err);
      alert(`Pemesanan Gagal: ${err.message || err.toString()}`);
      showToast?.(`Pemesanan gagal disimpan. Pastikan Anda sudah login. Error: ${err.message || err.toString()}`, "error", "Pemesanan Gagal");
      setIsSubmitting(false);
      return; // Stop the success modal from showing
    }
    // -----------------------------------------

    setLastOrderId(orderId);
    setCart([]);
    setShowQRISModal(false);
    setShowSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Catalog Panel */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">Menu &amp; Game Rental</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Pesan F&amp;B atau sewa Board Game langsung dari meja {selectedTable}</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
            <input
              type="text"
              placeholder="Cari menu / game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] text-[#0F172A]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0]">
          <button
            onClick={() => { setActiveTab("f&b"); setSelectedCategory("All"); }}
            className="px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
            style={{
              borderColor: activeTab === "f&b" ? "#3B82F6" : "transparent",
              color: activeTab === "f&b" ? "#3B82F6" : "#64748B"
            }}
          >
            Makanan &amp; Minuman
          </button>
          <button
            onClick={() => { setActiveTab("rent"); setSelectedCategory("All"); }}
            className="px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
            style={{
              borderColor: activeTab === "rent" ? "#3B82F6" : "transparent",
              color: activeTab === "rent" ? "#3B82F6" : "#64748B"
            }}
          >
            Sewa Board Game
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border"
                style={{
                  background: isSelected ? "#3B82F6" : "white",
                  color: isSelected ? "white" : "#64748B",
                  borderColor: isSelected ? "#3B82F6" : "#E2E8F0"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid display */}
        {isLoadingCatalog ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
            Memuat data...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsToDisplay.map(item => (
            <motion.div
              key={item.id}
              layout
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl h-44 flex flex-col justify-between p-4 border border-slate-200/40 shadow-sm group"
            >
              <img
                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80"}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {(item.status === "In Use" || item.status === "Maintenance") && (
                <div className="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center text-center p-2">
                  <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm mb-1">
                    {item.status}
                  </span>
                </div>
              )}

              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                <div>
                  <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-black text-white mt-1.5 leading-snug drop-shadow">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-extrabold text-white drop-shadow">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                  <button
                    onClick={() => {
                      if (item.id.startsWith("g")) {
                        setSelectedGameForModal(item);
                      } else {
                        addToCart(item);
                      }
                    }}
                    disabled={item.status === "In Use" || item.status === "Maintenance"}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow cursor-pointer z-30 relative"
                  >
                    <Plus size={12} /> Tambah
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {(!isLoadingCatalog && itemsToDisplay.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#94A3B8] text-xs">
            Tidak ada menu yang sesuai pencarian.
          </div>
        )}



      </div>

      {/* Cart Summary Panel */}
      <div className="w-full lg:w-[320px] bg-white border border-[#E2E8F0] rounded-[24px] flex flex-col shadow-sm shrink-0">
        <div className="p-4 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            Ringkasan Pesanan
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">Meja: {selectedTable} · Customer: {userData.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[220px]">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm select-none">{item.emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1E293B] truncate leading-tight">{item.name}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-xs font-bold text-[#1E293B] w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>

              {/* Game Duration Selector */}
              {item.id.startsWith("g") && (
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-0.5">
                  <span className="text-[9px] text-[#94A3B8] font-bold uppercase">Durasi Sewa</span>
                  <select
                    value={item.duration}
                    onChange={(e) => updateDuration(item.id, e.target.value)}
                    className="text-[10px] font-bold text-[#3B82F6] bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
                  >
                    <option value="1 Hour">1 Jam</option>
                    <option value="2 Hours">2 Jam</option>
                    <option value="3 Hours">3 Jam</option>
                    <option value="All Day">Seharian</option>
                  </select>
                </div>
              )}
            </div>
          ))}

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 text-xs">
              <ShoppingBag size={28} className="mb-2 text-slate-300" />
              Keranjang masih kosong
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-[#E2E8F0] bg-[#FAFAFC] rounded-b-[24px]">
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-1">Pilih Meja</label>
                <select 
                  value={selectedTable} 
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#3B82F6]"
                >
                  {tables.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="w-[100px]">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-1">Jumlah Pemain</label>
                <input 
                  type="number" min="1" max="10" 
                  value={selectedPlayers} 
                  onChange={(e) => setSelectedPlayers(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod("QRIS")}
                  className="py-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                  style={{
                    borderColor: paymentMethod === "QRIS" ? "#3B82F6" : "#E2E8F0",
                    background: paymentMethod === "QRIS" ? "#EFF6FF" : "white",
                    color: paymentMethod === "QRIS" ? "#3B82F6" : "#64748B"
                  }}
                >
                  <CreditCard size={12} /> QRIS
                </button>
                <button
                  onClick={() => setPaymentMethod("Cash")}
                  className="py-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                  style={{
                    borderColor: paymentMethod === "Cash" ? "#3B82F6" : "#E2E8F0",
                    background: paymentMethod === "Cash" ? "#EFF6FF" : "white",
                    color: paymentMethod === "Cash" ? "#3B82F6" : "#64748B"
                  }}
                >
                  <Utensils size={12} /> Cash/Kasir
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-extrabold text-[#0F172A] mb-4 pt-2 border-t border-dashed border-[#E2E8F0]">
              <span>TOTAL</span>
              <span className="text-base text-[#3B82F6]">Rp {cartTotal.toLocaleString("id-ID")}</span>
            </div>

            <button
              disabled={isSubmitting}
              onClick={handleCheckout}
              className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-[#3B82F6] hover:bg-[#2563EB] cursor-pointer'}`}
            >
              {isSubmitting ? (
                <>Loading...</>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Bayar Sekarang
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* QRIS Simulation Modal */}
      <AnimatePresence>
        {showQRISModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative flex flex-col items-center"
            >
              <button
                onClick={() => setShowQRISModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black text-[#0F172A] tracking-tight mb-1">Simulasi Pembayaran QRIS</h3>
              <p className="text-xs text-[#64748B] mb-4">Pindai kode QR untuk membayar tagihan Anda</p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl w-full p-3 text-center mb-4">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase">TOTAL TAGIHAN</p>
                <p className="text-xl font-black text-[#3B82F6] mt-0.5">Rp {cartTotal.toLocaleString("id-ID")}</p>
              </div>

              {/* Mock QR SVG */}
              <div className="relative w-40 h-40 bg-white border border-[#E2E8F0] rounded-xl p-3 flex items-center justify-center shadow-inner mb-4">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="22" height="22" fill="#0F2340" />
                  <rect x="3" y="3" width="16" height="16" fill="white" />
                  <rect x="6" y="6" width="10" height="10" fill="#3B82F6" />

                  <rect x="78" y="0" width="22" height="22" fill="#0F2340" />
                  <rect x="81" y="3" width="16" height="16" fill="white" />
                  <rect x="84" y="6" width="10" height="10" fill="#3B82F6" />

                  <rect x="0" y="78" width="22" height="22" fill="#0F2340" />
                  <rect x="3" y="81" width="16" height="16" fill="white" />
                  <rect x="6" y="84" width="10" height="10" fill="#3B82F6" />

                  <rect x="30" y="10" width="15" height="15" fill="#0F2340" />
                  <rect x="55" y="25" width="20" height="10" fill="#0F2340" />
                  <rect x="40" y="50" width="25" height="20" fill="#3B82F6" />
                  <rect x="75" y="75" width="15" height="15" fill="#0F2340" />
                </svg>

                {qrisStatus === "success" && (
                  <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                    <CheckCircle className="text-emerald-500 mb-1" size={32} />
                    <span className="text-xs font-black text-emerald-600">Scan Sukses!</span>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                {qrisStatus === "pending" && (
                  <button
                    disabled={isSubmitting}
                    onClick={async () => {
                      setQrisStatus("success");
                      await new Promise(r => setTimeout(r, 1000));
                      await processOrder();
                    }}
                    className={`w-full py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'}`}
                  >
                    {isSubmitting ? "Memproses..." : "Simulasikan Pembayaran Sukses"}
                  </button>
                )}
                <button
                  disabled={isSubmitting}
                  onClick={() => setShowQRISModal(false)}
                  className="w-full py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Check size={28} strokeWidth={2.5} />
              </div>

              <h3 className="text-lg font-black text-[#0F172A] mb-1">Pesanan Berhasil Dibayar!</h3>
              <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
                Nomor Antrean: <span className="font-bold text-[#1E293B]">{lastOrderId}</span><br />
                Pemberitahuan telah terkirim ke kasir. Silakan tunggu kasir memproses pesanan Anda.
              </p>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Kembali ke Halaman Pesan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Board Game Detail & Tutorial Modal */}
      <AnimatePresence>
        {selectedGameForModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              {/* Header Image */}
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={selectedGameForModal.image}
                  alt={selectedGameForModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button
                  onClick={() => setSelectedGameForModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors cursor-pointer z-10"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-black uppercase tracking-wider mb-1.5 inline-block">
                    {selectedGameForModal.category}
                  </span>
                  <h3 className="text-xl font-black text-white leading-tight drop-shadow-md">
                    {selectedGameForModal.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Deskripsi Game</h4>
                  <p className="text-sm text-[#0F172A] leading-relaxed">
                    {selectedGameForModal.description || "Sebuah board game yang sangat seru untuk dimainkan bersama teman dan keluarga. Disewakan dengan harga terjangkau."}
                  </p>
                </div>

                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                      <PlayCircle size={20} fill="currentColor" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E3A8A]">Tutorial Cara Bermain</h4>
                      <p className="text-[11px] text-[#3B82F6] leading-snug mt-0.5">
                        Belum tahu cara mainnya? Jangan khawatir, tonton video tutorial singkat ini sebelum mulai bermain.
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedGameForModal.tutorialLink || `https://www.youtube.com/results?search_query=how+to+play+${selectedGameForModal.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Tonton di YouTube
                  </a>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase">Harga Sewa</p>
                    <p className="text-lg font-black text-[#3B82F6]">
                      Rp {selectedGameForModal.price.toLocaleString("id-ID")}
                      <span className="text-xs text-[#64748B] font-medium"> / 2 jam</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedGameForModal);
                      setSelectedGameForModal(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> Sewa Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Pesanan Page ──
function PesananPage({ userData, onRefresh, showToast }: { userData: typeof DEFAULT_USER, onRefresh?: () => void, showToast?: (msg: string, type?: ToastType, title?: string) => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Print receipt states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<any>(null);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<"WIN" | "LOSE">("WIN");

  const loadOrders = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const userId = authData.user.id;

      const { data: tablesData } = await supabase.from('cafe_tables').select('*');
      const tableMap: Record<string, string> = {};
      tablesData?.forEach((t: any) => tableMap[t.id] = String(t.table_no || t.name || t.id));

      const { data: txData } = await supabase
        .from('transactions')
        .select(`
          id, total, status, created_at, table_id,
          transaction_details (
            qty, price, menus (name, image)
          )
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      const { data: gsData } = await supabase
        .from('game_sessions')
        .select(`
          id, duration, cost, status, start_time, table_id,
          boardgames (name, image)
        `)
        .eq('customer_id', userId)
        .order('start_time', { ascending: false });

      const merged: any[] = [];
      
      const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
      };

      let playersMap: Record<string, number> = {};
      try {
        const savedPlayers = localStorage.getItem("sebangku_order_players");
        if (savedPlayers) playersMap = JSON.parse(savedPlayers);
      } catch (e) {}

      txData?.forEach((tx: any) => {
        const items = tx.transaction_details?.map((d: any) => {
           const menuName = d.menus?.name || "Item FnB";
           
           let fallbackImage = "";
           const lowerName = menuName.toLowerCase();
           if (lowerName.includes("chicken") || lowerName.includes("ayam") || lowerName.includes("nasi") || lowerName.includes("mie")) {
             fallbackImage = "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&fit=crop&q=80"; // Food
           } else if (lowerName.includes("es ") || lowerName.includes("kopi") || lowerName.includes("tea") || lowerName.includes("drink")) {
             fallbackImage = "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&fit=crop&q=80"; // Drink
           } else {
             const exactFallback = PRODUCTS_FALLBACK.find(m => m.name.toLowerCase() === lowerName);
             const randomFallback = PRODUCTS_FALLBACK[hashString(menuName) % PRODUCTS_FALLBACK.length];
             fallbackImage = exactFallback?.image || randomFallback?.image || "";
           }

           const menuImage = d.menus?.image || fallbackImage;
           return {
             name: menuName, price: d.price, quantity: d.qty, image: menuImage 
           };
        }) || [];
        
        merged.push({
          id: tx.id,
          type: "tx",
          customerName: userData.name,
          items: items,
          rentals: [],
          totalAmount: tx.total,
          status: tx.status === 'Pending' ? 'paid' : (tx.status === 'Success' ? 'acknowledged' : tx.status),
          createdAt: tx.created_at,
          table: tableMap[tx.table_id] || tx.table_id || "A1",
          players: playersMap[String(tx.id)] || 1
        });
      });

      gsData?.forEach((gs: any) => {
        const gsTime = new Date(gs.start_time).getTime();
        const match = merged.find(m => Math.abs(new Date(m.createdAt).getTime() - gsTime) < 300000); // 5 minute threshold
        
        const gameName = gs.boardgames?.name || "Board Game";
        const exactFallbackGame = RENT_GAMES_FALLBACK.find(g => g.name.toLowerCase() === gameName.toLowerCase());
        const randomFallbackGame = RENT_GAMES_FALLBACK[hashString(gameName) % RENT_GAMES_FALLBACK.length];
        const gameImage = gs.boardgames?.image || exactFallbackGame?.image || randomFallbackGame?.image || "";

        if (match) {
          // Verify it's not already added to avoid duplicates if React StrictMode fires twice
          const alreadyAdded = match.rentals.find((r: any) => r.name === gameName && r.price === gs.cost);
          if (!alreadyAdded) {
            match.rentals.push({
              id: gs.id,
              name: gameName,
              price: gs.cost,
              image: gameImage,
              duration: gs.duration ? `${gs.duration} Mins` : "120 Mins"
            });
          }
          // Also set the player count to the session's player count if the parent tx didn't have one explicitly
          if (playersMap[`gs-${gs.id}`] && !playersMap[String(match.id)]) {
             match.players = playersMap[`gs-${gs.id}`];
          }
          // DO NOT ADD TO match.totalAmount, because tx.total already includes the rental cost in processOrder!
        } else {
          merged.push({
            id: `gs-${gs.id}`,
            type: "gs",
            customerName: userData.name,
            items: [],
            rentals: [{ 
              id: gs.id,
              name: gameName, 
              price: gs.cost,
              image: gameImage,
              duration: gs.duration ? `${gs.duration} Mins` : "120 Mins" 
            }],
            totalAmount: gs.cost,
            status: gs.status === 'Pending' ? 'paid' : (gs.status === 'Active' ? 'in_progress' : 'completed'),
            createdAt: gs.start_time,
            table: tableMap[gs.table_id] || gs.table_id || "A1",
            players: playersMap[`gs-${gs.id}`] || 1
          });
        }
      });
      
      const savedHidden = localStorage.getItem("sebangku_hidden_orders");
      const hiddenIds = savedHidden ? JSON.parse(savedHidden) : [];
      const visibleOrders = merged.filter(o => !hiddenIds.includes(String(o.id)));

      visibleOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(visibleOrders);
    } catch (e) {
      console.error(e);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const userId = authData.user.id;

      const { data: tablesData } = await supabase.from('cafe_tables').select('*');
      const tableMap: Record<string, string> = {};
      tablesData?.forEach((t: any) => tableMap[t.id] = String(t.table_no || t.name || t.id));

      const { data } = await supabase
        .from('game_sessions')
        .select(`
          id, duration, status, start_time, table_id, end_time, cost,
          boardgames (name, image)
        `)
        .eq('customer_id', userId)
        .in('status', ['Pending', 'Active'])
        .order('start_time', { ascending: false });

      const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
      };

      if (data) {
        const mapped = data.map((s: any) => {
          const endTimeStr = s.end_time.includes("Z") || s.end_time.includes("+") ? s.end_time : `${s.end_time}Z`;
          const endTime = new Date(endTimeStr).getTime();
          const now = new Date().getTime();
          let secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
          
          if (s.status === 'Pending') {
            secondsLeft = s.duration * 60;
          }

          const gameName = s.boardgames?.name || "Board Game";
          const exactFallbackGame = RENT_GAMES_FALLBACK.find(g => g.name.toLowerCase() === gameName.toLowerCase());
          const randomFallbackGame = RENT_GAMES_FALLBACK[hashString(gameName) % RENT_GAMES_FALLBACK.length];
          const gameImage = s.boardgames?.image || exactFallbackGame?.image || randomFallbackGame?.image || "";

          return {
            id: s.id,
            name: userData.name,
            table: tableMap[s.table_id] || s.table_id || "A1",
            game: gameName,
            image: gameImage,
            duration: `${s.duration} Mins`,
            secondsLeft: secondsLeft,
            cost: s.cost || 0,
            status: s.status === 'Pending' ? 'paid' : (s.status === 'Active' ? 'in_progress' : 'completed')
          };
        });
        setActiveSessions(prev => {
          return mapped.map(m => {
            const old = prev.find(p => p.id === m.id);
            // Preserve local smooth secondsLeft to prevent flickering if status hasn't changed
            if (old && old.status === m.status) {
              return { ...m, secondsLeft: old.secondsLeft };
            }
            return m;
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOrders();
    loadActiveSessions();
    const intervalData = setInterval(() => {
      loadOrders();
      loadActiveSessions();
    }, 5000); // Polling every 5 seconds for real-time updates

    // Live countdown timer syncing with localStorage
    const interval = setInterval(() => {
      setActiveSessions(prev => {
        if (prev.length === 0) return prev;
        const updated = prev.map(s => {
          if (s.secondsLeft > 0) {
            return { ...s, secondsLeft: s.secondsLeft - 1 };
          }
          return s;
        });

        // Sync back to localStorage
        const saved = localStorage.getItem("sebangku_sessions");
        if (saved) {
          const list = JSON.parse(saved);
          const newList = list.map((originalSession: any) => {
            const match = updated.find(u => u.id === originalSession.id);
            if (match) {
              return { ...originalSession, secondsLeft: match.secondsLeft };
            }
            return originalSession;
          });
          localStorage.setItem("sebangku_sessions", JSON.stringify(newList));
        }

        return updated;
      });
    }, 1000);

    return () => {
      clearInterval(intervalData);
      clearInterval(interval);
    };
  }, [userData.name]);

  const handleClearOrders = async () => {
    setIsClearing(true);
    try {
      const ordersToHide = orders.filter(o => {
        const s = String(o.status).toLowerCase();
        return s === 'completed' || s === 'acknowledged' || s === 'success' || s === 'cancelled';
      }).map(o => String(o.id));
      
      if (ordersToHide.length > 0) {
        const savedHidden = localStorage.getItem("sebangku_hidden_orders");
        const hiddenIds = savedHidden ? JSON.parse(savedHidden) : [];
        const newHidden = [...new Set([...hiddenIds, ...ordersToHide])];
        localStorage.setItem("sebangku_hidden_orders", JSON.stringify(newHidden));
      }
      setShowClearConfirm(false);
      showToast?.("Riwayat pesanan yang selesai berhasil dihapus.", "success", "Riwayat Dihapus");
      loadOrders();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast?.("Gagal menghapus riwayat pesanan: " + err.message, "error", "Terjadi Kesalahan");
    }
    setIsClearing(false);
  };

  const handleOpenReview = (order: any) => {
    // Trigger Review Modal without changing DB status
    setSelectedOrder(order);
    setRating(5);
    setComment("");
    setSuggestion("");
    setPhotoBase64(null);
    setGameStatus("WIN");
    setShowReviewModal(true);
  };

  const handleEndSessionFromOrder = async (order: any) => {
    try {
      if (order.rentals && order.rentals.length > 0) {
        for (const rental of order.rentals) {
          if (rental.id) {
            await supabase.from('game_sessions').update({ status: 'Completed', end_time: new Date().toISOString() }).eq('id', rental.id);
            // Get boardgame_id to update its status to Available
            const { data: sessionData } = await supabase.from('game_sessions').select('boardgame_id').eq('id', rental.id).single();
            if (sessionData?.boardgame_id) {
              await supabase.from('boardgames').update({ status: 'Available' }).eq('id', sessionData.boardgame_id);
            }
          }
        }
        showToast?.("Sesi permainan berhasil diakhiri.", "success", "Sesi Berakhir");
      }
      
      // Also hide it from history automatically based on user request
      const savedHidden = localStorage.getItem("sebangku_hidden_orders");
      const hiddenIds = savedHidden ? JSON.parse(savedHidden) : [];
      const newHidden = [...new Set([...hiddenIds, String(order.id)])];
      localStorage.setItem("sebangku_hidden_orders", JSON.stringify(newHidden));

      loadOrders();
      loadActiveSessions();
      if (onRefresh) onRefresh();
      
      handleOpenReview(order);
    } catch (e: any) {
      console.error("Gagal mengakhiri sesi dari pesanan", e);
      handleOpenReview(order);
    }
  };

  const handleCancelOrder = async (order: any) => {
    try {
      if (order.type === 'tx') {
        await supabase.from('transactions').update({ status: 'Cancelled' }).eq('id', order.id);
      }
      if (order.rentals && order.rentals.length > 0) {
        for (const rental of order.rentals) {
          if (rental.id) {
            const { data } = await supabase.from('game_sessions').select('boardgame_id').eq('id', rental.id).single();
            // Delete the game session entirely since "Cancelled" is not a valid enum value for session_status
            await supabase.from('game_sessions').delete().eq('id', rental.id);
            
            if (data?.boardgame_id) {
              await supabase.from('boardgames').update({ status: 'Available' }).eq('id', data.boardgame_id);
            }
          }
        }
      }
      
      const savedHidden = localStorage.getItem("sebangku_hidden_orders");
      const hiddenIds = savedHidden ? JSON.parse(savedHidden) : [];
      const newHidden = [...new Set([...hiddenIds, String(order.id)])];
      localStorage.setItem("sebangku_hidden_orders", JSON.stringify(newHidden));

      showToast?.("Pesanan berhasil dibatalkan dan dihapus dari riwayat.", "success", "Pesanan Dibatalkan");
      loadOrders();
      loadActiveSessions();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      showToast?.("Gagal membatalkan pesanan", "error", "Error");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        showToast?.("Ukuran foto melebihi batas 500KB. Pilih foto yang lebih kecil.", "warning", "Foto Terlalu Besar");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Collect item names from order
    const itemNames = [
      ...selectedOrder.items.map((i: any) => i.name),
      ...selectedOrder.rentals.map((r: any) => r.name)
    ];

    const newReview = {
      id: `REV-${Date.now()}`,
      orderId: selectedOrder.id,
      customerName: userData.name,
      rating,
      comment,
      photo: photoBase64,
      items: itemNames,
      gameSuggestion: suggestion,
      gameStatus: gameStatus,
      createdAt: new Date().toISOString(),
      isVisible: true
    };

    // Save game history to Supabase if it contains a rental
    if (selectedOrder.rentals?.length > 0) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData.user) {
          const rental = selectedOrder.rentals[0];
          const todayStr = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
          await supabase.from('customer_game_history').insert([{
            user_id: authData.user.id,
            name: userData.name,
            game_name: rental.name,
            game_image: rental.image || "",
            rating: rating,
            comment: comment,
            status: gameStatus,
            duration: rental.duration || "2 Hours",
            table_no: selectedOrder.table || "A1",
            table_name: selectedOrder.table || "A1",
            players: selectedOrder.players || 1,
            players_count: selectedOrder.players || 1,
            transaction_id: null, // Avoid UUID syntax error
            date: todayStr
          }]);
          
          await supabase.from('customer_visits').insert([{
            user_id: authData.user.id,
            date: todayStr,
            time: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            duration: rental.duration || "2 Hours",
            table_name: selectedOrder.table || "A1",
            friends: selectedOrder.players || 1,
            spending: selectedOrder.totalAmount || rental.price || 0,
            game_played: rental.name,
            game_image: rental.image || ""
          }]);
          
          const allDetails = [
            ...(selectedOrder.items || []).map((i: any) => ({ name: i.name, price: i.price, image: i.image })),
            ...(selectedOrder.rentals || []).map((r: any) => ({ name: r.name, price: r.price, image: r.image }))
          ];
          
          await supabase.from('customer_transactions').insert([{
            user_id: authData.user.id,
            date: todayStr,
            items: itemNames.join(" • "),
            items_summary: itemNames.join(" • "),
            amount: selectedOrder.totalAmount || rental.price || 0,
            method: selectedOrder.method || "Cash",
            payment_method: selectedOrder.method || "Cash",
            details: allDetails,
            table_no: selectedOrder.table || "A1",
            players_count: selectedOrder.players || 1,
            status: 'Completed'
          }]);
        }
      } catch (err) {
        console.error("Failed to insert into customer_game_history", err);
      }
    }

    const savedReviews = localStorage.getItem("sebangku_reviews");
    const reviewsList = savedReviews ? JSON.parse(savedReviews) : [];
    reviewsList.unshift(newReview);
    localStorage.setItem("sebangku_reviews", JSON.stringify(reviewsList));

    // Dispatch event
    window.dispatchEvent(new Event("storage"));

    setShowReviewModal(false);
    setSelectedOrder(null);
    
    // Refresh the history data so UI updates immediately
    if (onRefresh) onRefresh();
    
    showToast?.("Ulasan Anda berhasil dikirim. Terima kasih!", "success", "Ulasan Terkirim! 🎉");
  };

  const getStatusBadge = (status: string) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case "paid":
      case "pending":
        return <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100">PAID (Menunggu Kasir)</span>;
      case "acknowledged":
      case "success":
        return <span className="bg-yellow-50 text-yellow-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-100">DITERIMA</span>;
      case "in_progress":
      case "active":
        return <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 animate-pulse">BERJALAN (SESSION AKTIF)</span>;
      case "completed":
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-200">SELESAI</span>;
      case "cancelled":
        return <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200">DIBATALKAN</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{status}</span>;
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getDurationSeconds = (dur: string) => {
    if (dur === "1 Hour") return 3600;
    if (dur === "2 Hours") return 7200;
    if (dur === "3 Hours") return 10800;
    if (dur === "All Day") return 28800;
    return 7200;
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full text-left font-sans">
      <ConfirmClearModal
        isOpen={showClearConfirm}
        title="Hapus Riwayat Pesanan Selesai?"
        description="Semua pesanan yang telah selesai akan dihapus dari riwayat Anda. Pesanan aktif tidak akan terpengaruh."
        onConfirm={handleClearOrders}
        onCancel={() => setShowClearConfirm(false)}
        isLoading={isClearing}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Pesanan Saya</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Kelola status pemesanan, lihat sisa sesi board game, cetak bukti bayar, dan beri ulasan.</p>
        </div>
        {orders.some(o => {
          const s = String(o.status).toLowerCase();
          return s === 'completed' || s === 'acknowledged' || s === 'success' || s === 'cancelled';
        }) && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer shrink-0 mt-1"
          >
            <Trash2 size={13} /> Hapus Riwayat
          </button>
        )}
      </div>

      {/* ── Active Sessions Section ── */}
      {activeSessions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-[#94A3B8] uppercase tracking-wider">⏱️ Sesi Bermain Aktif Anda</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeSessions.map(session => {
              const totalSecs = getDurationSeconds(session.duration);
              const pct = Math.max(0, Math.min(100, (session.secondsLeft / totalSecs) * 100));
              const isEndingSoon = session.secondsLeft < 600; // < 10 mins

              return (
                <div key={session.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 shadow-inner border border-slate-200">
                    {session.image ? (
                       <img src={session.image} alt={session.game} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-2xl">🎲</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black text-[#0F172A]">{session.game}</h4>
                        <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">Meja: {session.table} · Paket: {session.duration}</p>
                      </div>
                      <span className={`text-xs font-black px-2 py-1 rounded-xl tracking-wider ${isEndingSoon ? "bg-red-50 text-red-500 border border-red-100 animate-pulse" : "bg-emerald-50 text-emerald-500 border border-emerald-100"
                        }`}>
                        {formatTime(session.secondsLeft)}
                      </span>
                    </div>

                    {/* Progress Bar only */}
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${isEndingSoon ? "bg-red-500" : "bg-emerald-500"
                            }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Order History List ── */}
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">ID PESANAN</span>
                <span className="text-xs font-bold text-[#0F172A]">{order.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase block text-right">TANGGAL</span>
                <span className="text-xs font-semibold text-[#64748B]">{new Date(order.createdAt).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Items display */}
            <div className="flex flex-col gap-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-center border border-slate-100 rounded-xl p-2.5 bg-slate-50">
                  <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-200">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#0F172A] truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.quantity}x @ Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <span className="font-black text-sm text-[#0F172A] shrink-0">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}

              {order.rentals.map((rental: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-center border border-blue-50/50 rounded-xl p-2.5 bg-blue-50/30">
                  <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white shadow-sm border border-blue-100">
                    {rental.image ? (
                      <img src={rental.image} alt={rental.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🎲</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#3B82F6] truncate flex items-center gap-1">
                       {rental.name}
                    </p>
                    <p className="text-[10px] text-blue-400 font-semibold">Durasi: {rental.duration || "2 Jam"}</p>
                  </div>
                  <span className="font-black text-sm text-[#3B82F6] shrink-0">Rp {rental.price.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-1">
              <div className="text-xs font-semibold text-slate-500">
                Total Tagihan: <span className="text-sm font-black text-[#3B82F6]">Rp {order.totalAmount.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex gap-2">
                {/* Print PDF Button */}
                <button
                  onClick={() => {
                    setReceiptOrder(order);
                    setShowReceiptModal(true);
                  }}
                  className="px-3.5 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} /> Cetak Receipt
                </button>

                {/* Cancel Button for Pending Orders */}
                {order.status === 'paid' && (
                  <button
                    onClick={() => handleCancelOrder(order)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <X size={14} /> Batalkan Pesanan
                  </button>
                )}

                {/* Review Button for completed/acknowledged/in_progress orders */}
                {(order.status === "acknowledged" || order.status === "completed" || order.status === "success" || order.status === "in_progress") && (
                  (() => {
                    const savedReviews = localStorage.getItem("sebangku_reviews");
                    const reviewsList = savedReviews ? JSON.parse(savedReviews) : [];
                    const isReviewed = reviewsList.some((r: any) => String(r.orderId) === String(order.id));
                    
                    if (isReviewed) {
                      return (
                        <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl shadow-sm border border-slate-200 cursor-not-allowed">
                          Selesai
                        </button>
                      );
                    }
                    
                    return (
                      <button
                        onClick={() => handleEndSessionFromOrder(order)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        {order.rentals && order.rentals.length > 0 ? "Akhiri Sesi & Beri Ulasan" : "Beri Ulasan"}
                      </button>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center text-[#94A3B8] text-sm">
            Belum ada pesanan aktif. Silakan menuju tab "Pesan &amp; Bayar".
          </div>
        )}
      </div>

      {/* Review Modal Form */}
      <AnimatePresence>
        {showReviewModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative my-8"
            >
              <button
                onClick={() => { setShowReviewModal(false); setSelectedOrder(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-black text-[#0F172A] mb-1">Berikan Ulasan</h2>
              <p className="text-xs text-[#64748B] mb-5">Beri ulasan untuk pesanan game/F&amp;B di {selectedOrder.id}</p>

              <form onSubmit={submitReview} className="flex flex-col gap-4">
                {/* Stars Rating */}
                <div className="flex flex-col items-center gap-1.5 my-2">
                  <span className="text-xs font-bold text-slate-500">Rating Pengalaman Anda</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl text-amber-400 focus:outline-none cursor-pointer transform active:scale-95 transition-all"
                      >
                        {star <= rating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Game Status Win/Lose Toggle */}
                {selectedOrder?.rentals?.length > 0 && (
                  <div className="flex flex-col items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Hasil Bermain (Opsional)</span>
                    <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => setGameStatus("WIN")}
                        className={`flex-1 py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
                          gameStatus === "WIN" ? "bg-emerald-500 text-white shadow-sm" : "text-[#64748B] hover:bg-white"
                        }`}
                      >
                        Menang
                      </button>
                      <button
                        type="button"
                        onClick={() => setGameStatus("LOSE")}
                        className={`flex-1 py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
                          gameStatus === "LOSE" ? "bg-red-500 text-white shadow-sm" : "text-[#64748B] hover:bg-white"
                        }`}
                      >
                        Kalah
                      </button>
                    </div>
                  </div>
                )}

                {/* Comment textarea */}
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1.5">Komentar / Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Bagaimana pelayanan, makanan, atau keseruan board game yang Anda mainkan?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] text-[#0F172A]"
                  />
                </div>

                {/* Game Suggestion */}
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1.5">Usul Game Baru (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Splendor, Dixit, Exploding Kittens..."
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] text-[#0F172A]"
                  />
                </div>

                {/* Photo Upload (Base64) */}
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1.5">Unggah Foto (Opsional, Maks 500KB)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-bold text-[#64748B] transition-colors">
                      <Camera size={14} /> Pilih Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {photoBase64 && (
                      <div className="relative w-12 h-12 rounded-lg border overflow-hidden shrink-0">
                        <img src={photoBase64} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotoBase64(null)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow transition-colors flex items-center justify-center gap-1 cursor-pointer mt-2"
                >
                  <Send size={12} /> Kirim Ulasan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Printable Receipt Modal ── */}
      <AnimatePresence>
        {showReceiptModal && receiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto no-print">
            <style dangerouslySetInnerHTML={{
              __html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #customer-print-receipt, #customer-print-receipt * {
                  visibility: visible !important;
                }
                #customer-print-receipt {
                  position: absolute !important;
                  left: 50% !important;
                  top: 0 !important;
                  transform: translateX(-50%) !important;
                  width: 80mm !important;
                  max-width: 80mm !important;
                  box-shadow: none !important;
                  border: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative my-8"
              id="customer-print-receipt"
            >
              <button
                onClick={() => { setShowReceiptModal(false); setReceiptOrder(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer no-print"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <img src={sebangkuLogo} alt="Logo" className="w-10 h-10 object-contain mb-2" />
                <h4 className="text-base font-black text-[#0F172A] tracking-tight">BoardVerse Cafe</h4>
                <p className="text-[10px] text-[#64748B] font-medium leading-none mt-1">Jl. Sebangku No. 24, Yogyakarta</p>
                <p className="text-[10px] text-[#94A3B8] font-medium mt-1">
                  {new Date(receiptOrder.createdAt).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="w-full border-t border-dashed border-[#CBD5E1] my-4" />

              <div className="text-[11px] text-[#334155] flex flex-col gap-2.5">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Customer: {receiptOrder.customerName}</span>
                  <span>Meja: {receiptOrder.table}</span>
                </div>
                <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">ID: {receiptOrder.id}</div>

                <div className="w-full border-t border-[#F1F5F9] my-2" />

                {receiptOrder.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-[#1E293B]">{it.quantity}× {it.name}</span>
                    <span className="font-bold text-slate-700 shrink-0">Rp {(it.price * it.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}

                {receiptOrder.rentals?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-baseline gap-2 text-[#2563EB] italic">
                    <span>Game Sewa — {it.name} ({it.duration || "2 Jam"})</span>
                    <span className="font-bold shrink-0">Rp {it.price.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="w-full border-t border-dashed border-[#CBD5E1] my-4" />

              <div className="text-[11px] text-[#64748B] flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm font-black text-[#0F172A] mt-2 pt-2 border-t border-dashed border-[#E2E8F0]">
                  <span>TOTAL BAYAR</span>
                  <span className="text-base text-[#3B82F6]">Rp {receiptOrder.totalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="text-center mt-4 text-[10px] font-bold text-[#64748B] tracking-wide">
                Metode Pembayaran: <span className="text-[#0F172A] font-extrabold">{receiptOrder.paymentMethod}</span>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} /> Cetak PDF / Printer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Placeholder Page ──
function PlaceholderPage({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-6">
      <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#3B82F6]">
        {icon}
      </div>
      <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-[#0F172A]">
        {title}
      </h2>
      <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-sm text-[#64748B] text-center max-w-xs">
        Halaman ini sedang dalam pengembangan. Segera hadir!
      </p>
    </div>
  );
}

// ─── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileBottomNav({
  active, onNavigate,
}: {
  active: string;
  onNavigate: (path: string) => void;
}) {
  const mobileNavItems = [
    { id: "profil", Icon: User, label: "Profil" },
    { id: "pesan", Icon: ShoppingBag, label: "Pesan" },
    { id: "pesanan", Icon: Package, label: "Pesanan" },
    { id: "history", Icon: Gamepad2, label: "Game" },
    { id: "transaksi", Icon: Receipt, label: "Transaksi" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white md:hidden"
      style={{ borderTop: "1px solid #E2E8F0", paddingBottom: "env(safe-area-inset-bottom)", boxShadow: "0 -4px 24px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-stretch">
        {mobileNavItems.map((item) => {
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center py-2 pt-0 relative cursor-pointer gap-0.5"
              style={{ minHeight: "60px" }}
            >
              <div className="absolute top-0 left-2 right-2 h-[2.5px] overflow-hidden rounded-full">
                {isActive && (
                  <motion.div layoutId="mobile-nav-line" className="w-full h-full bg-[#3B82F6] rounded-full" />
                )}
              </div>
              <div className="mt-2">
                <item.Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} color={isActive ? "#3B82F6" : "#94A3B8"} />
              </div>
              <span className="text-[10px]" style={{
                fontFamily: "'Poppins', sans-serif",
                color: isActive ? "#3B82F6" : "#94A3B8",
                fontWeight: isActive ? 700 : 500,
              }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CUSTOMER APP (Self-contained Layout) ────────────────────────────────────
export default function CustomerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("profil");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifCount, setNotifCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, category: "Waktu Sewa", text: "Sesi bermain Anda di Table A1 tinggal 10 menit lagi.", time: "5 menit yang lalu", isUnread: true, type: "waktu" },
    { id: 2, category: "Game Tersedia", text: "Board Game 'Kraken Attack' sekarang telah tersedia untuk disewa!", time: "1 jam yang lalu", isUnread: true, type: "game" },
    { id: 3, category: "Sewa Sukses", text: "Sewa board game 'Mysterium Kids' telah disetujui oleh kasir.", time: "2 jam yang lalu", isUnread: true, type: "sewa" }
  ]);

  // Real-time interactive user data state synced across layout & pages
  const [userData, setUserData] = useState(DEFAULT_USER);
  const [historyGames, setHistoryGames] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // ─ Global Toast ─
  const { toasts, showToast, removeToast } = useToast();

  const handleNotify = useCallback((category: string, text: string, type: string) => {
    const newNotif = {
      id: Date.now(),
      category,
      text,
      time: "Baru saja",
      isUnread: true,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    setNotifCount(c => c + 1);
  }, []);

  const fetchCustomerData = useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const userId = authData.user.id;
      
      // Fetch profile
      const { data: profile, error: profileErr } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (profile && !profileErr) {
        setUserData(prev => ({
          ...prev,
          firstName: profile.nama_depan || prev.firstName,
          lastName: profile.nama_belakang || prev.lastName,
          name: `${profile.nama_depan || ''} ${profile.nama_belakang || ''}`.trim() || prev.name,
          phone: profile.phone || prev.phone,
          birthDate: profile.tanggal_lahir || prev.birthDate,
          status: profile.status || prev.status,
          kunjungan: profile.kunjungan !== undefined ? profile.kunjungan : prev.kunjungan,
          waktuJam: profile.waktu_bermain !== undefined ? profile.waktu_bermain : prev.waktuJam,
          winRate: profile.win_rate !== undefined ? profile.win_rate : prev.winRate,
          level: profile.level !== undefined ? profile.level : prev.level,
          memberSince: profile.member_sejak || prev.memberSince,
        }));
      }

      // Fetch transactions
      const { data: txData } = await supabase
        .from('customer_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (txData) {
        setTransactions(txData.map((tx: any) => ({
          id: tx.id,
          date: new Date(tx.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
          items: tx.items_summary || "",
          amount: tx.amount || 0,
          method: tx.payment_method || "",
          details: tx.details || []
        })));
        
        // We will fetch visits from customer_visits directly now.
      }

      // Fetch visits directly from customer_visits
      const { data: visitData } = await supabase
        .from('customer_visits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (visitData && visitData.length > 0) {
        let totalBelanja = 0;
        setVisits(visitData.map((v: any) => {
          totalBelanja += v.spending || 0;
          return {
            id: v.id,
            date: v.date || new Date(v.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: v.time || new Date(v.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            gameName: v.game_played || "Kunjungan Cafe", 
            gameImage: v.game_image || "", 
            duration: v.duration || "1h 00m",
            table: v.table_name || "A1", 
            friends: v.friends || 1,
            spending: v.spending || 0
          };
        }));
        
        const totalTransaksi = txData?.length || 0;
        const rataRataKunjungan = totalTransaksi > 0 ? Math.round(totalBelanja / totalTransaksi) : 0;
        setUserData(prev => ({
          ...prev,
          totalBelanjaFNB: totalBelanja,
          totalTransaksi: totalTransaksi,
          rataRataKunjungan: rataRataKunjungan
        }));
      } else if (txData) {
        // Fallback for old data
        let totalBelanja = 0;
        let totalTransaksi = txData.length;
        
        setVisits(txData.map((tx: any) => {
          totalBelanja += tx.amount || 0;
          const rental = tx.details?.find((i: any) => i.id?.startsWith("g"));
          return {
            id: tx.id,
            date: new Date(tx.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(tx.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            gameName: rental ? rental.name : "Kunjungan Cafe", 
            gameImage: rental ? rental.image : "", 
            duration: rental ? (rental.duration || "2 Hours") : "1h 00m",
            table: (tx.table_no && tx.table_no.length > 10) ? "A1" : (tx.table_no || "A1"), 
            friends: tx.players_count || 1,
            spending: tx.amount || 0
          };
        }));
        
        const rataRataKunjungan = totalTransaksi > 0 ? Math.round(totalBelanja / totalTransaksi) : 0;
        setUserData(prev => ({
          ...prev,
          totalBelanjaFNB: totalBelanja,
          totalTransaksi: totalTransaksi,
          rataRataKunjungan: rataRataKunjungan
        }));
      }

      // Fetch game history
      const { data: gameData } = await supabase
        .from('customer_game_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (gameData) {
        let totalMenang = 0;
        let gameDicoba = new Set<string>();
        let gameCounts: Record<string, { count: number, image: string }> = {};
        
        const mappedGames = gameData.map((g: any) => {
          if (g.status === "WIN") totalMenang++;
          if (g.game_name) {
            gameDicoba.add(g.game_name);
            const currentImg = g.game_image || "";
            if (!gameCounts[g.game_name]) {
              gameCounts[g.game_name] = { count: 1, image: currentImg };
            } else {
              gameCounts[g.game_name].count++;
              if (currentImg && !gameCounts[g.game_name].image) gameCounts[g.game_name].image = currentImg;
            }
          }
          return {
            id: g.id,
            name: g.game_name || "",
            image: g.game_image || "",
            date: new Date(g.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            duration: g.duration || "1h",
            table: (g.table_no && g.table_no.length > 10) ? "A1" : (g.table_no || "A1"),
            players: g.players_count || 1,
            status: g.status || "WIN",
            rating: g.rating || 5,
            comment: g.comment || "Seru banget!"
          };
        });
        
        setHistoryGames(mappedGames);
        
        const sortedGames = Object.entries(gameCounts)
          .sort((a,b) => b[1].count - a[1].count)
          .slice(0, 3)
          .map((entry, index) => ({
            rank: index + 1,
            name: entry[0],
            image: entry[1].image
          }));
        
        let favorit = sortedGames.length > 0 ? sortedGames[0].name : "Belum ada";
        
        setUserData(prev => ({
          ...prev,
          totalMenang: totalMenang,
          gameDicoba: gameDicoba.size,
          gameFavorit: favorit || prev.gameFavorit,
          favGames: sortedGames.length > 0 ? sortedGames : prev.favGames,
          streakHari: txData?.length ? new Set(txData.map((t:any) => new Date(t.created_at).toDateString())).size : prev.streakHari
        }));
      }

    } catch (err) {
      console.error("Failed to fetch customer data:", err);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();

    // Subscribe to transaction updates for real-time notifications
    const channel = supabase
      .channel('customer-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'customer_transactions' }, (payload: any) => {
        if (payload.new.status === 'in_progress') {
          const newNotif = {
            id: Date.now(),
            category: "Pesanan Diproses",
            text: `Pesanan Anda sedang diproses oleh kasir.`,
            time: "Baru saja",
            isUnread: true,
            type: "check"
          };
          setNotifications(prev => [newNotif, ...prev]);
          setNotifCount(c => c + 1);
        } else if (payload.new.status === 'completed') {
          const newNotif = {
            id: Date.now(),
            category: "Pesanan Selesai",
            text: `Pesanan Anda telah selesai.`,
            time: "Baru saja",
            isUnread: true,
            type: "check"
          };
          setNotifications(prev => [newNotif, ...prev]);
          setNotifCount(c => c + 1);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'customer_game_history' }, (payload: any) => {
         if (payload.new.status === 'in_progress') {
          const newNotif = {
            id: Date.now(),
            category: "Sesi Bermain Dimulai",
            text: `Kasir telah memulai sesi bermain Anda untuk game ${payload.new.game_name}.`,
            time: "Baru saja",
            isUnread: true,
            type: "game"
          };
          setNotifications(prev => [newNotif, ...prev]);
          setNotifCount(c => c + 1);
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCustomerData]);

  const tableId = searchParams.get("table") || "T01";

  // Sync active page with URL
  useEffect(() => {
    const segment = location.pathname.split("/").pop();
    const found = NAV_ITEMS.find(n => n.path === segment);
    if (found) setActivePage(found.id);
    else setActivePage("profil");
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    setActivePage(path);
    navigate(`/app/customer/${path}`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const renderPage = () => {
    switch (activePage) {
      case "profil": return <ProfilPage userData={userData} setUserData={setUserData} showToast={showToast} />;
      case "pesan": return <PesanPage userData={userData} onOrderSuccess={fetchCustomerData} onNotify={handleNotify} showToast={showToast} />;
      case "pesanan": return <PesananPage userData={userData} onRefresh={fetchCustomerData} showToast={showToast} />;
      case "history": return <HistoryPage searchQuery={searchQuery} data={historyGames} onClearHistory={fetchCustomerData} showToast={showToast} />;
      case "kunjungan": return <KunjunganPage searchQuery={searchQuery} data={visits} onClearHistory={fetchCustomerData} showToast={showToast} />;
      case "transaksi": return <TransaksiPage searchQuery={searchQuery} data={transactions} userData={userData} onClearHistory={fetchCustomerData} showToast={showToast} />;
      case "statistik": return <StatistikPage gamesData={historyGames} visitsData={visits} />;
      default: return <ProfilPage userData={userData} setUserData={setUserData} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── TOAST NOTIFICATIONS ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-[220px] shrink-0 flex-col"
        style={{
          background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 40
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={sebangkuLogo} alt="Sebangku" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <div>
            <p className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
              BoardVerse
            </p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Game Cafe</p>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <AvatarCircle name={userData.name} size={40} fontSize={14} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{userData.name}</p>
              <p className="text-white/50 text-[11px]">Regular · LVL {userData.level}</p>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest px-2 mb-3">Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left cursor-pointer transition-all"
                style={{
                  background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                  color: isActive ? "#60A5FA" : "rgba(255,255,255,0.55)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-[#3B82F6] rounded-r-full"
                  />
                )}
                <item.Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} />
                <span className="text-sm font-semibold">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <LogOut size={16} />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 flex flex-col md:hidden"
              style={{ background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)" }}
            >
              {/* Close */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={sebangkuLogo} alt="Sebangku" style={{ width: 32, height: 32, objectFit: "contain" }} />
                  <p className="text-white font-black text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Sebangku</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              {/* User */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                <AvatarCircle name={userData.name} size={38} fontSize={13} />
                <div>
                  <p className="text-white text-sm font-bold">{userData.name}</p>
                  <p className="text-white/50 text-[11px]">Regular · LVL {userData.level}</p>
                </div>
              </div>
              {/* Nav */}
              <nav className="flex-1 px-3 py-3 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left cursor-pointer"
                      style={{
                        background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                        color: isActive ? "#60A5FA" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      <item.Icon size={16} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="px-3 pb-5">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  <LogOut size={16} />
                  <span className="text-sm font-semibold">Keluar</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[220px]">

        {/* ── TOP BAR ── */}
        <header
          className="sticky top-0 z-30 bg-white flex items-center gap-3 px-4 md:px-6 h-14"
          style={{ borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game, transaksi..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] text-[#0F172A] placeholder:text-[#CBD5E1]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Date — hidden on mobile */}
            <span className="hidden md:block text-xs text-[#64748B] font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {todayLabel()}
            </span>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNotifCount(0); // Clear badge on open
                }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] cursor-pointer transition-colors"
              >
                <Bell size={18} className="text-[#64748B]" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[9px] text-white font-black">{notifCount}</span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 p-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                      <span className="font-bold text-sm text-[#0F172A]">Notifikasi</span>
                      <button
                        onClick={() => {
                          setNotifications([]);
                          setNotifCount(0);
                        }}
                        className="text-[10px] font-bold text-[#3B82F6] hover:underline cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    </div>

                    <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative"
                          onClick={() => {
                            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isUnread: false } : item));
                            if (n.isUnread) {
                              setNotifCount(c => Math.max(0, c - 1));
                            }
                          }}
                        >
                          {/* Icon Avatar */}
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-[#3B82F6]">
                            {n.type === "waktu" ? (
                              <Clock size={16} />
                            ) : n.type === "game" ? (
                              <Gamepad2 size={16} />
                            ) : (
                              <Check size={16} />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs font-bold text-[#0F172A]">{n.category}</p>
                            <p className="text-[11px] text-[#64748B] leading-normal mt-0.5">{n.text}</p>
                            <span className="text-[10px] text-[#94A3B8] font-medium mt-1 block">{n.time}</span>
                          </div>

                          {/* Unread indicator dot */}
                          {n.isUnread && (
                            <span className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                          )}
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-xs">
                          Tidak ada notifikasi baru.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <button
              onClick={() => handleNavigate("profil")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <AvatarCircle name={userData.name} size={36} fontSize={13} />
            </button>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <MobileBottomNav active={activePage} onNavigate={handleNavigate} />

      {/* ── TOAST NOTIFICATIONS ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}