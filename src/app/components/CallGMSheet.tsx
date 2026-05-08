import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { useAppContext } from "../context/AppContext";

// ─── GM Profiles (on-duty mock) ───────────────────────────────────────────────

const GM_PROFILES = [
  {
    id: "gm1",
    name: "Rizky Aditya",
    role: "Senior Game Master",
    rating: 4.9,
    reviewCount: 312,
    specialties: ["Strategy", "RPG", "Co-op"],
    avatar: "https://images.unsplash.com/photo-1758874574397-e56dfcfc116d?w=200&q=80",
    statusMsg: "Aktif — Siap membantu 🎮",
  },
  {
    id: "gm2",
    name: "Sari Dewi",
    role: "Game Master",
    rating: 4.8,
    reviewCount: 214,
    specialties: ["Party", "Family", "Deduction"],
    avatar: "https://images.unsplash.com/photo-1753351052363-53ce102830eb?w=200&q=80",
    statusMsg: "Aktif — Berkeliling lantai 🎯",
  },
  {
    id: "gm3",
    name: "Daffa Pratama",
    role: "Game Master",
    rating: 4.7,
    reviewCount: 178,
    specialties: ["Card", "Abstract", "Strategy"],
    avatar: "https://images.unsplash.com/photo-1762744594797-bcfd17a8c032?w=200&q=80",
    statusMsg: "Aktif — Di area meja 5–10 🗺️",
  },
];

// Pick GM deterministically based on hour (rotates every shift)
function getOnDutyGM() {
  const hour = new Date().getHours();
  const idx = hour < 12 ? 0 : hour < 18 ? 1 : 2;
  return GM_PROFILES[idx];
}

// ─── Help Options ─────────────────────────────────────────────────────────────

const HELP_OPTIONS = [
  { id: "recommend",  emoji: "🎲", label: "Rekomendasikan game",  desc: "Bantu pilih game sesuai selera" },
  { id: "explain",    emoji: "📖", label: "Jelaskan cara main",   desc: "Demo & penjelasan langsung ke meja" },
  { id: "versus",     emoji: "⚔️", label: "Butuh lawan tanding",  desc: "GM siap jadi lawan bermain" },
  { id: "general",    emoji: "❓", label: "Pertanyaan umum",      desc: "Apapun yang ingin kamu tanyakan" },
];

// ─── Star Rating display ──────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          fill={s <= Math.round(rating) ? "#F59E0B" : "transparent"}
          stroke="#F59E0B"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ─── Help chip ────────────────────────────────────────────────────────────────

function HelpChip({
  option,
  selected,
  onToggle,
}: {
  option: typeof HELP_OPTIONS[number];
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      className="flex items-center gap-2.5 w-full px-3.5 py-3 rounded-2xl cursor-pointer transition-all text-left"
      style={{
        backgroundColor: selected ? "#EBF5FF" : "#F8FAFC",
        border: selected ? "2px solid #45A1FD" : "2px solid #F3F4F6",
      }}
    >
      {/* Emoji */}
      <span className="text-xl shrink-0 leading-none">{option.emoji}</span>
      {/* Labels */}
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: selected ? 700 : 600,
            fontSize: "13px",
            color: selected ? "#45A1FD" : "#1C1410",
          }}
        >
          {option.label}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: selected ? "#E8581A" : "#9CA3AF",
          }}
        >
          {option.desc}
        </p>
      </div>
      {/* Check indicator */}
      <motion.div
        animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#45A1FD" }}
      >
        <CheckCircle2 size={12} className="text-white" />
      </motion.div>
    </motion.button>
  );
}

// ─── Confirmation Card ────────────────────────────────────────────────────────

function ConfirmationCard({
  gm,
  selectedOptions,
  onClose,
}: {
  gm: typeof GM_PROFILES[number];
  selectedOptions: string[];
  onClose: () => void;
}) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((p) => {
        if (p <= 1) { clearInterval(t); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const selectedLabels = HELP_OPTIONS
    .filter((o) => selectedOptions.includes(o.id))
    .map((o) => `${o.emoji} ${o.label}`);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="flex flex-col items-center gap-4 py-6 px-2"
    >
      {/* Animated success ring */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #45A1FD, #82C2FF)" }}
        >
          <span className="text-4xl">🎮</span>
        </motion.div>
        {/* Ping ring */}
        <motion.div
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full"
          style={{ border: "3px solid #45A1FD" }}
        />
      </div>

      {/* Title */}
      <div className="text-center">
        <h3
          style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#1C1410" }}
          className="font-bold leading-tight"
        >
          GM menuju meja kamu! 🎉
        </h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B4436" }}
           className="mt-1">
          Ditunggu sebentar ya, GM sudah dalam perjalanan
        </p>
      </div>

      {/* ETA badge */}
      <div
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl"
        style={{ backgroundColor: "#EBF5FF", border: "1.5px solid #FED7AA" }}
      >
        <Clock size={16} className="text-[#45A1FD]" />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px", color: "#45A1FD" }}>
          ⏱️ Estimasi 2–3 menit
        </span>
      </div>

      {/* GM who's coming */}
      <div
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: "#F8FAFC", border: "1px solid #F3F4F6" }}
      >
        <img
          src={gm.avatar}
          alt={gm.name}
          className="w-10 h-10 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
            {gm.name}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF" }}>
            {gm.role}
          </p>
        </div>
        <div
          className="px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ backgroundColor: "#ECFDF5" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: "#059669" }}>
            Menuju meja
          </span>
        </div>
      </div>

      {/* What they're coming for */}
      {selectedLabels.length > 0 && (
        <div className="w-full">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }}
             className="uppercase tracking-wide mb-2">
            Kebutuhan yang dicatat:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedLabels.map((l) => (
              <span
                key={l}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#EBF5FF", color: "#45A1FD" }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Close button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl flex items-center justify-center cursor-pointer mt-1"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: "14px",
          background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
          color: "white",
          boxShadow: "0 4px 16px rgba(69,161,253,0.3)",
        }}
      >
        Oke, Ditunggu! 👋
      </motion.button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CallGMSheet() {
  const { gmSheetOpen, closeGMSheet, tableId } = useAppContext();
  const [selectedOpts, setSelectedOpts] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const gm = getOnDutyGM();
  const tableNum = tableId.replace(/^[A-Za-z]+/, "");

  // Reset when sheet opens
  useEffect(() => {
    if (gmSheetOpen) {
      setSelectedOpts([]);
      setNote("");
      setSubmitted(false);
      setIsSubmitting(false);
    }
  }, [gmSheetOpen]);

  const toggleOpt = (id: string) => {
    setSelectedOpts((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate network call
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const canSubmit = selectedOpts.length > 0 && !isSubmitting;

  return (
    <AnimatePresence>
      {gmSheetOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 flex flex-col justify-end"
          style={{ backgroundColor: "rgba(28,20,16,0.6)", zIndex: 60 }}
          onClick={(e) => e.target === e.currentTarget && closeGMSheet()}
        >
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="bg-white rounded-t-3xl flex flex-col overflow-hidden max-w-lg w-full mx-auto"
            style={{ maxHeight: "92vh", zIndex: 61 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Drag handle ─────────────────────────────────────────────── */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* ── Header ──────────────────────────────────────────────────── */}
            {!submitted && (
              <div
                className="flex items-center justify-between px-5 pb-4 pt-1 shrink-0"
                style={{ borderBottom: "1px solid #F3F4F6" }}
              >
                <div>
                  <h2
                    style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#1C1410" }}
                    className="font-bold leading-tight"
                  >
                    Panggil Game Master 🎲
                  </h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9CA3AF" }}
                     className="mt-0.5">
                    Meja {tableNum} · Respon 2–3 menit
                  </p>
                </div>
                <button
                  onClick={closeGMSheet}
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            )}

            {/* ── Scrollable body ─────────────────────────────────────────── */}
            <div className="overflow-y-auto flex-1 px-5 pb-5">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <ConfirmationCard
                    key="confirm"
                    gm={gm}
                    selectedOptions={selectedOpts}
                    onClose={closeGMSheet}
                  />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-4 pt-4"
                  >
                    {/* ── GM on-duty card ─────────────────────────────────── */}
                    <div
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #EBF5FF 0%, #FFF8F3 100%)",
                        border: "1.5px solid #FED7AA",
                      }}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={gm.avatar}
                          alt={gm.name}
                          className="w-14 h-14 rounded-2xl object-cover"
                        />
                        {/* Online dot */}
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                          style={{ backgroundColor: "#22C55E" }}
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                            style={{ backgroundColor: "#45A1FD", color: "white", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Bertugas
                          </span>
                        </div>
                        <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>
                          {gm.name}
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#6B4436" }}>
                          {gm.role}
                        </p>
                        {/* Rating row */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <StarRating rating={gm.rating} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#1C1410" }}>
                            {gm.rating}
                          </span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                            ({gm.reviewCount} ulasan)
                          </span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="shrink-0 flex flex-col gap-1 items-end">
                        {gm.specialties.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "white", color: "#6B4436", border: "1px solid #E5E7EB" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status message */}
                    <div className="flex items-center gap-2 -mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                        {gm.statusMsg}
                      </p>
                    </div>

                    {/* ── Subtitle ────────────────────────────────────────── */}
                    <div>
                      <h3
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: "#1C1410" }}
                        className="font-bold"
                      >
                        Butuh bantuan? GM siap membantu!
                      </h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9CA3AF" }}
                         className="mt-0.5">
                        Pilih satu atau lebih kebutuhan kamu
                      </p>
                    </div>

                    {/* ── Help chips ──────────────────────────────────────── */}
                    <div className="flex flex-col gap-2.5">
                      {HELP_OPTIONS.map((opt) => (
                        <HelpChip
                          key={opt.id}
                          option={opt}
                          selected={selectedOpts.includes(opt.id)}
                          onToggle={() => toggleOpt(opt.id)}
                        />
                      ))}
                    </div>

                    {/* ── Textarea ────────────────────────────────────────── */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={13} className="text-[#6B4436]" />
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B4436", fontWeight: 600 }}>
                          Ceritakan lebih lanjut…{" "}
                          <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(opsional)</span>
                        </p>
                      </div>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Contoh: Kami 4 orang, baru pertama main, pengen game yang tidak terlalu rumit..."
                        rows={3}
                        maxLength={200}
                        className="w-full resize-none outline-none"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          color: "#1C1410",
                          backgroundColor: "#F8FAFC",
                          border: "1.5px solid #E5E7EB",
                          borderRadius: "16px",
                          padding: "12px 14px",
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.border = "1.5px solid #45A1FD";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.border = "1.5px solid #E5E7EB";
                        }}
                      />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}
                         className="text-right mt-1">
                        {note.length}/200
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Submit button (sticky bottom) ───────────────────────────── */}
            {!submitted && (
              <div
                className="px-5 pb-5 pt-3 shrink-0"
                style={{ borderTop: "1px solid #F3F4F6", backgroundColor: "white" }}
              >
                <motion.button
                  whileTap={canSubmit ? { scale: 0.97 } : {}}
                  onClick={canSubmit ? handleSubmit : undefined}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-all relative overflow-hidden"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    background: canSubmit
                      ? "linear-gradient(135deg, #45A1FD, #82C2FF)"
                      : "#E5E7EB",
                    color: canSubmit ? "white" : "#9CA3AF",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    boxShadow: canSubmit ? "0 4px 20px rgba(69,161,253,0.35)" : "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        {/* Spinner dots */}
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-2 h-2 rounded-full bg-white block"
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <Send size={16} />
                        Panggil GM Sekarang 🎲
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Helper text */}
                {selectedOpts.length === 0 && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF" }}
                     className="text-center mt-2">
                    Pilih minimal satu kebutuhan untuk memanggil GM
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

