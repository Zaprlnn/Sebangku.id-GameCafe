import { motion, AnimatePresence } from "motion/react";
import {
  X, Star, ChevronRight, CheckCircle2,
  Utensils, Truck, Clock, RotateCw,
  ShoppingBag, Zap,
} from "lucide-react";
import { Order, OrderStatus, STATUS_CFG, fmtRp, timeAgo } from "./OrderCard";

// ─────────────────────────────────────────────────────────────────────────────
//  STATUS FLOW CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE_STEPS: {
  key: OrderStatus | "diterima";
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { key: "diterima", label: "Diterima",   icon: CheckCircle2, color: "#22C55E" },
  { key: "diproses", label: "Diproses",   icon: RotateCw,     color: "#3B82F6" },
  { key: "siap",     label: "Siap",       icon: Utensils,     color: "#16A34A" },
  { key: "diantar",  label: "Diantarkan", icon: Truck,        color: "#0284C7" },
];

function getTimelineProgress(status: OrderStatus): number {
  const map: Record<OrderStatus, number> = {
    baru: 0, diproses: 1, siap: 2, diantar: 3, selesai: 4,
  };
  return map[status];
}

// ─────────────────────────────────────────────────────────────────────────────
//  NEXT-STATUS ACTION CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const NEXT_ACTION: Record<
  OrderStatus,
  { label: string; nextStatus: OrderStatus | null; color: string; bg: string } | null
> = {
  baru:     { label: "Terima & Proses", nextStatus: "diproses", color: "#16A34A", bg: "linear-gradient(135deg,#22C55E,#16A34A)" },
  diproses: { label: "Tandai Siap",     nextStatus: "siap",     color: "#16A34A", bg: "linear-gradient(135deg,#4ADE80,#22C55E)" },
  siap:     { label: "Kirim ke Meja",   nextStatus: "diantar",  color: "#0284C7", bg: "linear-gradient(135deg,#38BDF8,#0284C7)" },
  diantar:  { label: "Tandai Selesai",  nextStatus: "selesai",  color: "#6B7280", bg: "linear-gradient(135deg,#9CA3AF,#6B7280)" },
  selesai:  null,
};

// ─────────────────────────────────────────────────────────────────────────────
//  EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

export function OrderDetailEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ backgroundColor: "#EBF5FF", border: "2px dashed #FED7AA" }}
      >
        <ShoppingBag size={32} style={{ color: "#45A1FD" }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p
          style={{
            fontFamily: "'Fraunces',serif",
            fontWeight: 700,
            fontSize: "17px",
            color: "#1C1410",
          }}
        >
          Pilih Pesanan
        </p>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "12px",
            color: "#9CA3AF",
            marginTop: 4,
          }}
        >
          Klik kartu pesanan di kiri untuk melihat detail
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN ORDER DETAIL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function OrderDetail({
  order,
  onClose,
  onStatusChange,
  onReject,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onReject: (orderId: string) => void;
}) {
  const cfg = STATUS_CFG[order.status];
  const progress = getTimelineProgress(order.status);
  const nextAction = NEXT_ACTION[order.status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={order.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="flex flex-col h-full"
      >
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid #F3F4F6" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 900,
                  fontSize: "20px",
                  color: "#1C1410",
                }}
              >
                #{order.id}
              </span>
              <span
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  border: `1.5px solid ${cfg.border}`,
                }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${order.status === "baru" ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: cfg.dot }}
                />
                {cfg.label}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "12px",
                color: "#9CA3AF",
              }}
            >
              Meja {order.tableNum} · {order.zone} · {timeAgo(order.minutesAgo)}
            </p>
          </div>
          {/* Close/Back button — always visible */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-colors shrink-0"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
          >
            <X size={14} className="text-gray-500" />
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6B7280",
              }}
            >
              Tutup
            </span>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Member info */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #F5F5F6" }}>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: "10px",
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Info Member
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg,#45A1FD,#82C2FF)",
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 700,
                  fontSize: "17px",
                  color: "white",
                }}
              >
                {order.member.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#1C1410",
                    }}
                  >
                    {order.member}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      backgroundColor: order.memberLevelColor + "20",
                      color: order.memberLevelColor,
                    }}
                  >
                    {order.memberLevel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={11} style={{ color: "#F59E0B" }} />
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "11px",
                      color: "#9CA3AF",
                    }}
                  >
                    {order.memberPoin.toLocaleString("id")} poin ·{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#059669",
                    }}
                  >
                    <Zap
                      size={10}
                      style={{ display: "inline", marginRight: 2 }}
                    />
                    +{order.pointsEarned} poin dari pesanan ini
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #F5F5F6" }}>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: "10px",
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Status Pesanan
            </p>
            <div className="flex items-center gap-0">
              {TIMELINE_STEPS.map((step, i) => {
                const done = progress > i;
                const active = progress === i + 1 || (i === 0 && progress >= 1);
                const isDone = (i === 0 && progress >= 1) || (i > 0 && progress > i);
                const isActive = !isDone && progress === i + 1;
                const isFuture = progress <= i && !(i === 0 && progress >= 1);

                return (
                  <div key={step.key} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={
                          isDone
                            ? { scale: 1, backgroundColor: step.color }
                            : isActive
                            ? { scale: [1, 1.1, 1] }
                            : { scale: 1 }
                        }
                        transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: isDone
                            ? step.color
                            : isActive
                            ? step.color + "20"
                            : "#F3F4F6",
                          border: `2px solid ${
                            isDone ? step.color : isActive ? step.color : "#E5E7EB"
                          }`,
                        }}
                      >
                        <step.icon
                          size={14}
                          style={{
                            color: isDone
                              ? "white"
                              : isActive
                              ? step.color
                              : "#D1D5DB",
                          }}
                        />
                      </motion.div>
                      <p
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "9px",
                          fontWeight: isDone || isActive ? 700 : 400,
                          color: isDone
                            ? step.color
                            : isActive
                            ? step.color
                            : "#D1D5DB",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step.label}
                      </p>
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div
                        className="flex-1 h-0.5 mb-4 mx-1"
                        style={{
                          backgroundColor: progress > i + 1 || (i === 0 && progress >= 2)
                            ? step.color
                            : "#E5E7EB",
                          transition: "background-color 0.4s",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #F5F5F6" }}>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: "10px",
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Item Pesanan
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "#FAFAFA", border: "1px solid #F3F4F6" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#EBF5FF" }}
                  >
                    <span
                      style={{
                        fontFamily: "'Fraunces',serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: "#45A1FD",
                      }}
                    >
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#1C1410",
                      }}
                    >
                      {item.name}
                    </p>
                    {item.note && (
                      <p
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "10px",
                          color: "#9CA3AF",
                          marginTop: 1,
                        }}
                      >
                        📝 {item.note}
                      </p>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Fraunces',serif",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#1C1410",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {fmtRp(item.price * item.qty)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Sub total */}
            <div
              className="flex items-center justify-between mt-3 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "11px",
                  color: "#9CA3AF",
                }}
              >
                {order.items.reduce((s, i) => s + i.qty, 0)} item
              </p>
              <p
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#6B7280",
                }}
              >
                Subtotal:{" "}
                <span style={{ color: "#1C1410", fontSize: "15px" }}>
                  {fmtRp(order.total)}
                </span>
              </p>
            </div>
          </div>

          {/* Jam pesanan */}
          <div className="px-5 py-3" style={{ borderBottom: "1px solid #F5F5F6" }}>
            <div className="flex items-center gap-2">
              <Clock size={12} style={{ color: "#9CA3AF" }} />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "11px",
                  color: "#9CA3AF",
                }}
              >
                Pesanan masuk pukul {order.createdAt} WIB
              </span>
            </div>
          </div>
        </div>

        {/* ── Action buttons (sticky footer) ── */}
        <div
          className="shrink-0 px-5 py-4"
          style={{ borderTop: "1px solid #F3F4F6" }}
        >
          {order.status === "baru" && (
            <div className="flex gap-3">
              <button
                onClick={() => onReject(order.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl cursor-pointer transition-colors"
                style={{ backgroundColor: "#FEF2F2", border: "1.5px solid #FECACA" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FEE2E2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FEF2F2")
                }
              >
                <X size={15} style={{ color: "#EF4444" }} />
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#991B1B",
                  }}
                >
                  Tolak Pesanan
                </span>
              </button>
              <button
                onClick={() =>
                  nextAction?.nextStatus &&
                  onStatusChange(order.id, nextAction.nextStatus)
                }
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl cursor-pointer"
                style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <CheckCircle2 size={15} style={{ color: "white" }} />
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "white",
                  }}
                >
                  Terima & Proses
                </span>
              </button>
            </div>
          )}

          {nextAction && order.status !== "baru" && order.status !== "selesai" && (
            <button
              onClick={() =>
                nextAction.nextStatus &&
                onStatusChange(order.id, nextAction.nextStatus)
              }
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl cursor-pointer"
              style={{ background: nextAction.bg }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <ChevronRight size={16} style={{ color: "white" }} />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "white",
                }}
              >
                {nextAction.label}
              </span>
            </button>
          )}

          {order.status === "selesai" && (
            <div
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1.5px solid #BBF7D0",
              }}
            >
              <CheckCircle2 size={16} style={{ color: "#22C55E" }} />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#166534",
                }}
              >
                Pesanan Selesai
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

