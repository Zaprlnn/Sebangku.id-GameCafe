import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera, Edit2, Copy, Check, Share2, ChevronRight, X,
  Bell, MessageCircle, Globe, LogOut, Star, Flame, Award,
  Mail, Phone, Calendar, Users, MapPin, CreditCard,
  RotateCcw, Shield,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Constants & Data ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1603696774332-6dcf0e5aa964?w=400&q=80";

const LEVEL_CONFIG: Record<number, { title: string; emoji: string; cardGrad: string; chipBg: string; chipText: string }> = {
  1: { title: "Newbie Gamer",    emoji: "🌱", cardGrad: "linear-gradient(135deg, #374151, #6B7280, #9CA3AF)", chipBg: "#F3F4F6", chipText: "#6B7280" },
  2: { title: "Casual Gamer",    emoji: "🎮", cardGrad: "linear-gradient(135deg, #065F46, #059669, #34D399)", chipBg: "#ECFDF5", chipText: "#059669" },
  3: { title: "Regular Gamer",   emoji: "🎯", cardGrad: "linear-gradient(135deg, #1E3A8A, #2563EB, #60A5FA)", chipBg: "#EFF6FF", chipText: "#2563EB" },
  4: { title: "Hardcore Gamer",  emoji: "⚔️", cardGrad: "linear-gradient(135deg, #4C1D95, #7C3AED, #C084FC)", chipBg: "#F5F3FF", chipText: "#7C3AED" },
  5: { title: "Pro Gamer",       emoji: "🏆", cardGrad: "linear-gradient(135deg, #92400E, #D97706, #FCD34D)", chipBg: "#FFFBEB", chipText: "#D97706" },
  6: { title: "Legend Gamer",    emoji: "👑", cardGrad: "linear-gradient(135deg, #C43D08, #45A1FD, #82C2FF)", chipBg: "#EBF5FF", chipText: "#45A1FD" },
};

const ALL_GAME_CATS = [
  "Strategy","Co-op","Party","Family","Euro","American",
  "Deck Building","Dice","RPG","Abstract","Trivia","Deduction",
  "Worker Placement","Area Control","Bluffing","Negotiation",
];

const MOCK_VISITS = [
  { id:"v1", date:"30 Apr 2026", day:"Kamis",  dur:"3j 15m", games:["Catan","Codenames"],          total:135_000 },
  { id:"v2", date:"27 Apr 2026", day:"Senin",  dur:"2j 00m", games:["Pandemic"],                   total: 85_000 },
  { id:"v3", date:"24 Apr 2026", day:"Jumat",  dur:"4j 30m", games:["Ticket to Ride","Dixit"],     total:210_000 },
  { id:"v4", date:"20 Apr 2026", day:"Senin",  dur:"1j 45m", games:["Carcassonne"],                total: 65_000 },
  { id:"v5", date:"15 Apr 2026", day:"Rabu",   dur:"2j 30m", games:["Viticulture","Spirit Island"],total:120_000 },
];

function fmt(n: number) { return n.toLocaleString("id"); }

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Mini QR Visual ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// Pre-designed 11×11 QR-like visual (corner markers + data area)
const QR_MATRIX = [
  [1,1,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,1,1,0],[1,0,1,1,1,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1],[1,0,0,0,0,0,1,0,1,1,0],
  [1,1,1,1,1,1,1,0,0,0,1],[0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,1,0,1],[0,1,0,1,0,0,1,0,0,1,0],
  [1,0,0,1,1,0,1,1,0,1,1],
];

function QRVisual({ dotColor = "white", size = 44 }: { dotColor?: string; size?: number }) {
  const cell = size / 11;
  return (
    <div style={{
      display:"grid", gridTemplateColumns:`repeat(11,${cell}px)`,
      width:size, height:size, gap:0, borderRadius:2, overflow:"hidden",
    }}>
      {QR_MATRIX.flat().map((v, i) => (
        <div key={i} style={{ width:cell, height:cell, backgroundColor: v ? dotColor : "transparent" }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Membership Card ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function MembershipCard({ name, level, memberNumber }: { name: string; level: number; memberNumber: string }) {
  const [flipped, setFlipped] = useState(false);
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[4];

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-2.5">
        <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">
          Kartu Member 💳
        </h3>
        <button
          onClick={() => setFlipped(f => !f)}
          className="flex items-center gap-1 cursor-pointer"
          style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", color:"#9CA3AF" }}
        >
          <RotateCcw size={11} /> {flipped ? "Lihat Depan" : "Lihat QR"}
        </button>
      </div>

      <div style={{ perspective:"1200px" }} onClick={() => setFlipped(f => !f)} className="cursor-pointer">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, type:"spring", stiffness:180, damping:28 }}
          style={{ transformStyle:"preserve-3d", position:"relative", width:"100%", aspectRatio:"1.586" }}
        >
          {/* ── Front ── */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ background: cfg.cardGrad, backfaceVisibility:"hidden" }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-15 bg-white" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10 bg-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 bg-white" />

            <div className="relative h-full p-5 flex flex-col justify-between">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"18px", color:"white", letterSpacing:"0.02em" }}>
                    sebangku
                  </p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.65)", letterSpacing:"0.12em" }} className="uppercase mt-0.5">
                    board game cafe
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className="px-2.5 py-1 rounded-xl flex items-center gap-1"
                    style={{ backgroundColor:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)" }}
                  >
                    <span style={{ fontSize:"12px" }}>{cfg.emoji}</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"10px", color:"white" }}>
                      LEVEL {level}
                    </span>
                  </div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.7)" }}>
                    {cfg.title}
                  </span>
                </div>
              </div>

              {/* Middle: chip + contactless */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-7 rounded-md opacity-80" style={{ background:"linear-gradient(135deg,#FCD34D,#F59E0B)" }} />
                <div className="flex flex-col">
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.6)" }} className="uppercase tracking-widest">
                    Member
                  </span>
                  <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"14px", color:"white" }}>
                    {name}
                  </span>
                </div>
              </div>

              {/* Bottom row: number + QR */}
              <div className="flex items-end justify-between">
                <div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.55)", letterSpacing:"0.08em" }} className="uppercase mb-1">
                    Nomor Member
                  </p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"13px", color:"white", letterSpacing:"0.18em" }}>
                    {memberNumber}
                  </p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.5)" }} className="mt-0.5">
                    MEMBER SINCE 2024
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-white/15 p-1.5 rounded-lg">
                    <QRVisual dotColor="white" size={36} />
                  </div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"8px", color:"rgba(255,255,255,0.55)" }}>
                    TAP UNTUK QR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Back ── */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4"
            style={{
              background: cfg.cardGrad,
              backfaceVisibility:"hidden",
              transform:"rotateY(180deg)",
            }}
          >
            <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10 bg-white" />

            <div className="relative flex flex-col items-center gap-3">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <QRVisual dotColor="#1C1410" size={100} />
              </div>
              <div className="text-center">
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px", color:"white" }}>
                  {name}
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"rgba(255,255,255,0.65)" }}>
                  {memberNumber}
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"rgba(255,255,255,0.5)" }} className="mt-1">
                  🔒 Tunjukkan ke kasir untuk scan
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Toggle Switch ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative cursor-pointer shrink-0"
      style={{ width:44, height:26, borderRadius:13, backgroundColor: on ? "#45A1FD" : "#E5E7EB" }}
      animate={{ backgroundColor: on ? "#45A1FD" : "#E5E7EB" }}
      transition={{ duration:0.2 }}
    >
      <motion.div
        className="absolute top-1 bg-white rounded-full shadow-sm"
        style={{ width:18, height:18 }}
        animate={{ left: on ? 22 : 4 }}
        transition={{ type:"spring", stiffness:500, damping:32 }}
      />
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Edit Profile Sheet ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function EditProfileSheet({
  initialName, initialPhone, initialEmail,
  onSave, onClose,
}: {
  initialName: string; initialPhone: string; initialEmail: string;
  onSave: (name: string, phone: string) => void; onClose: () => void;
}) {
  const [name,  setName]  = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor:"rgba(28,20,16,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:340, damping:36 }}
        className="bg-white rounded-t-3xl max-w-lg w-full mx-auto"
      >
        <div className="flex justify-center pt-3"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
          <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">Edit Profil</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {[
            { label:"Nama Lengkap", value:name, onChange:setName, placeholder:"Nama kamu", editable:true },
            { label:"Nomor HP", value:phone, onChange:setPhone, placeholder:"08xx-xxxx-xxxx", editable:true },
            { label:"Email", value:initialEmail, onChange:() => {}, placeholder:"", editable:false },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#9CA3AF", fontWeight:600 }}
                     className="block mb-1.5 uppercase tracking-wide">
                {field.label}
              </label>
              <input
                value={field.value}
                onChange={(e) => field.editable && field.onChange(e.target.value)}
                disabled={!field.editable}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                style={{
                  fontFamily:"'DM Sans',sans-serif",
                  backgroundColor: field.editable ? "#F8FAFC" : "#F3F4F6",
                  border: field.editable ? "1.5px solid #E5E7EB" : "1.5px solid #F3F4F6",
                  color: field.editable ? "#1C1410" : "#9CA3AF",
                }}
              />
              {!field.editable && (
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }} className="mt-1 ml-1">
                  🔒 Email tidak dapat diubah
                </p>
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            onClick={() => { onSave(name, phone); onClose(); }}
            className="w-full py-3.5 rounded-2xl cursor-pointer mt-2 mb-2"
            style={{
              fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"14px",
              background:"linear-gradient(135deg,#45A1FD,#82C2FF)", color:"white",
              boxShadow:"0 4px 16px rgba(69,161,253,0.3)",
            }}
          >
            Simpan Perubahan ✓
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Edit Game Prefs Sheet ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function EditPrefsSheet({
  selected, onSave, onClose
}: { selected: string[]; onSave: (prefs: string[]) => void; onClose: () => void }) {
  const [prefs, setPrefs] = useState<string[]>(selected);
  const toggle = (cat: string) =>
    setPrefs(p => p.includes(cat) ? p.filter(x => x !== cat) : [...p, cat]);

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor:"rgba(28,20,16,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:340, damping:36 }}
        className="bg-white rounded-t-3xl max-w-lg w-full mx-auto"
        style={{ maxHeight:"80vh", display:"flex", flexDirection:"column" }}
      >
        <div className="flex justify-center pt-3"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
          <div>
            <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">Preferensi Game</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF] mt-0.5">
              Pilih kategori yang kamu suka ({prefs.length} dipilih)
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1">
          <div className="flex flex-wrap gap-2">
            {ALL_GAME_CATS.map((cat) => {
              const active = prefs.includes(cat);
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale:0.93 }}
                  onClick={() => toggle(cat)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  style={{
                    fontFamily:"'DM Sans',sans-serif",
                    backgroundColor: active ? "#45A1FD" : "#F3F4F6",
                    color: active ? "white" : "#6B4436",
                    border: active ? "1.5px solid #45A1FD" : "1.5px solid #E5E7EB",
                  }}
                >
                  {active && "✓ "}{cat}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-6 pt-3 border-t border-gray-100">
          <motion.button
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            onClick={() => { onSave(prefs); onClose(); }}
            className="w-full py-3.5 rounded-2xl cursor-pointer"
            style={{
              fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"14px",
              background:"linear-gradient(135deg,#45A1FD,#82C2FF)", color:"white",
            }}
          >
            Simpan Preferensi ({prefs.length} dipilih)
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Logout Confirm ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function LogoutConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor:"rgba(28,20,16,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
        exit={{ scale:0.9, opacity:0 }}
        transition={{ type:"spring", stiffness:340, damping:28 }}
        className="bg-white rounded-3xl p-6 w-full max-w-xs text-center"
      >
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          👋
        </div>
        <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410] mb-1.5">
          Yakin mau keluar?
        </h3>
        <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF] mb-5">
          Kamu akan keluar dari sesi ini. Poin & data tersimpan otomatis.
        </p>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale:0.96 }} onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-gray-200 cursor-pointer"
            style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"13px", color:"#9CA3AF" }}
          >
            Batal
          </motion.button>
          <motion.button
            whileTap={{ scale:0.96 }} onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl cursor-pointer"
            style={{
              fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"13px",
              backgroundColor:"#EF4444", color:"white",
            }}
          >
            Keluar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Referral Card ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function ReferralCard({ code, friendsCount }: { code: string; friendsCount: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = () => {
    const text = `Hai! Coba board game cafe keren di Sebangku! Pakai kode referralku ${code} dan dapat 100 poin gratis saat daftar. Yuk main bareng! 🎲`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="px-4">
      <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410] mb-2.5">
        Program Referral 👥
      </h3>
      <div className="bg-white rounded-2xl p-4 space-y-3" style={{ border:"1.5px solid #F3F4F6" }}>
        {/* Code display */}
        <div className="bg-[#EBF5FF] rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF]">Kode Referralmu</p>
            <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"22px", color:"#45A1FD", letterSpacing:"0.08em" }}>
              {code}
            </p>
          </div>
          <motion.button
            whileTap={{ scale:0.9 }}
            onClick={handleCopy}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{ backgroundColor: copied ? "#ECFDF5" : "white", border: copied ? "1.5px solid #10B981" : "1.5px solid #E5E7EB" }}
          >
            <AnimatePresence mode="wait">
              {copied
                ? <motion.div key="check" initial={{scale:0}} animate={{scale:1}}><Check size={16} className="text-emerald-500" /></motion.div>
                : <motion.div key="copy"  initial={{scale:0}} animate={{scale:1}}><Copy  size={16} className="text-[#9CA3AF]" /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Benefit info */}
        <div className="flex gap-2">
          {[
            { emoji:"🎁", label:"Kamu dapat", val:"+200 poin", col:"#45A1FD", bg:"#EBF5FF" },
            { emoji:"🎉", label:"Temanmu dapat", val:"+100 poin", col:"#059669", bg:"#ECFDF5" },
          ].map((b) => (
            <div key={b.label} className="flex-1 rounded-xl px-3 py-2" style={{ backgroundColor:b.bg }}>
              <p className="text-base mb-0.5">{b.emoji}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }}>{b.label}</p>
              <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"13px", color:b.col }}>{b.val}</p>
            </div>
          ))}
        </div>

        {/* Friends counter */}
        <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
          <div className="w-9 h-9 bg-[#EBF5FF] rounded-xl flex items-center justify-center">
            <Users size={16} className="text-[#45A1FD]" />
          </div>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF]">Teman berhasil diajak</p>
            <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, color:"#1C1410" }}>
              {friendsCount} orang
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", color:"#45A1FD", fontWeight:600 }} className="ml-1.5">
                (+{fmt(friendsCount * 200)} poin total)
              </span>
            </p>
          </div>
        </div>

        {/* Share button */}
        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          onClick={handleShare}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
          style={{
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"13px",
            background:"linear-gradient(135deg,#25D366,#128C7E)", color:"white",
          }}
        >
          <Share2 size={15} /> Bagikan via WhatsApp
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Page ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProfilePage() {
  const { user, isGuest, tableId } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "";

  // ── Mock + context data ──────────────────────────────────────────────────────
  const [profileName,  setProfileName]  = useState(user?.name ?? "Raka Pratama");
  const [profilePhone, setProfilePhone] = useState("0812-3456-7890");
  const profileEmail  = "raka@email.com";
  const profileJoin   = "15 Oktober 2024";
  const memberNumber  = "5821 3904 7162 0483";
  const referralCode  = "RAKA200";
  const friendsCount  = 3;
  const level         = 4;
  const totalPoints   = user?.poin ?? 1_240;
  const streak        = 4;
  const badgesUnlocked = 8;
  const avatarSrc     = user?.avatarSrc ?? DEFAULT_AVATAR;

  const [gamePrefs,   setGamePrefs]   = useState(["Strategy","Co-op","Euro","Deck Building"]);
  const [notifPush,   setNotifPush]   = useState(true);
  const [notifWa,     setNotifWa]     = useState(true);

  // ── Sheet / dialog states ────────────────────────────────────────────────────
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPrefs,   setShowEditPrefs]   = useState(false);
  const [showLogout,      setShowLogout]      = useState(false);
  const [showVisits,      setShowVisits]      = useState(false);
  const [savePop,         setSavePop]         = useState(false);

  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[4];

  const handleSaveProfile = (name: string, phone: string) => {
    setProfileName(name);
    setProfilePhone(phone);
    setSavePop(true);
    setTimeout(() => setSavePop(false), 2500);
  };

  const handleLogout = () => {
    navigate(`/login?table=${tableId}`);
  };

  const qp = (path: string) => `${path}?table=${tableId}${mode ? `&mode=${mode}` : ""}`;

  return (
    <>
      <div className="flex flex-col pb-8">

        {/* ── Profile Header ── */}
        <div className="relative overflow-hidden pb-2" style={{ background:"linear-gradient(180deg,#EBF5FF 0%,#FFFFFF 100%)" }}>
          {/* Decorative blob */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-30" style={{ background:"#FFBEA0", filter:"blur(40px)", transform:"translate(30%,-30%)" }} />

          <div className="flex flex-col items-center pt-6 px-4 relative z-10">
            {/* Avatar */}
            <div className="relative mb-3">
              <motion.div
                whileHover={{ scale:1.04 }}
                className="w-20 h-20 rounded-2xl overflow-hidden"
                style={{ border:"3px solid white", boxShadow:"0 8px 24px rgba(69,161,253,0.25)" }}
              >
                <img src={avatarSrc} alt={profileName} className="w-full h-full object-cover" />
              </motion.div>
              <motion.button
                whileTap={{ scale:0.9 }}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background:"linear-gradient(135deg,#45A1FD,#82C2FF)", boxShadow:"0 2px 8px rgba(69,161,253,0.4)" }}
              >
                <Camera size={12} className="text-white" />
              </motion.button>
            </div>

            {/* Name + username */}
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px" }} className="font-bold text-[#1C1410] mt-1">
              {profileName}
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-xs text-[#9CA3AF] mt-0.5">
              @{profileName.toLowerCase().replace(/\s+/g,".")}
            </p>

            {/* Level badge */}
            <div
              className="mt-2 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
              style={{ backgroundColor:cfg.chipBg, border:`1.5px solid ${cfg.chipText}25` }}
            >
              <span className="text-sm">{cfg.emoji}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px", color:cfg.chipText }}>
                Level {level} — {cfg.title} 🏅
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-0 mt-4 bg-white rounded-2xl overflow-hidden w-full max-w-xs" style={{ boxShadow:"0 4px 16px rgba(0,0,0,0.07)", border:"1.5px solid #F3F4F6" }}>
              {[
                { label:"Total Poin", value:fmt(totalPoints), color:"#45A1FD",  icon:"🪙" },
                { label:"Streak",     value:`${streak} Hari`, color:"#EF4444",  icon:"🔥" },
                { label:"Badge",      value:`${badgesUnlocked} Terbuka`, color:"#F59E0B", icon:"🏅" },
              ].map((s, i) => (
                <div key={s.label} className="flex-1 flex flex-col items-center py-3 relative">
                  {i > 0 && <div className="absolute left-0 top-3 bottom-3 w-px bg-gray-100" />}
                  <span className="text-base mb-0.5">{s.icon}</span>
                  <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"13px", color:s.color }}>
                    {s.value}
                  </span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"#9CA3AF" }} className="mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Membership Card ── */}
        <div className="mt-5">
          <MembershipCard name={profileName} level={level} memberNumber={memberNumber} />
        </div>

        {/* ── Account Info ── */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">
              Info Akun 👤
            </h3>
            <motion.button
              whileTap={{ scale:0.93 }}
              onClick={() => setShowEditProfile(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer"
              style={{ backgroundColor:"#EBF5FF", border:"1px solid #FED7AA" }}
            >
              <Edit2 size={11} className="text-[#45A1FD]" />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:700, color:"#45A1FD" }}>
                Edit
              </span>
            </motion.button>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border:"1.5px solid #F3F4F6" }}>
            {[
              { icon:Mail,     label:"Email",           val: profileEmail,  sub:null },
              { icon:Phone,    label:"Nomor HP",        val: profilePhone,  sub:null },
              { icon:Calendar, label:"Bergabung",       val: profileJoin,   sub:null },
              { icon:MapPin,   label:"Member Terakhir", val: "30 Apr 2026", sub:"Meja 7, 3j 15m" },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] flex items-center justify-center shrink-0">
                  <row.icon size={15} className="text-[#45A1FD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }}>{row.label}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"13px", color:"#1C1410" }} className="truncate">
                    {row.val}
                  </p>
                  {row.sub && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }}>{row.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Referral ── */}
        <div className="mt-5">
          <ReferralCard code={referralCode} friendsCount={friendsCount} />
        </div>

        {/* ── Game Preferences ── */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">
              Preferensi Game 🎲
            </h3>
            <motion.button
              whileTap={{ scale:0.93 }}
              onClick={() => setShowEditPrefs(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer"
              style={{ backgroundColor:"#EBF5FF", border:"1px solid #FED7AA" }}
            >
              <Edit2 size={11} className="text-[#45A1FD]" />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:700, color:"#45A1FD" }}>Edit</span>
            </motion.button>
          </div>
          <div className="bg-white rounded-2xl p-4 flex flex-wrap gap-2" style={{ border:"1.5px solid #F3F4F6" }}>
            {gamePrefs.length > 0
              ? gamePrefs.map((g) => (
                  <div key={g} className="px-3 py-1.5 rounded-xl"
                       style={{ backgroundColor:"#EBF5FF", border:"1px solid #FED7AA" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px", color:"#45A1FD" }}>
                      🎯 {g}
                    </span>
                  </div>
                ))
              : <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#9CA3AF" }}>Belum ada preferensi dipilih</p>
            }
          </div>
        </div>

        {/* ── Visit History ── */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410]">
              Riwayat Kunjungan 📍
            </h3>
            <button
              onClick={() => setShowVisits(v => !v)}
              className="flex items-center gap-1 cursor-pointer"
              style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:700, color:"#45A1FD" }}
            >
              {showVisits ? "Sembunyikan" : "Lihat Semua"}
              <ChevronRight size={12} className="text-[#45A1FD]" />
            </button>
          </div>
          <div className="space-y-2">
            {(showVisits ? MOCK_VISITS : MOCK_VISITS.slice(0, 3)).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i * 0.04 }}
                className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ border:"1.5px solid #F3F4F6" }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-xl shrink-0">
                  🎲
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"12px", color:"#1C1410" }}>
                      {v.day}, {v.date}
                    </p>
                    <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"12px", color:"#45A1FD" }}>
                      Rp {fmt(v.total)}
                    </span>
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }} className="mt-0.5">
                    ⏱ {v.dur} · {v.games.join(", ")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Settings ── */}
        <div className="px-4 mt-5">
          <h3 style={{ fontFamily:"'Fraunces',serif" }} className="font-bold text-[#1C1410] mb-2.5">
            Pengaturan ⚙️
          </h3>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border:"1.5px solid #F3F4F6" }}>
            {/* Notif Push */}
            {[
              { icon:Bell,           label:"Notifikasi Push",     sub:"Promo & update langsung",       toggle:true, on:notifPush, onToggle:() => setNotifPush(p => !p) },
              { icon:MessageCircle,  label:"Notifikasi WhatsApp",  sub:"Info pesanan & poin via WA",    toggle:true, on:notifWa,   onToggle:() => setNotifWa(p => !p) },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <row.icon size={15} className="text-[#6B4436]" />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"13px", color:"#1C1410" }}>{row.label}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }}>{row.sub}</p>
                </div>
                <Toggle on={row.on} onToggle={row.onToggle} />
              </div>
            ))}

            {/* Language */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-t border-gray-50">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Globe size={15} className="text-[#6B4436]" />
              </div>
              <div className="flex-1">
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"13px", color:"#1C1410" }}>Bahasa</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }}>Bahasa Indonesia</p>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#45A1FD" }}>ID</span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>

            {/* Privacy */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-t border-gray-50">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Shield size={15} className="text-[#6B4436]" />
              </div>
              <div className="flex-1">
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"13px", color:"#1C1410" }}>Privasi & Keamanan</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:"#9CA3AF" }}>Kelola data & kata sandi</p>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>

            {/* Logout */}
            <motion.button
              whileTap={{ scale:0.98 }}
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-gray-50 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <LogOut size={15} className="text-red-500" />
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"13px", color:"#EF4444" }}>
                Keluar dari Akun
              </p>
            </motion.button>
          </div>
        </div>

        {/* ── App version footer ── */}
        <div className="px-4 mt-4 pb-2 text-center">
          <p style={{ fontFamily:"'DM Sans',sans-serif" }} className="text-[10px] text-[#9CA3AF]">
            Sebangku Board Game Cafe · v2.4.0 · © 2026
          </p>
        </div>
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>
        {savePop && (
          <motion.div
            key="savepop"
            initial={{ scale:0, y:20, opacity:0 }}
            animate={{ scale:1, y:0, opacity:1 }}
            exit={{ scale:0.8, y:-20, opacity:0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-2.5 rounded-2xl shadow-xl"
            style={{ background:"linear-gradient(135deg,#059669,#10B981)", fontFamily:"'DM Sans',sans-serif", color:"white" }}
          >
            <Check size={15} /> <span className="font-bold text-sm">Perubahan disimpan!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditProfile && (
          <EditProfileSheet
            key="editprofile"
            initialName={profileName}
            initialPhone={profilePhone}
            initialEmail={profileEmail}
            onSave={handleSaveProfile}
            onClose={() => setShowEditProfile(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditPrefs && (
          <EditPrefsSheet
            key="editprefs"
            selected={gamePrefs}
            onSave={setGamePrefs}
            onClose={() => setShowEditPrefs(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogout && (
          <LogoutConfirm
            key="logout"
            onConfirm={handleLogout}
            onCancel={() => setShowLogout(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

