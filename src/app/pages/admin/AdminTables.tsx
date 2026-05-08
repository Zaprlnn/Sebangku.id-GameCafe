import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu as MenuIcon, Plus, Users, Timer, Gamepad2, ShoppingCart,
  X, Clock, ChevronDown, CheckCircle2, Wrench, UserCheck,
  Calendar, Search, RefreshCw, Bell, AlertCircle,
  Zap, Package2, Infinity as InfinityIcon, Hash,
  ArrowUpRight, TrendingUp, Eye,
} from "lucide-react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

// ─────────────────────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────────────────────

type TableStatus = "empty" | "occupied" | "full" | "reserved" | "maintenance";
type PackageType = "per-jam" | "flat" | "unlimited";

interface SessionData {
  id: string;
  tableId: string;
  tableNum: number;
  zone: string;
  capacity: number;
  member: string;
  guests: number;
  since: string;        // "HH:MM"
  game: string;
  pkg: PackageType;
  orderTotal: number;
  orders: number;
}

interface TableData {
  id: string;
  num: number;
  capacity: number;
  zone: string;
  reservedFor?: string;
  reservedAt?: string;
  maintenanceNote?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PACKAGE_INFO: Record<PackageType, { label: string; rate: number; unit: string; icon: React.ElementType; color: string; bg: string }> = {
  "per-jam":   { label: "Per Jam",    rate: 15_000, unit: "/jam/org", icon: Clock,         color: "#0284C7", bg: "#EFF6FF" },
  "flat":      { label: "Flat 3 Jam", rate: 35_000, unit: "/org",     icon: Package2,      color: "#7C3AED", bg: "#F5F3FF" },
  "unlimited": { label: "Unlimited",  rate: 50_000, unit: "/org",     icon: InfinityIcon,  color: "#059669", bg: "#ECFDF5" },
};

const STATUS_CFG: Record<TableStatus, { bg: string; text: string; border: string; dot: string; label: string; pulse?: boolean }> = {
  empty:       { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0", dot: "#22C55E", label: "Kosong" },
  occupied:    { bg: "#EBF5FF", text: "#9A3412", border: "#FED7AA", dot: "#45A1FD", label: "Terisi" },
  full:        { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA", dot: "#EF4444", label: "Penuh",  pulse: true },
  reserved:    { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE", dot: "#3B82F6", label: "Reservasi" },
  maintenance: { bg: "#F9FAFB", text: "#374151", border: "#E5E7EB", dot: "#9CA3AF", label: "Maintenance" },
};

const ALL_TABLES: TableData[] = [
  { id: "T-01", num: 1,  capacity: 2, zone: "Depan" },
  { id: "T-02", num: 2,  capacity: 2, zone: "Depan" },
  { id: "T-03", num: 3,  capacity: 4, zone: "Depan" },
  { id: "T-04", num: 4,  capacity: 4, zone: "Depan",    reservedFor: "Citra M.", reservedAt: "15:00" },
  { id: "T-05", num: 5,  capacity: 4, zone: "Tengah" },
  { id: "T-06", num: 6,  capacity: 4, zone: "Tengah" },
  { id: "T-07", num: 7,  capacity: 4, zone: "Tengah" },
  { id: "T-08", num: 8,  capacity: 4, zone: "Tengah" },
  { id: "T-09", num: 9,  capacity: 6, zone: "Belakang" },
  { id: "T-10", num: 10, capacity: 6, zone: "Belakang" },
  { id: "T-11", num: 11, capacity: 6, zone: "Belakang" },
  { id: "T-12", num: 12, capacity: 6, zone: "Belakang", maintenanceNote: "Kursi rusak — perbaikan Senin" },
  { id: "T-13", num: 13, capacity: 8, zone: "Private" },
  { id: "T-14", num: 14, capacity: 8, zone: "Private",  reservedFor: "Julia C. +7", reservedAt: "16:00" },
];

const INIT_STATUSES: Record<string, TableStatus> = {
  "T-01": "occupied", "T-02": "empty",  "T-03": "occupied", "T-04": "reserved",
  "T-05": "occupied", "T-06": "occupied","T-07": "full",     "T-08": "empty",
  "T-09": "full",     "T-10": "occupied","T-11": "empty",    "T-12": "maintenance",
  "T-13": "occupied", "T-14": "reserved",
};

const INIT_SESSIONS: SessionData[] = [
  { id: "SES-001", tableId: "T-01", tableNum: 1,  zone: "Depan",    capacity: 2, member: "Andi S.",     guests: 1, since: "11:30", game: "Catan",          pkg: "per-jam",   orderTotal: 78_000,  orders: 2 },
  { id: "SES-003", tableId: "T-03", tableNum: 3,  zone: "Depan",    capacity: 4, member: "Budi K. +3",  guests: 4, since: "12:15", game: "Uno",            pkg: "flat",      orderTotal: 156_000, orders: 4 },
  { id: "SES-005", tableId: "T-05", tableNum: 5,  zone: "Tengah",   capacity: 4, member: "Dian P. +2",  guests: 3, since: "13:00", game: "Jenga",          pkg: "per-jam",   orderTotal: 87_000,  orders: 3 },
  { id: "SES-006", tableId: "T-06", tableNum: 6,  zone: "Tengah",   capacity: 4, member: "Eko F. +3",   guests: 4, since: "12:45", game: "Codenames",      pkg: "flat",      orderTotal: 215_000, orders: 5 },
  { id: "SES-007", tableId: "T-07", tableNum: 7,  zone: "Tengah",   capacity: 4, member: "Fira A. +3",  guests: 4, since: "11:00", game: "Ticket to Ride", pkg: "unlimited", orderTotal: 312_000, orders: 6 },
  { id: "SES-009", tableId: "T-09", tableNum: 9,  zone: "Belakang", capacity: 6, member: "Gita H. +5",  guests: 6, since: "10:30", game: "Pandemic",       pkg: "unlimited", orderTotal: 478_000, orders: 8 },
  { id: "SES-010", tableId: "T-10", tableNum: 10, zone: "Belakang", capacity: 6, member: "Hadi L. +3",  guests: 4, since: "13:30", game: "Dixit",          pkg: "per-jam",   orderTotal: 134_000, orders: 3 },
  { id: "SES-013", tableId: "T-13", tableNum: 13, zone: "Private",  capacity: 8, member: "Ivan B. +6",  guests: 7, since: "13:15", game: "Sushi Go Party", pkg: "flat",      orderTotal: 567_000, orders: 7 },
];

const MOCK_GAMES = ["Catan", "Uno", "Jenga", "Codenames", "Ticket to Ride", "Pandemic", "Dixit", "Sushi Go Party", "Exploding Kittens", "7 Wonders", "Azul", "Dominion", "Coup", "Love Letter"];

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getDuration(since: string) {
  try {
    const [h, m] = since.split(":").map(Number);
    const now = new Date();
    const diff = now.getHours() * 60 + now.getMinutes() - (h * 60 + m);
    if (diff <= 0) return { hrs: 0, mins: 0, str: "-", totalMins: 0 };
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return { hrs, mins, str: hrs > 0 ? `${hrs}j ${mins}m` : `${mins}m`, totalMins: diff };
  } catch { return { hrs: 0, mins: 0, str: "-", totalMins: 0 }; }
}

function calcCost(pkg: PackageType, guests: number, totalMins: number): number {
  if (pkg === "per-jam") {
    const hours = Math.max(1, Math.ceil(totalMins / 60));
    return PACKAGE_INFO["per-jam"].rate * guests * hours;
  }
  return PACKAGE_INFO[pkg].rate * guests;
}

function fmtRp(n: number) { return "Rp " + n.toLocaleString("id"); }

// ─────────────────────────────────────────────────────────────────────────────
//  FLOOR CARD
// ─────────────────────────────────────────────────────────────────────────────

function FloorCard({
  table, status, session,
  onOpenSession, onViewSession, onCloseSession, onAddTime,
}: {
  table: TableData;
  status: TableStatus;
  session: SessionData | null;
  onOpenSession: (t: TableData) => void;
  onViewSession: (s: SessionData) => void;
  onCloseSession: (s: SessionData) => void;
  onAddTime: (s: SessionData) => void;
}) {
  const cfg = STATUS_CFG[status];
  const dur = session ? getDuration(session.since) : null;
  const pkgInfo = session ? PACKAGE_INFO[session.pkg] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -3 }}
      className="rounded-2xl flex flex-col overflow-hidden"
      style={{
        backgroundColor: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        minHeight: 160,
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between px-3.5 pt-3 pb-2">
        <div>
          <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "17px", color: "#1C1410", lineHeight: 1 }}>
            {table.id}
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#9CA3AF", marginTop: 2 }}>
            {table.zone} · {table.capacity} pax
          </p>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-2 h-2 rounded-full ${cfg.pulse ? "animate-pulse" : ""}`}
                style={{ backgroundColor: cfg.dot }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700, color: cfg.text }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 px-3.5 pb-3">
        {/* OCCUPIED / FULL */}
        {session && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)",
                            fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "10px", color: "white" }}>
                {session.member.charAt(0)}
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "#1C1410" }} className="truncate">
                {session.member}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Timer size={9} style={{ color: "#45A1FD", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#6B4436" }}>
                  {dur?.str} · mulai {session.since}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Gamepad2 size={9} style={{ color: "#7C3AED", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#6B7280" }} className="truncate">
                  {session.game}
                </span>
              </div>
              {pkgInfo && (
                <div className="flex items-center gap-1">
                  <pkgInfo.icon size={9} style={{ color: pkgInfo.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: pkgInfo.color }}>
                    {pkgInfo.label}
                  </span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#9CA3AF" }}>
                    · {fmtRp(calcCost(session.pkg, session.guests, dur?.totalMins ?? 0))}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <ShoppingCart size={9} style={{ color: "#059669", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#6B7280" }}>
                  {session.orders} pesanan · {fmtRp(session.orderTotal)}
                </span>
              </div>
            </div>
          </>
        )}

        {/* EMPTY */}
        {status === "empty" && (
          <div className="flex flex-col items-center justify-center py-3 gap-1">
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
              <Users size={14} style={{ color: "#22C55E" }} />
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>Tersedia</p>
          </div>
        )}

        {/* RESERVED */}
        {status === "reserved" && table.reservedFor && (
          <div className="bg-blue-50 rounded-xl p-2.5 mt-1" style={{ border: "1px solid #BFDBFE" }}>
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={9} style={{ color: "#3B82F6" }} />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700, color: "#1E40AF" }}>
                {table.reservedFor}
              </p>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#3B82F6" }}>
              Check-in pukul {table.reservedAt}
            </p>
          </div>
        )}

        {/* MAINTENANCE */}
        {status === "maintenance" && (
          <div className="flex items-start gap-1.5 mt-1">
            <Wrench size={10} style={{ color: "#9CA3AF", marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#6B7280" }}>
              {table.maintenanceNote ?? "Dalam perbaikan"}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-2.5 pb-2.5 flex gap-1.5 mt-auto">
        {session && (
          <>
            <button
              onClick={() => onViewSession(session)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ backgroundColor: "#EBF5FF", border: "1px solid #FED7AA" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FFE5D0")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#EBF5FF")}
            >
              <Eye size={10} style={{ color: "#45A1FD" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700, color: "#9A3412" }}>Detail</span>
            </button>
            <button
              onClick={() => onAddTime(session)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE9FE")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F5F3FF")}
            >
              <Plus size={10} style={{ color: "#7C3AED" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700, color: "#5B21B6" }}>Waktu</span>
            </button>
            <button
              onClick={() => onCloseSession(session)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
            >
              <CheckCircle2 size={10} style={{ color: "#EF4444" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700, color: "#991B1B" }}>Tutup</span>
            </button>
          </>
        )}
        {status === "empty" && (
          <button
            onClick={() => onOpenSession(table)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#DCFCE7")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F0FDF4")}
          >
            <Plus size={11} style={{ color: "#059669" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "#166534" }}>Buka Sesi</span>
          </button>
        )}
        {status === "reserved" && (
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#DBEAFE")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#EFF6FF")}
          >
            <UserCheck size={11} style={{ color: "#3B82F6" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "#1E40AF" }}>Check-In</span>
          </button>
        )}
        {status === "maintenance" && (
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
          >
            <CheckCircle2 size={11} style={{ color: "#6B7280" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "#374151" }}>Selesai</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SESSION ROW
// ─────────────────────────────────────────────────────────────────────────────

function SessionRow({ session, onCheckOut, onAddTime, onView }: {
  session: SessionData;
  onCheckOut: (s: SessionData) => void;
  onAddTime: (s: SessionData) => void;
  onView: (s: SessionData) => void;
}) {
  const dur = getDuration(session.since);
  const pkgInfo = PACKAGE_INFO[session.pkg];
  const sessionCost = calcCost(session.pkg, session.guests, dur.totalMins);
  const grand = sessionCost + session.orderTotal;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className="flex items-start gap-4 px-4 py-3.5 hover:bg-[#FFF9F6] transition-colors"
      style={{ borderBottom: "1px solid #F7F7F8" }}
    >
      {/* Table badge */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
           style={{ backgroundColor: "#EBF5FF", border: "1.5px solid #FED7AA" }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "13px", color: "#45A1FD" }}>
          {session.tableId}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
              {session.member} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>· {session.guests} tamu</span>
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF", marginTop: 1 }}>
              {session.zone} · Meja {session.tableNum}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>
              {fmtRp(grand)}
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#9CA3AF" }}>
              sesi + pesanan
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <Timer size={11} style={{ color: "#45A1FD" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>
              {dur.str}
            </span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
              · sejak {session.since}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Gamepad2 size={11} style={{ color: "#7C3AED" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#6B7280" }}>{session.game}</span>
          </div>
          <div className="flex items-center gap-1">
            <pkgInfo.icon size={11} style={{ color: pkgInfo.color }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 600, color: pkgInfo.color }}>
              {pkgInfo.label}
            </span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
              · {fmtRp(sessionCost)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingCart size={11} style={{ color: "#059669" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#6B7280" }}>
              {session.orders} pesanan · {fmtRp(session.orderTotal)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => onView(session)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
          >
            <Eye size={11} style={{ color: "#6B7280" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "#374151" }}>Detail</span>
          </button>
          <button
            onClick={() => onAddTime(session)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE9FE")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F5F3FF")}
          >
            <Plus size={11} style={{ color: "#7C3AED" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "#5B21B6" }}>Tambah Waktu</span>
          </button>
          <button
            onClick={() => onCheckOut(session)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: "#45A1FD", border: "1px solid #45A1FD" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#E04E12")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#45A1FD")}
          >
            <CheckCircle2 size={11} style={{ color: "white" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "white" }}>Check Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHECK OUT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function CheckOutModal({ session, onConfirm, onCancel }: {
  session: SessionData;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dur = getDuration(session.since);
  const pkgInfo = PACKAGE_INFO[session.pkg];
  const sessionCost = calcCost(session.pkg, session.guests, dur.totalMins);
  const grand = sessionCost + session.orderTotal;

  return (
    <>
      <motion.div key="co-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={onCancel}>
        <motion.div key="co-panel"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-sm"
          style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "20px", color: "#1C1410" }}>
                  Check Out Sesi
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: 2 }}>
                  {session.tableId} · {session.zone} · {session.guests} tamu
                </p>
              </div>
              <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Session summary */}
          <div className="px-6 py-4 space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center"
                   style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "16px", color: "#45A1FD" }}>
                {session.member.charAt(0)}
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>
                  {session.member}
                </p>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>
                    ⏱ {dur.str}
                  </span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>
                    🎲 {session.game}
                  </span>
                </div>
              </div>
            </div>

            {/* Billing breakdown */}
            {[
              { label: `Paket ${pkgInfo.label}`, value: sessionCost, detail: `${session.guests} tamu × ${fmtRp(pkgInfo.rate)} ${pkgInfo.unit}`, color: pkgInfo.color, bg: pkgInfo.bg },
              { label: "Pesanan Makanan/Minuman", value: session.orderTotal, detail: `${session.orders} item`, color: "#059669", bg: "#ECFDF5" },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between p-3 rounded-xl"
                   style={{ backgroundColor: row.bg }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 700, color: "#1C1410" }}>
                    {row.label}
                  </p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>{row.detail}</p>
                </div>
                <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "14px", color: row.color }}>
                  {fmtRp(row.value)}
                </p>
              </div>
            ))}

            {/* Grand total */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl mt-2"
                 style={{ background: "linear-gradient(135deg,#1C1410,#2D1E17)" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "white" }}>
                Total Pembayaran
              </p>
              <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "20px", color: "#82C2FF" }}>
                {fmtRp(grand)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onCancel}
                    className="flex-1 py-3 rounded-2xl cursor-pointer transition-colors"
                    style={{ backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F3F4F6")}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#374151" }}>Batal</span>
            </button>
            <button onClick={onConfirm}
                    className="flex-1 py-3 rounded-2xl cursor-pointer transition-colors"
                    style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "white" }}>
                ✓ Konfirmasi Check Out
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADD TIME MODAL
// ─────────────────────────────────────────────────────────────────────────────

function AddTimeModal({ session, onConfirm, onCancel }: {
  session: SessionData;
  onConfirm: (mins: number) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState(60);
  const OPTIONS = [{ mins: 30, label: "+30 Menit" }, { mins: 60, label: "+1 Jam" }, { mins: 120, label: "+2 Jam" }];

  return (
    <motion.div key="at-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onCancel}>
      <motion.div key="at-panel"
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className="bg-white rounded-3xl p-6 w-full max-w-xs"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "18px", color: "#1C1410" }}>
            Tambah Waktu
          </h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
            <X size={14} className="text-gray-500" />
          </button>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#9CA3AF", marginBottom: 16 }}>
          {session.tableId} · {session.member} · sesi {getDuration(session.since).str}
        </p>
        <div className="flex flex-col gap-2 mb-5">
          {OPTIONS.map(opt => (
            <button key={opt.mins}
                    onClick={() => setSelected(opt.mins)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all"
                    style={{
                      backgroundColor: selected === opt.mins ? "#EBF5FF" : "#F9FAFB",
                      border: `2px solid ${selected === opt.mins ? "#45A1FD" : "#E5E7EB"}`,
                    }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "14px",
                             color: selected === opt.mins ? "#45A1FD" : "#1C1410" }}>
                {opt.label}
              </span>
              {selected === opt.mins && <CheckCircle2 size={16} style={{ color: "#45A1FD" }} />}
            </button>
          ))}
        </div>
        <button onClick={() => onConfirm(selected)}
                className="w-full py-3 rounded-2xl cursor-pointer"
                style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "white" }}>
            Tambah Waktu
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  OPEN SESSION PANEL
// ─────────────────────────────────────────────────────────────────────────────

function OpenSessionPanel({ initialTableId, allTables, statuses, onSubmit, onClose }: {
  initialTableId?: string;
  allTables: TableData[];
  statuses: Record<string, TableStatus>;
  onSubmit: (data: { tableId: string; guestName: string; guests: number; pkg: PackageType; game: string }) => void;
  onClose: () => void;
}) {
  const emptyTables = allTables.filter(t => statuses[t.id] === "empty");

  const [tableId, setTableId]       = useState(initialTableId ?? (emptyTables[0]?.id ?? ""));
  const [guestName, setGuestName]   = useState("");
  const [guests, setGuests]         = useState(1);
  const [pkg, setPkg]               = useState<PackageType>("per-jam");
  const [game, setGame]             = useState("");
  const [gameSearch, setGameSearch] = useState("");
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [success, setSuccess]       = useState(false);

  const selectedTable = allTables.find(t => t.id === tableId);
  const pkgInfo = PACKAGE_INFO[pkg];
  const estimatedCost = pkg === "per-jam"
    ? guests * PACKAGE_INFO["per-jam"].rate * 2   // default 2 jam
    : guests * PACKAGE_INFO[pkg].rate;

  const filteredGames = MOCK_GAMES.filter(g => g.toLowerCase().includes(gameSearch.toLowerCase()));

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!tableId) errs.table = "Pilih meja terlebih dahulu";
    if (!guestName.trim()) errs.name = "Nama tamu wajib diisi";
    if (!game) errs.game = "Pilih game yang akan dimainkan";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSuccess(true);
    setTimeout(() => {
      onSubmit({ tableId, guestName, guests, pkg, game });
    }, 800);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="fixed right-0 top-0 h-full bg-white z-50 flex flex-col overflow-hidden"
        style={{ width: "min(420px, 100vw)", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
             style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] flex items-center justify-center">
              <Plus size={16} style={{ color: "#45A1FD" }} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "17px", color: "#1C1410" }}>
                Buka Sesi Manual
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF" }}>
                {emptyTables.length} meja tersedia
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Success state */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center gap-4">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle2 size={40} style={{ color: "#22C55E" }} />
              </motion.div>
              <div className="text-center">
                <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "22px", color: "#1C1410" }}>
                  Sesi Dibuka!
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#9CA3AF", marginTop: 4 }}>
                  {tableId} · {guestName} · {guests} tamu
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">

            {/* Pilih Meja */}
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#374151", display: "block", marginBottom: 6 }}>
                Pilih Meja <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div className="relative">
                <select value={tableId} onChange={e => setTableId(e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl cursor-pointer"
                        style={{
                          fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#1C1410",
                          backgroundColor: "#F9FAFB", border: `1.5px solid ${errors.table ? "#EF4444" : "#E5E7EB"}`,
                          outline: "none",
                        }}>
                  {emptyTables.length === 0 && <option value="">Tidak ada meja tersedia</option>}
                  {emptyTables.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.id} — {t.zone} ({t.capacity} pax)
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
              </div>
              {selectedTable && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF", marginTop: 4 }}>
                  Zona {selectedTable.zone} · Kapasitas {selectedTable.capacity} orang
                </p>
              )}
              {errors.table && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#EF4444", marginTop: 3 }}>{errors.table}</p>}
            </div>

            {/* Nama Tamu */}
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#374151", display: "block", marginBottom: 6 }}>
                Nama Tamu / Member <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                <input
                  type="text" value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Nama tamu atau ID member..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl"
                  style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#1C1410",
                    backgroundColor: "#F9FAFB", border: `1.5px solid ${errors.name ? "#EF4444" : "#E5E7EB"}`,
                    outline: "none",
                  }}
                />
              </div>
              {errors.name && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#EF4444", marginTop: 3 }}>{errors.name}</p>}
            </div>

            {/* Jumlah Tamu */}
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#374151", display: "block", marginBottom: 6 }}>
                Jumlah Tamu
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                        style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "18px", color: "#1C1410" }}>
                  −
                </button>
                <div className="flex-1 text-center py-2 rounded-xl"
                     style={{ backgroundColor: "#EBF5FF", border: "1.5px solid #FED7AA" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "18px", color: "#45A1FD" }}>
                    {guests}
                  </span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF", marginLeft: 4 }}>
                    orang
                  </span>
                </div>
                <button onClick={() => setGuests(g => Math.min(selectedTable?.capacity ?? 8, g + 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                        style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "18px", color: "#1C1410" }}>
                  +
                </button>
              </div>
            </div>

            {/* Game */}
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#374151", display: "block", marginBottom: 6 }}>
                Game yang Dimainkan <span style={{ color: "#EF4444" }}>*</span>
              </label>
              {game ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                     style={{ backgroundColor: "#F5F3FF", border: "1.5px solid #DDD6FE" }}>
                  <Gamepad2 size={14} style={{ color: "#7C3AED" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#5B21B6", flex: 1 }}>
                    {game}
                  </span>
                  <button onClick={() => setGame("")} className="cursor-pointer">
                    <X size={13} style={{ color: "#9CA3AF" }} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                    <input
                      type="text" value={gameSearch}
                      onChange={e => setGameSearch(e.target.value)}
                      placeholder="Cari game..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl"
                      style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#1C1410",
                        backgroundColor: "#F9FAFB", border: `1.5px solid ${errors.game ? "#EF4444" : "#E5E7EB"}`,
                        outline: "none",
                      }}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto rounded-xl" style={{ border: "1px solid #F3F4F6" }}>
                    {filteredGames.slice(0, 6).map(g => (
                      <button key={g} onClick={() => { setGame(g); setGameSearch(""); }}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#EBF5FF] cursor-pointer transition-colors text-left"
                              style={{ borderBottom: "1px solid #F7F7F8" }}>
                        <Gamepad2 size={11} style={{ color: "#9CA3AF" }} />
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#1C1410" }}>{g}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {errors.game && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#EF4444", marginTop: 3 }}>{errors.game}</p>}
            </div>

            {/* Paket Sesi */}
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#374151", display: "block", marginBottom: 8 }}>
                Paket Sesi
              </label>
              <div className="space-y-2">
                {(Object.entries(PACKAGE_INFO) as [PackageType, typeof PACKAGE_INFO[PackageType]][]).map(([key, info]) => (
                  <button key={key} onClick={() => setPkg(key)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-left"
                          style={{
                            backgroundColor: pkg === key ? info.bg : "#F9FAFB",
                            border: `2px solid ${pkg === key ? info.color : "#E5E7EB"}`,
                          }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                         style={{ backgroundColor: pkg === key ? "white" : "#F3F4F6" }}>
                      <info.icon size={14} style={{ color: info.color }} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px",
                                  color: pkg === key ? info.color : "#1C1410" }}>
                        {info.label}
                      </p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                        {fmtRp(info.rate)} {info.unit}
                      </p>
                    </div>
                    {pkg === key && <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: info.color }}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimasi Biaya */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F3F4F6" }}>
              <div className="px-4 py-3" style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "11px",
                            color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Estimasi Biaya
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#6B7280" }}>
                    {guests} tamu × {pkgInfo.label}
                    {pkg === "per-jam" && " (est. 2 jam)"}
                  </span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#1C1410" }}>
                    {fmtRp(estimatedCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#6B7280" }}>
                    Makanan & Minuman
                  </span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#9CA3AF" }}>
                    Belum ada pesanan
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
                    Est. Total
                  </span>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#45A1FD" }}>
                    {fmtRp(estimatedCost)}
                  </span>
                </div>
                {pkg === "per-jam" && (
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                    * Dihitung berdasarkan durasi aktual saat check out
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid #F3F4F6" }}>
          <button
            onClick={handleSubmit}
            disabled={emptyTables.length === 0}
            className="w-full py-3.5 rounded-2xl cursor-pointer transition-opacity"
            style={{ background: emptyTables.length === 0 ? "#E5E7EB" : "linear-gradient(135deg,#45A1FD,#82C2FF)" }}
          >
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "14px",
                           color: emptyTables.length === 0 ? "#9CA3AF" : "white" }}>
              Buka Sesi Sekarang
            </span>
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const ZONES_ORDER = ["Depan", "Tengah", "Belakang", "Private"];
const ZONE_EMOJI: Record<string, string> = { Depan: "🚪", Tengah: "☕", Belakang: "🎮", Private: "🔒" };

export default function AdminTablesPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu]         = useState(false);
  const [sessions, setSessions]             = useState<SessionData[]>(INIT_SESSIONS);
  const [statuses, setStatuses]             = useState<Record<string, TableStatus>>(INIT_STATUSES);
  const [filterStatus, setFilterStatus]     = useState<TableStatus | "all">("all");
  const [showForm, setShowForm]             = useState(false);
  const [formInitTable, setFormInitTable]   = useState<string | undefined>();
  const [checkOutSes, setCheckOutSes]       = useState<SessionData | null>(null);
  const [addTimeSes, setAddTimeSes]         = useState<SessionData | null>(null);
  const [, setTick]                         = useState(0);
  const [toast, setToast]                   = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("sbk_admin_session")) navigate("/admin", { replace: true });
  }, [navigate]);

  // Live tick every 60s for duration updates
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Actions
  const handleOpenSession = useCallback((data: { tableId: string; guestName: string; guests: number; pkg: PackageType; game: string }) => {
    const table = ALL_TABLES.find(t => t.id === data.tableId)!;
    const newSes: SessionData = {
      id: `SES-${Date.now()}`,
      tableId: data.tableId,
      tableNum: table.num,
      zone: table.zone,
      capacity: table.capacity,
      member: data.guestName,
      guests: data.guests,
      since: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      game: data.game,
      pkg: data.pkg,
      orderTotal: 0,
      orders: 0,
    };
    setSessions(p => [...p, newSes]);
    setStatuses(p => ({ ...p, [data.tableId]: data.guests >= table.capacity ? "full" : "occupied" }));
    setShowForm(false);
    showToast(`✅ Sesi dibuka — ${data.tableId} · ${data.guestName}`);
  }, [showToast]);

  const handleCheckOut = useCallback((ses: SessionData) => {
    setSessions(p => p.filter(s => s.id !== ses.id));
    setStatuses(p => ({ ...p, [ses.tableId]: "empty" }));
    setCheckOutSes(null);
    showToast(`✅ ${ses.tableId} telah check out — ${ses.member}`);
  }, [showToast]);

  const handleAddTime = useCallback((ses: SessionData, mins: number) => {
    // In a real app this would extend the billing period
    setAddTimeSes(null);
    showToast(`⏱ +${mins}m ditambahkan ke ${ses.tableId}`);
  }, [showToast]);

  const openFormForTable = useCallback((table: TableData) => {
    setFormInitTable(table.id);
    setShowForm(true);
  }, []);

  // Filtered tables
  const filteredTables = filterStatus === "all"
    ? ALL_TABLES
    : ALL_TABLES.filter(t => statuses[t.id] === filterStatus);

  // Stats
  const occupied  = Object.values(statuses).filter(s => s === "occupied" || s === "full").length;
  const empty     = Object.values(statuses).filter(s => s === "empty").length;
  const reserved  = Object.values(statuses).filter(s => s === "reserved").length;

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
              <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "17px", color: "#1C1410" }}>
                Meja & Sesi
              </h1>
              <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
                {occupied} terisi · {empty} kosong · {reserved} reservasi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Stats pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {[
                { label: `${occupied} Terisi`, color: "#45A1FD", bg: "#EBF5FF" },
                { label: `${empty} Kosong`,    color: "#22C55E", bg: "#F0FDF4" },
              ].map(s => (
                <span key={s.label} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: s.bg, color: s.color }}>
                  {s.label}
                </span>
              ))}
            </div>
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ translateY: -2 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
              style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)", boxShadow: "0 2px 8px rgba(69,161,253,0.35)" }}
            >
              <Plus size={14} style={{ color: "white" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "white" }}>
                Buka Sesi
              </span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6">

          {/* ── FLOOR PLAN ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl overflow-hidden"
                      style={{ border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            {/* Floor plan header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                 style={{ borderBottom: "1px solid #F7F7F8" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] flex items-center justify-center">
                  <span style={{ fontSize: 13 }}>🪑</span>
                </div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>
                  Denah Meja
                </h2>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F3F4F6" }}>
                {(["all", "empty", "occupied", "full", "reserved", "maintenance"] as const).map(f => {
                  const labels: Record<string, string> = { all: "Semua", empty: "Kosong", occupied: "Terisi", full: "Penuh", reserved: "Rsv.", maintenance: "Maint." };
                  return (
                    <button key={f} onClick={() => setFilterStatus(f)}
                            className="px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                            style={{
                              fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700,
                              backgroundColor: filterStatus === f ? "white" : "transparent",
                              color: filterStatus === f ? "#1C1410" : "#9CA3AF",
                              boxShadow: filterStatus === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                            }}>
                      {labels[f]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone grids */}
            <div className="p-5 space-y-6">
              {ZONES_ORDER.map(zone => {
                const zoneTables = filteredTables.filter(t => t.zone === zone);
                if (zoneTables.length === 0) return null;
                return (
                  <div key={zone}>
                    <div className="flex items-center gap-2 mb-3">
                      <span style={{ fontSize: 12 }}>{ZONE_EMOJI[zone]}</span>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "10px",
                                  color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Zona {zone}
                      </p>
                      <div className="flex-1 h-px bg-gray-100" />
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                        {zoneTables.filter(t => statuses[t.id] === "occupied" || statuses[t.id] === "full").length}/{zoneTables.length} terisi
                      </span>
                    </div>
                    <div className={`grid gap-3 ${zone === "Private" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
                      {zoneTables.map((table, i) => (
                        <motion.div key={table.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.04 }}>
                          <FloorCard
                            table={table}
                            status={statuses[table.id]}
                            session={sessions.find(s => s.tableId === table.id) ?? null}
                            onOpenSession={openFormForTable}
                            onViewSession={s => {
                              // Scroll to sessions panel
                              document.getElementById("active-sessions")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            onCloseSession={s => setCheckOutSes(s)}
                            onAddTime={s => setAddTimeSes(s)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── ACTIVE SESSIONS ───────────────────────────────────── */}
          <motion.div id="active-sessions"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden"
                      style={{ border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F7F7F8" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] flex items-center justify-center">
                  <Clock size={13} style={{ color: "#45A1FD" }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>
                    Sesi Aktif
                  </h2>
                </div>
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: "#EBF5FF", color: "#45A1FD" }}>
                  {sessions.length}
                </span>
              </div>
              {/* Summary */}
              <div className="hidden sm:flex items-center gap-4">
                {[
                  { label: "Total Tamu", value: sessions.reduce((a, s) => a + s.guests, 0), icon: Users, color: "#7C3AED" },
                  { label: "Total Omzet", value: fmtRp(sessions.reduce((a, s) => a + s.orderTotal + calcCost(s.pkg, s.guests, getDuration(s.since).totalMins), 0)), icon: TrendingUp, color: "#059669" },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <stat.icon size={13} style={{ color: stat.color }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "#1C1410" }}>
                      {stat.value}
                    </span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="text-4xl">🪑</div>
                <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#1C1410" }}>
                  Belum ada sesi aktif
                </p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#9CA3AF" }}>
                  Buka sesi baru untuk memulai
                </p>
                <button onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer"
                        style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)" }}>
                  <Plus size={14} style={{ color: "white" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "12px", color: "white" }}>Buka Sesi</span>
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {[...sessions]
                  .sort((a, b) => getDuration(a.since).totalMins - getDuration(b.since).totalMins > 0 ? -1 : 1)
                  .map(ses => (
                    <SessionRow
                      key={ses.id}
                      session={ses}
                      onCheckOut={s => setCheckOutSes(s)}
                      onAddTime={s => setAddTimeSes(s)}
                      onView={() => {}}
                    />
                  ))
                }
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>

      {/* Open Session Panel */}
      <AnimatePresence>
        {showForm && (
          <OpenSessionPanel
            initialTableId={formInitTable}
            allTables={ALL_TABLES}
            statuses={statuses}
            onSubmit={handleOpenSession}
            onClose={() => { setShowForm(false); setFormInitTable(undefined); }}
          />
        )}
      </AnimatePresence>

      {/* Check Out Modal */}
      <AnimatePresence>
        {checkOutSes && (
          <CheckOutModal
            session={checkOutSes}
            onConfirm={() => handleCheckOut(checkOutSes)}
            onCancel={() => setCheckOutSes(null)}
          />
        )}
      </AnimatePresence>

      {/* Add Time Modal */}
      <AnimatePresence>
        {addTimeSes && (
          <AddTimeModal
            session={addTimeSes}
            onConfirm={mins => handleAddTime(addTimeSes, mins)}
            onCancel={() => setAddTimeSes(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-[100] pointer-events-none"
            style={{ transform: "translateX(-50%)" }}
          >
            <div className="px-5 py-3 rounded-2xl text-sm font-bold"
                 style={{
                   fontFamily: "'DM Sans',sans-serif",
                   background: "linear-gradient(135deg,#1C1410,#2D1E17)",
                   color: "white",
                   boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                   whiteSpace: "nowrap",
                 }}>
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

