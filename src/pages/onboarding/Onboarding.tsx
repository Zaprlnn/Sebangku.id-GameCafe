import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Camera, Sparkles, Upload, X } from "lucide-react";
import confetti from "canvas-confetti";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

interface GameCategory {
  id: string;
  label: string;
  emoji: string;
}

interface AvatarOption {
  id: string;
  src: string;
  alt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const GAME_CATEGORIES: GameCategory[] = [
  { id: "strategy", label: "Strategy", emoji: "♟️" },
  { id: "party", label: "Party Game", emoji: "🎉" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { id: "card", label: "Card Game", emoji: "🃏" },
  { id: "rpg", label: "RPG", emoji: "⚔️" },
  { id: "deduction", label: "Deduction", emoji: "🔍" },
  { id: "coop", label: "Co-op", emoji: "🤝" },
  { id: "abstract", label: "Abstract", emoji: "🔷" },
];

// Pixel-art style avatar SVG data URIs (8 unique game-themed avatars)
const PIXEL_AVATARS: AvatarOption[] = [
  {
    id: "knight",
    alt: "Knight",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23F55F1F' rx='8'/><rect x='13' y='4' width='6' height='6' fill='%23fff'/><rect x='12' y='10' width='8' height='8' fill='%23fff'/><rect x='11' y='10' width='2' height='4' fill='%23FF8A50'/><rect x='19' y='10' width='2' height='4' fill='%23FF8A50'/><rect x='14' y='18' width='4' height='8' fill='%23fff'/><rect x='12' y='22' width='3' height='6' fill='%23FF8A50'/><rect x='17' y='22' width='3' height='6' fill='%23FF8A50'/><rect x='14' y='6' width='1' height='2' fill='%231C1410'/><rect x='17' y='6' width='1' height='2' fill='%231C1410'/><rect x='14' y='9' width='4' height='1' fill='%231C1410'/></svg>`,
  },
  {
    id: "wizard",
    alt: "Wizard",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%234F46E5' rx='8'/><polygon points='16,2 22,14 10,14' fill='%23A78BFA'/><rect x='13' y='10' width='6' height='6' fill='%23FDE68A'/><rect x='12' y='16' width='8' height='8' fill='%23A78BFA'/><rect x='11' y='16' width='2' height='5' fill='%234F46E5'/><rect x='19' y='16' width='2' height='5' fill='%234F46E5'/><rect x='14' y='24' width='3' height='6' fill='%234F46E5'/><rect x='17' y='24' width='3' height='6' fill='%234F46E5'/><circle cx='21' cy='6' r='2' fill='%23FCD34D'/><rect x='14' y='12' width='1' height='2' fill='%231C1410'/><rect x='17' y='12' width='1' height='2' fill='%231C1410'/></svg>`,
  },
  {
    id: "rogue",
    alt: "Rogue",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%231C1410' rx='8'/><rect x='13' y='4' width='6' height='6' fill='%23F3D08A'/><rect x='12' y='10' width='8' height='8' fill='%23374151'/><rect x='11' y='10' width='2' height='4' fill='%231F2937'/><rect x='19' y='10' width='2' height='4' fill='%231F2937'/><rect x='13' y='18' width='6' height='8' fill='%23374151'/><rect x='12' y='22' width='3' height='6' fill='%231F2937'/><rect x='17' y='22' width='3' height='6' fill='%231F2937'/><rect x='14' y='6' width='1' height='2' fill='%231C1410'/><rect x='17' y='6' width='1' height='2' fill='%231C1410'/><rect x='14' y='9' width='4' height='1' fill='%23F55F1F'/><rect x='10' y='4' width='3' height='8' fill='%23374151' opacity='0.7'/></svg>`,
  },
  {
    id: "bard",
    alt: "Bard",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23D97706' rx='8'/><rect x='13' y='5' width='6' height='6' fill='%23FEF3C7'/><rect x='12' y='11' width='8' height='8' fill='%23B45309'/><rect x='11' y='11' width='2' height='4' fill='%23D97706'/><rect x='19' y='11' width='2' height='4' fill='%23D97706'/><rect x='13' y='19' width='6' height='8' fill='%23B45309'/><rect x='12' y='23' width='3' height='6' fill='%23D97706'/><rect x='17' y='23' width='3' height='6' fill='%23D97706'/><rect x='14' y='7' width='1' height='2' fill='%231C1410'/><rect x='17' y='7' width='1' height='2' fill='%231C1410'/><rect x='22' y='14' width='2' height='4' fill='%23FEF3C7'/><rect x='21' y='13' width='1' height='1' fill='%23FEF3C7'/><rect x='11' y='4' width='10' height='3' fill='%23B45309'/></svg>`,
  },
  {
    id: "paladin",
    alt: "Paladin",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23F59E0B' rx='8'/><rect x='13' y='4' width='6' height='6' fill='%23FEF3C7'/><rect x='12' y='10' width='8' height='8' fill='%23FBBF24'/><rect x='11' y='10' width='2' height='4' fill='%23F59E0B'/><rect x='19' y='10' width='2' height='4' fill='%23F59E0B'/><rect x='13' y='18' width='6' height='8' fill='%23FBBF24'/><rect x='12' y='22' width='3' height='6' fill='%23F59E0B'/><rect x='17' y='22' width='3' height='6' fill='%23F59E0B'/><rect x='14' y='6' width='1' height='2' fill='%231C1410'/><rect x='17' y='6' width='1' height='2' fill='%231C1410'/><rect x='10' y='10' width='12' height='2' fill='%23B45309'/><rect x='15' y='5' width='2' height='5' fill='%23fff' opacity='0.5'/></svg>`,
  },
  {
    id: "ranger",
    alt: "Ranger",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%2316A34A' rx='8'/><rect x='13' y='5' width='6' height='6' fill='%23D4C5A9'/><rect x='12' y='11' width='8' height='8' fill='%2315803D'/><rect x='11' y='11' width='2' height='4' fill='%2316A34A'/><rect x='19' y='11' width='2' height='4' fill='%2316A34A'/><rect x='13' y='19' width='6' height='8' fill='%2315803D'/><rect x='12' y='23' width='3' height='6' fill='%2316A34A'/><rect x='17' y='23' width='3' height='6' fill='%2316A34A'/><rect x='14' y='7' width='1' height='2' fill='%231C1410'/><rect x='17' y='7' width='1' height='2' fill='%231C1410'/><rect x='11' y='4' width='2' height='7' fill='%2392400E'/><rect x='10' y='3' width='4' height='2' fill='%2392400E'/></svg>`,
  },
  {
    id: "mage",
    alt: "Mage",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%237C3AED' rx='8'/><rect x='13' y='5' width='6' height='6' fill='%23EDE9FE'/><rect x='12' y='11' width='8' height='8' fill='%236D28D9'/><rect x='11' y='11' width='2' height='4' fill='%237C3AED'/><rect x='19' y='11' width='2' height='4' fill='%237C3AED'/><rect x='13' y='19' width='6' height='8' fill='%236D28D9'/><rect x='12' y='23' width='3' height='6' fill='%237C3AED'/><rect x='17' y='23' width='3' height='6' fill='%237C3AED'/><rect x='14' y='7' width='1' height='2' fill='%231C1410'/><rect x='17' y='7' width='1' height='2' fill='%231C1410'/><rect x='21' y='10' width='3' height='8' fill='%23DDD6FE'/><rect x='20' y='9' width='5' height='2' fill='%23DDD6FE'/><circle cx='22' cy='8' r='2' fill='%23C4B5FD'/></svg>`,
  },
  {
    id: "cleric",
    alt: "Cleric",
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%230EA5E9' rx='8'/><rect x='13' y='5' width='6' height='6' fill='%23F0F9FF'/><rect x='12' y='11' width='8' height='8' fill='%230284C7'/><rect x='11' y='11' width='2' height='4' fill='%230EA5E9'/><rect x='19' y='11' width='2' height='4' fill='%230EA5E9'/><rect x='13' y='19' width='6' height='8' fill='%230284C7'/><rect x='12' y='23' width='3' height='6' fill='%230EA5E9'/><rect x='17' y='23' width='3' height='6' fill='%230EA5E9'/><rect x='14' y='7' width='1' height='2' fill='%231C1410'/><rect x='17' y='7' width='1' height='2' fill='%231C1410'/><rect x='15' y='3' width='2' height='6' fill='%23fff'/><rect x='13' y='5' width='6' height='2' fill='%23fff'/></svg>`,
  },
];

// ─── Dice SVG Illustration ────────────────────────────────────────────────────
function DiceCharacter() {
  return (
    <motion.svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-36 h-36 mx-auto"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
    >
      {/* Shadow */}
      <ellipse cx="80" cy="148" rx="32" ry="8" fill="#45A1FD" opacity="0.2" />

      {/* Dice body */}
      <motion.g
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ originX: "80px", originY: "80px" }}
      >
        {/* Main die */}
        <rect x="28" y="28" width="80" height="80" rx="18" fill="#45A1FD" />
        <rect x="30" y="30" width="76" height="76" rx="16" fill="#82C2FF" />

        {/* Dots pattern (showing 5) */}
        <circle cx="52" cy="52" r="7" fill="#1C1410" />
        <circle cx="80" cy="52" r="7" fill="#1C1410" />
        <circle cx="108" cy="52" r="7" fill="#1C1410" />
        <circle cx="80" cy="80" r="7" fill="#1C1410" />
        <circle cx="52" cy="108" r="7" fill="#1C1410" />
        <circle cx="108" cy="108" r="7" fill="#1C1410" />

        {/* Shine */}
        <ellipse cx="55" cy="42" rx="12" ry="6" fill="white" opacity="0.25" transform="rotate(-30 55 42)" />
      </motion.g>

      {/* Arms */}
      <motion.path
        d="M26 72 Q10 60 14 44 Q16 36 24 40"
        stroke="#45A1FD" strokeWidth="8" strokeLinecap="round" fill="none"
        animate={{ rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
        style={{ originX: "25px", originY: "72px" }}
      />
      <motion.path
        d="M134 72 Q150 60 146 44 Q144 36 136 40"
        stroke="#45A1FD" strokeWidth="8" strokeLinecap="round" fill="none"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
        style={{ originX: "135px", originY: "72px" }}
      />

      {/* Legs */}
      <path d="M60 108 Q52 128 46 140" stroke="#45A1FD" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M100 108 Q108 128 114 140" stroke="#45A1FD" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Feet */}
      <ellipse cx="44" cy="142" rx="10" ry="5" fill="#45A1FD" />
      <ellipse cx="116" cy="142" rx="10" ry="5" fill="#45A1FD" />

      {/* Eyes on die */}
      <circle cx="66" cy="68" r="5" fill="white" />
      <circle cx="94" cy="68" r="5" fill="white" />
      <circle cx="68" cy="69" r="2.5" fill="#1C1410" />
      <circle cx="96" cy="69" r="2.5" fill="#1C1410" />

      {/* Smile */}
      <path d="M70 82 Q80 90 90 82" stroke="#1C1410" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Stars / sparkles */}
      <motion.g
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
      >
        <path d="M140 20 L142 14 L144 20 L150 22 L144 24 L142 30 L140 24 L134 22 Z" fill="#45A1FD" />
      </motion.g>
      <motion.g
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }}
      >
        <path d="M16 16 L17.5 11 L19 16 L24 17.5 L19 19 L17.5 24 L16 19 L11 17.5 Z" fill="#82C2FF" />
      </motion.g>
      <motion.g
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 1.2 }}
      >
        <path d="M148 100 L149.5 95 L151 100 L156 101.5 L151 103 L149.5 108 L148 103 L143 101.5 Z" fill="#EBF5FF" />
      </motion.g>
    </motion.svg>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  const steps = [
    { num: 1, label: "Selamat Datang" },
    { num: 2, label: "Preferensi Game" },
    { num: 3, label: "Profil" },
  ];

  return (
    <div className="w-full px-6 pt-6 pb-4">
      <div className="flex items-center gap-0">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                animate={{
                  backgroundColor: step > s.num ? "#45A1FD" : step === s.num ? "#45A1FD" : "#E5E7EB",
                  color: step >= s.num ? "#FFFFFF" : "#9CA3AF",
                  scale: step === s.num ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {step > s.num ? <Check size={14} /> : s.num}
              </motion.div>
              <span
                className="text-xs mt-1 whitespace-nowrap"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: step === s.num ? "#45A1FD" : "#9CA3AF",
                  fontSize: "10px",
                }}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-1 rounded-full overflow-hidden bg-gray-200 mb-4">
                <motion.div
                  className="h-full rounded-full bg-[#45A1FD]"
                  animate={{ width: step > s.num ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Welcome Badge ────────────────────────────────────────────────────────────
function WelcomeBadge() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.6 }}
      className="inline-flex items-center gap-2 bg-[#45A1FD] text-white px-5 py-2.5 rounded-full shadow-lg"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.span
        animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
        className="text-lg"
      >
        ✨
      </motion.span>
      <span className="font-semibold text-sm">+100 Poin Welcome Bonus</span>
      <motion.span
        animate={{ scale: [1, 1.3, 1], rotate: [0, -20, 20, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1.3 }}
        className="text-lg"
      >
        ✨
      </motion.span>
    </motion.div>
  );
}

// ─── Step 1: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ onNext, userName }: { onNext: () => void; userName: string }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center text-center px-6 pb-8 gap-5"
    >
      {/* Illustration */}
      <div className="mt-2">
        <DiceCharacter />
      </div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h1
          style={{ fontFamily: "'Fraunces', serif" }}
          className="text-3xl font-bold text-[#1C1410] leading-tight"
        >
          Selamat datang,<br />
          <span className="text-[#45A1FD]">{userName || "Kamu"}!</span>
        </h1>
        <p
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="text-[#6B4436] text-base leading-relaxed max-w-xs mx-auto"
        >
          Kamu baru saja bergabung dengan komunitas board gamer terbaik 🎲
        </p>
      </motion.div>

      {/* Welcome bonus badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <WelcomeBadge />
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onNext}
        whileHover={{ translateY: -4, boxShadow: "0 8px 24px rgba(245, 95, 31, 0.4)" }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 bg-[#45A1FD] text-white px-8 py-3.5 rounded-2xl font-semibold shadow-lg cursor-pointer mt-2"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Mulai
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}

// ─── Step 2: Game Preferences ─────────────────────────────────────────────────
function StepPreferences({
  onNext,
  selected,
  setSelected,
}: {
  onNext: () => void;
  selected: string[];
  setSelected: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    setSelected(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    );
  };

  const canProceed = selected.length >= 2;

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col px-6 pb-8 gap-5"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          className="text-4xl mb-3"
        >
          🎮
        </motion.div>
        <h2
          style={{ fontFamily: "'Fraunces', serif" }}
          className="text-2xl font-bold text-[#1C1410]"
        >
          Game Favoritmu
        </h2>
        <p
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="text-[#6B4436] text-sm mt-1"
        >
          Pilih minimal{" "}
          <span className="text-[#45A1FD] font-semibold">2 kategori</span>{" "}
          favoritmu
        </p>
      </div>

      {/* Category chips grid */}
      <div className="grid grid-cols-2 gap-3">
        {GAME_CATEGORIES.map((cat, i) => {
          const isSelected = selected.includes(cat.id);
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => toggle(cat.id)}
              whileHover={{ translateY: -4, boxShadow: isSelected ? "0 8px 20px rgba(69,161,253,0.35)" : "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: isSelected ? "#45A1FD" : "#FFFFFF",
                borderColor: isSelected ? "#45A1FD" : "#E5E7EB",
                color: isSelected ? "#FFFFFF" : "#1C1410",
              }}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="font-medium text-sm">{cat.label}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center"
                >
                  <Check size={11} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Counter */}
      <div className="text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <span className="text-[#6B4436] text-sm">
          {selected.length > 0 ? (
            <>
              <span className="text-[#45A1FD] font-bold">{selected.length}</span> kategori dipilih
              {selected.length < 2 && (
                <span className="text-[#9CA3AF]"> · butuh {2 - selected.length} lagi</span>
              )}
            </>
          ) : (
            "Belum ada yang dipilih"
          )}
        </span>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { translateY: -4, boxShadow: "0 8px 24px rgba(245, 95, 31, 0.4)" } : {}}
        whileTap={canProceed ? { scale: 0.97 } : {}}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all cursor-pointer"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          backgroundColor: canProceed ? "#45A1FD" : "#E5E7EB",
          color: canProceed ? "#FFFFFF" : "#9CA3AF",
        }}
      >
        Lanjut
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}

// ─── Step 3: Profile Photo & Username ─────────────────────────────────────────
function StepProfile({
  onFinish,
  userName,
}: {
  onFinish: (username: string, avatarSrc: string) => void;
  userName: string;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(PIXEL_AVATARS[0].id);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState(() =>
    userName.toLowerCase().replace(/\s+/g, "") || "gamer"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedPhoto(ev.target?.result as string);
      setSelectedAvatar("");
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setUploadedPhoto(null);
    setSelectedAvatar(PIXEL_AVATARS[0].id);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const activeAvatarSrc =
    uploadedPhoto ||
    PIXEL_AVATARS.find((a) => a.id === selectedAvatar)?.src ||
    PIXEL_AVATARS[0].src;

  const handleSubmit = () => {
    if (username.trim().length < 3) return;
    onFinish(username.trim(), activeAvatarSrc);
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col px-6 pb-8 gap-5"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          className="text-4xl mb-3"
        >
          🧑‍🎨
        </motion.div>
        <h2
          style={{ fontFamily: "'Fraunces', serif" }}
          className="text-2xl font-bold text-[#1C1410]"
        >
          Foto & Username
        </h2>
        <p
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="text-[#6B4436] text-sm mt-1"
        >
          Buat profilmu supaya teman-teman bisa mengenalmu
        </p>
      </div>

      {/* Avatar preview + upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-[#45A1FD] shadow-lg"
          >
            <img
              src={activeAvatarSrc}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {uploadedPhoto && (
            <button
              onClick={removePhoto}
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#1C1410] rounded-full flex items-center justify-center cursor-pointer"
            >
              <X size={12} className="text-white" />
            </button>
          )}
        </div>

        {/* Upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <motion.button
          whileHover={{ translateY: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-[#45A1FD] text-[#45A1FD] text-sm font-medium cursor-pointer hover:bg-[#EBF5FF] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Upload size={14} />
          Upload Foto Sendiri
        </motion.button>
      </div>

      {/* Avatar grid */}
      <div>
        <p
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="text-xs text-[#6B4436] mb-2 font-medium flex items-center gap-1"
        >
          <Sparkles size={12} className="text-[#45A1FD]" />
          Atau pilih avatar pixel-art
        </p>
        <div className="grid grid-cols-4 gap-2">
          {PIXEL_AVATARS.map((avatar, i) => {
            const isActive = !uploadedPhoto && selectedAvatar === avatar.id;
            return (
              <motion.button
                key={avatar.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * i }}
                onClick={() => {
                  setSelectedAvatar(avatar.id);
                  setUploadedPhoto(null);
                }}
                whileHover={{ translateY: -3, scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
                style={{
                  border: isActive ? "3px solid #45A1FD" : "3px solid transparent",
                  boxShadow: isActive ? "0 4px 12px rgba(69,161,253,0.4)" : "none",
                }}
              >
                <img src={avatar.src} alt={avatar.alt} className="w-full h-full object-cover" />
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#45A1FD] rounded-full flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Username input */}
      <div>
        <label
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="block text-sm font-semibold text-[#1C1410] mb-2"
        >
          Username
        </label>
        <div className="relative">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
            maxLength={20}
            placeholder="username kamu"
            className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-[#E5E7EB] focus:border-[#45A1FD] focus:outline-none transition-colors bg-white text-[#1C1410]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
        <p
          className="text-xs text-[#9CA3AF] mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {username.length}/20 karakter
        </p>
      </div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={username.trim().length < 3}
        whileHover={
          username.trim().length >= 3
            ? { translateY: -4, boxShadow: "0 8px 24px rgba(245, 95, 31, 0.4)" }
            : {}
        }
        whileTap={username.trim().length >= 3 ? { scale: 0.97 } : {}}
        className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all cursor-pointer"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          backgroundColor: username.trim().length >= 3 ? "#45A1FD" : "#E5E7EB",
          color: username.trim().length >= 3 ? "#FFFFFF" : "#9CA3AF",
        }}
      >
        Selesai &amp; Mulai Main! 🎲
      </motion.button>
    </motion.div>
  );
}

// ─── Confetti Overlay ─────────────────────────────────────────────────────────
function ConfettiOverlay({ show }: { show: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (show && !fired.current) {
      fired.current = true;
      const colors = ["#45A1FD", "#82C2FF", "#EBF5FF", "#1C1410", "#FFFFFF"];

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors,
        scalar: 1.2,
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 },
          colors,
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors,
        });
      }, 300);
    }
  }, [show]);

  return null;
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "T01";

  // In a real app, this would come from auth/session context
  const userName = searchParams.get("name") || "Gamer";

  const [step, setStep] = useState<Step>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = useCallback(
    async (username: string, avatarSrc: string) => {
      setShowConfetti(true);
      setIsFinishing(true);

      // In a real app: save preferences, username, avatar to Supabase here
      console.log("Saving profile:", { username, avatarSrc, categories: selectedCategories });

      setTimeout(() => {
        navigate(`/app?table=${tableId}`);
      }, 2200);
    },
    [navigate, tableId, selectedCategories]
  );

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#EBF5FF", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Confetti */}
      <ConfettiOverlay show={showConfetti} />

      {/* Success overlay */}
      <AnimatePresence>
        {isFinishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: "#EBF5FF" }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-8xl mb-6"
            >
              🎲
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontFamily: "'Fraunces', serif" }}
              className="text-3xl font-bold text-[#1C1410] text-center"
            >
              Siap Bermain!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[#6B4436] mt-2 text-center"
            >
              Memuat Sebangku App...
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.7, duration: 1.2, ease: "easeInOut" }}
              className="h-1.5 bg-[#45A1FD] rounded-full mt-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header logo */}
      <div className="flex items-center justify-center pt-8 pb-2 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#45A1FD] rounded-xl flex items-center justify-center">
            <span className="text-white text-base">🎲</span>
          </div>
          <span
            style={{ fontFamily: "'Fraunces', serif" }}
            className="font-bold text-[#1C1410] text-lg"
          >
            Sebangku
          </span>
          <span className="text-xs text-[#6B4436] bg-white px-2 py-0.5 rounded-full border border-[#45A1FD]/30">
            Meja {tableId}
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col mx-4 mb-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col flex-1">
          {/* Progress bar */}
          <ProgressBar step={step} />

          {/* Divider */}
          <div className="h-px bg-[#45A1FD]/10 mx-6" />

          {/* Step content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepWelcome
                  key="step1"
                  userName={userName}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <StepPreferences
                  key="step2"
                  selected={selectedCategories}
                  setSelected={setSelectedCategories}
                  onNext={() => setStep(3)}
                />
              )}
              {step === 3 && (
                <StepProfile
                  key="step3"
                  userName={userName}
                  onFinish={handleFinish}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

