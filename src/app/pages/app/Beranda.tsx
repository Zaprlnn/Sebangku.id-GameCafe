import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Clock, Zap, Star, CheckCircle2,
  Loader2, Package, Bike, X,
  Calendar, Users, Trophy, Gift, BookOpen,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── XP / Level System ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface XpLevel {
  level: number;
  title: string;
  emoji: string;
  minXp: number;
  maxXp: number;
  color: string;
  bgColor: string;
}

const XP_LEVELS: XpLevel[] = [
  { level: 1, title: "Newbie Gamer",    emoji: "🌱", minXp: 0,    maxXp: 299,  color: "#6B7280", bgColor: "#F3F4F6" },
  { level: 2, title: "Casual Gamer",    emoji: "🎮", minXp: 300,  maxXp: 699,  color: "#059669", bgColor: "#ECFDF5" },
  { level: 3, title: "Regular Gamer",   emoji: "🎯", minXp: 700,  maxXp: 1299, color: "#0284C7", bgColor: "#EFF6FF" },
  { level: 4, title: "Hardcore Gamer",  emoji: "⚔️", minXp: 1300, maxXp: 2499, color: "#7C3AED", bgColor: "#F5F3FF" },
  { level: 5, title: "Pro Gamer",       emoji: "🏆", minXp: 2500, maxXp: 4999, color: "#F59E0B", bgColor: "#FFFBEB" },
  { level: 6, title: "Legend Gamer",    emoji: "👑", minXp: 5000, maxXp: 99999, color: "#45A1FD", bgColor: "#EBF5FF" },
];

function getXpLevel(xp: number): XpLevel {
  return XP_LEVELS.findLast((l) => xp >= l.minXp) ?? XP_LEVELS[0];
}

function getXpProgress(xp: number): number {
  const lvl = getXpLevel(xp);
  if (lvl.level === 6) return 100;
  return Math.min(((xp - lvl.minXp) / (lvl.maxXp - lvl.minXp + 1)) * 100, 100);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Data ─────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const PROMO_SLIDES = [
  {
    id: "p1",
    emoji: "⭐",
    title: "Poin 2× Akhir Pekan!",
    subtitle: "Setiap transaksi Sabtu–Minggu dapat poin double. Berlaku semua menu!",
    badge: "Aktif s/d Minggu",
    gradient: "linear-gradient(135deg, #45A1FD 0%, #EF4444 100%)",
    badgeColor: "#EBF5FF",
    badgeText: "#45A1FD",
  },
  {
    id: "p2",
    emoji: "🏆",
    title: "Turnamen Catan Open",
    subtitle: "Daftar sekarang! Hadiah total Rp 2.500.000 + merchandise eksklusif.",
    badge: "10 Mei 2026",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    badgeColor: "#EDE9FE",
    badgeText: "#7C3AED",
  },
  {
    id: "p3",
    emoji: "👥",
    title: "Ajak Teman, Raih Poin!",
    subtitle: "Referral member baru = +200 poin untukmu & teman. Tanpa batas!",
    badge: "Selamanya",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    badgeColor: "#ECFDF5",
    badgeText: "#059669",
  },
];

const GAME_RECOMMENDATIONS = [
  {
    id: "g1", name: "Catan",           category: "Strategy", players: "3–4",
    available: true,  rating: 4.8, duration: "60–120 mnt", difficulty: "Sedang",
    description: "Bangun permukiman, kumpulkan sumber daya, dan jadilah penguasa pulau Catan. Game strategi klasik yang selalu seru dimainkan bersama.",
    img: "https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=400&q=80",
  },
  {
    id: "g2", name: "Codenames",       category: "Party",    players: "4–8",
    available: true,  rating: 4.7, duration: "15–30 mnt", difficulty: "Mudah",
    description: "Dua tim bersaing memecahkan kode kata rahasia dari Spymaster masing-masing. Komunikasi & intuisi jadi kunci kemenangan.",
    img: "https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=400&q=80",
  },
  {
    id: "g3", name: "Ticket to Ride",  category: "Family",   players: "2–5",
    available: false, rating: 4.6, duration: "30–60 mnt", difficulty: "Mudah",
    description: "Kumpulkan kartu kereta dan bangun rute melintasi peta untuk menghubungkan kota-kota tujuan sebelum lawan menghadangmu.",
    img: "https://images.unsplash.com/photo-1716817279221-d815f96dce7e?w=400&q=80",
  },
  {
    id: "g4", name: "Dixit",           category: "Creative", players: "3–6",
    available: true,  rating: 4.5, duration: "30–45 mnt", difficulty: "Mudah",
    description: "Game imajinasi berbasis kartu ilustrasi indah — beri petunjuk yang cukup ambigu agar hanya sebagian teman bisa menebaknya.",
    img: "https://images.unsplash.com/photo-1672483036851-b34c69a39a83?w=400&q=80",
  },
  {
    id: "g5", name: "Pandemic",        category: "Co-op",    players: "2–4",
    available: false, rating: 4.9, duration: "45–60 mnt", difficulty: "Sedang",
    description: "Kerja sama tim untuk menghentikan 4 wabah penyakit sekaligus sebelum menyebar ke seluruh dunia. Kalah bareng lebih seru dari menang sendiri!",
    img: "https://images.unsplash.com/photo-1653201927638-f752117e29d0?w=400&q=80",
  },
];

const MOCK_ORDER = {
  id: "ORD-2024",
  items: [
    { name: "Kopi Susu Aren", qty: 2, price: 28_000 },
    { name: "Kentang Goreng",  qty: 1, price: 25_000 },
  ],
  status: 1, // 0=Diterima, 1=Diproses, 2=Siap, 3=Diantar
  total: 81_000,
};

// Event date: May 10, 2026
const EVENT_DATE = new Date("2026-05-10T14:00:00");

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Helper: session display ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function fmtSession(start: Date): string {
  const diff = Math.floor((Date.now() - start.getTime()) / 1000 / 60);
  if (diff < 1) return "Baru mulai";
  if (diff < 60) return `${diff} menit`;
  return `${Math.floor(diff / 60)}j ${diff % 60}m`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 1. Hero Greeting Card ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function HeroCard({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { user, isGuest, tableId, sessionStart } = useAppContext();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 10 ? "Selamat Pagi" : hour < 14 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";
  const displayName = isGuest ? "Tamu" : user?.name.split(" ")[0] ?? "Gamer";

  const xp = user?.poin ?? 0;
  const lvl = getXpLevel(xp);
  const xpNext = XP_LEVELS[lvl.level]?.minXp ?? xp;
  const progress = getXpProgress(xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-4 mt-4 rounded-3xl overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #45A1FD 0%, #82C2FF 65%, #A8D4FF 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 w-24 h-24 rounded-full bg-white/8" />
        <div className="absolute left-1/2 -bottom-6 w-32 h-32 rounded-full bg-black/5" />
      </div>

      <div className="relative z-10 p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/80 text-sm">
                {greeting} 👋
              </span>
            </div>
            <h2
              style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", lineHeight: 1.1 }}
              className="text-white font-bold mt-0.5"
            >
              Hei, {displayName}!
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 bg-white/20 rounded-xl px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white text-xs font-medium">
                  Meja {tableId.replace(/^[A-Za-z]+/, "")}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-xl px-2.5 py-1">
                <Clock size={11} className="text-white/80" />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white text-xs font-medium">
                  Sesi {fmtSession(sessionStart)}
                </span>
              </div>
            </div>
          </div>

          {/* Poin bubble */}
          {!isGuest && (
            <div className="shrink-0 bg-white/25 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 text-center border border-white/30">
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/70 text-[10px] uppercase tracking-wide">
                Poin
              </p>
              <p style={{ fontFamily: "'Fraunces', serif" }} className="text-white font-bold text-xl leading-none mt-0.5">
                {xp.toLocaleString("id")}
              </p>
            </div>
          )}
        </div>

        {/* XP Progress (member only) */}
        {!isGuest && (
          <div className="mt-4 bg-white/20 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{lvl.emoji}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white font-bold text-sm">
                  Level {lvl.level} — {lvl.title}
                </span>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/70 text-xs">
                {xp} / {xpNext} XP
              </span>
            </div>

            {/* XP bar */}
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                className="h-full rounded-full bg-white"
              />
            </div>

            {/* Link */}
            <button
              onClick={() => onNavigate("loyalty")}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="flex items-center gap-1 text-white/80 hover:text-white text-xs mt-2 cursor-pointer transition-colors"
            >
              Lihat Detail Poin →
            </button>
          </div>
        )}

        {/* Guest CTA */}
        {isGuest && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("register")}
            className="mt-4 w-full bg-white rounded-2xl py-3 flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#45A1FD", fontWeight: 700, fontSize: "14px" }}
          >
            <Gift size={16} />
            Daftar & Dapat 100 Poin Gratis 🎉
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 1.5 Daily Streak Banner ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function DailyStreakBanner({ onNavigate }: { onNavigate: (path: string) => void }) {
  // Mock state: streak 4, 1 of 3 daily challenges done
  const STREAK       = 4;
  const DONE         = 1;
  const TOTAL        = 3;
  const PCT          = Math.round((DONE / TOTAL) * 100);
  const DAILY_PTS    = 35; // max points for today (10+20+5)

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, ease: "easeOut" }}
      whileHover={{ translateY: -3, boxShadow: "0 8px 24px rgba(69,161,253,0.18)" }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onNavigate("challenges")}
      className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden flex items-center gap-3 px-4 py-3.5 cursor-pointer w-[calc(100%-2rem)] text-left"
      style={{ border: "1.5px solid #FED7AA", boxShadow: "0 2px 10px rgba(69,161,253,0.08)" }}
    >
      {/* Animated fire */}
      <div className="shrink-0 relative">
        <motion.div
          animate={{ rotate: [-6, 6, -4, 5, -6], scale: [1, 1.12, 1.06, 1.14, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-4xl leading-none select-none"
          style={{ filter: "drop-shadow(0 2px 6px rgba(69,161,253,0.45))" }}
        >
          🔥
        </motion.div>
        {/* Streak badge */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#45A1FD,#EF4444)", border: "2px solid white" }}
        >
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "9px", fontWeight: 700, color: "white", lineHeight: 1 }}>
            {STREAK}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}
           className="leading-tight">
          {STREAK} Hari Berturut-turut! 🎯
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }} className="mt-0.5">
          {DONE}/{TOTAL} tantangan harian selesai
        </p>
        {/* Mini progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${PCT}%` }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#45A1FD,#82C2FF)" }}
          />
        </div>
      </div>

      {/* Right side: points + arrow */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <div
          className="px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ backgroundColor: "#EBF5FF" }}
        >
          <Star size={9} fill="#45A1FD" stroke="none" />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "10px", color: "#45A1FD" }}>
            +{DAILY_PTS}p hari ini
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
            Cek Tantangan
          </span>
          <ChevronRight size={12} className="text-[#45A1FD]" />
        </div>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 3. Promo Carousel ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function PromoCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setActive(idx);
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % PROMO_SLIDES.length, 1);
  }, [active, goTo]);

  // Auto-slide every 4s
  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4000);
  };

  const slide = PROMO_SLIDES[active];

  return (
    <div className="px-4 mt-5">
      <div className="relative overflow-hidden rounded-3xl" style={{ height: "140px" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex items-center p-5 gap-4"
            style={{ background: slide.gradient }}
          >
            {/* Decorative circles */}
            <div className="absolute right-4 top-2 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-14 bottom-1 w-14 h-14 rounded-full bg-white/8 pointer-events-none" />

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="text-5xl shrink-0 relative z-10"
            >
              {slide.emoji}
            </motion.div>

            {/* Text */}
            <div className="flex-1 relative z-10">
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold mb-1.5"
                style={{ backgroundColor: slide.badgeColor, color: slide.badgeText, fontFamily: "'DM Sans', sans-serif" }}
              >
                {slide.badge}
              </div>
              <h3
                style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", lineHeight: 1.2 }}
                className="text-white font-bold"
              >
                {slide.title}
              </h3>
              <p
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-white/80 text-xs mt-1 leading-snug line-clamp-2"
              >
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2.5">
        {PROMO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i, i > active ? 1 : -1); resetTimer(); }}
            className="cursor-pointer transition-all duration-300"
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                backgroundColor: i === active ? "#45A1FD" : "#E5E7EB",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 2. Quick Action Grid ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface QAProps { icon: string; label: string; sub: string; color: string; onClick: () => void; delay: number; }

function QuickActionCard({ icon, label, sub, color, onClick, delay }: QAProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: "easeOut", duration: 0.35 }}
      whileHover={{ translateY: -5, boxShadow: `0 10px 24px ${color}28` }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 bg-white rounded-2xl p-4 cursor-pointer text-center"
      style={{ border: `1.5px solid ${color}20` }}
    >
      <div
        className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: `${color}14` }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
          {label}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF", lineHeight: 1.3 }}>
          {sub}
        </p>
      </div>
    </motion.button>
  );
}

function QuickActions({ onMenu, onGames, onRewards, onGM }: {
  onMenu: () => void; onGames: () => void; onRewards: () => void; onGM: () => void;
}) {
  return (
    <div className="px-4 mt-5">
      <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] mb-3">
        Mau Ngapain?
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <QuickActionCard icon="🍽️" label="Pesan Makanan"  sub="Lihat menu & pesan" color="#45A1FD" onClick={onMenu}    delay={0.05} />
        <QuickActionCard icon="🎲" label="Cari Game"      sub="500+ koleksi game"  color="#8B5CF6" onClick={onGames}   delay={0.10} />
        <QuickActionCard icon="🎟️" label="Tukar Poin"     sub="Reward & voucher"  color="#F59E0B" onClick={onRewards} delay={0.15} />
        <QuickActionCard icon="📞" label="Panggil GM"     sub="Bantuan game master" color="#06B6D4" onClick={onGM}     delay={0.20} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 4. Game Recommendations ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

type GameRec = typeof GAME_RECOMMENDATIONS[number];

const DIFF_COLOR: Record<string, { bg: string; text: string }> = {
  Mudah:  { bg: "#ECFDF5", text: "#059669" },
  Sedang: { bg: "#FFF8E7", text: "#D97706" },
  Expert: { bg: "#FEF2F2", text: "#DC2626" },
};

const CAT_COLOR: Record<string, { bg: string; text: string; emoji: string }> = {
  Strategy: { bg: "#FFF8E7", text: "#D97706", emoji: "♟️"   },
  Party:    { bg: "#FDF2F8", text: "#BE185D", emoji: "🎉"   },
  Family:   { bg: "#ECFDF5", text: "#059669", emoji: "👨‍👩‍👧" },
  Creative: { bg: "#F5F3FF", text: "#7C3AED", emoji: "🎨"   },
  "Co-op":  { bg: "#EBF5FF", text: "#45A1FD", emoji: "🤝"   },
};

// ─── Game Quick Detail Sheet ──────────────────────────────────────────────────

function GameQuickSheet({
  game,
  onClose,
  onViewAll,
}: {
  game: GameRec;
  onClose: () => void;
  onViewAll: () => void;
}) {
  const cat  = CAT_COLOR[game.category]    ?? { bg: "#F3F4F6", text: "#6B7280", emoji: "🎲" };
  const diff = DIFF_COLOR[game.difficulty] ?? { bg: "#F3F4F6", text: "#6B7280" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(28,20,16,0.58)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="bg-white rounded-t-3xl overflow-hidden flex flex-col max-w-lg w-full mx-auto"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero image */}
          <div className="relative w-full" style={{ paddingTop: "56%" }}>
            <img
              src={game.img}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(28,20,16,0.6) 0%, transparent 55%)" }}
            />
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer"
            >
              <X size={18} className="text-white" />
            </button>
            {/* Availability */}
            <div
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                backgroundColor: game.available ? "rgba(236,253,245,0.92)" : "rgba(254,242,242,0.92)",
                color: game.available ? "#059669" : "#EF4444",
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${game.available ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
              {game.available ? "Tersedia ✓" : "Sedang Dipakai"}
            </div>
            {/* Name overlay */}
            <div className="absolute bottom-3 left-4 right-4">
              <h2
                style={{ fontFamily: "'Fraunces',serif", fontSize: "22px", lineHeight: 1.15, color: "white" }}
                className="font-bold"
              >
                {game.name}
              </h2>
            </div>
          </div>

          {/* Info section */}
          <div className="px-5 pt-4 pb-3">
            {/* Category + difficulty chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div
                className="px-2.5 py-1 rounded-xl text-xs font-bold"
                style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: cat.bg, color: cat.text }}
              >
                {cat.emoji} {game.category}
              </div>
              <div
                className="px-2.5 py-1 rounded-xl text-xs font-bold"
                style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: diff.bg, color: diff.text }}
              >
                {game.difficulty}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: "⭐", label: "Rating",  val: String(game.rating) },
                { icon: "👥", label: "Pemain",  val: `${game.players} org` },
                { icon: "⏱️", label: "Durasi",  val: game.duration },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center py-3 rounded-2xl"
                  style={{ backgroundColor: "#F8FAFC", border: "1px solid #F3F4F6" }}
                >
                  <span className="text-xl mb-0.5">{s.icon}</span>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
                    {s.val}
                  </span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#9CA3AF" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen size={13} className="text-[#45A1FD]" />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }}
                   className="uppercase tracking-wide">
                  Tentang Game
                </p>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B4436", lineHeight: 1.65 }}>
                {game.description}
              </p>
            </div>

            {/* GM tip */}
            <div className="flex items-start gap-2.5 bg-[#EBF5FF] rounded-2xl px-4 py-3">
              <Zap size={14} className="text-[#45A1FD] shrink-0 mt-0.5" />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#92400E" }}>
                <span className="font-bold">Tips GM:</span> Tanya Game Master kami untuk penjelasan lengkap & strategi terbaik memainkan {game.name}!
              </p>
            </div>
          </div>
        </div>

        {/* Sticky bottom */}
        <div
          className="px-5 py-4 shrink-0 flex gap-3"
          style={{ borderTop: "1px solid #F3F4F6", backgroundColor: "white" }}
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl flex items-center justify-center cursor-pointer"
            style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px",
              backgroundColor: "#F7F7F8", color: "#6B4436",
              border: "1.5px solid #E5E7EB",
            }}
          >
            Tutup
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { onClose(); onViewAll(); }}
            className="flex-[2] py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
            style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px",
              background: "linear-gradient(135deg,#45A1FD,#82C2FF)",
              color: "white",
              boxShadow: "0 4px 14px rgba(69,161,253,0.3)",
            }}
          >
            🎲 Lihat Koleksi Lengkap
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GameRecommendations({ onViewAll, onGameClick }: {
  onViewAll: () => void;
  onGameClick: (game: GameRec) => void;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
          Rekomendasi Game 🎮
        </h3>
        <button
          onClick={onViewAll}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="text-xs text-[#45A1FD] font-semibold cursor-pointer hover:underline"
        >
          Lihat semua
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pl-4 pr-4 scrollbar-none">
        {GAME_RECOMMENDATIONS.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i }}
            whileHover={{ translateY: -4, boxShadow: "0 10px 24px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onGameClick(game)}
            className="shrink-0 w-40 bg-white rounded-2xl overflow-hidden cursor-pointer relative"
          >
            {/* Photo */}
            <div className="relative w-full h-24 overflow-hidden">
              <img
                src={game.img}
                alt={game.name}
                className="w-full h-full object-cover"
              />
              {/* Availability badge */}
              <div
                className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  backgroundColor: game.available ? "#ECFDF5" : "#FEF2F2",
                  color: game.available ? "#059669" : "#EF4444",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${game.available ? "bg-emerald-500" : "bg-red-400"}`} />
                {game.available ? "Tersedia ✓" : "Dipakai"}
              </div>
              {/* Tap hint */}
              <div
                className="absolute bottom-0 right-0 w-7 h-7 flex items-center justify-center"
                style={{ background: "rgba(69,161,253,0.85)", borderTopLeftRadius: "12px" }}
              >
                <ChevronRight size={12} className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="p-2.5">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "12px", color: "#1C1410" }}
                 className="leading-tight truncate">
                {game.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: "#EBF5FF",
                    color: "#45A1FD",
                  }}
                >
                  {game.category}
                </span>
                <div className="flex items-center gap-0.5">
                  <Star size={9} fill="#F59E0B" stroke="none" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#6B4436" }}>
                    {game.rating}
                  </span>
                </div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }} className="mt-0.5">
                {game.players} pemain
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 5. Active Order Tracker ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const ORDER_STEPS = [
  { label: "Diterima",   icon: CheckCircle2, desc: "Pesanan masuk" },
  { label: "Diproses",   icon: Loader2,      desc: "Sedang dibuat" },
  { label: "Siap",       icon: Package,      desc: "Menunggu antar" },
  { label: "Diantar",    icon: Bike,         desc: "Dalam perjalanan" },
];

function ActiveOrder() {
  const [order, setOrder] = useState(MOCK_ORDER);

  // Simulate order progressing
  useEffect(() => {
    const intervals = [8000, 14000, 20000];
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setOrder((o) => ({ ...o, status: Math.min(i + 2, ORDER_STEPS.length - 1) })), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mx-4 mt-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
          Pesanan Aktif 🍽️
        </h3>
        <div className="flex items-center gap-1 bg-[#EBF5FF] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#45A1FD] animate-pulse" />
          <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#45A1FD] font-semibold">
            Live
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm overflow-hidden">
        {/* Order ID */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436] font-medium">
            Pesanan #{order.id}
          </span>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              backgroundColor: order.status >= 3 ? "#ECFDF5" : "#EBF5FF",
              color: order.status >= 3 ? "#059669" : "#45A1FD",
            }}
          >
            {ORDER_STEPS[order.status].label}
          </span>
        </div>

        {/* Status tracker */}
        <div className="flex items-center mt-4 mb-4 px-1 relative">
          {/* Connecting line */}
          <div className="absolute left-5 right-5 top-4 h-0.5 bg-gray-100" />
          <motion.div
            className="absolute left-5 top-4 h-0.5 bg-[#45A1FD]"
            initial={{ width: 0 }}
            animate={{ width: `${(order.status / (ORDER_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ maxWidth: "calc(100% - 40px)" }}
          />

          {ORDER_STEPS.map((step, i) => {
            const done = i < order.status;
            const active = i === order.status;
            return (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5 relative z-10">
                <motion.div
                  animate={{
                    scale: active ? [1, 1.15, 1] : 1,
                    backgroundColor: done || active ? "#45A1FD" : "#E5E7EB",
                  }}
                  transition={{ duration: active ? 1.5 : 0.3, repeat: active ? Infinity : 0, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                >
                  {done ? (
                    <CheckCircle2 size={14} className="text-white" />
                  ) : active ? (
                    <Loader2 size={14} className="text-white animate-spin" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  )}
                </motion.div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "9px",
                    fontWeight: done || active ? 700 : 500,
                    color: done || active ? "#45A1FD" : "#9CA3AF",
                  }}
                  className="text-center leading-tight"
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Items list */}
        <div className="border-t border-gray-100 pt-3 space-y-1.5">
          {order.items.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
                {item.qty}× {item.name}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-semibold text-[#1C1410]">
                Rp {(item.qty * item.price).toLocaleString("id")}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
            <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-bold text-[#1C1410]">
              Total
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", color: "#45A1FD" }} className="text-sm font-bold">
              Rp {order.total.toLocaleString("id")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 6. Event Terdekat ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function EventCard({ onRegister }: { onRegister: () => void }) {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    setRegistered(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mx-4 mt-5"
    >
      <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] mb-3">
        Event Terdekat 🎪
      </h3>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
        {/* Event image */}
        <div className="relative h-36 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1706295331319-8ec5da63cb91?w=800&q=80"
            alt="Board Game Tournament"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,20,16,0.75) 0%, transparent 60%)" }} />

          {/* Event badge */}
          <div className="absolute top-3 left-3 bg-[#45A1FD] text-white text-xs font-bold px-3 py-1 rounded-full"
               style={{ fontFamily: "'DM Sans', sans-serif" }}>
            🏆 Turnamen
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-white font-bold text-base leading-tight">
              Catan Open Championship 2026
            </h4>
          </div>
        </div>

        <div className="p-4">
          {/* Event details */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#6B4436]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
                Minggu, 10 Mei 2026 · 14.00 WIB
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-[#6B4436]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
                Sisa 6 slot dari 24
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy size={13} className="text-[#F59E0B]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436] font-semibold">
                Hadiah Rp 2.500.000
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-[#EBF5FF] rounded-2xl p-3 mb-4">
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436] text-center mb-2 font-medium">
              ⏳ Mulai dalam
            </p>
            <div className="flex items-stretch justify-center gap-2">
              {[
                { v: days,    l: "Hari" },
                { v: hours,   l: "Jam" },
                { v: minutes, l: "Menit" },
                { v: seconds, l: "Detik" },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-xl px-3 py-2 min-w-[44px] text-center shadow-sm">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={v}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 8, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#45A1FD" }}
                          className="font-bold block leading-none"
                        >
                          {String(v).padStart(2, "0")}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF] mt-1 font-medium">
                      {l}
                    </span>
                  </div>
                  {i < 3 && (
                    <span style={{ fontFamily: "'Fraunces', serif" }} className="text-[#45A1FD] font-bold text-lg mb-4">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Register button */}
          <AnimatePresence mode="wait">
            {registered ? (
              <motion.div
                key="done"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 py-3.5 bg-emerald-50 rounded-2xl border border-emerald-200"
              >
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm font-bold text-emerald-600">
                  Terdaftar! Sampai jumpa 🎉
                </span>
              </motion.div>
            ) : (
              <motion.button
                key="register"
                whileHover={{ translateY: -3, boxShadow: "0 8px 24px rgba(69,161,253,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRegister}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: "0 4px 16px rgba(69,161,253,0.3)",
                }}
              >
                <Calendar size={16} />
                Daftar Sekarang
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Page ────────────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════��═════

const SHOW_ACTIVE_ORDER = true; // Toggle this to show/hide active order

export default function BerandaPage() {
  const { isGuest, tableId, openGMSheet } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGame, setSelectedGame] = useState<GameRec | null>(null);

  const mode = searchParams.get("mode") ?? (isGuest ? "guest" : "");
  const qp = (path: string) => `${path}?table=${tableId}${mode ? `&mode=${mode}` : ""}`;

  const go = (route: string) => {
    if (route === "register") { navigate(`/register?table=${tableId}`); return; }
    navigate(qp(`/app/${route}`));
  };

  return (
    <>
      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <div className="flex flex-col pb-8">
        {/* 1. Hero */}
        <HeroCard onNavigate={go} />

        {/* 1.5 Daily Streak Banner */}
        <DailyStreakBanner onNavigate={go} />

        {/* 2. Quick Actions */}
        <QuickActions
          onMenu={() => go("menu")}
          onGames={() => go("games")}
          onRewards={() => go("rewards")}
          onGM={openGMSheet}
        />

        {/* 3. Promo Carousel */}
        <PromoCarousel />

        {/* 4. Game Recommendations */}
        <GameRecommendations
          onViewAll={() => go("games")}
          onGameClick={(game) => setSelectedGame(game)}
        />

        {/* 5. Active Order (conditional) */}
        {SHOW_ACTIVE_ORDER && <ActiveOrder />}

        {/* 6. Event Terdekat */}
        <EventCard onRegister={() => {}} />

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* ── Game Quick Detail Sheet ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedGame && (
          <GameQuickSheet
            key={selectedGame.id}
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onViewAll={() => go("games")}
          />
        )}
      </AnimatePresence>
    </>
  );
}
