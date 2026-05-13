import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Star, Flame, Trophy, Clock, ChevronRight, Plus } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Types ────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface Challenge {
  id: string; emoji: string; name: string; desc: string;
  points: number; progress: number; max: number;
  color: string; bg: string; done: boolean;
}

type CheckInState = "idle" | "loading" | "done";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Constants ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// Today = Jumat, 1 Mei 2026 → index 4 in Mon-indexed week
const TODAY_IDX = 4;
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const DAY_DATES = ["27/4", "28/4", "29/4", "30/4", "1/5", "2/5", "3/5"];

const STREAK_MILESTONES = [
  { days: 3,  points: 30,  badge: null,           reached: true  },
  { days: 7,  points: 100, badge: "Week Warrior",  reached: false },
  { days: 14, points: 250, badge: null,            reached: false },
  { days: 30, points: 500, badge: "Month Legend",  reached: false },
];

const INIT_DAILY: Challenge[] = [
  { id:"d1", emoji:"☕", name:"Pesan 1 Minuman",    desc:"Order minuman apa saja dari menu kami hari ini",    points:10, progress:0, max:1, color:"#2563EB", bg:"#EFF6FF", done:false },
  { id:"d2", emoji:"🎮", name:"Main 1 Game",         desc:"Mulai sesi game apapun minimal 30 menit",           points:20, progress:1, max:1, color:"#10B981", bg:"#ECFDF5", done:true  },
  { id:"d3", emoji:"⭐", name:"Rate Pengalaman",     desc:"Beri rating untuk sesi atau menu hari ini",          points:5,  progress:0, max:1, color:"#F59E0B", bg:"#FFFBEB", done:false },
];
const INIT_WEEKLY: Challenge[] = [
  { id:"w1", emoji:"👥", name:"Ajak 1 Teman",        desc:"Bawa teman baru yang belum pernah ke Sebangku",     points:100, progress:0, max:1, color:"#8B5CF6", bg:"#F5F3FF", done:false },
  { id:"w2", emoji:"🎉", name:"Ikut Event",           desc:"Hadiri salah satu event board game minggu ini",     points:50,  progress:0, max:1, color:"#EC4899", bg:"#FDF2F8", done:false },
  { id:"w3", emoji:"🎲", name:"Main 5 Game Berbeda",  desc:"Coba 5 jenis board game dari kategori berbeda",    points:80,  progress:2, max:5, color:"#45A1FD", bg:"#EBF5FF", done:false },
];
const INIT_MONTHLY: Challenge[] = [
  { id:"m1", emoji:"💰", name:"Belanja Rp 300.000",   desc:"Total pembelian mencapai Rp 300.000 bulan ini",    points:200, progress:180, max:300, color:"#059669", bg:"#ECFDF5", done:false },
  { id:"m2", emoji:"📍", name:"Kunjungi 8 Kali",      desc:"Check-in di Sebangku minimal 8 kali bulan ini",    points:150, progress:5,   max:8,   color:"#2563EB", bg:"#EFF6FF", done:false },
  { id:"m3", emoji:"👑", name:"Referral 2 Member",    desc:"Ajak 2 teman baru daftar dan aktif berbelanja",    points:400, progress:1,   max:2,   color:"#DC2626", bg:"#FEF2F2", done:false },
];

// ── Pre-computed confetti (deterministic, no re-render flicker) ───────────────
const CONFETTI_COLORS = ["#45A1FD","#82C2FF","#F59E0B","#FCD34D","#10B981","#3B82F6","#EC4899","#8B5CF6","#EBF5FF"];
const CONFETTI_PARTS  = Array.from({ length: 65 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  size: 5 + (i * 3.9) % 9,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: (i * 0.041) % 0.65,
  dur:   1.5 + (i * 0.053) % 1.1,
  rot:   (i * 71) % 800,
  shape: i % 3,
}));

function fmt(n: number) { return n.toLocaleString("id"); }

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Confetti ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_PARTS.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`, top: -16,
            width:  p.shape === 2 ? p.size * 0.5 : p.size,
            height: p.shape === 2 ? p.size * 1.8  : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 1 ? "50%" : "2px",
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.rot, opacity: [1, 1, 0.5, 0], scaleX: [1, 0.7, 1] }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.15, 0, 0.85, 1] }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Points Pop Notification ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function PointsPop({ points, onDone }: { points: number; onDone: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0,  opacity: 1 }}
      exit={{   scale: 0.8, y: -30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onAnimationComplete={onDone}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-2.5 rounded-2xl shadow-xl"
      style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)", fontFamily: "'Fraunces',serif", color: "white" }}
    >
      <Star size={16} fill="white" stroke="none" />
      <span className="font-bold text-lg">+{points} Poin!</span>
      <span className="text-white/80 text-sm font-normal">ditambahkan 🎉</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Streak Card ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function StreakCard({
  streak, checkedIn, checkInState,
  onCheckIn,
}: {
  streak: number; checkedIn: boolean;
  checkInState: CheckInState; onCheckIn: () => void;
}) {
  const nextMilestone = STREAK_MILESTONES.find((m) => m.days > streak);
  const daysToNext    = nextMilestone ? nextMilestone.days - streak : 0;

  return (
    <div className="px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #45A1FD 0%, #E84E0E 40%, #C43D08 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: "rgba(255,200,150,0.4)" }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15" style={{ background: "rgba(255,200,150,0.3)" }} />

        {/* Fire emoji — animated, top-right corner */}
        <motion.div
          animate={{ rotate: [-5, 5, -3, 4, -5], scale: [1, 1.1, 1.04, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="absolute top-3 right-4 select-none pointer-events-none"
          style={{ fontSize: "52px", lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(255,100,0,0.6))" }}
        >
          🔥
        </motion.div>

        <div className="relative px-5 pt-4 pb-5">
          {/* ── Row 1: Streak counter ── */}
          <div className="pr-16 mb-4">
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-white/75 text-xs mb-0.5">
              Streak Harian
            </p>
            <div className="flex items-end gap-2">
              <motion.span
                key={streak}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                style={{ fontFamily:"'Fraunces',serif", fontSize:"40px", lineHeight:1, color:"white", fontWeight:700 }}
              >
                {streak}
              </motion.span>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:"20px", color:"rgba(255,255,255,0.85)", fontWeight:600 }} className="pb-1">
                Hari Berturut-turut!
              </span>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-white/65 text-[11px] mt-0.5">
              {checkedIn
                ? `✓ Check-in hari ini selesai${nextMilestone ? ` · ${daysToNext} hari lagi bonus +${nextMilestone.points}p` : ""}`
                : nextMilestone
                  ? `${daysToNext} hari lagi ke bonus +${nextMilestone.points} poin 🎯`
                  : "Luar biasa — kamu sudah di puncak!"}
            </p>
          </div>

          {/* ── Row 2: 7 day circles ── */}
          <div className="flex gap-1 justify-between mb-4">
            {DAYS.map((day, i) => {
              const isPast  = i < TODAY_IDX && i < streak;
              const isToday = i === TODAY_IDX;
              const isFuture= i > TODAY_IDX;
              const isDone  = isPast || (isToday && checkedIn);

              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <span style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[9px] text-white/55 font-semibold">
                    {day}
                  </span>
                  <motion.div
                    animate={isToday && !checkedIn
                      ? { boxShadow: ["0 0 0 0px rgba(255,255,255,0.7)", "0 0 0 6px rgba(255,255,255,0)"] }
                      : { boxShadow: "0 0 0 0px rgba(255,255,255,0)" }
                    }
                    transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isDone ? "white" : isFuture ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.2)",
                      border: isDone ? "2px solid white" : isFuture ? "2px solid rgba(255,255,255,0.18)" : "2px solid rgba(255,255,255,0.75)",
                    }}
                  >
                    {isDone
                      ? <Check size={13} style={{ color:"#45A1FD" }} strokeWidth={2.8} />
                      : <span style={{ fontFamily:"'DM Sans',sans-serif" }} className={`text-[9px] font-bold ${isFuture ? "text-white/18" : "text-white/75"}`}>
                          {DAY_DATES[i].split("/")[0]}
                        </span>
                    }
                  </motion.div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[8px] text-white/40">
                    {DAY_DATES[i]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Row 3: Milestone table (full rows) ── */}
          <div className="mb-4">
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">
              Milestone Streak
            </p>
            <div className="space-y-1.5">
              {STREAK_MILESTONES.map((m) => {
                const reached = streak >= m.days;
                const isNext  = m.days === nextMilestone?.days;
                const diff    = m.days - streak;
                return (
                  <div
                    key={m.days}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{
                      backgroundColor: reached
                        ? "rgba(255,255,255,0.25)"
                        : isNext
                          ? "rgba(255,255,255,0.14)"
                          : "rgba(255,255,255,0.06)",
                      border: isNext
                        ? "1px solid rgba(255,255,255,0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {/* Left: icon + day */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {reached ? "✅" : isNext ? "🎯" : "⏳"}
                      </span>
                      <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"13px", color:"white" }}>
                        {m.days} Hari
                      </span>
                    </div>

                    {/* Middle: badge name */}
                    {m.badge && (
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"rgba(255,255,255,0.7)" }} className="hidden xs:block">
                        🏅 {m.badge}
                      </span>
                    )}

                    {/* Right: reward + status */}
                    <div className="flex items-center gap-2">
                      <div
                        className="px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: reached ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)" }}
                      >
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"11px", color:"white" }}>
                          +{m.points}p{m.badge ? " 🏅" : ""}
                        </span>
                      </div>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px" }}
                            className={reached ? "text-white font-bold" : "text-white/50"}>
                        {reached ? "Tercapai ✓" : isNext ? `${diff} hari lagi` : `${diff} hari`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Row 4: CHECK-IN BUTTON (bottom of card) ── */}
          <motion.button
            whileHover={!checkedIn ? { scale: 1.02 } : {}}
            whileTap={!checkedIn ? { scale: 0.95 } : {}}
            onClick={!checkedIn && checkInState === "idle" ? onCheckIn : undefined}
            disabled={checkedIn || checkInState !== "idle"}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{
              fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"15px",
              backgroundColor: checkedIn ? "rgba(255,255,255,0.22)" : "white",
              color: checkedIn ? "rgba(255,255,255,0.85)" : "#45A1FD",
              cursor: checkedIn ? "default" : "pointer",
              boxShadow: checkedIn ? "none" : "0 6px 20px rgba(0,0,0,0.18)",
              border: checkedIn ? "1.5px solid rgba(255,255,255,0.3)" : "none",
            }}
          >
            <AnimatePresence mode="wait">
              {checkInState === "loading" ? (
                <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease:"linear" }}>
                    <Flame size={17} />
                  </motion.div>
                  Mencatat Check-In...
                </motion.div>
              ) : checkedIn ? (
                <motion.div key="done" initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}}
                  transition={{type:"spring", stiffness:400, damping:20}}
                  className="flex items-center gap-2">
                  <Check size={17} strokeWidth={2.5} />
                  Sudah Check-In Hari Ini ✓
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="flex items-center gap-2">
                  <Flame size={17} />
                  Check-In Hari Ini ✓
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Challenge Card ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function ChallengeCard({
  challenge, index, onComplete, canProgress
}: {
  challenge: Challenge; index: number;
  onComplete: () => void; canProgress?: boolean;
}) {
  const pct     = Math.round((challenge.progress / challenge.max) * 100);
  const isDone  = challenge.done || challenge.progress >= challenge.max;

  const progressLabel = challenge.max === 1
    ? (isDone ? "Selesai!" : "Belum selesai")
    : `${challenge.max === 300 ? `Rp ${fmt(challenge.progress * 1_000)}` : challenge.progress} / ${challenge.max === 300 ? `Rp ${fmt(challenge.max * 1_000)}` : challenge.max}`;

  const progressLabelClean = challenge.id.startsWith("m1")
    ? `Rp ${fmt(challenge.progress * 1000)} / Rp ${fmt(challenge.max * 1000)}`
    : `${challenge.progress} / ${challenge.max}`;

  const displayProgress = challenge.id === "m1" ? progressLabelClean : progressLabel;

  return (
    <motion.div
      initial={{ opacity:0, y:14 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.06, ease:"easeOut" }}
      className="bg-white rounded-2xl p-3.5 flex flex-col gap-2.5"
      style={{ border: isDone ? "1.5px solid #A7F3D0" : "1.5px solid #F3F4F6" }}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: isDone ? "#ECFDF5" : challenge.bg }}
        >
          {isDone ? "✅" : challenge.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"13px", color:"#1C1410" }}
               className="leading-tight">
              {challenge.name}
            </p>
            {/* Points badge */}
            <div
              className="shrink-0 px-2 py-0.5 rounded-xl text-xs font-bold flex items-center gap-0.5"
              style={{
                fontFamily:"'DM Sans',sans-serif",
                backgroundColor: isDone ? "#ECFDF5" : "#EBF5FF",
                color: isDone ? "#059669" : "#45A1FD",
              }}
            >
              <Star size={9} fill="currentColor" stroke="none" />
              +{challenge.points}p
            </div>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
            {challenge.desc}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[10px] text-[#9CA3AF]">
            {challenge.id === "m1"
              ? `Rp ${fmt(challenge.progress * 1_000)} / Rp ${fmt(challenge.max * 1_000)}`
              : `${challenge.progress} / ${challenge.max}`
            }
          </span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", color: isDone ? "#059669" : challenge.color }} className="text-[10px] font-bold">
            {pct}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 0.9, delay: index * 0.06 + 0.2, ease:"easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: isDone ? "#10B981" : challenge.color }}
          />
        </div>
      </div>

      {/* Action button or done badge */}
      {isDone ? (
        <motion.div
          initial={{ scale:0.8 }}
          animate={{ scale:1 }}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl"
          style={{ backgroundColor:"#ECFDF5" }}
        >
          <Check size={13} className="text-emerald-500" />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px", color:"#059669" }}>
            Selesai ✓
          </span>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale:1.01 }}
          whileTap={{ scale:0.96 }}
          onClick={onComplete}
          className="w-full py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          style={{
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px",
            background: `linear-gradient(135deg, ${challenge.color}, ${challenge.color}CC)`,
            color:"white",
          }}
        >
          {canProgress && challenge.progress > 0 && challenge.max > 1
            ? <><Plus size={12} /> Tambah Progress</>
            : <><Star size={12} fill="white" stroke="none" /> Selesaikan</>
          }
        </motion.button>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Challenge Section ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function ChallengeSection({
  title, emoji, resetLabel, challenges, totalPoints, earnedPoints,
  onComplete,
}: {
  title: string; emoji: string; resetLabel: string;
  challenges: Challenge[]; totalPoints: number; earnedPoints: number;
  onComplete: (id: string) => void;
}) {
  const doneCount = challenges.filter((c) => c.done || c.progress >= c.max).length;
  const pct       = Math.round((doneCount / challenges.length) * 100);

  return (
    <div className="px-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <div>
            <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410] leading-tight">{title}</h3>
            <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-[#9CA3AF]" />
              <span style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[10px] text-[#9CA3AF]">{resetLabel}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, color:"#45A1FD" }} className="text-sm">
            {doneCount}/{challenges.length}
          </span>
          {doneCount === challenges.length && (
            <span style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[10px] font-bold text-emerald-500">
              Semua Selesai! 🎊
            </span>
          )}
        </div>
      </div>

      {/* Completion bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <motion.div
          initial={{ width:0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration:1, ease:"easeOut" }}
          className="h-full rounded-full"
          style={{ background: pct === 100 ? "#10B981" : "linear-gradient(90deg,#45A1FD,#82C2FF)" }}
        />
      </div>

      {/* Challenges */}
      <div className="flex flex-col gap-2.5">
        {challenges.map((c, i) => (
          <ChallengeCard
            key={c.id}
            challenge={c}
            index={i}
            canProgress={c.max > 1}
            onComplete={() => onComplete(c.id)}
          />
        ))}
      </div>

      {/* Total reward */}
      <div className="flex items-center justify-between mt-3 bg-[#F8FAFC] rounded-xl px-3.5 py-2.5">
        <span style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#6B4436]">
          Total reward {title.toLowerCase()}
        </span>
        <div className="flex items-center gap-1.5">
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px", color: earnedPoints > 0 ? "#059669" : "#9CA3AF" }}>
            {earnedPoints > 0 ? `+${fmt(earnedPoints)} / ` : ""}
          </span>
          <div className="px-2.5 py-1 rounded-lg flex items-center gap-1"
               style={{ background:"linear-gradient(135deg,#45A1FD,#82C2FF)" }}>
            <Star size={10} fill="white" stroke="none" />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"11px", color:"white" }}>
              +{fmt(totalPoints)}p
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Page ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function ChallengesPage() {
  const [streak,        setStreak]        = useState(4);
  const [checkedIn,     setCheckedIn]     = useState(false);
  const [checkInState,  setCheckInState]  = useState<CheckInState>("idle");
  const [showConfetti,  setShowConfetti]  = useState(false);
  const [popPoints,     setPopPoints]     = useState<number | null>(null);
  const [showPop,       setShowPop]       = useState(false);
  const [totalPts,      setTotalPts]      = useState(1_240);
  const [daily,         setDaily]         = useState<Challenge[]>(INIT_DAILY);
  const [weekly,        setWeekly]        = useState<Challenge[]>(INIT_WEEKLY);
  const [monthly,       setMonthly]       = useState<Challenge[]>(INIT_MONTHLY);

  // ── Check-in ────────────────────────────────────────────────────────────────
  const handleCheckIn = useCallback(async () => {
    if (checkedIn || checkInState !== "idle") return;
    setCheckInState("loading");
    await new Promise((r) => setTimeout(r, 900));
    const newStreak = streak + 1;
    const milestone = STREAK_MILESTONES.find((m) => m.days === newStreak);
    const earned    = 10 + (milestone?.points ?? 0);
    setStreak(newStreak);
    setCheckedIn(true);
    setCheckInState("done");
    setTotalPts((p) => p + earned);
    setPopPoints(earned);
    setShowPop(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3400);
  }, [checkedIn, checkInState, streak]);

  // ── Complete challenge ───────────────────────────────────────────────────────
  const completeChallenge = useCallback((
    setter: React.Dispatch<React.SetStateAction<Challenge[]>>,
    id: string
  ) => {
    setter((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      if (c.done || c.progress >= c.max) return c;
      const newProgress = c.max > 1 ? Math.min(c.progress + 1, c.max) : c.max;
      const isDone      = newProgress >= c.max;
      if (isDone) {
        setTotalPts((p) => p + c.points);
        setPopPoints(c.points);
        setShowPop(true);
      }
      return { ...c, progress: newProgress, done: isDone };
    }));
  }, []);

  // ── Earned points per section ────────────────────────────────────────────────
  const earnedDaily   = daily.filter((c) => c.done || c.progress >= c.max).reduce((a, c) => a + c.points, 0);
  const earnedWeekly  = weekly.filter((c) => c.done || c.progress >= c.max).reduce((a, c) => a + c.points, 0);
  const earnedMonthly = monthly.filter((c) => c.done || c.progress >= c.max).reduce((a, c) => a + c.points, 0);

  return (
    <>
      <div className="flex flex-col gap-5 pb-8">
        {/* ── Global header ── */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">
              Tantangan 🏆
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF]">
              Selesaikan & kumpulkan poin ekstra
            </p>
          </div>
          <motion.div
            key={totalPts}
            initial={{ scale:0.8, opacity:0 }}
            animate={{ scale:1,   opacity:1 }}
            className="flex items-center gap-1.5 bg-[#EBF5FF] rounded-xl px-3 py-1.5"
          >
            <span className="text-base">🪙</span>
            <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, color:"#45A1FD" }} className="text-sm">
              {fmt(totalPts)}
            </span>
          </motion.div>
        </div>

        {/* ── Streak card ── */}
        <StreakCard
          streak={streak}
          checkedIn={checkedIn}
          checkInState={checkInState}
          onCheckIn={handleCheckIn}
        />

        {/* ── Summary chips ── */}
        <div className="flex gap-2.5 px-4">
          {[
            { label:"Harian",  count: daily.filter((c)=>c.done||c.progress>=c.max).length,  total: daily.length,   color:"#3B82F6" },
            { label:"Mingguan",count: weekly.filter((c)=>c.done||c.progress>=c.max).length, total: weekly.length,  color:"#8B5CF6" },
            { label:"Bulanan", count: monthly.filter((c)=>c.done||c.progress>=c.max).length,total: monthly.length, color:"#45A1FD" },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-white rounded-2xl px-3 py-2.5 text-center shadow-sm">
              <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"18px", color:s.color }}>
                {s.count}/{s.total}
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[10px] text-[#9CA3AF]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Daily ── */}
        <ChallengeSection
          title="Tantangan Harian"
          emoji="🌞"
          resetLabel="Reset tengah malam ini"
          challenges={daily}
          totalPoints={daily.reduce((a, c) => a + c.points, 0)}
          earnedPoints={earnedDaily}
          onComplete={(id) => completeChallenge(setDaily, id)}
        />

        {/* ── Weekly ── */}
        <ChallengeSection
          title="Tantangan Mingguan"
          emoji="📅"
          resetLabel="Reset Senin, 4 Mei 2026"
          challenges={weekly}
          totalPoints={weekly.reduce((a, c) => a + c.points, 0)}
          earnedPoints={earnedWeekly}
          onComplete={(id) => completeChallenge(setWeekly, id)}
        />

        {/* ── Monthly ── */}
        <ChallengeSection
          title="Tantangan Bulanan"
          emoji="📆"
          resetLabel="Reset 1 Juni 2026"
          challenges={monthly}
          totalPoints={monthly.reduce((a, c) => a + c.points, 0)}
          earnedPoints={earnedMonthly}
          onComplete={(id) => completeChallenge(setMonthly, id)}
        />

        {/* ── Motivational footer ── */}
        <div className="px-4">
          <div className="bg-[#EBF5FF] rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <Trophy size={24} className="text-[#45A1FD] shrink-0" />
            <div>
              <p style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410] text-sm">
                Selesaikan semua tantangan!
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#6B4436]">
                Kumpulkan hingga <span className="font-bold text-[#45A1FD]">+{fmt(daily.reduce((a,c)=>a+c.points,0)+weekly.reduce((a,c)=>a+c.points,0)+monthly.reduce((a,c)=>a+c.points,0))} poin</span> ekstra bulan ini 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confetti overlay ── */}
      <AnimatePresence>
        {showConfetti && <Confetti key="confetti" />}
      </AnimatePresence>

      {/* ── Points pop notification ── */}
      <AnimatePresence>
        {showPop && popPoints !== null && (
          <PointsPop
            key={`pop-${popPoints}-${Date.now()}`}
            points={popPoints}
            onDone={() => {
              // short delay so user sees the animation
              setTimeout(() => { setShowPop(false); setPopPoints(null); }, 1800);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
