import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Gift, Check, X, Star, ChevronRight, AlertCircle,
  Tag, Copy, Sparkles, Clock, Package, Zap,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Types ────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

type RewardCategory = "Diskon" | "Free Item" | "Merchandise" | "Eksklusif";

interface Reward {
  id: string;
  category: RewardCategory;
  name: string;
  desc: string;
  points: number;
  valueRp: number;
  stock: number;
  validDays: number | null;
  image?: string;
  emoji?: string;
  popular?: boolean;
  new?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Category Config ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const CAT_CONFIG: Record<RewardCategory, {
  emoji: string; bg: string; text: string;
  gradFrom: string; gradTo: string; border: string;
}> = {
  Diskon:       { emoji: "🏷️", bg: "#EBF5FF", text: "#45A1FD", gradFrom: "#45A1FD", gradTo: "#82C2FF", border: "#FED7AA" },
  "Free Item":  { emoji: "☕", bg: "#ECFDF5", text: "#059669", gradFrom: "#059669", gradTo: "#34D399", border: "#A7F3D0" },
  Merchandise:  { emoji: "🎁", bg: "#F5F3FF", text: "#7C3AED", gradFrom: "#7C3AED", gradTo: "#A78BFA", border: "#DDD6FE" },
  Eksklusif:    { emoji: "⭐", bg: "#FFFBEB", text: "#D97706", gradFrom: "#D97706", gradTo: "#FCD34D", border: "#FDE68A" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Rewards Data ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const REWARDS: Reward[] = [
  // ── Diskon ──
  {
    id: "d1", category: "Diskon",
    name: "Diskon 10% Semua Menu",
    desc: "Potongan harga untuk semua item menu saat kunjunganmu berikutnya",
    points: 200, valueRp: 20_000, stock: 50, validDays: 30,
    emoji: "🏷️", popular: true,
  },
  {
    id: "d2", category: "Diskon",
    name: "Diskon 20% Sesi Game",
    desc: "Hemat lebih banyak untuk sesi bermain game favorit kamu",
    points: 400, valueRp: 30_000, stock: 30, validDays: 30,
    emoji: "🎮",
  },
  {
    id: "d3", category: "Diskon",
    name: "Diskon 50% Minuman",
    desc: "Setengah harga untuk satu minuman pilihanmu di menu",
    points: 800, valueRp: 35_000, stock: 20, validDays: 14,
    emoji: "🥤",
  },
  {
    id: "d4", category: "Diskon",
    name: "Free Sesi Game 2 Jam",
    desc: "Nikmati 2 jam penuh bermain game favoritmu, gratis total!",
    points: 2_000, valueRp: 100_000, stock: 10, validDays: 60,
    emoji: "🎲",
  },

  // ── Free Item ──
  {
    id: "f1", category: "Free Item",
    name: "Free Espresso Shot",
    desc: "Satu gelas espresso segar pilihan barista kami, gratis untukmu",
    points: 220, valueRp: 35_000, stock: 15, validDays: 14,
    image: "https://images.unsplash.com/photo-1587734292651-5ab8284f8a9e?w=600&q=80",
    popular: true,
  },
  {
    id: "f2", category: "Free Item",
    name: "Free Dessert Pilihan",
    desc: "Satu porsi dessert spesial dari menu pilihan chef kami",
    points: 350, valueRp: 45_000, stock: 10, validDays: 14,
    image: "https://images.unsplash.com/photo-1737700088028-fae0666feb83?w=600&q=80",
  },
  {
    id: "f3", category: "Free Item",
    name: "Upgrade Ukuran Minuman",
    desc: "Upgrade minumanmu ke ukuran terbesar tanpa biaya tambahan",
    points: 100, valueRp: 15_000, stock: 100, validDays: 7,
    image: "https://images.unsplash.com/photo-1534349842105-3ca31a513556?w=600&q=80",
    new: true,
  },

  // ── Merchandise ──
  {
    id: "m1", category: "Merchandise",
    name: "Stiker Pack Sebangku",
    desc: "5 stiker eksklusif desain karakter board game khas Sebangku",
    points: 500, valueRp: 50_000, stock: 25, validDays: null,
    image: "https://images.unsplash.com/photo-1626971992269-3fc1e95a0505?w=600&q=80",
    popular: true,
  },
  {
    id: "m2", category: "Merchandise",
    name: "Tote Bag Sebangku",
    desc: "Tas kanvas premium logo Sebangku — stylish sekaligus eco-friendly",
    points: 2_500, valueRp: 150_000, stock: 8, validDays: null,
    image: "https://images.unsplash.com/photo-1618249807726-2f381c277de1?w=600&q=80",
  },
  {
    id: "m3", category: "Merchandise",
    name: "Dice Set Premium",
    desc: "Set 7 dadu polyhedral berkualitas tinggi untuk RPG & board game",
    points: 5_000, valueRp: 300_000, stock: 5, validDays: null,
    image: "https://images.unsplash.com/photo-1651287898571-b678c99f30af?w=600&q=80",
  },
  {
    id: "m4", category: "Merchandise",
    name: "Kaos Sebangku",
    desc: "Kaos cotton combed 30s dengan desain artwork eksklusif limited edition",
    points: 8_000, valueRp: 450_000, stock: 12, validDays: null,
    image: "https://images.unsplash.com/photo-1768987439382-61710dbce5d6?w=600&q=80",
  },

  // ── Eksklusif ──
  {
    id: "e1", category: "Eksklusif",
    name: "Early Access Event",
    desc: "Booking tiket event board game Sebangku 24 jam sebelum publik",
    points: 300, valueRp: 50_000, stock: 20, validDays: 30,
    image: "https://images.unsplash.com/photo-1564175370902-326722587310?w=600&q=80",
    popular: true,
  },
  {
    id: "e2", category: "Eksklusif",
    name: "Private Game Vault",
    desc: "Akses ke koleksi game langka & edisi terbatas yang tidak dipajang",
    points: 1_000, valueRp: 200_000, stock: 5, validDays: 14,
    emoji: "🗝️",
  },
  {
    id: "e3", category: "Eksklusif",
    name: "VIP Priority Access",
    desc: "Prioritas meja & GM personal dedicatedkhusus untuk sesi berikutmu",
    points: 3_000, valueRp: 500_000, stock: 3, validDays: 30,
    emoji: "👑",
  },
];

const CATEGORIES: { key: string; label: string }[] = [
  { key: "Semua",      label: "✨ Semua"     },
  { key: "Diskon",     label: "🏷️ Diskon"    },
  { key: "Free Item",  label: "☕ Free Item"  },
  { key: "Merchandise",label: "🎁 Merch"      },
  { key: "Eksklusif",  label: "⭐ Eksklusif"  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Helpers ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function fmt(n: number) { return n.toLocaleString("id"); }

function generateCode(id: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg1 = Array.from({ length: 4 }, (_, i) => chars[(id.charCodeAt(i % id.length) + i * 7) % chars.length]).join("");
  const seg2 = Array.from({ length: 4 }, (_, i) => chars[(id.charCodeAt(i % id.length) * 3 + i * 11) % chars.length]).join("");
  return `SBK-${seg1}-${seg2}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Confetti ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const CONFETTI_COLORS = ["#45A1FD", "#82C2FF", "#F59E0B", "#FCD34D", "#10B981", "#34D399", "#3B82F6", "#EC4899", "#8B5CF6"];
// Pre-computed so confetti is deterministic
const CONFETTI_PARTICLES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,             // golden ratio distribution
  size: 6 + (i * 3.7) % 9,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: (i * 0.043) % 0.7,
  duration: 1.6 + (i * 0.051) % 1.2,
  rotation: (i * 67) % 720,
  shape: i % 3,                       // 0 square 1 circle 2 rect
}));

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {CONFETTI_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width:  p.shape === 2 ? p.size * 0.5 : p.size,
            height: p.shape === 2 ? p.size * 1.8  : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 1 ? "50%" : "2px",
          }}
          initial={{ y: -20, rotate: 0, opacity: 1, scaleX: 1 }}
          animate={{ y: "108vh", rotate: p.rotation, opacity: [1, 1, 0.6, 0], scaleX: [1, 0.6, 1] }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.15, 0, 0.85, 1] }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Success Overlay ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function SuccessOverlay({
  reward, remainingPoints, onClose
}: {
  reward: Reward; remainingPoints: number; onClose: () => void;
}) {
  const code = generateCode(reward.id);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // auto-close after 8 seconds
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "rgba(28,20,16,0.75)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.75, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-sm"
      >
        {/* Green header */}
        <div className="flex flex-col items-center py-8 px-6"
             style={{ background: "linear-gradient(160deg, #059669, #34D399)" }}>
          {/* Checkmark circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 20 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
            >
              <Check size={36} className="text-emerald-500" strokeWidth={3} />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: "'Fraunces', serif" }}
            className="font-bold text-white text-xl text-center"
          >
            Berhasil Ditukar! 🎉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-emerald-100 text-sm text-center mt-1"
          >
            {reward.name}
          </motion.p>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-4">
          {/* Voucher code */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4">
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF] mb-1.5 text-center">
              Kode Voucher — tunjukkan ke kasir
            </p>
            <div className="flex items-center gap-2 justify-center">
              <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] tracking-widest text-lg">
                {code}
              </p>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleCopy}
                className="w-8 h-8 bg-white rounded-xl border border-gray-200 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={13} className="text-emerald-500" />
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Copy size={13} className="text-[#9CA3AF]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            {reward.validDays && (
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF] text-center mt-1.5">
                ⏱ Berlaku {reward.validDays} hari sejak penukaran
              </p>
            )}
          </div>

          {/* Points summary */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-red-50 rounded-2xl p-3 text-center">
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">Poin Digunakan</p>
              <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-red-500">−{fmt(reward.points)}</p>
            </div>
            <div className="text-[#9CA3AF]">→</div>
            <div className="flex-1 bg-[#EBF5FF] rounded-2xl p-3 text-center">
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">Sisa Poin</p>
              <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#45A1FD]">{fmt(remainingPoints)}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
              background: "linear-gradient(135deg, #45A1FD, #82C2FF)", color: "white",
            }}
          >
            Tutup & Lanjutkan 🎊
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Confirm Dialog ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function ConfirmDialog({
  reward, userPoints, onConfirm, onCancel
}: {
  reward: Reward; userPoints: number; onConfirm: () => void; onCancel: () => void;
}) {
  const remaining = userPoints - reward.points;
  const cat = CAT_CONFIG[reward.category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(28,20,16,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="bg-white rounded-t-3xl overflow-hidden"
        style={{ maxWidth: "512px", width: "100%", margin: "0 auto" }}
      >
        <div className="flex justify-center pt-3 pb-0"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
            Konfirmasi Penukaran
          </h3>
          <button onClick={onCancel} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Reward preview */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3.5">
            {reward.image ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${cat.gradFrom}, ${cat.gradTo})` }}
              >
                {reward.emoji}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] leading-tight">{reward.name}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436] mt-0.5">{reward.desc}</p>
              {reward.validDays && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={10} className="text-[#9CA3AF]" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">
                    Berlaku {reward.validDays} hari
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Points summary */}
          <div className="space-y-2">
            {[
              { label: "Poin kamu saat ini", value: `${fmt(userPoints)} poin`, color: "#1C1410" },
              { label: "Poin ditukar",        value: `−${fmt(reward.points)} poin`, color: "#EF4444" },
              { label: "Sisa poin setelah tukar", value: `${fmt(remaining)} poin`, color: "#45A1FD", bold: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436]">{row.label}</span>
                <span style={{
                  fontFamily: row.bold ? "'Fraunces', serif" : "'DM Sans', sans-serif",
                  fontWeight: row.bold ? 700 : 600, color: row.color, fontSize: row.bold ? "15px" : "13px"
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100" />

          {/* Equivalent value */}
          <div className="flex items-center gap-2 bg-[#EBF5FF] rounded-xl px-3 py-2">
            <Sparkles size={14} className="text-[#45A1FD] shrink-0" />
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
              Nilai reward setara <span style={{ fontWeight: 700, color: "#45A1FD" }}>Rp {fmt(reward.valueRp)}</span>
              {" "}— hemat {Math.round((reward.valueRp / (reward.points * 10)) * 100 - 100)}% vs beli langsung
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pb-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl cursor-pointer border border-gray-200 text-[#9CA3AF] hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px" }}
            >
              Batal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className="flex-1 py-3 rounded-2xl cursor-pointer"
              style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
                background: "linear-gradient(135deg, #45A1FD, #82C2FF)", color: "white",
                boxShadow: "0 6px 20px rgba(69,161,253,0.35)",
              }}
            >
              Ya, Tukar! 🎁
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Reward Card ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function RewardCard({
  reward, userPoints, index, onExchange
}: {
  reward: Reward; userPoints: number; index: number; onExchange: () => void;
}) {
  const canAfford = userPoints >= reward.points;
  const shortage  = reward.points - userPoints;
  const cat       = CAT_CONFIG[reward.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ translateY: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Image / Gradient area */}
      <div className="relative w-full" style={{ paddingTop: "62%" }}>
        {reward.image ? (
          <img
            src={reward.image} alt={reward.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${cat.gradFrom}, ${cat.gradTo})` }}
          >
            <span style={{ fontSize: "52px", lineHeight: 1 }}>{reward.emoji}</span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Category badge */}
          <div
            className="px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm"
            style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "rgba(255,255,255,0.92)", color: cat.text }}
          >
            {cat.emoji} {reward.category}
          </div>
          {reward.popular && (
            <div className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#45A1FD] text-white"
                 style={{ fontFamily: "'DM Sans', sans-serif" }}>
              🔥 Populer
            </div>
          )}
          {reward.new && (
            <div className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white"
                 style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ✨ Baru
            </div>
          )}
        </div>

        {/* Stock indicator */}
        {reward.stock <= 5 && (
          <div
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm"
            style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "rgba(239,68,68,0.9)", color: "white" }}
          >
            Sisa {reward.stock}!
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}
           className="leading-tight line-clamp-2">
          {reward.name}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}
           className="line-clamp-2 flex-1">
          {reward.desc}
        </p>

        {/* Points badge */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-white"
              style={{
                fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "13px",
                background: "linear-gradient(135deg, #45A1FD, #EF4444)",
              }}
            >
              <Star size={10} fill="white" stroke="none" />
              {fmt(reward.points)}p
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[9px] text-[#9CA3AF] mt-0.5 ml-0.5">
              ≈ Rp {fmt(reward.valueRp)}
            </p>
          </div>
        </div>

        {/* Exchange button */}
        <motion.button
          whileTap={canAfford ? { scale: 0.95 } : {}}
          onClick={canAfford ? onExchange : undefined}
          className="w-full py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-all mt-1"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: canAfford
              ? "linear-gradient(135deg, #45A1FD, #82C2FF)"
              : "#F3F4F6",
            color: canAfford ? "white" : "#9CA3AF",
            cursor: canAfford ? "pointer" : "default",
            boxShadow: canAfford ? "0 4px 12px rgba(69,161,253,0.3)" : "none",
          }}
        >
          {canAfford ? (
            <><Gift size={11} /> Tukar Sekarang</>
          ) : (
            <><AlertCircle size={11} /> Kurang {fmt(shortage)} poin</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Points Header ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function PointsHeader({ points }: { points: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: "linear-gradient(135deg, #45A1FD 0%, #82C2FF 100%)" }}
    >
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">
        🪙
      </div>
      <div className="flex-1">
        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/80 text-xs">Saldo Poin Tersedia</p>
        <motion.p
          key={points}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", lineHeight: 1.1 }}
          className="font-bold text-white"
        >
          {fmt(points)} Poin
        </motion.p>
      </div>
      <div className="text-right shrink-0">
        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/70 text-[10px]">Setara</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }} className="text-white text-sm">
          Rp {fmt(points * 10)}
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Page ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function RewardsPage() {
  const [searchParams] = useSearchParams();
  const [points, setPoints]               = useState(1_240);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [confirmReward, setConfirmReward]   = useState<Reward | null>(null);
  const [successData, setSuccessData]       = useState<{ reward: Reward; remaining: number } | null>(null);
  const [showConfetti, setShowConfetti]     = useState(false);
  const [prevTab, setPrevTab]               = useState("Semua");

  const filtered = useMemo(() =>
    activeCategory === "Semua"
      ? REWARDS
      : REWARDS.filter((r) => r.category === activeCategory),
    [activeCategory]);

  const handleExchange = (reward: Reward) => setConfirmReward(reward);

  const handleConfirm = () => {
    if (!confirmReward) return;
    const remaining = points - confirmReward.points;
    setPoints(remaining);
    setSuccessData({ reward: confirmReward, remaining });
    setConfirmReward(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3200);
  };

  const handleTabChange = (key: string) => {
    setPrevTab(activeCategory);
    setActiveCategory(key);
  };

  const tabDir = CATEGORIES.findIndex((c) => c.key === activeCategory) >=
                 CATEGORIES.findIndex((c) => c.key === prevTab) ? 1 : -1;

  return (
    <>
      <div className="flex flex-col pb-8 min-h-full">
        {/* ── Header ── */}
        <div className="bg-white sticky top-0 z-20" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="px-4 pt-4 pb-0">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
                  Tukar Poinmu 🎁
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
                  {REWARDS.length} reward tersedia untuk kamu
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#EBF5FF] rounded-xl px-3 py-1.5">
                <span className="text-base">🪙</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: "#45A1FD" }} className="text-sm">
                  {fmt(points)}
                </span>
              </div>
            </div>
          </div>

          {/* Points bar */}
          <PointsHeader points={points} />

          {/* Category tabs */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTabChange(cat.key)}
                  className="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: active ? "#45A1FD" : "#F7F7F8",
                    color: active ? "white" : "#6B4436",
                    border: active ? "1.5px solid #45A1FD" : "1.5px solid #E5E7EB",
                  }}
                >
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Result count ── */}
        <div className="px-4 pt-3 pb-1">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
            <span className="font-semibold text-[#1C1410]">{filtered.length}</span> reward ditemukan
            {activeCategory !== "Semua" && ` di kategori "${activeCategory}"`}
          </p>
        </div>

        {/* ── Reward Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: tabDir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tabDir * -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3 px-4 pt-1"
          >
            {filtered.map((reward, i) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userPoints={points}
                index={i}
                onExchange={() => handleExchange(reward)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Info note ── */}
        <div className="px-4 mt-4">
          <div className="bg-[#F8FAFC] rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <AlertCircle size={14} className="text-[#9CA3AF] shrink-0 mt-0.5" />
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF] leading-relaxed">
              Reward yang ditukar akan dikirim sebagai kode voucher dan berlaku sesuai masa validitasnya. Poin tidak bisa dikembalikan setelah penukaran.
            </p>
          </div>
        </div>
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>
        {showConfetti && <Confetti key="confetti" />}
      </AnimatePresence>

      <AnimatePresence>
        {confirmReward && (
          <ConfirmDialog
            key="confirm"
            reward={confirmReward}
            userPoints={points}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmReward(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successData && (
          <SuccessOverlay
            key="success"
            reward={successData.reward}
            remainingPoints={successData.remaining}
            onClose={() => setSuccessData(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

