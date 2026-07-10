import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Gamepad2, Calendar, Receipt, BarChart2, LogOut,
  Bell, Search, Menu, X, Edit2, Flame, Trophy, Target, Zap,
  ChevronRight, Phone, Mail, Check, Save, Undo2, Clock, Users, Package, CreditCard,
  FileText, ChevronDown, Utensils, Compass, Award, Star, Moon, Shield, Gem, Brain, Dices,
  ShoppingBag, Plus, Minus, Camera, CheckCircle, Send, Printer
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

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
const MOCK_USER = {
  name: "Andi Saputra",
  firstName: "Andi",
  lastName: "Saputra",
  email: "andi@sebangku.com",
  phone: "081234567890",
  birthDate: "1995-03-15", // formatted for date inputs
  memberSince: "Maret 2024",
  level: 12,
  levelLabel: "Regular Player",
  kunjungan: 24,
  waktuJam: 48,
  winRate: 70,
  streakHari: 5,
  totalMenang: 17,
  gameDicoba: 8,
  achievement: "6/12",
  status: "Active · Regular",
  favGames: [
    { rank: 1, name: "Lucky Captain", image: luckyCapImg },
    { rank: 2, name: "Detective Charlie", image: detCharImg },
    { rank: 3, name: "Mysterium Kids", image: mystKidsImg },
  ],
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
  { id: "g1", name: "Mysterium Kids", price: 15000, category: "Cooperative", emoji: "🎲", image: mystKidsImg },
  { id: "g2", name: "Lucky Captain", price: 12000, category: "Strategy", emoji: "🚂", image: luckyCapImg },
  { id: "g3", name: "Kraken Attack", price: 12000, category: "Strategy", emoji: "🦠", image: krakenAttImg },
  { id: "g4", name: "Sleepy Castle", price: 10000, category: "Strategy", emoji: "🏠", image: sleepyCasImg },
  { id: "g5", name: "Detective Charlie", price: 8000, category: "Strategy", emoji: "👑", image: detCharImg },
  { id: "g6", name: "Ruben Rallye", price: 8000, category: "Family", emoji: "🕵️", image: rubenRalImg },
  { id: "g7", name: "Waroong Wars", price: 15000, category: "Strategy", emoji: "🐦", image: waroongWarsImg },
  { id: "g8", name: "Fold it", price: 10000, category: "Party", emoji: "🌲", image: foldItImg },
  { id: "g9", name: "Slide Quest", price: 10000, category: "Party", emoji: "🛡️", image: slideQuestImg },
  { id: "g10", name: "Gold Am Orinoko", price: 12000, category: "Strategy", emoji: "🥇", image: goldOrinImg },
  { id: "g11", name: "4 in a Row On The Go", price: 5000, category: "Family", emoji: "🔘", image: fourRowImg },
  { id: "g12", name: "Magic Maze", price: 12000, category: "Strategy", emoji: "🧙", image: magicMazeImg },
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

// ─── PAGES ───────────────────────────────────────────────────────────────────

// ── Profil Page ──
interface ProfilPageProps {
  userData: typeof MOCK_USER;
  setUserData: React.Dispatch<React.SetStateAction<typeof MOCK_USER>>;
}

function ProfilPage({ userData, setUserData }: ProfilPageProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = () => {
    setUserData(prev => ({
      ...prev,
      ...editForm,
      name: `${editForm.firstName} ${editForm.lastName}`.trim(),
    }));
    setIsEditing(false);
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white text-xs font-bold hover:bg-[#2563EB] transition-colors cursor-pointer shadow-sm"
              >
                <Save size={12} /> Simpan
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

// ── History Game Page ──
function HistoryPage({ searchQuery }: { searchQuery: string }) {
  const filteredHistoryGames = useMemo(() => {
    return MOCK_HISTORY_GAMES.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.comment.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const stats = [
    { id: "total_sesi", value: 8, label: "Total Sesi", icon: Gamepad2, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "total_menang", value: 5, label: "Total Menang", icon: Trophy, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "game_unik", value: 8, label: "Game Unik", icon: Package, color: "#3B82F6", bg: "#EFF6FF" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">History Game</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">History Game</h1>
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
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${game.table.includes("A") ? "bg-red-50 text-red-500" :
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
        <div className="text-center py-12 text-[#64748B] text-sm">
          Tidak ada riwayat game yang cocok dengan pencarian.
        </div>
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

// ── Kunjungan Page ──
function KunjunganPage({ searchQuery }: { searchQuery: string }) {
  const filteredVisits = useMemo(() => {
    return MOCK_VISITS.filter(visit =>
      visit.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.table.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const stats = [
    { id: "total_kunjungan", value: "24", label: "Total Kunjungan", icon: Calendar, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "bulan_ini", value: "4", label: "Bulan Ini", icon: Calendar, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "total_durasi", value: "48h", label: "Total Durasi", icon: Clock, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "total_belanja", value: "Rp 1.2Jt", label: "Total Belanja", icon: CreditCard, color: "#3B82F6", bg: "#EFF6FF" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">History Kunjungan</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">History Kunjungan</h1>
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
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${visit.table.includes("A") ? "bg-red-50 text-red-500" :
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
                  <td colSpan={6} className="p-8 text-center text-[#64748B] text-sm">
                    Tidak ada riwayat kunjungan yang cocok dengan pencarian.
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
    items: "Nasi Goreng · Sleepy Castle 1h Rental", 
    amount: 57000, 
    method: "Cash",
    details: [
      { name: "Nasi Goreng", price: 22000, image: "https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?w=200&fit=crop&q=80" },
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

// ── Transaksi Page ──
function TransaksiPage({ searchQuery }: { searchQuery: string }) {
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [expandedTx, setExpandedTx] = useState<number | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx =>
      tx.items.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const stats = [
    { id: "total_fnb", value: "Rp 345,000", label: "Total Belanja F&B", icon: Utensils, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "total_tx", value: "5 kali", label: "Total Transaksi", icon: Receipt, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "avg_kunjungan", value: "Rp 69,000", label: "Rata-rata / Kunjungan", icon: BarChart2, color: "#3B82F6", bg: "#EFF6FF" }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">BoardVerse</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">Riwayat Transaksi</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Riwayat Transaksi</h1>
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
        <h2 className="text-base font-bold text-[#0F172A] mb-6">Riwayat Pembelian F&B</h2>
        
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
                      <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full mt-1.5 ${
                        tx.method === "QRIS" ? "bg-blue-50 text-[#3B82F6]" :
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
                        {tx.details.map((detail, idx) => (
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
            <div className="text-center py-10 text-[#64748B] text-sm">
              Tidak ada riwayat transaksi yang cocok dengan pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Statistik Page ──
function StatistikPage() {
  // Mock Data for Bar Chart
  const topGames = [
    { name: "Mysterium Kids", count: 8, color: "#EF4444", pct: 100 },
    { name: "Lucky Captain", count: 6, color: "#F59E0B", pct: 75 },
    { name: "Kraken Attack", count: 5, color: "#8B5CF6", pct: 62.5 },
    { name: "Sleepy Castle", count: 4, color: "#3B82F6", pct: 50 },
    { name: "Detective Charlie", count: 3, color: "#F97316", pct: 37.5 }
  ];

  // Mock Data for Achievements
  const achievements = [
    { id: 1, name: "First Victory", label: "First Victory", icon: Trophy, earned: true, statusText: "Diraih" },
    { id: 2, name: "On Fire", label: "On Fire", icon: Flame, earned: true, statusText: "Diraih" },
    { id: 3, name: "Dice Master", label: "Dice Master", icon: Dices, earned: true, statusText: "Diraih" },
    { id: 4, name: "Team Player", label: "Team Player", icon: Users, earned: true, statusText: "Diraih" },
    { id: 5, name: "Speed Runner", label: "Speed Runner", icon: Zap, earned: true, statusText: "Diraih" },
    { id: 6, name: "Explorer", label: "Explorer", icon: Compass, earned: true, statusText: "Diraih" },
    
    { id: 7, name: "Cafe Regular", label: "Cafe Regular", icon: Award, earned: false, current: 24, total: 50 },
    { id: 8, name: "Legend", label: "Legend", icon: Star, earned: false, current: 24, total: 50 },
    { id: 9, name: "Grand Strategist", label: "Grand Strategist", icon: Brain, earned: false, current: 12, total: 30 },
    { id: 10, name: "Night Owl", label: "Night Owl", icon: Moon, earned: false, current: 3, total: 10 },
    { id: 11, name: "Solo Warrior", label: "Solo Warrior", icon: Shield, earned: false, current: 7, total: 15 },
    { id: 12, name: "Diamond Member", label: "Diamond Member", icon: Gem, earned: false, current: 48, total: 100 }
  ];

  // Activity Grid (7 days x 10 weeks)
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const activityData = [
    [1, 1, 2, 1, 1, 1, 2, 1, 1, 1], // Sen
    [1, 2, 1, 2, 1, 1, 1, 2, 1, 1], // Sel
    [1, 1, 2, 1, 2, 1, 1, 1, 2, 1], // Rab
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Kam
    [3, 4, 3, 4, 3, 4, 3, 4, 3, 4], // Jum
    [4, 4, 3, 4, 4, 3, 4, 4, 3, 4], // Sab
    [2, 3, 2, 2, 1, 2, 2, 1, 2, 2]  // Min
  ];

  const stats = [
    { id: "total_waktu", value: "48 jam", label: "Total Waktu Bermain", icon: Clock, color: "#3B82F6", bg: "#EFF6FF", sub: "+6h bulan ini" },
    { id: "total_menang", value: "17 dari 24", label: "Total Menang", icon: Trophy, color: "#3B82F6", bg: "#EFF6FF", sub: "Win rate 70%" },
    { id: "avg_sesi", value: "1h 54m", label: "Rata-rata Sesi", icon: Calendar, color: "#3B82F6", bg: "#EFF6FF", sub: "Per kunjungan" }
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

      {/* Top Row: Chart Grid */}
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
                      className={`flex-1 h-4 rounded transition-all hover:scale-110 cursor-pointer ${
                        lvl === 1 ? "bg-[#EFF6FF] border border-[#E2E8F0]" :
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

    </div>
  );
}

// ── Pesan Page ──
interface PesanPageProps {
  userData: typeof MOCK_USER;
}

function PesanPage({ userData }: PesanPageProps) {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "A1";

  const [products] = useState<any[]>(() => {
    const saved = localStorage.getItem("sebangku_products");
    return saved ? JSON.parse(saved) : PRODUCTS_FALLBACK;
  });

  const [rentGames] = useState<any[]>(() => {
    const saved = localStorage.getItem("sebangku_rent_games");
    return saved ? JSON.parse(saved) : RENT_GAMES_FALLBACK;
  });

  const [activeTab, setActiveTab] = useState<"f&b" | "rent">("f&b");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "Cash">("QRIS");
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [qrisStatus, setQrisStatus] = useState<"pending" | "success">("pending");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  const categories = useMemo(() => {
    if (activeTab === "f&b") {
      return ["All", "Food", "Drinks", "Snacks"];
    }
    return ["All", "Strategy", "Family", "Cooperative", "Party"];
  }, [activeTab]);

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
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === "QRIS") {
      setQrisStatus("pending");
      setShowQRISModal(true);
    } else {
      processOrder();
    }
  };

  const processOrder = () => {
    const now = new Date();
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    
    // Split items into food & beverage and game rental
    const fnbItems = cart.filter(i => i.id.startsWith("p"));
    const rentalItems = cart.filter(i => i.id.startsWith("g"));

    const newOrder = {
      id: orderId,
      customerName: userData.name,
      customerPhone: userData.phone,
      items: fnbItems,
      rentals: rentalItems,
      totalAmount: cartTotal,
      paymentMethod,
      status: "paid", // auto paid
      createdAt: now.toISOString(),
      table: tableId
    };

    // Save to localStorage
    const savedOrders = localStorage.getItem("sebangku_customer_orders");
    const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    ordersList.unshift(newOrder);
    localStorage.setItem("sebangku_customer_orders", JSON.stringify(ordersList));

    // Dispatch storage event to alert Kasir
    window.dispatchEvent(new Event("storage"));

    setLastOrderId(orderId);
    setCart([]);
    setShowSuccess(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Catalog Panel */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">Menu &amp; Game Rental</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Pesan F&amp;B atau sewa Board Game langsung dari meja {tableId}</p>
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
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <Plus size={12} /> Tambah
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {itemsToDisplay.length === 0 && (
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
          <p className="text-xs text-[#64748B] mt-0.5">Meja: {tableId} · Customer: {userData.name}</p>
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
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle size={14} />
              Bayar Sekarang
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
                    onClick={() => {
                      setQrisStatus("success");
                      setTimeout(() => {
                        setShowQRISModal(false);
                        processOrder();
                      }, 1000);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Simulasikan Pembayaran Sukses
                  </button>
                )}
                <button
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
    </div>
  );
}

// ── Pesanan Page ──
function PesananPage({ userData }: { userData: typeof MOCK_USER }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Print receipt states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<any>(null);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const loadOrders = () => {
    const saved = localStorage.getItem("sebangku_customer_orders");
    if (saved) {
      const list = JSON.parse(saved);
      // Filter orders by customer name
      const filtered = list.filter((o: any) => o.customerName === userData.name);
      setOrders(filtered);
    }
  };

  const loadActiveSessions = () => {
    const saved = localStorage.getItem("sebangku_sessions");
    if (saved) {
      const list = JSON.parse(saved);
      const filtered = list.filter((s: any) => s.name === userData.name && s.secondsLeft > 0);
      setActiveSessions(filtered);
    } else {
      setActiveSessions([]);
    }
  };

  useEffect(() => {
    loadOrders();
    loadActiveSessions();
    // Storage event sync
    const handleStorage = () => {
      loadOrders();
      loadActiveSessions();
    };
    window.addEventListener("storage", handleStorage);

    // Live countdown timer syncing with localStorage
    const interval = setInterval(() => {
      setActiveSessions(prev => {
        if (prev.length === 0) return prev;
        const updated = prev.map(s => {
          if (s.secondsLeft > 0) {
            return { ...s, secondsLeft: s.secondsLeft - 1 };
          }
          return s;
        }).filter(s => s.secondsLeft > 0);

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
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [userData.name]);

  const handleMarkComplete = (order: any) => {
    const saved = localStorage.getItem("sebangku_customer_orders");
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map((o: any) => {
        if (o.id === order.id) {
          return { ...o, status: "completed" };
        }
        return o;
      });
      localStorage.setItem("sebangku_customer_orders", JSON.stringify(updated));
      setOrders(updated.filter((o: any) => o.customerName === userData.name));

      // Also mark any sessions linked to this table/name complete (set to 0)
      const savedSessions = localStorage.getItem("sebangku_sessions");
      if (savedSessions) {
        const sessionsList = JSON.parse(savedSessions);
        const updatedSessions = sessionsList.map((s: any) => {
          if (s.name === userData.name && s.table === order.table) {
            return { ...s, secondsLeft: 0 };
          }
          return s;
        });
        localStorage.setItem("sebangku_sessions", JSON.stringify(updatedSessions));
      }

      window.dispatchEvent(new Event("storage"));

      // Trigger Review Modal
      setSelectedOrder(order);
      setRating(5);
      setComment("");
      setSuggestion("");
      setPhotoBase64(null);
      setShowReviewModal(true);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("Ukuran foto melebihi batas 500KB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReview = (e: React.FormEvent) => {
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
      createdAt: new Date().toISOString(),
      isVisible: true
    };

    const savedReviews = localStorage.getItem("sebangku_reviews");
    const reviewsList = savedReviews ? JSON.parse(savedReviews) : [];
    reviewsList.unshift(newReview);
    localStorage.setItem("sebangku_reviews", JSON.stringify(reviewsList));

    // Dispatch event
    window.dispatchEvent(new Event("storage"));

    setShowReviewModal(false);
    setSelectedOrder(null);
    alert("Terima kasih atas ulasan Anda!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100">PAID (Menunggu Kasir)</span>;
      case "acknowledged":
        return <span className="bg-yellow-50 text-yellow-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-100">DITERIMA</span>;
      case "in_progress":
        return <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 animate-pulse">BERJALAN (SESSION AKTIF)</span>;
      case "completed":
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-200">SELESAI</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{status}</span>;
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
      <div>
        <h1 className="text-2xl font-black text-[#0F172A]">Pesanan Saya</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Kelola status pemesanan, lihat sisa sesi board game, cetak bukti bayar, dan beri ulasan.</p>
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
                <div key={session.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-[#0F172A]">{session.game}</h4>
                      <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">Meja: {session.table} · Paket: {session.duration}</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-xl tracking-wider ${
                      isEndingSoon ? "bg-red-50 text-red-500 border border-red-100 animate-pulse" : "bg-emerald-50 text-emerald-500 border border-emerald-100"
                    }`}>
                      {formatTime(session.secondsLeft)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isEndingSoon ? "bg-red-500" : "bg-emerald-500"
                      }`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-[#94A3B8]">
                    <span>Sisa Waktu Bermain</span>
                    <span>{Math.round(pct)}% Tersisa</span>
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
            <div className="flex flex-col gap-2.5">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-[#0F172A]">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}

              {order.rentals.map((rental: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs text-[#3B82F6]">
                  <span className="font-semibold flex items-center gap-1">
                    <Gamepad2 size={12} /> {rental.name} ({rental.duration || "2 Jam"})
                  </span>
                  <span className="font-bold">Rp {rental.price.toLocaleString("id-ID")}</span>
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

                {order.status === "in_progress" && (
                  <button
                    onClick={() => handleMarkComplete(order)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Tandai Selesai &amp; Ulas
                  </button>
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
  const [userData, setUserData] = useState(MOCK_USER);

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
      case "profil": return <ProfilPage userData={userData} setUserData={setUserData} />;
      case "pesan": return <PesanPage userData={userData} />;
      case "pesanan": return <PesananPage userData={userData} />;
      case "history": return <HistoryPage searchQuery={searchQuery} />;
      case "kunjungan": return <KunjunganPage searchQuery={searchQuery} />;
      case "transaksi": return <TransaksiPage searchQuery={searchQuery} />;
      case "statistik": return <StatistikPage />;
      default: return <ProfilPage userData={userData} setUserData={setUserData} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" style={{ fontFamily: "'Poppins', sans-serif" }}>

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
    </div>
  );
}