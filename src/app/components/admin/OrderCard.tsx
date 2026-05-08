import { motion } from "motion/react";
import { Clock, ChevronRight, CheckCircle2, XCircle, Users } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED TYPES (imported by OrderDetail & AdminOrders)
// ─────────────────────────────────────────────────────────────────────────────

export type OrderStatus = "baru" | "diproses" | "siap" | "diantar" | "selesai";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  note?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableNum: number;
  zone: string;
  member: string;
  memberLevel: string;
  memberLevelColor: string;
  memberPoin: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;   // "HH:MM"
  minutesAgo: number;
  pointsEarned: number;
}

// ─────────────────────────────────────────────────────────────────────────────
//  STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_CFG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  baru:     { label: "Baru",     color: "#45A1FD", bg: "#EBF5FF", border: "#FED7AA", dot: "#45A1FD" },
  diproses: { label: "Diproses", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE", dot: "#3B82F6" },
  siap:     { label: "Siap",     color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC", dot: "#22C55E" },
  diantar:  { label: "Diantar",  color: "#0284C7", bg: "#E0F2FE", border: "#7DD3FC", dot: "#0EA5E9" },
  selesai:  { label: "Selesai",  color: "#6B7280", bg: "#F3F4F6", border: "#E5E7EB", dot: "#9CA3AF" },
};

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function fmtRp(n: number) {
  return "Rp " + n.toLocaleString("id");
}

export function timeAgo(mins: number) {
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  return `${Math.floor(mins / 60)} jam ${mins % 60}m lalu`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ORDER CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function OrderCard({
  order,
  isSelected,
  onSelect,
  onAccept,
  onReject,
}: {
  order: Order;
  isSelected: boolean;
  onSelect: (o: Order) => void;
  onAccept: (o: Order) => void;
  onReject: (o: Order) => void;
}) {
  const cfg = STATUS_CFG[order.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      whileHover={{ translateY: -3 }}
      onClick={() => onSelect(order)}
      className="rounded-2xl cursor-pointer"
      style={{
        backgroundColor: isSelected ? "#EBF5FF" : "white",
        border: `1.5px solid ${isSelected ? "#45A1FD" : "#F0F0F0"}`,
        boxShadow: isSelected
          ? "0 6px 24px rgba(69,161,253,0.15)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      {/* ── Card header ── */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{
              fontFamily: "'Fraunces',serif",
              fontWeight: 900,
              fontSize: "14px",
              color: "#1C1410",
            }}
          >
            #{order.id}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "11px",
              color: "#9CA3AF",
            }}
          >
            · Meja {order.tableNum} · {order.zone}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              backgroundColor: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${order.status === "baru" ? "animate-pulse" : ""}`}
              style={{ backgroundColor: cfg.dot }}
            />
            {cfg.label}
          </span>
          <ChevronRight
            size={13}
            style={{ color: isSelected ? "#45A1FD" : "#D1D5DB" }}
          />
        </div>
      </div>

      {/* ── Time + member ── */}
      <div className="flex items-center gap-3 px-4 mb-3">
        <div className="flex items-center gap-1">
          <Clock size={11} style={{ color: "#9CA3AF" }} />
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "10px",
              color: "#9CA3AF",
            }}
          >
            {timeAgo(order.minutesAgo)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={11} style={{ color: "#6B4436" }} />
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              color: "#6B4436",
            }}
          >
            {order.member}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              backgroundColor: order.memberLevelColor + "20",
              color: order.memberLevelColor,
            }}
          >
            {order.memberLevel}
          </span>
        </div>
      </div>

      {/* ── Items preview ── */}
      <div className="px-4 mb-3 space-y-1">
        {order.items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-2">
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "12px",
                color: "#374151",
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontWeight: 700, color: "#45A1FD" }}>
                {item.qty}×
              </span>{" "}
              {item.name}
              {item.note && (
                <span style={{ color: "#9CA3AF" }}> · "{item.note}"</span>
              )}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "11px",
                color: "#6B7280",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {fmtRp(item.price * item.qty)}
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "10px",
              color: "#9CA3AF",
            }}
          >
            +{order.items.length - 3} item lainnya...
          </p>
        )}
      </div>

      {/* ── Footer: total + action buttons ── */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-b-2xl"
        style={{
          backgroundColor: isSelected ? "rgba(69,161,253,0.05)" : "#FAFAFA",
          borderTop: `1px solid ${isSelected ? "rgba(69,161,253,0.12)" : "#F3F4F6"}`,
        }}
      >
        <p
          style={{
            fontFamily: "'Fraunces',serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "#1C1410",
          }}
        >
          {fmtRp(order.total)}
        </p>

        {order.status === "baru" && (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(order);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
              style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FEE2E2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#FEF2F2")
              }
            >
              <XCircle size={12} style={{ color: "#EF4444" }} />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#991B1B",
                }}
              >
                Tolak
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept(order);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
              style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#DCFCE7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#F0FDF4")
              }
            >
              <CheckCircle2 size={12} style={{ color: "#22C55E" }} />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#166534",
                }}
              >
                Terima
              </span>
            </button>
          </div>
        )}

        {order.status !== "baru" && (
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "10px",
              color: isSelected ? "#45A1FD" : "#9CA3AF",
              fontWeight: isSelected ? 700 : 400,
            }}
          >
            {isSelected ? "Dipilih →" : "Klik untuk detail →"}
          </span>
        )}
      </div>
    </motion.div>
  );
}

