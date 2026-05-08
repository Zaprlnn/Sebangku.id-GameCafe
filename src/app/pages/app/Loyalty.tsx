import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Gift, TrendingUp, Shield, Trophy,
  Lock, Check, X, Star, Zap, Crown,
  ChevronRight, Flame, Users, Clock,
  Camera, MessageSquare, Heart, Calendar,
  Target,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── USER MOCK ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const USER = {
  name: "Andi Kusuma",
  initials: "AK",
  points: 1_250,
  totalXP: 1_620,
  levelId: 3,
  levelXP: 620,       // XP earned within current level
  levelXPMax: 1_500,  // XP required to complete level 3 → 4
  rank: 47,
  rankPointsNeeded: 320,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── LEVELS DATA ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface Level {
  id: number; name: string; emoji: string;
  color: string; bg: string; border: string;
  xpStart: number; xpEnd: number | null;
  benefits: string[];
}

const LEVELS: Level[] = [
  {
    id: 1, name: "Newbie Gamer", emoji: "🎮",
    color: "#9CA3AF", bg: "#F3F4F6", border: "#E5E7EB",
    xpStart: 0, xpEnd: 499,
    benefits: ["Akses penuh menu & katalog game", "Poin reward dari setiap pesanan"],
  },
  {
    id: 2, name: "Casual Player", emoji: "🕹️",
    color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE",
    xpStart: 500, xpEnd: 999,
    benefits: ["Diskon 5% untuk semua minuman", "Prioritas pemilihan meja saat ramai"],
  },
  {
    id: 3, name: "Regular Gamer", emoji: "🎯",
    color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0",
    xpStart: 1_000, xpEnd: 2_499,
    benefits: ["Diskon 10% semua menu", "1 sesi game gratis/bulan (maks 1 jam)", "Early access undangan event khusus"],
  },
  {
    id: 4, name: "Enthusiast", emoji: "🏆",
    color: "#45A1FD", bg: "#EBF5FF", border: "#FED7AA",
    xpStart: 2_500, xpEnd: 4_999,
    benefits: ["Diskon 15% semua menu", "2 sesi game gratis/bulan", "Akses lounge VIP akhir pekan", "Badge eksklusif Enthusiast"],
  },
  {
    id: 5, name: "Game Master Fan", emoji: "⚔️",
    color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5",
    xpStart: 5_000, xpEnd: 9_999,
    benefits: ["Diskon 20% semua menu", "5 sesi game gratis/bulan", "Preview koleksi game baru eksklusif", "Merchandise hadiah ulang tahun"],
  },
  {
    id: 6, name: "Legend", emoji: "👑",
    color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A",
    xpStart: 10_000, xpEnd: null,
    benefits: ["Semua benefit di atas ✓", "Nama di Wall of Fame Sebangku", "Birthday month: semua menu 30% OFF", "Akses seumur hidup + merchandise eksklusif"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── EARN METHODS ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const EARN_METHODS = [
  { emoji: "☕", label: "Pesan minuman",  desc: "+5 poin / Rp 10rb",  bg: "#EFF6FF", color: "#2563EB" },
  { emoji: "🍽️", label: "Pesan makanan",  desc: "+8 poin / Rp 10rb",  bg: "#ECFDF5", color: "#059669" },
  { emoji: "🎮", label: "Sesi game",       desc: "+20 poin / jam",     bg: "#F5F3FF", color: "#7C3AED" },
  { emoji: "🎉", label: "Hadir event",     desc: "+50 poin / event",   bg: "#FDF2F8", color: "#BE185D" },
  { emoji: "👥", label: "Referral teman",  desc: "+200 poin",          bg: "#FFFBEB", color: "#D97706" },
  { emoji: "⭐", label: "Tulis review",    desc: "+30 poin",           bg: "#EBF5FF", color: "#45A1FD" },
  { emoji: "📸", label: "Tag Instagram",   desc: "+50 poin",           bg: "#ECFEFF", color: "#0891B2" },
  { emoji: "🔥", label: "Streak 7 hari",   desc: "+100 poin",          bg: "#FEF2F2", color: "#EF4444" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── POINT HISTORY ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface PointEntry { id: string; emoji: string; desc: string; date: string; amount: number; }
const POINT_HISTORY: PointEntry[] = [
  { id: "h1",  emoji: "☕", desc: "Kopi Susu Aren",             date: "1 Mei 2026",  amount: +14  },
  { id: "h2",  emoji: "🎮", desc: "Sesi Game Catan (2 jam)",   date: "30 Apr 2026", amount: +40  },
  { id: "h3",  emoji: "🎁", desc: "Tukar: Diskon Rp 10.000",   date: "29 Apr 2026", amount: -100 },
  { id: "h4",  emoji: "🎉", desc: "Hadir Board Game Night",    date: "27 Apr 2026", amount: +50  },
  { id: "h5",  emoji: "🍽️", desc: "Club Sandwich + Cold Brew", date: "26 Apr 2026", amount: +62  },
  { id: "h6",  emoji: "⭐", desc: "Review Pengalaman Bermain", date: "25 Apr 2026", amount: +30  },
  { id: "h7",  emoji: "🔥", desc: "Streak 7 Hari Bonus",       date: "24 Apr 2026", amount: +100 },
  { id: "h8",  emoji: "📸", desc: "Tag @sebangkucafe di IG",   date: "23 Apr 2026", amount: +50  },
  { id: "h9",  emoji: "🎁", desc: "Tukar: Satu Sesi Game",     date: "20 Apr 2026", amount: -200 },
  { id: "h10", emoji: "👥", desc: "Referral Budi Santoso",      date: "18 Apr 2026", amount: +200 },
  { id: "h11", emoji: "☕", desc: "Matcha Latte + Waffle",      date: "17 Apr 2026", amount: +35  },
  { id: "h12", emoji: "🎮", desc: "Sesi Game D&D (3 jam)",     date: "15 Apr 2026", amount: +60  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── BADGES ───────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface BadgeItem {
  id: string; emoji: string; name: string; desc: string;
  unlocked: boolean; unlockedDate?: string;
  progress?: number; progressLabel?: string;
  xpReward: number; pointReward: number; color: string;
  criteria: { label: string; done: boolean }[];
}

const BADGES: BadgeItem[] = [
  // ── Unlocked ──────────────────────────────────────────
  { id: "b1",  emoji: "🎊", name: "Selamat Datang!",    desc: "Bergabung sebagai member Sebangku",           unlocked: true,  unlockedDate: "10 Mar 2026", xpReward: 50,  pointReward: 20,  color: "#45A1FD", criteria: [{ label: "Daftar akun Sebangku", done: true }] },
  { id: "b2",  emoji: "🛍️", name: "Pesanan Pertama",    desc: "Buat pesanan pertamamu di Sebangku",          unlocked: true,  unlockedDate: "10 Mar 2026", xpReward: 30,  pointReward: 10,  color: "#059669", criteria: [{ label: "Selesaikan 1 pesanan", done: true }] },
  { id: "b3",  emoji: "☕", name: "Pecinta Kopi",        desc: "Kopi is life — kamu sudah pesan 10x!",        unlocked: true,  unlockedDate: "28 Mar 2026", xpReward: 80,  pointReward: 50,  color: "#92400E", criteria: [{ label: "Pesan minuman kopi 10 kali", done: true }, { label: "Beri rating 5 bintang minimal 1 kopi", done: true }] },
  { id: "b4",  emoji: "♟️", name: "Catan Maniac",        desc: "Penjelajah Catan sejati — 5 game selesai",   unlocked: true,  unlockedDate: "5 Apr 2026",  xpReward: 100, pointReward: 75,  color: "#D97706", criteria: [{ label: "Mainkan Catan 5 kali", done: true }, { label: "Menang minimal 1 game", done: true }] },
  { id: "b5",  emoji: "🔥", name: "Week Warrior",        desc: "Hadir 7 hari berturut-turut — luar biasa!",   unlocked: true,  unlockedDate: "17 Apr 2026", xpReward: 150, pointReward: 100, color: "#EF4444", criteria: [{ label: "Kunjungi Sebangku 7 hari berturut", done: true }] },
  { id: "b6",  emoji: "⭐", name: "Kritikus Handal",     desc: "Review pertamamu sudah tayang",               unlocked: true,  unlockedDate: "25 Apr 2026", xpReward: 40,  pointReward: 30,  color: "#F59E0B", criteria: [{ label: "Tulis 1 ulasan menu atau pengalaman", done: true }] },
  { id: "b7",  emoji: "🎉", name: "Event Enthusiast",    desc: "Peserta setia event Sebangku",                unlocked: true,  unlockedDate: "27 Apr 2026", xpReward: 60,  pointReward: 50,  color: "#BE185D", criteria: [{ label: "Hadir di 1 event Sebangku", done: true }] },
  { id: "b8",  emoji: "📸", name: "Social Bird",         desc: "Sudah tag @sebangkucafe di Instagram!",       unlocked: true,  unlockedDate: "23 Apr 2026", xpReward: 50,  pointReward: 50,  color: "#0891B2", criteria: [{ label: "Tag @sebangkucafe di postingan IG", done: true }] },
  // ── Locked ────────────────────────────────────────────
  { id: "b9",  emoji: "🍽️", name: "Food Explorer",       desc: "Jelajahi semua kategori makanan",             unlocked: false, progress: 60,  progressLabel: "3 / 5 kategori", xpReward: 80,  pointReward: 60,  color: "#059669", criteria: [{ label: "Pesan dari kategori Makanan 3×", done: true }, { label: "Pesan Dessert 2×", done: true }, { label: "Pesan Snack 1×", done: false }, { label: "Beri rating semua pesanan", done: false }] },
  { id: "b10", emoji: "🎮", name: "Game Marathon",        desc: "Dedikasi 10 jam bermain game di Sebangku",   unlocked: false, progress: 30,  progressLabel: "3 / 10 jam",      xpReward: 200, pointReward: 150, color: "#7C3AED", criteria: [{ label: "Akumulasi 10 jam sesi game", done: false }] },
  { id: "b11", emoji: "👑", name: "Referral King",        desc: "Ajak 5 teman bergabung ke Sebangku",         unlocked: false, progress: 0,   progressLabel: "0 / 5 referral",  xpReward: 300, pointReward: 200, color: "#D97706", criteria: [{ label: "Referral 5 teman yang aktif pesan", done: false }] },
  { id: "b12", emoji: "💯", name: "Century Club",         desc: "Kumpulkan 100 poin dalam satu hari",         unlocked: false, progress: 82,  progressLabel: "82 / 100 poin",  xpReward: 100, pointReward: 80,  color: "#45A1FD", criteria: [{ label: "Earn 100 poin dalam 1 hari kalender", done: false }] },
  { id: "b13", emoji: "🦉", name: "Night Owl",            desc: "Nikmati malam hari di Sebangku",             unlocked: false, progress: 40,  progressLabel: "2 / 5 kunjungan", xpReward: 70,  pointReward: 50,  color: "#1E293B", criteria: [{ label: "Kunjungi setelah jam 20.00 sebanyak 5×", done: false }] },
  { id: "b14", emoji: "🎲", name: "Dynamic Duo",          desc: "Sering main berdua — kompak banget!",        unlocked: false, progress: 33,  progressLabel: "1 / 3 game",     xpReward: 60,  pointReward: 40,  color: "#3B82F6", criteria: [{ label: "Selesaikan 3 game 2-player dengan teman", done: false }] },
  { id: "b15", emoji: "🎊", name: "Party Host",           desc: "Jadi tuan rumah game grup besar",            unlocked: false, progress: 0,   progressLabel: "0 / 3 booking",  xpReward: 120, pointReward: 100, color: "#BE185D", criteria: [{ label: "Booking grup 5+ orang sebanyak 3×", done: false }] },
  { id: "b16", emoji: "💎", name: "Diamond Member",       desc: "Capai Level 5 — Game Master Fan",            unlocked: false, progress: 0,   progressLabel: "Level 3 / 5",   xpReward: 500, pointReward: 300, color: "#0891B2", criteria: [{ label: "Capai Level 5 (Game Master Fan)", done: false }] },
  { id: "b17", emoji: "⚡", name: "Speed Demon",          desc: "Pesan di jam sibuk — berani!",               unlocked: false, progress: 20,  progressLabel: "2 / 10 pesanan", xpReward: 80,  pointReward: 60,  color: "#EAB308", criteria: [{ label: "Pesan 10× di antara jam 12.00–13.00 atau 18.00–19.00", done: false }] },
  { id: "b18", emoji: "🏆", name: "Board Master",         desc: "Kuasai berbagai jenis game",                 unlocked: false, progress: 33,  progressLabel: "10 / 30 game",   xpReward: 250, pointReward: 200, color: "#F59E0B", criteria: [{ label: "Mainkan 30 game berbeda di Sebangku", done: false }] },
  { id: "b19", emoji: "🌅", name: "Early Bird",           desc: "Semangatmu luar biasa — hadir pagi!",        unlocked: false, progress: 20,  progressLabel: "1 / 5 pagi",     xpReward: 60,  pointReward: 40,  color: "#F97316", criteria: [{ label: "Kunjungi Sebangku sebelum jam 10.00 sebanyak 5×", done: false }] },
  { id: "b20", emoji: "🤝", name: "Co-op Champion",       desc: "Menang di game kooperatif 5 kali",           unlocked: false, progress: 40,  progressLabel: "2 / 5 menang",   xpReward: 100, pointReward: 80,  color: "#10B981", criteria: [{ label: "Menangkan 5 game Co-op (Pandemic, Gloomhaven, dll)", done: false }] },
  { id: "b21", emoji: "🧠", name: "Strategy Genius",      desc: "Menang di semua game Strategy top 5",        unlocked: false, progress: 40,  progressLabel: "2 / 5 game",     xpReward: 180, pointReward: 120, color: "#7C3AED", criteria: [{ label: "Menang 1× di Catan", done: true }, { label: "Menang 1× di 7 Wonders", done: true }, { label: "Menang 1× di Splendor", done: false }, { label: "Menang 1× di Terraforming Mars", done: false }, { label: "Menang 1× di Ticket to Ride", done: false }] },
  { id: "b22", emoji: "🔍", name: "Spy Network",          desc: "Deduction master — Codenames & Coup",        unlocked: false, progress: 50,  progressLabel: "5 / 10 game",    xpReward: 100, pointReward: 70,  color: "#0891B2", criteria: [{ label: "Mainkan game Deduction 10×", done: false }] },
  { id: "b23", emoji: "🌟", name: "Legend Title",         desc: "Capai Level 6 — status tertinggi",           unlocked: false, progress: 0,   progressLabel: "Level 3 / 6",    xpReward: 1000,pointReward: 500, color: "#F59E0B", criteria: [{ label: "Capai Level 6 (Legend)", done: false }] },
  { id: "b24", emoji: "🎭", name: "Storyteller",          desc: "Mainkan Dixit 5 kali",                       unlocked: false, progress: 20,  progressLabel: "1 / 5 game",     xpReward: 80,  pointReward: 60,  color: "#A855F7", criteria: [{ label: "Selesaikan 5 game Dixit", done: false }] },
  { id: "b25", emoji: "🐉", name: "Dragon Slayer",        desc: "Selesaikan campaign D&D 1 kali",             unlocked: false, progress: 0,   progressLabel: "0 / 1 campaign", xpReward: 300, pointReward: 200, color: "#DC2626", criteria: [{ label: "Selesaikan 1 full campaign D&D di Sebangku", done: false }] },
  { id: "b26", emoji: "🎯", name: "Solo Adventurer",      desc: "Main game solo (single player) 5×",          unlocked: false, progress: 60,  progressLabel: "3 / 5 sesi",     xpReward: 70,  pointReward: 50,  color: "#64748B", criteria: [{ label: "Mainkan game solo mode 5×", done: false }] },
  { id: "b27", emoji: "🌍", name: "Global Citizen",       desc: "Mainkan game dari 5 negara asal berbeda",    unlocked: false, progress: 40,  progressLabel: "2 / 5 negara",   xpReward: 120, pointReward: 90,  color: "#059669", criteria: [{ label: "Main game asal Amerika, Jerman, Prancis, Jepang, Italia", done: false }] },
  { id: "b28", emoji: "🎪", name: "Tournament Fighter",   desc: "Ikut turnamen resmi Sebangku",               unlocked: false, progress: 0,   progressLabel: "0 / 1 turnamen", xpReward: 200, pointReward: 150, color: "#45A1FD", criteria: [{ label: "Daftar & ikuti 1 turnamen game resmi Sebangku", done: false }] },
  { id: "b29", emoji: "📅", name: "Monthly Regular",      desc: "Hadir setiap minggu selama 1 bulan",         unlocked: false, progress: 75,  progressLabel: "3 / 4 minggu",   xpReward: 90,  pointReward: 70,  color: "#6366F1", criteria: [{ label: "Hadir minimal 1× setiap minggu selama 4 minggu", done: false }] },
  { id: "b30", emoji: "🎂", name: "Birthday Star",        desc: "Rayakan ulang tahun di Sebangku",            unlocked: false, progress: 0,   progressLabel: "Belum ulang tahun",xpReward: 150,pointReward: 100, color: "#EC4899", criteria: [{ label: "Kunjungi Sebangku di hari ulang tahunmu", done: false }] },
  { id: "b31", emoji: "💡", name: "Idea Factory",         desc: "Submit 3 saran yang diterima",               unlocked: false, progress: 33,  progressLabel: "1 / 3 saran",   xpReward: 80,  pointReward: 60,  color: "#EAB308", criteria: [{ label: "Submit saran via form feedback", done: true }, { label: "2 saran lagi diimplementasikan", done: false }] },
  { id: "b32", emoji: "🏅", name: "Top 20 Player",        desc: "Masuk Top 20 Leaderboard All Time",          unlocked: false, progress: 0,   progressLabel: "Posisi #47",     xpReward: 400, pointReward: 250, color: "#F59E0B", criteria: [{ label: "Masuk Top 20 leaderboard All Time", done: false }] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface LeaderEntry {
  rank: number; name: string; initials: string;
  level: string; levelId: number; points: number; color: string;
}

const makeBoard = (base: number[]): LeaderEntry[] => [
  { rank: 1,  name: "Rizky Pratama",    initials: "RP", level: "Legend",         levelId: 6, points: base[0],  color: "#F59E0B" },
  { rank: 2,  name: "Sari Dewi",        initials: "SD", level: "GM Fan",         levelId: 5, points: base[1],  color: "#EF4444" },
  { rank: 3,  name: "Budi Santoso",     initials: "BS", level: "Enthusiast",     levelId: 4, points: base[2],  color: "#45A1FD" },
  { rank: 4,  name: "Ayu Maharani",     initials: "AM", level: "Enthusiast",     levelId: 4, points: base[3],  color: "#8B5CF6" },
  { rank: 5,  name: "Deni Kurniawan",   initials: "DK", level: "Regular Gamer",  levelId: 3, points: base[4],  color: "#10B981" },
  { rank: 6,  name: "Intan Puspita",    initials: "IP", level: "Regular Gamer",  levelId: 3, points: base[5],  color: "#EC4899" },
  { rank: 7,  name: "Hendra Wijaya",    initials: "HW", level: "Regular Gamer",  levelId: 3, points: base[6],  color: "#3B82F6" },
  { rank: 8,  name: "Fitri Rahayu",     initials: "FR", level: "Casual Player",  levelId: 2, points: base[7],  color: "#0891B2" },
  { rank: 9,  name: "Galang Saputra",   initials: "GS", level: "Regular Gamer",  levelId: 3, points: base[8],  color: "#6366F1" },
  { rank: 10, name: "Maya Setiawati",   initials: "MS", level: "Enthusiast",     levelId: 4, points: base[9],  color: "#D97706" },
  { rank: 11, name: "Fajar Nugroho",    initials: "FN", level: "Regular Gamer",  levelId: 3, points: base[10], color: "#059669" },
  { rank: 12, name: "Lestari Handini",  initials: "LH", level: "Casual Player",  levelId: 2, points: base[11], color: "#BE185D" },
  { rank: 13, name: "Arif Wicaksono",   initials: "AW", level: "Regular Gamer",  levelId: 3, points: base[12], color: "#7C3AED" },
  { rank: 14, name: "Putri Amalia",     initials: "PA", level: "Casual Player",  levelId: 2, points: base[13], color: "#45A1FD" },
  { rank: 15, name: "Rendi Apriansyah", initials: "RA", level: "Regular Gamer",  levelId: 3, points: base[14], color: "#EF4444" },
  { rank: 16, name: "Citra Kirana",     initials: "CK", level: "Casual Player",  levelId: 2, points: base[15], color: "#10B981" },
  { rank: 17, name: "Yoga Pratama",     initials: "YP", level: "Regular Gamer",  levelId: 3, points: base[16], color: "#F59E0B" },
  { rank: 18, name: "Dwi Astuti",       initials: "DA", level: "Casual Player",  levelId: 2, points: base[17], color: "#3B82F6" },
  { rank: 19, name: "Bagas Eko",        initials: "BE", level: "Newbie Gamer",   levelId: 1, points: base[18], color: "#9CA3AF" },
  { rank: 20, name: "Nadia Permata",    initials: "NP", level: "Casual Player",  levelId: 2, points: base[19], color: "#EC4899" },
];

const LEADERBOARD: Record<"week" | "month" | "alltime", LeaderEntry[]> = {
  week:    makeBoard([840,  720,  680,  540,  480,  440,  390,  360,  310,  280,  260,  240,  220,  200,  185,  170,  155,  140,  125,  110]),
  month:   makeBoard([3200, 2780, 2540, 2120, 1940, 1780, 1650, 1520, 1420, 1320, 1240, 1180, 1090, 1020, 960,  900,  840,  790,  740,  690]),
  alltime: makeBoard([8450, 7320, 6890, 5640, 5210, 4980, 4720, 4450, 4200, 3980, 3760, 3540, 3320, 3140, 2980, 2820, 2640, 2480, 2310, 2150]),
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HELPERS ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function fmt(n: number) { return n.toLocaleString("id"); }

function LevelBadge({ levelId, sm }: { levelId: number; sm?: boolean }) {
  const lv = LEVELS[levelId - 1];
  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${sm ? "text-[9px]" : "text-[10px]"}`}
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: lv.bg, color: lv.color, border: `1px solid ${lv.border}` }}
    >
      {lv.emoji} {lv.name}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TAB 1: POIN ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function PointsTab() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";
  const pct = Math.round((USER.levelXP / USER.levelXPMax) * 100);
  const currentLevel = LEVELS[USER.levelId - 1];

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* ── Header card ── */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #45A1FD 0%, #82C2FF 60%, #FFB347 100%)" }}
        >
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: "rgba(255,255,255,0.3)" }} />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-15" style={{ background: "rgba(255,255,255,0.3)" }} />

          <div className="relative px-5 pt-5 pb-4">
            {/* Level badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <span className="text-base">{currentLevel.emoji}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "12px" }} className="text-white">
                  {currentLevel.name}
                </span>
              </div>
              <div className="text-white/80 text-right">
                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px]">Total XP</p>
                <p style={{ fontFamily: "'Fraunces', serif" }} className="text-sm font-bold">{fmt(USER.totalXP)} XP</p>
              </div>
            </div>

            {/* Points */}
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/80 text-sm">Poin Kamu</p>
            <div className="flex items-end gap-3">
              <motion.p
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
                style={{ fontFamily: "'Fraunces', serif", fontSize: "52px", lineHeight: 1 }}
                className="font-bold text-white"
              >
                {fmt(USER.points)}
              </motion.p>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/70 text-sm pb-2">
                ≈ Rp {fmt(USER.points * 10)}
              </p>
            </div>

            {/* XP Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/80 text-xs">
                  XP ke Level {USER.levelId + 1} ({LEVELS[USER.levelId]?.name ?? "Max"})
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white text-xs font-bold">
                  {fmt(USER.levelXP)} / {fmt(USER.levelXPMax)}
                </span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-white"
                />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/70 text-[10px] mt-1">
                {fmt(USER.levelXPMax - USER.levelXP)} XP lagi untuk naik level 🚀
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Cara dapat poin ── */}
      <div className="px-4">
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] mb-2.5">
          Cara Dapat Poin ✨
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {EARN_METHODS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              className="flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2.5 shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: m.bg }}
              >
                {m.emoji}
              </div>
              <div className="min-w-0">
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px", color: "#1C1410" }}
                   className="leading-tight truncate">{m.label}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: m.color }}>
                  {m.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Riwayat poin ── */}
      <div className="px-4">
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] mb-2.5">
          Riwayat Poin
        </h3>
        <div className="bg-white rounded-3xl overflow-hidden">
          {POINT_HISTORY.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < POINT_HISTORY.length - 1 ? "1px solid #F3F4F6" : "none" }}
            >
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                {entry.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1C1410" }}
                   className="truncate">{entry.desc}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF" }}>{entry.date}</p>
              </div>
              <span
                style={{
                  fontFamily: "'Fraunces', serif", fontSize: "15px",
                  color: entry.amount > 0 ? "#10B981" : "#EF4444",
                  fontWeight: 700,
                }}
              >
                {entry.amount > 0 ? "+" : ""}{fmt(entry.amount)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-4">
        <motion.button
          whileHover={{ translateY: -3, boxShadow: "0 10px 28px rgba(69,161,253,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/app/rewards?table=${tableId}`)}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer"
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px",
            background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
            color: "white", boxShadow: "0 6px 20px rgba(69,161,253,0.35)",
          }}
        >
          <Gift size={18} />
          🎁 Tukar Poin Sekarang
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TAB 2: LEVEL ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function LevelTab() {
  return (
    <div className="flex flex-col pb-8">
      {/* Banner */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-[#EBF5FF] rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="text-3xl">{LEVELS[USER.levelId - 1].emoji}</div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">Level kamu saat ini</p>
            <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
              Lv.{USER.levelId} {LEVELS[USER.levelId - 1].name}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">XP Level ini</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }} className="text-sm text-[#45A1FD]">
              {fmt(USER.levelXP)} / {fmt(USER.levelXPMax)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative px-4">
        {/* Vertical line */}
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-200" />

        {LEVELS.map((lv, i) => {
          const isActive   = lv.id === USER.levelId;
          const isUnlocked = lv.id < USER.levelId;
          const isFuture   = lv.id > USER.levelId;

          // XP bar within each level
          let barPct = 0;
          if (isUnlocked) barPct = 100;
          if (isActive)   barPct = Math.round((USER.levelXP / USER.levelXPMax) * 100);

          const xpRange = lv.xpEnd
            ? `${fmt(lv.xpStart)}–${fmt(lv.xpEnd)} XP`
            : `${fmt(lv.xpStart)}+ XP`;

          return (
            <motion.div
              key={lv.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative flex gap-4 mb-5"
            >
              {/* Node */}
              <div className="relative flex flex-col items-center" style={{ width: "32px", flexShrink: 0 }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base z-10 shrink-0"
                  style={{
                    backgroundColor: isFuture ? "#F3F4F6" : lv.bg,
                    border: `2px solid ${isFuture ? "#E5E7EB" : lv.color}`,
                    boxShadow: isActive ? `0 0 0 4px ${lv.color}30` : "none",
                    filter: isFuture ? "grayscale(0.6) opacity(0.6)" : "none",
                  }}
                >
                  {isUnlocked ? <Check size={16} style={{ color: lv.color }} /> : lv.emoji}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="bg-white rounded-2xl p-3.5 shadow-sm"
                     style={{ border: isActive ? `2px solid ${lv.color}` : "2px solid transparent" }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "14px", color: isFuture ? "#9CA3AF" : "#1C1410" }}>
                        Lv.{lv.id} {lv.name}
                      </span>
                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold"
                          style={{ backgroundColor: lv.bg, color: lv.color, fontFamily: "'DM Sans', sans-serif" }}
                        >
                          📍 Kamu di sini
                        </motion.div>
                      )}
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">
                      {xpRange}
                    </span>
                  </div>

                  {/* XP bar */}
                  {(isActive || isUnlocked) && (
                    <div className="mt-2 mb-3">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barPct}%` }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: lv.color }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="space-y-1">
                    {lv.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: isFuture ? "#F3F4F6" : lv.bg }}
                        >
                          {isFuture
                            ? <Lock size={8} className="text-gray-400" />
                            : <Check size={8} style={{ color: lv.color }} />
                          }
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: isFuture ? "#9CA3AF" : "#6B4436" }}>
                          {b}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TAB 3: BADGE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function BadgeModal({ badge, onClose }: { badge: BadgeItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(28,20,16,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="bg-white rounded-t-3xl overflow-hidden"
        style={{ maxWidth: "512px", width: "100%", margin: "0 auto" }}
      >
        <div className="flex justify-center pt-3 pb-0"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>

        {/* Hero */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6"
             style={{ background: badge.unlocked ? `linear-gradient(180deg, ${badge.color}15 0%, white 100%)` : "linear-gradient(180deg, #F3F4F6 0%, white 100%)" }}>
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-3 shadow-sm"
            style={{
              backgroundColor: badge.unlocked ? `${badge.color}15` : "#F3F4F6",
              filter: badge.unlocked ? "none" : "grayscale(1) opacity(0.5)",
              border: `3px solid ${badge.unlocked ? badge.color : "#E5E7EB"}`,
            }}
          >
            {badge.unlocked ? badge.emoji : <Lock size={36} className="text-gray-400" />}
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] text-xl">
            {badge.name}
          </h2>
          {badge.unlocked && badge.unlockedDate ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF] mt-0.5">
              Didapat {badge.unlockedDate} 🎉
            </p>
          ) : (
            <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${badge.progress ?? 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: badge.color }}
              />
            </div>
          )}
          {!badge.unlocked && badge.progressLabel && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: badge.color }} className="text-xs font-bold mt-1">
              {badge.progressLabel}
            </p>
          )}
        </div>

        <div className="px-5 pb-6 space-y-4">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436]">{badge.desc}</p>

          {/* Criteria */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }} className="mb-2">
              Cara Mendapatkan
            </p>
            <div className="space-y-2">
              {badge.criteria.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: c.done ? "#ECFDF5" : "#F3F4F6" }}
                  >
                    {c.done ? <Check size={10} className="text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: c.done ? "#059669" : "#6B4436", fontWeight: c.done ? 600 : 400 }}>
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reward */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#EBF5FF] rounded-2xl p-3 text-center">
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">Reward XP</p>
              <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#45A1FD] text-lg">+{badge.xpReward} XP</p>
            </div>
            <div className="flex-1 bg-[#ECFDF5] rounded-2xl p-3 text-center">
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">Reward Poin</p>
              <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-emerald-500 text-lg">+{badge.pointReward} poin</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              backgroundColor: badge.unlocked ? badge.color : "#F3F4F6",
              color: badge.unlocked ? "white" : "#9CA3AF",
            }}
          >
            {badge.unlocked ? "🎉 Badge Sudah Didapat!" : "Ayo Kumpulkan!"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BadgeTab() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const unlockedCount = BADGES.filter((b) => b.unlocked).length;

  return (
    <>
      <div className="flex flex-col pb-8">
        {/* Counter */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
              Badge Koleksi 🏅
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436] mt-0.5">
              <span style={{ color: "#45A1FD", fontWeight: 700 }}>{unlockedCount}</span> dari {BADGES.length} badge terbuka
            </p>
          </div>
          {/* Progress ring placeholder */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#F3F4F6" strokeWidth="4" />
              <motion.circle
                cx="24" cy="24" r="20" fill="none" stroke="#45A1FD" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - unlockedCount / BADGES.length) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ fontFamily: "'Fraunces', serif" }} className="text-xs font-bold text-[#45A1FD]">
                {Math.round((unlockedCount / BADGES.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Unlocked section */}
        <div className="px-4 mb-2">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-bold text-[#10B981] mb-2">
            ✓ Terbuka ({unlockedCount})
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {BADGES.filter((b) => b.unlocked).map((badge, i) => (
              <motion.button
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                whileHover={{ translateY: -4 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedBadge(badge)}
                className="flex flex-col items-center py-3 px-1 rounded-2xl cursor-pointer"
                style={{ backgroundColor: `${badge.color}12`, border: `1.5px solid ${badge.color}30` }}
              >
                <div className="text-2xl mb-1.5">{badge.emoji}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "10px", color: "#1C1410", textAlign: "center", lineHeight: 1.2 }}>
                  {badge.name}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "#9CA3AF", marginTop: "2px" }}>
                  {badge.unlockedDate?.split(" ").slice(0, 2).join(" ")}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Locked section */}
        <div className="px-4">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-bold text-[#9CA3AF] mb-2 mt-2">
            🔒 Terkunci ({BADGES.length - unlockedCount})
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {BADGES.filter((b) => !b.unlocked).map((badge, i) => (
              <motion.button
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.04, type: "spring", stiffness: 260 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedBadge(badge)}
                className="flex flex-col items-center py-3 px-1 rounded-2xl cursor-pointer bg-gray-50 relative overflow-hidden"
                style={{ border: "1.5px solid #E5E7EB" }}
              >
                {/* progress fill bg */}
                {badge.progress !== undefined && badge.progress > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${badge.progress}%` }}
                    transition={{ duration: 1.1, delay: 0.5 + i * 0.04, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 h-1"
                    style={{ backgroundColor: badge.color }}
                  />
                )}
                <div className="text-2xl mb-1.5 grayscale opacity-50">
                  {badge.progress && badge.progress > 50 ? badge.emoji : <Lock size={20} className="text-gray-400" />}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "10px", color: "#9CA3AF", textAlign: "center", lineHeight: 1.2 }}>
                  {badge.name}
                </p>
                {badge.progressLabel && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: badge.progress && badge.progress > 0 ? badge.color : "#C4C4C4", marginTop: "2px", fontWeight: 700 }}>
                    {badge.progressLabel}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Badge modal */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TAB 4: LEADERBOARD ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

type LBFilter = "week" | "month" | "alltime";
const LB_LABELS: { key: LBFilter; label: string }[] = [
  { key: "week", label: "Minggu Ini" },
  { key: "month", label: "Bulan Ini" },
  { key: "alltime", label: "All Time" },
];

const MEDAL_COLORS = {
  1: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", medal: "🥇", podiumBg: "#F59E0B", height: 110 },
  2: { bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", medal: "🥈", podiumBg: "#94A3B8", height: 80  },
  3: { bg: "#FFF7ED", border: "#FED7AA", text: "#92400E", medal: "🥉", podiumBg: "#CD7F32", height: 65  },
};

function Podium({ entries }: { entries: LeaderEntry[] }) {
  const order = [entries[1], entries[0], entries[2]]; // Silver, Gold, Bronze order
  const podiumPos = [2, 1, 3] as const;

  return (
    <div className="bg-gradient-to-b from-[#EBF5FF]/40 to-transparent px-4 pt-4 pb-0">
      <div className="flex items-end justify-center gap-2.5">
        {order.map((entry, i) => {
          const pos = podiumPos[i];
          const m = MEDAL_COLORS[pos];
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.1, type: "spring", stiffness: 280, damping: 24 }}
              className="flex flex-col items-center flex-1"
            >
              {/* Crown for 1st */}
              {pos === 1 && (
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="text-xl mb-0.5"
                >👑</motion.div>
              )}
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-full font-bold text-white shadow-md"
                style={{
                  width: pos === 1 ? "52px" : "44px",
                  height: pos === 1 ? "52px" : "44px",
                  fontSize: pos === 1 ? "16px" : "14px",
                  backgroundColor: entry.color,
                  border: `3px solid ${m.border}`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {entry.initials}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px", color: "#1C1410", textAlign: "center" }}
                 className="mt-1.5 px-1 leading-tight line-clamp-1">{entry.name.split(" ")[0]}</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "12px", color: m.text }}>
                {fmt(entry.points)}p
              </p>
              {/* Podium block */}
              <div
                className="w-full rounded-t-xl flex items-start justify-center pt-2 mt-1.5"
                style={{ height: `${m.height}px`, backgroundColor: m.podiumBg }}
              >
                <span className="text-white font-bold" style={{ fontSize: pos === 1 ? "22px" : "18px" }}>{m.medal}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardTab() {
  const [filter, setFilter] = useState<LBFilter>("month");
  const board = LEADERBOARD[filter];

  const userPts = filter === "week" ? 95 : filter === "month" ? 930 : USER.points;
  const ptsToTop20 = board[19].points - userPts;

  return (
    <div className="flex flex-col min-h-full">
      {/* Filter */}
      <div className="px-4 pt-4 pb-3 flex gap-2">
        {LB_LABELS.map((l) => (
          <motion.button
            key={l.key}
            whileTap={{ scale: 0.93 }}
            onClick={() => setFilter(l.key)}
            className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              backgroundColor: filter === l.key ? "#45A1FD" : "#F7F7F8",
              color: filter === l.key ? "white" : "#6B4436",
              border: filter === l.key ? "1.5px solid #45A1FD" : "1.5px solid #E5E7EB",
            }}
          >
            {l.label}
          </motion.button>
        ))}
      </div>

      {/* Podium */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
        >
          <Podium entries={board.slice(0, 3)} />

          {/* Rank list 4–20 */}
          <div className="px-4 pt-3 pb-32">
            {board.slice(3).map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 + 0.1 }}
                className="flex items-center gap-3 py-2.5"
                style={{ borderBottom: i < board.length - 4 ? "1px solid #F3F4F6" : "none" }}
              >
                <div className="w-7 text-center shrink-0">
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "13px", color: "#9CA3AF" }}>
                    {entry.rank}
                  </span>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: entry.color, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {entry.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
                    {entry.name}
                  </p>
                  <LevelBadge levelId={entry.levelId} sm />
                </div>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>
                  {fmt(entry.points)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sticky user position */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-4 pb-2" style={{ maxWidth: "512px", margin: "0 auto" }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl px-4 py-3"
          style={{
            background: "linear-gradient(135deg, #EBF5FF, #FFFFFF)",
            border: "2px solid #45A1FD30",
            boxShadow: "0 -4px 20px rgba(69,161,253,0.15), 0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)", fontFamily: "'DM Sans', sans-serif" }}
            >
              AK
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Fraunces', serif' ", fontWeight: 700, fontSize: "20px", color: "#45A1FD" }}>
                  #{USER.rank}
                </span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
                  {USER.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <LevelBadge levelId={USER.levelId} sm />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
                  · {fmt(userPts)} poin
                </span>
              </div>
            </div>
          </div>
          {ptsToTop20 > 0 ? (
            <div className="mt-2 flex items-center gap-1.5 bg-[#EBF5FF] rounded-xl px-3 py-1.5">
              <span className="text-sm">🚀</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
                Butuh <span style={{ fontWeight: 700, color: "#45A1FD" }}>+{fmt(ptsToTop20)} poin</span> untuk masuk Top 20
              </p>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-1.5 bg-[#ECFDF5] rounded-xl px-3 py-1.5">
              <span className="text-sm">🏆</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-emerald-700 font-semibold">
                Kamu sudah masuk Top 20! Pertahankan!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN LOYALTY PAGE ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { key: "poin",        label: "Poin",        emoji: "⭐" },
  { key: "level",       label: "Level",       emoji: "🏆" },
  { key: "badge",       label: "Badge",       emoji: "🏅" },
  { key: "leaderboard", label: "Ranking",     emoji: "👑" },
];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState("poin");
  const [dir, setDir] = useState(1);

  const handleTab = (key: string) => {
    const oldIdx = TABS.findIndex((t) => t.key === activeTab);
    const newIdx = TABS.findIndex((t) => t.key === key);
    setDir(newIdx >= oldIdx ? 1 : -1);
    setActiveTab(key);
  };

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 32 : -32, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -32 : 32, opacity: 0 }),
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Tab bar ── */}
      <div className="sticky top-0 z-20 bg-white px-4 pt-3 pb-0"
           style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div className="flex gap-1.5 pb-3">
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <motion.button
                key={t.key}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleTab(t.key)}
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: active ? "#45A1FD" : "transparent",
                  border: active ? "1.5px solid #45A1FD" : "1.5px solid transparent",
                }}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <span
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "10px" }}
                  className={active ? "text-white" : "text-[#9CA3AF]"}
                >
                  {t.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={activeTab}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {activeTab === "poin"        && <PointsTab />}
            {activeTab === "level"       && <LevelTab />}
            {activeTab === "badge"       && <BadgeTab />}
            {activeTab === "leaderboard" && <LeaderboardTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

