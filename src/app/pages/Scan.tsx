import { useSearchParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { User, ArrowRight, Wifi, Clock, QrCode } from "lucide-react";

// ─── Dice Logo SVG ────────────────────────────────────────────────────────────
function DiceLogo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="56" height="56" rx="16" fill="#45A1FD" />
      <rect x="4" y="4" width="48" height="48" rx="12" fill="#82C2FF" />
      {/* Dots — face showing 5 */}
      <circle cx="18" cy="18" r="4.5" fill="white" />
      <circle cx="38" cy="18" r="4.5" fill="white" />
      <circle cx="28" cy="28" r="4.5" fill="white" />
      <circle cx="18" cy="38" r="4.5" fill="white" />
      <circle cx="38" cy="38" r="4.5" fill="white" />
      {/* Shine */}
      <ellipse cx="20" cy="12" rx="8" ry="4" fill="white" opacity="0.2" transform="rotate(-20 20 12)" />
    </svg>
  );
}

// ─── Floating decorative dice ─────────────────────────────────────────────────
function FloatingDice({ x, y, size, delay, rotate }: { x: string; y: string; size: number; delay: number; rotate: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none opacity-20"
      style={{ left: x, top: y }}
      animate={{ y: [0, -16, 0], rotate: [rotate, rotate + 15, rotate] }}
      transition={{ repeat: Infinity, duration: 3.5 + delay, ease: "easeInOut", delay }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="white" />
        <circle cx="13" cy="13" r="3.5" fill="#45A1FD" />
        <circle cx="27" cy="13" r="3.5" fill="#45A1FD" />
        <circle cx="20" cy="20" r="3.5" fill="#45A1FD" />
        <circle cx="13" cy="27" r="3.5" fill="#45A1FD" />
        <circle cx="27" cy="27" r="3.5" fill="#45A1FD" />
      </svg>
    </motion.div>
  );
}

// ─── Active Table Badge ───────────────────────────────────────────────────────
function ActiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full">
      {/* Pulse dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="text-sm font-semibold"
      >
        Meja Aktif ✓
      </span>
    </div>
  );
}

// ─── Main Scan Page ───────────────────────────────────────────────────────────
export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "T01";

  // Format table number nicely: T01 → 01, T12 → 12
  const tableNumber = tableId.replace(/^[A-Za-z]+/, "");

  const goToLogin = () => navigate(`/login?table=${tableId}`);
  const goAsGuest = () => navigate(`/app?table=${tableId}&mode=guest`);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-5"
      style={{ background: "linear-gradient(145deg, #45A1FD 0%, #82C2FF 60%, #A8D4FF 100%)" }}
    >
      {/* Floating background dice */}
      <FloatingDice x="5%" y="8%" size={44} delay={0} rotate={-15} />
      <FloatingDice x="78%" y="5%" size={32} delay={0.8} rotate={20} />
      <FloatingDice x="88%" y="40%" size={50} delay={1.5} rotate={-8} />
      <FloatingDice x="2%" y="60%" size={36} delay={0.4} rotate={30} />
      <FloatingDice x="70%" y="78%" size={28} delay={2} rotate={-25} />
      <FloatingDice x="20%" y="85%" size={40} delay={1.1} rotate={10} />

      {/* Soft radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(28, 20, 16, 0.22)" }}
      >
        {/* Top decorative stripe */}
        <div
          className="h-2 w-full"
          style={{ background: "linear-gradient(90deg, #45A1FD, #82C2FF, #45A1FD)" }}
        />

        <div className="px-7 pt-7 pb-8 flex flex-col items-center gap-5">
          {/* Logo + Brand */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            className="flex flex-col items-center gap-3"
          >
            <DiceLogo size={64} />
            <div className="text-center">
              <h1
                style={{ fontFamily: "'Fraunces', serif", fontSize: "32px", lineHeight: 1.1 }}
                className="font-bold text-[#1C1410]"
              >
                Sebangku
              </h1>
              <p
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-[#6B4436] text-sm tracking-widest uppercase mt-0.5"
              >
                Board Game Cafe
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-[#45A1FD]/20 to-transparent"
          />

          {/* Table info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-center space-y-3"
          >
            <div
              className="inline-flex items-center gap-2 bg-[#EBF5FF] px-4 py-2 rounded-2xl"
            >
              <div className="w-8 h-8 bg-[#45A1FD] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {tableNumber}
                </span>
              </div>
              <p
                style={{ fontFamily: "'Fraunces', serif" }}
                className="text-[#1C1410] font-semibold text-lg"
              >
                Selamat datang di Meja {tableNumber}!
              </p>
            </div>

            <ActiveBadge />
          </motion.div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="w-full grid grid-cols-2 gap-2.5"
          >
            {[
              { icon: <Wifi size={14} />, label: "WiFi: Sebangku", sub: "Password: maingame" },
              { icon: <Clock size={14} />, label: "Jam Buka", sub: "10.00 – 23.00" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#EBF5FF] rounded-2xl px-3 py-2.5 flex items-start gap-2"
              >
                <span className="text-[#45A1FD] mt-0.5 shrink-0">{item.icon}</span>
                <div>
                  <p
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-[#1C1410] text-xs font-semibold leading-tight"
                  >
                    {item.label}
                  </p>
                  <p
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-[#6B4436] text-xs leading-tight"
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52 }}
            className="w-full flex flex-col gap-3"
          >
            {/* Primary: Login as Member */}
            <motion.button
              onClick={goToLogin}
              whileHover={{ translateY: -4, boxShadow: "0 10px 28px rgba(69,161,253,0.45)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow: "0 4px 16px rgba(69,161,253,0.3)",
              }}
            >
              <User size={18} />
              Masuk sebagai Member
            </motion.button>

            {/* Secondary: Guest */}
            <motion.button
              onClick={goAsGuest}
              whileHover={{ translateY: -4, boxShadow: "0 8px 20px rgba(69,161,253,0.18)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer bg-white"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                border: "2px solid #45A1FD",
                color: "#45A1FD",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              <ArrowRight size={18} />
              Lanjut sebagai Tamu
            </motion.button>
          </motion.div>

          {/* Benefits strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="w-full bg-[#EBF5FF] rounded-2xl px-4 py-3 flex items-start gap-3"
          >
            <span className="text-lg shrink-0">🎁</span>
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-xs text-[#6B4436] leading-relaxed"
            >
              <span className="text-[#45A1FD] font-semibold">Daftar member</span> dan dapatkan{" "}
              <span className="text-[#45A1FD] font-semibold">100 poin selamat datang</span>,
              akses loyalty, badge koleksi &amp; diskon khusus!
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-1.5 text-[#9CA3AF]"
          >
            <QrCode size={12} />
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs">
              Scan ulang kapan saja untuk akses menu
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

