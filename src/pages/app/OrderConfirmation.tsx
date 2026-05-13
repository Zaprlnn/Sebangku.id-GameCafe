import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Home, Clock, Star, ChevronRight, Sparkles } from "lucide-react";

// ─── Animated SVG Checkmark ───────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <div className="relative w-28 h-28 mx-auto">
      {/* Outer glow ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "#22C55E" }}
      />

      {/* Circle background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#22C55E" }}
      >
        {/* SVG check path */}
        <svg
          width="54"
          height="40"
          viewBox="0 0 54 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M3 20 L20 37 L51 3"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.45 }}
          />
        </svg>
      </motion.div>

      {/* Sparkle particles */}
      {[
        { angle: 0,   delay: 0.6, color: "#F59E0B" },
        { angle: 60,  delay: 0.7, color: "#45A1FD" },
        { angle: 120, delay: 0.65, color: "#8B5CF6" },
        { angle: 180, delay: 0.72, color: "#06B6D4" },
        { angle: 240, delay: 0.68, color: "#22C55E" },
        { angle: 300, delay: 0.75, color: "#F59E0B" },
      ].map(({ angle, delay, color }) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 52;
        const y = Math.sin(rad) * 52;
        return (
          <motion.div
            key={angle}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], x, y, scale: [0, 1.2, 0] }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-6px",
              marginLeft: "-6px",
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Countdown badge ──────────────────────────────────────────────────────────
function EstimateTimer() {
  const [seconds, setSeconds] = useState(15 * 60); // 15 min

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <div className="flex items-center gap-2 bg-[#EBF5FF] rounded-xl px-4 py-2.5 justify-center">
      <Clock size={16} className="text-[#45A1FD]" />
      <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436]">
        Estimasi:
      </span>
      <span
        style={{ fontFamily: "'Fraunces', serif" }}
        className="font-bold text-[#45A1FD] text-base"
      >
        {m}:{String(s).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Main Confirmation Page ───────────────────────────────────────────────────
export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";

  const {
    orderNum = `SBK-${Math.floor(1000 + Math.random() * 9000)}`,
    totalPrice = 0,
    estimatedPoints = 0,
    itemCount = 0,
  } = (location.state as {
    orderNum?: string;
    totalPrice?: number;
    estimatedPoints?: number;
    itemCount?: number;
  }) ?? {};

  const [showItems] = useState(true);

  const STEPS = [
    { label: "Pesanan diterima dapur", done: true,  icon: "✅" },
    { label: "Sedang disiapkan",        done: false, icon: "👨‍🍳" },
    { label: "Siap diantar",            done: false, icon: "🍽️" },
    { label: "Tiba di meja",            done: false, icon: "🎉" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F7F7F8]">
      {/* ── Hero section ── */}
      <div
        className="relative overflow-hidden flex flex-col items-center pt-10 pb-8 px-6"
        style={{ background: "linear-gradient(180deg, #ECFDF5 0%, #F7F7F8 100%)" }}
      >
        {/* Confetti dots bg */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: [0, 0.6, 0], y: 200 }}
              transition={{ duration: 2 + i * 0.2, delay: 0.5 + i * 0.1, repeat: Infinity, repeatDelay: 3 }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${8 + i * 8}%`,
                top: "0%",
                backgroundColor: ["#45A1FD", "#22C55E", "#F59E0B", "#8B5CF6", "#06B6D4"][i % 5],
              }}
            />
          ))}
        </div>

        {/* Checkmark */}
        <AnimatedCheck />

        {/* Texts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-5 text-center"
        >
          <h1
            style={{ fontFamily: "'Fraunces', serif", fontSize: "26px" }}
            className="font-bold text-[#1C1410]"
          >
            Pesanan Masuk! 🎉
          </h1>
          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-[#6B4436] mt-1"
          >
            Dapur kami sudah menerima pesananmu
          </p>
        </motion.div>

        {/* Order number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, type: "spring", stiffness: 280 }}
          className="mt-4 bg-white rounded-2xl px-6 py-3 shadow-sm text-center"
        >
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
            Nomor Pesanan
          </p>
          <p
            style={{ fontFamily: "'Fraunces', serif", fontSize: "24px" }}
            className="font-bold text-[#45A1FD] tracking-wide mt-0.5"
          >
            #{orderNum}
          </p>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-4 px-4 pb-8">
        {/* Estimate timer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <EstimateTimer />
        </motion.div>

        {/* Points earned */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-3xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5FF] flex items-center justify-center text-2xl shrink-0">
            ⭐
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>
              Kamu akan dapat +{estimatedPoints} poin!
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF" }}>
              Poin ditambahkan setelah pesanan selesai
            </p>
          </div>
          <div className="text-right">
            <p style={{ fontFamily: "'Fraunces', serif", color: "#45A1FD", fontSize: "18px" }} className="font-bold">
              +{estimatedPoints}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#9CA3AF]">poin</p>
          </div>
        </motion.div>

        {/* Order status steps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-3xl p-4"
        >
          <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] mb-3 text-sm">
            Status Pesanan
          </h3>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ backgroundColor: step.done ? "#ECFDF5" : "#F7F7F8" }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: i === 0 ? 700 : 500,
                      fontSize: "13px",
                      color: i === 0 ? "#22C55E" : "#9CA3AF",
                    }}
                  >
                    {step.label}
                  </p>
                </div>
                {step.done && (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                {i === 1 && (
                  <div className="w-5 h-5 rounded-full bg-[#EBF5FF] flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-2 h-2 rounded-full bg-[#45A1FD]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white rounded-3xl px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#EBF5FF] rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-[#45A1FD]" />
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
                {itemCount} item · Meja {tableId.replace(/^[A-Za-z]+/, "")}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>
                Rp {totalPrice.toLocaleString("id")}
              </p>
            </div>
          </div>
          <Star size={18} className="text-[#F59E0B]" fill="#F59E0B" />
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col gap-3 mt-1"
        >
          <motion.button
            whileHover={{ translateY: -3, boxShadow: "0 10px 28px rgba(69,161,253,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/app/beranda?table=${tableId}`)}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
              color: "white",
              fontWeight: 700,
              fontSize: "15px",
              boxShadow: "0 6px 20px rgba(69,161,253,0.35)",
            }}
          >
            <Home size={18} />
            Kembali ke Beranda
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/app/menu?table=${tableId}`)}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 border-2 border-[#45A1FD]/30 cursor-pointer hover:bg-[#EBF5FF] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#45A1FD", fontWeight: 600, fontSize: "14px" }}
          >
            Pesan Lagi
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

