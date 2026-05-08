import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp, Users, ShoppingCart, Star, Bell,
  Menu as MenuIcon, RefreshCw, X, Gamepad2,
  ChevronRight, ArrowUpRight, Wrench,
  UserCheck, Calendar,
  CheckCircle2, AlertCircle, Timer,
} from "lucide-react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

// ─────────────────────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { day: "Sen", date: "26 Apr", revenue: 1_850_000, orders: 42 },
  { day: "Sel", date: "27 Apr", revenue: 2_200_000, orders: 51 },
  { day: "Rab", date: "28 Apr", revenue: 1_950_000, orders: 47 },
  { day: "Kam", date: "29 Apr", revenue: 2_650_000, orders: 58 },
  { day: "Jum", date: "30 Apr", revenue: 3_100_000, orders: 68 },
  { day: "Sab", date: "1 Mei",  revenue: 3_450_000, orders: 75 },
  { day: "Min", date: "2 Mei",  revenue: 2_847_000, orders: 61 },
];

type TableStatus = "empty" | "occupied" | "full" | "reserved" | "maintenance";

interface TableData {
  id: string;
  num: number;
  capacity: number;
  zone: string;
  status: TableStatus;
  member: string | null;
  game: string | null;
  since: string | null;
  orders: number;
  totalSpent: number;
  notes?: string;
}

const TABLES_DATA: TableData[] = [
  { id: "T-01", num: 1,  capacity: 2, zone: "Depan",    status: "occupied",    member: "Andi S.",      game: "Catan",          since: "11:30", orders: 2, totalSpent: 78_000 },
  { id: "T-02", num: 2,  capacity: 2, zone: "Depan",    status: "empty",       member: null,           game: null,             since: null,    orders: 0, totalSpent: 0 },
  { id: "T-03", num: 3,  capacity: 4, zone: "Depan",    status: "occupied",    member: "Budi K. +3",   game: "Uno",            since: "12:15", orders: 4, totalSpent: 156_000 },
  { id: "T-04", num: 4,  capacity: 4, zone: "Depan",    status: "reserved",    member: "Citra M.",     game: null,             since: "15:00", orders: 0, totalSpent: 0 },
  { id: "T-05", num: 5,  capacity: 4, zone: "Tengah",   status: "occupied",    member: "Dian P. +2",   game: "Jenga",          since: "13:00", orders: 3, totalSpent: 87_000 },
  { id: "T-06", num: 6,  capacity: 4, zone: "Tengah",   status: "occupied",    member: "Eko F. +3",    game: "Codenames",      since: "12:45", orders: 5, totalSpent: 215_000 },
  { id: "T-07", num: 7,  capacity: 4, zone: "Tengah",   status: "full",        member: "Fira A. +3",   game: "Ticket to Ride", since: "11:00", orders: 6, totalSpent: 312_000 },
  { id: "T-08", num: 8,  capacity: 4, zone: "Tengah",   status: "empty",       member: null,           game: null,             since: null,    orders: 0, totalSpent: 0 },
  { id: "T-09", num: 9,  capacity: 6, zone: "Belakang", status: "full",        member: "Gita H. +5",   game: "Pandemic",       since: "10:30", orders: 8, totalSpent: 478_000 },
  { id: "T-10", num: 10, capacity: 6, zone: "Belakang", status: "occupied",    member: "Hadi L. +3",   game: "Dixit",          since: "13:30", orders: 3, totalSpent: 134_000 },
  { id: "T-11", num: 11, capacity: 6, zone: "Belakang", status: "empty",       member: null,           game: null,             since: null,    orders: 0, totalSpent: 0 },
  { id: "T-12", num: 12, capacity: 6, zone: "Belakang", status: "maintenance", member: null,           game: null,             since: null,    orders: 0, totalSpent: 0, notes: "Kursi rusak — dijadwalkan perbaikan Senin" },
  { id: "T-13", num: 13, capacity: 8, zone: "Private",  status: "occupied",    member: "Ivan B. +6",   game: "Sushi Go Party", since: "13:15", orders: 7, totalSpent: 567_000 },
  { id: "T-14", num: 14, capacity: 8, zone: "Private",  status: "reserved",    member: "Julia C. +7",  game: null,             since: "16:00", orders: 0, totalSpent: 0 },
];

const RECENT_ORDERS = [
  { id: "ORD-2041", table: "T-07", items: "Kopi Susu Aren ×2, Kentang Goreng ×1", total: 81_000,  status: "Siap",     statusColor: "#059669", statusBg: "#ECFDF5", time: "14:32" },
  { id: "ORD-2040", table: "T-03", items: "Es Teh Manis ×2, Indomie Goreng ×2",   total: 53_000,  status: "Diproses", statusColor: "#D97706", statusBg: "#FFFBEB", time: "14:28" },
  { id: "ORD-2039", table: "T-09", items: "Americano ×3, Pisang Goreng ×2",        total: 98_000,  status: "Diantar",  statusColor: "#0284C7", statusBg: "#EFF6FF", time: "14:25" },
  { id: "ORD-2038", table: "T-13", items: "Matcha Latte ×4, Croissant ×2",         total: 178_000, status: "Selesai",  statusColor: "#6B7280", statusBg: "#F3F4F6", time: "14:18" },
  { id: "ORD-2037", table: "T-01", items: "Kopi Hitam ×1, Waffle ×1",              total: 52_000,  status: "Selesai",  statusColor: "#6B7280", statusBg: "#F3F4F6", time: "14:11" },
];

const NOTIFICATIONS = [
  { id: 1, icon: AlertCircle, color: "#D97706", bg: "#FFFBEB", text: "Pesanan ORD-2040 menunggu konfirmasi", time: "2 menit lalu" },
  { id: 2, icon: UserCheck,   color: "#059669", bg: "#ECFDF5", text: "Member baru: Kartika S. bergabung",    time: "15 menit lalu" },
  { id: 3, icon: Wrench,      color: "#DC2626", bg: "#FEF2F2", text: "T-12 dalam status maintenance",        time: "1 jam lalu" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getSessionDuration(since: string): string {
  try {
    const [h, m] = since.split(":").map(Number);
    const now = new Date();
    const diff = now.getHours() * 60 + now.getMinutes() - (h * 60 + m);
    if (diff <= 0) return "-";
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return hrs > 0 ? `${hrs}j ${mins}m` : `${mins}m`;
  } catch {
    return "-";
  }
}

const STATUS_CONFIG: Record<TableStatus, { bg: string; text: string; border: string; dot: string; label: string; dotPulse?: boolean }> = {
  empty:       { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0", dot: "#22C55E", label: "Kosong",      dotPulse: false },
  occupied:    { bg: "#EBF5FF", text: "#9A3412", border: "#FED7AA", dot: "#45A1FD", label: "Terisi",      dotPulse: false },
  full:        { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA", dot: "#EF4444", label: "Penuh",       dotPulse: true  },
  reserved:    { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE", dot: "#3B82F6", label: "Reservasi",   dotPulse: false },
  maintenance: { bg: "#F9FAFB", text: "#374151", border: "#E5E7EB", dot: "#9CA3AF", label: "Maintenance", dotPulse: false },
};

// ─────────────────────────────────────────────────────────────────────────────
//  KPI CARD
// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, color, bg, border, label, value, sub, subColor, delay }: {
  icon: React.ElementType; color: string; bg: string; border: string;
  label: string; value: string; sub: string; subColor?: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: "easeOut" }}
      whileHover={{ translateY: -4 }}
      className="bg-white rounded-2xl p-4 cursor-default"
      style={{ border: `1.5px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={13} style={{ color: "#D1D5DB", marginTop: 4 }} />
      </div>
      <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "22px", color: "#1C1410", lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>{label}</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, color: subColor ?? "#059669", marginTop: "5px" }}>{sub}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CUSTOM SVG AREA CHART  (no recharts — avoids the null-key bug)
// ─────────────────────────────────────────────────────────────────────────────

function RevenueChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const VW = 560, VH = 180;
  const pad = { top: 14, right: 12, bottom: 32, left: 52 };
  const plotW = VW - pad.left - pad.right;
  const plotH = VH - pad.top - pad.bottom;

  const maxRev = Math.ceil(Math.max(...REVENUE_DATA.map(d => d.revenue)) / 500_000) * 500_000;

  const xPos = (i: number) => pad.left + (i / (REVENUE_DATA.length - 1)) * plotW;
  const yPos = (v: number) => pad.top + plotH * (1 - v / maxRev);

  const pts = REVENUE_DATA.map((d, i) => ({ x: xPos(i), y: yPos(d.revenue) }));

  const buildCurve = (close: boolean) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx1 = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.4;
      const cpx2 = pts[i].x     - (pts[i].x - pts[i - 1].x) * 0.4;
      d += ` C ${cpx1} ${pts[i - 1].y} ${cpx2} ${pts[i].y} ${pts[i].x} ${pts[i].y}`;
    }
    if (close) d += ` L ${pts[pts.length - 1].x} ${pad.top + plotH} L ${pts[0].x} ${pad.top + plotH} Z`;
    return d;
  };

  const yTicks = [0, 1, 2, 3].map(i => ({ val: maxRev * i / 3, y: yPos(maxRev * i / 3) }));

  // Tooltip box
  const renderTooltip = () => {
    if (activeIdx === null) return null;
    const d = REVENUE_DATA[activeIdx];
    const tx = Math.max(74, Math.min(xPos(activeIdx), VW - 74));
    const ty = Math.max(68, pts[activeIdx].y - 8);
    const bw = 148, bh = 62;
    return (
      <g>
        <rect x={tx - bw / 2} y={ty - bh} width={bw} height={bh} rx={10}
              fill="white" stroke="#FED7AA" strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.09))" }} />
        <text x={tx} y={ty - bh + 17} textAnchor="middle"
              fill="#1C1410" fontSize={11} fontWeight={700} fontFamily="'Fraunces',serif">
          {d.day} · {d.date}
        </text>
        <text x={tx} y={ty - bh + 35} textAnchor="middle"
              fill="#45A1FD" fontSize={13} fontWeight={700} fontFamily="'DM Sans',sans-serif">
          Rp {d.revenue.toLocaleString("id")}
        </text>
        <text x={tx} y={ty - bh + 51} textAnchor="middle"
              fill="#9CA3AF" fontSize={10} fontFamily="'DM Sans',sans-serif">
          {d.orders} pesanan selesai
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
    >
      {/* Y grid + labels */}
      {yTicks.map((t, i) => (
        <g key={`y${i}`}>
          {i > 0 && <line x1={pad.left} y1={t.y} x2={VW - pad.right} y2={t.y} stroke="#F3F4F6" strokeWidth={1} />}
          <text x={pad.left - 6} y={t.y + 4} textAnchor="end" fill="#9CA3AF"
                fontSize={10} fontFamily="'DM Sans',sans-serif">
            {(t.val / 1_000_000).toFixed(1)}jt
          </text>
        </g>
      ))}

      {/* X labels */}
      {REVENUE_DATA.map((d, i) => (
        <text key={`x${i}`} x={xPos(i)} y={VH - 4} textAnchor="middle"
              fill={activeIdx === i ? "#45A1FD" : "#9CA3AF"}
              fontSize={11}
              fontWeight={activeIdx === i ? 700 : 400}
              fontFamily="'DM Sans',sans-serif">
          {d.day}
        </text>
      ))}

      {/* Area fill */}
      <path d={buildCurve(true)} fill="rgba(69,161,253,0.1)" />

      {/* Line */}
      <path d={buildCurve(false)} fill="none" stroke="#45A1FD" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" />

      {/* Vertical indicator */}
      {activeIdx !== null && (
        <line x1={xPos(activeIdx)} y1={pad.top} x2={xPos(activeIdx)} y2={pad.top + plotH}
              stroke="#45A1FD" strokeWidth={1} strokeDasharray="3 2" opacity={0.4} />
      )}

      {/* Data points */}
      {pts.map((p, i) => (
        <circle key={`pt${i}`} cx={p.x} cy={p.y} r={activeIdx === i ? 6 : 4}
                fill="#45A1FD" stroke="white" strokeWidth={2} />
      ))}

      {/* Hover zones (invisible) */}
      {REVENUE_DATA.map((_, i) => {
        const step = plotW / (REVENUE_DATA.length - 1);
        const hw = step / 2;
        const rx = i === 0 ? xPos(i) - hw * 0.6 : xPos(i) - hw;
        const rw = i === 0 || i === REVENUE_DATA.length - 1 ? hw * 1.2 : hw * 2;
        return (
          <rect key={`hz${i}`} x={rx} y={pad.top} width={rw} height={plotH}
                fill="transparent" style={{ cursor: "crosshair" }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)} />
        );
      })}

      {/* Tooltip */}
      {renderTooltip()}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  TABLE CARD
// ─────────────────────────────────────────────────────────────────────────────

function TableCard({ table, onClick }: { table: TableData; onClick: (t: TableData) => void }) {
  const cfg = STATUS_CONFIG[table.status];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative rounded-2xl p-3 cursor-pointer select-none"
      style={{
        backgroundColor: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        transition: "box-shadow 0.2s",
        boxShadow: hovered ? `0 4px 16px ${cfg.dot}30` : "0 1px 4px rgba(0,0,0,0.05)",
      }}
      whileHover={{ translateY: -3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(table)}
    >
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
          {table.id}
        </span>
        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotPulse ? "animate-pulse" : ""}`}
              style={{ backgroundColor: cfg.dot }} />
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>{table.capacity} pax</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: cfg.text, marginTop: 2 }}>{cfg.label}</p>
      {table.game && (
        <p className="truncate mt-1" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#6B7280" }}>
          🎲 {table.game}
        </p>
      )}
      {table.status === "reserved" && table.since && (
        <p className="mt-1" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#3B82F6" }}>📅 {table.since}</p>
      )}
      {table.status === "maintenance" && <Wrench size={12} className="mt-1" style={{ color: "#9CA3AF" }} />}

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (table.member || table.since) && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 mb-2 pointer-events-none"
            style={{ transform: "translateX(-50%)", width: 170 }}
          >
            <div className="bg-[#1C1410] rounded-xl px-3 py-2.5 shadow-xl"
                 style={{ border: "1px solid rgba(69,161,253,0.3)" }}>
              {table.member && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "white" }}>
                  👤 {table.member}
                </p>
              )}
              {table.since && (table.status === "occupied" || table.status === "full") && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#82C2FF", marginTop: 2 }}>
                  ⏱ Sesi {getSessionDuration(table.since)}
                </p>
              )}
              {table.game && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                  🎲 {table.game}
                </p>
              )}
              {table.orders > 0 && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                  🛒 {table.orders} pesanan
                </p>
              )}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                   style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1C1410" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  TABLE SIDE PANEL
// ─────────────────────────────────────────────────────────────────────────────

function TableSidePanel({ table, onClose }: { table: TableData; onClose: () => void }) {
  const cfg = STATUS_CONFIG[table.status];
  const duration = table.since ? getSessionDuration(table.since) : null;
  const tableOrders = RECENT_ORDERS.filter(o => o.table === table.id).slice(0, 3);

  return (
    <>
      <motion.div key="panel-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <motion.div key="panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 36 }}
                  className="fixed right-0 top-0 h-full bg-white z-50 flex flex-col overflow-hidden"
                  style={{ width: "min(380px, 100vw)", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 shrink-0" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "16px", color: "#1C1410" }}>{table.id}</span>
          </div>
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "18px", color: "#1C1410" }}>Meja {table.num}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
                {cfg.label}
              </span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>
                {table.zone} · {table.capacity} pax
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Active session */}
          {(table.status === "occupied" || table.status === "full") && table.member && (
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "#9CA3AF",
                          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Sesi Aktif</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center"
                     style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#45A1FD" }}>
                  {table.member.charAt(0)}
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>{table.member}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>Member · check-in {table.since}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Durasi",  value: duration ?? "-",                             icon: Timer,       color: "#45A1FD", bg: "#EBF5FF" },
                  { label: "Pesanan", value: `${table.orders}×`,                          icon: ShoppingCart,color: "#0284C7", bg: "#EFF6FF" },
                  { label: "Total",   value: `Rp ${(table.totalSpent / 1000).toFixed(0)}k`,icon: TrendingUp, color: "#059669", bg: "#ECFDF5" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: s.bg }}>
                    <s.icon size={14} style={{ color: s.color, margin: "0 auto 4px" }} />
                    <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>{s.value}</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#9CA3AF" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              {table.game && (
                <div className="mt-3 flex items-center gap-2.5 bg-[#F9FAFB] rounded-xl px-3.5 py-3"
                     style={{ border: "1px solid #F3F4F6" }}>
                  <Gamepad2 size={16} className="text-[#6B4436]" />
                  <div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>Sedang dimainkan</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>{table.game}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reserved */}
          {table.status === "reserved" && (
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "#9CA3AF",
                          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Reservasi</p>
              <div className="bg-[#EFF6FF] rounded-2xl p-4" style={{ border: "1px solid #BFDBFE" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={15} className="text-blue-500" />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#1E40AF" }}>{table.member}</p>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#3B82F6" }}>Jadwal check-in: pukul {table.since} WIB</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#93C5FD", marginTop: 2 }}>{table.capacity} kursi disiapkan</p>
              </div>
            </div>
          )}

          {/* Maintenance */}
          {table.status === "maintenance" && (
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "#9CA3AF",
                          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Status Maintenance</p>
              <div className="bg-[#F9FAFB] rounded-2xl p-4" style={{ border: "1px solid #E5E7EB" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={15} className="text-gray-500" />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#374151" }}>Sedang Diperbaiki</p>
                </div>
                {table.notes && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#6B7280" }}>{table.notes}</p>}
              </div>
            </div>
          )}

          {/* Orders for this table */}
          {tableOrders.length > 0 && (
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "#9CA3AF",
                          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Pesanan Hari Ini</p>
              <div className="flex flex-col gap-2">
                {tableOrders.map(o => (
                  <div key={o.id} className="flex items-start gap-3 bg-[#F9FAFB] rounded-xl px-3 py-2.5" style={{ border: "1px solid #F3F4F6" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#1C1410" }}>{o.id}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: o.statusBg, color: o.statusColor }}>{o.status}</span>
                      </div>
                      <p className="truncate mt-0.5" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#6B4436" }}>{o.items}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#1C1410" }}>Rp {o.total.toLocaleString("id")}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>{o.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-5 py-4">
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "#9CA3AF",
                        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Aksi</p>
            <div className="flex flex-col gap-2">
              {(table.status === "occupied" || table.status === "full") && (
                <>
                  <button className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full"
                          style={{ backgroundColor: "#EBF5FF", border: "1.5px solid #FED7AA" }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FFE5D0")}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#EBF5FF")}>
                    <ShoppingCart size={15} style={{ color: "#45A1FD" }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#9A3412" }}>Tambah Pesanan</span>
                  </button>
                  <button className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full"
                          style={{ backgroundColor: "#FEF2F2", border: "1.5px solid #FECACA" }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FEF2F2")}>
                    <CheckCircle2 size={15} style={{ color: "#EF4444" }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#991B1B" }}>Akhiri Sesi</span>
                  </button>
                </>
              )}
              {table.status === "empty" && (
                <button className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full"
                        style={{ backgroundColor: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#DCFCE7")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F0FDF4")}>
                  <UserCheck size={15} style={{ color: "#059669" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#166534" }}>Buka Sesi Baru</span>
                </button>
              )}
              {table.status !== "maintenance" && (
                <button className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full"
                        style={{ backgroundColor: "#F9FAFB", border: "1.5px solid #E5E7EB" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F9FAFB")}>
                  <Wrench size={15} style={{ color: "#6B7280" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#374151" }}>Tandai Maintenance</span>
                </button>
              )}
              {table.status === "maintenance" && (
                <button className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full"
                        style={{ backgroundColor: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#DCFCE7")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F0FDF4")}>
                  <CheckCircle2 size={15} style={{ color: "#059669" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#166534" }}>Tandai Selesai</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLOOR PLAN
// ─────────────────────────────────────────────────────────────────────────────

const ZONES = [
  { label: "Zona Depan",    emoji: "🚪", tables: ["T-01","T-02","T-03","T-04"], cols: "grid-cols-4" },
  { label: "Zona Tengah",   emoji: "☕", tables: ["T-05","T-06","T-07","T-08"], cols: "grid-cols-4" },
  { label: "Zona Belakang", emoji: "🎮", tables: ["T-09","T-10","T-11","T-12"], cols: "grid-cols-4" },
  { label: "Zona Private",  emoji: "🔒", tables: ["T-13","T-14"],               cols: "grid-cols-2" },
];

function FloorPlan({ onSelect }: { onSelect: (t: TableData) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F7F7F8" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] flex items-center justify-center"><span style={{ fontSize: 14 }}>🪑</span></div>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>Denah Meja Cafe</h3>
        </div>
        <div className="hidden sm:flex items-center gap-3 flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.dot }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 px-5 py-3 overflow-x-auto"
           style={{ borderBottom: "1px solid #F7F7F8", backgroundColor: "#FAFAFA" }}>
        {[
          { label: "Kosong",      count: TABLES_DATA.filter(t => t.status === "empty").length,       color: "#22C55E" },
          { label: "Terisi",      count: TABLES_DATA.filter(t => t.status === "occupied").length,    color: "#45A1FD" },
          { label: "Penuh",       count: TABLES_DATA.filter(t => t.status === "full").length,        color: "#EF4444" },
          { label: "Reservasi",   count: TABLES_DATA.filter(t => t.status === "reserved").length,    color: "#3B82F6" },
          { label: "Maintenance", count: TABLES_DATA.filter(t => t.status === "maintenance").length, color: "#9CA3AF" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 shrink-0">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: s.color, fontFamily: "'DM Sans',sans-serif" }}>{s.count}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#6B7280" }}>{s.label}</span>
          </div>
        ))}
        <div className="ml-auto shrink-0">
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>Klik meja untuk detail sesi</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {ZONES.map(zone => {
          const tables = zone.tables.map(id => TABLES_DATA.find(t => t.id === id)!).filter(Boolean);
          return (
            <div key={zone.label}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 13 }}>{zone.emoji}</span>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px",
                            color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{zone.label}</p>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className={`grid ${zone.cols} gap-3`}>
                {tables.map((table, i) => (
                  <motion.div key={table.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.04 }}>
                    <TableCard table={table} onClick={onSelect} />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu]       = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [refreshing, setRefreshing]       = useState(false);
  const [, setTick]                       = useState(0);

  useEffect(() => {
    if (!sessionStorage.getItem("sbk_admin_session")) navigate("/admin", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
  }, []);

  const now          = new Date();
  const timeStr      = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr      = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const activeTables   = TABLES_DATA.filter(t => t.status === "occupied" || t.status === "full").length;
  const activeVisitors = TABLES_DATA.filter(t => t.status === "occupied" || t.status === "full")
    .reduce((acc, t) => acc + (t.member ? (parseInt(t.member.match(/\+(\d)/)?.[1] ?? "0") + 1) : 1), 0);
  const session = JSON.parse(sessionStorage.getItem("sbk_admin_session") || "{}");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F7F8", fontFamily: "'DM Sans', sans-serif" }}>
      <AdminSidebar mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} />

      <div className="lg:pl-[240px] min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-5 lg:px-6 h-16 shrink-0"
             style={{ borderBottom: "1px solid #F3F4F6", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(true)}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 cursor-pointer">
              <MenuIcon size={17} className="text-[#6B4436]" />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "17px", color: "#1C1410" }}>Dashboard</h1>
              <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{dateStr} · {timeStr} WIB</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#059669" }}>Live</span>
            </div>

            <motion.button onClick={handleRefresh}
                           animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                           transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                           className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#EBF5FF] cursor-pointer transition-colors">
              <RefreshCw size={15} className="text-[#6B4436]" />
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(p => !p)}
                      className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#EBF5FF] cursor-pointer transition-colors">
                <Bell size={16} className="text-[#6B4436]" />
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#45A1FD] rounded-full flex items-center justify-center">
                  <span style={{ fontSize: "8px", fontWeight: 700, color: "white" }}>{NOTIFICATIONS.length}</span>
                </div>
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl overflow-hidden"
                                style={{ width: 300, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", border: "1px solid #F3F4F6" }}>
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid #F7F7F8" }}>
                        <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>Notifikasi</p>
                      </div>
                      {NOTIFICATIONS.map(n => (
                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                             style={{ borderBottom: "1px solid #F7F7F8" }}>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                               style={{ backgroundColor: n.bg }}>
                            <n.icon size={14} style={{ color: n.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#1C1410", fontWeight: 500 }}>{n.text}</p>
                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF", marginTop: 2 }}>{n.time}</p>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-2.5 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>Lihat semua →</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Admin pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "#1C1410" }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)", fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "11px", color: "white" }}>
                {(session.name ?? "A").charAt(0)}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>{session.name ?? "Admin"}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <KpiCard icon={TrendingUp} color="#45A1FD" bg="#EBF5FF" border="#FED7AA"
                     label="Pendapatan Hari Ini" value="Rp 2.847.000" sub="↑ +12% vs kemarin" subColor="#059669" delay={0.05} />
            <KpiCard icon={Users} color="#7C3AED" bg="#F5F3FF" border="#DDD6FE"
                     label="Pengunjung Aktif" value={`${activeVisitors} orang`}
                     sub={`${activeTables} dari 14 meja terisi`} subColor="#7C3AED" delay={0.1} />
            <KpiCard icon={ShoppingCart} color="#DC2626" bg="#FEF2F2" border="#FECACA"
                     label="Pesanan Aktif" value="8 pesanan" sub="3 sedang disiapkan dapur" subColor="#DC2626" delay={0.15} />
            <KpiCard icon={Star} color="#D97706" bg="#FFFBEB" border="#FDE68A"
                     label="Rating Hari Ini" value="4.9 / 5" sub="⭐ dari 34 ulasan hari ini" subColor="#D97706" delay={0.2} />
          </div>

          {/* Chart + Orders */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-6">

            {/* Custom SVG Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
                        className="xl:col-span-3 bg-white rounded-2xl overflow-hidden"
                        style={{ border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F7F7F8" }}>
                <div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>Grafik Pendapatan</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>7 hari terakhir</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(69,161,253,0.25)" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>Pendapatan harian</span>
                </div>
              </div>
              <div className="px-5 pt-4 pb-2">
                <RevenueChart />
              </div>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #F7F7F8" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>Total 7 hari</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>
                  Rp {REVENUE_DATA.reduce((a, d) => a + d.revenue, 0).toLocaleString("id")}
                </span>
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                        className="xl:col-span-2 bg-white rounded-2xl overflow-hidden"
                        style={{ border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F7F7F8" }}>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>Pesanan Terkini</h3>
                <button className="flex items-center gap-1 cursor-pointer"
                        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>
                  Semua <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {RECENT_ORDERS.map((o, i) => (
                  <motion.div key={o.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + i * 0.06 }}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-[#FFF9F6] cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                         style={{ backgroundColor: o.statusBg }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700, color: o.statusColor }}>{o.table}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#1C1410" }}>{o.id}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: o.statusBg, color: o.statusColor }}>{o.status}</span>
                      </div>
                      <p className="truncate mt-0.5" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#6B4436" }}>{o.items}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#1C1410" }}>Rp {(o.total / 1000).toFixed(0)}k</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>{o.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floor plan */}
          <FloorPlan onSelect={setSelectedTable} />
        </div>
      </div>

      {/* Table side panel */}
      <AnimatePresence>
        {selectedTable && (
          <TableSidePanel table={selectedTable} onClose={() => setSelectedTable(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

